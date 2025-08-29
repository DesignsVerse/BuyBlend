"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail, Phone, MapPin, Clock,
  Linkedin, Twitter, Instagram,
  Loader2, CheckCircle2, AlertTriangle, Send
} from "lucide-react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  consent: boolean;
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
  file: undefined,
  honeypot: "",
};

const topics = [
  { value: "", label: "Select a topic" },
  { value: "sales", label: "Sales inquiry" },
  { value: "support", label: "Product support" },
  { value: "partnerships", label: "Partnerships" },
  { value: "press", label: "Press / media" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

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
    return e;
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      const firstKey = Object.keys(v);
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
      formData.set("consent", data.consent ? "yes" : "no");

      const res = await fetch("/api/contact", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setStatusMsg("Thank you! Your message has been sent.");
      setData(initialState);
    } catch {
      setStatus("error");
      setStatusMsg("Something went wrong. Please try again.");
    }
  };

  const isDisabled = status === "loading";

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 overflow-hidden">
      {/* Ambient blobs switched to amber-friendly tints */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 -right-20 h-96 w-96 rounded-full bg-gray-200/40 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl animate-pulse-slow" />
      </div>

      {/* Floating particles – neutralized tint */}
      {isMounted && (
        <div className="pointer-events-none absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-amber-300/20 to-gray-300/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                animation: `float${Math.floor(Math.random() * 3) + 1} ${Math.random() * 15 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>
      )}

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-amber-700 mb-4 inline-block">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or proposal? We'd love to hear from you. Reach out via the form or the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Info card */}
          <aside className="relative rounded-2xl border border-amber-200/60 bg-white/85 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-amber-50/60 opacity-70" />
            <div className="relative p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact Information</h2>
                <p className="text-gray-600">
                  Fill out the form or use the contact details below to get in touch with our team.
                </p>
              </div>

              <ul className="space-y-5 mb-10">
                <li className="flex items-start gap-4 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <span className="text-gray-600">hello@example.com</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Phone</h3>
                    <span className="text-gray-600">+91 98765 43210</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Address</h3>
                    <span className="text-gray-600">Bandra Kurla Complex, Mumbai, MH 400051</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Business Hours</h3>
                    <span className="text-gray-600">Mon–Fri: 9:30 AM – 6:30 PM IST</span>
                  </div>
                </li>
              </ul>

              {/* Socials */}
              <div className="flex items-center gap-3">
                <Link
                  aria-label="LinkedIn"
                  href="#"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white transition-all hover:bg-amber-700 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  aria-label="Twitter"
                  href="#"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white transition-all hover:bg-gray-800 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  aria-label="Instagram"
                  href="#"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-600 to-rose-500 text-white transition-all hover:from-amber-700 hover:to-rose-600 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Form card */}
          <section className="relative rounded-2xl border border-amber-200/60 bg-white/85 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-amber-50/60 opacity-70" />
            <form onSubmit={submit} className="relative p-8 sm:p-10" noValidate>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={data.name}
                    onChange={onChange}
                    className={`mt-1 block w-full rounded-xl border ${
                      errors.name
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    } bg-white/70 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                    placeholder="e.g., Priya Sharma"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="sm:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={onChange}
                    className={`mt-1 block w-full rounded-xl border ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    } bg-white/70 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                    placeholder="name@company.com"
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
                    className={`mt-1 block w-full rounded-xl border ${
                      errors.phone
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    } bg-white/70 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                    placeholder="+91 98xxxxxxx"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Topic */}
                <div className="sm:col-span-1">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <div className="relative">
                    <select
                      id="topic"
                      name="topic"
                      value={data.topic}
                      onChange={onChange}
                      className={`mt-1 block w-full appearance-none rounded-xl border ${
                        errors.topic
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                          : "border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                      } bg-white/70 px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
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

                {/* Message */}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={data.message}
                    onChange={onChange}
                    className={`mt-1 block w-full rounded-xl border ${
                      errors.message
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                    } bg-white/70 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all duration-200`}
                    placeholder="How can we help?"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : "message-hint"}
                  />
                  {!errors.message && (
                    <p id="message-hint" className="mt-1 text-sm text-gray-500">Please include relevant details like order ID, links, or timelines.</p>
                  )}
                  {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>}
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
                        className={`h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 ${errors.consent ? "border-red-400" : ""}`}
                        aria-invalid={!!errors.consent}
                        aria-describedby={errors.consent ? "consent-error" : "consent-hint"}
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <Link href="/privacy" className="underline underline-offset-2 text-amber-700 hover:text-amber-800">Privacy Policy</Link>.
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3.5 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
                  <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {statusMsg}
                  </span>
                )}
                {status === "error" && (
                  <span className="inline-flex items-center text-red-700 bg-red-50 px-4 py-2 rounded-lg">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {statusMsg}
                  </span>
                )}
              </div>
            </form>
          </section>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  );
}
