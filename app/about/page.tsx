import Link from "next/link";
import Image from "next/image";
import { Coffee } from "lucide-react";
import LegacyTimeline from "@/components/legacy-timeline";
import CoffeeRegions from "@/components/coffee-regions";
import ProcessingCards from "@/components/processing-cards";
import { getProfile } from "@/lib/api";

export const dynamic = "force-static";

export default async function AboutPage() {
  const profile = await getProfile();

  const companyName = profile?.company_name || "Dawit Demissie Telila";
  const tagline     = profile?.tagline       || "Growing Through Trust, Quality, and Long-Term Partnerships";
  const foundedYear = profile?.founded_year  || "2007";
  const ownerName   = profile?.owner_name    || "Dawit Demissie Telila";
  const ownerBio    = profile?.owner_bio     || "";
  const phone1      = profile?.phone_1       || "+251-911-207323";
  const phone2      = profile?.phone_2       || "+251-911-625032";
  const email1      = profile?.email_1       || "dawitdemissie0@gmail.com";
  const email2      = profile?.email_2       || "arcethiopia@yahoo.com";
  const city        = profile?.city          || "Addis Ababa";
  const country     = profile?.country       || "Ethiopia";

  return (
    <div style={{ background: "#f2e3a8" }}>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative -mt-[68px] flex min-h-[92vh] items-end pb-0 overflow-hidden" style={{ background: "#023732" }}>

        {/* Background texture gradient */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,0,0,0.15) 0%, rgba(2,55,50,0.4) 70%)" }} />

        {/* Logo image centered */}
        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-16 lg:px-24" style={{ paddingBottom: "120px" }}>
          <div className="relative w-full max-w-2xl">
            <Image
              src="/Horizontal golden@2x.png"
              alt="Dawit Coffee Export"
              width={900}
              height={400}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Stat strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ background: "#023732", borderTop: "1px solid rgba(242,168,30,0.2)" }}
          >
            {[
              { n: "30+", l: "Years of Heritage" },
              { n: "19+", l: "Years as Exporter" },
              { n: "17+", l: "Distinct Origins" },
              { n: "15+", l: "Global Markets" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center py-7 px-4 text-center"
                style={{ borderRight: i < 3 ? "1px solid rgba(242,168,30,0.1)" : undefined }}
              >
                <span className="text-4xl font-bold md:text-5xl" style={{ color: "#F9EF6D" }}>{s.n}</span>
                <span className="mt-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "#F2A81E" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDING STORY ──────────────────────────────────────────────── */}
      <section className="px-6 py-24 md:px-16 lg:px-24" style={{ background: "#f2e3a8" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-start">

            {/* Left — legacy timeline */}
            <div className="flex flex-col gap-6">
              <LegacyTimeline ownerName={ownerName} foundedYear={foundedYear} lightRail />
            </div>

            {/* Right — story text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: "#9a7830" }}>Our Background</p>
              <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl" style={{ color: "#1a0f08" }}>
                A Legacy Rooted in
                <br />
                <span style={{ color: "#F2A81E" }}>Ethiopian Coffee</span>
              </h2>

              <div className="mt-8 space-y-6 text-base leading-9 md:text-lg" style={{ color: "#3a2a10" }}>
                {ownerBio ? (
                  ownerBio.split("\n").map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <>
                    <p>
                      DDTCEC was established in{" "}
                      <strong style={{ color: "#F2A81E" }}>{foundedYear}</strong> and is owned and
                      managed by <strong style={{ color: "#F2A81E" }}>{ownerName}</strong>, who draws
                      his legacy from his renowned late father Mr. Demissie Telila, a celebrated
                      export manager and Commercial Representative for overseas coffee buying companies.
                    </p>
                    <p>
                      Dawit has been an active part of the Ethiopian coffee sector for more than{" "}
                      <strong style={{ color: "#F2A81E" }}>30 years</strong>. He began as an assistant
                      cupper and coffee purchaser, acquiring wide-ranging experience from sourcing
                      through export management. He is also a{" "}
                      <strong style={{ color: "#F2A81E" }}>Licensed Q-Grader</strong> from the Coffee
                      Quality Institute of America.
                    </p>
                    <p>
                      Since founding, DDTCEC has steadily earned the trust of local and international
                      clients. Today it stands as one of Ethiopia&apos;s stable, respected coffee
                      exporters and a reliable agent for major foreign coffee importers.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="h-px flex-1" style={{ background: "rgba(242,168,30,0.22)" }} />
                <Coffee size={15} style={{ color: "#F2A81E" }} />
                <div className="h-px flex-1" style={{ background: "rgba(242,168,30,0.22)" }} />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { value: "100%", label: "Traceable Lots" },
                  { value: "ECX",  label: "Exchange Certified" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="rounded-2xl p-5"
                    style={{ background: "rgba(242,168,30,0.07)", border: "1px solid rgba(242,168,30,0.25)" }}
                  >
                    <p className="text-3xl font-bold md:text-4xl" style={{ color: "#F2A81E" }}>{c.value}</p>
                    <p className="mt-1 text-sm font-medium" style={{ color: "#5a4a28" }}>{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ETHIOPIAN COFFEE ────────────────────────────────────────────── */}
      <section className="px-6 py-24 md:px-16 lg:px-24" style={{ background: "#f2e3a8" }}>
        <div className="mx-auto max-w-6xl">

          {/* Intro */}
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: "#9a7830" }}>
              Ethiopian Coffee
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl" style={{ color: "#1a0f08" }}>
              The Birthplace of{" "}
              <span style={{ color: "#F2A81E" }}>Coffee</span>
            </h2>
            <p className="mt-5 text-base leading-9 md:text-lg" style={{ color: "#4a3820" }}>
              Ethiopia is the birthplace of coffee. Grown at high altitudes across diverse
              microclimates, Ethiopian coffee is celebrated worldwide for its unmatched quality and
              flavor complexity. Today Ethiopia stands as Africa&apos;s biggest coffee producer and
              exporter, and among the leading origins globally.
            </p>
          </div>

          {/* Processing methods */}
          <ProcessingCards />

          {/* Growing Regions */}
          <div className="mt-20">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: "#9a7830" }}>
                Growing Regions
              </p>
              <h3 className="mt-2 text-2xl font-bold md:text-3xl" style={{ color: "#1a0f08" }}>
                Origins We Source
              </h3>
            </div>

            <CoffeeRegions />

            {/* Other varieties */}
            <div
              className="mt-5 rounded-2xl px-7 py-5"
              style={{ background: "#fff", border: "1px solid rgba(242,168,30,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#9a7830" }}>
                Other Notable Varieties
              </p>
              <p className="text-sm leading-8 md:text-base" style={{ color: "#5a4830" }}>
                Several other regions also produce coffees with unique flavor and aroma:{" "}
                <strong style={{ color: "#1a0f08" }}>Bonga, Tepi, Bebeka, Guji, Yeki, Godere, Anderacha,</strong>{" "}
                and <strong style={{ color: "#1a0f08" }}>Kaffa</strong>, each reflecting the
                extraordinary genetic diversity of Ethiopian coffee.
              </p>
            </div>
          </div>

          {/* What Shapes the Cup */}
          <div className="mt-20">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: "#9a7830" }}>
                Coffee Quality
              </p>
              <h3 className="mt-2 text-2xl font-bold md:text-3xl" style={{ color: "#1a0f08" }}>
                What Shapes the Cup
              </h3>
              <p className="mt-4 text-sm leading-8 md:text-base" style={{ color: "#4a3820" }}>
                Quality is determined by the agro-ecological zone where the coffee grows, combined
                with post-harvest handling and processing method. The zone is defined by four key factors:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Altitude",     detail: "Higher elevation slows cherry maturation, producing denser, more complex beans with vibrant acidity." },
                { label: "Rainfall",     detail: "Distribution and intensity of rainfall shapes cherry development and natural sugar concentration." },
                { label: "Temperature",  detail: "Day-to-night temperature ranges determine how slowly and evenly the coffee cherry ripens." },
                { label: "Soil",         detail: "Soil type and fertility provide the mineral nutrients that express as distinctive terroir in the cup." },
              ].map(({ label, detail }) => (
                <div
                  key={label}
                  className="rounded-2xl p-6"
                  style={{ background: "#fff", border: "1px solid rgba(242,168,30,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
                >
                  <p className="mb-2 text-base font-bold" style={{ color: "#1a0f08" }}>{label}</p>
                  <p className="text-sm leading-6" style={{ color: "#6a5838" }}>{detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 lg:px-24" style={{ background: "#f2e3a8" }}>
        <div className="mx-auto max-w-6xl">

          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: "#9a7830" }}>Contact</p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl" style={{ color: "#1a0f08" }}>
              Get in <span style={{ color: "#F2A81E" }}>Touch</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-8 md:text-base" style={{ color: "#6a5030" }}>
              Ready to source the finest Ethiopian specialty coffee? Reach out directly or send us an inquiry.
            </p>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{ background: "#fff", border: "1px solid rgba(242,168,30,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
          >
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#9a7830" }}>Phone</p>
                {[phone1, phone2].filter(Boolean).map((line) => (
                  <p key={line} className="text-sm leading-7 md:text-base" style={{ color: "#3a2a10" }}>{line}</p>
                ))}
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#9a7830" }}>Email</p>
                {[email1, email2].filter(Boolean).map((line) => (
                  <p key={line} className="text-sm leading-7 md:text-base" style={{ color: "#3a2a10" }}>{line}</p>
                ))}
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#9a7830" }}>Location</p>
                <p className="text-sm leading-7 md:text-base" style={{ color: "#3a2a10" }}>{city}, {country}</p>
              </div>
            </div>
          </div>

          {/* CTA banner */}
          <div
            className="relative mt-10 overflow-hidden rounded-2xl"
            style={{ background: "#023732", border: "1px solid rgba(242,168,30,0.35)" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse 70% 80% at 10% 50%, rgba(242,168,30,0.12) 0%, transparent 70%)" }}
            />
            <div className="relative px-10 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold md:text-xl" style={{ color: "#f2e3a8" }}>
                  Ready to start importing Ethiopian specialty coffee?
                </h3>
                <p className="mt-1.5 text-sm" style={{ color: "#c4a97a" }}>
                  Send us an inquiry and we&apos;ll respond within 24 hours.
                </p>
              </div>
              <Link
                href="/inquiries"
                className="shrink-0 rounded-xl px-8 py-3.5 text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: "#F2A81E", color: "#1a0f04" }}
              >
                Send an Inquiry →
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
