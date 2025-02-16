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
