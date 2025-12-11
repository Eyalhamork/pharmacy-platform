'use client';

import { useState } from 'react';
import { Calendar, Eye, FileText, Package, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import PrescriptionImageViewer from './prescription-image-viewer';

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

interface PrescriptionCardProps {
  prescription: Prescription;
  onApprove: (prescriptionId: string) => void;
  onReject: (prescriptionId: string) => void;
}

export default function PrescriptionCard({
  prescription,
  onApprove,
  onReject
}: PrescriptionCardProps) {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const order = prescription.orders;

  // Calculate how long ago the prescription was uploaded
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const uploaded = new Date(timestamp);
    const diffMs = now.getTime() - uploaded.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    return `${kb.toFixed(2)} KB`;
  };

  // Get prescription items from order
  const prescriptionItems = order.order_items?.filter(
    item => item.requires_prescription
  ) || [];

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Prescription Image Preview */}
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={prescription.file_url}
                alt="Prescription"
                className="w-full h-full object-cover"
                onClick={() => setShowImageViewer(true)}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowImageViewer(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
              </div>
            </div>
            
            {/* File Info */}
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {prescription.file_name || 'prescription.jpg'}
              </p>
              <p>{formatFileSize(prescription.file_size)}</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Order #{order.order_number}
                  <Badge variant="secondary" className="text-xs">
                    {order.order_status}
                  </Badge>
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  Uploaded {getTimeAgo(prescription.uploaded_at)}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{order.customer_phone}</span>
              </div>
            </div>

            {/* Prescription Items */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Package className="h-4 w-4 text-gray-400" />
                Prescription Items ({prescriptionItems.length})
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                {prescriptionItems.map((item) => (
                  <div key={item.id} className="text-sm flex justify-between">
                    <span>{item.product_name}</span>
                    <span className="text-gray-500">× {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => onApprove(prescription.id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Approve Prescription
              </Button>
              <Button
                onClick={() => onReject(prescription.id)}
                variant="outline"
                className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              >
                Reject Prescription
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Image Viewer Modal */}
      {showImageViewer && (
        <PrescriptionImageViewer
          imageUrl={prescription.file_url}
          fileName={prescription.file_name || undefined}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </>
  );
}
