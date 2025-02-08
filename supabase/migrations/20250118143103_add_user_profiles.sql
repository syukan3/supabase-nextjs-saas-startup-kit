-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
    ON user_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON user_profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Enable RLS for storage
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
