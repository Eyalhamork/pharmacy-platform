'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/lib/hooks/use-toast';
import PrescriptionCard from '@/components/staff/prescription-card';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  order_status: string;
  created_at: string;
  order_items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    requires_prescription: boolean;
  }>;
}

interface Prescription {
  id: string;
  order_id: string;
  file_url: string;
  file_type: string | null;
  file_name: string | null;
  file_size: number | null;
  uploaded_at: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  orders: Order;
}

const REJECTION_REASONS = [
  'Image is blurry or unclear',
  'Prescription is expired',
  'Prescription is incomplete',
  'Cannot verify prescription authenticity',
  'Wrong prescription uploaded',
  'Prescription does not match ordered items',
  'Other (specify below)'
];

export default function PrescriptionVerificationPage() {
  const { toast } = useToast();
  
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Approve dialog state
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approvingPrescriptionId, setApprovingPrescriptionId] = useState<string | null>(null);
  const [approveNotes, setApproveNotes] = useState('');
  
  // Reject dialog state
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectingPrescriptionId, setRejectingPrescriptionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');

  // Fetch pending prescriptions
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff/prescriptions/pending');
      
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }

      const data = await response.json();
      setPrescriptions(data.prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load prescriptions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Handle approve click
  const handleApproveClick = (prescriptionId: string) => {
    setApprovingPrescriptionId(prescriptionId);
    setApproveNotes('');
    setShowApproveDialog(true);
  };

  // Handle approve confirm
  const handleApproveConfirm = async () => {
    if (!approvingPrescriptionId) return;

    try {
      setActionLoading(true);
      const requestBody: { staff_notes: string | null } = {
        staff_notes: approveNotes.trim() ? approveNotes : null
      };

      const response = await fetch(
        `/api/staff/prescriptions/${approvingPrescriptionId}/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve prescription');
      }

      toast({
        title: 'Success',
        description: 'Prescription approved successfully. Customer has been notified via WhatsApp.',
        variant: 'default'
      });

      // Remove from list
      setPrescriptions(prev => 
        prev.filter(p => p.id !== approvingPrescriptionId)
      );

      setShowApproveDialog(false);
      setApprovingPrescriptionId(null);
      setApproveNotes('');
    } catch (error) {
      console.error('Error approving prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve prescription. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject click
  const handleRejectClick = (prescriptionId: string) => {
    setRejectingPrescriptionId(prescriptionId);
    setRejectionReason('');
    setCustomRejectionReason('');
    setRejectNotes('');
    setShowRejectDialog(true);
  };

  // Handle reject confirm
  const handleRejectConfirm = async () => {
    if (!rejectingPrescriptionId) return;

    const finalRejectionReason = rejectionReason === 'Other (specify below)'
      ? customRejectionReason
      : rejectionReason;

    if (!finalRejectionReason) {
      toast({
        title: 'Error',
        description: 'Please select or specify a rejection reason.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setActionLoading(true);
      const requestBody: { rejection_reason: string; staff_notes: string | null } = {
        rejection_reason: finalRejectionReason,
        staff_notes: rejectNotes || null
      };

      const response = await fetch(
        `/api/staff/prescriptions/${rejectingPrescriptionId}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reject prescription');
      }

      toast({
        title: 'Prescription Rejected',
        description: 'Customer has been notified via WhatsApp with the reason for rejection.',
        variant: 'default'
      });

      // Remove from list
      setPrescriptions(prev => 
        prev.filter(p => p.id !== rejectingPrescriptionId)
      );

      setShowRejectDialog(false);
      setRejectingPrescriptionId(null);
      setRejectionReason('');
      setCustomRejectionReason('');
      setRejectNotes('');
    } catch (error) {
      console.error('Error rejecting prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject prescription. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-sm text-gray-500">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck className="h-7 w-7 text-primary" />
            Prescription Verification
          </h1>
          <p className="text-gray-500 mt-1">
            Review and verify customer prescriptions
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={fetchPrescriptions}
          disabled={loading}
        >
          Refresh Queue
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold mt-1">{prescriptions.length}</p>
            </div>
            <FileCheck className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Prescriptions Queue */}
      {prescriptions.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
          <p className="text-gray-500">
            No prescriptions pending verification at the moment.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="font-semibold">Pending Prescriptions ({prescriptions.length})</h2>
          {prescriptions.map(prescription => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              onApprove={handleApproveClick}
              onReject={handleRejectClick}
            />
          ))}
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Approve Prescription
            </DialogTitle>
            <DialogDescription>
              Confirm that this prescription is valid and matches the ordered items.
              The customer will be notified via WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approve-notes">Internal Notes (Optional)</Label>
              <Textarea
                id="approve-notes"
                placeholder="Add any internal notes about this verification..."
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveConfirm}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Prescription
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Reject Prescription
            </DialogTitle>
            <DialogDescription>
              Select the reason for rejection. The customer will be notified via WhatsApp
              with instructions on how to proceed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map(reason => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {rejectionReason === 'Other (specify below)' && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Custom Reason *</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Specify the reason for rejection..."
                  value={customRejectionReason}
                  onChange={(e) => setCustomRejectionReason(e.target.value)}
                  rows={2}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reject-notes">Internal Notes (Optional)</Label>
              <Textarea
                id="reject-notes"
                placeholder="Add any internal notes about this rejection..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={actionLoading}
              variant="destructive"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Prescription
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
