import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/site-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dawit Demissie Telila, Coffee Export Company",
  description:
    "Dawit Demissie Telila, exporting the finest Ethiopian specialty coffees to the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var o=window.fetch;window.fetch=function(){var u=typeof arguments[0]==='string'?arguments[0]:(arguments[0]&&arguments[0].url)||'';if(u.indexOf('__next')!==-1&&u.indexOf('.txt')!==-1){return Promise.resolve(new Response('',{status:200,headers:{'content-type':'text/plain'}}));}return o.apply(this,arguments);};})();` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
