"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Award, ImageIcon, ArrowRight, Plus,
  RefreshCw, ChevronRight, Coffee, MapPin,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { imageUrl } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

type Product = {
  id: number;
  product_name: string;
  product_origin: string;
  process: string;
  flavor_notes: string;
  image_file: string | null;
  created_at: string;
};

type Profile = {
  company_name: string;
  tagline: string;
  owner_name: string;
  city: string;
  country: string;
  logo: string | null;
};

type Health = "loading" | "ok" | "error";

const C = {
  card:          "#EEE4D4",
  cardBorder:    "#D9C9B0",
  raised:        "#E8DDD0",
  raisedBorder:  "#CFC0A8",
  textPrimary:   "#2C1806",
  textSecondary: "#7A5230",
  textMuted:     "#A07850",
  amber:         "#C4863A",
  amberBg:       "#F5E6CC",
  amberBorder:   "#D4A060",
};

const PIE_COLORS = ["#C4863A", "#D9A058", "#A06830", "#E8C080", "#8B5225", "#D4904A", "#B87832", "#F0D090"];

const statConfig = [
  {
    key: "products",       label: "Products",       Icon: Coffee,
    href: "/admin/products",       sub: "Coffee varieties",
    color: "#C4863A", bg: "#F5E6CC", border: "#D4A060", iconBg: "#F0DFC0", iconColor: "#C4863A",
  },
  {
    key: "certifications", label: "Certifications", Icon: Award,
    href: "/admin/certifications", sub: "Quality standards",
    color: "#A06830", bg: "#F0E4CC", border: "#C8A870", iconBg: "#ECD8B0", iconColor: "#A06830",
  },
  {
    key: "gallery",        label: "Gallery",        Icon: ImageIcon,
    href: "/admin/gallery",        sub: "Visual assets",
    color: "#8B5225", bg: "#EDE0CC", border: "#C4A060", iconBg: "#E4D0B0", iconColor: "#8B5225",
  },
];

function PieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#F5E6CC", border: `1px solid ${C.amberBorder}`, borderRadius: "0.5rem", padding: "0.5rem 0.75rem" }}>
      <p style={{ color: C.textPrimary, fontSize: "0.75rem", fontWeight: 600 }}>{payload[0].name}</p>
      <p style={{ color: C.amber, fontSize: "0.75rem" }}>{payload[0].value} product{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#F5E6CC", border: `1px solid ${C.amberBorder}`, borderRadius: "0.5rem", padding: "0.5rem 0.75rem" }}>
      <p style={{ color: C.textSecondary, fontSize: "0.7rem" }}>{label}</p>
      <p style={{ color: C.amber, fontSize: "0.75rem", fontWeight: 600 }}>{payload[0].value} product{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [counts,     setCounts]     = useState<Record<string, number | null>>({ products: null, certifications: null, gallery: null });
  const [profile,    setProfile]    = useState<Profile | null>(null);
  const [health,     setHealth]     = useState<Health>("loading");
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try { const r = await fetch(`${API}/`); setHealth(r.ok ? "ok" : "error"); } catch { setHealth("error"); }
    try {
      const r = await fetch(`${API}/api/products`);
      if (r.ok) { const d: Product[] = await r.json(); setCounts((p) => ({ ...p, products: d.length })); setProducts(d); }
    } catch {}
    try {
      const r = await fetch(`${API}/api/certifications`);
      if (r.ok) { const d = await r.json(); setCounts((p) => ({ ...p, certifications: d.length })); }
    } catch {}
    try {
      const r = await fetch(`${API}/api/gallery`);
      if (r.ok) { const d = await r.json(); setCounts((p) => ({ ...p, gallery: d.length })); }
    } catch {}
    try { const r = await fetch(`${API}/api/profile`); if (r.ok) setProfile(await r.json()); } catch {}
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const processData = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => {
      if (p.process) {
        const key = p.process.split("(")[0].trim();
        acc[key] = (acc[key] ?? 0) + 1;
      }
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const originData = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => {
      if (p.product_origin) {
        p.product_origin.split(",").forEach((o) => { const s = o.trim(); if (s) acc[s] = (acc[s] ?? 0) + 1; });
      }
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const healthDot   = health === "ok" ? "#4ade80" : health === "error" ? "#f87171" : "#fbbf24";
  const healthLabel = health === "ok" ? "Operational" : health === "error" ? "Unreachable" : "Checking…";
  const recentProducts = products.slice(0, 4);

  return (
    <div className="max-w-5xl space-y-7">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.textMuted }}>Overview</p>
          <h1 className="mt-0.5 text-3xl font-bold" style={{ color: C.textPrimary }}>
            {profile?.company_name ?? "Dashboard"}
          </h1>
          {profile?.tagline && (
            <p className="mt-0.5 text-base" style={{ color: C.textSecondary }}>{profile.tagline}</p>
          )}
        </div>
        <button
          onClick={load}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:opacity-80 flex-shrink-0"
          style={{ background: C.raised, border: `1px solid ${C.raisedBorder}`, color: C.textSecondary }}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statConfig.map((s) => {
          const count = counts[s.key];
          return (
            <Link
              key={s.key}
              href={s.href}
              className="group relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="rounded-xl p-2.5" style={{ background: s.iconBg }}>
                  <s.Icon className="h-5 w-5" style={{ color: s.iconColor }} />
                </div>
                <ArrowRight className="h-4 w-4 translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-60" style={{ color: s.color }} />
              </div>
              <span className="text-4xl font-bold tabular-nums" style={{ color: s.color }}>
                {count !== null ? count : "..."}
              </span>
              <p className="mt-1 text-sm font-semibold" style={{ color: C.textPrimary }}>{s.label}</p>
              <p className="mt-0.5 text-xs" style={{ color: C.textMuted }}>{s.sub}</p>
              <div className="absolute bottom-0 left-0 h-0.5 w-full opacity-20" style={{ background: s.color }} />
            </Link>
          );
        })}
      </div>

      {/* ── Charts ── */}
      {products.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">

          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
            <h2 className="text-base font-semibold mb-1" style={{ color: C.textPrimary }}>Process Distribution</h2>
            <p className="text-sm mb-4" style={{ color: C.textMuted }}>Share of processing methods</p>
            {processData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={processData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {processData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  {processData.slice(0, 4).map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-xs truncate" style={{ color: C.textSecondary }}>{d.name}</span>
                      </div>
                      <span className="text-xs font-semibold tabular-nums ml-3 flex-shrink-0" style={{ color: C.textPrimary }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[180px]">
                <p className="text-sm" style={{ color: C.textMuted }}>No data yet</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
            <h2 className="text-base font-semibold mb-1" style={{ color: C.textPrimary }}>Origins</h2>
            <p className="text-sm mb-4" style={{ color: C.textMuted }}>Products per growing region</p>
            {originData.length > 0 ? (
              <ResponsiveContainer width="100%" height={originData.length * 36 + 20} minHeight={160}>
                <BarChart data={originData} layout="vertical" margin={{ left: 0, right: 24, top: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke={C.raisedBorder} strokeDasharray="4 4" />
                  <XAxis type="number" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={{ stroke: C.raisedBorder }} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fill: C.textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: string) => v.length > 13 ? v.slice(0, 13) + "…" : v} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: C.raised }} />
                  <Bar dataKey="value" fill={C.amber} radius={[0, 4, 4, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[160px]">
                <p className="text-sm" style={{ color: C.textMuted }}>No data yet</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── Body ── */}
      <div className="grid gap-5 lg:grid-cols-5">

        {/* Recent Products */}
        <div className="lg:col-span-3 rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ color: C.textPrimary }}>Recent Products</h2>
            <Link href="/admin/products" className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-60" style={{ color: C.amber }}>
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="rounded-2xl p-4" style={{ background: C.raised, border: `1px solid ${C.raisedBorder}` }}>
                <Coffee className="h-7 w-7" style={{ color: C.textMuted }} />
              </div>
              <p className="text-sm" style={{ color: C.textMuted }}>No products yet</p>
              <Link href="/admin/products"
                className="text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
                style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
              >
                + Add your first product
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: C.raised, border: `1px solid ${C.raisedBorder}` }}
                >
                  <div className="h-11 w-11 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: C.cardBorder }}>
                    {p.image_file
                      ? <img src={imageUrl(p.image_file)!} alt={p.product_name} className="h-full w-full object-cover" />
                      : <div className="h-full w-full flex items-center justify-center"><Coffee className="h-4 w-4" style={{ color: C.textMuted }} /></div>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: C.textPrimary }}>{p.product_name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-2.5 w-2.5 flex-shrink-0" style={{ color: C.textMuted }} />
                      <p className="text-xs truncate" style={{ color: C.textSecondary }}>
                        {p.product_origin || "N/A"}{p.process && `, ${p.process.split("(")[0].trim()}`}
                      </p>
                    </div>
                  </div>
                  {p.flavor_notes && (
                    <span className="hidden sm:block text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-medium"
                      style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
                    >
                      {p.flavor_notes.split(",")[0].trim()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Quick Add */}
          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: C.textPrimary }}>Quick Add</h2>
            <div className="space-y-2">
              {[
                { href: "/admin/products",       Icon: Coffee,    label: "New Product" },
                { href: "/admin/certifications", Icon: Award,     label: "New Certification" },
                { href: "/admin/gallery",        Icon: ImageIcon, label: "New Gallery Image" },
              ].map(({ href, Icon, label }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-base font-medium transition-all group"
                  style={{ background: C.raised, border: `1px solid ${C.raisedBorder}`, color: C.textSecondary }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background  = C.amberBg;
                    (e.currentTarget as HTMLElement).style.color       = C.textPrimary;
                    (e.currentTarget as HTMLElement).style.borderColor = C.amberBorder;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background  = C.raised;
                    (e.currentTarget as HTMLElement).style.color       = C.textSecondary;
                    (e.currentTarget as HTMLElement).style.borderColor = C.raisedBorder;
                  }}
                >
                  <Plus className="h-3.5 w-3.5 flex-shrink-0" style={{ color: C.amber }} />
                  {label}
                  <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:translate-x-0 group-hover:opacity-100" style={{ color: C.amber }} />
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
            <h2 className="text-base font-semibold mb-1" style={{ color: C.textPrimary }}>System Status</h2>
            <p className="text-sm mb-4" style={{ color: C.textMuted }}>Live service health</p>
            <div>
              {[
                { label: "API Server",  dot: healthDot, value: healthLabel },
                { label: "Database",    dot: health === "ok" ? "#4ade80" : "#fbbf24", value: health === "ok" ? "Connected" : "N/A" },
                { label: "Public Site", dot: "#4ade80", value: "Live" },
              ].map(({ label, dot, value }, i, arr) => (
                <div key={label} className="flex items-center justify-between py-2.5"
                  style={i < arr.length - 1 ? { borderBottom: `1px solid ${C.raisedBorder}` } : {}}
                >
                  <span className="text-xs font-medium" style={{ color: C.textSecondary }}>{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: C.textSecondary }}>{value}</span>
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: dot, boxShadow: `0 0 5px ${dot}88` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company */}
          {profile && (profile.owner_name || profile.city) && (
            <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
              <h2 className="text-base font-semibold mb-1" style={{ color: C.textPrimary }}>Company</h2>
              <p className="text-sm mb-3" style={{ color: C.textMuted }}>Profile information</p>
              {[
                profile.owner_name                ? { label: "Owner",    value: profile.owner_name } : null,
                (profile.city || profile.country) ? { label: "Location", value: [profile.city, profile.country].filter(Boolean).join(", ") } : null,
              ].filter(Boolean).map((row, i, arr) => (
                <div key={row!.label} className="flex items-center justify-between py-2"
                  style={i < arr.length - 1 ? { borderBottom: `1px solid ${C.raisedBorder}` } : {}}
                >
                  <span className="text-xs" style={{ color: C.textMuted }}>{row!.label}</span>
                  <span className="text-xs font-semibold truncate ml-4 max-w-[120px]" style={{ color: C.textSecondary }}>{row!.value}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
