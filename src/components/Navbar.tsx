"use client";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-navy-light/60 bg-navy/90 backdrop-blur-md">
      <div className="max-w-landing mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image src="/logo.png" alt="FinSaathi Logo" width={180} height={50} className="object-contain" priority />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-slate text-sm font-medium hover:text-off-white transition-colors duration-200"
          >
            How It Works
          </Link>
          <Link
            href="#trust"
            className="text-slate text-sm font-medium hover:text-off-white transition-colors duration-200"
          >
            Trust & Privacy
          </Link>
          <Link
            href="/analyze"
            className="px-4 py-2 bg-amber text-navy text-sm font-semibold rounded-card hover:bg-amber-dim transition-colors duration-200"
          >
            Analyse Document
          </Link>
        </div>

        <Link
          href="/analyze"
          className="md:hidden px-4 py-2 bg-amber text-navy text-sm font-semibold rounded-card"
        >
          Analyse
        </Link>
      </div>
    </nav>
  );
}
