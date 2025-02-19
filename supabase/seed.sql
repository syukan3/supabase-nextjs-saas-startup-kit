INSERT INTO users (
  id,
  email,
  stripe_customer_id,
  created_by,
  updated_by,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',  -- システムユーザーの固定ID
  'system@example.com',                    -- システムユーザーのメールアドレス
  NULL,                                    -- stripe_customer_id（任意）
  '00000000-0000-0000-0000-000000000000',    -- created_by（自分自身を参照）
  '00000000-0000-0000-0000-000000000000',    -- updated_by（自分自身を参照）
  TIMEZONE('utc', NOW()),                  -- created_at: 現在のUTC時刻
  TIMEZONE('utc', NOW())                   -- updated_at: 現在のUTC時刻
)
ON CONFLICT (id) DO NOTHING; 

-- Insert system user's notification settings
INSERT INTO notification_settings (
  user_id,
  email_notifications,
  marketing_emails,
  push_notifications,
  sms_notifications,
  notification_frequency,
  created_by,
  updated_by,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- システムユーザーのID
  TRUE,                                  -- email_notifications
  TRUE,                                  -- marketing_emails
  FALSE,                                 -- push_notifications
  FALSE,                                 -- sms_notifications
  'daily',                               -- notification_frequency
  '00000000-0000-0000-0000-000000000000', -- created_by
  '00000000-0000-0000-0000-000000000000', -- updated_by
  TIMEZONE('utc', NOW()),                -- created_at
  TIMEZONE('utc', NOW())                 -- updated_at
)
ON CONFLICT (user_id) DO NOTHING; 
