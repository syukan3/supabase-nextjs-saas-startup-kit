import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from '@/utils/supabase/server';
import { logger } from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
});

// 重複イベントを処理するためのヘルパー関数
async function upsertWebhookEvent(supabase: any, event: Stripe.Event) {
  const { data, error } = await supabase
    .from("stripe_webhook_events")
    .upsert(
      {
        event_id: event.id,
        event_type: event.type,
        event_data: event,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "event_id",
        ignoreDuplicates: false,
      }
    )
    .select();

  return { data, error };
}

// サブスクリプション情報を更新するヘルパー関数
async function upsertSubscription(
  supabase: any,
  subscription: Stripe.Subscription,
  userId?: string
) {
  // サブスクリプションアイテムから最新のpriceIdを取得
  const updatedPriceId = subscription.items.data[0].price?.id;

  // subscription_plansテーブルから対応するplan_idを取得
  let localPlanId = null;
  if (updatedPriceId) {
    const { data: planRecord } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("stripe_price_id", updatedPriceId)
      .single();

    localPlanId = planRecord?.id;
  }

  const subscriptionData = {
    user_id: userId,
    stripe_subscription_id: subscription.id,
    plan_id: localPlanId,
    status: subscription.status,
    current_period_start: new Date(
      subscription.current_period_start * 1000
    ).toISOString(),
    current_period_end: new Date(
      subscription.current_period_end * 1000
    ).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("subscriptions")
    .upsert(subscriptionData, {
      onConflict: "stripe_subscription_id",
      ignoreDuplicates: false,
    });

  return error;
}

// 請求書情報を更新するヘルパー関数
async function upsertInvoice(
  supabase: any,
  invoice: Stripe.Invoice,
  userId?: string,
  subscriptionId?: string
) {
  const invoiceData = {
    user_id: userId,
    subscription_id: subscriptionId,
    stripe_invoice_id: invoice.id,
    amount_due: invoice.amount_due,
    amount_paid: invoice.amount_paid,
    amount_remaining: invoice.amount_remaining,
    currency: invoice.currency,
    status: invoice.status,
    pdf_url: invoice.invoice_pdf,
    hosted_invoice_url: invoice.hosted_invoice_url,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("invoices").upsert(invoiceData, {
    onConflict: "stripe_invoice_id",
    ignoreDuplicates: false,
  });

  return error;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const signature = request.headers.get("stripe-signature") || "";

  // createClient を使用して Supabase クライアントを生成
  const supabase = await createClient();

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    logger.error('Webhook signature verification error', err instanceof Error ? err : new Error(err.message))
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // Webhookイベントを保存（重複チェック付き）
  const { error: webhookError } = await upsertWebhookEvent(supabase, event);

  if (webhookError) {
    logger.error('Webhook event save error', webhookError)
    return NextResponse.json(
      { error: "Failed to save webhook event" },
      { status: 500 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const error = await upsertSubscription(
          supabase,
          subscription,
          session.metadata?.supabase_user_id
        );

        if (error) {
          logger.error('Subscription save error', error)
          return NextResponse.json(
            { error: "Failed to save subscription" },
            { status: 500 }
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.created":
      case "customer.subscription.resumed":
      case "customer.subscription.paused": {
        const subscription = event.data.object as Stripe.Subscription;
        const error = await upsertSubscription(supabase, subscription);

        if (error) {
          logger.error('Subscription save error', error)
          return NextResponse.json(
            { error: "Failed to update subscription" },
            { status: 500 }
          );
        }
        break;
      }

      case "invoice.created":
      case "invoice.paid":
      case "invoice.payment_failed":
      case "invoice.finalized":
      case "invoice.marked_uncollectible":
      case "invoice.voided":
      case "invoice.updated": {
        const invoice = event.data.object as Stripe.Invoice;

        // ユーザー情報の取得
        const stripeCustomerId = invoice.customer as string;
        const { data: userRecord, error: userRecordError } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", stripeCustomerId)
          .single();

        if (userRecordError) {
          logger.error('User not found for stripe_customer_id', new Error(), { stripeCustomerId })
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // サブスクリプション情報の取得
        const stripeSubscriptionId = invoice.subscription as string;
        let subscriptionRecord = null;
        if (stripeSubscriptionId) {
          const { data: subRecord, error: subRecordError } = await supabase
            .from("subscriptions")
            .select("id")
            .eq("stripe_subscription_id", stripeSubscriptionId)
            .single();

          if (!subRecordError) {
            subscriptionRecord = subRecord;
          }
        }

        // 請求書の保存/更新
        const error = await upsertInvoice(
          supabase,
          invoice,
          userRecord?.id,
          subscriptionRecord?.id
        );

        if (error) {
          logger.error('Invoice save/update error', error)
          return NextResponse.json(
            { error: "Failed to save/update invoice" },
            { status: 500 }
          );
        }

        // 請求書の明細行を保存（新規作成時のみ）
        if (event.type === "invoice.created") {
          const lineItems = invoice.lines.data;
          for (const item of lineItems) {
            const { error: itemError } = await supabase
              .from("invoice_items")
              .upsert(
                {
                  invoice_id: invoice.id,
                  description: item.description,
                  quantity: item.quantity,
                  unit_amount: item.amount,
                  currency: item.currency,
                  period_start: item.period?.start
                    ? new Date(item.period.start * 1000).toISOString()
                    : null,
                  period_end: item.period?.end
                    ? new Date(item.period.end * 1000).toISOString()
                    : null,
                  proration: item.proration,
                  updated_at: new Date().toISOString(),
                },
                {
                  onConflict: "invoice_id,description",
                  ignoreDuplicates: false,
                }
              );

            if (itemError) {
              logger.error('Invoice item save error', itemError)
              return NextResponse.json(
                { error: "Failed to save invoice item" },
                { status: 500 }
              );
            }
          }
        }
        break;
      }

      default:
        logger.info('Unhandled event type', { eventType: event.type })
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    logger.error('Webhook handler error', err instanceof Error ? err : new Error('Unknown error'))
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}
