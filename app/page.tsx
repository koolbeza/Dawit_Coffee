"use client";
import { ScrollTrigger, SplitText } from "gsap/all";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import WorldConnections from "@/components/worldconnections";
gsap.registerPlugin(ScrollTrigger, SplitText);


const stats = [
  { value: "30+", label: "Years of Experience",  target: 30, suffix: "+" },
  { value: "15+",  label: "Export Markets",       target: 15,  suffix: "+" },
  { value: "17+", label: "Distinct Origins",     target: 17, suffix: "+" },
  { value: "100%",label: "Traceable Lots",       target: 100,suffix: "%" },
];

const features = [
  {
    title: "Trusted Relationships",
    body: "We build and maintain dependable business relationships with local and international clients.",
  },
  {
    title: "Daily Quality Routine",
    body: "Coffee cup tasting and sourcing for the best quality are part of our daily operating discipline.",
  },
  {
    title: "Expanding Capability",
    body: "Alongside coffee exports and agency services, DDTCEC is widening its business into construction material imports.",
  },
  {
    title: "Certified Quality",
    body: "Our lots are Q-graded and comply with international export standards.",
  },
  {
    title: "Flexible Lots",
    body: "From spot samples to full container orders, we accommodate buyers of all sizes.",
  },
  {
    title: "Reliable Logistics",
    body: "Experienced freight partners ensure timely delivery to any port worldwide.",
  },
];

const whyLeftFeatures = features.slice(0, 3);
const whyRightFeatures = features.slice(3);

const HERO_SLIDES = [
  "/home2.webp",
  "/Coffe harvest.webp",
];


export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 7000);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

  
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTimeline
      .from("[data-hero='panel']", { opacity: 0, y: 30, duration: 0.9 })
      .from("[data-hero='logo']",  { opacity: 0, scale: 0.85, duration: 0.6 }, "-=0.45")
      .from("[data-hero='badge']", { opacity: 0, y: 18, duration: 0.45 }, "-=0.2")
      .from("[data-hero='description']", { opacity: 0, duration: 0.45 }, "-=0.2")
      .from(
        "[data-hero='actions'] > *",
        { opacity: 0, y: 14, stagger: 0.12, duration: 0.35 },
        "-=0.2"
      );

    gsap.to("[data-hero='description']", {
      y: -8,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
    });

    // parallax
    gsap.to("[data-hero-slide]", {
      y: "25%",
      ease: "none",
      scrollTrigger: {
        trigger: "[data-hero='section']",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.utils.toArray<HTMLElement>("[data-stat-el]").forEach((el) => {
      const target = parseFloat(el.dataset.target ?? "0");
      const suffix = el.dataset.suffix ?? "";
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        onUpdate() {
          el.textContent = Math.round(obj.val) + suffix;
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-animate='section']").forEach((section) => {
      gsap.from(section, {
        y: 24,
        duration: 0.65,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: { trigger: section, start: "top 88%", once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-animate='stagger-group']").forEach((group) => {
      const items = group.querySelectorAll("[data-animate='item']");
      if (!items.length) return;
      gsap.from(items, {
        opacity: 0,
        y: 26,
        duration: 0.55,
        stagger: 0.12,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: { trigger: group, start: "top 84%", once: true },
      });
    });



    const whyTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-why='section']",
        start: "top 78%",
        once: true,
      },
      defaults: { ease: "power3.out" },
    });

    whyTimeline
      .from("[data-why='eyebrow'], [data-why='title']", {
        opacity: 0,
        y: 24,
        duration: 0.65,
        stagger: 0.08,
      })
      .from(
        "[data-why='image-wrap']",
        { opacity: 0, scale: 0.7, rotate: -10, duration: 1 },
        "-=0.25"
      )
      .from(
        "[data-why='left'] [data-why='item']",
        { opacity: 0, x: -44, filter: "blur(8px)", duration: 0.65, stagger: 0.14 },
        "-=0.45"
      )
      .from(
        "[data-why='right'] [data-why='item']",
        { opacity: 0, x: 44, filter: "blur(8px)", duration: 0.65, stagger: 0.14 },
        "-=0.85"
      )

      .call(() => {
        gsap.to("[data-why='image-wrap']", {
          y: -12,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to("[data-why='image-wrap'] img", {
          rotate: 360,
          duration: 28,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });
      });
  }, { scope: pageRef });

  return (
    <div ref={pageRef}>

      <section
        data-hero="section"
        className="relative -mt-[68px] flex min-h-screen items-center justify-center px-6 py-32 md:px-20 overflow-hidden"
      >
        {HERO_SLIDES.map((src, i) => (
          <div
            key={src}
            data-hero-slide
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1800ms]"
            style={{
              backgroundImage: `url('${src}')`,
              backgroundPosition: "center 40%",
              opacity: i === slide ? 1 : 0,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-black/30" />


        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === slide ? "1.5rem" : "0.5rem", background: i === slide ? "#f2ebe2" : "rgba(242,235,226,0.4)" }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div
            data-hero="panel"
            className="px-8 py-12 md:px-14"
          >
            <div className="flex justify-center">
              <div className="relative inline-flex items-center justify-center">
                {/* Outer ambient glow */}
                <div className="absolute inset-0 scale-[1.8] rounded-full blur-3xl bg-[radial-gradient(ellipse,rgba(201,169,110,0.35)_0%,transparent_65%)]" />
                {/* Inner warm halo */}
                <div className="absolute inset-0 scale-110 rounded-2xl blur-xl bg-[rgba(180,130,50,0.18)]" />
                <Image
                  data-hero="logo"
                  src="/Horizontal%20golden@2x.png"
                  alt="Dawit Demissie Telila Coffee"
                  width={540}
                  height={162}
                  className="relative object-contain brightness-110 drop-shadow-[0_0_32px_rgba(201,169,110,0.75)] drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>
            <span
              data-hero="badge"
              className="mt-6 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-green-200"
            >
              Ethiopian Specialty Coffee Exporter
            </span>
            <p data-hero="description" className="mt-6 text-xl leading-9 text-white/85">
              Growing Through Trust, Quality, and Long-Term Partnerships
            </p>
            <div
              data-hero="actions"
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/products"
                className="rounded-lg bg-green-600 px-7 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-green-500"
              >
                Explore Our Coffees
              </Link>
              <Link
                href="/inquiries"
                className="rounded-lg border border-white/40 bg-white/10 px-7 py-3 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Request a Sample
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section data-animate="section" className="bg-[#f2e3a8] px-6 py-14 md:px-20">
        <div
          data-animate="stagger-group"
          className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} data-animate="item" className="text-center">
              <p
                data-stat-el
                data-target={s.target}
                data-suffix={s.suffix}
                className="text-5xl font-bold text-[#1f3c30]"
              >
                {s.value}
              </p>
              <p className="mt-1 text-base font-medium text-[#1f3c30]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        data-animate="section"
        data-why="section"
        className="relative overflow-hidden bg-[#023732] px-6 py-24 md:px-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,168,30,0.07),transparent_50%)]" />
        <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#F2A81E]/20 to-transparent lg:block" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p
              data-why="eyebrow"
              className="text-sm font-semibold uppercase tracking-[0.28em]"
              style={{ color: "#F2A81E" }}
            >
              Why Dawit Coffee
            </p>
            <h2
              data-why="title"
              className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl"
            >
              Built on Trust &amp; Traceability
            </h2>
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_240px_1fr] lg:gap-10">
            <div data-why="left" className="space-y-8 text-left">
              {whyLeftFeatures.map((feature) => (
                <article
                  key={feature.title}
                  data-why="item"
                  className="max-w-md lg:ml-auto lg:text-right"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold lg:ml-auto" style={{ border: "1px solid rgba(242,168,30,0.4)", background: "rgba(242,168,30,0.12)", color: "#F2A81E" }}>
                    0{whyLeftFeatures.indexOf(feature) + 1}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 md:text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>

            <div data-why="image-wrap" className="relative flex justify-center">
              <div className="absolute h-44 w-44 rounded-full blur-3xl md:h-52 md:w-52" style={{ background: "rgba(242,168,30,0.12)" }} />
              <div className="relative flex h-[220px] w-[220px] flex-col items-center justify-center rounded-full px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-[3px] md:h-[260px] md:w-[260px]" style={{ border: "1px solid rgba(242,168,30,0.25)", background: "radial-gradient(circle, rgba(242,168,30,0.1), rgba(2,55,50,0.5) 68%)" }}>
                <Image
                  src="/raw.png"
                  alt="Ethiopian Green Coffee Bean"
                  width={180}
                  height={180}
                  className="h-auto w-[135px] rounded-full object-cover drop-shadow-[0_18px_34px_rgba(0,0,0,0.35)] md:w-[170px]"
                />
                <div className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "#F2A81E" }}>
                  Ethiopian Origin
                </div>
              </div>
            </div>

            <div data-why="right" className="space-y-8 text-left">
              {whyRightFeatures.map((feature, index) => (
                <article key={feature.title} data-why="item" className="max-w-md">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold" style={{ border: "1px solid rgba(242,168,30,0.4)", background: "rgba(242,168,30,0.12)", color: "#F2A81E" }}>
                    0{index + 4}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 md:text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-animate="section" className="bg-[#023732] px-6 py-20 md:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#b7d7b9]">
              Global Reach
            </p>
            <h2 className="mt-2 text-4xl font-bold text-[#f5ece2]">
              Export Connections from Ethiopia
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-[#d7c8b7]">
              A quick view of some of our active trade routes from Ethiopia to international buyers.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#4e6a57] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <WorldConnections />
          </div>
        </div>
      </section>

      <section data-animate="section" className="bg-[#f2e3a8] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl p-10 shadow-[0_22px_60px_rgba(0,0,0,0.25)] md:p-14" style={{ background: "#023732", border: "1px solid rgba(242,168,30,0.25)" }}>
            <div className="grid items-center gap-8 md:grid-cols-[1.3fr_0.7fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: "#F2A81E" }}>
                  Start Your Order
                </p>
                <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                  Ready to Start Importing?
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-8 md:text-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Reach out to our team and we&apos;ll help you find the right lot,
                  arrange samples, and handle every step of the process.
                </p>
              </div>
              <div className="md:justify-self-end">
                <Link
                  href="/inquiries"
                  className="inline-block rounded-xl px-8 py-3 text-base font-semibold shadow-lg transition-opacity hover:opacity-90"
                  style={{ background: "#F2A81E", color: "#023732" }}
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
