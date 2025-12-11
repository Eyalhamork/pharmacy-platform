# Pharmacy E-Commerce Platform

A comprehensive e-commerce platform for Liberian pharmacies to sell medications online with integrated payment processing (MTN Mobile Money + Cash on Delivery), prescription verification, order management, and delivery coordination.

## Demo Credentials

**Staff Login:** https://your-domain.vercel.app/staff/login

- **Admin:** admin@pharmacy.com / Admin@123456
- **Manager:** manager@pharmacy.com / Manager@123456
- **Staff:** staff@pharmacy.com / Staff@123456

## Features

- 🛒 Full e-commerce functionality
- 💊 Prescription verification system
- 💰 MTN Mobile Money integration
- 💵 Cash on Delivery support
- 📱 PWA enabled (install like an app)
- 🚀 Fast, optimized for low bandwidth
- 📊 Staff and Admin dashboards
- 📲 WhatsApp notifications
- 🔒 Secure with Row Level Security

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Payment:** MTN Mobile Money API
- **Hosting:** Vercel + Supabase Cloud
- **UI Components:** shadcn/ui
- **State Management:** Zustand

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- MTN Mobile Money developer account (for payment integration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pharmacy-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Set up the database:
- Go to your Supabase project
- Open SQL Editor
- Run the SQL file from `/mnt/project/database_schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pharmacy-platform/
├── app/                    # Next.js app router
│   ├── (customer)/        # Customer-facing routes
│   ├── (staff)/          # Staff dashboard routes
│   ├── (admin)/          # Admin dashboard routes
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/
│   ├── customer/         # Customer UI components
│   ├── staff/           # Staff UI components
│   ├── admin/           # Admin UI components
│   ├── shared/          # Shared components
│   └── ui/              # Base UI components
├── lib/
│   ├── supabase/        # Supabase clients
│   ├── store/           # State management
│   ├── types/           # TypeScript types
│   └── utils.ts         # Utility functions
├── public/              # Static assets
└── package.json
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Configure Supabase

1. Set up Row Level Security policies (included in schema)
2. Configure Auth settings
3. Set up Storage buckets for prescriptions and product images
4. Configure Edge Functions for webhooks

## Development Roadmap

See [IMPLEMENTATION_CHECKLIST.md](/mnt/project/IMPLEMENTATION_CHECKLIST.md) for detailed week-by-week development plan.

## Documentation

- [Full Specification](/mnt/project/PHARMACY_PLATFORM_SPECIFICATION.md)
- [Database Schema](/mnt/project/database_schema.sql)
- [Implementation Checklist](/mnt/project/IMPLEMENTATION_CHECKLIST.md)

## License

Proprietary - Crown Prince Inc. (LiberiaFix)

## Contact

For questions or support, contact [your email/phone]
