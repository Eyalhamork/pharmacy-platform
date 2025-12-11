// components/checkout/review-confirm-step.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCheckout } from '@/lib/store/checkout';
import { useCart } from '@/lib/store/cart';
import { createClient } from '@/lib/supabase/client';
import { trackPurchase } from '@/components/analytics';
import {
  Package,
  MapPin,
  CreditCard,
  FileText,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import Image from 'next/image';

export function ReviewConfirmStep() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, clearCart, getSubtotal } = useCart();
  const {
    deliveryType,
    selectedAddressId,
    deliveryFee,
    estimatedDeliveryTime,
    paymentMethod,
    momoPhoneNumber,
    prescriptionFiles,
    customerNotes,
    setCustomerNotes,
    previousStep,
    resetCheckout,
  } = useCheckout();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const subtotal = getSubtotal();
  const total = subtotal + deliveryFee;

  // Load selected address
  useState(() => {
    if (selectedAddressId) {
      loadAddress();
    }
  });

  const loadAddress = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('addresses')
        .select(`
          *,
          delivery_zones (
            name,
            delivery_fee,
            estimated_delivery_time
          )
        `)
        .eq('id', selectedAddressId)
        .single();

      setSelectedAddress(data);
    } catch (error) {
      console.error('Error loading address:', error);
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to place an order');
      }

      // Get user profile for customer details
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, phone, whatsapp_number')
        .eq('id', user.id)
        .single();

      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_sku: item.brand_name || item.generic_name,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
          requires_prescription: item.requires_prescription,
        })),
        customer: {
          name: profile?.first_name
            ? `${profile.first_name} ${profile.last_name || ''}`
            : user.email?.split('@')[0] || 'Customer',
          phone: profile?.phone || '',
          whatsapp: profile?.whatsapp_number || '',
          email: user.email || '',
        },
        delivery: {
          type: deliveryType,
          address_id: deliveryType === 'delivery' ? selectedAddressId : null,
          address_snapshot: deliveryType === 'delivery' ? selectedAddress : null,
          fee: deliveryFee,
        },
        payment: {
          method: paymentMethod,
          momo_phone: paymentMethod === 'mobile_money' ? momoPhoneNumber : null,
        },
        subtotal,
        total,
        customer_notes: customerNotes || null,
        has_prescription_items: items.some((item) => item.requires_prescription),
      };

      // Call order creation API
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      const { order } = await response.json();

      // Upload prescription files if any
      if (prescriptionFiles.length > 0) {
        await uploadPrescriptions(order.id);
      }

      // Track purchase event
      trackPurchase({
        orderId: order.order_number || order.id,
        total: total,
        shipping: deliveryFee,
        paymentMethod: paymentMethod || 'cash_on_delivery',
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      // Clear cart and checkout state
      clearCart();
      resetCheckout();

      // Redirect to order confirmation
      router.push(`/orders/${order.id}/confirmation`);
    } catch (error: any) {
      toast({
        title: 'Error placing order',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsPlacingOrder(false);
    }
  };

  const uploadPrescriptions = async (orderId: string) => {
    try {
      const supabase = createClient();

      for (const file of prescriptionFiles) {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${orderId}-${Date.now()}.${fileExt}`;
        const filePath = `prescriptions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('prescriptions')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('prescriptions').getPublicUrl(filePath);

        // Create prescription record
        await supabase.from('prescriptions').insert({
          order_id: orderId,
          file_url: publicUrl,
          file_type: file.type,
          file_name: file.name,
          file_size: file.size,
        });
      }
    } catch (error) {
      console.error('Error uploading prescriptions:', error);
      // Don't throw - order is already created
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  {item.generic_name && (
                    <p className="text-xs text-muted-foreground">
                      {item.generic_name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </span>
                    {item.requires_prescription && (
                      <Badge variant="secondary" className="text-xs">
                        Rx
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deliveryType === 'delivery' ? (
            <div>
              <p className="font-semibold mb-2">Delivery Address</p>
              {selectedAddress ? (
                <div className="text-sm text-muted-foreground">
                  {selectedAddress.label && (
                    <p className="font-medium text-foreground">
                      {selectedAddress.label}
                    </p>
                  )}
                  <p>{selectedAddress.street_address}</p>
                  {selectedAddress.area && <p>{selectedAddress.area}</p>}
                  <p>{selectedAddress.city}</p>
                  {selectedAddress.delivery_zones && (
                    <div className="mt-2 pt-2 border-t">
                      <p>Zone: {selectedAddress.delivery_zones.name}</p>
                      <p>Fee: ${deliveryFee.toFixed(2)}</p>
                      {estimatedDeliveryTime && (
                        <p>Est. Time: {estimatedDeliveryTime}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}
            </div>
          ) : (
            <div>
              <p className="font-semibold mb-2">Store Pickup</p>
              <p className="text-sm text-muted-foreground">
                You'll collect your order from our pharmacy at Tubman Boulevard,
                Sinkor, Monrovia
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethod === 'mobile_money' ? (
            <div>
              <p className="font-semibold">MTN Mobile Money</p>
              <p className="text-sm text-muted-foreground mt-1">
                Phone: {momoPhoneNumber}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You'll receive a payment prompt after placing your order
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold">Cash on Delivery</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pay with cash when your order is delivered
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prescription Status */}
      {prescriptionFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prescription Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {prescriptionFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{file.name}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                Your prescription will be verified by our pharmacist before
                processing your order
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Special instructions or comments</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Please call before delivery, Allergies, etc."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium">${deliveryFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={previousStep} disabled={isPlacingOrder}>
          Back
        </Button>
        <Button onClick={handlePlaceOrder} size="lg" disabled={isPlacingOrder}>
          {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}
