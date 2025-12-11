// lib/mtn-momo/config.ts
// MTN Mobile Money API configuration

import type { MoMoConfig } from './types';

// MTN API Base URLs
export const MTN_MOMO_BASE_URLS = {
  sandbox: 'https://sandbox.momodeveloper.mtn.com',
  production: 'https://momodeveloper.mtn.com',
};

// Get MTN MoMo configuration from environment variables
export function getMoMoConfig(): MoMoConfig {
  const environment = (process.env.MTN_MOMO_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';
  
  const config: MoMoConfig = {
    apiUser: process.env.MTN_MOMO_API_USER || '',
    apiKey: process.env.MTN_MOMO_API_KEY || '',
    subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || '',
    environment,
    callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mtn-momo`,
  };

  // Validate required fields
  if (!config.apiUser || !config.apiKey || !config.subscriptionKey) {
    throw new Error('MTN MoMo configuration is incomplete. Check environment variables.');
  }

  return config;
}

// Get base URL based on environment
export function getBaseUrl(): string {
  const environment = process.env.MTN_MOMO_ENVIRONMENT || 'sandbox';
  return MTN_MOMO_BASE_URLS[environment as keyof typeof MTN_MOMO_BASE_URLS];
}

// Currency code for Liberia
export const CURRENCY_CODE = 'LRD'; // Liberian Dollar
// Alternatively use 'USD' if MTN MoMo in Liberia uses USD

// Timeout for payment prompts (5 minutes)
export const PAYMENT_TIMEOUT_MS = 5 * 60 * 1000;

// Payment retry configuration
export const PAYMENT_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 2000,
};