"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGallery, getGalleryVideos, imageUrl, type GalleryImage, type GalleryVideo } from "@/lib/api";
import { X, ChevronLeft, ChevronRight, ImageIcon, Play } from "lucide-react";

const ALL_TAB = "All";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : null;
}

function videoSrc(v: GalleryVideo): string | null {
  if (v.video_file) return v.video_file.startsWith("http") ? v.video_file : `${API_BASE}${v.video_file}`;
  return null;
}

function videoThumb(v: GalleryVideo): string | null {
  if (v.thumbnail) return imageUrl(v.thumbnail);
  const ytId = v.video_url ? youtubeId(v.video_url) : null;
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  return null;
}

export default function GalleryPage() {
  const [sorted, setSorted] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [lightbox, setLightbox] = useState<{ src: string; caption: string; index: number } | null>(null);
  const [videoModal, setVideoModal] = useState<GalleryVideo | null>(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    getGallery().then((imgs) => setSorted([...imgs].sort((a, b) => a.order - b.order)));
    getGalleryVideos().then((vids) => setVideos([...vids].sort((a, b) => a.order - b.order)));
  }, []);

  // Tabs from image categories + "Videos" if any videos exist
  const imageTabs = Array.from(
    new Set(sorted.map((i) => i.category).filter((c): c is string => !!c && c.trim() !== ""))
  );
  const tabs = [ALL_TAB, ...imageTabs, ...(videos.length > 0 ? ["Videos"] : [])];

  const filteredImages = activeTab === ALL_TAB
    ? sorted
    : activeTab === "Videos"
    ? []
    : sorted.filter((i) => i.category === activeTab);

  const filteredVideos = activeTab === "Videos"
    ? videos
    : activeTab === ALL_TAB
    ? videos
    : videos.filter((v) => v.category === activeTab);

  const withImg = filteredImages.filter((i) => imageUrl(i.image));

  function open(item: GalleryImage) {
    const src = imageUrl(item.image);
    if (!src) return;
    const index = withImg.findIndex((x) => x.id === item.id);
    setLightbox({ src, caption: item.caption, index });
  }

  function nav(dir: 1 | -1) {
    if (!lightbox) return;
    const next = (lightbox.index + dir + withImg.length) % withImg.length;
    const item = withImg[next];
    setLightbox({ src: imageUrl(item.image)!, caption: item.caption, index: next });
  }

  useEffect(() => {
    if (!lightbox && !videoModal) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightbox(null); setVideoModal(null); }
      if (lightbox && e.key === "ArrowRight") nav(1);
      if (lightbox && e.key === "ArrowLeft") nav(-1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, videoModal, withImg.length]);

  return (
    <div className="relative min-h-screen">

      {/* Full-page background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/cf.jpg" alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 bg-black/70" style={{ zIndex: 1 }} />

      <div className="relative" style={{ zIndex: 2 }}>

        {/* Hero */}
        <div className="px-6 py-20 md:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-4 w-4" style={{ color: "#F2A81E" }} />
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#F2A81E" }}>Behind the Scenes</p>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight max-w-xl">Gallery</h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              From highland farms to the export floor, a glimpse into the world of Dawit Coffee.
            </p>
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="mx-auto max-w-7xl px-6 md:px-10 pb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setLightbox(null); setVideoModal(null); }}
                    className="rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200"
                    style={
                      isActive
                        ? { background: "#F2A81E", color: "#023732", boxShadow: "0 0 0 1px rgba(242,168,30,0.6)" }
                        : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }
                    }
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-6 pb-14 md:px-10">

          {/* Images grid */}
          {filteredImages.length === 0 && filteredVideos.length === 0 && (
            <div className="rounded-3xl border border-dashed py-28 text-center" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
              <ImageIcon className="mx-auto h-10 w-10 mb-3" style={{ color: "rgba(255,255,255,0.3)" }} />
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No media available yet.</p>
            </div>
          )}

          {filteredImages.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {filteredImages.map((item) => {
                const img = imageUrl(item.image);
                return (
                  <div
                    key={item.id}
                    className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl cursor-pointer"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                    onClick={() => open(item)}
                  >
                    {img ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={item.caption} className="block w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="rounded-2xl bg-white/90 px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-xl backdrop-blur-sm">View full image</span>
                        </div>
                        {(item.caption || item.category) && (
                          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {item.caption && <p className="text-sm font-medium text-white/90 leading-snug line-clamp-2">{item.caption}</p>}
                            {item.category && (
                              <span className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "#F2A81E", color: "#023732" }}>{item.category}</span>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-48 w-full" style={{ background: "rgba(255,255,255,0.03)" }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Videos grid */}
          {filteredVideos.length > 0 && (
            <>
              {filteredImages.length > 0 && (
                <div className="flex items-center gap-3 mt-10 mb-5">
                  <Play className="h-4 w-4" style={{ color: "#F2A81E" }} />
                  <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#F2A81E" }}>Videos</h2>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                </div>
              )}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {filteredVideos.map((v) => {
                  const thumb = videoThumb(v);
                  return (
                    <div
                      key={v.id}
                      className="group relative overflow-hidden rounded-2xl cursor-pointer"
                      style={{ height: "280px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }}
                      onClick={() => setVideoModal(v)}
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={v.caption} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="absolute inset-0" style={{ background: "rgba(20,40,25,0.6)" }} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110" style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.5)", backdropFilter: "blur(4px)" }}>
                          <Play className="h-7 w-7 text-white ml-1" fill="white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end justify-between gap-3">
                        {v.caption && <p className="text-sm font-medium text-white/90 leading-snug line-clamp-2">{v.caption}</p>}
                        {v.category && (
                          <span className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "#F2A81E", color: "#023732" }}>{v.category}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* CTA */}
          <div className="mt-16 rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(242,168,30,0.25)", backdropFilter: "blur(20px)", background: "rgba(2,55,50,0.75)" }}>
            <div className="p-12 text-center">
              <h2 className="text-2xl font-bold text-white">Want to visit our farms?</h2>
              <p className="mt-3 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
                We welcome buyers and partners to visit our sourcing regions. Get in touch to arrange a farm visit.
              </p>
              <Link href="/inquiries" className="mt-8 inline-block rounded-xl px-8 py-3 text-sm font-semibold shadow-lg transition-opacity hover:opacity-90" style={{ background: "#F2A81E", color: "#023732" }}>
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(16px)" }} onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 rounded-full p-2.5 text-white transition-colors hover:bg-white/20" style={{ background: "rgba(255,255,255,0.1)" }} onClick={() => setLightbox(null)}>
            <X className="h-5 w-5" />
          </button>
          {withImg.length > 1 && (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/20" style={{ background: "rgba(255,255,255,0.1)" }} onClick={(e) => { e.stopPropagation(); nav(-1); }}>
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.src} alt={lightbox.caption} className="rounded-2xl object-contain" style={{ maxHeight: "88vh", maxWidth: "85vw", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }} onClick={(e) => e.stopPropagation()} />
          {withImg.length > 1 && (
            <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white transition-colors hover:bg-white/20" style={{ background: "rgba(255,255,255,0.1)" }} onClick={(e) => { e.stopPropagation(); nav(1); }}>
              <ChevronRight className="h-7 w-7" />
            </button>
          )}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-center px-6">
            {lightbox.caption && <p className="text-sm font-medium text-white">{lightbox.caption}</p>}
            {withImg.length > 1 && <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{lightbox.index + 1} / {withImg.length}&nbsp;·&nbsp;← → to navigate&nbsp;·&nbsp;Esc to close</p>}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal && (() => {
        const ytId = videoModal.video_url ? youtubeId(videoModal.video_url) : null;
        const fileSrc = videoSrc(videoModal);
        const thumb = videoThumb(videoModal);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(16px)" }}
            onClick={() => { setVideoModal(null); setIframeReady(false); }}
          >
            <button
              className="absolute top-4 right-4 rounded-full p-2.5 text-white transition-colors hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={() => { setVideoModal(null); setIframeReady(false); }}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              {ytId ? (
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {/* Thumbnail + spinner shown until iframe fires onLoad */}
                  {!iframeReady && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
                      {thumb && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.4)" }} />
                      )}
                      {/* Spinner */}
                      <div className="relative flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-lime-400 animate-spin" />
                        <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Loading video…</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIframeReady(true)}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: "none", opacity: iframeReady ? 1 : 0, transition: "opacity 0.4s ease" }}
                  />
                </div>
              ) : fileSrc ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={fileSrc} controls autoPlay className="w-full rounded-2xl" style={{ maxHeight: "80vh" }} />
              ) : videoModal.video_url ? (
                <iframe src={videoModal.video_url} allow="autoplay; fullscreen" allowFullScreen className="w-full rounded-2xl" style={{ aspectRatio: "16/9", border: "none" }} />
              ) : null}

              {videoModal.caption && (
                <p className="mt-4 text-center text-sm font-medium text-white/80">{videoModal.caption}</p>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
