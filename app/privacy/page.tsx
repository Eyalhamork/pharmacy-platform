import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Database, Bell } from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Lucky Pharmacy',
  description: 'Learn how Lucky Pharmacy collects, uses, and protects your personal information. Your privacy and data security are our priorities.',
};

export default function PrivacyPolicyPage() {
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
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-green-50">
                Your privacy and data security are our top priorities
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
                    Lucky Pharmacy ("we," "our," or "us") is committed to protecting your privacy and
                    personal information. This Privacy Policy explains how we collect, use, disclose,
                    and safeguard your information when you use our online pharmacy platform and
                    services. By using Lucky Pharmacy, you agree to the collection and use of information
                    in accordance with this policy.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Database className="h-8 w-8 text-green-600" />
                Information We Collect
              </h2>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <p className="text-gray-600 mb-3">
                      When you register, place an order, or interact with our services, we may
                      collect:
                    </p>
                    <ul className="space-y-2 text-gray-600 ml-6">
                      <li className="list-disc">Full name</li>
                      <li className="list-disc">Email address</li>
                      <li className="list-disc">Phone number (including WhatsApp)</li>
                      <li className="list-disc">Delivery addresses</li>
                      <li className="list-disc">Date of birth (if required for age verification)</li>
                      <li className="list-disc">Payment information (processed securely through MTN Mobile Money)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Health Information
                    </h3>
                    <p className="text-gray-600 mb-3">
                      For prescription medications, we collect:
                    </p>
                    <ul className="space-y-2 text-gray-600 ml-6">
                      <li className="list-disc">Prescription documents and images</li>
                      <li className="list-disc">Medical conditions (only as stated in prescriptions)</li>
                      <li className="list-disc">Medication history (your orders with us)</li>
                      <li className="list-disc">Allergies or medical notes (if voluntarily provided)</li>
                    </ul>
                    <p className="text-sm text-green-600 mt-3">
                      Note: Your health information is treated with the highest level of
                      confidentiality and is only accessible to authorized pharmacy staff.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Automatically Collected Information
                    </h3>
                    <p className="text-gray-600 mb-3">
                      When you use our website, we automatically collect:
                    </p>
                    <ul className="space-y-2 text-gray-600 ml-6">
                      <li className="list-disc">IP address and device information</li>
                      <li className="list-disc">Browser type and version</li>
                      <li className="list-disc">Pages visited and time spent</li>
                      <li className="list-disc">Search queries and product views</li>
                      <li className="list-disc">Cookies and similar tracking technologies</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-green-600" />
                How We Use Your Information
              </h2>

              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Order Processing & Fulfillment</h3>
                      <p className="text-gray-600">
                        Process your orders, verify prescriptions, arrange delivery, and
                        communicate order status updates via WhatsApp or phone.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Payment Processing</h3>
                      <p className="text-gray-600">
                        Process payments securely through MTN Mobile Money and maintain
                        transaction records for your reference.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Customer Service</h3>
                      <p className="text-gray-600">
                        Respond to your inquiries, resolve issues, and provide pharmaceutical
                        guidance when needed.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Legal & Regulatory Compliance</h3>
                      <p className="text-gray-600">
                        Maintain records as required by LMHRA (Liberia Medicines & Health Products
                        Regulatory Authority) and Liberian pharmaceutical regulations.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Service Improvement</h3>
                      <p className="text-gray-600">
                        Analyze usage patterns to improve our website, product offerings, and
                        customer experience.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Marketing Communications (With Consent)</h3>
                      <p className="text-gray-600">
                        Send promotional offers, new product announcements, and health tips. You
                        can opt out at any time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Eye className="h-8 w-8 text-green-600" />
                Information Sharing & Disclosure
              </h2>

              <Card>
                <CardContent className="p-8">
                  <p className="text-gray-600 mb-6">
                    We do not sell, rent, or trade your personal information. We only share your
                    information in the following limited circumstances:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">With Licensed Pharmacists</h3>
                      <p className="text-gray-600">
                        Your prescription and health information is shared with our licensed
                        pharmacists for verification and dispensing purposes.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">With Delivery Partners</h3>
                      <p className="text-gray-600">
                        Your name, phone number, and delivery address are shared with our trusted
                        delivery partners to fulfill your orders.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">With Payment Processors</h3>
                      <p className="text-gray-600">
                        Payment information is processed through MTN Mobile Money's secure systems.
                        We do not store your payment credentials.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">For Legal Requirements</h3>
                      <p className="text-gray-600">
                        We may disclose information when required by law, legal process, or to
                        comply with regulatory obligations (LMHRA, law enforcement, courts).
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Business Transfers</h3>
                      <p className="text-gray-600">
                        If Lucky Pharmacy is acquired or merged, your information may be transferred to
                        the new owner, subject to this Privacy Policy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Lock className="h-8 w-8 text-green-600" />
                Data Security
              </h2>

              <Card>
                <CardContent className="p-8">
                  <p className="text-gray-600 mb-4">
                    We implement industry-standard security measures to protect your personal and
                    health information:
                  </p>

                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Encryption:</strong> All data transmitted between your device and
                        our servers is encrypted using SSL/TLS technology
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Access Controls:</strong> Only authorized pharmacy staff and
                        administrators can access sensitive information
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Secure Storage:</strong> Prescription images and health records
                        are stored in secure, encrypted databases
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Regular Security Audits:</strong> We conduct regular security
                        assessments to identify and address vulnerabilities
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Staff Training:</strong> All staff members are trained on data
                        privacy and security protocols
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Bell className="h-8 w-8 text-green-600" />
                Your Privacy Rights
              </h2>

              <Card>
                <CardContent className="p-8">
                  <p className="text-gray-600 mb-6">
                    You have the following rights regarding your personal information:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Access Your Data</h3>
                      <p className="text-gray-600">
                        Request a copy of the personal information we hold about you.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Correct Your Data</h3>
                      <p className="text-gray-600">
                        Update or correct any inaccurate information in your account profile.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Delete Your Data</h3>
                      <p className="text-gray-600">
                        Request deletion of your account and personal information, subject to
                        legal retention requirements (prescription records must be kept for 7 years
                        per LMHRA regulations).
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Export Your Data</h3>
                      <p className="text-gray-600">
                        Request a portable copy of your data in a commonly used format.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Opt-Out of Marketing</h3>
                      <p className="text-gray-600">
                        Unsubscribe from promotional emails or marketing messages at any time.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Withdraw Consent</h3>
                      <p className="text-gray-600">
                        Withdraw consent for data processing where consent was the legal basis.
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-6">
                    To exercise any of these rights, contact us at info@luckypharmacy.com or through
                    our <a href="/contact" className="text-green-600 hover:underline">Contact page</a>.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Data Retention
              </h2>

              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We retain your information for as long as necessary to provide our services
                      and comply with legal obligations:
                    </p>

                    <ul className="space-y-2 ml-6">
                      <li className="list-disc">
                        <strong>Account Information:</strong> Retained while your account is active,
                        plus 2 years after deletion
                      </li>
                      <li className="list-disc">
                        <strong>Order History:</strong> Retained for 5 years for warranty and
                        customer service purposes
                      </li>
                      <li className="list-disc">
                        <strong>Prescription Records:</strong> Retained for 7 years as required by
                        LMHRA regulations
                      </li>
                      <li className="list-disc">
                        <strong>Financial Records:</strong> Retained for 7 years for tax and
                        audit purposes
                      </li>
                      <li className="list-disc">
                        <strong>Marketing Preferences:</strong> Retained until you opt out or
                        request deletion
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Cookies & Tracking
              </h2>

              <Card>
                <CardContent className="p-8">
                  <p className="text-gray-600 mb-4">
                    We use cookies and similar technologies to enhance your experience:
                  </p>

                  <div className="space-y-3 text-gray-600">
                    <p>
                      <strong>Essential Cookies:</strong> Required for the website to function
                      (login, cart, checkout)
                    </p>
                    <p>
                      <strong>Performance Cookies:</strong> Help us understand how visitors use
                      the site (analytics)
                    </p>
                    <p>
                      <strong>Functionality Cookies:</strong> Remember your preferences and
                      settings
                    </p>
                    <p>
                      <strong>Marketing Cookies:</strong> Track your interests for targeted
                      advertising (only with consent)
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    You can control cookies through your browser settings, but disabling essential
                    cookies may affect website functionality.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Children's Privacy
              </h2>

              <Card>
                <CardContent className="p-8">
                  <p className="text-gray-600">
                    Lucky Pharmacy is not intended for use by individuals under 18 years of age. We do
                    not knowingly collect personal information from children. If you believe we
                    have inadvertently collected information from a minor, please contact us
                    immediately so we can delete it.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Changes to Policy */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Changes to This Privacy Policy
              </h2>

              <Card>
                <CardContent className="p-8">
                  <p className="text-gray-600">
                    We may update this Privacy Policy from time to time to reflect changes in our
                    practices or legal requirements. We will notify you of significant changes by
                    posting a notice on our website or sending an email. The "Last Updated" date
                    at the top indicates when the policy was last revised. Your continued use of
                    Lucky Pharmacy after changes constitutes acceptance of the updated policy.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact */}
            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
                <p className="text-green-50 mb-6">
                  If you have any questions, concerns, or requests regarding this Privacy Policy
                  or how we handle your personal information, please contact us:
                </p>
                <div className="space-y-2 text-green-50">
                  <p><strong>Email:</strong> privacy@luckypharmacy.com</p>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
