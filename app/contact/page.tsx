import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Contact Us | Lucky Pharmacy',
  description: 'Get in touch with Lucky Pharmacy. We\'re here to help with your questions, orders, and pharmaceutical needs.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-green-50">
                Have a question? Need help with your order? Our team is here
                to assist you.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Get In Touch
                  </h2>
                  <p className="text-gray-600 mb-8">
                    We're here to help! Reach out to us through any of the following
                    channels and we'll get back to you as soon as possible.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Visit Our Pharmacy</h3>
                          <p className="text-gray-600">
                            Monrovia, Montserrado County<br />
                            Liberia
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                          <p className="text-gray-600">
                            Phone: +231-XXX-XXX-XXX<br />
                            Mon-Sat: 8:00 AM - 8:00 PM<br />
                            Sun: 9:00 AM - 6:00 PM
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                          <p className="text-gray-600 mb-2">
                            Get instant updates on your orders via WhatsApp
                          </p>
                          <p className="text-sm text-gray-500">
                            (Available for order confirmations and updates)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                          <p className="text-gray-600">
                            info@luckypharmacy.com<br />
                            support@luckypharmacy.com
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Operating Hours</h3>
                          <p className="text-gray-600">
                            <strong>Monday - Saturday:</strong> 8:00 AM - 8:00 PM<br />
                            <strong>Sunday:</strong> 9:00 AM - 6:00 PM<br />
                            <strong>Public Holidays:</strong> 10:00 AM - 4:00 PM
                          </p>
                          <p className="text-sm text-green-600 mt-2">
                            Online ordering available 24/7
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Send Us a Message
                    </h2>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+231-XXX-XXX-XXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help you?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </Button>

                      <p className="text-sm text-gray-500 text-center">
                        We typically respond within 24 hours during business days
                      </p>
                    </form>
                  </CardContent>
                </Card>

                {/* Quick Help */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Need Immediate Help?
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        • Check our <a href="/faq" className="text-green-600 hover:underline">FAQ page</a> for quick answers
                      </li>
                      <li>
                        • Track your order on the <a href="/track-order" className="text-green-600 hover:underline">Track Order</a> page
                      </li>
                      <li>
                        • View our <a href="/how-it-works" className="text-green-600 hover:underline">How It Works</a> guide
                      </li>
                      <li>
                        • Review our <a href="/shipping-delivery" className="text-green-600 hover:underline">Shipping & Delivery</a> policy
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Find Us
              </h2>
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Monrovia, Montserrado County, Liberia
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Map integration coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
