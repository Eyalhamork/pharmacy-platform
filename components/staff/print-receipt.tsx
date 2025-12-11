'use client';

import { Database } from '@/lib/types/database';
import { formatCurrency } from '@/lib/utils';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

interface PrintReceiptProps {
  order: Order & {
    order_items: OrderItem[];
  };
}

export function PrintReceipt({ order }: PrintReceiptProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="print-receipt hidden print:block">
      <style jsx>{`
        @media print {
          .print-receipt {
            display: block !important;
            width: 100%;
            padding: 20px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.5;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .receipt-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .receipt-subtitle {
            font-size: 14px;
            margin-bottom: 3px;
          }
          .receipt-section {
            margin-bottom: 15px;
          }
          .receipt-section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
            border-bottom: 1px solid #000;
          }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
          }
          .receipt-items {
            margin: 15px 0;
          }
          .receipt-item {
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px dashed #ccc;
          }
          .receipt-item-name {
            font-weight: bold;
          }
          .receipt-item-details {
            display: flex;
            justify-content: space-between;
            margin-top: 3px;
          }
          .receipt-total {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px solid #000;
          }
          .receipt-total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 14px;
          }
          .receipt-grand-total {
            font-size: 18px;
            font-weight: bold;
            border-top: 2px solid #000;
            padding-top: 10px;
            margin-top: 10px;
          }
          .receipt-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            border-top: 2px solid #000;
            padding-top: 10px;
          }
        }
      `}</style>

      <div className="receipt-header">
        <div className="receipt-title">MoPharma</div>
        <div className="receipt-subtitle">Your Trusted Online Pharmacy</div>
        <div className="receipt-subtitle">Monrovia, Liberia</div>
        <div className="receipt-subtitle">Phone: +231-XXX-XXXX</div>
      </div>

      <div className="receipt-section">
        <div className="receipt-section-title">ORDER RECEIPT</div>
        <div className="receipt-row">
          <span>Order Number:</span>
          <span>#{order.order_number}</span>
        </div>
        <div className="receipt-row">
          <span>Date:</span>
          <span>{formatDate(order.created_at)}</span>
        </div>
        <div className="receipt-row">
          <span>Status:</span>
          <span>{formatStatus(order.order_status)}</span>
        </div>
      </div>

      <div className="receipt-section">
        <div className="receipt-section-title">CUSTOMER INFORMATION</div>
        <div className="receipt-row">
          <span>Name:</span>
          <span>{order.customer_name}</span>
        </div>
        <div className="receipt-row">
          <span>Phone:</span>
          <span>{order.customer_phone}</span>
        </div>
        {order.customer_email && (
          <div className="receipt-row">
            <span>Email:</span>
            <span>{order.customer_email}</span>
          </div>
        )}
      </div>

      {order.delivery_type === 'delivery' && order.delivery_address_snapshot && (
        <div className="receipt-section">
          <div className="receipt-section-title">DELIVERY ADDRESS</div>
          <div style={{ marginTop: '5px' }}>
            {(order.delivery_address_snapshot as any).street_address}
            {(order.delivery_address_snapshot as any).area && (
              <>, {(order.delivery_address_snapshot as any).area}</>
            )}
            <br />
            {(order.delivery_address_snapshot as any).city}
          </div>
          {(order.delivery_address_snapshot as any).additional_info && (
            <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
              Note: {(order.delivery_address_snapshot as any).additional_info}
            </div>
          )}
        </div>
      )}

      {order.delivery_type === 'pickup' && (
        <div className="receipt-section">
          <div className="receipt-section-title">PICKUP INFORMATION</div>
          <div style={{ marginTop: '5px' }}>Customer will pick up at pharmacy location</div>
        </div>
      )}

      <div className="receipt-section">
        <div className="receipt-section-title">ORDER ITEMS</div>
        <div className="receipt-items">
          {order.order_items.map((item, index) => (
            <div key={item.id} className="receipt-item">
              <div className="receipt-item-name">
                {index + 1}. {item.product_name}
              </div>
              {item.product_sku && (
                <div style={{ fontSize: '10px', color: '#666' }}>SKU: {item.product_sku}</div>
              )}
              <div className="receipt-item-details">
                <span>
                  {item.quantity} × {formatCurrency(item.unit_price)}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
              {item.requires_prescription && (
                <div style={{ fontSize: '10px', fontStyle: 'italic', marginTop: '3px' }}>
                  * Requires Prescription
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="receipt-total">
        <div className="receipt-total-row">
          <span>Subtotal:</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="receipt-total-row">
          <span>Delivery Fee:</span>
          <span>{formatCurrency(order.delivery_fee)}</span>
        </div>
        <div className="receipt-total-row receipt-grand-total">
          <span>TOTAL:</span>
          <span>{formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      <div className="receipt-section">
        <div className="receipt-section-title">PAYMENT INFORMATION</div>
        <div className="receipt-row">
          <span>Method:</span>
          <span>{order.payment_method.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div className="receipt-row">
          <span>Status:</span>
          <span>{formatStatus(order.payment_status)}</span>
        </div>
        {order.momo_transaction_id && (
          <div className="receipt-row">
            <span>Transaction ID:</span>
            <span>{order.momo_transaction_id}</span>
          </div>
        )}
        {order.paid_at && (
          <div className="receipt-row">
            <span>Paid At:</span>
            <span>{formatDate(order.paid_at)}</span>
          </div>
        )}
      </div>

      {order.customer_notes && (
        <div className="receipt-section">
          <div className="receipt-section-title">CUSTOMER NOTES</div>
          <div style={{ marginTop: '5px' }}>{order.customer_notes}</div>
        </div>
      )}

      {order.staff_notes && (
        <div className="receipt-section">
          <div className="receipt-section-title">STAFF NOTES</div>
          <div style={{ marginTop: '5px' }}>{order.staff_notes}</div>
        </div>
      )}

      <div className="receipt-footer">
        <div>Thank you for choosing MoPharma!</div>
        <div style={{ marginTop: '5px' }}>
          For support, contact us at support@mopharma.com
        </div>
        <div style={{ marginTop: '10px' }}>
          This is a computer-generated receipt and requires no signature.
        </div>
      </div>
    </div>
  );
}
