-- 通知設定テーブルの作成
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- 各フィードバックに自動生成される一意の識別子を割り当て
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE, -- のユーザーID。ユーザー削除時に連動して削除
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_emails BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  sms_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  notification_frequency TEXT NOT NULL DEFAULT 'daily'
    CHECK (notification_frequency IN ('realtime', 'daily', 'weekly')),
  created_by UUID REFERENCES users(id) ON DELETE CASCADE, -- レコード作成者のユーザーID（監査用）
  updated_by UUID REFERENCES users(id) ON DELETE CASCADE, -- レコード更新者のユーザーID（監査用）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Row Level Security (RLS) の有効化
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- SELECTポリシー: ユーザー自身のみが自分の通知設定を閲覧可能
CREATE POLICY "Users can view their own notification settings"
  ON notification_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERTポリシー: 認証済みユーザーは自分の通知設定を作成可能
CREATE POLICY "Authenticated users can insert their own notification settings"
  ON notification_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATEポリシー: ユーザー自身のみが自分の通知設定を更新可能
CREATE POLICY "Users can update their own notification settings"
  ON notification_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 監査トリガーの設定:
-- レコード挿入または更新時に、自動的に audit カラム (created_by, updated_by など) を設定するトリガーを作成
CREATE TRIGGER set_audit_columns_notification_settings
  BEFORE INSERT OR UPDATE
  ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_audit_columns();
