// app/account/layout.tsx
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import Link from 'next/link';
import { User, MapPin, Package, Heart, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Database } from '@/lib/types/database';

type UserProfile = Pick<Database['public']['Tables']['user_profiles']['Row'], 'first_name' | 'last_name'>;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account');
  }

  // Get user profile
  const { data: profile } = (await supabase
    .from('user_profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()) as { data: UserProfile | null };

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`
    : user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {displayName}
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <nav className="space-y-1">
                <AccountNavLink href="/account" icon={User}>
                  Dashboard
                </AccountNavLink>
                <AccountNavLink href="/account/profile" icon={Settings}>
                  Profile Settings
                </AccountNavLink>
                <AccountNavLink href="/account/addresses" icon={MapPin}>
                  Addresses
                </AccountNavLink>
                <AccountNavLink href="/account/orders" icon={Package}>
                  My Orders
                </AccountNavLink>
                <AccountNavLink href="/account/wishlist" icon={Heart}>
                  Wishlist
                </AccountNavLink>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function AccountNavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span>{children}</span>
    </Link>
  );
}
