# Pharmacy Platform - Deployment Guide

This guide walks you through deploying the pharmacy platform to Vercel and setting up Supabase.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Supabase account (your existing project at https://hodtdxxjgnjfwvwzzbrn.supabase.co)
- Git installed on your computer

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if you haven't already
# Windows: winget install GitHub.cli
# Then authenticate
gh auth login

# Create the repository
gh repo create pharmacy-platform --private --source=. --remote=origin --push
```

### Option B: Using GitHub Website

1. Go to https://github.com/new
2. Repository name: `pharmacy-platform`
3. Choose **Private** (recommended for production code)
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"
6. Follow the instructions to push existing repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pharmacy-platform.git
git branch -M main
git add .
git commit -m "Initial commit: Pharmacy platform with Supabase integration"
git push -u origin main
```

---

## Step 2: Set Up Supabase Database

### 2.1: Run Database Schema (If Not Already Done)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Copy and paste your database schema (if you have a `database_schema.sql` file)
5. Click **Run**

### 2.2: Create Staff and Admin Accounts

1. In Supabase SQL Editor, open the file: `staff-admin-accounts.sql`
2. **IMPORTANT:** Edit these values before running:
   - Change all email addresses from the default
   - Change all passwords from the default
   - Update phone numbers
3. Run the entire SQL script
4. Verify accounts were created using the verification queries at the bottom of the file

**Default credentials (CHANGE THESE!):**
- Admin: `admin@pharmacy.com` / `Admin@123456`
- Manager: `manager@pharmacy.com` / `Manager@123456`
- Staff: `staff@pharmacy.com` / `Staff@123456`

### 2.3: Get Supabase Credentials

You already have these in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://hodtdxxjgnjfwvwzzbrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Keep these handy for Vercel deployment.

---

## Step 3: Deploy to Vercel

### 3.1: Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository: `pharmacy-platform`
5. Click **"Import"**

### 3.2: Configure Project Settings

**Framework Preset:** Next.js (should auto-detect)

**Build & Development Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

### 3.3: Add Environment Variables

Click **"Environment Variables"** and add ALL of these:

**Supabase Configuration:**
```
NEXT_PUBLIC_SUPABASE_URL = https://hodtdxxjgnjfwvwzzbrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-anon-key-from-.env.local]
SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key-from-.env.local]
```

**Cloudinary Configuration:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = ddfmwodhd
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = pharmacy_products
CLOUDINARY_API_KEY = 366347825846412
CLOUDINARY_API_SECRET = ifDSjVZCdYtOpjCzK0OVw7OnD54
```

**App Configuration:**
```
NEXT_PUBLIC_PHARMACY_NAME = PharmacyDemo
NEXT_PUBLIC_SITE_URL = [will be provided after deployment]
```

**MTN Mobile Money (Optional - can add later):**
```
MTN_MOMO_API_USER = [your-mtn-api-user]
MTN_MOMO_API_KEY = [your-mtn-api-key]
MTN_MOMO_SUBSCRIPTION_KEY = [your-mtn-subscription-key]
MTN_MOMO_ENVIRONMENT = sandbox
```

### 3.4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://pharmacy-platform-xyz.vercel.app`

### 3.5: Update NEXT_PUBLIC_SITE_URL

1. Copy your Vercel deployment URL
2. Go back to **Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_SITE_URL` and set it to your Vercel URL
4. Click **"Save"**
5. Go to **Deployments** tab and click **"Redeploy"** on the latest deployment

---

## Step 4: Configure Supabase for Production

### 4.1: Add Vercel URL to Supabase Allowed URLs

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://pharmacy-platform-xyz.vercel.app`
3. Add to **Redirect URLs**:
   - `https://pharmacy-platform-xyz.vercel.app/api/auth/callback`
   - `https://pharmacy-platform-xyz.vercel.app/auth/callback`

### 4.2: Configure Storage Buckets

1. Go to **Storage** in Supabase
2. Create two buckets:
   - `prescriptions` (Private)
   - `products` (Public)
3. Set up RLS policies for the buckets

### 4.3: Enable Email Confirmations (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize email templates as needed
3. Configure SMTP settings if using custom email

---

## Step 5: Test Your Deployment

### 5.1: Test Customer Flow
1. Visit your Vercel URL
2. Browse products
3. Create an account
4. Add items to cart
5. Complete checkout

### 5.2: Test Staff Login
1. Go to `https://your-vercel-url.vercel.app/auth/staff-login`
2. Login with staff credentials
3. Verify dashboard access
4. Test order management

### 5.3: Test Admin Login
1. Go to `https://your-vercel-url.vercel.app/auth/staff-login`
2. Login with admin credentials
3. Verify admin dashboard access
4. Test staff management features

---

## Step 6: Set Up Custom Domain (Optional)

### 6.1: Add Domain in Vercel
1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `pharmacy.com`)

### 6.2: Configure DNS
1. Add DNS records as instructed by Vercel
2. Wait for DNS propagation (can take up to 48 hours)

### 6.3: Update Environment Variables
1. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
2. Update Supabase redirect URLs to use custom domain
3. Redeploy

---

## Step 7: Monitor and Maintain

### Monitoring
- **Vercel Analytics:** Check performance metrics
- **Vercel Logs:** Monitor errors and issues
- **Supabase Dashboard:** Monitor database usage and queries

### Regular Maintenance
- Review and rotate Supabase service role keys periodically
- Monitor API rate limits
- Keep dependencies updated: `npm outdated`
- Review and optimize database queries

### Backup Strategy
- Supabase provides automatic backups
- Consider exporting data regularly
- Keep a local copy of your database schema

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Verify all environment variables are set
- Test build locally: `npm run build`

### Authentication Issues
- Verify Supabase redirect URLs are correct
- Check that service role key is set correctly
- Ensure email confirmation is disabled for testing (if needed)

### Database Connection Issues
- Verify Supabase URL and keys
- Check Row Level Security policies
- Test connection in Supabase SQL Editor

### Image Upload Issues
- Verify Cloudinary credentials
- Check CORS settings in Cloudinary
- Ensure upload preset is configured correctly

---

## Security Checklist

- [ ] Changed default staff/admin passwords
- [ ] Environment variables are set in Vercel (not committed to git)
- [ ] `.env.local` is in `.gitignore`
- [ ] Supabase RLS policies are enabled
- [ ] HTTPS is enforced (Vercel does this automatically)
- [ ] Service role key is kept secret
- [ ] Regular security audits scheduled

---

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- Check Supabase documentation: https://supabase.com/docs
- Review Next.js documentation: https://nextjs.org/docs

---

## Quick Reference

**Staff Login URL:** `/auth/staff-login`
**Customer Login URL:** `/login`
**Admin Dashboard:** `/admin/dashboard`
**Staff Dashboard:** `/staff/dashboard`

**Important Files:**
- Environment config: `.env.local`
- Database schema: `database_schema.sql` (if exists)
- Staff accounts: `staff-admin-accounts.sql`
- Deployment config: `vercel.json`
