import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  Shield,
  Truck,
  Users,
  Award,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'About Us | PharmaCare',
  description: 'Learn about PharmaCare - Your trusted online pharmacy and digital healthcare platform, committed to making medicine accessible and affordable.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About PharmaCare
              </h1>
              <p className="text-xl text-primary-foreground/90">
                Your trusted partner in accessible healthcare. We're revolutionizing
                how communities access quality medications and health products online.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To make quality healthcare accessible and affordable for every patient
                  by providing convenient online access to genuine medications, expert
                  pharmaceutical advice, and reliable home delivery services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/15 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading digital healthcare and pharmacy platform, transforming the
                  pharmacy experience through technology while maintaining the personal
                  touch and trust that defines quality pharmaceutical care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Our Core Values
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                  <p className="text-gray-600">
                    Every medication is sourced from licensed suppliers and verified
                    by qualified pharmacists.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
                  <p className="text-gray-600">
                    Your health and satisfaction are our top priorities. We're here
                    to serve you with care and dedication.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability</h3>
                  <p className="text-gray-600">
                    Fast, secure delivery and consistent service you can count on,
                    every single time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                PharmaCare was born out of a simple observation: accessing quality
                medications shouldn't be complicated, time-consuming, or uncertain.
                Too many patients face challenges in getting the medicines they need when they need them.
              </p>
              <p>
                Founded by a team of healthcare professionals and technology enthusiasts,
                PharmaCare combines pharmaceutical expertise with modern e-commerce
                convenience. We believe that everyone deserves easy access to safe,
                genuine medications without compromising on quality or service.
              </p>
              <p>
                Our platform is built on three pillars: authenticity (every product is
                genuine and properly stored), accessibility (order anytime, anywhere),
                and affordability (competitive prices without hidden fees). We're not
                just a pharmacy; we're your healthcare partner.
              </p>
              <p>
                Today, PharmaCare serves customers across the region with fast dispatch
                and reliable delivery. Our team of licensed pharmacists is always available
                to review prescriptions, answer questions, and ensure you get the right care.
              </p>
            </div>
          </div>
        </div>

        {/* Key Facts */}
        <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">PharmaCare by the Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-primary-foreground/80">Genuine Products</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-primary-foreground/80">Online Ordering</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">1000+</div>
                  <div className="text-primary-foreground/80">Products Available</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">Fast</div>
                  <div className="text-primary-foreground/80">Same-Day Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Pharmacy</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Main Location</p>
                      <p className="text-gray-600">
                        Tubman Boulevard, Sinkor, Monrovia, Liberia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Operating Hours</p>
                      <p className="text-gray-600">
                        Monday - Saturday: 8:00 AM - 8:00 PM<br />
                        Sunday: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Contact Us</p>
                      <p className="text-gray-600">
                        Phone: +231-777-000-000<br />
                        WhatsApp: Available for order updates
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Licensed & Certified
              </h2>
              <p className="text-gray-600 mb-6">
                PharmaCare is fully licensed by the Liberia Medicines & Health Products
                Regulatory Authority (LMHRA) and operates in compliance with all
                pharmaceutical regulations.
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4 text-primary" />
                <span>LMHRA Licensed Pharmacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
