// app/account/addresses/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressForm } from '@/components/account/address-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function NewAddressPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account/addresses/new');
  }

  // Get delivery zones for dropdown
  const { data: deliveryZones } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/account/addresses">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Add New Address</h2>
          <p className="text-muted-foreground">
            Add a new delivery address to your account
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Address Details</CardTitle>
          <CardDescription>
            Fill in the information below to add a new delivery address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddressForm deliveryZones={deliveryZones || []} />
        </CardContent>
      </Card>
    </div>
  );
}
