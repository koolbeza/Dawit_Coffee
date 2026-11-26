"use client";

import { useEffect, useRef, useState } from "react";
import { imageUrl, type Product, type Origin } from "@/lib/api";
import { Pencil, Trash2, Plus, Upload, X, ChevronDown, ZoomIn } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

const C = {
  bg:             "#F5EFE6",
  card:           "#EEE4D4",
  cardBorder:     "#D9C9B0",
  raised:         "#E8DDD0",
  raisedBorder:   "#CFC0A8",
  input:          "#F0E8DA",
  inputBorder:    "#D4C2A8",
  inputFocus:     "#C4863A",
  textPrimary:    "#2C1806",
  textSecondary:  "#7A5230",
  textMuted:      "#A07850",
  textPlaceholder:"#B09070",
  amber:          "#C4863A",
  amberBg:        "#F5E6CC",
  amberBorder:    "#D4A060",
  amberLight:     "#D9A058",
  danger:         "#C0392B",
  dangerBg:       "#FDEAE8",
  dangerBorder:   "#E8B4B0",
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

const ALTITUDE_OPTIONS = [
  "1,200 - 1,500 masl", "1,500 - 1,800 masl", "1,800 - 2,000 masl",
  "2,000 - 2,200 masl", "2,200 - 2,400 masl", "2,400 - 2,600 masl",
  "2,600 masl and above",
];

const PROCESS_OPTIONS = [
  "Natural (Dry Process)", "Washed (Wet Process)", "Honey Process",
  "Anaerobic Natural", "Anaerobic Washed", "Double Fermentation",
  "Semi-Washed", "Carbonic Maceration",
];

const FLAVOR_OPTIONS = [
  "Blueberry", "Jasmine", "Bergamot", "Lemon", "Citrus", "Peach",
  "Apricot", "Floral", "Dark Chocolate", "Red Berry", "Strawberry",
  "Rose", "Honey", "Wine / Winey", "Tropical Fruit", "Stone Fruit",
  "Black Tea", "Earl Grey", "Lavender", "Caramel", "Vanilla", "Spice",
];

const OTHER = "__other__";

const EMPTY: Omit<Product, "id" | "created_at"> = {
  product_name: "", product_origin: "", altitude: "",
  process: "", flavor_notes: "", description: "", image_file: null,
};

async function parseError(res: Response): Promise<string> {
  try { const d = await res.json(); if (typeof d === "object") return Object.values(d).flat().join(" "); } catch { /**/ }
  return `Error ${res.status}`;
}

function SelectOrOther({ options, value, onChange, placeholder }: {
  options: string[]; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const isOther   = value !== "" && !options.includes(value);
  const selectVal = isOther ? OTHER : value;

  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          value={selectVal}
          onChange={(e) => { if (e.target.value === OTHER) onChange(""); else onChange(e.target.value); }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
          onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
          style={{ ...inputBase, appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: "2rem" }}
        >
          <option value="" style={{ background: C.card }}>{placeholder ?? "Select…"}</option>
          {options.map((o) => <option key={o} value={o} style={{ background: C.card }}>{o}</option>)}
          <option value={OTHER} style={{ background: C.card, fontStyle: "italic" }}>Other…</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: C.textMuted }} />
      </div>
      {(selectVal === OTHER || isOther) && (
        <input
          type="text"
          value={isOther ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter custom value…"
          autoFocus
          onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
          onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
          style={inputBase}
        />
      )}
    </div>
  );
}

function FlavorMultiSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const selected = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const [open,        setOpen]        = useState(false);
  const [customInput, setCustomInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (name: string) => {
    const next = selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name];
    onChange(next.join(", "));
  };

  const addCustom = () => {
    const tr = customInput.trim();
    if (!tr || selected.includes(tr)) { setCustomInput(""); return; }
    onChange([...selected, tr].join(", "));
    setCustomInput("");
  };

  return (
    <div ref={ref}>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((name) => (
            <span key={name} className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
            >
              {name}
              <button type="button" onClick={() => toggle(name)}
                style={{ color: C.amber, background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: 0 }}
              ><X className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setOpen((v) => !v)}
        style={{ ...inputBase, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
      >
        <span style={{ color: selected.length ? C.textPrimary : C.textPlaceholder }}>
          {selected.length === 0 ? "Select flavor notes…" : `${selected.length} selected`}
        </span>
        <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: C.textMuted, transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
      </button>
      {open && (
        <div className="mt-1 rounded-xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.cardBorder}`, maxHeight: "180px", overflowY: "auto" }}>
          {FLAVOR_OPTIONS.map((o) => (
            <label key={o} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors"
              style={{ borderBottom: `1px solid ${C.raisedBorder}` }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.raised)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <input type="checkbox" checked={selected.includes(o)} onChange={() => toggle(o)} style={{ accentColor: C.amber }} />
              <span style={{ color: C.textPrimary, fontSize: "0.875rem" }}>{o}</span>
            </label>
          ))}
          <div className="flex gap-2 p-2.5">
            <input type="text" placeholder="Add custom…" value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
              style={{ ...inputBase, fontSize: "0.8rem", padding: "0.35rem 0.6rem" }}
            />
            <button type="button" onClick={addCustom} disabled={!customInput.trim()}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40 flex-shrink-0"
              style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
            >Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  const [products,        setProducts]        = useState<Product[]>([]);
  const [origins,         setOrigins]         = useState<Origin[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [modal,           setModal]           = useState<"add" | "edit" | null>(null);
  const [selected,        setSelected]        = useState<Product | null>(null);
  const [form,            setForm]            = useState<typeof EMPTY>(EMPTY);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [originsOpen,     setOriginsOpen]     = useState(false);
  const [imageFile,       setImageFile]       = useState<File | null>(null);
  const [saving,          setSaving]          = useState(false);
  const [uploadProgress,  setUploadProgress]  = useState(0);
  const [error,           setError]           = useState("");
  const [deleteId,        setDeleteId]        = useState<number | null>(null);
  const [deleteError,     setDeleteError]     = useState("");
  const [viewerSrc,       setViewerSrc]       = useState<string | null>(null);
  const [newOriginInput,  setNewOriginInput]  = useState("");
  const [addingOrigin,    setAddingOrigin]    = useState(false);
  const fileRef            = useRef<HTMLInputElement>(null);
  const originsDropdownRef = useRef<HTMLDivElement>(null);

  async function loadOrigins() {
    try { const r = await fetch(`${API}/api/origins`); if (r.ok) setOrigins(await r.json()); } catch { /**/ }
  }
  async function load() {
    setLoading(true);
    try { const r = await fetch(`${API}/api/products`); if (r.ok) setProducts(await r.json()); } finally { setLoading(false); }
  }

  useEffect(() => { load(); loadOrigins(); }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (originsDropdownRef.current && !originsDropdownRef.current.contains(e.target as Node)) setOriginsOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === "Escape") setViewerSrc(null); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function openAdd() {
    setForm(EMPTY); setImageFile(null); setSelected(null);
    setSelectedOrigins([]); setError(""); setOriginsOpen(false); setModal("add");
  }
  function openEdit(p: Product) {
    setForm({ product_name: p.product_name, product_origin: p.product_origin, altitude: p.altitude, process: p.process, flavor_notes: p.flavor_notes, description: p.description, image_file: p.image_file });
    setImageFile(null); setSelected(p); setError(""); setOriginsOpen(false);
    setSelectedOrigins(p.product_origin ? p.product_origin.split(",").map((s) => s.trim()).filter(Boolean) : []);
    setModal("edit");
  }
  function closeModal() { setModal(null); setSelected(null); setError(""); setOriginsOpen(false); }
  function toggleOrigin(name: string) {
    setSelectedOrigins((prev) => prev.includes(name) ? prev.filter((o) => o !== name) : [...prev, name]);
  }

  async function addNewOrigin() {
    const tr = newOriginInput.trim();
    if (!tr) return;
    setAddingOrigin(true);
    try {
      const res = await fetch(`${API}/api/origins/create`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: tr }) });
      if (res.ok) { await loadOrigins(); setSelectedOrigins((p) => [...p, tr]); setNewOriginInput(""); }
    } catch { /**/ } finally { setAddingOrigin(false); }
  }

  async function deleteOrigin(id: number) {
    try { await fetch(`${API}/api/origins/delete/${id}`, { method: "DELETE" }); setOrigins((p) => p.filter((o) => o.id !== id)); } catch { /**/ }
  }

  async function save() {
    if (!form.product_name.trim()) { setError("Product name is required."); return; }
    setSaving(true); setError(""); setUploadProgress(0);
    try {
      const body = new FormData();
      (["product_name", "altitude", "process", "flavor_notes", "description"] as const).forEach((k) => body.append(k, form[k] ?? ""));
      body.append("product_origin", selectedOrigins.join(", "));
      if (imageFile) body.append("image_file", imageFile);
      const url = modal === "edit" ? `${API}/api/products/update/${selected!.id}` : `${API}/api/products/create`;
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
      const res = await fetch(`${API}/api/products/delete/${id}`, { method: "DELETE" });
      if (!res.ok) { setDeleteError(await parseError(res)); return; }
      setDeleteId(null); await load();
    } catch { setDeleteError("Network error."); }
  }

  const listingCount = products.length;
  const listingLabel = listingCount !== 1 ? "listings" : "listing";

  return (
    <div className="max-w-5xl">

      {/* ── Page header ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: C.textMuted }}>Data Collection</p>
          <h1 className="mt-0.5 text-2xl font-bold" style={{ color: C.textPrimary }}>Products</h1>
          <p className="mt-0.5 text-sm" style={{ color: C.textSecondary }}>
            {loading ? "Loading…" : `${listingCount} ${listingLabel}`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: C.amber, color: "#1C0C04" }}
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}>
        {loading ? (
          <div className="py-16 text-center text-sm" style={{ color: C.textMuted }}>Loading…</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm" style={{ color: C.textMuted }}>No products yet.</p>
            <button onClick={openAdd}
              className="text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
            >+ Add your first product</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ borderBottom: `1px solid ${C.raisedBorder}` }}>
              <tr className="text-left">
                {["Image", "Name", "Origin", "Process", ""].map((h, i) => (
                  <th key={i}
                    className={`px-4 py-3 text-xs font-semibold tracking-wider uppercase ${i === 2 ? "hidden md:table-cell" : ""} ${i === 3 ? "hidden lg:table-cell" : ""} ${i === 4 ? "text-right" : ""}`}
                    style={{ color: C.textMuted }}
                  >{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = imageUrl(p.image_file);
                return (
                  <tr key={p.id}
                    style={{ borderBottom: `1px solid ${C.raisedBorder}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.raised)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    className="transition-colors"
                  >
                    <td className="px-4 py-3">
                      {img ? (
                        <button type="button" onClick={() => setViewerSrc(img)}
                          className="relative group rounded-xl overflow-hidden focus:outline-none" style={{ display: "inline-block" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={p.product_name} className="h-14 w-14 rounded-xl object-cover block" style={{ border: `1px solid ${C.cardBorder}` }} />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <ZoomIn className="h-4 w-4 text-white" />
                          </span>
                        </button>
                      ) : (
                        <div className="h-14 w-14 rounded-xl flex items-center justify-center text-xs"
                          style={{ background: C.raised, border: `1px solid ${C.raisedBorder}`, color: C.textMuted }}
                        >—</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold" style={{ color: C.textPrimary }}>{p.product_name}</p>
                      {p.flavor_notes && (
                        <p className="text-xs mt-0.5 truncate max-w-[180px]" style={{ color: C.textMuted }}>{p.flavor_notes}</p>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell" style={{ color: C.textSecondary }}>{p.product_origin || "N/A"}</td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {p.process ? (
                        <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
                        >{p.process.split("(")[0].trim()}</span>
                      ) : <span style={{ color: C.textMuted }}>—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 transition-colors"
                          style={{ color: C.textSecondary, background: "transparent" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.raised; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                        ><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => { setDeleteError(""); setDeleteId(p.id); }} className="rounded-lg p-1.5 transition-colors"
                          style={{ color: C.textSecondary, background: "transparent" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.dangerBg; (e.currentTarget as HTMLButtonElement).style.color = C.danger; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                        ><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.raisedBorder}` }}>
              <div>
                <h2 className="text-base font-bold" style={{ color: C.textPrimary }}>
                  {modal === "add" ? "Add Product" : "Edit Product"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                  {modal === "add" ? "Enter details for the new coffee listing" : `Editing: ${selected?.product_name}`}
                </p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-lg p-1.5 transition-colors"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
              ><X className="h-5 w-5" /></button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
              <div>
                <label style={labelBase}>Product name <span style={{ color: C.danger }}>*</span></label>
                <input type="text" value={form.product_name}
                  onChange={(e) => { setForm((f) => ({ ...f, product_name: e.target.value })); if (error) setError(""); }}
                  placeholder="e.g. Yirgacheffe Grade 1"
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = !form.product_name.trim() && error ? C.danger : C.inputBorder)}
                  style={{ ...inputBase, borderColor: !form.product_name.trim() && error ? C.danger : C.inputBorder }}
                />
                {!form.product_name.trim() && error === "Product name is required." && (
                  <p className="mt-1 text-xs" style={{ color: C.danger }}>This field is required.</p>
                )}
              </div>

              <div ref={originsDropdownRef}>
                <label style={labelBase}>Origins</label>
                {selectedOrigins.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedOrigins.map((name) => (
                      <span key={name} className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
                      >
                        {name}
                        <button type="button" onClick={() => setSelectedOrigins((p) => p.filter((o) => o !== name))}
                          style={{ color: C.amber, background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: 0 }}
                        ><X className="h-2.5 w-2.5" /></button>
                      </span>
                    ))}
                  </div>
                )}
                <button type="button" onClick={() => setOriginsOpen((v) => !v)}
                  style={{ ...inputBase, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                >
                  <span style={{ color: selectedOrigins.length ? C.textPrimary : C.textPlaceholder }}>
                    {selectedOrigins.length === 0 ? "Select growing regions…" : `${selectedOrigins.length} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: C.textMuted, transform: originsOpen ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
                </button>
                {originsOpen && (
                  <div className="mt-1 rounded-xl overflow-hidden" style={{ background: C.raised, border: `1px solid ${C.raisedBorder}`, maxHeight: "160px", overflowY: "auto" }}>
                    {origins.length === 0 && <p className="px-3 py-2.5 text-xs" style={{ color: C.textMuted }}>No origins yet — add one below.</p>}
                    {origins.map((o) => (
                      <label key={o.id} className="flex items-center justify-between px-3 py-2 cursor-pointer transition-colors"
                        style={{ borderBottom: `1px solid ${C.raisedBorder}` }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = C.card)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div className="flex items-center gap-2.5">
                          <input type="checkbox" checked={selectedOrigins.includes(o.name)} onChange={() => toggleOrigin(o.name)} style={{ accentColor: C.amber }} />
                          <span style={{ color: C.textPrimary, fontSize: "0.875rem" }}>{o.name}</span>
                        </div>
                        <button type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteOrigin(o.id); }}
                          style={{ color: C.textMuted, background: "none", border: "none", cursor: "pointer", padding: "0.1rem" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                        ><X className="h-3.5 w-3.5" /></button>
                      </label>
                    ))}
                    <div className="flex gap-2 p-2.5">
                      <input type="text" placeholder="Add new region…" value={newOriginInput}
                        onChange={(e) => setNewOriginInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNewOrigin(); } }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                        onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                        style={{ ...inputBase, fontSize: "0.8rem", padding: "0.35rem 0.6rem" }}
                      />
                      <button type="button" onClick={addNewOrigin} disabled={addingOrigin || !newOriginInput.trim()}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-40 flex-shrink-0"
                        style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
                      >Add</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelBase}>Altitude</label>
                  <SelectOrOther options={ALTITUDE_OPTIONS} value={form.altitude} onChange={(v) => setForm((f) => ({ ...f, altitude: v }))} placeholder="Select range…" />
                </div>
                <div>
                  <label style={labelBase}>Process</label>
                  <SelectOrOther options={PROCESS_OPTIONS} value={form.process} onChange={(v) => setForm((f) => ({ ...f, process: v }))} placeholder="Select method…" />
                </div>
              </div>

              <div>
                <label style={labelBase}>Flavor notes</label>
                <FlavorMultiSelect value={form.flavor_notes} onChange={(v) => setForm((f) => ({ ...f, flavor_notes: v }))} />
              </div>

              <div>
                <label style={labelBase}>Description</label>
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the product…"
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={{ ...inputBase, resize: "vertical" }}
                />
              </div>

              <div>
                <label style={labelBase}>Product image</label>
                <div className="flex items-center gap-3">
                  {(imageFile || (modal === "edit" && form.image_file)) && (
                    <button type="button"
                      onClick={() => { const src = imageFile ? URL.createObjectURL(imageFile) : imageUrl(form.image_file); if (src) setViewerSrc(src); }}
                      className="relative group rounded-xl overflow-hidden focus:outline-none flex-shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageFile ? URL.createObjectURL(imageFile) : imageUrl(form.image_file) ?? ""} alt="Preview"
                        className="h-16 w-16 object-cover rounded-xl" style={{ border: `1px solid ${C.cardBorder}` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <ZoomIn className="h-4 w-4 text-white" />
                      </span>
                    </button>
                  )}
                  <div className="flex flex-col gap-1">
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
                      <p className="text-xs" style={{ color: C.textMuted }}>Current image kept unless replaced.</p>
                    )}
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>

            <div className="px-6 py-4" style={{ borderTop: `1px solid ${C.raisedBorder}` }}>
              {error && (
                <div className="mb-3 rounded-xl px-3.5 py-2.5 text-sm" style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}>{error}</div>
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
                >{saving ? (uploadProgress > 0 ? `${uploadProgress}%` : "Uploading…") : modal === "add" ? "Add product" : "Save changes"}</button>
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
            ><Trash2 className="h-5 w-5" style={{ color: C.danger }} /></div>
            <p className="font-bold text-base" style={{ color: C.textPrimary }}>Delete product?</p>
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
          <img src={viewerSrc} alt="Product image" onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "88vh", maxWidth: "88vw", objectFit: "contain", borderRadius: "1rem", boxShadow: "0 25px 80px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
      )}
    </div>
  );
}
