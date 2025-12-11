// lib/mtn-momo/index.ts
// Main exports for MTN Mobile Money integration

export { MoMoClient, getMoMoClient } from './client';
export type {
  MoMoConfig,
  RequestToPayParams,
  RequestToPayResult,
  PaymentStatus,
  MoMoWebhookPayload,
} from './types';