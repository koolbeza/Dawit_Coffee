"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

const C = {
  card:          "#EEE4D4",
  cardBorder:    "#D9C9B0",
  raised:        "#E8DDD0",
  raisedBorder:  "#CFC0A8",
  input:         "#F0E8DA",
  inputBorder:   "#D4C2A8",
  inputFocus:    "#C4863A",
  textPrimary:   "#2C1806",
  textSecondary: "#7A5230",
  textMuted:     "#A07850",
  amber:         "#C4863A",
  amberLight:    "#D9A058",
  success:       "#2E7D52",
  successBg:     "#E8F4EE",
  successBorder: "#B8DFC8",
  danger:        "#C0392B",
  dangerBg:      "#FDEAE8",
  dangerBorder:  "#E8B4B0",
};

const inputBase: React.CSSProperties = {
  background: C.input, border: `1px solid ${C.inputBorder}`, color: C.textPrimary,
  borderRadius: "0.625rem", padding: "0.55rem 2.5rem 0.55rem 0.75rem",
  fontSize: "0.875rem", outline: "none", width: "100%", transition: "border-color 0.15s",
};

const labelBase: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", fontWeight: 600,
  color: C.textSecondary, letterSpacing: "0.05em",
  textTransform: "uppercase", marginBottom: "0.35rem",
};

function PasswordField({ id, label, value, show, onToggle, onChange }: {
  id: string; label: string; value: string; show: boolean;
  onToggle: () => void; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} style={labelBase}>{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          style={inputBase}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
          onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: C.textMuted, background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.textSecondary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const [form,   setForm]   = useState({ old_password: "", new_password: "", confirm: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error,  setError]  = useState("");
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.new_password !== form.confirm) { setError("New passwords do not match."); return; }
    if (form.new_password.length < 6)       { setError("New password must be at least 6 characters."); return; }
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password: form.old_password, new_password: form.new_password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
      setForm({ old_password: "", new_password: "", confirm: "" });
    } catch {
      setError("Network error — is the backend running?"); setStatus("error");
    }
  }

  return (
    <div className="max-w-md">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: C.raised, border: `1px solid ${C.raisedBorder}` }}
        >
          <KeyRound className="h-5 w-5" style={{ color: C.amber }} />
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: C.textMuted }}>Admin Console</p>
          <h1 className="text-2xl font-bold" style={{ color: C.textPrimary }}>Change Password</h1>
          <p className="text-sm" style={{ color: C.textSecondary }}>Update your admin login password</p>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
        {status === "success" && (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: C.successBg, border: `1px solid ${C.successBorder}`, color: C.success }}
          >
            Password changed successfully.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl px-4 py-3 text-sm"
            style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField id="old_password" label="Current Password"     value={form.old_password} show={showOld}     onToggle={() => setShowOld((p) => !p)}     onChange={handleChange} />
          <PasswordField id="new_password" label="New Password"         value={form.new_password} show={showNew}     onToggle={() => setShowNew((p) => !p)}     onChange={handleChange} />
          <PasswordField id="confirm"      label="Confirm New Password" value={form.confirm}      show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} onChange={handleChange} />
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl py-2.5 text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
              style={{ background: C.amber, color: "#1C0C04" }}
              onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLButtonElement).style.background = C.amberLight; }}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.amber}
            >
              {status === "loading" ? "Saving…" : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
