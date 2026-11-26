"use client";
import { useEffect } from "react";

export default function SuppressRscErrors() {
  useEffect(() => {
    const orig = window.fetch;
    window.fetch = function (...args: Parameters<typeof fetch>) {
      const url = typeof args[0] === "string" ? args[0] : (args[0] as Request).url ?? "";
      if (url.includes("__next") && url.includes(".txt")) {
        return orig(...args).catch(() => new Response("", { status: 200 }));
      }
      return orig(...args);
    };
    return () => { window.fetch = orig; };
  }, []);
  return null;
}
