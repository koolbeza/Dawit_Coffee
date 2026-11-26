import Link from "next/link";

export default function NotFound() {
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
        <p
          className="font-bold leading-none mb-4"
          style={{ fontSize: "clamp(5rem,20vw,10rem)", color: "#C8920E" }}
        >
          404
        </p>
        <h2 className="text-2xl font-semibold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-white/60 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-green-500"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="rounded-xl border border-white/25 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}
