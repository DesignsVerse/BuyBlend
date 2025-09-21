"use client"
import { useState } from "react"
import { SiteHeader } from "@/components/Home/header"
import { TrustBadgesSection } from "@/components/Home/trustbadges"
import { FileText, Scale, ShoppingBag, User, Shield, AlertCircle, Mail, Clock, Lock } from "lucide-react"
import { motion } from "framer-motion"

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("introduction")

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Definitions" },
    { id: "cookies", title: "Cookies" },
    { id: "license", title: "License" },
    { id: "comments", title: "Comments" },
    { id: "hyperlinking", title: "Hyperlinking" },
    { id: "iframes", title: "iFrames" },
    { id: "content-liability", title: "Content Liability" },
    { id: "privacy", title: "Your Privacy" },
    { id: "reservation", title: "Reservation of Rights" },
    { id: "removal", title: "Removal of Links" },
    { id: "disclaimer", title: "Disclaimer" },
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
              Please read these terms carefully before using our website or purchasing our products at Blend.
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
                  Terms and Conditions
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Welcome to <strong>Blend</strong>!
                  </p>
                  <p>
                    These terms and conditions outline the rules and regulations for the use of Blend's Website, located at buyblend.in.
                  </p>
                  <p>
                    By accessing this website we assume you accept these terms and conditions. Do not continue to use Blend if you do not agree to take all of the terms and conditions stated on this page.
                  </p>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                    <p className="text-sm text-amber-700">
                      <strong>Note:</strong> These Terms constitute a legally binding agreement between you and Blend.
                    </p>
                  </div>
                </div>
              </section>

              {/* Definitions */}
              <section id="definitions" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Definitions</h2>
                <div className="space-y-4 text-gray-700">
                  <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>"Client", "You" and "Your"</strong> refers to you, the person log on this website and compliant to the Company's terms and conditions.</li>
                    <li><strong>"The Company", "Ourselves", "We", "Our" and "Us"</strong>, refers to our Company.</li>
                    <li><strong>"Party", "Parties", or "Us"</strong>, refers to both the Client and ourselves.</li>
                  </ul>
                  <p>
                    All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of India. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.
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
                    We employ the use of cookies. By accessing Blend, you agreed to use cookies in agreement with the Blend's Privacy Policy.
                  </p>
                  <p>
                    Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
                  </p>
                </div>
              </section>

              {/* License */}
              <section id="license" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-6 w-6 text-amber-600 mr-3" />
                  License
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Unless otherwise stated, Blend and/or its licensors own the intellectual property rights for all material on Blend. All intellectual property rights are reserved. You may access this from Blend for your own personal use subjected to restrictions set in these terms and conditions.
                  </p>
                  <p><strong>You must not:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Republish material from Blend</li>
                    <li>Sell, rent or sub-license material from Blend</li>
                    <li>Reproduce, duplicate or copy material from Blend</li>
                    <li>Redistribute content from Blend</li>
                  </ul>
                  <p>
                    This Agreement shall begin on the date hereof. Our Terms and Conditions were created with the help of the Terms And Conditions Generator.
                  </p>
                </div>
              </section>

              {/* Comments */}
              <section id="comments" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 text-amber-600 mr-3" />
                  Comments
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Blend does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Blend,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, Blend shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
                  </p>
                  <p>
                    Blend reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
                  </p>
                  <p><strong>You warrant and represent that:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                    <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
                    <li>The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy</li>
                    <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
                  </ul>
                  <p>
                    You hereby grant Blend a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.
                  </p>
                </div>
              </section>

              {/* Hyperlinking */}
              <section id="hyperlinking" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShoppingBag className="h-6 w-6 text-amber-600 mr-3" />
                  Hyperlinking to our Content
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p><strong>The following organizations may link to our Website without prior written approval:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Government agencies;</li>
                    <li>Search engines;</li>
                    <li>News organizations;</li>
                    <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                    <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
                  </ul>
                  <p>
                    These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
                  </p>
                  <p><strong>We may consider and approve other link requests from the following types of organizations:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>commonly-known consumer and/or business information sources;</li>
                    <li>dot.com community sites;</li>
                    <li>associations or other groups representing charities;</li>
                    <li>online directory distributors;</li>
                    <li>internet portals;</li>
                    <li>accounting, law and consulting firms; and</li>
                    <li>educational institutions and trade associations.</li>
                  </ul>
                  <p>
                    We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Blend; and (d) the link is in the context of general resource information.
                  </p>
                  <p>
                    These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
                  </p>
                  <p>
                    If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Blend. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
                  </p>
                  <p><strong>Approved organizations may hyperlink to our Website as follows:</strong></p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>By use of our corporate name; or</li>
                    <li>By use of the uniform resource locator being linked to; or</li>
                    <li>By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party's site.</li>
                  </ul>
                  <p>
                    No use of Blend's logo or other artwork will be allowed for linking absent a trademark license agreement.
                  </p>
                </div>
              </section>

              {/* iFrames */}
              <section id="iframes" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
                  iFrames
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
                  </p>
                </div>
              </section>

              {/* Content Liability */}
              <section id="content-liability" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 text-amber-600 mr-3" />
                  Content Liability
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                  </p>
                </div>
              </section>

              {/* Your Privacy */}
              <section id="privacy" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Lock className="h-6 w-6 text-amber-600 mr-3" />
                  Your Privacy
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Please read <a href="/privacy" className="text-amber-600 hover:text-amber-700 underline">Privacy Policy</a>
                  </p>
                </div>
              </section>

              {/* Reservation of Rights */}
              <section id="reservation" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-6 w-6 text-amber-600 mr-3" />
                  Reservation of Rights
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                  </p>
                </div>
              </section>

              {/* Removal of Links */}
              <section id="removal" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
                  Removal of links from our website
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
                  </p>
                  <p>
                    We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
                  </p>
                </div>
              </section>

              {/* Disclaimer */}
              <section id="disclaimer" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
                  Disclaimer
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>limit or exclude our or your liability for death or personal injury;</li>
                    <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                    <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                    <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                  </ul>
                  <p>
                    The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
                  </p>
                  <p>
                    As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
                  </p>
                  <p>
                    By submitting our webform, you agree to receive promotional calls on the number shared, and such calls and SMS would be coming from a third-party platform
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
                    <p><strong>Email:</strong> support@buyblend.in</p>
                    <p><strong>Phone:</strong> 8626075748</p>
                    <p><strong>Website:</strong> buyblend.in</p>
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