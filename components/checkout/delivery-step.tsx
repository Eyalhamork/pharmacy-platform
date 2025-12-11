// components/checkout/delivery-step.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useCheckout } from '@/lib/store/checkout';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Home, Package, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/lib/hooks/use-toast';

interface Address {
  id: string;
  label: string | null;
  street_address: string;
  area: string | null;
  city: string;
  is_default: boolean;
  delivery_zones: {
    id: string;
    name: string;
    delivery_fee: number;
    estimated_delivery_time: string | null;
  } | null;
}

export function DeliveryStep() {
  const { toast } = useToast();
  const {
    deliveryType,
    selectedAddressId,
    setDeliveryType,
    setSelectedAddress,
    previousStep,
    nextStep,
  } = useCheckout();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const supabase = createClient();
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to continue',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('addresses')
        .select(`
          *,
          delivery_zones (
            id,
            name,
            delivery_fee,
            estimated_delivery_time
          )
        `)
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAddresses(data || []);

      // Auto-select default address if delivery type is delivery
      if (deliveryType === 'delivery' && !selectedAddressId && data && data.length > 0) {
        const defaultAddress = data.find((addr) => addr.is_default) || data[0];
        handleAddressSelect(defaultAddress);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load addresses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    if (address.delivery_zones) {
      setSelectedAddress(
        address.id,
        address.delivery_zones.id,
        address.delivery_zones.delivery_fee,
        address.delivery_zones.estimated_delivery_time
      );
    }
  };

  const handleContinue = () => {
    // Validate delivery method
    if (deliveryType === 'delivery') {
      if (!selectedAddressId) {
        toast({
          title: 'Address required',
          description: 'Please select a delivery address',
          variant: 'destructive',
        });
        return;
      }
    } else {
      // For pickup, reset delivery fee
      setSelectedAddress(null, null, 0, null);
    }

    setIsContinuing(true);
    // Move to next step (will be payment or prescription based on cart)
    nextStep();
  };

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  return (
    <div className="space-y-6">
      {/* Delivery Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={deliveryType}
            onValueChange={(value) => setDeliveryType(value as 'delivery' | 'pickup')}
          >
            <div className="space-y-4">
              {/* Delivery Option */}
              <div
                className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  deliveryType === 'delivery'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setDeliveryType('delivery')}
              >
                <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                <div className="flex-1">
                  <Label
                    htmlFor="delivery"
                    className="flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <MapPin className="h-5 w-5" />
                    Home Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get your order delivered to your doorstep
                  </p>
                </div>
              </div>

              {/* Pickup Option */}
              <div
                className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  deliveryType === 'pickup'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setDeliveryType('pickup')}
              >
                <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                <div className="flex-1">
                  <Label
                    htmlFor="pickup"
                    className="flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <Package className="h-5 w-5" />
                    Store Pickup
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Collect your order from our pharmacy
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    No delivery fee
                  </Badge>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Delivery Address Selection */}
      {deliveryType === 'delivery' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Select Delivery Address</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/addresses/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                <p className="text-muted-foreground mb-4">
                  Add a delivery address to continue
                </p>
                <Button asChild>
                  <Link href="/account/addresses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Link>
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedAddressId || ''}>
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <RadioGroupItem
                        value={address.id}
                        id={address.id}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          {address.label && (
                            <span className="font-semibold text-sm">
                              {address.label}
                            </span>
                          )}
                          {address.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 mt-1">
                          {address.street_address}
                        </p>
                        {address.area && (
                          <p className="text-sm text-gray-600">{address.area}</p>
                        )}
                        <p className="text-sm text-gray-600">{address.city}</p>

                        {address.delivery_zones && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {address.delivery_zones.name}
                              </span>
                              <span className="font-semibold">
                                ${address.delivery_zones.delivery_fee.toFixed(2)}
                              </span>
                            </div>
                            {address.delivery_zones.estimated_delivery_time && (
                              <p className="text-muted-foreground mt-1">
                                Est. delivery: {address.delivery_zones.estimated_delivery_time}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pharmacy Address (for pickup) */}
      {deliveryType === 'pickup' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Pickup Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">MoPharma</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Tubman Boulevard, Sinkor<br />
                  Monrovia, Liberia
                </p>
                <div className="text-sm">
                  <p className="font-medium mb-1">Operating Hours:</p>
                  <p className="text-muted-foreground">
                    Monday - Friday: 8:00 AM - 10:00 PM<br />
                    Saturday: 9:00 AM - 9:00 PM<br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Summary */}
      {deliveryType === 'delivery' && selectedAddress && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">
                  Delivering to {selectedAddress.label || 'selected address'}
                </p>
                {selectedAddress.delivery_zones && (
                  <p className="text-xs text-green-800 mt-1">
                    {selectedAddress.delivery_zones.estimated_delivery_time && 
                      `Estimated delivery: ${selectedAddress.delivery_zones.estimated_delivery_time}`
                    }
                  </p>
                )}
              </div>
              {selectedAddress.delivery_zones && (
                <div className="text-right">
                  <p className="text-xs text-green-800">Delivery Fee</p>
                  <p className="text-lg font-bold text-green-900">
                    ${selectedAddress.delivery_zones.delivery_fee.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={previousStep} disabled={isContinuing}>
          Back to Cart
        </Button>
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={isContinuing || (deliveryType === 'delivery' && !selectedAddressId)}
        >
          {isContinuing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
