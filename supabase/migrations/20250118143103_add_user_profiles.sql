-- ユーザープロフィールテーブルの作成
-- ユーザー固有のプロフィール情報（フルネーム、表示名、アバターURL、自己紹介、ウェブサイトなど）を保存するためのテーブルです。
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  -- auth.usersテーブルとの参照。ユーザー削除時に連動して削除されます。
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deleted')),
    full_name TEXT,      -- ユーザーのフルネーム
    display_name TEXT,   -- ユーザーが表示する名前
    avatar_url TEXT,     -- アバター画像のURL
    bio TEXT,            -- ユーザーの自己紹介文
    website TEXT,        -- ウェブサイトのURL
    created_by UUID REFERENCES users(id) ON DELETE CASCADE, -- レコード作成者のユーザーID（監査用）
    updated_by UUID REFERENCES users(id) ON DELETE CASCADE, -- レコード更新者のユーザーID（監査用）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),  -- 作成日時（UTC）
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())   -- 更新日時（UTC）
);

-- Row Level Security (RLS) を有効化し、ユーザーごとのアクセス制御を実施
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 個別のRLSポリシーの作成
-- ユーザー自身のみが自身のプロフィールを閲覧可能とするポリシー
CREATE POLICY "Users can view their own profile" 
    ON user_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

-- ユーザー自身のみが自身のプロフィールを更新できるポリシー
CREATE POLICY "Users can update their own profile" 
    ON user_profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

-- ユーザー自身のみが自身のプロフィールを作成できるポリシー
CREATE POLICY "Users can insert their own profile" 
    ON user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- アバター用のストレージバケットを作成
-- ここでは「avatars」という名前の公開バケットを作成します。
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- アバター画像に対するストレージオブジェクトのRLSポリシー作成
-- 誰でもアバター画像を閲覧できるようにするためのポリシー
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

-- ユーザー自身が自分のアバター画像をアップロードできるようにするポリシー
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ユーザー自身が自分のアバター画像を更新できるようにするポリシー
CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ユーザー自身が自分のアバター画像を削除できるようにするポリシー
CREATE POLICY "Users can delete their own avatar"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
