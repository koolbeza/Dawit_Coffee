"use client"

import { useState } from "react"

const regions = [
  {
    name: "Sidamo",
    region: "Southern Ethiopia",
    body: 'The washed variety, called "sweet coffee", offers balanced taste with medium acidity and body. Always blended for gourmet or specialty coffee. Strength lies in its variety: many grades of both washed and sundried.',
    tags: ["Washed", "Natural"],
  },
  {
    name: "Yirgacheffe",
    region: "Southern Highlands",
    body: "Renowned for its intense floral character. One of the best highland-grown coffees in the world, with moderate acidity, rich body, and a delicate fine flavor that commands a premium from roasters worldwide.",
    tags: ["Washed", "Natural"],
  },
  {
    name: "Jimma (Djimmah)",
    region: "Southwestern Ethiopia",
    body: "Covers Ethiopia's largest basket of coffee, all unwashed coffee from the southwest. Home to a multitude of indigenous varieties, offering wide range for buyers.",
    tags: ["Natural"],
  },
  {
    name: "Harrar",
    region: "Eastern Highlands",
    body: "Medium acidity, full body, and a hallmark distinct mocha flavor. Produced in the eastern highlands, Harrar stands as one of the highest-premium coffees in the world.",
    tags: ["Natural"],
  },
  {
    name: "Limu",
    region: "Southwest · 3,600–6,200 ft",
    body: "Usually washed, Limu has a milder acidity than Sidamo and Yirgacheffe. Characterized by a balanced, clean cup — a smooth, approachable specialty origin.",
    tags: ["Washed"],
  },
  {
    name: "Wolega & Nekempti",
    region: "Western Ethiopia",
    body: "Known for its distinctive fruity taste, it is a favorite in specialty blends and equally compelling as a single-origin gourmet offering.",
    tags: ["Natural"],
  },
]

export default function CoffeeRegions() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <>
      <style>{`
        .cf-card { perspective: 1000px; }
        .cf-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cf-inner.is-flipped { transform: rotateY(180deg); }
        .cf-front, .cf-back {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 1rem;
        }
        .cf-back { transform: rotateY(180deg); }
      `}</style>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((o, i) => {
          const isFlipped = flipped.has(i)
          return (
            <div
              key={o.name}
              className="cf-card cursor-pointer"
              style={{ height: 220 }}
              onClick={() => toggle(i)}
            >
              <div className={`cf-inner${isFlipped ? " is-flipped" : ""}`}>

                {/* Front */}
                <div
                  className="cf-front flex flex-col justify-between p-6"
                  style={{ background: "#fff", border: "1px solid rgba(242,168,30,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
                >
                  <div>
                    <p style={{ color: "#1a0f08", fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
                      {o.name}
                    </p>
                    <p style={{ color: "#9a7830", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>
                      {o.region}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {o.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            background: "rgba(242,168,30,0.08)",
                            border: "1px solid rgba(242,168,30,0.25)",
                            color: "#9a6a0a",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span style={{ color: "rgba(26,15,8,0.3)", fontSize: 10, fontWeight: 600 }}>
                      Tap to explore →
                    </span>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="cf-back flex flex-col justify-between p-6"
                  style={{ background: "#fff", border: "1px solid rgba(242,168,30,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
                >
                  <p style={{ color: "#5a4830", fontSize: 13, lineHeight: 1.85 }}>
                    {o.body}
                  </p>
                  <span style={{ color: "rgba(26,15,8,0.3)", fontSize: 10, fontWeight: 600 }}>
                    ← Tap to go back
                  </span>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
