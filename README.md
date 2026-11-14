# 🏥 PharmaCare — White-Label E-Commerce & Pharmacy Management Platform

[![Live Demo](https://img.shields.io/badge/demo-live%20preview-146D7B?style=for-the-badge&logo=vercel)](https://pharmacy-platform-rho.vercel.app/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blueviolet?style=for-the-badge)](https://web.dev/progressive-web-apps/)

A production-ready, white-label e-commerce and digital pharmacy operations platform. Engineered for retail pharmacies, healthcare clinics, and pharmaceutical distributors looking to sell medications online with integrated mobile payments, pharmacist prescription verification, multi-role staff dashboards, delivery coordination, and instant WhatsApp alerts.

---

## 🌐 Live Demo & Credentials

- **Live Storefront Demo:** [https://pharmacy-platform-rho.vercel.app/](https://pharmacy-platform-rho.vercel.app/)
- **Staff & Admin Portal:** [https://pharmacy-platform-rho.vercel.app/staff/login](https://pharmacy-platform-rho.vercel.app/staff/login)

### 🔑 Demo Logins

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pharmacy.com` | `Admin@123456` | Full platform control, staff management, analytics, zone pricing |
| **Manager** | `manager@pharmacy.com` | `Manager@123456` | Product inventory, reports, order management, prescriptions |
| **Staff** | `staff@pharmacy.com` | `Staff@123456` | Order processing, prescription verification, receipt generation |

---

## ✨ Key Features

### 🛒 Customer Storefront
- **Modern Catalog & Category Discovery:** Fast filtering by condition, category (Pain Relief, Antibiotics, First Aid, etc.), price, and prescription requirements.
- **Instant Search:** Debounced full-text search with auto-suggestions.
- **Cart & Flexible Checkout:** Step-by-step checkout supporting Home Delivery (zone-calculated fee) or Pharmacy In-Store Pickup (Free).
- **Mobile Payment Integration:** Native integration with **MTN Mobile Money (MoMo)** for automated payments alongside **Cash on Delivery (COD)**.
- **Customer Order Tracking:** Real-time visual timeline from order confirmation to driver dispatch.

### 💊 Prescription Verification System
- **Secure Prescription Upload:** Customers upload prescription photos or scans directly during checkout.
- **Pharmacist Review Workflow:** Dedicated pharmacist portal to verify dosage, legitimacy, and license details before orders are dispatched.
- **Approval & Rejection Communication:** One-click WhatsApp message triggers notify customers of prescription verification or issues.

### 📊 Staff & Management Operations
- **Role-Based Access Control (RBAC):** Admin, Manager, and Staff roles with granular permissions.
- **Inventory & Product Management:** Low stock alerts, category management, batch updates, and Cloudinary image optimization.
- **POS & Printable Receipts:** Built-in receipt printer styling (`window.print`) formatted for standard 80mm thermal receipt printers.
- **Delivery Zone Configuration:** Configurable shipping zones with customized pricing, turnaround times, and free pickup thresholds.
- **Sales & Period Reports:** Daily, weekly, and monthly revenue summaries with breakdown by payment method.

### 🎨 100% Dynamic White-Label Theming
- **Dynamic CSS Variable Engine:** Centralized configuration in `lib/theme-config.ts` dynamically injects CSS variables (`--primary`, `--secondary`, `--accent`, `--muted`) into the DOM.
- **Distinct Default Theme (`#146D7B`):** Deep Ocean Teal brand color paired with soothing pastel accents, moving away from harsh default blues.
- **Zero-Code Rebranding:** Switch pharmacy name, phone numbers, WhatsApp, address, and color palette across the entire platform in under 60 seconds.

### 📱 Progressive Web App (PWA)
- **Installable Native-Like App:** Offline fallback page, service worker caching, and an automated prompt for mobile and desktop home screen installation.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Radix UI primitives, Lucide Icons
- **Database & Authentication:** Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **State Management:** Zustand (cart and local persistence)
- **Asset Storage:** Cloudinary & Supabase Storage
- **Notifications:** WhatsApp Web API deep-linking & webhooks
- **Deployment:** Vercel

---

## 📁 Project Structure

```
pharmacy-platform/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, signup, password recovery
│   ├── about/                  # About page (dynamic theming)
│   ├── account/                # Customer profile, order history, addresses
│   ├── admin/                  # Admin dashboard & configuration
│   ├── api/                    # API routes (payments, search, webhooks, staff)
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Multi-step checkout with delivery & prescription
│   ├── contact/                # Contact page & message dispatch
│   ├── faq/                    # Frequently asked questions
│   ├── how-it-works/           # Interactive customer guide
│   ├── products/               # Product catalog & details
│   ├── shipping/               # Delivery zones & timelines
│   ├── staff/                  # Staff portal & prescription verification
│   ├── globals.css             # Theme tokens & CSS variables
│   └── layout.tsx              # Root layout with dynamic theme injection
├── components/                 # Reusable UI components
│   ├── auth/                   # Authentication forms
│   ├── checkout/               # Step components for checkout
│   ├── customer/               # Customer storefront components
│   ├── shared/                 # Header, Footer, WhatsApp widget
│   ├── staff/                  # Verification, reporting, thermal receipt
│   └── ui/                     # shadcn/ui atomic components
├── lib/                        # Utilities & core business logic
│   ├── supabase/               # Supabase browser & server clients
│   ├── theme-config.ts         # 🎨 Central White-Label Theme Engine
│   └── whatsapp-templates.ts   # Automated notification templates
├── public/                     # Static assets, icons, manifest.json, sw.js
└── staff-admin-accounts.sql    # Database seeding & staff role SQL
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Eyalhamork/pharmacy-platform.git
cd pharmacy-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cloudinary (Product Images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=pharmacy_products
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Mobile Money API (Optional for Sandbox Testing)
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=your-key
MTN_MOMO_API_USER=your-user
MTN_MOMO_API_KEY=your-key
```

### 4. Database Setup

1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Run the schema migrations and execute `staff-admin-accounts.sql` to initialize roles and demo accounts.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 How to Rebrand (White-Labeling)

To rebrand the entire platform for a new client:

1. Open `lib/theme-config.ts`.
2. Update the `name`, `colors`, `logo`, and `contact` fields in `activeTheme`:

```typescript
export const activeTheme = {
  name: 'Your Pharmacy Name',
  colors: {
    primary: '188 72% 28%',        // HSL format (e.g. #146D7B)
    primaryForeground: '0 0% 100%',
    secondary: '188 45% 45%',
    secondaryForeground: '0 0% 100%',
    accent: '168 60% 40%',
    accentForeground: '0 0% 100%',
    muted: '188 35% 96%',          // Gentle pastel background
    mutedForeground: '188 25% 40%',
  },
  logo: {
    initial: 'P',
    text: 'Your Pharmacy',
    tagline: 'Healthcare & Pharmacy Platform',
  },
  contact: {
    phone: '+231 777 000 000',
    whatsapp: '+231 777 000 000',
    email: 'info@yourpharmacy.com',
    address: 'Your Address, City, Country',
  },
};
```

All headers, footers, buttons, page gradients, SEO metadata, and receipt templates will update automatically. See [BRANDING_GUIDE.md](./BRANDING_GUIDE.md) for full customization details.

---

## 📦 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add the environment variables from `.env.local`.
4. Click **Deploy**.

---

## 📋 Recommended GitHub Repository "About" Summary

> Copy and paste this short summary into your GitHub repo's **About / Description** field:

```text
A modern, white-label e-commerce pharmacy platform built with Next.js 14, Supabase, Tailwind CSS, MTN Mobile Money & Cash on Delivery, prescription verification, and staff dashboards.
```

**Recommended GitHub Topics:**
`nextjs`, `pharmacy-platform`, `e-commerce`, `supabase`, `tailwindcss`, `pwa`, `mobile-money`, `prescription-verification`, `white-label`, `healthcare`

---

## 📄 License

Proprietary template — free to customize and deploy for client and enterprise projects.
