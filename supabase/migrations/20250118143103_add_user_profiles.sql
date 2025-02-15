-- ユーザープロファイルテーブルの作成
-- ユーザーの基本情報を格納するテーブル
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- auth.usersテーブルと紐付け
    full_name TEXT,      -- フルネーム
    display_name TEXT,   -- 表示名
    avatar_url TEXT,     -- アバター画像のURL
    bio TEXT,            -- 自己紹介
    website TEXT,        -- ウェブサイト
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()), -- レコード作成日時
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())  -- レコード更新日時
);

-- Row Level Security (RLS)を有効化
-- セキュリティのため、行レベルでのアクセス制御を実施
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- セキュリティポリシーの作成
-- プロファイルの閲覧ポリシー：自分のプロファイルのみ閲覧可能
CREATE POLICY "Users can view their own profile" 
    ON user_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

-- プロファイルの更新ポリシー：自分のプロファイルのみ更新可能
CREATE POLICY "Users can update their own profile" 
    ON user_profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

-- プロファイルの作成ポリシー：自分のプロファイルのみ作成可能
CREATE POLICY "Users can insert their own profile" 
    ON user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- アバター画像用のストレージバケットを作成
-- publicをtrueに設定し、画像への公開アクセスを許可
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- ストレージのRLSポリシーを設定
-- アバター画像の公開閲覧ポリシー：全ユーザーが閲覧可能
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

-- アバター画像のアップロードポリシー：自分のフォルダにのみアップロード可能
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- アバター画像の更新ポリシー：自分の画像のみ更新可能
CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- アバター画像の削除ポリシー：自分の画像のみ削除可能
CREATE POLICY "Users can delete their own avatar"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
