// components/account/address-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/lib/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface AddressFormProps {
  deliveryZones: Array<{
    id: string;
    name: string;
    delivery_fee: number;
    estimated_delivery_time: string | null;
  }>;
  initialData?: {
    id: string;
    label: string | null;
    street_address: string;
    area: string | null;
    city: string;
    delivery_zone_id: string | null;
    additional_info: string | null;
    is_default: boolean;
  };
  mode?: 'create' | 'edit';
}

export function AddressForm({
  deliveryZones,
  initialData,
  mode = 'create',
}: AddressFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    street_address: initialData?.street_address || '',
    area: initialData?.area || '',
    city: initialData?.city || 'Monrovia',
    delivery_zone_id: initialData?.delivery_zone_id || '',
    additional_info: initialData?.additional_info || '',
    is_default: initialData?.is_default || false,
  });

  const selectedZone = deliveryZones.find((z) => z.id === formData.delivery_zone_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      if (mode === 'create') {
        // If this is default, unset other defaults first
        if (formData.is_default) {
          await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id);
        }

        // Create new address
        const { error } = await supabase.from('addresses').insert({
          user_id: user.id,
          label: formData.label || null,
          street_address: formData.street_address,
          area: formData.area || null,
          city: formData.city,
          delivery_zone_id: formData.delivery_zone_id || null,
          additional_info: formData.additional_info || null,
          is_default: formData.is_default,
        });

        if (error) throw error;

        toast({
          title: 'Address added',
          description: 'Your new address has been saved successfully.',
        });
      } else {
        // If this is default, unset other defaults first
        if (formData.is_default) {
          await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
            .neq('id', initialData!.id);
        }

        // Update existing address
        const { error } = await supabase
          .from('addresses')
          .update({
            label: formData.label || null,
            street_address: formData.street_address,
            area: formData.area || null,
            city: formData.city,
            delivery_zone_id: formData.delivery_zone_id || null,
            additional_info: formData.additional_info || null,
            is_default: formData.is_default,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData!.id);

        if (error) throw error;

        toast({
          title: 'Address updated',
          description: 'Your address has been updated successfully.',
        });
      }

      router.push('/account/addresses');
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${mode} address`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="label">Address Label (Optional)</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="e.g. Home, Office, Mom's House"
        />
        <p className="text-xs text-muted-foreground">
          Give this address a name to identify it easily
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street_address">Street Address *</Label>
        <Textarea
          id="street_address"
          value={formData.street_address}
          onChange={(e) =>
            setFormData({ ...formData, street_address: e.target.value })
          }
          placeholder="House number, street name, building name"
          required
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="area">Area/Neighborhood</Label>
          <Input
            id="area"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="e.g. Sinkor, Congo Town"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Monrovia"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery_zone">Delivery Zone *</Label>
        <Select
          value={formData.delivery_zone_id}
          onValueChange={(value) =>
            setFormData({ ...formData, delivery_zone_id: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your delivery zone" />
          </SelectTrigger>
          <SelectContent>
            {deliveryZones.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.name} - ${zone.delivery_fee.toFixed(2)}
                {zone.estimated_delivery_time &&
                  ` (${zone.estimated_delivery_time})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedZone && (
          <p className="text-xs text-muted-foreground">
            Delivery fee: ${selectedZone.delivery_fee.toFixed(2)}
            {selectedZone.estimated_delivery_time &&
              ` • Est. time: ${selectedZone.estimated_delivery_time}`}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional_info">Additional Information (Optional)</Label>
        <Textarea
          id="additional_info"
          value={formData.additional_info}
          onChange={(e) =>
            setFormData({ ...formData, additional_info: e.target.value })
          }
          placeholder="Landmarks, gate codes, special delivery instructions"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_default: checked as boolean })
          }
        />
        <Label
          htmlFor="is_default"
          className="text-sm font-normal cursor-pointer"
        >
          Set as default delivery address
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Add Address' : 'Update Address'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
