-- 通知テーブルの作成
-- ユーザーごとの通知情報を管理するテーブル
CREATE TABLE IF NOT EXISTS notifications (
  -- 通知の一意識別子
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- 通知の受信者となるユーザーID（usersテーブルを参照）
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- 通知のタイトル
  title TEXT NOT NULL,
  -- 通知の本文メッセージ
  message TEXT NOT NULL,
  -- 通知の種類（info: 一般情報, alert: 警告, payment: 支払い関連など）
  type TEXT NOT NULL DEFAULT 'info',  -- 'info', 'alert', 'payment', etc.
  -- 既読フラグ
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  -- レコード作成日時
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  -- レコード更新日時
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Row Level Security (RLS)の有効化
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 自身の通知を閲覧するためのポリシー
CREATE POLICY "Only owner can select own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- 自身の通知を作成するためのポリシー
CREATE POLICY "Only owner can insert own notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自身の通知を更新するためのポリシー
CREATE POLICY "Only owner can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 監査トリガー
-- レコードの作成日時と更新日時を自動的に設定
CREATE TRIGGER set_audit_columns_notifications
  BEFORE INSERT OR UPDATE
  ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_audit_columns();
