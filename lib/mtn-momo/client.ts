// lib/mtn-momo/client.ts
// MTN Mobile Money API client for Collections (Request to Pay)

import crypto from 'crypto';
import type {
  MoMoConfig,
  RequestToPayParams,
  SimpleRequestToPayParams,
  RequestToPayResult,
  PaymentStatus,
} from './types';

export class MoMoClient {
  private config: MoMoConfig;
  private baseUrl: string;

  constructor(config: MoMoConfig) {
    this.config = config;
    this.baseUrl =
      config.baseUrl ||
      (config.environment === 'sandbox'
        ? 'https://sandbox.momodeveloper.mtn.com'
        : 'https://momodeveloper.mtn.com');
  }

  /**
   * Generate a UUID v4 for reference IDs
   */
  private generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Get access token for API requests
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      const credentials = Buffer.from(
        `${this.config.apiUser}:${this.config.apiKey}`
      ).toString('base64');

      const response = await fetch(
        `${this.baseUrl}/collection/token/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to get access token:', await response.text());
        return null;
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Initiate a Request to Pay transaction
   */
  async requestToPay(
    params: SimpleRequestToPayParams
  ): Promise<RequestToPayResult> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: 'Failed to get access token',
        };
      }

      // Generate reference ID
      const referenceId = this.generateUUID();

      // Format phone number (remove + and spaces)
      const formattedPhone = params.phoneNumber.replace(/[\s+]/g, '');

      // Prepare request body (transform SimpleRequestToPayParams to API format)
      const requestBody: RequestToPayParams = {
        amount: params.amount.toString(),
        currency: params.currency || 'USD',
        externalId: params.orderId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone,
        },
        payerMessage: `Payment for order ${params.orderNumber}`,
        payeeNote: params.note || `Order ${params.orderNumber}`,
      };

      // Make API request
      const response = await fetch(
        `${this.baseUrl}/collection/v1_0/requesttopay`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Request to Pay failed:', errorText);
        return {
          success: false,
          error: `Payment request failed: ${response.status}`,
        };
      }

      // Request was accepted
      return {
        success: true,
        referenceId,
      };
    } catch (error: any) {
      console.error('Error in requestToPay:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate payment',
      };
    }
  }

  /**
   * Check the status of a payment transaction
   */
  async getPaymentStatus(referenceId: string): Promise<PaymentStatus | null> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        return null;
      }

      // Make API request
      const response = await fetch(
        `${this.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to get payment status:', await response.text());
        return null;
      }

      const data = await response.json();
      return data as PaymentStatus;
    } catch (error) {
      console.error('Error getting payment status:', error);
      return null;
    }
  }

  /**
   * Verify webhook signature (implement based on MTN's webhook signing method)
   */
  verifyWebhookSignature(signature: string, payload: string): boolean {
    // In sandbox, signatures might not be enforced
    if (this.config.environment === 'sandbox') {
      return true; // Skip verification in sandbox
    }

    // In production, implement proper signature verification
    // This would typically involve HMAC with a shared secret
    try {
      // TODO: Implement actual signature verification for production
      // const expectedSignature = crypto
      //   .createHmac('sha256', webhookSecret)
      //   .update(payload)
      //   .digest('hex');
      // return signature === expectedSignature;
      
      return true; // Placeholder
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }
}

/**
 * Get configured MoMo client instance
 */
export function getMoMoClient(): MoMoClient {
  const config: MoMoConfig = {
    apiUser: process.env.MTN_MOMO_API_USER || '',
    apiKey: process.env.MTN_MOMO_API_KEY || '',
    subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || '',
    environment: (process.env.MTN_MOMO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    callbackUrl: process.env.MTN_MOMO_CALLBACK_URL || process.env.NEXT_PUBLIC_APP_URL + '/api/webhooks/mtn-momo' || '',
  };

  return new MoMoClient(config);
}