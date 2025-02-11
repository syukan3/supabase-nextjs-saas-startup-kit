CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('general','bug','feature')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- RLS (Row Level Security) を有効化
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 全件取得は管理者のみ等にしたい場合は、ポリシーを調整してください。
-- 例：ユーザー本人は自分が投稿した feedback のみ SELECT/UPDATE できるようにする
CREATE POLICY "Only owner can select own feedback"
  ON feedback
  FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Only owner can insert own feedback"
  ON feedback
  FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Only owner can update own feedback"
  ON feedback
  FOR UPDATE
  USING ( auth.uid() = user_id );

-- 監査トリガーの設定
CREATE TRIGGER set_audit_columns_feedback
  BEFORE INSERT OR UPDATE
  ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.set_audit_columns();
