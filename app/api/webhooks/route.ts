import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const signature = request.headers.get("stripe-signature") || "";
  const supabase = createRouteHandlerClient({ cookies });

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // Webhookイベントを保存
  const { error: webhookError } = await supabase
    .from("stripe_webhook_events")
    .insert({
      event_id: event.id,
      event_type: event.type,
      event_data: event,
    });

  if (webhookError) {
    console.error("Webhook save error:", webhookError);
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

        // サブスクリプション情報をDBに保存
        const { error: subscriptionError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: session.metadata?.supabase_user_id,
            stripe_subscription_id: subscription.id,
            plan_id: subscription.metadata?.plan_id,
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });

        if (subscriptionError) {
          console.error("Subscription save error:", subscriptionError);
          return NextResponse.json(
            { error: "Failed to save subscription" },
            { status: 500 }
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // サブスクリプション情報を更新
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
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
          })
          .eq("stripe_subscription_id", subscription.id);

        if (updateError) {
          console.error("Subscription update error:", updateError);
          return NextResponse.json(
            { error: "Failed to update subscription" },
            { status: 500 }
          );
        }
        break;
      }

      case "invoice.created":
      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        if (event.type === "invoice.created") {
          // 新規請求書を作成
          const { error: invoiceError } = await supabase.from("invoices").insert({
            user_id: invoice.customer as string,
            subscription_id: invoice.subscription,
            stripe_invoice_id: invoice.id,
            amount_due: invoice.amount_due,
            amount_paid: invoice.amount_paid,
            amount_remaining: invoice.amount_remaining,
            currency: invoice.currency,
            status: invoice.status,
            pdf_url: invoice.invoice_pdf,
            hosted_invoice_url: invoice.hosted_invoice_url,
          });

          if (invoiceError) {
            console.error("Invoice save error:", invoiceError);
            return NextResponse.json(
              { error: "Failed to save invoice" },
              { status: 500 }
            );
          }

          // 請求書の明細行を保存
          const lineItems = invoice.lines.data;
          for (const item of lineItems) {
            const { error: itemError } = await supabase
              .from("invoice_items")
              .insert({
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
              });

            if (itemError) {
              console.error("Invoice item save error:", itemError);
              return NextResponse.json(
                { error: "Failed to save invoice item" },
                { status: 500 }
              );
            }
          }
        } else {
          // 請求書のステータスを更新
          const { error: updateError } = await supabase
            .from("invoices")
            .update({
              status: invoice.status,
              amount_paid: invoice.amount_paid,
              amount_remaining: invoice.amount_remaining,
              paid_at:
                event.type === "invoice.paid"
                  ? new Date().toISOString()
                  : null,
            })
            .eq("stripe_invoice_id", invoice.id);

          if (updateError) {
            console.error("Invoice update error:", updateError);
            return NextResponse.json(
              { error: "Failed to update invoice" },
              { status: 500 }
            );
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
} 