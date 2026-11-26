"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProduct, imageUrl, type Product } from "@/lib/api";
import { Coffee, ArrowLeft, Mountain, Leaf, Sparkles, MapPin } from "lucide-react";

function ProductDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [product, setProduct] = useState<Product | null | "loading">("loading");

  useEffect(() => {
    if (!id) { setProduct(null); return; }
    getProduct(id).then(setProduct);
  }, [id]);

  if (product === "loading") {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/coffee forest.png" alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" style={{ zIndex: 0 }} />
        <div className="fixed inset-0 bg-black/70" style={{ zIndex: 1 }} />
        <div className="relative" style={{ zIndex: 2 }}>
          <Coffee className="h-10 w-10 text-amber-400 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/coffee forest.png" alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" style={{ zIndex: 0 }} />
        <div className="fixed inset-0 bg-black/70" style={{ zIndex: 1 }} />
        <div className="relative text-center" style={{ zIndex: 2 }}>
          <p className="text-white/60 text-lg">Product not found.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const img = imageUrl(product.image_file);
  const origins = product.product_origin
    ? product.product_origin.split(",").map((o) => o.trim()).filter(Boolean)
    : [];
  const flavorNotes = product.flavor_notes
    ? product.flavor_notes.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <div className="relative min-h-screen">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/coffee forest.png" alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 bg-black/70" style={{ zIndex: 1 }} />

      <div className="relative" style={{ zIndex: 2 }}>
        <div className="px-6 pt-10 md:px-20">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Products
            </Link>
          </div>
        </div>

        <div className="px-6 py-10 md:px-20">
          <div className="mx-auto max-w-5xl">

            <div
              className="overflow-hidden rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="lg:flex">
                <div className="lg:w-2/5 flex-shrink-0">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={product.product_name}
                      className="h-72 w-full object-cover lg:h-full"
                      style={{ minHeight: "320px" }}
                    />
                  ) : (
                    <div
                      className="h-72 w-full lg:h-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.04)", minHeight: "320px" }}
                    >
                      <Coffee className="h-16 w-16" style={{ color: "rgba(255,255,255,0.15)" }} />
                    </div>
                  )}
                </div>

                <div className="p-8 lg:p-10 flex flex-col justify-between lg:w-3/5">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Coffee className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                        Ethiopian Specialty Coffee
                      </span>
                    </div>

                    <h1 className="text-4xl font-bold text-white leading-tight">
                      {product.product_name}
                    </h1>

                    {origins.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {origins.map((origin) => (
                          <span
                            key={origin}
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}
                          >
                            <MapPin className="h-3 w-3" />
                            {origin}
                          </span>
                        ))}
                      </div>
                    )}

                    {product.description && (
                      <p
                        className="mt-5 text-base leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/inquiries"
                      className="inline-block rounded-xl px-8 py-3 text-sm font-semibold text-green-900 shadow-lg transition-all hover:scale-105 hover:shadow-amber-400/20"
                      style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" }}
                    >
                      Request a Sample
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.altitude && (
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Mountain className="h-4 w-4 text-green-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-green-400">Altitude</span>
                  </div>
                  <p className="text-xl font-bold text-white">{product.altitude}</p>
                </div>
              )}

              {product.process && (
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf className="h-4 w-4 text-green-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-green-400">Process</span>
                  </div>
                  <p className="text-xl font-bold text-white">{product.process}</p>
                </div>
              )}

              {flavorNotes.length > 0 && (
                <div
                  className="rounded-2xl p-6 sm:col-span-2 lg:col-span-1"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-green-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-green-400">Flavor Notes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {flavorNotes.map((note) => (
                      <span
                        key={note}
                        className="rounded-full px-3 py-1 text-sm font-medium text-white"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="mt-6 rounded-3xl p-8 text-center"
              style={{ background: "rgba(20,50,25,0.65)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
            >
              <h2 className="text-xl font-bold text-white">Interested in this lot?</h2>
              <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                Contact us to discuss availability, pricing, and shipping options.
              </p>
              <Link
                href="/inquiries"
                className="mt-5 inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-green-900 shadow-lg transition-colors hover:bg-green-50"
              >
                Send an Inquiry
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense>
      <ProductDetail />
    </Suspense>
  );
}
