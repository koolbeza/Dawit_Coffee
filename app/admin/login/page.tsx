"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

const AUTH_KEY = "ddtcec_admin_auth";

const C = {
  bg:           "#F5EFE6",
  card:         "#FDFAF5",
  cardBorder:   "#D9C9B0",
  input:        "#FFFFFF",
  inputBorder:  "#D4C2A8",
  inputFocus:   "#C4863A",
  textPrimary:  "#2C1806",
  textSecondary:"#7A5230",
  textMuted:    "#A07850",
  amber:        "#C4863A",
  amberHover:   "#B5731F",
  danger:       "#C0392B",
  dangerBg:     "#FFF5F3",
  dangerBorder: "#F5C0B8",
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const API = process.env.NEXT_PUBLIC_API_URL ?? "";
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      setLoading(false);
      if (res.ok) {
        localStorage.setItem(AUTH_KEY, "1");
        router.replace(params.get("from") ?? "/admin");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.detail ?? data.error ?? "Invalid email or password.");
      }
    } catch {
      setLoading(false);
      setError("Cannot reach the server. Check your connection.");
    }
  }

  const inputStyle: React.CSSProperties = {
    background: C.input,
    border: `1px solid ${C.inputBorder}`,
    color: C.textPrimary,
    borderRadius: "0.625rem",
    padding: "0.6rem 0.75rem 0.6rem 2.5rem",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm font-semibold tracking-wider uppercase mb-1.5"
          style={{ color: C.textSecondary }}
        >
          Email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: C.textMuted }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            autoFocus
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
            onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-semibold tracking-wider uppercase mb-1.5"
          style={{ color: C.textSecondary }}
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: C.textMuted }}
          />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ ...inputStyle, paddingRight: "2.5rem" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
            onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: C.textMuted, background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.textSecondary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl px-3.5 py-2.5 text-sm"
          style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3 text-base font-bold transition-all disabled:opacity-50 shadow-sm mt-2"
        style={{ background: C.amber, color: "#FDFAF5" }}
        onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = C.amberHover; }}
        onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.amber}
      >
        {loading ? "Verifying…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: C.bg }}
    >
      <div className="w-full max-w-sm">
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
        >
          <div className="mb-7 text-center">
            <Image
              src="/Horizontal%20golden@2x.png"
              alt="DDTCEC"
              width={200}
              height={60}
              className="mx-auto object-contain"
            />
            <h1 className="mt-4 text-2xl font-bold" style={{ color: C.textPrimary }}>
              DDTCEC Admin
            </h1>
            <p className="mt-1 text-sm" style={{ color: C.textMuted }}>
              Restricted area. Authorised access only.
            </p>
          </div>

          <Suspense
            fallback={
              <div
                className="h-32 animate-pulse rounded-xl"
                style={{ background: C.inputBorder }}
              />
            }
          >
            <LoginForm />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
