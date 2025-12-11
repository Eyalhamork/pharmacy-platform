import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle, Scale } from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Terms of Service | MoPharma',
  description: 'Read MoPharma\'s Terms of Service. Understand your rights and responsibilities when using our online pharmacy platform.',
};

export default function TermsOfServicePage() {
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
                <FileText className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-green-50">
              Please read these terms carefully before using MoPharma
            </p>
            <p className="text-sm text-green-100 mt-4">
              Last Updated: November 26, 2025
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div>
            <Card>
              <CardContent className="p-8">
                <p className="text-gray-600 leading-relaxed">
                  Welcome to MoPharma! These Terms of Service ("Terms") govern your access to and 
                  use of our website, mobile applications, and services (collectively, the "Service"). 
                  By accessing or using the Service, you agree to be bound by these Terms. If you do 
                  not agree to these Terms, please do not use our Service.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Important Notice</h3>
                  <p className="text-gray-700">
                    MoPharma is a licensed pharmacy operating under the regulations of the Liberia 
                    Medicines & Health Products Regulatory Authority (LMHRA). These Terms are 
                    governed by the laws of the Republic of Liberia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-8">
            {/* 1. Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">1</span>
                Eligibility
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p>You must meet the following requirements to use our Service:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="list-disc">Be at least 18 years of age</li>
                      <li className="list-disc">Have the legal capacity to enter into binding contracts</li>
                      <li className="list-disc">Provide accurate and complete information when registering</li>
                      <li className="list-disc">Comply with all applicable laws and regulations in Liberia</li>
                      <li className="list-disc">Not be barred from using the Service under Liberian law</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 2. Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">2</span>
                Account Registration
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p><strong>Account Creation:</strong> You may need to create an account to access certain features. You are responsible for:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="list-disc">Providing accurate, current, and complete information</li>
                      <li className="list-disc">Maintaining the security of your account credentials</li>
                      <li className="list-disc">All activities that occur under your account</li>
                      <li className="list-disc">Notifying us immediately of any unauthorized use</li>
                    </ul>
                    <p className="mt-4"><strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these Terms.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 3. Orders & Prescriptions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">3</span>
                Orders & Prescriptions
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4 text-gray-600">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Placing Orders</h3>
                      <ul className="space-y-2 ml-6">
                        <li className="list-disc">All orders are subject to acceptance by MoPharma</li>
                        <li className="list-disc">We reserve the right to refuse or cancel any order</li>
                        <li className="list-disc">Product availability and prices are subject to change</li>
                        <li className="list-disc">You must provide accurate delivery information</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Prescription Medications</h3>
                      <ul className="space-y-2 ml-6">
                        <li className="list-disc">A valid prescription from a licensed healthcare provider is required</li>
                        <li className="list-disc">Our pharmacist will verify all prescriptions before dispensing</li>
                        <li className="list-disc">We may contact your healthcare provider to verify prescriptions</li>
                        <li className="list-disc">We reserve the right to refuse to fill any prescription</li>
                        <li className="list-disc">Prescription records will be maintained as required by LMHRA</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Order Cancellation</h3>
                      <p>You may cancel your order before it's confirmed. Once processing begins, cancellation may not be possible. Contact us immediately if you need to cancel.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 4. Payment */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">4</span>
                Payment
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p><strong>Payment Methods:</strong> We accept MTN Mobile Money and Cash on Delivery (COD).</p>
                    <p><strong>Pricing:</strong> All prices are in Liberian Dollars (LD) unless otherwise stated. Prices include applicable taxes but exclude delivery fees.</p>
                    <p><strong>Payment Authorization:</strong> By providing payment information, you authorize us to charge the total amount, including products, delivery fees, and taxes.</p>
                    <p><strong>Failed Payments:</strong> If payment fails, your order may be canceled. For COD, failure to pay upon delivery may result in account restrictions.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 5. Delivery */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">5</span>
                Delivery
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p><strong>Delivery Areas:</strong> We deliver to specified zones within Monrovia and surrounding areas. See our <a href="/shipping-delivery" className="text-green-600 hover:underline">Shipping & Delivery</a> page for details.</p>
                    <p><strong>Delivery Times:</strong> Estimated delivery times are not guaranteed and may vary based on factors beyond our control.</p>
                    <p><strong>Failed Delivery:</strong> If delivery fails due to incorrect address, unavailability, or refusal to accept, additional fees may apply for redelivery.</p>
                    <p><strong>Risk of Loss:</strong> Title and risk of loss pass to you upon delivery to the specified address.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 6. Returns & Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">6</span>
                Returns & Refunds
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p>Our returns policy is governed by pharmaceutical regulations. Please review our complete <a href="/returns-policy" className="text-green-600 hover:underline">Returns Policy</a> for details.</p>
                    <p><strong>Key Points:</strong></p>
                    <ul className="space-y-2 ml-6">
                      <li className="list-disc">Opened medications cannot be returned</li>
                      <li className="list-disc">Wrong or damaged items can be returned within 24 hours</li>
                      <li className="list-disc">Refunds are processed within 3-5 business days</li>
                      <li className="list-disc">Prescription medications cannot be returned once dispensed</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 7. Use of Service */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">7</span>
                Acceptable Use
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p><strong>You agree NOT to:</strong></p>
                    <ul className="space-y-2 ml-6">
                      <li className="list-disc">Use the Service for illegal purposes</li>
                      <li className="list-disc">Provide false or misleading information</li>
                      <li className="list-disc">Submit fraudulent prescriptions</li>
                      <li className="list-disc">Attempt to access unauthorized areas of the Service</li>
                      <li className="list-disc">Interfere with or disrupt the Service</li>
                      <li className="list-disc">Harvest or collect user information</li>
                      <li className="list-disc">Use the Service to harm others</li>
                      <li className="list-disc">Violate any applicable laws or regulations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 8. Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">8</span>
                Intellectual Property
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p>All content on the Service, including text, graphics, logos, images, and software, is the property of MoPharma or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
                    <p>You may not copy, reproduce, distribute, or create derivative works without our prior written permission.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 9. Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">9</span>
                Privacy & Data Protection
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p>Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our <a href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</a>.</p>
                    <p>By using the Service, you consent to the collection and use of your information as described in the Privacy Policy.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 10. Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">10</span>
                Disclaimers
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p><strong>Medical Advice:</strong> The Service provides information about medications but does not provide medical advice. Always consult a qualified healthcare provider for medical advice.</p>
                    <p><strong>Product Information:</strong> We strive to provide accurate product information, but errors may occur. Verify all information with your pharmacist or healthcare provider.</p>
                    <p><strong>Service Availability:</strong> The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted, error-free, or secure service.</p>
                    <p><strong>Third-Party Links:</strong> The Service may contain links to third-party websites. We are not responsible for the content or practices of these sites.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 11. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">11</span>
                Limitation of Liability
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p>To the maximum extent permitted by law, MoPharma shall not be liable for:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="list-disc">Indirect, incidental, special, or consequential damages</li>
                      <li className="list-disc">Loss of profits, revenue, data, or business opportunities</li>
                      <li className="list-disc">Damages resulting from service interruptions or errors</li>
                      <li className="list-disc">Actions of third parties, including delivery partners</li>
                    </ul>
                    <p className="mt-4">Our total liability for any claim shall not exceed the amount you paid for the specific product or service giving rise to the claim.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 12. Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">12</span>
                Indemnification
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p>You agree to indemnify, defend, and hold harmless MoPharma, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
                    <ul className="space-y-2 ml-6">
                      <li className="list-disc">Your use of the Service</li>
                      <li className="list-disc">Your violation of these Terms</li>
                      <li className="list-disc">Your violation of any rights of third parties</li>
                      <li className="list-disc">Your use of products purchased through the Service</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 13. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">13</span>
                Governing Law & Dispute Resolution
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p><strong>Governing Law:</strong> These Terms are governed by the laws of the Republic of Liberia, without regard to conflict of law principles.</p>
                    <p><strong>Jurisdiction:</strong> Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Monrovia, Liberia.</p>
                    <p><strong>Dispute Resolution:</strong> We encourage you to contact us first to resolve any issues. If a dispute cannot be resolved informally, it may be brought to court as specified above.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 14. Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">14</span>
                Changes to Terms
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Service. We will notify users of significant changes via email or prominent notice on the website.</p>
                    <p>Your continued use of the Service after changes constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Service.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 15. General */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">15</span>
                General Provisions
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3 text-gray-600">
                    <p><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and MoPharma regarding the Service.</p>
                    <p><strong>Severability:</strong> If any provision is found invalid, the remaining provisions shall continue in full force.</p>
                    <p><strong>Waiver:</strong> Our failure to enforce any right does not constitute a waiver of that right.</p>
                    <p><strong>Assignment:</strong> You may not assign these Terms. We may assign our rights and obligations to a successor entity.</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Contact */}
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Scale className="h-8 w-8 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
                  <p className="text-green-50 mb-6">
                    If you have any questions or concerns about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2 text-green-50">
                    <p><strong>Email:</strong> legal@mopharma.com</p>
                    <p><strong>Phone:</strong> +231-XXX-XXX-XXX</p>
                    <p><strong>Address:</strong> Monrovia, Montserrado County, Liberia</p>
                  </div>
                  <div className="mt-6">
                    <a 
                      href="/contact" 
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                    >
                      Contact Us
                    </a>
                  </div>
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
