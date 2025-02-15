-- 既存の user_settings テーブルに、新しく privacy_preferences カラムを追加する例

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS privacy_preferences JSONB DEFAULT '{}'::jsonb;

-- すでにRLSは有効になっている前提。
-- 利用ユーザーが自分自身のレコードを読み書きできれば、プライバシー設定も同様に操作可能になります。
