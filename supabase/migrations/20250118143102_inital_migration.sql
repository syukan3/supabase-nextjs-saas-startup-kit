-- Enable UUID extension (必要に応じて有効化)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------
-- 1) users テーブル (既存の例, 必要に応じて取り込み)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deleted')),
    email TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT UNIQUE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

--------------------------------------------------------
-- 2) subscription_plans テーブル (既存の例)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deleted')),
    name TEXT NOT NULL,
    stripe_price_id TEXT NOT NULL UNIQUE,
    interval TEXT NOT NULL CHECK (interval IN ('day', 'week', 'month', 'year')),
    interval_count INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    trial_period_days INTEGER,
    features JSONB,
    metadata JSONB,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

--------------------------------------------------------
-- 3) subscriptions テーブル (既存の例)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (
      status IN (
        'trialing', 
        'active', 
        'canceled', 
        'incomplete', 
        'incomplete_expired', 
        'past_due', 
        'unpaid', 
        'paused'
      )
    ),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

--------------------------------------------------------
-- 4) stripe_webhook_events テーブル
-- Webhook で受信したイベントを記録するテーブル
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deleted')),
    event_id TEXT NOT NULL UNIQUE,              -- Stripe上の event.id (例: evt_xxx)
    event_type TEXT NOT NULL,                  -- イベントタイプ (ex: invoice.created, charge.succeeded, etc.)
    event_data JSONB,                          -- Stripe から受け取った payload 全体
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

--------------------------------------------------------
-- 5) invoices テーブル
-- Stripe の請求書情報をローカルに保存
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT NOT NULL UNIQUE,     -- Stripe Invoice ID (例: in_xxx)
    amount_due BIGINT,                          -- 請求金額 (整数で保存; Stripeの最小単位: cents)
    amount_paid BIGINT,                         -- 支払済み金額
    amount_remaining BIGINT,                    -- 未払い額
    currency TEXT,                              -- ISO通貨コード (例: "usd")
    status TEXT CHECK (
      status IN (
        'draft', 
        'open', 
        'paid', 
        'uncollectible', 
        'void'
      )
    ),
    pdf_url TEXT,                               -- Invoice PDF を参照するURL
    hosted_invoice_url TEXT,                    -- Stripe上のインボイス閲覧URL
    metadata JSONB,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    paid_at TIMESTAMP WITH TIME ZONE           -- 支払完了日時 (オプション)
);

--------------------------------------------------------
-- 6) invoice_items テーブル
-- Invoice の明細行を管理 (Line Items)
--------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deleted')),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT,                           -- 明細の説明文
    quantity INTEGER,
    unit_amount BIGINT,                         -- 単価 (cents)
    currency TEXT,                              -- ISO通貨コード
    period_start TIMESTAMP WITH TIME ZONE,      -- 対象期間の開始 (従量課金など)
    period_end TIMESTAMP WITH TIME ZONE,        -- 対象期間の終了
    proration BOOLEAN DEFAULT FALSE,            -- 調整(プロレーション)がかかった明細かどうか
    metadata JSONB,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    updated_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

--------------------------------------------------------
-- Row Level Security やポリシーの設定(既存と同様)
--------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert their own record" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow users to update their own record" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow public read-only access" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON stripe_webhook_events FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON invoice_items FOR SELECT USING (true);

--------------------------------------------------------
-- インデックス例
--------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON stripe_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- 監査用トリガーの設定 (created_by, updated_by)
-- 監査用のトリガー関数を作成
CREATE OR REPLACE FUNCTION public.set_audit_columns()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by := COALESCE(NEW.created_by, auth.uid());
    NEW.updated_by := auth.uid();
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルに対してトリガーを作成
CREATE TRIGGER set_audit_columns_users
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION public.set_audit_columns();

CREATE TRIGGER set_audit_columns_subscription_plans
BEFORE INSERT OR UPDATE ON subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.set_audit_columns();

CREATE TRIGGER set_audit_columns_subscriptions
BEFORE INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.set_audit_columns();

CREATE TRIGGER set_audit_columns_stripe_webhook_events
BEFORE INSERT OR UPDATE ON stripe_webhook_events
FOR EACH ROW
EXECUTE FUNCTION public.set_audit_columns();

CREATE TRIGGER set_audit_columns_invoices
BEFORE INSERT OR UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION public.set_audit_columns();

CREATE TRIGGER set_audit_columns_invoice_items
BEFORE INSERT OR UPDATE ON invoice_items
FOR EACH ROW
EXECUTE FUNCTION public.set_audit_columns();
