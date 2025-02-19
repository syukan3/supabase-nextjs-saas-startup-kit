-- フィードバックテーブルおよびそのアクセス制御、監査トリガーの設定を以下に行います

-- feedbackテーブルの作成:
-- ユーザーからのフィードバック情報（ID、ユーザーID、タイプ、内容、監査情報）を保存します
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- 各フィードバックに自動生成される一意の識別子を割り当て
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deleted')),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE, -- フィードバック投稿者のユーザーID。ユーザー削除時に連動して削除
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('general','bug','feature')), -- フィードバックの種類は 'general', 'bug', 'feature' のいずれかに制限
  content TEXT NOT NULL, -- フィードバックの内容を格納
  created_by UUID REFERENCES users(id) ON DELETE CASCADE, -- レコード作成者のユーザーID（監査用）
  updated_by UUID REFERENCES users(id) ON DELETE CASCADE, -- レコード更新者のユーザーID（監査用）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()), -- レコード作成日時（UTCタイムゾーン）
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())  -- レコード更新日時（UTCタイムゾーン）
);

-- Row Level Security (RLS) の有効化:
-- 各ユーザーが自分自身のフィードバックのみアクセスできるように制御を強化します
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- SELECTポリシーの設定:
-- ユーザー本人のみが自分のフィードバックを閲覧できるように制限
CREATE POLICY "Only owner can select own feedback"
  ON feedback
  FOR SELECT
  USING ( auth.uid() = user_id );

-- INSERTポリシーの設定:
-- 認証済み（ログイン済み）のユーザーは新規フィードバックを投稿可能にする
CREATE POLICY "Authenticated users can insert feedback"
  ON feedback
  FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

-- UPDATEポリシーの設定:
-- フィードバックの更新は、投稿者自身のみが行えるように制限
CREATE POLICY "Only owner can update own feedback"
  ON feedback
  FOR UPDATE
  USING ( auth.uid() = user_id );

-- 監査トリガーの設定:
-- レコード挿入または更新時に、自動的に audit カラム (created_by, updated_by など) を設定するトリガーを作成
CREATE TRIGGER set_audit_columns_feedback
  BEFORE INSERT OR UPDATE
  ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.set_audit_columns();
