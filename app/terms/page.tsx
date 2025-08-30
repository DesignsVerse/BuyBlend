"use client"
import { useState } from "react"
import { SiteHeader } from "@/components/Home/header"
import { TrustBadgesSection } from "@/components/Home/trustbadges"
import { FileText, Scale, ShoppingBag, User, Shield, AlertCircle, Mail, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("introduction")

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Definitions" },
    { id: "account", title: "Account Creation" },
    { id: "products", title: "Products & Pricing" },
    { id: "orders", title: "Order Process" },
    { id: "payments", title: "Payments" },
    { id: "shipping", title: "Shipping & Delivery" },
    { id: "returns", title: "Returns & Refunds" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "user-conduct", title: "User Conduct" },
    { id: "limitation", title: "Limitation of Liability" },
    { id: "changes", title: "Changes to Terms" },
    { id: "governing", title: "Governing Law" },
    { id: "contact", title: "Contact Information" }
  ]

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-4 font-serif">Terms of Service</h1>
            <p className="text-lg text-gray-600 mb-8">
              Please read these terms carefully before using our website or purchasing our products.
            </p>
            <p className="text-sm text-gray-500">
              Effective date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/4"
          >
            <div className="sticky top-24 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id)
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-amber-100 text-amber-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-3/4"
          >
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Scale className="h-6 w-6 text-amber-600 mr-3" />
                  Introduction
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Welcome to <strong>Luxe Jewels</strong>. These Terms of Service ("Terms") govern your access to and use of 
                    our website, products, and services. Please read these Terms carefully before accessing or using our services.
                  </p>
                  <p>
                    By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy. If you do not 
                    agree to these Terms, you may not access or use our services.
                  </p>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                    <p className="text-sm text-amber-700">
                      <strong>Note:</strong> These Terms constitute a legally binding agreement between you and Luxe Jewels.
                    </p>
                  </div>
                </div>
              </section>

              {/* Definitions */}
              <section id="definitions" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Definitions</h2>
                <div className="space-y-4 text-gray-700">
                  <p>For the purposes of these Terms:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>"Website"</strong> refers to luxejewels.com and all associated subdomains</li>
                    <li><strong>"Products"</strong> refers to jewelry items available for purchase on our website</li>
                    <li><strong>"Services"</strong> refers to all services provided by Luxe Jewels</li>
                    <li><strong>"User," "you," "your"</strong> refers to the individual accessing or using our services</li>
                    <li><strong>"Company," "we," "us," "our"</strong> refers to Luxe Jewels</li>
                  </ul>
                </div>
              </section>

              {/* Account Creation */}
              <section id="account" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 text-amber-600 mr-3" />
                  Account Creation
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>To access certain features of our website, you may need to create an account.</p>
                  <p><strong>Account Requirements:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>You must be at least 18 years old to create an account</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You are responsible for all activities that occur under your account</li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate your account if we suspect unauthorized or fraudulent activity.
                  </p>
                </div>
              </section>

              {/* Products & Pricing */}
              <section id="products" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShoppingBag className="h-6 w-6 text-amber-600 mr-3" />
                  Products & Pricing
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Product Information:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>We strive to display product colors and images as accurately as possible</li>
                    <li>Product availability is subject to change without notice</li>
                    <li>We reserve the right to limit quantities available for purchase</li>
                  </ul>
                  <p><strong>Pricing:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>All prices are in US Dollars (USD) unless otherwise stated</li>
                    <li>Prices are subject to change without notice</li>
                    <li>We are not responsible for pricing errors and reserve the right to cancel orders arising from such errors</li>
                  </ul>
                </div>
              </section>

              {/* Order Process */}
              <section id="orders" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Process</h2>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Order Acceptance:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Your order constitutes an offer to purchase our products</li>
                    <li>Order acceptance occurs when we send order confirmation</li>
                    <li>We reserve the right to refuse or cancel any order for any reason</li>
                  </ul>
                  <p><strong>Order Changes & Cancellations:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Order changes must be requested within 1 hour of placement</li>
                    <li>Once an order enters processing, changes may not be possible</li>
                    <li>Cancellation requests are subject to order status</li>
                  </ul>
                </div>
              </section>

              {/* Payments */}
              <section id="payments" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payments</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We accept various payment methods including credit cards and digital wallets.</p>
                  <p><strong>Payment Terms:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Payment is due at the time of order placement</li>
                    <li>All payments are processed through secure payment gateways</li>
                    <li>We do not store your complete payment card information</li>
                    <li>Sales tax will be added to orders as required by law</li>
                  </ul>
                </div>
              </section>

              {/* Shipping & Delivery */}
              <section id="shipping" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping & Delivery</h2>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Shipping Methods:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>We offer various shipping options with different delivery times</li>
                    <li>Shipping costs are calculated at checkout</li>
                    <li>Free shipping may be available for orders over specified amounts</li>
                  </ul>
                  <p><strong>Delivery:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>We are not responsible for delays caused by carriers or customs</li>
                    <li>Signature may be required for delivery of high-value items</li>
                  </ul>
                </div>
              </section>

              {/* Returns & Refunds */}
              <section id="returns" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Returns & Refunds</h2>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Return Policy:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Items must be returned within 30 days of delivery</li>
                    <li>Products must be in original condition with all tags attached</li>
                    <li>Custom or personalized items cannot be returned</li>
                    <li>Return shipping costs are the customer's responsibility</li>
                  </ul>
                  <p><strong>Refunds:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Refunds are processed within 7-10 business days of receiving returned items</li>
                    <li>Refunds will be issued to the original payment method</li>
                    <li>Shipping costs are non-refundable unless the return is due to our error</li>
                  </ul>
                </div>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Intellectual Property</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    All content on our website, including text, graphics, logos, images, and software, is the property of 
                    Luxe Jewels or our content suppliers and is protected by intellectual property laws.
                  </p>
                  <p><strong>Restrictions:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>You may not reproduce, distribute, or create derivative works without permission</li>
                    <li>You may not use our trademarks without prior written consent</li>
                    <li>User-generated content remains your property, but you grant us a license to use it</li>
                  </ul>
                </div>
              </section>

              {/* User Conduct */}
              <section id="user-conduct" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 text-amber-600 mr-3" />
                  User Conduct
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>You agree not to:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Use our website for any illegal purpose</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the website's functionality</li>
                    <li>Submit false or misleading information</li>
                    <li>Use automated systems to access our website</li>
                  </ul>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section id="limitation" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
                  Limitation of Liability
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    To the fullest extent permitted by law, Luxe Jewels shall not be liable for any indirect, incidental, 
                    special, consequential, or punitive damages resulting from your use of or inability to use our services.
                  </p>
                  <p>
                    Our total liability for any claims related to our services shall not exceed the amount you paid for the 
                    products giving rise to the claim.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Changes to Terms</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify you of significant changes by 
                    posting the new Terms on our website and updating the effective date.
                  </p>
                  <p>
                    Your continued use of our services after any changes constitutes acceptance of the modified Terms.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section id="governing" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Governing Law</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the State of New York, 
                    without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising from these Terms shall be resolved in the state or federal courts located in New York County, New York.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section id="contact" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-3" />
                  Contact Information
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>If you have any questions about these Terms, please contact us:</p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p><strong>Email:</strong> legal@luxejewels.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Luxury Avenue, Jewelry District, NY 10001</p>
                  </div>
                </div>
              </section>

              {/* Last Updated */}
              <div className="mt-16 p-6 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-amber-600 mr-3" />
                  <p className="text-sm text-amber-800">
                    <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  )
}