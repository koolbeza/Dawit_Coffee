"use client"

import { useState } from "react"

const cards = [
  {
    title: "Washed Processing",
    body: 'Washed coffee tends to have a clarity of flavor and aroma often absent in naturals. Many cuppers assert it is easier to taste the influence of soil and varietal in washed coffee. The result is a clean, bright, and citrus-forward cup with heightened transparency.',
  },
  {
    title: "Sundried (Natural) Processing",
    body: "Prolonged, sun-fueled contact with the cherry's own natural sugars produces a sweet, fruity character with a creamy mouthfeel. The finest naturals develop intense berry flavors, tropical fruit aromatics, and chocolaty undertones.",
  },
]

export default function ProcessingCards() {
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
        .pc-card { perspective: 1000px; }
        .pc-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pc-inner.is-flipped { transform: rotateY(180deg); }
        .pc-front, .pc-back {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 1rem;
        }
        .pc-back { transform: rotateY(180deg); }
      `}</style>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {cards.map((card, i) => {
          const isFlipped = flipped.has(i)
          return (
            <div
              key={card.title}
              className="pc-card cursor-pointer"
              style={{ height: 280 }}
              onClick={() => toggle(i)}
            >
              <div className={`pc-inner${isFlipped ? " is-flipped" : ""}`}>

                {/* Front */}
                <div
                  className="pc-front flex flex-col justify-between p-7"
                  style={{ background: "#fff", border: "1px solid rgba(242,168,30,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
                >
                  <p className="text-sm font-bold uppercase tracking-[0.22em]" style={{ color: "#9a6a0a" }}>
                    {card.title}
                  </p>
                  <span style={{ color: "rgba(26,15,8,0.3)", fontSize: 10, fontWeight: 600 }}>
                    Tap to explore →
                  </span>
                </div>

                {/* Back */}
                <div
                  className="pc-back flex flex-col justify-between p-7"
                  style={{ background: "#fff", border: "1px solid rgba(242,168,30,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
                >
                  <p className="text-sm leading-8 md:text-base" style={{ color: "#4a3820" }}>
                    {card.body}
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
