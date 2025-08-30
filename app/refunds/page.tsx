
"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/Home/header"
import { TrustBadgesSection } from "@/components/Home/trustbadges"
import { motion } from "framer-motion"
import {
  RotateCcw,
  BadgeDollarSign,
  ShieldCheck,
  PackageSearch,
  Tag,
  AlertTriangle,
  Truck,
  Banknote,
  Shield,
  ClipboardList,
  Clock,
  Mail,
  HelpCircle
} from "lucide-react"

export default function RefundsReturnsPage() {
  const [activeSection, setActiveSection] = useState("overview")

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "eligibility", title: "Eligibility" },
    { id: "window", title: "Return Window" },
    { id: "condition", title: "Item Condition" },
    { id: "exclusions", title: "Exclusions" },
    { id: "process", title: "How to Start" },
    { id: "shipping", title: "Return Shipping" },
    { id: "high-value", title: "High-Value Handling" },
    { id: "refunds", title: "Refund Methods" },
    { id: "timelines", title: "Processing Times" },
    { id: "exchanges", title: "Exchanges" },
    { id: "fees", title: "Restocking & Fees" },
    { id: "damage-loss", title: "Damages & Loss" },
    { id: "legal", title: "Important Notices" },
    { id: "contact", title: "Contact" },
  ]

  useEffect(() => {
    const handler = () => {
      let current = activeSection
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120 && rect.bottom >= 120) {
          current = section.id
          break
        }
      }
      setActiveSection(current)
    }
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-4 font-serif">
              Returns & Refunds Policy
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Hassle-free returns with clear steps, reasonable timelines, and protection for high-value jewelry. Please review before initiating a return or exchange.
            </p>
            <p className="text-sm text-gray-500">
              Effective date: {today}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/4"
          >
            <div className="sticky top-24 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Table of Contents</h2>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      const el = document.getElementById(s.id)
                      el?.scrollIntoView({ behavior: "smooth" })
                      setActiveSection(s.id)
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === s.id
                        ? "bg-amber-100 text-amber-700 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main */}
          <motion.main
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-3/4"
          >
            <div className="prose prose-lg max-w-none text-gray-700">

              {/* Overview */}
              <section id="overview" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShieldCheck className="h-6 w-6 text-amber-600 mr-3" />
                  Overview
                </h2>
                <p>
                  Luxe Jewels offers a customer-friendly return window and clear guidance for refunds and exchanges, including special handling for high-value items and personalized pieces to align expectations and safeguard products. [6][9]
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
                  <p className="text-sm text-amber-800">
                    Posting this policy conspicuously online helps meet New York rules; if a retailer fails to post a policy, a 30-day default can apply by law. [7][11][10]
                  </p>
                </div>
              </section>

              {/* Eligibility */}
              <section id="eligibility" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <PackageSearch className="h-6 w-6 text-amber-600 mr-3" />
                  Eligibility
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Proof of purchase (order number or receipt) is required for all returns and exchanges. [7][11]</li>
                  <li>Items must be purchased directly from Luxe Jewels (website or official channels) to qualify. [9]</li>
                  <li>Items must be returned from the original shipping country unless pre-approved by Support. [9]</li>
                </ul>
              </section>

              {/* Return Window */}
              <section id="window" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Clock className="h-6 w-6 text-amber-600 mr-3" />
                  Return Window
                </h2>
                <p>
                  Standard returns are accepted within 30 days of delivery; initiating within this period ensures eligibility for refund or exchange according to the conditions below. [6][9]
                </p>
                <p>
                  Where required by New York law, failure to conspicuously post a return policy may result in a default 30-day refund right for unused, undamaged goods with proof of purchase. [7][11][10]
                </p>
              </section>

              {/* Item Condition */}
              <section id="condition" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Tag className="h-6 w-6 text-amber-600 mr-3" />
                  Item Condition
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Items must be unworn, unused, and in original condition with all tags, security seals, certificates, and packaging included. [9][6]</li>
                  <li>Any signs of wear, resizing, engraving removal, or alteration may render the return ineligible. [9]</li>
                  <li>Security tags (if present) must remain attached and untampered. [9]</li>
                </ul>
              </section>

              {/* Exclusions */}
              <section id="exclusions" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
                  Exclusions
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Custom, engraved, personalized, made-to-order, or resized items are non-returnable unless defective. [6][9]</li>
                  <li>Final sale or “as is” items are not eligible for return unless required by law. [7]</li>
                  <li>Pierced jewelry (e.g., earrings) may be non-returnable for hygiene reasons if seals are broken. [9]</li>
                </ul>
              </section>

              {/* How to Start */}
              <section id="process" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ClipboardList className="h-6 w-6 text-amber-600 mr-3" />
                  How to Start a Return
                </h2>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>Submit a return request via the Orders page or email Support with order number, item, and reason. [9]</li>
                  <li>Await authorization and instructions; unauthorized returns may be refused. [9]</li>
                  <li>Package securely with original materials and include any certificates/appraisals. [9]</li>
                </ol>
              </section>

              {/* Return Shipping */}
              <section id="shipping" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="h-6 w-6 text-amber-600 mr-3" />
                  Return Shipping
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Prepaid labels may be provided for domestic returns; otherwise, customer is responsible for return shipping. [9]</li>
                  <li>Use tracked and insured shipping; Luxe Jewels is not responsible for returns lost or damaged in transit. [9]</li>
                  <li>International returns may require customs forms; duties/taxes are non-refundable except as required by carrier or law. [9]</li>
                </ul>
              </section>

              {/* High-Value Handling */}
              <section id="high-value" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 text-amber-600 mr-3" />
                  High-Value Handling
                </h2>
                <p>
                  For items over a specified value threshold, signature on delivery is required and return shipments must include full declared value insurance per guidance to protect high-value jewelry. [9][6]
                </p>
              </section>

              {/* Refund Methods */}
              <section id="refunds" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Banknote className="h-6 w-6 text-amber-600 mr-3" />
                  Refund Methods
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Approved refunds are issued to the original payment method; where unavailable, store credit may be offered. [7][11]</li>
                  <li>Original shipping fees are non-refundable unless the item was verified defective or incorrect. [9]</li>
                  <li>If a restocking fee applies, it is disclosed prior to authorization and deducted from the refund. [7][11]</li>
                </ul>
              </section>

              {/* Processing Times */}
              <section id="timelines" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Clock className="h-6 w-6 text-amber-600 mr-3" />
                  Processing Times
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Inspection upon receipt typically takes 2–5 business days; refunds post 7–10 business days after approval depending on bank/card processor. [9]</li>
                  <li>Refund posting time varies by financial institution; delays may occur due to banking cycles. [9]</li>
                </ul>
              </section>

              {/* Exchanges */}
              <section id="exchanges" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BadgeDollarSign className="h-6 w-6 text-amber-600 mr-3" />
                  Exchanges
                </h2>
                <p>
                  Eligible items can be exchanged for size, color, or a different item of equal or greater value within the return window; price differences are collected prior to dispatch of the replacement. [9]
                </p>
              </section>

              {/* Fees */}
              <section id="fees" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
                  Restocking & Fees
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Restocking fees, if any, are disclosed before approval; some brands waive fees to reduce friction and build trust. [6][7][11]</li>
                  <li>Fees may apply for missing accessories, certificates, or excessive wear requiring refurbishment. [9]</li>
                </ul>
              </section>

              {/* Damages & Loss */}
              <section id="damage-loss" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <HelpCircle className="h-6 w-6 text-amber-600 mr-3" />
                  Damaged, Defective, or Incorrect Items
                </h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Report issues within 7 days of delivery with photos; approved cases receive replacements, repairs, or refunds per policy. [9]</li>
                  <li>If a return is lost or damaged in transit without adequate insurance, resolution depends on carrier claim outcomes. [9]</li>
                </ul>
              </section>

              {/* Legal */}
              <section id="legal" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShieldCheck className="h-6 w-6 text-amber-600 mr-3" />
                  Important Notices
                </h2>
                <p>
                  Luxe Jewels’ policy aims to meet New York’s requirement to conspicuously post refund terms online; if a policy isn’t posted near the item or before billing steps, a 30-day default may apply under state guidance and updates effective August 7, 2025. [7][10][11]
                </p>
              </section>

              {/* Contact */}
              <section id="contact" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-3" />
                  Contact
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Email:</strong> support@luxejewels.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Luxury Avenue, Jewelry District, NY 10001</p>
                </div>
              </section>

              {/* Last Updated */}
              <div className="mt-16 p-6 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-amber-600 mr-3" />
                  <p className="text-sm text-amber-800">
                    <strong>Last updated:</strong> {today}
                  </p>
                </div>
              </div>
            </div>
          </motion.main>
        </div>
      </div>

    </div>
  )
}
