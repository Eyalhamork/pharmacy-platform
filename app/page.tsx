import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import {
  ShoppingBag,
  Truck,
  Shield,
  ShieldCheck,
  CreditCard,
  Heart,
  Zap,
  CheckCircle2,
  ArrowRight,
  Phone,
  Clock,
  FileCheck
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-6 md:pb-12">
          <div className="container mx-auto px-4 pt-10 md:pt-16 pb-16 md:pb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-accent text-accent-foreground">
                  Fast Delivery • Licensed Pharmacy • Trusted Service
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Quality Medicines
                  <span className="block text-primary mt-2">Delivered Fast</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                  Order your medications online and get them delivered to your doorstep in 2-3 hours.
                  Pay with MTN Mobile Money or Cash on Delivery.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="text-lg h-14 px-8">
                    <Link href="/products">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Shop Now
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8">
                    <Link href="/how-it-works">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div>
                    <div className="text-3xl font-bold text-primary">2-3h</div>
                    <div className="text-sm text-gray-600">Delivery Time</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">100%</div>
                    <div className="text-sm text-gray-600">Licensed</div>
                  </div>
                </div>
              </div>

              {/* Hero Image/Illustration */}
              <div className="relative hidden lg:block">
                <div className="relative h-[500px] w-full rounded-3xl overflow-hidden">
                  <Image
                    src="/images/hero-2.png"
                    alt="PharmaCare Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Floating Cards */}
                  <div className="absolute top-16 right-10 bg-white p-4 rounded-xl shadow-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-semibold">Order Confirmed</div>
                        <div className="text-sm text-gray-600">2 mins ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-20 left-10 bg-white p-4 rounded-xl shadow-xl">
                    <div className="flex items-center gap-3">
                      <Truck className="h-8 w-8 text-accent" />
                      <div>
                        <div className="font-semibold">Out for Delivery</div>
                        <div className="text-sm text-gray-600">Arriving soon</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Choose Us Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50/60">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 px-4 py-1 text-sm font-medium">
                Why Patients Trust Us
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                Healthcare Reimagined for Your Convenience
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Combining genuine pharmaceutical care with modern digital technology. Safe, certified, and delivered right to your door.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Fast Delivery */}
              <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Truck className="h-7 w-7" />
                </div>
                <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 mb-3">
                  Same-Day Delivery
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fast 2-3h Delivery</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fast, temperature-conscious delivery across Monrovia so you never have to wait for vital medicine.
                </p>
              </div>

              {/* Card 2: Quality Assured */}
              <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3">
                  LMHRA Certified
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Genuine Care</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All medications are verified by licensed pharmacists, compliant with regulations, and stored properly.
                </p>
              </div>

              {/* Card 3: Easy Payments */}
              <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-7 w-7" />
                </div>
                <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 mb-3">
                  MoMo & Cash
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Payments</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pay seamlessly using MTN Mobile Money with instant confirmation, or pay with cash upon arrival.
                </p>
              </div>

              {/* Card 4: 24/7 Digital Care */}
              <div className="group relative bg-white rounded-2xl p-6 border border-gray-200/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-7 w-7" />
                </div>
                <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 mb-3">
                  Always Open
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Easy Ordering</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Order anytime from your phone or computer, upload prescriptions easily, and track progress live.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600">
                Browse our wide selection of health products and medications
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Pain Relief', icon: '💊', href: '/products?category=pain-relief', color: 'bg-red-50 hover:bg-red-100' },
                { name: 'Antibiotics', icon: '🔬', href: '/products?category=antibiotics', color: 'bg-blue-50 hover:bg-blue-100' },
                { name: 'Vitamins', icon: '🌿', href: '/products?category=vitamins-supplements', color: 'bg-green-50 hover:bg-green-100' },
                { name: 'Cold & Flu', icon: '🤧', href: '/products?category=cold-flu', color: 'bg-purple-50 hover:bg-purple-100' },
                { name: 'First Aid', icon: '🩹', href: '/products?category=first-aid', color: 'bg-orange-50 hover:bg-orange-100' },
                { name: 'Baby Care', icon: '👶', href: '/products?category=baby-care', color: 'bg-pink-50 hover:bg-pink-100' },
                { name: 'Personal Care', icon: '🧴', href: '/products?category=personal-care', color: 'bg-indigo-50 hover:bg-indigo-100' },
                { name: 'Diabetes Care', icon: '💉', href: '/products?category=diabetes-care', color: 'bg-teal-50 hover:bg-teal-100' },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`${category.color} p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all group text-center`}
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{category.name}</h3>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Button asChild size="lg" variant="outline">
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 md:py-16 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 px-4 py-1 text-sm font-medium">
                Simple 3-Step Process
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ordering genuine medications and wellness essentials is quick, secure, and hassle-free.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="relative bg-gradient-to-b from-gray-50/50 to-white rounded-3xl p-8 border border-gray-200/80 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                      Step 01
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Browse & Select</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Search 500+ verified medicines, wellness supplements, or first aid essentials. Upload a doctor's prescription with one tap if required.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Instant Rx upload & search
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative bg-gradient-to-b from-gray-50/50 to-white rounded-3xl p-8 border border-gray-200/80 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground bg-accent/20 px-3 py-1.5 rounded-full">
                      Step 02
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                      <CreditCard className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Order & Pay Securely</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Provide your delivery address and choose your payment method: seamless MTN Mobile Money or Cash on Delivery upon inspection.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> MoMo or Cash on Delivery
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative bg-gradient-to-b from-gray-50/50 to-white rounded-3xl p-8 border border-gray-200/80 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/60 px-3 py-1.5 rounded-full">
                      Step 03
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm">
                      <Truck className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Doorstep Delivery</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Follow your delivery driver in real-time. Receive your climate-protected, tamper-sealed medication parcel within 2–3 hours.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Live tracking & sealed parcel
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 md:py-14 bg-gradient-to-br from-primary to-secondary text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <div className="text-3xl font-bold mb-2">1000+</div>
                <div className="text-primary-foreground/80">Happy Customers</div>
              </div>
              <div>
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-primary-foreground/80">Licensed & Safe</div>
              </div>
              <div>
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <div className="text-3xl font-bold mb-2">2-3h</div>
                <div className="text-primary-foreground/80">Fast Delivery</div>
              </div>
              <div>
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-primary-foreground/80">Quality Products</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Order Your Medications?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Browse our full catalog of quality medicines and health products.
                Get fast delivery across Monrovia today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg h-14 px-8">
                  <Link href="/products">
                    Start Shopping
                    <ShoppingBag className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8">
                  <a href="tel:+231777123456">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
