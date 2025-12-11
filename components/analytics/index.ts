// components/analytics/index.ts
// Re-export analytics utilities

export {
  AnalyticsProvider,
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackPurchase,
  trackSearch,
  trackPrescriptionUpload,
  trackPaymentInitiated,
  trackSignup,
  trackLogin,
} from './analytics-provider';

export { ProductViewTracker } from './product-view-tracker';
