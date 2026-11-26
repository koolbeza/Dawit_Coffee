"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, Navigation, Facebook } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function Inquiries() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const submittedForm = { ...form };

    const fallbackWaUrl = `https://wa.me/251911207323?text=${encodeURIComponent(
      `New message:\nName: ${submittedForm.name}\nEmail: ${submittedForm.email}\nCompany: ${submittedForm.company || "N/A"}\nMessage: ${submittedForm.message}`
    )}`;

    // Open popup immediately to avoid browser popup blockers blocking window.open inside async callbacks
    const popup = window.open(fallbackWaUrl, "_blank");
    if (!popup) {
      window.location.href = fallbackWaUrl;
    }

    const openWhatsApp = (url: string) => {
      if (popup && !popup.closed) {
        popup.location.replace(url);
      } else {
        window.location.href = url;
      }
    };

    try {
      const res = await fetch(`${API_BASE}/api/inquiries/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submittedForm),
      });
      if (!res.ok) throw new Error("Server error");

      const { url } = await res.json() as { url: string };
      openWhatsApp(url);

      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch {
      // API failed — fallback popup is already open with the pre-built message
      openWhatsApp(fallbackWaUrl);
      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "" });
    }
  }

  return (
    <section
      className="relative -mt-[68px] min-h-screen px-6 pb-24 pt-32 md:px-16"
      style={{ background: "#023732" }}
    >
      {/* Subtle radial warmth */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(242,168,30,0.08) 0%, transparent 60%)" }} />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ borderColor: "rgba(242,168,30,0.4)", background: "rgba(242,168,30,0.08)", color: "#F2A81E" }}>
            Get In Touch
          </span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl" style={{ color: "#f5ede0" }}>
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8" style={{ color: "rgba(232,213,183,0.75)" }}>
            Whether you&apos;re a first-time buyer or a returning partner, we&apos;re ready to assist.
          </p>
          <div className="mx-auto mt-5 h-px w-16" style={{ background: "rgba(242,168,30,0.4)" }} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">

          {/* ── FORM CARD ── */}
          <div className="rounded-2xl p-8 backdrop-blur-md"
            style={{ background: "rgba(2,55,50,0.80)", border: "1px solid rgba(242,168,30,0.2)", boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}>
            <h2 className="text-2xl font-bold" style={{ color: "#f5ede0" }}>Send an Inquiry</h2>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(242,168,30,0.75)" }}>
              Fill in your details and we&apos;ll respond via WhatsApp promptly.
            </p>

            <form id="inquiry-form" onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "#F2A81E" }}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(242,168,30,0.25)", color: "#f5ede0" }}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    onFocus={e => (e.target.style.borderColor = "rgba(242,168,30,0.7)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(242,168,30,0.25)")}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "#F2A81E" }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(242,168,30,0.25)", color: "#f5ede0" }}
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    onFocus={e => (e.target.style.borderColor = "rgba(242,168,30,0.7)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(242,168,30,0.25)")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "#F2A81E" }}>
                  Company <span style={{ color: "rgba(242,168,30,0.45)" }}>(optional)</span>
                </label>
                <input
                  id="company"
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(242,168,30,0.25)", color: "#f5ede0" }}
                  placeholder="Your company or organization"
                  value={form.company}
                  onChange={handleChange}
                  onFocus={e => (e.target.style.borderColor = "rgba(242,168,30,0.7)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(242,168,30,0.25)")}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "#F2A81E" }}>
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(242,168,30,0.25)", color: "#f5ede0" }}
                  placeholder="Tell us about your requirements, origin preferences, or quantities…"
                  value={form.message}
                  onChange={handleChange}
                  required
                  onFocus={e => (e.target.style.borderColor = "rgba(242,168,30,0.7)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(242,168,30,0.25)")}
                />
              </div>

              {status === "success" && (
                <p className="rounded-lg px-4 py-3 text-sm font-medium"
                  style={{ background: "rgba(242,168,30,0.12)", border: "1px solid rgba(242,168,30,0.3)", color: "#e8c98a" }}>
                  Message sent! We will get back to you via WhatsApp shortly.
                </p>
              )}
              {status === "error" && (
                <p className="rounded-lg px-4 py-3 text-sm font-medium"
                  style={{ background: "rgba(200,60,60,0.12)", border: "1px solid rgba(200,60,60,0.3)", color: "#f87171" }}>
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                form="inquiry-form"
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg py-3 text-sm font-bold uppercase tracking-wider transition-opacity disabled:opacity-60 hover:opacity-90"
                style={{ background: "#F2A81E", color: "#1a0e07" }}
              >
                {status === "loading" ? "Sending…" : "Send Message →"}
              </button>
            </form>
          </div>

          {/* ── INFO CARD ── */}
          <div className="space-y-5">

            {/* Map */}
            <div className="overflow-hidden rounded-2xl backdrop-blur-md"
              style={{ border: "1px solid rgba(242,168,30,0.2)", boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}>
              <iframe
                src="https://maps.google.com/maps?q=Dawit+Demissie+Telila+Coffee+Exporter,+Addis+Ababa,+Ethiopia&output=embed&z=15"
                width="100%"
                height="210"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dawit Demissie Telila Coffee Exporter location"
              />
              <div className="flex items-center justify-between px-5 py-3"
                style={{ background: "rgba(2,55,50,0.95)" }}>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#e8d5b7" }}>
                  <Navigation className="h-4 w-4" style={{ color: "#F2A81E" }} />
                  Addis Ababa, Ethiopia
                </div>
                <a href="https://maps.app.goo.gl/JvvxD6reNrVS1y2V8?g_st=iw" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold transition-opacity hover:opacity-75"
                  style={{ color: "#F2A81E" }}>
                  Open in Maps →
                </a>
              </div>
            </div>

            {/* Contact details */}
            <div className="rounded-2xl p-6 backdrop-blur-md"
              style={{ background: "rgba(2,55,50,0.80)", border: "1px solid rgba(242,168,30,0.2)", boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: "#F2A81E" }}>
                Direct Contact
              </h3>
              <div className="space-y-5">

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(242,168,30,0.1)", border: "1px solid rgba(242,168,30,0.22)" }}>
                    <Phone className="h-4 w-4" style={{ color: "#F2A81E" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(242,168,30,0.6)" }}>Phone</p>
                    <a href="tel:+251911207323" className="mt-1 block text-sm transition-opacity hover:opacity-75" style={{ color: "#e8d5b7" }}>+251 911-207-323</a>
                    <a href="tel:+251911625032" className="mt-0.5 block text-sm transition-opacity hover:opacity-75" style={{ color: "#e8d5b7" }}>+251 911-625-032</a>
                  </div>
                </div>

                <div className="h-px" style={{ background: "rgba(242,168,30,0.1)" }} />

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(242,168,30,0.1)", border: "1px solid rgba(242,168,30,0.22)" }}>
                    <Mail className="h-4 w-4" style={{ color: "#F2A81E" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(242,168,30,0.6)" }}>Email</p>
                    <a href="mailto:dawitdemissie0@gmail.com" className="mt-1 block text-sm transition-opacity hover:opacity-75" style={{ color: "#e8d5b7" }}>dawitdemissie0@gmail.com</a>
                    <a href="mailto:arcethiopia@yahoo.com" className="mt-0.5 block text-sm transition-opacity hover:opacity-75" style={{ color: "#e8d5b7" }}>arcethiopia@yahoo.com</a>
                  </div>
                </div>

                <div className="h-px" style={{ background: "rgba(242,168,30,0.1)" }} />

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(242,168,30,0.1)", border: "1px solid rgba(242,168,30,0.22)" }}>
                    <MessageCircle className="h-4 w-4" style={{ color: "#F2A81E" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(242,168,30,0.6)" }}>WhatsApp</p>
                    <a href="https://wa.me/251911207323" target="_blank" rel="noopener noreferrer"
                      className="mt-1 block text-sm transition-opacity hover:opacity-75" style={{ color: "#e8d5b7" }}>
                      +251 911-207-323
                    </a>
                  </div>
                </div>

                <div className="h-px" style={{ background: "rgba(242,168,30,0.1)" }} />

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(242,168,30,0.1)", border: "1px solid rgba(242,168,30,0.22)" }}>
                    <Facebook className="h-4 w-4" style={{ color: "#F2A81E" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(242,168,30,0.6)" }}>Facebook</p>
                    <a href="https://web.facebook.com/p/Dawit-Demissie-Telila-Coffee-Exporter-100063831459443/?_rdc=1&_rdr#"
                      target="_blank" rel="noopener noreferrer"
                      className="mt-1 block text-sm transition-opacity hover:opacity-75" style={{ color: "#e8d5b7" }}>
                      Dawit Demissie Telila Coffee Exporter
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Note */}
            <div className="rounded-2xl px-6 py-4"
              style={{ background: "rgba(242,168,30,0.07)", border: "1px solid rgba(242,168,30,0.2)" }}>
              <p className="text-sm leading-7" style={{ color: "rgba(232,213,183,0.8)" }}>
                All inquiries are forwarded directly via <span style={{ color: "#F2A81E", fontWeight: 600 }}>WhatsApp</span> for a fast response. We typically reply within a few hours during business hours.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
