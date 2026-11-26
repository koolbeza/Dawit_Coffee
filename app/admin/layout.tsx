"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package,
  Award, ImageIcon, LogOut, Menu, X,
  KeyRound,
} from "lucide-react";

const AUTH_KEY = "ddtcec_admin_auth";

const navItems = [
  { href: "/admin",                 label: "Dashboard",       Icon: LayoutDashboard },
  { href: "/admin/products",        label: "Products",        Icon: Package },
  { href: "/admin/certifications",  label: "Certifications",  Icon: Award },
  { href: "/admin/gallery",         label: "Gallery",         Icon: ImageIcon },
  { href: "/admin/change-password", label: "Change Password", Icon: KeyRound },
];

const C = {
  bg:            "#F5EFE6",
  sidebar:       "#EDE4D6",
  sidebarBorder: "#D4C2A8",
  textPrimary:   "#2C1806",
  textSecondary: "#7A5230",
  textMuted:     "#A07850",
  amber:         "#C4863A",
  amberBg:       "#F5E6CC",
  amberBorder:   "#D4A060",
  navActive:     "#F0DFC0",
  navHover:      "#F5E8D0",
};

function Sidebar({
  pathname,
  loggingOut,
  onLogout,
  onNavClick,
}: {
  pathname: string;
  loggingOut: boolean;
  onLogout: () => void;
  onNavClick: () => void;
}) {
  const p = pathname.replace(/\/$/, "");
  return (
    <aside className="flex h-full flex-col" style={{ background: C.sidebar, borderRight: `1px solid ${C.sidebarBorder}` }}>
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <Image
          src="/logoicon%20golden@2x.png"
          alt="DDTCEC"
          width={44}
          height={44}
          className="rounded-xl object-contain"
          style={{ border: `1px solid ${C.amberBorder}` }}
        />
        <div>
          <p className="text-base font-bold tracking-wide" style={{ color: C.textPrimary }}>DDTCEC</p>
          <p className="text-xs font-medium tracking-widest uppercase" style={{ color: C.textMuted }}>Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? p === "/admin" : p.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              className="flex items-center gap-3 rounded-xl py-3 text-base font-medium transition-all"
              style={
                active
                  ? { background: C.navActive, color: C.textPrimary, borderLeft: `3px solid ${C.amber}`, paddingLeft: "9px" }
                  : { color: C.textSecondary, borderLeft: "3px solid transparent", paddingLeft: "9px" }
              }
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = C.navHover; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = ""; }}
            >
              <Icon className="h-5 w-5 shrink-0" style={{ color: active ? C.amber : C.textSecondary }} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3" style={{ borderTop: `1px solid ${C.sidebarBorder}` }}>
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl py-3 text-base font-medium transition-all disabled:opacity-50"
          style={{ color: C.textSecondary, borderLeft: "3px solid transparent", paddingLeft: "9px" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F5E0DC"; (e.currentTarget as HTMLButtonElement).style.color = "#C0392B"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = ""; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [loggingOut,  setLoggingOut]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed,      setAuthed]      = useState<boolean | null>(null);

  const cleanPath   = pathname.replace(/\/$/, "");
  const isLoginPage = cleanPath === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (localStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
      setLoggingOut(false);
    } else {
      router.replace("/admin/login");
    }
  }, [isLoginPage, router]);

  async function handleLogout() {
    setLoggingOut(true);
    const API = process.env.NEXT_PUBLIC_API_URL ?? "";
    try { await fetch(`${API}/api/auth/logout`, { method: "POST" }); } catch {}
    localStorage.removeItem(AUTH_KEY);
    router.replace("/admin/login");
  }

  // Login page renders on its own — no wrapper needed
  if (isLoginPage) return <>{children}</>;

  // Not yet confirmed auth — render nothing
  if (!authed) return null;

  const currentLabel =
    navItems.find(({ href }) =>
      href === "/admin" ? cleanPath === "/admin" : cleanPath.startsWith(href)
    )?.label ?? "Dashboard";

  return (
    <div className="flex h-screen" style={{ background: C.bg }}>
      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 md:flex md:flex-col">
        <Sidebar pathname={pathname} loggingOut={loggingOut} onLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} onTouchStart={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-56 shadow-2xl">
            <Sidebar pathname={pathname} loggingOut={loggingOut} onLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between px-4 py-3 md:hidden" style={{ background: C.sidebar, borderBottom: `1px solid ${C.sidebarBorder}` }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-1.5 transition-colors" style={{ color: C.textSecondary }}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Image src="/logoicon%20golden@2x.png" alt="DDTCEC" width={28} height={28} className="rounded object-contain" />
            <span className="text-base font-semibold" style={{ color: C.textPrimary }}>{currentLabel}</span>
          </div>
          <div className="w-8" />
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-7 py-4" style={{ background: C.sidebar, borderBottom: `1px solid ${C.sidebarBorder}` }}>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.textMuted }}>Admin Console</p>
            <p className="mt-0.5 text-lg font-semibold leading-tight" style={{ color: C.textPrimary }}>{currentLabel}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: C.amberBg, border: `1px solid ${C.amberBorder}` }}>
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: C.amber, boxShadow: `0 0 6px ${C.amber}66` }} />
            <span className="text-xs font-semibold" style={{ color: C.amber }}>Live</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
