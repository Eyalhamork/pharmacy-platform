import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Search } from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | MoPharma',
  description: 'Find answers to common questions about ordering, delivery, payments, prescriptions, and more at MoPharma.',
};

export default function FAQPage() {
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
                <HelpCircle className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-green-50">
              Find quick answers to common questions about MoPharma
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* General Questions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">1</span>
              General Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  What is MoPharma?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  MoPharma is Liberia's leading online pharmacy platform that allows you to 
                  order medications and health products from the comfort of your home. We 
                  provide convenient access to genuine medications with fast delivery across 
                  Monrovia and beyond.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Are all medications genuine?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes! All our medications are 100% genuine and sourced from licensed suppliers. 
                  We are fully licensed by the Liberia Medicines & Health Products Regulatory 
                  Authority (LMHRA) and maintain strict quality control standards.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Is it safe to buy medications online?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Absolutely! MoPharma is a licensed pharmacy operating in full compliance with 
                  Liberian pharmaceutical regulations. Our licensed pharmacists verify all 
                  prescriptions, and we use secure payment methods to protect your information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Do I need to create an account to order?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  While you can browse products without an account, creating one makes checkout 
                  faster and allows you to track your orders, save addresses, and view your 
                  order history. Registration is quick and free!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Ordering & Payment */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">2</span>
              Ordering & Payment
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-5" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  How do I place an order?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Simply browse our catalog, add items to your cart, provide delivery details, 
                  upload prescriptions if needed, and complete payment. Check out our 
                  <a href="/how-it-works" className="text-green-600 hover:underline ml-1">How It Works</a> page 
                  for a detailed step-by-step guide.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We accept MTN Mobile Money for instant payment and Cash on Delivery (COD) 
                  if you prefer to pay when your order arrives. All transactions are secure 
                  and encrypted.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Is there a minimum order amount?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  There is no minimum order amount. However, delivery fees may apply based on 
                  your location. You can always choose to pick up your order from our pharmacy 
                  to avoid delivery charges.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Can I modify or cancel my order?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  You can cancel or modify your order before it's confirmed by our pharmacy 
                  staff. Once the order is being prepared, changes may not be possible. 
                  Contact us immediately via WhatsApp or phone for urgent changes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Prescriptions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">3</span>
              Prescriptions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-9" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  How do I upload my prescription?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  During checkout, if your cart contains prescription medications, you'll be 
                  prompted to upload a clear photo or scan of your prescription. Accepted formats 
                  include JPG, PNG, and PDF files.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  What if my prescription is rejected?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  If our pharmacist cannot verify your prescription (due to clarity, validity, 
                  or other reasons), we'll contact you via WhatsApp to request a better copy or 
                  clarification. Your order will be held until we receive a valid prescription.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  How long does prescription verification take?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Our licensed pharmacists typically review and approve prescriptions within 
                  2-4 hours during business hours. You'll receive a WhatsApp notification once 
                  your prescription is verified.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Can I order without a prescription?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Over-the-counter (OTC) medications can be ordered without a prescription. 
                  However, prescription medications require a valid prescription from a licensed 
                  healthcare provider, as required by Liberian law.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Delivery & Shipping */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">4</span>
              Delivery & Shipping
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-13" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  How fast will I receive my order?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We offer same-day delivery in Monrovia for orders placed before 2:00 PM. 
                  Orders placed after 2:00 PM will be delivered the next business day. Delivery 
                  times for other areas may vary.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-14" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  How much is delivery?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Delivery fees vary based on your location within our delivery zones. The exact 
                  fee will be calculated and displayed during checkout before you complete your 
                  order. See our <a href="/shipping-delivery" className="text-green-600 hover:underline">
                  Shipping & Delivery</a> page for more details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-15" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Can I pick up my order instead of delivery?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes! You can choose to pick up your order from our pharmacy. This option has 
                  no delivery fee. We'll notify you via WhatsApp when your order is ready for 
                  collection.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-16" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  How can I track my order?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  You can track your order in your account under "My Orders" or use our 
                  <a href="/track-order" className="text-green-600 hover:underline ml-1">
                  Track Order</a> page with your order number. You'll also receive WhatsApp 
                  updates at each stage of your order.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Returns & Refunds */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">5</span>
              Returns & Refunds
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-17" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Can I return medications?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Due to health and safety regulations, we cannot accept returns of opened or 
                  used medications. However, if you receive a damaged, expired, or incorrect 
                  product, please contact us immediately for a replacement or refund.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-18" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  What if I receive the wrong item?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  If you receive an incorrect item, contact us within 24 hours with photos of 
                  the product. We'll arrange for the correct item to be delivered and collect 
                  the wrong one at no additional cost to you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-19" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  How do refunds work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Refunds for eligible returns are processed within 3-5 business days. For MTN 
                  Mobile Money payments, refunds are sent to your MoMo account. For COD orders, 
                  refunds can be collected at our pharmacy or sent via Mobile Money.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Account & Security */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">6</span>
              Account & Security
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-20" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Is my personal information secure?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes! We use industry-standard encryption to protect your personal and payment 
                  information. We never share your data with third parties without your consent. 
                  Read our <a href="/privacy-policy" className="text-green-600 hover:underline">
                  Privacy Policy</a> for full details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-21" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  How do I reset my password?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Click on "Forgot Password" on the login page, enter your email address, and 
                  we'll send you instructions to reset your password.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-22" className="border rounded-lg px-6 bg-white">
                <AccordionTrigger className="text-left hover:no-underline">
                  Can I delete my account?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, you can request account deletion by contacting our support team. Please 
                  note that order history and prescription records may be retained for legal 
                  and regulatory compliance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Still Have Questions? */}
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-green-50 mb-6">
                Can't find what you're looking for? Our team is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  Contact Us
                </a>
                <a 
                  href="/how-it-works" 
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  How It Works
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
