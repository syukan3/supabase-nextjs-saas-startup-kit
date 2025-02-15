-- ユーザー設定テーブルの作成
-- ユーザーごとの設定情報を保存するテーブル
CREATE TABLE IF NOT EXISTS user_settings (
  -- ユーザーIDを主キーとして設定し、usersテーブルを参照
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- メール通知の有効/無効設定（デフォルトは有効）
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  -- マーケティングメールの受信設定（デフォルトは無効）
  marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
  -- テーマ設定（light/dark/system のいずれか）
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light','dark','system')),
  -- 言語設定（デフォルトは英語）
  language TEXT DEFAULT 'en',
  -- 通知設定の詳細情報（JSONBで柔軟に設定可能）
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  -- レコード作成日時
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  -- レコード更新日時
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Row Level Security (RLS)の有効化
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 自身の設定を閲覧するためのポリシー
CREATE POLICY "Users can view their own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- 自身の設定を作成するためのポリシー
CREATE POLICY "Users can insert their own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自身の設定を更新するためのポリシー
CREATE POLICY "Users can update their own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 監査トリガー（任意）
-- レコードの作成日時と更新日時を自動的に設定
CREATE TRIGGER set_audit_columns_user_settings
  BEFORE INSERT OR UPDATE
  ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_audit_columns();
