// app/account/addresses/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import Link from 'next/link';
import { AddressCard } from '@/components/account/address-card';
import type { Database } from '@/lib/types/database';

type Address = Database['public']['Tables']['addresses']['Row'] & {
  delivery_zones: {
    id: string;
    name: string;
    delivery_fee: number;
    estimated_delivery_time: string | null;
  } | null;
};

export default async function AddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account/addresses');
  }

  // Get user addresses with delivery zone info
  const { data: addresses } = (await supabase
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
    .order('created_at', { ascending: false })) as { data: Address[] | null };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Delivery Addresses</h2>
          <p className="text-muted-foreground">
            Manage your saved delivery addresses
          </p>
        </div>
        <Button asChild>
          <Link href="/account/addresses/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Link>
        </Button>
      </div>

      {!addresses || addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-6">
              Add a delivery address to make checkout faster
            </p>
            <Button asChild>
              <Link href="/account/addresses/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  );
}
