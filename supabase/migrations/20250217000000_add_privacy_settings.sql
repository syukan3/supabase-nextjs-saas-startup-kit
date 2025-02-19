-- プライバシー設定テーブルの作成
CREATE TABLE IF NOT EXISTS privacy_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deleted')),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE,
  profile_visibility TEXT NOT NULL DEFAULT 'public'
    CHECK (profile_visibility IN ('public', 'private', 'friends')),
  activity_tracking BOOLEAN NOT NULL DEFAULT TRUE,
  data_sharing BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  updated_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id, status)
);

-- Row Level Security (RLS) の有効化
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;

-- SELECTポリシー: ユーザー自身のみが自分のプライバシー設定を閲覧可能
CREATE POLICY "Users can view their own privacy settings"
  ON privacy_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERTポリシー: 認証済みユーザーは自分のプライバシー設定を作成可能
CREATE POLICY "Authenticated users can insert their own privacy settings"
  ON privacy_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATEポリシー: ユーザー自身のみが自分のプライバシー設定を更新可能
CREATE POLICY "Users can update their own privacy settings"
  ON privacy_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 監査トリガーの設定
CREATE TRIGGER set_audit_columns_privacy_settings
  BEFORE INSERT OR UPDATE
  ON privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_audit_columns(); 