-- =====================================================
-- PHARMACY PLATFORM - STAFF & ADMIN ACCOUNT SETUP
-- =====================================================
-- This SQL creates staff and admin accounts for the pharmacy platform
-- Run this in your Supabase SQL Editor
--
-- RECOMMENDED APPROACH:
-- 1. Create users in Supabase Dashboard > Authentication > Users
-- 2. Then run the staff table inserts below
-- =====================================================

-- Enable the required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- STEP 1: Create auth users via Supabase Dashboard
-- =====================================================
-- Go to: Authentication > Users > Add User (Manual)
-- Create these accounts:
--
-- 1. Admin: admin@pharmacy.com / Admin@123456
-- 2. Manager: manager@pharmacy.com / Manager@123456
-- 3. Staff: staff@pharmacy.com / Staff@123456
--
-- After creating them in the dashboard, run STEP 2 below
-- =====================================================

-- =====================================================
-- STEP 2: Link auth users to staff table
-- =====================================================
-- Run this AFTER creating users in dashboard

-- Link ADMIN account
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
  'admin@pharmacy.com',
  'System Administrator',
  'admin',
  '+231-000-0000',
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

-- Link MANAGER account
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
  'manager@pharmacy.com',
  'Pharmacy Manager',
  'manager',
  '+231-000-0000',
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

-- Link STAFF account
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
  'staff@pharmacy.com',
  'Staff Member',
  'staff',
  '+231-000-0000',
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

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the accounts were linked successfully
-- =====================================================

-- Check auth users
SELECT
  id,
  email,
  email_confirmed_at,
  created_at
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
