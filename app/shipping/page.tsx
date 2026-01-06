import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import {
  Truck,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Shipping & Delivery | Lucky Pharmacy',
  description: 'Learn about Lucky Pharmacy\'s delivery options, zones, fees, and timelines. Fast, reliable delivery across Monrovia and beyond.',
};

export default function ShippingDeliveryPage() {
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
                  <Truck className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Shipping & Delivery
              </h1>
              <p className="text-xl text-green-50">
                Fast, reliable delivery to your doorstep or convenient pharmacy pickup
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Delivery Options */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Delivery Options
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Home Delivery
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get your medications delivered directly to your doorstep. Our reliable
                      delivery partners ensure your order arrives safely and on time.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Same-day delivery in Monrovia</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Secure packaging for all items</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Real-time order tracking</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>WhatsApp delivery updates</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Pharmacy Pickup
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Prefer to collect your order yourself? Choose pharmacy pickup at
                      checkout and pick up your medications at your convenience.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>No delivery fee</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Ready within 2-4 hours</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>WhatsApp notification when ready</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Consult pharmacist in person</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Delivery Timeline
              </h2>
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Same-Day Delivery (Monrovia)
                        </h3>
                        <p className="text-gray-600">
                          Orders placed before <strong>2:00 PM</strong> on business days will be
                          delivered the same day. Orders after 2:00 PM will be delivered the next
                          business day.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Next-Day Delivery (Surrounding Areas)
                        </h3>
                        <p className="text-gray-600">
                          For areas outside central Monrovia but within our delivery zones, orders
                          are typically delivered within 1-2 business days.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          Pharmacy Pickup
                        </h3>
                        <p className="text-gray-600">
                          Orders are typically ready for pickup within <strong>2-4 hours</strong>
                          during business hours. You'll receive a WhatsApp notification when your
                          order is ready.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong>Note:</strong> Prescription orders require verification by our
                      pharmacist before processing, which may add 2-4 hours to the delivery time.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Delivery Zones & Fees */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Delivery Zones & Fees
              </h2>
              <Card>
                <CardContent className="p-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Zone</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Area Coverage</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Delivery Fee</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-gray-900">Zone 1</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            Central Monrovia, Sinkor, Congo Town
                          </td>
                          <td className="py-4 px-4 text-right font-medium text-gray-900">
                            LD 100
                          </td>
                          <td className="py-4 px-4 text-right text-gray-600">
                            Same day
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-orange-600" />
                              <span className="font-medium text-gray-900">Zone 2</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            Paynesville, Red Light, Gardnersville
                          </td>
                          <td className="py-4 px-4 text-right font-medium text-gray-900">
                            LD 200
                          </td>
                          <td className="py-4 px-4 text-right text-gray-600">
                            Same/Next day
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-900">Zone 3</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            Caldwell, Duala, New Kru Town
                          </td>
                          <td className="py-4 px-4 text-right font-medium text-gray-900">
                            LD 300
                          </td>
                          <td className="py-4 px-4 text-right text-gray-600">
                            1-2 days
                          </td>
                        </tr>
                        <tr className="bg-green-50">
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-gray-900">Pickup</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            Collect at Lucky Pharmacy location
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-green-600">
                            FREE
                          </td>
                          <td className="py-4 px-4 text-right text-gray-600">
                            2-4 hours
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    * Delivery fees are calculated automatically at checkout based on your address.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Delivery Process */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                How Delivery Works
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-green-600">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Confirmed</h3>
                    <p className="text-sm text-gray-600">
                      Your order is confirmed and our team starts preparing it
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-orange-600">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Prepared</h3>
                    <p className="text-sm text-gray-600">
                      Medications are securely packaged and ready for dispatch
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-green-600">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Out for Delivery</h3>
                    <p className="text-sm text-gray-600">
                      Driver is on the way to your address
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-orange-600">4</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Delivered</h3>
                    <p className="text-sm text-gray-600">
                      Order received and marked as completed
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Important Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Important Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>Delivery Hours:</strong> Monday-Saturday (8 AM - 8 PM),
                      Sunday (9 AM - 6 PM)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>ID Verification:</strong> For certain medications, delivery
                      personnel may request ID verification upon delivery
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>Packaging:</strong> All orders are packaged discreetly to
                      protect your privacy
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>Tracking:</strong> Track your order anytime at{' '}
                      <a href="/track-order" className="text-blue-600 hover:underline">
                        luckypharmacy.com/track-order
                      </a>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>Contact:</strong> For delivery inquiries, contact us via
                      WhatsApp or phone
                    </p>
                  </div>
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
