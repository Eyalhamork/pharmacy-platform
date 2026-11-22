// File: components/shared/user-menu.tsx
// User menu dropdown for authenticated users with immediate sign-out and white hover links

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/contexts/auth-context';
import { signOut as supabaseAuthSignOut } from '@/lib/supabase/auth';
import { useToast } from '@/lib/hooks/use-toast';

export function UserMenu() {
  const { user, profile, loading, signOut: contextSignOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    
    try {
      // Clear React state immediately
      await contextSignOut();
      await supabaseAuthSignOut();

      // Clear any cached auth tokens in localStorage
      if (typeof window !== 'undefined') {
        for (const key of Object.keys(localStorage)) {
          if (key.includes('supabase') || key.includes('auth')) {
            try { localStorage.removeItem(key); } catch (e) {}
          }
        }
      }

      // Hard redirect to clear all server-side cookie state
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
      window.location.href = '/login';
    }
  };

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user.email?.split('@')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="hidden md:inline text-sm font-medium">
            {displayName}
          </span>
          <ChevronDown className="h-4 w-4 hidden md:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg border-border">
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem asChild className="group cursor-pointer rounded-md focus:bg-primary focus:text-white hover:bg-primary hover:text-white data-[highlighted]:bg-primary data-[highlighted]:text-white transition-colors">
          <Link href="/account" className="flex items-center w-full px-2 py-1.5 text-sm text-foreground group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white">
            <User className="mr-2 h-4 w-4 text-primary group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors" />
            <span className="group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors">My Account</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="group cursor-pointer rounded-md focus:bg-primary focus:text-white hover:bg-primary hover:text-white data-[highlighted]:bg-primary data-[highlighted]:text-white transition-colors">
          <Link href="/orders" className="flex items-center w-full px-2 py-1.5 text-sm text-foreground group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white">
            <Package className="mr-2 h-4 w-4 text-primary group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors" />
            <span className="group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors">My Orders</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="group cursor-pointer rounded-md focus:bg-primary focus:text-white hover:bg-primary hover:text-white data-[highlighted]:bg-primary data-[highlighted]:text-white transition-colors">
          <Link href="/account/settings" className="flex items-center w-full px-2 py-1.5 text-sm text-foreground group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white">
            <Settings className="mr-2 h-4 w-4 text-primary group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors" />
            <span className="group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors">Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={signingOut}
          className="group cursor-pointer rounded-md px-2 py-1.5 text-sm text-destructive focus:bg-destructive focus:text-white hover:bg-destructive hover:text-white data-[highlighted]:bg-destructive data-[highlighted]:text-white transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4 text-destructive group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors" />
          <span className="group-hover:text-white group-focus:text-white group-data-[highlighted]:text-white transition-colors">
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
