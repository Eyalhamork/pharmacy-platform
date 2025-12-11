'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle, MessageSquare, Eye } from 'lucide-react';
import { Database } from '@/lib/types/database';
import PrescriptionImageViewer from './prescription-image-viewer';

type Order = Database['public']['Tables']['orders']['Row'];

interface PrescriptionVerificationProps {
  order: Order;
  prescriptionUrl: string;
  onVerify: (approved: boolean, reason?: string) => Promise<void>;
  disabled?: boolean;
}

export function PrescriptionVerification({
  order,
  prescriptionUrl,
  onVerify,
  disabled = false,
}: PrescriptionVerificationProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isApproving, setIsApproving] = useState(true);
  const [reason, setReason] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);

  const handleApprove = () => {
    setIsApproving(true);
    setReason('');
    setSendWhatsApp(true);
    setShowDialog(true);
  };

  const handleReject = () => {
    setIsApproving(false);
    setReason('');
    setSendWhatsApp(true);
    setShowDialog(true);
  };

  const handleConfirm = async () => {
    try {
      setProcessing(true);
      await onVerify(isApproving, reason || undefined);
      
      // The parent component will handle WhatsApp sending based on the sendWhatsApp state
      // This is passed through a callback or event
      if (sendWhatsApp) {
        // Generate WhatsApp link based on approval/rejection
        const phone = order.customer_whatsapp || order.customer_phone;
        const formattedPhone = phone.replace(/[^0-9]/g, '');
        
        let message = '';
        if (isApproving) {
          message = `Hello ${order.customer_name},

Good news! Your prescription for order #${order.order_number} has been verified and approved. ✅

We're now processing your order and will notify you when it's ready for ${
            order.delivery_type === 'delivery' ? 'delivery' : 'pickup'
          }.

Thank you for choosing MoPharma!`;
        } else {
          message = `Hello ${order.customer_name},

Regarding your prescription for order #${order.order_number}:

Unfortunately, we cannot process your order at this time.

Reason: ${reason || 'Invalid or unclear prescription'}

Please upload a new, valid prescription or contact us for assistance.

We apologize for any inconvenience.`;
        }
        
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
        
        // Small delay to ensure verification is complete
        setTimeout(() => {
          window.open(url, '_blank');
        }, 500);
      }
      
      setShowDialog(false);
    } catch (error) {
      console.error('Error verifying prescription:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Prescription Verification</h3>
            <p className="text-sm text-muted-foreground">
              Review and verify the uploaded prescription
            </p>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Requires Verification
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImageViewer(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Prescription
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={disabled || processing}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Prescription
          </Button>
          <Button
            onClick={handleReject}
            disabled={disabled || processing}
            variant="destructive"
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject Prescription
          </Button>
        </div>
      </div>

      {/* Image Viewer */}
      {showImageViewer && (
        <PrescriptionImageViewer
          imageUrl={prescriptionUrl}
          fileName={`prescription-${order.order_number}.jpg`}
          onClose={() => setShowImageViewer(false)}
        />
      )}

      {/* Verification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isApproving ? 'Approve Prescription' : 'Reject Prescription'}
            </DialogTitle>
            <DialogDescription>
              {isApproving
                ? 'Confirm that the prescription is valid and can be processed.'
                : 'Provide a reason for rejecting this prescription.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {isApproving ? 'Notes (Optional)' : 'Rejection Reason'}
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  isApproving
                    ? 'Add any notes about this prescription...'
                    : 'Please provide a reason for rejection...'
                }
                className="mt-2"
                rows={4}
              />
            </div>

            {!isApproving && !reason.trim() && (
              <p className="text-sm text-amber-600">
                ⚠️ It's recommended to provide a rejection reason
              </p>
            )}

            <div className="flex items-start space-x-2 bg-muted p-3 rounded-lg">
              <Checkbox
                id="send-whatsapp-prescription"
                checked={sendWhatsApp}
                onCheckedChange={(checked) => setSendWhatsApp(checked as boolean)}
              />
              <div className="flex-1">
                <label
                  htmlFor="send-whatsapp-prescription"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Send WhatsApp notification to customer
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Notify {order.customer_name} about the prescription{' '}
                  {isApproving ? 'approval' : 'rejection'}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={processing}
              className={
                isApproving
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {processing
                ? 'Processing...'
                : isApproving
                ? 'Approve & Notify'
                : 'Reject & Notify'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
