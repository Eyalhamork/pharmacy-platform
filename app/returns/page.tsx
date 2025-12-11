import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Shield
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy | MoPharma',
  description: 'Understand MoPharma\'s returns and refund policy for medications and health products. Learn about eligible returns and our quality guarantee.',
};

export default function ReturnsPolicyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <RefreshCw className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Returns & Refund Policy
            </h1>
            <p className="text-xl text-green-50">
              Your satisfaction and safety are our top priorities
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Important Notice */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Important: Medication Return Restrictions
                  </h3>
                  <p className="text-gray-700">
                    Due to health, safety, and pharmaceutical regulations in Liberia, we cannot 
                    accept returns of opened or used medications. This policy is in place to 
                    protect all our customers and comply with LMHRA (Liberia Medicines & Health 
                    Products Regulatory Authority) guidelines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligible Returns */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Eligible for Return
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Wrong Item Delivered</h3>
                      <p className="text-gray-600">
                        If you received a different product than what you ordered, contact us 
                        within 24 hours with photos. We'll arrange to deliver the correct item 
                        and collect the wrong one at no cost.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Damaged or Defective Products</h3>
                      <p className="text-gray-600">
                        Products that arrive damaged, with broken seals, or in defective condition 
                        can be returned within 24 hours. Please provide photos of the damage when 
                        contacting us.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Expired Medications</h3>
                      <p className="text-gray-600">
                        If you receive a product that is expired or will expire within 3 months, 
                        contact us immediately for a replacement or full refund. This should never 
                        happen, but we're committed to making it right if it does.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Unopened Products with Sealed Packaging</h3>
                      <p className="text-gray-600">
                        Non-prescription items that are unopened with intact seals may be eligible 
                        for return within 7 days of delivery. The product must be in its original 
                        condition and packaging.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Not Eligible */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Not Eligible for Return
            </h2>
            <div className="space-y-4">
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Opened or Used Medications</h3>
                      <p className="text-gray-600">
                        Any medication that has been opened, used, or has a broken seal cannot 
                        be returned for health and safety reasons.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Prescription Medications</h3>
                      <p className="text-gray-600">
                        Once dispensed, prescription medications cannot be returned unless they 
                        were incorrectly filled, damaged, or expired.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Change of Mind</h3>
                      <p className="text-gray-600">
                        We cannot accept returns simply because you changed your mind or no 
                        longer need the medication. Please ensure you need the medication before 
                        ordering.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Products Past Return Window</h3>
                      <p className="text-gray-600">
                        Returns must be initiated within the specified timeframes. Late return 
                        requests cannot be accommodated.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Return Process */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Return an Item
            </h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Contact Us Immediately</h3>
                      <p className="text-gray-600">
                        Call us at +231-XXX-XXX-XXX or send a WhatsApp message within the 
                        return window (24 hours for wrong/damaged items, 7 days for unopened 
                        non-prescription items).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Provide Required Information</h3>
                      <p className="text-gray-600">
                        Share your order number, photos of the product (if damaged/wrong), and 
                        explain the issue. Our team will review and approve the return if eligible.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Return Approved</h3>
                      <p className="text-gray-600">
                        If your return is approved, we'll arrange for pickup or provide 
                        instructions for returning the item to our pharmacy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Refund or Replacement</h3>
                      <p className="text-gray-600">
                        Once we receive and verify the returned item, we'll process your refund 
                        or send the replacement within 3-5 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Refund Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Refund Information
            </h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Refund Timeline</h3>
                    <p className="text-gray-600">
                      Refunds are processed within <strong>3-5 business days</strong> after we 
                      receive and verify the returned item.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Refund Method</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>MTN Mobile Money:</strong> Refunds are sent back to the same 
                          MoMo account used for payment
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Cash on Delivery:</strong> Refunds can be collected at our 
                          pharmacy or sent via MTN Mobile Money (if you provide your number)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">What's Refunded</h3>
                    <p className="text-gray-600">
                      You'll receive a full refund of the product cost. Delivery fees are 
                      refundable only if the issue was our error (wrong item, damaged product, etc.).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality Guarantee */}
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-4">Our Quality Guarantee</h2>
                  <p className="text-green-50 mb-4">
                    At MoPharma, we stand behind the quality of every product we sell. All 
                    medications are sourced from licensed suppliers and verified by our 
                    qualified pharmacists.
                  </p>
                  <ul className="space-y-2 text-green-50">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>100% genuine medications, never counterfeit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>Proper storage and handling at all times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>Regular expiry date checks on all inventory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>Licensed by LMHRA and compliant with all regulations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Returns */}
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need to Return Something?
              </h2>
              <p className="text-gray-600 mb-6">
                Contact our customer service team and we'll help you through the process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Contact Us
                </a>
                <a 
                  href="/faq" 
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  View FAQs
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
