// components/analytics/analytics-provider.tsx
// Analytics integration (Google Analytics 4 + custom event tracking)

'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Check if analytics is enabled
const isAnalyticsEnabled = (): boolean => {
  return Boolean(GA_MEASUREMENT_ID) && process.env.NODE_ENV === 'production';
};

/**
 * Track page views
 */
function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Send page view to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID!, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);
}

/**
 * Page tracking component wrapped in Suspense
 */
function PageTracker() {
  usePageTracking();
  return null;
}

/**
 * Google Analytics Provider Component
 * Add this to your root layout
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (!isAnalyticsEnabled()) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
      
      {/* Page View Tracker */}
      <Suspense fallback={null}>
        <PageTracker />
      </Suspense>
      
      {children}
    </>
  );
}

// Declare gtag on window
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Track custom events
 * Use this function throughout the app to track user actions
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean | any[]>
) {
  if (!isAnalyticsEnabled()) {
    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics Event]', eventName, eventParams);
    }
    return;
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

// Pre-defined event tracking functions for common actions

/**
 * Track product view
 */
export function trackProductView(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  trackEvent('view_item', {
    currency: 'USD',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category || 'Uncategorized',
      price: product.price,
    }],
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}) {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category || 'Uncategorized',
      price: product.price,
      quantity: product.quantity,
    }],
  });
}

/**
 * Track remove from cart
 */
export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  trackEvent('remove_from_cart', {
    currency: 'USD',
    value: product.price * product.quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: product.quantity,
    }],
  });
}

/**
 * Track begin checkout
 */
export function trackBeginCheckout(cart: {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}) {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: cart.total,
    items: cart.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * Track purchase/order completion
 */
export function trackPurchase(order: {
  orderId: string;
  total: number;
  shipping: number;
  paymentMethod: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  trackEvent('purchase', {
    transaction_id: order.orderId,
    currency: 'USD',
    value: order.total,
    shipping: order.shipping,
    payment_type: order.paymentMethod,
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, resultsCount: number) {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

/**
 * Track prescription upload
 */
export function trackPrescriptionUpload(success: boolean) {
  trackEvent('prescription_upload', {
    success: success,
  });
}

/**
 * Track payment initiation
 */
export function trackPaymentInitiated(method: 'mobile_money' | 'cash_on_delivery', amount: number) {
  trackEvent('payment_initiated', {
    payment_method: method,
    value: amount,
    currency: 'USD',
  });
}

/**
 * Track signup
 */
export function trackSignup(method: 'email' | 'phone') {
  trackEvent('sign_up', {
    method: method,
  });
}

/**
 * Track login
 */
export function trackLogin(method: 'email' | 'phone') {
  trackEvent('login', {
    method: method,
  });
}
