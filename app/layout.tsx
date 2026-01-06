// app/layout.tsx
// Root layout with analytics and structured data

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { WhatsAppChatWidget } from '@/components/shared/whatsapp-chat-widget';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { AnalyticsProvider } from '@/components/analytics/analytics-provider';
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/product-jsonld';
import { activeTheme } from '@/lib/theme-config';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: `${activeTheme.name} - Order Medicines Online in Monrovia`,
    template: `%s | ${activeTheme.name}`,
  },
  description: `Order medications online with fast delivery across Monrovia. MTN Mobile Money and Cash on Delivery available. ${activeTheme.name} - Your trusted online pharmacy in Liberia.`,
  keywords: [
    'pharmacy',
    'medications',
    'Monrovia',
    'Liberia',
    'online pharmacy',
    'prescription drugs',
    'MTN Mobile Money',
    'delivery',
    'medicine delivery',
    'healthcare',
    activeTheme.name,
  ],
  authors: [{ name: activeTheme.name }],
  creator: activeTheme.name,
  publisher: activeTheme.name,
  applicationName: activeTheme.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://luckypharmacy.com'),
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: activeTheme.name,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: activeTheme.name,
    title: `${activeTheme.name} - Order Medicines Online in Monrovia`,
    description: 'Order medications online with fast delivery across Monrovia. MTN Mobile Money and Cash on Delivery available.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${activeTheme.name} - Online Pharmacy`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${activeTheme.name} - Order Medicines Online in Monrovia`,
    description: 'Order medications online with fast delivery across Monrovia.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data - Organization */}
        <OrganizationJsonLd />
        <WebsiteJsonLd />

        {/* PWA Primary Color */}
        <meta name="theme-color" content="#16a34a" />

        {/* iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={activeTheme.name} />

        {/* iOS Icons */}
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />

        {/* iOS Splash Screens */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />

        {/* Preconnect to external services */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <AnalyticsProvider>
          <AuthProvider>
            {children}
            <Toaster />
            <WhatsAppChatWidget />
            <PWAInstallPrompt />
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
