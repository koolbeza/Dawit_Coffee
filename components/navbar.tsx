"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/gallery", label: "Gallery" },
  { href: "/certifications", label: "Certifications" },
  { href: "/inquiries", label: "Contact Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 pb-2">
      <nav className="overflow-hidden rounded-2xl bg-[#023732] shadow-xl shadow-black/40 backdrop-blur-md border border-[#3d2510]/60">
        {/* Main bar */}
        <div className="flex items-center justify-between px-5 py-1">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <Image
              src="/logoicon%20golden@2x.png"
              alt="Dawit Demissie Telila Coffee Export Logo"
              width={160}
              height={64}
              className="h-16 w-auto object-contain drop-shadow-[0_2px_8px_rgba(201,169,110,0.5)]"
            />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-[#F2A81E]/20 text-[#F9EF6D] font-semibold border border-[#F2A81E] shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
                      : "text-[#e8d5b7] hover:bg-[#2d1a0e] hover:text-[#F2A81E]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              className="flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-[#2d1a0e] md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-5 bg-[#F2A81E] transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-[#F2A81E] transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-[#F2A81E] transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        <div className={`overflow-hidden border-t border-[#3d2510]/60 transition-all duration-300 md:hidden ${open ? "max-h-screen pb-3" : "max-h-0"}`}>
          <ul className="flex flex-col px-3 pt-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-[#F2A81E]/20 text-[#F9EF6D] font-semibold border border-[#F2A81E] shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
                      : "text-[#e8d5b7] hover:bg-[#2d1a0e] hover:text-[#F2A81E]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
