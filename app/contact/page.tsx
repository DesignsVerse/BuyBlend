"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail, Phone, MapPin, Clock,
  Linkedin, Twitter, Instagram,
  Loader2, CheckCircle2, AlertTriangle, Send,
  ShoppingBag, Headphones, Truck, Shield, ArrowRight
} from "lucide-react";

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
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Decorative elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gray-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-30" />
      </div>



      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about your order, products, or anything else? Our team is here to help.
          </p>
        </div>

        {/* Support features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-full mb-4">
              <Headphones className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Round-the-clock assistance for all your queries</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-full mb-4">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Shipping</h3>
            <p className="text-gray-600 text-sm">Free shipping on orders over $50</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-full mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600 text-sm">Your payment information is safe with us</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-full mb-4">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-sm">30-day return policy on all items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Info card */}
          <aside className="relative rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact Information</h2>
                <p className="text-gray-600">
                  Get in touch with our customer support team through any of these channels.
                </p>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black text-white shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <span className="text-gray-600">support@example.com</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black text-white shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Phone</h3>
                    <span className="text-gray-600">+1 (800) 123-4567</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black text-white shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Address</h3>
                    <span className="text-gray-600">123 Commerce St, Business District, 10001</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-800 text-white shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Business Hours</h3>
                    <span className="text-gray-600">Mon-Fri: 9AM-6PM EST</span>
                  </div>
                </li>
              </ul>

              {/* FAQ CTA */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Before you contact us</h3>
                <p className="text-gray-600 text-sm mb-3">Many questions are answered in our FAQ section.</p>
                <Link 
                  href="/faq" 
                  className="inline-flex items-center text-sm font-medium text-black hover:underline"
                >
                  Visit FAQ <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {/* Socials */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Follow us</h3>
                <div className="flex items-center gap-3">
                  <Link
                    aria-label="LinkedIn"
                    href="#"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white transition-all hover:bg-black"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    aria-label="Twitter"
                    href="#"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white transition-all hover:bg-black"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    aria-label="Instagram"
                    href="#"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white transition-all hover:bg-black"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Form card */}
          <section className="relative rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            <form onSubmit={submit} className="p-8 sm:p-10" noValidate>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={data.name}
                    onChange={onChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                    } bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={onChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                    } bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                    placeholder="your.email@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={onChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                    } bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
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
                      className={`mt-1 block w-full appearance-none rounded-lg border ${
                        errors.topic
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-black focus:ring-black"
                      } bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
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
                      className={`mt-1 block w-full rounded-lg border ${
                        errors.orderNumber
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-black focus:ring-black"
                      } bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
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
                    className={`mt-1 block w-full rounded-lg border ${
                      errors.message
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                    } bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                    placeholder="Please describe your issue or question in detail..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : "message-hint"}
                  />
                  {!errors.message && (
                    <p id="message-hint" className="mt-1 text-sm text-gray-500">Please include relevant details like order ID, product details, or timelines.</p>
                  )}
                  {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                {/* File Upload */}
                <div className="sm:col-span-2">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Attach file (optional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-800 focus-within:outline-none"
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
                        className={`h-4 w-4 rounded border-gray-300 text-black focus:ring-black ${errors.consent ? "border-red-500" : ""}`}
                        aria-invalid={!!errors.consent}
                        aria-describedby={errors.consent ? "consent-error" : "consent-hint"}
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <Link href="/privacy" className="underline underline-offset-2 text-black hover:text-gray-800">Privacy Policy</Link>.
                    </span>
                  </label>
                  {!errors.consent && <p id="consent-hint" className="mt-1 text-xs text-gray-500 ml-7">This allows contact regarding the inquiry.</p>}
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
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3.5 text-white shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send message
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
          </section>
        </div>
      </section>
    </main>
  );
}