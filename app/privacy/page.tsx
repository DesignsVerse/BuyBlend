    "use client"
import { useState } from "react"
import { SiteHeader } from "@/components/Home/header"
import { TrustBadgesSection } from "@/components/Home/trustbadges"
import { Shield, Lock, Eye, User, CreditCard, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("who-we-are")

  const sections = [
    { id: "who-we-are", title: "Who We Are" },
    { id: "comments", title: "Comments" },
    { id: "media", title: "Media" },
    { id: "cookies", title: "Cookies" },
    { id: "embedded-content", title: "Embedded Content" },
    { id: "data-sharing", title: "Data Sharing" },
    { id: "data-retention", title: "Data Retention" },
    { id: "your-rights", title: "Your Rights" },
    { id: "data-transfer", title: "Data Transfer" },
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
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information at Blend.
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
              {/* Who We Are */}
              <section id="who-we-are" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 text-amber-600 mr-3" />
                  Who We Are
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our website address is: <strong>buyblend.in</strong>
                  </p>
                </div>
              </section>

              {/* Comments */}
              <section id="comments" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-3" />
                  Comments
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
                  </p>
                  <p>
                    An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/" className="text-amber-600 hover:text-amber-700 underline" target="_blank" rel="noopener noreferrer">https://automattic.com/privacy/</a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.
                  </p>
                </div>
              </section>

              {/* Media */}
              <section id="media" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Eye className="h-6 w-6 text-amber-600 mr-3" />
                  Media
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section id="cookies" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Lock className="h-6 w-6 text-amber-600 mr-3" />
                  Cookies
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
                  </p>
                  <p>
                    If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
                  </p>
                  <p>
                    When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
                  </p>
                  <p>
                    If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
                  </p>
                </div>
              </section>

              {/* Embedded Content */}
              <section id="embedded-content" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Eye className="h-6 w-6 text-amber-600 mr-3" />
                  Embedded Content from Other Websites
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                  </p>
                  <p>
                    These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
                  </p>
                </div>
              </section>

              {/* Data Sharing */}
              <section id="data-sharing" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-3" />
                  Who We Share Your Data With
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you request a password reset, your IP address will be included in the reset email.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Lock className="h-6 w-6 text-amber-600 mr-3" />
                  How Long We Retain Your Data
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                  </p>
                  <p>
                    For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                  </p>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 text-amber-600 mr-3" />
                  What Rights You Have Over Your Data
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
                  </p>
                </div>
              </section>

              {/* Data Transfer */}
              <section id="data-transfer" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-3" />
                  Where We Send Your Data
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Visitor comments may be checked through an automated spam detection service.
                  </p>
                </div>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-3" />
                  Contact Us
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p><strong>Email:</strong> support@buyblend.in</p>
                    <p><strong>Phone:</strong> 8626075748</p>
                    <p><strong>Website:</strong> buyblend.in</p>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  )
}