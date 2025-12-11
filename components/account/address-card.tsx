// components/account/address-card.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MapPin, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface AddressCardProps {
  address: {
    id: string;
    label: string | null;
    street_address: string;
    area: string | null;
    city: string;
    additional_info: string | null;
    is_default: boolean;
    delivery_zones?: {
      name: string;
      delivery_fee: number;
      estimated_delivery_time: string | null;
    } | null;
  };
}

export function AddressCard({ address }: AddressCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', address.id);

      if (error) throw error;

      toast({
        title: 'Address deleted',
        description: 'The address has been removed from your account.',
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete address',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSetDefault = async () => {
    if (address.is_default) return;

    setIsSettingDefault(true);

    try {
      const supabase = createClient();
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      // First, unset all other addresses as default
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set this address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', address.id);

      if (error) throw error;

      toast({
        title: 'Default address updated',
        description: 'This address is now your default delivery address.',
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to set default address',
        variant: 'destructive',
      });
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <>
      <Card className={address.is_default ? 'border-primary' : ''}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                {address.label && (
                  <h3 className="font-semibold">{address.label}</h3>
                )}
                {address.is_default && (
                  <Badge variant="secondary" className="mt-1">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Default
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground mb-4">
            <p>{address.street_address}</p>
            {address.area && <p>{address.area}</p>}
            <p>{address.city}</p>
            {address.additional_info && (
              <p className="text-xs italic">{address.additional_info}</p>
            )}
          </div>

          {address.delivery_zones && (
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Delivery Zone
              </p>
              <p className="text-sm font-semibold">
                {address.delivery_zones.name}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Fee: ${address.delivery_zones.delivery_fee.toFixed(2)}</span>
                {address.delivery_zones.estimated_delivery_time && (
                  <span>Time: {address.delivery_zones.estimated_delivery_time}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!address.is_default && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefault}
                disabled={isSettingDefault}
              >
                {isSettingDefault ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Star className="h-4 w-4 mr-2" />
                )}
                Set as Default
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href={`/account/addresses/${address.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
