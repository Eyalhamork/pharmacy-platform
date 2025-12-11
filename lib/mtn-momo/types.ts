// lib/mtn-momo/types.ts
// Type definitions for MTN Mobile Money API

export interface MoMoConfig {
  apiUser: string;
  apiKey: string;
  subscriptionKey: string;
  environment: 'sandbox' | 'production';
  callbackUrl: string;
  baseUrl?: string;
}

export interface RequestToPayParams {
  amount: string;
  currency: string;
  externalId: string; // Order ID
  payer: {
    partyIdType: 'MSISDN';
    partyId: string; // Phone number
  };
  payerMessage: string;
  payeeNote: string;
}

export interface RequestToPayResponse {
  success: boolean;
  referenceId?: string;
  error?: string;
  errorCode?: string;
}

export interface PaymentStatus {
  amount: string;
  currency: string;
  financialTransactionId: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  reason?: {
    code: string;
    message: string;
  };
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface MoMoWebhookPayload {
  financialTransactionId: string;
  externalId: string;
  amount: string;
  currency: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  status: 'SUCCESSFUL' | 'FAILED';
  reason?: {
    code: string;
    message: string;
  };
}

export type PaymentStatusType = 'pending' | 'paid' | 'failed' | 'refunded';

// Convenience type for simpler payment requests (gets transformed to RequestToPayParams)
export interface SimpleRequestToPayParams {
  amount: number;
  phoneNumber: string;
  orderId: string;
  orderNumber: string;
  currency?: string;
  note?: string;
}

// Type alias for backward compatibility
export type RequestToPayResult = RequestToPayResponse;