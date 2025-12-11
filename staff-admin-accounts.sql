-- =====================================================
-- PHARMACY PLATFORM - STAFF & ADMIN ACCOUNT SETUP
-- =====================================================
-- This SQL creates staff and admin accounts for the pharmacy platform
-- Run this in your Supabase SQL Editor
--
-- IMPORTANT: Change the passwords and email addresses before running!
-- =====================================================

-- Enable the required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- METHOD 1: Create accounts using Supabase Auth Admin API
-- =====================================================
-- NOTE: This method creates both the auth user AND staff record
-- You can run this directly in Supabase SQL Editor
-- =====================================================

-- ADMIN ACCOUNT
-- Email: admin@pharmacy.com (CHANGE THIS!)
-- Password: Admin@123456 (CHANGE THIS!)
-- Role: admin
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@pharmacy.com', -- CHANGE THIS EMAIL
  crypt('Admin@123456', gen_salt('bf')), -- CHANGE THIS PASSWORD
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"System Administrator"}',
  now(),
  now(),
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Insert admin into staff table
-- NOTE: Replace the UUID below with the one returned from the above query
INSERT INTO public.staff (
  id,
  email,
  full_name,
  role,
  phone,
  is_active,
  created_at
)
SELECT
  id,
  'admin@pharmacy.com', -- Must match email above
  'System Administrator',
  'admin',
  '+231-XXX-XXXX', -- CHANGE THIS PHONE NUMBER
  true,
  now()
FROM auth.users
WHERE email = 'admin@pharmacy.com'
ON CONFLICT (email) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active;


-- STAFF ACCOUNT (Regular Staff)
-- Email: staff@pharmacy.com (CHANGE THIS!)
-- Password: Staff@123456 (CHANGE THIS!)
-- Role: staff
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'staff@pharmacy.com', -- CHANGE THIS EMAIL
  crypt('Staff@123456', gen_salt('bf')), -- CHANGE THIS PASSWORD
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Staff Member"}',
  now(),
  now(),
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Insert staff into staff table
INSERT INTO public.staff (
  id,
  email,
  full_name,
  role,
  phone,
  is_active,
  created_at
)
SELECT
  id,
  'staff@pharmacy.com', -- Must match email above
  'Staff Member',
  'staff',
  '+231-XXX-XXXX', -- CHANGE THIS PHONE NUMBER
  true,
  now()
FROM auth.users
WHERE email = 'staff@pharmacy.com'
ON CONFLICT (email) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active;


-- MANAGER ACCOUNT (Optional)
-- Email: manager@pharmacy.com (CHANGE THIS!)
-- Password: Manager@123456 (CHANGE THIS!)
-- Role: manager
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'manager@pharmacy.com', -- CHANGE THIS EMAIL
  crypt('Manager@123456', gen_salt('bf')), -- CHANGE THIS PASSWORD
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Pharmacy Manager"}',
  now(),
  now(),
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Insert manager into staff table
INSERT INTO public.staff (
  id,
  email,
  full_name,
  role,
  phone,
  is_active,
  created_at
)
SELECT
  id,
  'manager@pharmacy.com', -- Must match email above
  'Pharmacy Manager',
  'manager',
  '+231-XXX-XXXX', -- CHANGE THIS PHONE NUMBER
  true,
  now()
FROM auth.users
WHERE email = 'manager@pharmacy.com'
ON CONFLICT (email) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active;


-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the accounts were created successfully
-- =====================================================

-- Check auth users
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data->>'full_name' as full_name
FROM auth.users
WHERE email IN ('admin@pharmacy.com', 'staff@pharmacy.com', 'manager@pharmacy.com')
ORDER BY email;

-- Check staff records
SELECT
  id,
  email,
  full_name,
  role,
  phone,
  is_active,
  created_at
FROM public.staff
WHERE email IN ('admin@pharmacy.com', 'staff@pharmacy.com', 'manager@pharmacy.com')
ORDER BY
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'manager' THEN 2
    WHEN 'staff' THEN 3
  END;


-- =====================================================
-- ALTERNATIVE METHOD 2: Using Supabase Dashboard
-- =====================================================
-- If the above SQL doesn't work, you can create users via:
-- 1. Supabase Dashboard > Authentication > Users > Add User
-- 2. Enter email and password
-- 3. Then run ONLY the staff table INSERT below:
-- =====================================================

-- EXAMPLE: After creating user in dashboard, run this:
/*
INSERT INTO public.staff (
  id,
  email,
  full_name,
  role,
  phone,
  is_active,
  created_at
)
SELECT
  id,
  'YOUR_EMAIL_HERE',
  'Full Name Here',
  'admin', -- or 'staff' or 'manager'
  '+231-XXX-XXXX',
  true,
  now()
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE'
ON CONFLICT (email) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active;
*/


-- =====================================================
-- DEFAULT LOGIN CREDENTIALS (REMEMBER TO CHANGE!)
-- =====================================================
/*
ADMIN ACCOUNT:
Email: admin@pharmacy.com
Password: Admin@123456
Role: Full system access

MANAGER ACCOUNT:
Email: manager@pharmacy.com
Password: Manager@123456
Role: Inventory + orders management

STAFF ACCOUNT:
Email: staff@pharmacy.com
Password: Staff@123456
Role: Orders + prescriptions only

⚠️ SECURITY WARNING:
These are default credentials for initial setup only.
CHANGE THESE IMMEDIATELY after first login!

Login at: https://your-domain.com/auth/staff-login
*/
