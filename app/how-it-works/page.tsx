import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  ShoppingCart,
  CreditCard,
  Truck,
  CheckCircle,
  FileText,
  Shield,
  Clock,
  Phone
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'How It Works | MoPharma',
  description: 'Learn how to order medications online from MoPharma. Simple steps from browsing to delivery at your doorstep.',
};

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How MoPharma Works
            </h1>
            <p className="text-xl text-green-50">
              Getting your medications delivered is as easy as 1-2-3. 
              Follow our simple process for a seamless experience.
            </p>
          </div>
        </div>
      </div>

      {/* Main Steps */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-green-600">01</span>
                    <h2 className="text-2xl font-bold text-gray-900">Browse & Search</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Search for medications by name or browse our extensive catalog organized 
                    by categories. Use filters to find exactly what you need. Each product 
                    page includes detailed information about the medication, dosage, and usage 
                    instructions.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Search by medication name or condition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Filter by category, price, or prescription requirement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>View detailed product information and instructions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-orange-600">02</span>
                    <h2 className="text-2xl font-bold text-gray-900">Add to Cart</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Select the quantity you need and add items to your cart. You can continue 
                    shopping or proceed to checkout. Review your cart to ensure you have 
                    everything you need.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>Select quantity (check stock availability)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>View cart summary with total cost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>Update quantities or remove items anytime</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-green-600">03</span>
                    <h2 className="text-2xl font-bold text-gray-900">Upload Prescription (If Required)</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    If your cart contains prescription medications, you'll be prompted to upload 
                    a valid prescription. Our licensed pharmacists will review it before processing 
                    your order.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Upload clear photo or scan of prescription</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Prescription verified by licensed pharmacist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Get notified once prescription is approved</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-orange-600">04</span>
                    <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Select your preferred payment method. We offer secure MTN Mobile Money 
                    payments for instant processing, or Cash on Delivery if you prefer to 
                    pay when you receive your order.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>MTN Mobile Money - Pay instantly via MoMo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>Cash on Delivery - Pay when order arrives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>All transactions are secure and encrypted</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-green-600">05</span>
                    <h2 className="text-2xl font-bold text-gray-900">Delivery or Pickup</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Choose between home delivery or pharmacy pickup. For delivery, provide 
                    your address and we'll bring your order to you. Track your order status 
                    in real-time.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Same-day delivery available in Monrovia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Pickup option available at our pharmacy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Get WhatsApp updates on your order status</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose MoPharma?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">100% Genuine</h3>
                  <p className="text-sm text-gray-600">
                    All medications are sourced from licensed suppliers and verified 
                    by qualified pharmacists.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Same-day delivery available in Monrovia. Order before 2 PM for 
                    same-day service.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
                  <p className="text-sm text-gray-600">
                    Our licensed pharmacists are available to answer your questions 
                    and provide guidance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Browse our catalog and experience the convenience of online pharmacy 
            shopping today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
              <Link href="/products">
                <Search className="mr-2 h-5 w-5" />
                Browse Products
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-green-600 border-white hover:bg-green-600 hover:text-white">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
