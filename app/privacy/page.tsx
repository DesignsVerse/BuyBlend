    "use client"
import { useState } from "react"
import { SiteHeader } from "@/components/Home/header"
import { TrustBadgesSection } from "@/components/Home/trustbadges"
import { Shield, Lock, Eye, User, CreditCard, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("introduction")

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "data-collection", title: "Data We Collect" },
    { id: "data-usage", title: "How We Use Data" },
    { id: "data-protection", title: "Data Protection" },
    { id: "cookies", title: "Cookies" },
    { id: "your-rights", title: "Your Rights" },
    { id: "changes", title: "Policy Changes" },
    { id: "contact", title: "Contact Us" }
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
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-4 font-serif">Privacy Policy</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
              <h2 className="font-semibold text-gray-900 mb-4">Quick Navigation</h2>
              <nav className="space-y-2">
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
                  <User className="h-6 w-6 text-amber-600 mr-3" />
                  Introduction
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    At <strong>Luxe Jewels</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
                  </p>
                  <p>
                    By using our website, you consent to the practices described in this policy. We encourage you to read this document carefully 
                    to understand our views and practices regarding your personal data.
                  </p>
                </div>
              </section>

              {/* Data We Collect */}
              <section id="data-collection" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Eye className="h-6 w-6 text-amber-600 mr-3" />
                  Data We Collect
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
                    <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through our payment partners)</li>
                    <li><strong>Account Information:</strong> Username, password, purchase history, preferences</li>
                    <li><strong>Communications:</strong> Messages, feedback, and inquiries you send to us</li>
                  </ul>
                  <p>We also automatically collect certain information when you visit our website:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Device Information:</strong> IP address, browser type, device type</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns</li>
                    <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                  </ul>
                </div>
              </section>

              {/* How We Use Data */}
              <section id="data-usage" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-3" />
                  How We Use Your Data
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>We use your personal information for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send order confirmations and shipping updates</li>
                    <li>Personalize your shopping experience</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Prevent fraud and enhance security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              {/* Data Protection */}
              <section id="data-protection" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Lock className="h-6 w-6 text-amber-600 mr-3" />
                  Data Protection & Security
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We implement appropriate security measures to protect your personal information from unauthorized access, 
                    alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>SSL encryption for all data transmissions</li>
                    <li>Secure payment processing through PCI-compliant partners</li>
                    <li>Regular security assessments and monitoring</li>
                    <li>Limited access to personal information within our organization</li>
                    <li>Secure data storage with industry-standard protections</li>
                  </ul>
                  <p>
                    While we strive to protect your personal information, no method of transmission over the internet or electronic 
                    storage is 100% secure. We cannot guarantee absolute security but we work to maintain the highest standards of protection.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section id="cookies" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cookies & Tracking Technologies</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, 
                    and understand where our visitors come from.
                  </p>
                  <p><strong>Types of cookies we use:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytical Cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong>Marketing Cookies:</strong> Used to track visitors across websites for advertising purposes</li>
                  </ul>
                  <p>
                    You can control cookies through your browser settings. However, disabling certain cookies may affect your 
                    ability to use some features of our website.
                  </p>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Rights</h2>
                <div className="space-y-4 text-gray-700">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Objection:</strong> Object to processing of your personal data</li>
                    <li><strong>Restriction:</strong> Request restriction of processing your personal data</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another organization</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on consent to process your data</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us using the information provided in the "Contact Us" section.
                  </p>
                </div>
              </section>

              {/* Policy Changes */}
              <section id="changes" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Changes to This Policy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, 
                    legal, or regulatory reasons. The updated version will be indicated by an updated "Last updated" date and the 
                    updated version will be effective as soon as it is accessible.
                  </p>
                  <p>
                    We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
                  </p>
                </div>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions or concerns about this Privacy Policy or our data practices, 
                    please contact our Data Protection Officer:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p><strong>Email:</strong> privacy@luxejewels.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Luxury Avenue, Jewelry District, NY 10001</p>
                  </div>
                  <p>
                    We will respond to your inquiry within 30 days of receipt. If you are not satisfied with our response, 
                    you have the right to contact your local data protection authority.
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  )
}