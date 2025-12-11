// app/account/addresses/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressForm } from '@/components/account/address-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/lib/types/database';

type Address = Database['public']['Tables']['addresses']['Row'];
type DeliveryZone = Database['public']['Tables']['delivery_zones']['Row'];

interface EditAddressPageProps {
  params: {
    id: string;
  };
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account/addresses');
  }

  // Get the address
  const { data: address, error } = (await supabase
    .from('addresses')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()) as { data: Address | null; error: any };

  if (error || !address) {
    notFound();
  }

  // Get delivery zones for dropdown
  const { data: deliveryZones } = (await supabase
    .from('delivery_zones')
    .select('*')
    .eq('is_active', true)
    .order('name')) as { data: DeliveryZone[] | null };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/account/addresses">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Edit Address</h2>
          <p className="text-muted-foreground">
            Update your delivery address information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Address Details</CardTitle>
          <CardDescription>
            Update the information below to modify this address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddressForm
            deliveryZones={deliveryZones || []}
            initialData={address}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
