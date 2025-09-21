  
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
    { id: "shipping-policy", title: "Shipping Policy" },
    { id: "cancellation", title: "Cancellation Policy" },
    { id: "return-policy", title: "Return Policy" },
    { id: "damaged-wrong", title: "Damaged/Wrong Products" },
    { id: "no-questions", title: "No Questions Asked Returns" },
    { id: "self-ship", title: "Self Ship Process" },
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
              Delivery & Returns
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              At Blend, we strive to make sure you have the best experience while selecting and buying your favorite Combo. Please review our policies before making a purchase.
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
                  To request a return/exchange, please Whatsapp us on 8626075748 or mail us on support@buyblend.in.
                </p>
                <p>
                  At Blend, we strive to make sure you have the best experience while selecting and buying your favorite Combo. Despite our best efforts to keep our customers happy, there are times when you might feel the need to return your product for circumstances beyond your or our control.
                </p>
                <p>
                  We have listed everything below about our Cancellation and Refunds policy so that in case you do decide to cancel your order, or seek refunds, you do not face an iota of a problem.
                </p>
              </section>

              {/* Shipping Policy */}
              <section id="shipping-policy" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck className="h-6 w-6 text-amber-600 mr-3" />
                  Shipping Policy
                </h2>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>The estimated Delivery time is 3-7 days from the date of purchase depending upon the location of the delivery.</li>
                  <li>We offer both COD and Prepaid payment options.</li>
                  <li>A discount of Rs. 50 is available for prepaid orders above Rs.450. For COD payment, there are additional Cash handling charges of Rs.50</li>
                  <li>Shipping charges of Rs.60 applied on orders below Rs.450. FREE Shipping on orders above Rs. 450</li>
                  <li>To ensure that your order is delivered on time, please make sure to provide complete address details with house number, floor, street name, landmark</li>
                  <li>If you receive a damaged parcel, please DO NOT accept it and inform us at 8626075748 (9AM – 6PM) or email us at support@fubs.in.</li>
                </ol>
              </section>

              {/* Cancellation Policy */}
              <section id="cancellation" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
                  Cancellation Policy
                </h2>
                <p>
                  You can cancel an order if it has not been shipped from our warehouse. Send a request to support@fubs.in or whatsapp us on 8626075748. Any amount paid will be credited into the same payment mode using which the payment was made in the given time for each mode. The amount will reflect back in your account in 4-5 days. However, if your order has been shipped, it cannot be cancelled and the return policy mentioned below is applicable.
                </p>
              </section>

              {/* Return Policy */}
              <section id="return-policy" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <RotateCcw className="h-6 w-6 text-amber-600 mr-3" />
                  Return Policy
                </h2>
                <p>
                  FUBS provides hassle free returns for all products. We just want that you don't use the products and keep them in their original condition. FUBS only accepts Returns/ Replacement claim made within the first 48 hours after delivery.
                </p>
              </section>

              {/* Damaged/Wrong Products */}
              <section id="damaged-wrong" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <PackageSearch className="h-6 w-6 text-amber-600 mr-3" />
                  If the product you have received is damaged/missing/wrong product
                </h2>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>Please don't worry, in this case we just ask you to send the pictures & Opening Video of the damaged product and send you the correct product at your doorstep FREE OF COST.</li>
                  <li>If you have received a wrong product, make sure to not use the product and preserve it in it's original condition as we will initiate the return of that product and the quality check of the product will be done at our warehouse. If anything is missing/used you will have to incur the charge of the same. We will be re-shipping you the correct product once we receive the wrong product back.</li>
                  <li>For Missing/ Wrong Product; Customer is Advised to Take a Video of Unboxing. We will consider this as proof and helps us further Claim Insurance from the Courier Company. Without an Unboxing Video proof we do not consider the Missing/ Wrong product Claims.</li>
                  <li><strong>Proper Unboxing Video –</strong>
                    <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                      <li>Must show label on the package pasted by FUBS, with the order ID</li>
                      <li>Must be without any pauses or cuts</li>
                      <li>Must show the product properly</li>
                    </ul>
                  </li>
                </ol>
              </section>

              {/* No Questions Asked Returns */}
              <section id="no-questions" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 text-amber-600 mr-3" />
                  If you don't like the product or wish to return the product for any other reason
                </h2>
                <p>
                  At FUBS, your satisfaction is our priority! ❤️
                </p>
                <p>
                  We offer a "No Questions Asked" Return or Replacement Policy.
                </p>
                <p>
                  You can request a return or replacement within 48 hours of delivery, please whatsapp us on 8626075748 or email us on support@fubs.in.
                </p>
                <p>
                  We'll issue a FULL REFUND once we receive the product back in original condition.
                </p>
                <p>
                  <strong>Please note:</strong> We do not offer return pickup. You will need to self-ship the product to our address.
                </p>
                <p>
                  The return shipping cost is to be borne by the customer.
                </p>
              </section>

              {/* Self Ship Process */}
              <section id="self-ship" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ClipboardList className="h-6 w-6 text-amber-600 mr-3" />
                  To Self ship the products
                </h2>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li>Kindly pack the items securely to prevent any loss or damage during transit. Make sure to cover the items in a box and tape them properly. We recommend you use a reliable courier service for returns.</li>
                  <li>Please mail us the details of the courier partner through which you have returned the products.</li>
                  <li>Products should be packed properly in the pink box and proper taping should be done to the box to avoid any damages. (This directly affects your refund.)</li>
                  <li>Once the product reaches our warehouse, the quality check will be done from our end and the report will be sent to you on your email/ phone.</li>
                  <li>If any product is missing/damaged/used in the returns, the refund for that product will not be provided to you</li>
                  <li>This may take a time of around 7-10 days for you to get the refund</li>
                  <li>No returns will be accepted in case the products are used or in non-saleable condition. All tags and labels need to be intact.</li>
                  <li>To request a return, please whatsapp us on 8626075748 or mail us on support@fubs.in.</li>
                </ol>
              </section>

              {/* Contact */}
              <section id="contact" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-3" />
                  Contact
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p><strong>Email:</strong> support@fubs.in</p>
                  <p><strong>Phone:</strong> 8626075748</p>
                  <p><strong>Website:</strong> fubs.in</p>
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
