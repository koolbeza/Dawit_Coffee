"use client";

import { useEffect, useRef, useState } from "react";
import { imageUrl, type Certification } from "@/lib/api";
import { Pencil, Trash2, Plus, Upload, X, ZoomIn } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";
const EMPTY = { name: "", description: "", image_file: null as string | null };

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
  amberBg:       "#F5E6CC",
  amberBorder:   "#D4A060",
  amberLight:    "#D9A058",
  danger:        "#C0392B",
  dangerBg:      "#FDEAE8",
  dangerBorder:  "#E8B4B0",
};

const inputBase: React.CSSProperties = {
  background: C.input, border: `1px solid ${C.inputBorder}`, color: C.textPrimary,
  borderRadius: "0.625rem", padding: "0.55rem 0.75rem", fontSize: "0.875rem",
  outline: "none", width: "100%", transition: "border-color 0.15s",
};

const labelBase: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", fontWeight: 600,
  color: C.textSecondary, letterSpacing: "0.05em",
  textTransform: "uppercase", marginBottom: "0.35rem",
};

async function parseError(res: Response): Promise<string> {
  try { const d = await res.json(); if (typeof d === "object") return Object.values(d).flat().join(" "); } catch { /**/ }
  return `Error ${res.status}`;
}

export default function AdminCertificationsPage() {
  const [certs,       setCerts]       = useState<Certification[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState<"add" | "edit" | null>(null);
  const [selected,    setSelected]    = useState<Certification | null>(null);
  const [form,        setForm]        = useState(EMPTY);
  const [imageFile,   setImageFile]   = useState<File | null>(null);
  const [saving,          setSaving]          = useState(false);
  const [uploadProgress,  setUploadProgress]  = useState(0);
  const [error,       setError]       = useState("");
  const [deleteId,    setDeleteId]    = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [viewerSrc,   setViewerSrc]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { const r = await fetch(`${API}/api/certifications`); if (r.ok) setCerts(await r.json()); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === "Escape") setViewerSrc(null); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function openAdd() { setForm(EMPTY); setImageFile(null); setSelected(null); setError(""); setModal("add"); }
  function openEdit(c: Certification) { setForm({ name: c.name, description: c.description, image_file: c.image_file }); setImageFile(null); setSelected(c); setError(""); setModal("edit"); }
  function closeModal() { setModal(null); setSelected(null); setError(""); }

  async function save() {
    if (!form.name.trim()) { setError("Certification name is required."); return; }
    setSaving(true); setError(""); setUploadProgress(0);
    try {
      const body = new FormData();
      body.append("name", form.name); body.append("description", form.description);
      if (imageFile) body.append("image_file", imageFile);
      const url = modal === "edit" ? `${API}/api/certifications/update/${selected!.id}` : `${API}/api/certifications/create`;
      const method = modal === "edit" ? "PUT" : "POST";
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setUploadProgress(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => { xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Error ${xhr.status}`)); };
        xhr.onerror = () => reject(new Error("Network error — is the backend running?"));
        xhr.send(body);
      });
      closeModal(); await load();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setSaving(false); setUploadProgress(0); }
  }

  async function confirmDelete(id: number) {
    setDeleteError("");
    try {
      const res = await fetch(`${API}/api/certifications/delete/${id}`, { method: "DELETE" });
      if (!res.ok) { setDeleteError(await parseError(res)); return; }
      setDeleteId(null); await load();
    } catch { setDeleteError("Network error."); }
  }

  const certCount = certs.length;
  const certLabel = certCount !== 1 ? "certifications" : "certification";

  return (
    <div className="max-w-4xl">

      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: C.textMuted }}>Data Collection</p>
          <h1 className="mt-0.5 text-2xl font-bold" style={{ color: C.textPrimary }}>Certifications</h1>
          <p className="mt-0.5 text-sm" style={{ color: C.textSecondary }}>
            {loading ? "Loading…" : `${certCount} ${certLabel}`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: C.amber, color: "#1C0C04" }}
        >
          <Plus className="h-4 w-4" /> Add certification
        </button>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="py-16 text-center text-sm" style={{ color: C.textMuted }}>Loading…</div>
      ) : certs.length === 0 ? (
        <div className="rounded-2xl py-16 text-center text-sm"
          style={{ border: `1px dashed ${C.cardBorder}`, color: C.textMuted }}
        >
          No certifications yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => {
            const img = imageUrl(c.image_file);
            return (
              <div key={c.id} className="rounded-2xl overflow-hidden shadow-sm"
                style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
              >
                {img ? (
                  <button type="button" onClick={() => setViewerSrc(img)}
                    className="relative group w-full focus:outline-none" style={{ display: "block", background: C.raised }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={c.name} className="w-full object-contain" style={{ height: "160px", padding: "1rem" }} />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-7 w-7 text-white drop-shadow" />
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center text-4xl" style={{ background: C.raised, height: "100px" }}>🏅</div>
                )}
                <div className="p-4">
                  <p className="font-semibold text-base truncate" style={{ color: C.textPrimary }}>{c.name}</p>
                  <p className="mt-1 text-sm line-clamp-2" style={{ color: C.textSecondary }}>{c.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => openEdit(c)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-all"
                      style={{ color: C.textSecondary, background: "transparent", border: `1px solid ${C.cardBorder}` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.raised; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button onClick={() => { setDeleteError(""); setDeleteId(c.id); }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-all"
                      style={{ color: C.textSecondary, background: "transparent", border: `1px solid ${C.cardBorder}` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.dangerBg; (e.currentTarget as HTMLButtonElement).style.color = C.danger; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.raisedBorder}` }}>
              <h2 className="text-base font-bold" style={{ color: C.textPrimary }}>
                {modal === "add" ? "Add certification" : "Edit certification"}
              </h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-1.5 transition-colors"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
              ><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label style={labelBase}>Name <span style={{ color: C.danger }}>*</span></label>
                <input type="text" value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); if (error) setError(""); }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = !form.name.trim() && error ? C.danger : C.inputBorder)}
                  style={{ ...inputBase, borderColor: !form.name.trim() && error ? C.danger : C.inputBorder }}
                />
                {!form.name.trim() && error === "Certification name is required." && (
                  <p className="mt-1 text-xs" style={{ color: C.danger }}>This field is required.</p>
                )}
              </div>
              <div>
                <label style={labelBase}>Description</label>
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={{ ...inputBase, resize: "vertical" }}
                />
              </div>
              <div>
                <label style={labelBase}>Badge image</label>
                <div className="flex items-start gap-3 mt-1">
                  {(imageFile || (modal === "edit" && form.image_file)) && (
                    <button type="button"
                      onClick={() => { const src = imageFile ? URL.createObjectURL(imageFile) : imageUrl(form.image_file); if (src) setViewerSrc(src); }}
                      className="relative group rounded-xl overflow-hidden focus:outline-none flex-shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageFile ? URL.createObjectURL(imageFile) : imageUrl(form.image_file) ?? ""} alt="Preview"
                        className="h-20 w-20 object-contain rounded-xl"
                        style={{ border: `1px solid ${C.cardBorder}`, background: C.raised, padding: "4px" }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <ZoomIn className="h-5 w-5 text-white" />
                      </span>
                    </button>
                  )}
                  <div>
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all"
                      style={{ background: C.raised, border: `1px solid ${C.raisedBorder}`, color: C.textSecondary }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.inputFocus; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.raisedBorder; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                    >
                      <Upload className="h-4 w-4 flex-shrink-0" style={{ color: C.amber }} />
                      {imageFile ? imageFile.name : "Choose image…"}
                    </button>
                    {modal === "edit" && form.image_file && !imageFile && (
                      <p className="mt-1 text-xs" style={{ color: C.textMuted }}>Current image kept unless you pick a new file.</p>
                    )}
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
            <div className="px-6 py-4" style={{ borderTop: `1px solid ${C.raisedBorder}` }}>
              {error && (
                <div className="mb-3 rounded-xl px-3.5 py-2.5 text-sm"
                  style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}
                >{error}</div>
              )}
              {saving && uploadProgress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: C.textMuted }}>
                    <span>Uploading…</span><span>{uploadProgress}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ background: C.raised, height: "6px" }}>
                    <div className="h-full rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%`, background: C.amber }} />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button onClick={closeModal} disabled={saving} className="rounded-xl px-5 py-2 text-sm font-medium transition-all disabled:opacity-40"
                  style={{ color: C.textSecondary, background: "transparent" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.raised; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                >Cancel</button>
                <button onClick={save} disabled={saving}
                  className="rounded-xl px-6 py-2 text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: C.amber, color: "#1C0C04" }}
                  onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLButtonElement).style.background = C.amberLight; }}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.amber}
                >{saving ? (uploadProgress > 0 ? `${uploadProgress}%` : "Uploading…") : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl"
            style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}` }}
            >
              <Trash2 className="h-5 w-5" style={{ color: C.danger }} />
            </div>
            <p className="font-bold text-base" style={{ color: C.textPrimary }}>Delete this certification?</p>
            <p className="mt-1.5 text-sm" style={{ color: C.textSecondary }}>This action cannot be undone.</p>
            {deleteError && (
              <div className="mt-3 rounded-xl px-3 py-2 text-sm"
                style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}
              >{deleteError}</div>
            )}
            <div className="mt-5 flex justify-center gap-3">
              <button onClick={() => { setDeleteId(null); setDeleteError(""); }}
                className="rounded-xl px-5 py-2 text-sm font-medium transition-all"
                style={{ color: C.textSecondary, background: "transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.raised; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
              >Cancel</button>
              <button onClick={() => confirmDelete(deleteId)}
                className="rounded-xl px-6 py-2 text-sm font-semibold transition-all"
                style={{ background: "#8C2020", color: "#FFC0C0" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A02828")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#8C2020")}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image lightbox ── */}
      {viewerSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setViewerSrc(null)}
        >
          <button type="button" onClick={() => setViewerSrc(null)}
            className="absolute top-5 right-5 rounded-full p-2"
            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer" }}
          ><X className="h-6 w-6" /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={viewerSrc} alt="Certification image" onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "88vh", maxWidth: "88vw", objectFit: "contain", borderRadius: "1rem", boxShadow: "0 25px 80px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.08)", background: "white", padding: "1rem" }}
          />
        </div>
      )}
    </div>
  );
}
