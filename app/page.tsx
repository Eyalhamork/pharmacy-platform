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
  CreditCard,
  Heart,
  Zap,
  CheckCircle2,
  ArrowRight,
  Phone
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 py-16 md:py-24">
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
                    alt="MoPharma Hero"
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

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose MoPharma?
              </h2>
              <p className="text-lg text-gray-600">
                Experience the convenience of online pharmacy shopping with our reliable service
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-3xl">
                    🚚
                  </div>
                  <CardTitle className="text-xl">Fast Delivery</CardTitle>
                  <CardDescription className="text-base">
                    Get your medications delivered in 2-3 hours across Monrovia
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-3xl">
                    🛡️
                  </div>
                  <CardTitle className="text-xl">Quality Assured</CardTitle>
                  <CardDescription className="text-base">
                    All products verified, licensed by LMHRA, and properly stored
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-accent transition-colors hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-3xl">
                    💳
                  </div>
                  <CardTitle className="text-xl">Easy Payment</CardTitle>
                  <CardDescription className="text-base">
                    Pay with MTN Mobile Money or Cash on Delivery
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-3xl">
                    ⏰
                  </div>
                  <CardTitle className="text-xl">24/7 Ordering</CardTitle>
                  <CardDescription className="text-base">
                    Order anytime online, even when our physical store is closed
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
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

            <div className="text-center mt-8">
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
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Get your medications in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="relative">
                <div className="text-center">
                  <div className="h-20 w-20 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                    1
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Browse & Select</h3>
                  <p className="text-gray-600">
                    Search for medications or browse by category. Add items to your cart.
                  </p>
                </div>
                {/* Connecting Line - Hidden on mobile */}
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="h-20 w-20 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                    2
                  </div>
                  <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Order & Pay</h3>
                  <p className="text-gray-600">
                    Complete checkout and choose your payment method - Mobile Money or Cash.
                  </p>
                </div>
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
              </div>

              <div className="text-center">
                <div className="h-20 w-20 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">Get Delivered</h3>
                <p className="text-gray-600">
                  Receive your order at your doorstep in 2-3 hours. Fast and reliable!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
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
        <section className="py-20 bg-white">
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
