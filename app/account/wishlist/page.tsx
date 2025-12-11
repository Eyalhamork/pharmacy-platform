// app/account/wishlist/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default async function WishlistPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account/wishlist');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <p className="text-muted-foreground">
          Save your favorite products for later
        </p>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Wishlist feature coming soon</h3>
          <p className="text-muted-foreground">
            This is an optional feature that may be implemented in future updates
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
