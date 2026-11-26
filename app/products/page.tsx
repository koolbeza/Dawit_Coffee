"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, imageUrl, type Product } from "@/lib/api";
import { Coffee, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const washedCoffeeItems = [
  { name: "Yirgacheffe Grade 1, 2 & UG", detail: "Intense floral character, moderate acidity, rich body. One of the world's best highland coffees." },
  { name: "Guji Grade 1, 2 & UG", detail: "From the Guji highlands; bright, complex, and fruit-forward with a clean finish." },
  { name: "Sidamo Grade 1, 2 & UG", detail: "Known as sweet coffee, with balanced taste, medium acidity and body; ideal for gourmet blends." },
  { name: "Limu Grade 1, 2 & UG", detail: "Grown at 3,600–6,200 ft in southwest Ethiopia; milder acidity, balanced and clean cup." },
  { name: "Teppi Grade 1, 2 & UG", detail: "Forest coffee from southwest Ethiopia with a smooth, mild profile." },
  { name: "Godere Grade 1, 2 & UG", detail: "High-altitude origin with a delicate, clean cup and fine acidity." },
  { name: "Kafa Grade 1, 2 & UG", detail: "From the birthplace of coffee; earthy and complex with a full body." },
];

const naturalCoffeeItems = [
  { name: "Djimma Grade 3, 4 & 5", detail: "Ethiopia's largest coffee basket, with diverse indigenous varieties from the southwest." },
  { name: "Sidamo Grade 1, 3 & 4", detail: "Sun-dried Sidamo delivers fruity sweetness with creamy mouthfeel and chocolaty undertones." },
  { name: "Guji Grade 1, 2 & 3", detail: "Natural process amplifies Guji's berry and tropical fruit aromatics." },
  { name: "Lekempti Grade 3, 4 & 5", detail: "Large bean, greenish-brown color; fruity taste with moderate acidity, popular in blends and single origin." },
  { name: "Harrar Grade 4 & 5", detail: "Eastern highlands; medium acidity, full body, and a distinct mocha flavor. Among the world's highest-premium coffees." },
  { name: "Bale Grade 3, 4 & 5", detail: "Wild and semi-forest coffee from Bale with a unique, winey natural profile." },
  { name: "House Blend Black Lion Special", detail: "A signature house blend crafted for a bold, well-rounded specialty cup." },
  { name: "Telila Special Grade 1", detail: "Our flagship single-origin natural lot, carefully selected for exceptional quality." },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="relative min-h-screen">

      {/* ── Full-page background ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/coffee forest.png" alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 bg-black/70" style={{ zIndex: 1 }} />

      <div className="relative" style={{ zIndex: 2 }}>

        <div className="pt-[90px]" />

        {/* ══ CATALOGUE ══ */}
        <div className="px-6 pb-6 pt-12 md:px-20" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="mx-auto max-w-6xl">

            <div className="mb-10 flex items-center gap-4">
              <div className="h-10 w-1 rounded-full" style={{ background: "#F2A81E" }} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: "#F2A81E" }}>
                  Available Now
                </p>
                <h2 className="mt-1 text-5xl font-bold text-white md:text-6xl">Products</h2>
              </div>
            </div>

            {products.length === 0 && (
              <div className="rounded-3xl border border-dashed py-24 text-center" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                <Coffee className="mx-auto mb-3 h-10 w-10" style={{ color: "rgba(255,255,255,0.3)" }} />
                <p style={{ color: "rgba(255,255,255,0.4)" }}>No products available yet.</p>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const img = imageUrl(p.image_file);
                return (
                  <Link key={p.id} href={`/products/detail?id=${p.id}`} className="group block">
                    <div
                      className="h-full overflow-hidden rounded-3xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}
                    >
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.product_name} className="h-48 w-full object-cover" />
                      ) : (
                        <div className="h-48 w-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white">{p.product_name}</h3>
                        <p className="mt-0.5 text-xs font-medium" style={{ color: "#F2A81E" }}>{p.product_origin}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {p.description}
                        </p>
                        <div className="mt-4 space-y-1.5 text-sm">
                          {[
                            ["Process", p.process],
                            ["Altitude", `${p.altitude} m`],
                            ["Notes", p.flavor_notes],
                          ].map(([label, value]) => (
                            <p key={label}>
                              <span className="font-semibold" style={{ color: "#F9EF6D" }}>{label}:</span>{" "}
                              <span style={{ color: "rgba(255,255,255,0.7)" }}>{value}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div
              className="mt-12 mb-6 rounded-3xl p-12 text-center"
              style={{ background: "rgba(2,55,50,0.75)", border: "1px solid rgba(242,168,30,0.2)", backdropFilter: "blur(20px)" }}
            >
              <h2 className="text-2xl font-bold text-white">Looking for a specific lot?</h2>
              <p className="mx-auto mt-3 max-w-md" style={{ color: "rgba(255,255,255,0.6)" }}>
                We can source custom lots by origin, grade, and process. Get in touch to discuss your requirements.
              </p>
              <Link
                href="/inquiries"
                className="mt-6 inline-block rounded-xl px-8 py-3 text-sm font-semibold shadow-lg transition-colors"
                style={{ background: "#F2A81E", color: "#023732" }}
              >
                Send an Inquiry
              </Link>
            </div>
          </div>
        </div>

        {/* ══ COFFEE KNOWLEDGE ══ */}
        <div className="px-6 py-20 md:px-20" style={{ background: "#023732" }}>
          <div className="mx-auto max-w-6xl">

            <div className="mb-10 flex items-center gap-4">
              <div className="h-8 w-1 rounded-full" style={{ background: "#F2A81E" }} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: "#F2A81E" }}>
                  Coffee Knowledge
                </p>
                <h2 className="mt-1 text-4xl font-bold text-white md:text-5xl">What We Source</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Washed Coffee",
                  label: "Clean & Bright",
                  accent: "#F2A81E",
                  accentBorder: "rgba(242,168,30,0.35)",
                  description: "Clean, bright, and citrus-forward. Washed processing clarifies flavor and makes it easier to taste the influence of soil and varietal in every cup.",
                  items: washedCoffeeItems,
                  checkBg: "rgba(242,168,30,0.2)",
                  checkText: "#F2A81E",
                  detailColor: "rgba(249,239,109,0.7)",
                },
                {
                  title: "Natural (Sundried) Coffee",
                  label: "Fruity & Bold",
                  accent: "#F9EF6D",
                  accentBorder: "rgba(249,239,109,0.35)",
                  description: "Fruity, sweet, and wine-like. Prolonged sun-fueled contact with the cherry imparts intense berry flavors, tropical fruit aromatics, and chocolaty undertones.",
                  items: naturalCoffeeItems,
                  checkBg: "rgba(249,239,109,0.2)",
                  checkText: "#F9EF6D",
                  detailColor: "rgba(242,168,30,0.75)",
                },
              ].map((category) => (
                <div key={category.title} className="flex flex-col">
                  <div
                    className="rounded-t-2xl px-5 py-5"
                    style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${category.accentBorder}`, borderBottom: "none" }}
                  >
                    <span
                      className="mb-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-widest"
                      style={{ background: "rgba(242,168,30,0.12)", color: category.accent, border: `1px solid ${category.accentBorder}` }}
                    >
                      {category.label}
                    </span>
                    <p className="text-xl font-bold md:text-2xl text-white">{category.title}</p>
                    <p className="mt-1.5 text-sm leading-6" style={{ color: "rgba(255,255,255,0.6)" }}>{category.description}</p>
                  </div>
                  <div
                    className="flex-1 rounded-b-2xl px-4 pb-4 pt-3"
                    style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${category.accentBorder}`, borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <ul className="space-y-1.5">
                      {category.items.map((item) => (
                        <li
                          key={item.name}
                          className="rounded-xl px-3 py-2.5"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                              style={{ background: category.checkBg, color: category.checkText }}
                            >
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="text-sm font-semibold text-white">{item.name}</span>
                          </div>
                          <p className="mt-1 pl-7 text-xs leading-5" style={{ color: category.detailColor }}>
                            {item.detail}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
