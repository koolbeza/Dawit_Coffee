"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/coffee forest.png"
        alt=""
        aria-hidden
        className="fixed inset-0 h-full w-full object-cover"
        style={{ zIndex: 0 }}
      />
      <div className="fixed inset-0 bg-black/75" style={{ zIndex: 1 }} />
      <div className="relative text-center" style={{ zIndex: 2 }}>
        <p className="text-7xl font-bold text-amber-400 mb-4">!</p>
        <h2 className="text-2xl font-semibold text-white mb-3">
          Something went wrong
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again or return home.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={reset}
            className="rounded-xl bg-amber-500 px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-white/25 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
