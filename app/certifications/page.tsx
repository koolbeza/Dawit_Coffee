"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCertifications, imageUrl, type Certification } from "@/lib/api";
import { X, ChevronLeft, ChevronRight, ZoomIn, Award, FileCheck } from "lucide-react";

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [lightbox, setLightbox] = useState<{ src: string; name: string; index: number } | null>(null);

  useEffect(() => {
    getCertifications().then(setCerts);
  }, []);

  const withImg = certs.filter((c) => imageUrl(c.image_file));

  function open(c: Certification) {
    const src = imageUrl(c.image_file);
    if (!src) return;
    const index = withImg.findIndex((x) => x.id === c.id);
    setLightbox({ src, name: c.name, index });
  }

  function nav(dir: 1 | -1) {
    if (!lightbox) return;
    const next = (lightbox.index + dir + withImg.length) % withImg.length;
    const c = withImg[next];
    setLightbox({ src: imageUrl(c.image_file)!, name: c.name, index: next });
  }

  useEffect(() => {
    if (!lightbox) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, withImg.length]);

  return (
    <div className="relative min-h-screen">

      {/* ── Full-page background ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/cf.jpg" alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 bg-black/70" style={{ zIndex: 1 }} />

      <div className="relative" style={{ zIndex: 2 }}>

      {/* ── Hero ── */}
      <div className="px-6 py-20 md:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4" style={{ color: "#F2A81E" }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#F2A81E" }}>Standards & Compliance</p>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight max-w-xl">
            Our Certifications
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
            Every certification we hold is a promise to our farmers, our buyers,
            and the planet. Explore the standards that govern every lot we export.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:px-20">

        {/* Empty state */}
        {certs.length === 0 && (
          <div className="rounded-2xl border border-dashed py-24 text-center" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
            <Award className="mx-auto h-10 w-10 mb-3" style={{ color: "rgba(255,255,255,0.3)" }} />
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No certifications listed yet.</p>
          </div>
        )}

        {/* Grid */}
        {certs.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert) => {
              const img = imageUrl(cert.image_file);
              return (
                <div
                  key={cert.id}
                  className="group flex flex-col rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(16px)" }}
                >
                  {/* Image */}
                  <div
                    className="relative flex items-center justify-center bg-white overflow-hidden"
                    style={{ height: "280px" }}
                  >
                    {img ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={cert.name}
                          className="w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                          onClick={() => open(cert)}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                          style={{ background: "rgba(0,0,0,0.3)" }}
                          onClick={() => open(cert)}
                        >
                          <span className="flex items-center gap-2 rounded-2xl bg-white/90 px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-lg">
                            <ZoomIn className="h-4 w-4" /> View Certificate
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-green-50 border border-green-100">
                        <Award className="h-12 w-12 text-green-600/40" />
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px" style={{ background: "rgba(255,255,255,0.1)" }} />

                  {/* Text */}
                  <div className="flex flex-col flex-1 px-6 py-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(242,168,30,0.15)" }}>
                        <FileCheck className="h-3.5 w-3.5" style={{ color: "#F2A81E" }} />
                      </span>
                      <div>
                        <h3 className="font-bold text-white text-base">{cert.name}</h3>
                        {cert.description && (
                          <p className="mt-1.5 text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>{cert.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust Section */}
        <div className="mt-20 overflow-hidden rounded-3xl shadow-lg">
          <div className="relative h-52">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cb3.jpg" alt="Export-grade green coffee beans" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-10 pb-7">
              <p className="text-lg font-semibold text-white">Export-grade green beans, ready for your roastery</p>
              <p className="mt-1 text-sm text-amber-200/80">Traceable from farm to port</p>
            </div>
          </div>
          <div className="p-10" style={{ background: "rgba(2,55,50,0.85)", backdropFilter: "blur(20px)" }}>
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#F2A81E" }}>Documentation</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Full paperwork on every shipment</h2>
                <p className="mt-4 leading-7" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Every container includes a complete documentation package: certificate of origin,
                  phytosanitary certificate, packing list, commercial invoice, cupping reports, and
                  all applicable certification documents.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "Certificate of Origin",
                  "Phytosanitary Certificate",
                  "Organic Certificate",
                  "Fair Trade Certificate",
                  "Q-Grade Cupping Report",
                  "Bill of Lading",
                ].map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: "#F2A81E" }} />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl p-12 text-center" style={{ background: "rgba(2,55,50,0.75)", border: "1px solid rgba(242,168,30,0.2)", backdropFilter: "blur(20px)" }}>
          <p className="text-lg font-semibold text-white">Need specific certification documents?</p>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>We&apos;ll send the relevant paperwork for any procurement decision.</p>
          <Link
            href="/inquiries"
            className="mt-6 inline-block rounded-xl px-8 py-3 text-sm font-semibold shadow-md transition-opacity hover:opacity-90"
            style={{ background: "#F2A81E", color: "#023732" }}
          >
            Contact Our Team
          </Link>
        </div>
      </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(16px)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full p-2.5 text-white transition-colors hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.1)" }}
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>

          {withImg.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={(e) => { e.stopPropagation(); nav(-1); }}
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.name}
            className="rounded-3xl object-contain"
            style={{
              maxHeight: "85vh",
              maxWidth: "80vw",
              background: "#fff",
              padding: "2.5rem",
              boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {withImg.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={(e) => { e.stopPropagation(); nav(1); }}
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-center">
            <p className="text-base font-semibold text-white">{lightbox.name}</p>
            {withImg.length > 1 && (
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                {lightbox.index + 1} / {withImg.length}&nbsp;·&nbsp;← → to navigate&nbsp;·&nbsp;Esc to close
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
