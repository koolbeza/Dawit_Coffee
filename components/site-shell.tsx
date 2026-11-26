"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";
import WhatsAppButton from "./whatsapp-button";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-[68px]">{children}</main>
      <div className="relative" style={{ zIndex: 10 }}>
        <Footer />
      </div>
      <WhatsAppButton />
    </>
  );
}
