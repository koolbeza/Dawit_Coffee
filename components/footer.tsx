import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#023732]">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-20">
        <div className="grid gap-8 rounded-3xl border border-[#8b6d5a] bg-[#023732] p-6 sm:p-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center">
              <Image
                src="/Horizontal golden@2x.png"
                alt="Dawit Demissie Telila Coffee Export Logo"
                width={180}
                height={60}
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-[#f0e7dd]">
              Exporting the finest Ethiopian specialty coffees to the world.
            </p>
          </div>

          {/* Navigate */}
          <div className="col-span-1">
            <p className="text-base font-semibold text-[#e4cfb6]">Navigate</p>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/products", label: "Products" },
                { href: "/gallery", label: "Gallery" },
                { href: "/certifications", label: "Certifications" },
                { href: "/inquiries", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[#ede2d7] transition-colors hover:text-[#fffaf4]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Origins */}
          <div className="col-span-1">
            <p className="text-base font-semibold text-[#e4cfb6]">Origins</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-[#ede2d7]">
              {[
                "Yirgacheffe","Sidamo","Guji","Harrar",
                "Kaffa","Jimma","Limu","Teppi",
                "Godere","Lekempti","Bale",
              ].map((origin) => (
                <li key={origin}>{origin}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <p className="text-base font-semibold text-[#e4cfb6]">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-[#ede2d7]">
              <li>Addis Ababa, Ethiopia</li>
              <li className="space-y-1">
                <a
                  href="mailto:dawitdemissie0@gmail.com"
                  className="block break-all hover:text-[#fffaf4] hover:underline"
                >
                  dawitdemissie0@gmail.com
                </a>
                <a
                  href="mailto:arcethiopia@yahoo.com"
                  className="block break-all hover:text-[#fffaf4] hover:underline"
                >
                  arcethiopia@yahoo.com
                </a>
              </li>
              <li className="space-y-1">
                <a
                  href="tel:+251911207323"
                  className="block hover:text-[#fffaf4] hover:underline"
                >
                  +251 911-207-323
                </a>
                <a
                  href="tel:+251911625032"
                  className="block hover:text-[#fffaf4] hover:underline"
                >
                  +251 911-625-032
                </a>
                <a
                  href="https://web.facebook.com/p/Dawit-Demissie-Telila-Coffee-Exporter-100063831459443/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[#fffaf4] hover:underline"
                >
                  Facebook Page
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-[#8b6d5a] pt-6 text-center text-sm text-[#e0cdb9]">
          <p>© {new Date().getFullYear()} Dawit Demissie Telila Coffee Export. All rights reserved.</p>
          <p className="mt-1">
            Powered by{" "}
            <a
              href="https://dataneutralanalysistechnology.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#fffaf4] hover:underline"
            >
              DNA-TECH
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
