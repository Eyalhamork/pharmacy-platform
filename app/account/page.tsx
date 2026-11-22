// app/account/page.tsx
// Patient Account Dashboard — prescriptions, orders, refills & health info
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  MapPin,
  Clock,
  ShoppingBag,
  FileCheck,
  AlertCircle,
  Heart,
  Phone,
  Pill,
  RefreshCw,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import type { Database } from '@/lib/types/database';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type Order = {
  id: string;
  order_number: string;
  total_amount: number;
  order_status: string;
  created_at: string;
};
type Prescription = {
  id: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  file_name: string | null;
  orders: {
    order_number: string;
  } | null;
};

export default async function AccountDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user stats
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: addressesCount } = await supabase
    .from('addresses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get recent orders
  const { data: recentOrders } = (await supabase
    .from('orders')
    .select('id, order_number, total_amount, order_status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)) as { data: Order[] | null };

  // Get user profile
  const { data: profile } = (await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()) as { data: UserProfile | null };

  // Get user's prescriptions with order info
  const { data: prescriptions } = (await supabase
    .from('prescriptions')
    .select('id, verification_status, uploaded_at, file_name, orders(order_number)')
    .order('uploaded_at', { ascending: false })
    .limit(5)) as { data: Prescription[] | null };

  const userPrescriptions = (prescriptions || []) as Prescription[];

  // Calculate prescription stats
  const pendingRx = userPrescriptions.filter(p => p.verification_status === 'pending').length;
  const approvedRx = userPrescriptions.filter(p => p.verification_status === 'approved').length;
  const rejectedRx = userPrescriptions.filter(p => p.verification_status === 'rejected').length;

  // Calculate total spent
  const { data: completedOrders } = (await supabase
    .from('orders')
    .select('total_amount')
    .eq('user_id', user.id)
    .eq('payment_status', 'paid')) as { data: Array<{ total_amount: number }> | null };

  const totalSpent = (completedOrders || []).reduce(
    (sum, o) => sum + parseFloat(o.total_amount.toString()), 0
  );

  // Get last completed order items for quick reorder
  const { data: lastCompletedOrder } = (await supabase
    .from('orders')
    .select('id, order_number, order_items(product_name, quantity, unit_price, product_id)')
    .eq('user_id', user.id)
    .eq('order_status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()) as { data: any | null };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{addressesCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Delivery addresses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              Since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      {(!profile?.first_name || !profile?.phone) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg">Complete Your Profile</CardTitle>
            <CardDescription>
              Add your personal information to improve your shopping experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/account/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Prescription Status + Quick Reorder side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Prescription Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              My Prescriptions
            </CardTitle>
            <CardDescription>Track your prescription verification status</CardDescription>
          </CardHeader>
          <CardContent>
            {userPrescriptions.length === 0 ? (
              <div className="text-center py-6">
                <Pill className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">No prescriptions uploaded yet</p>
                <p className="text-xs text-muted-foreground">
                  Upload a prescription when ordering medications that require one
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Summary badges */}
                <div className="flex gap-2 mb-4">
                  {pendingRx > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3" /> {pendingRx} Pending
                    </span>
                  )}
                  {approvedRx > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3" /> {approvedRx} Approved
                    </span>
                  )}
                  {rejectedRx > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3" /> {rejectedRx} Rejected
                    </span>
                  )}
                </div>

                {/* Recent prescriptions list */}
                {userPrescriptions.slice(0, 3).map((rx) => (
                  <div key={rx.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        rx.verification_status === 'approved' ? 'bg-green-100 text-green-600' :
                        rx.verification_status === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {rx.verification_status === 'approved' ? <CheckCircle2 className="h-4 w-4" /> :
                         rx.verification_status === 'rejected' ? <XCircle className="h-4 w-4" /> :
                         <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{rx.file_name || 'Prescription'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(rx.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <RxStatusBadge status={rx.verification_status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Reorder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Quick Reorder
            </CardTitle>
            <CardDescription>Reorder from your previous purchases</CardDescription>
          </CardHeader>
          <CardContent>
            {!lastCompletedOrder ? (
              <div className="text-center py-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">No completed orders yet</p>
                <Button asChild size="sm">
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  From order #{lastCompletedOrder.order_number}
                </p>
                <div className="space-y-2 mb-4">
                  {((lastCompletedOrder as any).order_items || []).slice(0, 4).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <Pill className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{item.product_name}</span>
                        <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium">${parseFloat(item.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link href="/products">
                    Browse Products to Reorder <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest order history</CardDescription>
        </CardHeader>
        <CardContent>
          {!recentOrders || recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                Start shopping to see your orders here
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                    <StatusBadge status={order.order_status} />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/account/orders">View All Orders</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions + Pharmacy Info */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="sm">
                <Link href="/account/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Delivery Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="sm">
                <Link href="/account/addresses">Manage</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">My Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/account/wishlist">View Wishlist</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Track Order</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/track-order">Track Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pharmacy Info Card */}
        <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-900">
              <Heart className="h-5 w-5 text-teal-600" />
              PharmaCare Info
            </CardTitle>
            <CardDescription className="text-teal-700">
              Your trusted online pharmacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-teal-900">Operating Hours</p>
                <p className="text-xs text-teal-700">Mon–Sat: 8:00 AM – 8:00 PM</p>
                <p className="text-xs text-teal-700">Sun: 10:00 AM – 4:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-teal-900">Contact Us</p>
                <p className="text-xs text-teal-700">Call/WhatsApp: +231-000-0000</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-teal-900">Delivery</p>
                <p className="text-xs text-teal-700">Same-day delivery available within Monrovia</p>
              </div>
            </div>
            <div className="pt-2 border-t border-teal-200">
              <p className="text-xs text-teal-700 italic">
                💡 Tip: Upload your prescription during checkout for faster order processing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800' },
    preparing: { label: 'Preparing', className: 'bg-purple-100 text-purple-800' },
    ready: { label: 'Ready', className: 'bg-indigo-100 text-indigo-800' },
    out_for_delivery: { label: 'Out for Delivery', className: 'bg-orange-100 text-orange-800' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

function RxStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: 'Under Review', className: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Verified', className: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  };

  const c = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}
