"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  ownerName: string;
  foundedYear: string;
  lightRail?: boolean;
}

export default function LegacyTimeline({ ownerName, foundedYear, lightRail = false }: Props) {
  const [current, setCurrent] = useState(0);
  const [progKey, setProgKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = [
    {
      year: "1970s",
      label: "The Legacy Begins",
      detail:
        "Mr. Demissie Telila built decades of expertise as export manager at Ethiopia's most prestigious coffee firms, forging the international relationships that would lay the foundation for DDTCEC.",
      image: "/df.jpeg",
      imageAlt: "Mr. Demissie Telila",
      caption: "Mr. Demissie Telila",
      accent: "#F2A81E",
      accentDim: "rgba(242,168,30,0.18)",
      glow: "rgba(242,168,30,0.45)",
      vintage: true,
    },
    {
      year: foundedYear,
      label: "DDTCEC Founded",
      detail: `${ownerName} channeled three decades of inherited expertise into founding the company, from farm-level sourcing through international export management.`,
      image: "/dawit.jpg",
      imageAlt: ownerName,
      caption: ownerName,
      accent: "#F9EF6D",
      accentDim: "rgba(249,239,109,0.18)",
      glow: "rgba(249,239,109,0.45)",
      vintage: false,
    },
    {
      year: "Next Generation",
      label: "The Legacy Continues",
      detail:
        "Three generations deep: the story that began with Mr. Demissie Telila lives on, rooted in the same passion for Ethiopian coffee and carried forward into the future.",
      image: "/kid.jpg",
      imageAlt: "Dawit's Son",
      caption: "Dawit's Son",
      accent: "#F2A81E",
      accentDim: "rgba(242,168,30,0.18)",
      glow: "rgba(242,168,30,0.45)",
      vintage: false,
    },
  ] as const;

  type Item = (typeof items)[number];

  const goTo = useCallback((i: number) => {
    if (timer.current) clearTimeout(timer.current);
    setCurrent(i);
    setProgKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo((current + 1) % items.length), [current, goTo, items.length]);
  const prev = useCallback(() => goTo((current - 1 + items.length) % items.length), [current, goTo, items.length]);

  useEffect(() => {
    timer.current = setTimeout(next, 5500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [current, next]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  const touchStart = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  };

  const item = items[current] as Item;

  return (
    <>
      <style>{`
        @keyframes progBar  { from { width: 0 } to { width: 100% } }
        @keyframes grainMove{ 0%,100%{transform:translate(0,0)} 25%{transform:translate(-1px,1px)} 50%{transform:translate(1px,-1px)} 75%{transform:translate(0,1px)} }
        @keyframes dotPulse { 0%{transform:scale(1);opacity:.8} 70%{transform:scale(2.4);opacity:0} 100%{transform:scale(2.4);opacity:0} }
        @keyframes kenBurns { from{transform:scale(1)} to{transform:scale(1.07)} }
        .sl-grain    { animation: grainMove .45s steps(1) infinite; }
        .sl-dot-ring { animation: dotPulse 2.4s ease-out infinite; }
        .sl-ken-burns{ animation: kenBurns 8s ease forwards; }
      `}</style>

      {/* ── Slide window ── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          height: 680,
          border: lightRail ? "1px solid #d4c4a8" : "1px solid #2a3e30",
          cursor: "grab",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
        <div
          className="flex h-full"
          style={{
            width: `${items.length * 100}%`,
            transform: `translateX(-${(current * 100) / items.length}%)`,
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {items.map((sl, i) => {
            const isActive = i === current;

            return (
              <div
                key={i}
                className="relative flex-shrink-0 overflow-hidden"
                style={{ width: `${100 / items.length}%`, height: "100%" }}
              >
                {(
                  /* ── PHOTO SLIDE: full-card ── */
                  <div className="relative h-full">

                    {/* Blurred background to fill letterbox gaps */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={(sl as typeof sl & { image: string }).image}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 w-full h-full"
                      style={{
                        objectFit: "cover",
                        filter: "blur(22px) brightness(0.22) saturate(0.7)",
                        transform: "scale(1.12)",
                      }}
                    />

                    {/* Photo — centred, fully visible, no cropping */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={(sl as typeof sl & { image: string }).image}
                      alt={(sl as typeof sl & { imageAlt: string }).imageAlt}
                      className={`absolute inset-0 w-full h-full${isActive ? " sl-ken-burns" : ""}`}
                      style={{
                        objectFit: "contain",
                        filter: (sl as { vintage?: boolean }).vintage
                          ? "sepia(0.5) contrast(1.06) brightness(0.96)"
                          : "brightness(0.98)",
                      }}
                    />

                    {/* Vintage grain */}
                    {(sl as { vintage?: boolean }).vintage && (
                      <div
                        className="sl-grain absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")",
                          opacity: 0.35,
                          mixBlendMode: "overlay",
                        }}
                      />
                    )}

                    {/* Bottom gradient for text legibility */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(4,10,6,0.97) 0%, rgba(4,10,6,0.65) 55%, transparent 100%)" }}
                    />

                    {/* Text overlay */}
                    <div
                      className="absolute inset-x-0 bottom-0 px-6 pb-6"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "translateY(0)" : "translateY(10px)",
                        transition: `opacity 0.4s ease ${isActive ? "0.42s" : "0s"}, transform 0.4s ease ${isActive ? "0.42s" : "0s"}`,
                      }}
                    >
                      <span
                        className="inline-block text-[17px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full mb-3"
                        style={{ background: sl.accentDim, border: `1px solid ${sl.accent}55`, color: sl.accent }}
                      >
                        {sl.year}
                      </span>
                      <p className="text-5xl font-bold leading-tight mb-2" style={{ color: "#fff", textShadow: "0 1px 10px rgba(0,0,0,0.8)" }}>
                        {(sl as typeof sl & { caption: string }).caption}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-20" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            key={progKey}
            style={{
              height: "100%",
              background: `linear-gradient(to right, ${item.accent}88, ${item.accent})`,
              animation: "progBar 5.5s linear forwards",
            }}
          />
        </div>

        {/* ── Slide counter ── */}
        <div
          className="absolute top-4 left-4 z-20 font-mono text-xs font-bold tracking-widest rounded-full px-3 py-1"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", color: "rgba(255,255,255,0.92)" }}
        >
          {String(current + 1).padStart(2, "0")}
          <span style={{ color: "rgba(255,255,255,0.45)" }}> / {String(items.length).padStart(2, "0")}</span>
        </div>

        {/* ── Prev / Next ── */}
        {[
          { label: "prev", pos: "left-3", action: prev, Icon: ChevronLeft },
          { label: "next", pos: "right-3", action: next, Icon: ChevronRight },
        ].map(({ label, pos, action, Icon }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95`}
            style={{
              width: 36,
              height: 36,
              background: lightRail ? "rgba(245,237,224,0.78)" : "rgba(10,22,14,0.7)",
              border: lightRail ? "1px solid rgba(180,140,80,0.4)" : "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              color: lightRail ? "rgba(60,30,10,0.85)" : "rgba(255,255,255,0.75)",
            }}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* ── Timeline rail ── */}
      <div className="relative mt-5 px-1">
        {/* Track */}
        <div
          className="absolute top-[8px] left-4 right-4 h-px"
          style={{ background: lightRail ? "#023732" : "#023732" }}
        />
        {/* Fill */}
        <div
          className="absolute top-[8px] left-4 h-px transition-all duration-500 ease-out"
          style={{
            width: `calc(${(current / (items.length - 1)) * 100}% - ${(current / (items.length - 1)) * 2}rem + ${current === 0 ? "0px" : "0.5rem"})`,
            background: `linear-gradient(to right, #F9EF6D, ${item.accent})`,
            boxShadow: `0 0 6px ${item.glow}`,
          }}
        />
        {/* Nodes */}
        <div className="relative flex justify-between items-start">
          {items.map((sl, i) => {
            const isActive = i === current;
            const isPast   = i < current;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="flex flex-col items-center gap-1.5"
                style={{ minWidth: 0 }}
              >
                <div className="relative flex items-center justify-center w-[18px] h-[18px]">
                  {isActive && (
                    <div className="sl-dot-ring absolute inset-0 rounded-full" style={{ background: sl.accent }} />
                  )}
                  <div
                    className="relative z-10 rounded-full transition-all duration-300"
                    style={{
                      width:  isActive ? 14 : 10,
                      height: isActive ? 14 : 10,
                      background: isActive ? sl.accent : isPast ? "#F2A81E" : "#023732",
                      border: `1.5px solid ${isActive ? sl.accent : isPast ? "#F2A81E" : "#035a50"}`,
                      boxShadow: isActive ? `0 0 10px ${sl.glow}` : undefined,
                    }}
                  />
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 text-center leading-tight"
                  style={{
                    color: isActive ? "#F2A81E" : "#023732",
                    maxWidth: 52,
                    wordBreak: "break-word",
                  }}
                >
                  {sl.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
