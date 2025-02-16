import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { logger } from '@/lib/logger'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: Request) {
  try {
    // createClient を利用して Supabase クライアントを作成
    const supabase = await createClient();

    // セッションの取得
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { planId } = await request.json();

    // planId に基づいて DB から stripe_price_id と metadata を取得
    const { data: planData, error: planError } = await supabase
      .from("subscription_plans")
      .select("stripe_price_id, metadata")
      .eq("id", planId)
      .single();

    if (planError || !planData) {
      return NextResponse.json(
        { error: "プランが見つかりません" },
        { status: 404 }
      );
    }

    // メタデータの存在チェック
    if (!planData.metadata?.price || !planData.metadata?.currency) {
      return NextResponse.json(
        { error: "プランのメタデータが不正です" },
        { status: 400 }
      );
    }

    // ユーザーの stripe_customer_id を取得
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", session.user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "ユーザー情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    let stripeCustomerId = userData?.stripe_customer_id;

    // stripe_customer_id がない場合は新規作成
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          supabase_user_id: session.user.id,
        },
      });
      stripeCustomerId = customer.id;

      // ユーザーテーブルを更新
      await supabase
        .from("users")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", session.user.id);
    }

    // Checkout セッションを作成
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: planData.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: new URL("/dashboard", process.env.NEXT_PUBLIC_SITE_URL).toString() + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: new URL("/subscription", process.env.NEXT_PUBLIC_SITE_URL).toString(),
      subscription_data: {
        metadata: {
          supabase_user_id: session.user.id,
          plan_id: planId,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    logger.error('Error creating checkout session', error instanceof Error ? error : new Error('Unknown error'))
    return NextResponse.json(
      { error: "チェックアウトセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
