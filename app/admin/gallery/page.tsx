"use client";

import { useEffect, useRef, useState } from "react";
import { imageUrl, type GalleryImage, type GalleryVideo } from "@/lib/api";
import { Pencil, Trash2, Plus, Upload, X, ZoomIn, Play, Film } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";
const CATEGORY_KEYS = ["Events", "Farms", "Processing", "Shipping", "Other"] as const;
const EMPTY_IMG = { caption: "", order: 0, image: "", category: "Events" };
const EMPTY_VID = { caption: "", order: 0, video_url: "", category: "Events" };

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

function videoFileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API}${path}`;
}
// suppress unused warning
void videoFileUrl;

export default function AdminGalleryPage() {
  // ── Images ──────────────────────────────────────────────────────────────────
  const [images,       setImages]       = useState<GalleryImage[]>([]);
  const [imgLoading,   setImgLoading]   = useState(true);
  const [imgModal,     setImgModal]     = useState<"add" | "edit" | null>(null);
  const [selectedImg,  setSelectedImg]  = useState<GalleryImage | null>(null);
  const [imgForm,      setImgForm]      = useState(EMPTY_IMG);
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imgSaving,    setImgSaving]    = useState(false);
  const [imgProgress,  setImgProgress]  = useState(0);
  const [imgError,     setImgError]     = useState("");
  const [deleteImgId,  setDeleteImgId]  = useState<number | null>(null);
  const [deleteImgError, setDeleteImgError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Videos ──────────────────────────────────────────────────────────────────
  const [videos,       setVideos]       = useState<GalleryVideo[]>([]);
  const [vidLoading,   setVidLoading]   = useState(true);
  const [vidModal,     setVidModal]     = useState<"add" | "edit" | null>(null);
  const [selectedVid,  setSelectedVid]  = useState<GalleryVideo | null>(null);
  const [vidForm,      setVidForm]      = useState(EMPTY_VID);
  const [videoFile,    setVideoFile]    = useState<File | null>(null);
  const [thumbFile,    setThumbFile]    = useState<File | null>(null);
  const [vidSaving,    setVidSaving]    = useState(false);
  const [vidProgress,  setVidProgress]  = useState(0);
  const [vidError,     setVidError]     = useState("");
  const [deleteVidId,  setDeleteVidId]  = useState<number | null>(null);
  const [deleteVidError, setDeleteVidError] = useState("");
  const videoFileRef = useRef<HTMLInputElement>(null);
  const thumbFileRef = useRef<HTMLInputElement>(null);

  // ── Shared ──────────────────────────────────────────────────────────────────
  const [viewerSrc,   setViewerSrc]   = useState<string | null>(null);
  const [editHover,   setEditHover]   = useState<string | null>(null);
  const [deleteHover, setDeleteHover] = useState<string | null>(null);

  async function loadImages() {
    setImgLoading(true);
    try { const r = await fetch(`${API}/api/gallery`); if (r.ok) { const d: GalleryImage[] = await r.json(); setImages(d.sort((a, b) => a.order - b.order)); } } finally { setImgLoading(false); }
  }
  async function loadVideos() {
    setVidLoading(true);
    try { const r = await fetch(`${API}/api/gallery-videos`); if (r.ok) { const d: GalleryVideo[] = await r.json(); setVideos(d.sort((a, b) => a.order - b.order)); } } finally { setVidLoading(false); }
  }

  useEffect(() => { loadImages(); loadVideos(); }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === "Escape") setViewerSrc(null); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!videoFile) return;
    const videoEl = document.createElement("video");
    videoEl.muted = true;
    const src = URL.createObjectURL(videoFile);
    videoEl.src = src;
    videoEl.onloadedmetadata = () => { videoEl.currentTime = Math.min(1.5, videoEl.duration * 0.1); };
    videoEl.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = videoEl.videoWidth || 1280;
      canvas.height = videoEl.videoHeight || 720;
      canvas.getContext("2d")?.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(src);
        if (blob) setThumbFile(new File([blob], "thumb.jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.85);
    };
    videoEl.onerror = () => URL.revokeObjectURL(src);
  }, [videoFile]);

  // ── Image CRUD ──────────────────────────────────────────────────────────────
  function openAddImg() { setImgForm({ caption: "", order: images.length + 1, image: "", category: "Events" }); setImageFile(null); setSelectedImg(null); setImgError(""); setImgModal("add"); }
  function openEditImg(img: GalleryImage) { setImgForm({ caption: img.caption, order: img.order, image: img.image, category: img.category ?? "Events" }); setImageFile(null); setSelectedImg(img); setImgError(""); setImgModal("edit"); }
  function closeImgModal() { setImgModal(null); setSelectedImg(null); setImgError(""); }

  async function saveImg() {
    setImgSaving(true); setImgError(""); setImgProgress(0);
    try {
      if (imgModal === "add" && !imageFile) { setImgError("Please select an image."); setImgSaving(false); return; }
      const body = new FormData();
      body.append("caption", imgForm.caption); body.append("order", String(imgForm.order)); body.append("category", imgForm.category);
      if (imageFile) body.append("image", imageFile);
      const url = imgModal === "edit" ? `${API}/api/gallery/update/${selectedImg!.id}` : `${API}/api/gallery/create`;
      const method = imgModal === "edit" ? "PUT" : "POST";
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setImgProgress(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => { xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Error ${xhr.status}`)); };
        xhr.onerror = () => reject(new Error("Network error — is the backend running?"));
        xhr.send(body);
      });
      closeImgModal(); await loadImages();
    } catch (e: unknown) { setImgError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setImgSaving(false); setImgProgress(0); }
  }

  async function confirmDeleteImg(id: number) {
    setDeleteImgError("");
    try {
      const res = await fetch(`${API}/api/gallery/delete/${id}`, { method: "DELETE" });
      if (!res.ok) { setDeleteImgError(await parseError(res)); return; }
      setDeleteImgId(null); await loadImages();
    } catch { setDeleteImgError("Network error — is the backend running?"); }
  }

  // ── Video CRUD ──────────────────────────────────────────────────────────────
  function openAddVid() { setVidForm({ caption: "", order: videos.length + 1, video_url: "", category: "Events" }); setVideoFile(null); setThumbFile(null); setSelectedVid(null); setVidError(""); setVidModal("add"); }
  function openEditVid(v: GalleryVideo) { setVidForm({ caption: v.caption, order: v.order, video_url: v.video_url ?? "", category: v.category ?? "Events" }); setVideoFile(null); setThumbFile(null); setSelectedVid(v); setVidError(""); setVidModal("edit"); }
  function closeVidModal() { setVidModal(null); setSelectedVid(null); setVidError(""); }

  async function saveVid() {
    setVidSaving(true); setVidError(""); setVidProgress(0);
    try {
      if (vidModal === "add" && !videoFile && !vidForm.video_url.trim()) { setVidError("Provide a video file or a URL."); setVidSaving(false); return; }
      const body = new FormData();
      body.append("caption", vidForm.caption); body.append("order", String(vidForm.order)); body.append("category", vidForm.category);
      body.append("video_url", vidForm.video_url);
      if (videoFile) body.append("video_file", videoFile);
      if (thumbFile) body.append("thumbnail", thumbFile);
      const url = vidModal === "edit" ? `${API}/api/gallery-videos/update/${selectedVid!.id}` : `${API}/api/gallery-videos/create`;
      const method = vidModal === "edit" ? "PUT" : "POST";
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setVidProgress(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => { xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Error ${xhr.status}`)); };
        xhr.onerror = () => reject(new Error("Network error — is the backend running?"));
        xhr.send(body);
      });
      closeVidModal(); await loadVideos();
    } catch (e: unknown) { setVidError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setVidSaving(false); setVidProgress(0); }
  }

  async function confirmDeleteVid(id: number) {
    setDeleteVidError("");
    try {
      const res = await fetch(`${API}/api/gallery-videos/delete/${id}`, { method: "DELETE" });
      if (!res.ok) { setDeleteVidError(await parseError(res)); return; }
      setDeleteVidId(null); await loadVideos();
    } catch { setDeleteVidError("Network error — is the backend running?"); }
  }

  const imgCountLabel = images.length !== 1 ? "images" : "image";
  const vidCountLabel = videos.length !== 1 ? "videos" : "video";

  return (
    <div className="max-w-5xl">

      {/* ── IMAGES header ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: C.textMuted }}>Data Collection</p>
          <h1 className="mt-0.5 text-2xl font-bold" style={{ color: C.textPrimary }}>Gallery Images</h1>
          <p className="mt-0.5 text-sm" style={{ color: C.textSecondary }}>
            {imgLoading ? "Loading…" : `${images.length} ${imgCountLabel}`}
          </p>
        </div>
        <button onClick={openAddImg}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: C.amber, color: "#1C0C04" }}
        >
          <Plus className="h-4 w-4" /> Upload image
        </button>
      </div>

      {imgLoading ? (
        <div className="py-10 text-center text-sm" style={{ color: C.textMuted }}>Loading…</div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl py-12 text-center text-sm"
          style={{ border: `1px dashed ${C.cardBorder}`, color: C.textMuted }}
        >No images yet.</div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => {
            const src = imageUrl(img.image);
            return (
              <div key={img.id} className="rounded-2xl overflow-hidden shadow-sm"
                style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
              >
                <div className="relative" style={{ aspectRatio: "4/3" }}>
                  {src ? (
                    <button type="button" onClick={() => setViewerSrc(src)} className="absolute inset-0 w-full h-full group focus:outline-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={img.caption} className="w-full h-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn className="h-8 w-8 text-white drop-shadow" /></span>
                    </button>
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl" style={{ background: C.raised, color: C.textMuted }}>🖼️</div>
                  )}
                  <span className="absolute top-2 right-2 rounded-md px-2 py-0.5 shadow-sm pointer-events-none text-xs font-semibold"
                    style={{ background: "rgba(12,8,4,0.85)", color: C.amber }}
                  >#{img.order}</span>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="truncate text-sm" style={{ color: C.textSecondary }}>
                      {img.caption || <span style={{ color: C.textMuted, fontStyle: "italic" }}>No caption</span>}
                    </p>
                    {img.category && (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
                      >{img.category}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditImg(img)}
                      onMouseEnter={() => setEditHover(`img-${img.id}`)} onMouseLeave={() => setEditHover(null)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-sm font-medium transition-all"
                      style={{ color: editHover === `img-${img.id}` ? C.textPrimary : C.textSecondary, background: editHover === `img-${img.id}` ? C.raised : "transparent", border: `1px solid ${C.cardBorder}` }}
                    ><Pencil className="h-3.5 w-3.5" /> Edit</button>
                    <button onClick={() => { setDeleteImgError(""); setDeleteImgId(img.id); }}
                      onMouseEnter={() => setDeleteHover(`img-${img.id}`)} onMouseLeave={() => setDeleteHover(null)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-sm font-medium transition-all"
                      style={{ color: deleteHover === `img-${img.id}` ? C.danger : C.textSecondary, background: deleteHover === `img-${img.id}` ? C.dangerBg : "transparent", border: `1px solid ${C.cardBorder}` }}
                    ><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VIDEOS header ── */}
      <div className="mt-12 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: C.textPrimary }}>
            <Film className="h-5 w-5" style={{ color: C.amber }} /> Gallery Videos
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: C.textSecondary }}>
            {vidLoading ? "Loading…" : `${videos.length} ${vidCountLabel}`}
          </p>
        </div>
        <button onClick={openAddVid}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: C.amber, color: "#1C0C04" }}
        >
          <Plus className="h-4 w-4" /> Add video
        </button>
      </div>

      {vidLoading ? (
        <div className="py-10 text-center text-sm" style={{ color: C.textMuted }}>Loading…</div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl py-12 text-center text-sm"
          style={{ border: `1px dashed ${C.cardBorder}`, color: C.textMuted }}
        >No videos yet.</div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => {
            const thumb = v.thumbnail ? imageUrl(v.thumbnail) : null;
            return (
              <div key={v.id} className="rounded-2xl overflow-hidden shadow-sm"
                style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
              >
                <div className="relative flex items-center justify-center" style={{ aspectRatio: "4/3", background: C.raised }}>
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={v.caption} className="w-full h-full object-cover" />
                  ) : (
                    <Play className="h-10 w-10" style={{ color: C.textMuted }} />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: thumb ? "rgba(0,0,0,0.35)" : "transparent" }}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)" }}>
                      <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  <span className="absolute top-2 right-2 rounded-md px-2 py-0.5 shadow-sm pointer-events-none text-xs font-semibold"
                    style={{ background: "rgba(12,8,4,0.85)", color: C.amber }}
                  >#{v.order}</span>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="truncate text-sm" style={{ color: C.textSecondary }}>
                      {v.caption || <span style={{ color: C.textMuted, fontStyle: "italic" }}>No caption</span>}
                    </p>
                    {v.category && (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ background: C.amberBg, color: C.amber, border: `1px solid ${C.amberBorder}` }}
                      >{v.category}</span>
                    )}
                  </div>
                  {v.video_url && <p className="truncate mb-2 text-xs" style={{ color: C.textMuted }}>{v.video_url}</p>}
                  {v.video_file && <p className="truncate mb-2 text-xs" style={{ color: C.textMuted }}>Uploaded file</p>}
                  <div className="flex gap-2">
                    <button onClick={() => openEditVid(v)}
                      onMouseEnter={() => setEditHover(`vid-${v.id}`)} onMouseLeave={() => setEditHover(null)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-sm font-medium transition-all"
                      style={{ color: editHover === `vid-${v.id}` ? C.textPrimary : C.textSecondary, background: editHover === `vid-${v.id}` ? C.raised : "transparent", border: `1px solid ${C.cardBorder}` }}
                    ><Pencil className="h-3.5 w-3.5" /> Edit</button>
                    <button onClick={() => { setDeleteVidError(""); setDeleteVidId(v.id); }}
                      onMouseEnter={() => setDeleteHover(`vid-${v.id}`)} onMouseLeave={() => setDeleteHover(null)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-sm font-medium transition-all"
                      style={{ color: deleteHover === `vid-${v.id}` ? C.danger : C.textSecondary, background: deleteHover === `vid-${v.id}` ? C.dangerBg : "transparent", border: `1px solid ${C.cardBorder}` }}
                    ><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Image Modal ── */}
      {imgModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.raisedBorder}` }}>
              <h2 className="text-base font-bold" style={{ color: C.textPrimary }}>
                {imgModal === "add" ? "Upload image" : "Edit image"}
              </h2>
              <button type="button" onClick={closeImgModal} className="rounded-lg p-1.5 transition-colors"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
              ><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label style={labelBase}>
                  Image{imgModal === "add" && <span style={{ color: C.danger, marginLeft: "2px" }}>*</span>}
                </label>
                <div className="flex items-start gap-3 mt-1">
                  {(imageFile || (imgModal === "edit" && imgForm.image)) && (
                    <button type="button" onClick={() => { const src = imageFile ? URL.createObjectURL(imageFile) : imageUrl(imgForm.image); if (src) setViewerSrc(src); }}
                      className="relative group rounded-xl overflow-hidden focus:outline-none flex-shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageFile ? URL.createObjectURL(imageFile) : imageUrl(imgForm.image) ?? ""} alt="Preview"
                        className="h-20 w-20 object-cover rounded-xl" style={{ border: `1px solid ${C.cardBorder}` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"><ZoomIn className="h-5 w-5 text-white" /></span>
                    </button>
                  )}
                  <div>
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all"
                      style={{ background: C.raised, border: `1px solid ${C.raisedBorder}`, color: C.textSecondary }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.inputFocus; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.raisedBorder; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                    >
                      <Upload className="h-4 w-4" style={{ color: C.amber }} />
                      {imageFile ? imageFile.name : "Choose image…"}
                    </button>
                    {imgModal === "edit" && imgForm.image && !imageFile && (
                      <p className="mt-1 text-xs" style={{ color: C.textMuted }}>Current image kept unless you pick a new file.</p>
                    )}
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              </div>
              <div>
                <label style={labelBase}>Category</label>
                <select value={imgForm.category} onChange={(e) => setImgForm((f) => ({ ...f, category: e.target.value }))}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={{ ...inputBase, cursor: "pointer" }}
                >
                  {CATEGORY_KEYS.map((c) => <option key={c} value={c} style={{ background: C.card }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelBase}>Caption</label>
                <input type="text" value={imgForm.caption}
                  onChange={(e) => setImgForm((f) => ({ ...f, caption: e.target.value }))}
                  placeholder="Describe this image…"
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={inputBase}
                />
              </div>
              <div>
                <label style={labelBase}>Display order</label>
                <input type="number" value={imgForm.order}
                  onChange={(e) => setImgForm((f) => ({ ...f, order: Number(e.target.value) }))}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={inputBase}
                />
              </div>
            </div>
            <div className="px-6 py-4" style={{ borderTop: `1px solid ${C.raisedBorder}` }}>
              {imgError && (
                <div className="mb-3 rounded-xl px-3.5 py-2.5 text-sm"
                  style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}
                >{imgError}</div>
              )}
              {imgSaving && imgProgress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: C.textMuted }}>
                    <span>Uploading…</span><span>{imgProgress}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ background: C.raised, height: "6px" }}>
                    <div className="h-full rounded-full transition-all duration-150" style={{ width: `${imgProgress}%`, background: C.amber }} />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button onClick={closeImgModal} disabled={imgSaving} className="rounded-xl px-5 py-2 text-sm font-medium transition-all disabled:opacity-40"
                  style={{ color: C.textSecondary, background: "transparent" }}
                  onMouseEnter={(e) => { if (!imgSaving) { (e.currentTarget as HTMLButtonElement).style.background = C.raised; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; } }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                >Cancel</button>
                <button onClick={saveImg} disabled={imgSaving}
                  className="rounded-xl px-6 py-2 text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: C.amber, color: "#1C0C04" }}
                  onMouseEnter={(e) => { if (!imgSaving) (e.currentTarget as HTMLButtonElement).style.background = C.amberLight; }}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.amber}
                >{imgSaving ? (imgProgress > 0 ? `${imgProgress}%` : "Uploading…") : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Modal ── */}
      {vidModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.raisedBorder}` }}>
              <h2 className="text-base font-bold" style={{ color: C.textPrimary }}>
                {vidModal === "add" ? "Add video" : "Edit video"}
              </h2>
              <button type="button" onClick={closeVidModal} className="rounded-lg p-1.5 transition-colors"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
              ><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label style={labelBase}>Video file (optional)</label>
                <div className="flex items-center gap-3 mt-1">
                  <button type="button" onClick={() => videoFileRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all"
                    style={{ background: C.raised, border: `1px solid ${C.raisedBorder}`, color: C.textSecondary }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.inputFocus; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.raisedBorder; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                  >
                    <Upload className="h-4 w-4" style={{ color: C.amber }} />
                    {videoFile ? videoFile.name : "Choose video…"}
                  </button>
                  {videoFile && (
                    <button type="button" onClick={() => setVideoFile(null)}
                      className="rounded-lg p-1" style={{ color: C.textMuted, background: "none", border: "none", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.danger)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                    ><X className="h-4 w-4" /></button>
                  )}
                  <input ref={videoFileRef} type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />
                </div>
              </div>
              <div>
                <label style={labelBase}>YouTube / Vimeo URL (optional)</label>
                <input type="url" value={vidForm.video_url}
                  onChange={(e) => setVidForm((f) => ({ ...f, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=…"
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={inputBase}
                />
              </div>
              <div>
                <label style={labelBase}>Thumbnail image (optional)</label>
                <div className="flex items-center gap-3 mt-1">
                  {(thumbFile || (vidModal === "edit" && selectedVid?.thumbnail)) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbFile ? URL.createObjectURL(thumbFile) : imageUrl(selectedVid!.thumbnail) ?? ""} alt="Thumb"
                      className="h-14 w-20 object-cover rounded-lg flex-shrink-0"
                      style={{ border: `1px solid ${C.cardBorder}` }}
                    />
                  )}
                  <button type="button" onClick={() => thumbFileRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all"
                    style={{ background: C.raised, border: `1px solid ${C.raisedBorder}`, color: C.textSecondary }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.inputFocus; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.raisedBorder; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                  >
                    <Upload className="h-4 w-4" style={{ color: C.amber }} />
                    {thumbFile ? thumbFile.name : "Choose thumbnail…"}
                  </button>
                  <input ref={thumbFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} />
                </div>
              </div>
              <div>
                <label style={labelBase}>Category</label>
                <select value={vidForm.category} onChange={(e) => setVidForm((f) => ({ ...f, category: e.target.value }))}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={{ ...inputBase, cursor: "pointer" }}
                >
                  {CATEGORY_KEYS.map((c) => <option key={c} value={c} style={{ background: C.card }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelBase}>Caption</label>
                <input type="text" value={vidForm.caption}
                  onChange={(e) => setVidForm((f) => ({ ...f, caption: e.target.value }))}
                  placeholder="Describe this video…"
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={inputBase}
                />
              </div>
              <div>
                <label style={labelBase}>Display order</label>
                <input type="number" value={vidForm.order}
                  onChange={(e) => setVidForm((f) => ({ ...f, order: Number(e.target.value) }))}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.inputFocus)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = C.inputBorder)}
                  style={inputBase}
                />
              </div>
            </div>
            <div className="px-6 py-4" style={{ borderTop: `1px solid ${C.raisedBorder}` }}>
              {vidError && (
                <div className="mb-3 rounded-xl px-3.5 py-2.5 text-sm"
                  style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}
                >{vidError}</div>
              )}
              {vidSaving && vidProgress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: C.textMuted }}>
                    <span>Uploading…</span><span>{vidProgress}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ background: C.raised, height: "6px" }}>
                    <div className="h-full rounded-full transition-all duration-150" style={{ width: `${vidProgress}%`, background: C.amber }} />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button onClick={closeVidModal} disabled={vidSaving} className="rounded-xl px-5 py-2 text-sm font-medium transition-all disabled:opacity-40"
                  style={{ color: C.textSecondary, background: "transparent" }}
                  onMouseEnter={(e) => { if (!vidSaving) { (e.currentTarget as HTMLButtonElement).style.background = C.raised; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; } }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
                >Cancel</button>
                <button onClick={saveVid} disabled={vidSaving}
                  className="rounded-xl px-6 py-2 text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: C.amber, color: "#1C0C04" }}
                  onMouseEnter={(e) => { if (!vidSaving) (e.currentTarget as HTMLButtonElement).style.background = C.amberLight; }}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.amber}
                >{vidSaving ? (vidProgress > 0 ? `${vidProgress}%` : "Uploading…") : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Image confirm ── */}
      {deleteImgId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl"
            style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}` }}
            ><Trash2 className="h-5 w-5" style={{ color: C.danger }} /></div>
            <p className="font-bold text-base" style={{ color: C.textPrimary }}>Remove this image?</p>
            <p className="mt-1.5 text-sm" style={{ color: C.textSecondary }}>This action cannot be undone.</p>
            {deleteImgError && <div className="mt-3 rounded-xl px-3 py-2 text-sm"
              style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}
            >{deleteImgError}</div>}
            <div className="mt-5 flex justify-center gap-3">
              <button onClick={() => { setDeleteImgId(null); setDeleteImgError(""); }}
                className="rounded-xl px-5 py-2 text-sm font-medium transition-all"
                style={{ color: C.textSecondary, background: "transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.raised; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
              >Cancel</button>
              <button onClick={() => confirmDeleteImg(deleteImgId)}
                className="rounded-xl px-6 py-2 text-sm font-semibold transition-all"
                style={{ background: "#8C2020", color: "#FFC0C0" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A02828")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#8C2020")}
              >Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Video confirm ── */}
      {deleteVidId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div className="w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl"
            style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}` }}
            ><Trash2 className="h-5 w-5" style={{ color: C.danger }} /></div>
            <p className="font-bold text-base" style={{ color: C.textPrimary }}>Remove this video?</p>
            <p className="mt-1.5 text-sm" style={{ color: C.textSecondary }}>This action cannot be undone.</p>
            {deleteVidError && <div className="mt-3 rounded-xl px-3 py-2 text-sm"
              style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, color: C.danger }}
            >{deleteVidError}</div>}
            <div className="mt-5 flex justify-center gap-3">
              <button onClick={() => { setDeleteVidId(null); setDeleteVidError(""); }}
                className="rounded-xl px-5 py-2 text-sm font-medium transition-all"
                style={{ color: C.textSecondary, background: "transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = C.raised; (e.currentTarget as HTMLButtonElement).style.color = C.textPrimary; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = C.textSecondary; }}
              >Cancel</button>
              <button onClick={() => confirmDeleteVid(deleteVidId)}
                className="rounded-xl px-6 py-2 text-sm font-semibold transition-all"
                style={{ background: "#8C2020", color: "#FFC0C0" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A02828")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#8C2020")}
              >Remove</button>
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
          <img src={viewerSrc} alt="Gallery image" onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "88vh", maxWidth: "88vw", objectFit: "contain", borderRadius: "1rem", boxShadow: "0 25px 80px rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
      )}
    </div>
  );
}
