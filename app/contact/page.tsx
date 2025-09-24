"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock,
  Linkedin, Twitter, Instagram,
  Loader2, CheckCircle2, AlertTriangle, Send,
  ShoppingBag, Headphones, Truck, Shield, ArrowRight
} from "lucide-react";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  consent: boolean;
  orderNumber: string;
  file?: File | null;
  honeypot: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
  consent: false,
  orderNumber: "",
  file: undefined,
  honeypot: "",
};

const topics = [
  { value: "", label: "Select a topic" },
  { value: "order", label: "Order inquiry" },
  { value: "shipping", label: "Shipping & delivery" },
  { value: "returns", label: "Returns & exchanges" },
  { value: "product", label: "Product questions" },
  { value: "billing", label: "Billing issues" },
  { value: "wholesale", label: "Wholesale inquiries" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const validate = useCallback((d: FormState) => {
    const e: Record<string, string> = {};
    if (!d.name.trim()) e.name = "Please enter a name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Enter a valid email address.";
    if (d.phone && !/^[0-9+\-() \t]{7,20}$/.test(d.phone)) e.phone = "Enter a valid phone number.";
    if (!d.topic) e.topic = "Choose a topic.";
    if (d.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
    if (!d.consent) e.consent = "Please agree to the privacy policy.";
    if (d.file && d.file.size > 3 * 1024 * 1024) e.file = "File size must be under 3MB.";
    if ((d.topic === "order" || d.topic === "returns") && !d.orderNumber.trim()) {
      e.orderNumber = "Order number is required for this inquiry.";
    }
    return e;
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    
    if (name === "topic") {
      setSelectedTopic(value);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.honeypot) {
      setStatus("success");
      setStatusMsg("Thanks! We'll be in touch shortly.");
      return;
    }
    const v = validate(data);
    if (Object.keys(v).length) {
      setErrors(v);
      const firstKey = Object.keys(v)[0];
      const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
      el?.focus();
      return;
    }
    setStatus("loading");
    setStatusMsg("");
    try {
      const formData = new FormData();
      formData.set("name", data.name);
      formData.set("email", data.email);
      formData.set("phone", data.phone);
      formData.set("topic", data.topic);
      formData.set("message", data.message);
      formData.set("orderNumber", data.orderNumber);
      formData.set("consent", data.consent ? "yes" : "no");
      if (data.file) {
        formData.set("file", data.file);
      }

      const res = await fetch("/api/contact", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setStatusMsg("Thank you! Your message has been sent. We'll respond within 24 hours.");
      setData(initialState);
      setSelectedTopic("");
    } catch {
      setStatus("error");
      setStatusMsg("Something went wrong. Please try again.");
    }
  };

  const isDisabled = status === "loading";

  return (
    <main className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-amber-100/20 rounded-full -translate-x-1/3 -translate-y-1/3 opacity-50" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-amber-200/20 rounded-full translate-x-1/3 translate-y-1/3 opacity-30" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <motion.div
          className="text-center mb-12 md:mb-16"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-4 font-serif">
            <span className="text-amber-600">Connect</span> With Us
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
            We're here to assist with any questions about our collections, orders, or bespoke services.
          </p>
        </motion.div>

        {/* Support features */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {[
            { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock assistance for all your queries" },
            { icon: Truck, title: "Fast Shipping", desc: "Free shipping on orders over $50" },
            { icon: Shield, title: "Secure Payments", desc: "Your payment information is safe with us" },
            { icon: ShoppingBag, title: "Easy Returns", desc: "30-day return policy on all items" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-full mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Info card */}
          <motion.aside
            className="relative rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="p-6 sm:p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3 font-serif">Contact Information</h2>
                <p className="text-gray-600 text-base sm:text-lg">
                  Reach out through your preferred channel for personalized assistance.
                </p>
              </div>

              <ul className="space-y-5 mb-10">
                {[
                  { icon: Mail, title: "Email", value: "support@example.com" },
                  { icon: Phone, title: "Phone", value: "+1 (800) 123-4567" },
                  { icon: MapPin, title: "Address", value: "123 Commerce St, Business District, 10001" },
                  { icon: Clock, title: "Business Hours", value: "Mon-Fri: 9AM-6PM EST" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black text-white shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">{item.title}</h3>
                      <span className="text-gray-600 text-sm">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* FAQ CTA */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Before You Contact Us</h3>
                <p className="text-gray-600 text-sm mb-3">Many questions are answered in our FAQ section.</p>
                <Link 
                  href="/faq" 
                  className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  Visit FAQ <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Socials */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 text-base sm:text-lg">Follow Us</h3>
                <div className="flex items-center gap-3">
                  {[Linkedin, Twitter, Instagram].map((Icon, index) => (
                    <Link
                      key={index}
                      aria-label={Icon.name}
                      href="#"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white transition-all hover:bg-black"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Form card */}
          <motion.section
            className="relative rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <form onSubmit={submit} className="p-6 sm:p-8 md:p-10" noValidate>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2 font-serif">Send a Message</h2>
                <p className="text-gray-600 text-base sm:text-lg">Our team will respond within 24 hours.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {/* Name */}
                <div className="sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={data.name}
                    onChange={onChange}
                    className={`block w-full rounded-lg border ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                    } bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base`}
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={onChange}
                    className={`block w-full rounded-lg border ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                    } bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base`}
                    placeholder="your.email@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={onChange}
                    className={`block w-full rounded-lg border ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                    } bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base`}
                    placeholder="(123) 456-7890"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Topic */}
                <div className="sm:col-span-1">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic *</label>
                  <div className="relative">
                    <select
                      id="topic"
                      name="topic"
                      value={data.topic}
                      onChange={onChange}
                      className={`block w-full appearance-none rounded-lg border ${
                        errors.topic
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                      } bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base`}
                      aria-invalid={!!errors.topic}
                      aria-describedby={errors.topic ? "topic-error" : undefined}
                    >
                      {topics.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-1 text-gray-500">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {errors.topic && <p id="topic-error" className="mt-1 text-sm text-red-600">{errors.topic}</p>}
                </div>

                {/* Order Number (conditionally shown) */}
                {(selectedTopic === "order" || selectedTopic === "returns") && (
                  <div className="sm:col-span-2">
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">Order Number *</label>
                    <input
                      id="orderNumber"
                      name="orderNumber"
                      type="text"
                      value={data.orderNumber}
                      onChange={onChange}
                      className={`block w-full rounded-lg border ${
                        errors.orderNumber
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                      } bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base`}
                      placeholder="e.g., ORD-123456"
                      aria-invalid={!!errors.orderNumber}
                      aria-describedby={errors.orderNumber ? "orderNumber-error" : undefined}
                    />
                    {errors.orderNumber && <p id="orderNumber-error" className="mt-1 text-sm text-red-600">{errors.orderNumber}</p>}
                  </div>
                )}

                {/* Message */}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={data.message}
                    onChange={onChange}
                    className={`block w-full rounded-lg border ${
                      errors.message
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-amber-600 focus:ring-amber-600"
                    } bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base`}
                    placeholder="Please describe your issue or question in detail..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : "message-hint"}
                  />
                  {!errors.message && (
                    <p id="message-hint" className="mt-1 text-xs sm:text-sm text-gray-500">Please include relevant details like order ID, product details, or timelines.</p>
                  )}
                  {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                {/* File Upload */}
                <div className="sm:col-span-2">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Attach File (Optional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-amber-600 transition-all duration-200">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-700 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input 
                            id="file" 
                            name="file" 
                            type="file" 
                            className="sr-only" 
                            onChange={onFileChange}
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 3MB</p>
                    </div>
                  </div>
                  {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                  {data.file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {data.file.name} ({(data.file.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                </div>

                {/* Consent */}
                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        name="consent"
                        type="checkbox"
                        checked={data.consent}
                        onChange={onChange}
                        className={`h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600 ${errors.consent ? "border-red-500" : ""}`}
                        aria-invalid={!!errors.consent}
                        aria-describedby={errors.consent ? "consent-error" : "consent-hint"}
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <Link href="/privacy" className="underline underline-offset-2 text-amber-600 hover:text-amber-700">Privacy Policy</Link>.
                    </span>
                  </label>
                  {!errors.consent && <p id="consent-hint" className="mt-1 text-xs sm:text-sm text-gray-500 ml-7">This allows contact regarding the inquiry.</p>}
                  {errors.consent && <p id="consent-error" className="mt-1 text-sm text-red-600 ml-7">{errors.consent}</p>}
                </div>

                {/* Honeypot */}
                <div className="hidden" aria-hidden>
                  <label htmlFor="company" className="sr-only">Company</label>
                  <input
                    id="company"
                    name="honeypot"
                    type="text"
                    value={data.honeypot}
                    onChange={onChange}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isDisabled}
                  className="inline-flex items-center justify-center gap-2 rounded-lgc px-6 py-3.5 text-white shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>

                {status === "success" && (
                  <span className="inline-flex items-center text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {statusMsg}
                  </span>
                )}
                {status === "error" && (
                  <span className="inline-flex items-center text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {statusMsg}
                  </span>
                )}
              </div>
            </form>
          </motion.section>
        </div>
      </section>
    </main>
  );
}