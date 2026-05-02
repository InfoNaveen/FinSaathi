"use client";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-[#0A1628] border-b border-[rgba(255,255,255,0.07)] flex items-center">
      <div className="w-full max-w-landing mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="no-underline">
          <div className="flex items-center gap-[8px]">
            {/* Icon mark */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path 
                d="M14 2L4 6.5V13C4 18.5 8.5 23.6 14 25.5C19.5 23.6 24 18.5 24 13V6.5L14 2Z" 
                fill="#F0A500" 
                opacity="0.15"
                stroke="#F0A500" 
                strokeWidth="1.5"
              />
              <path 
                d="M10 14L13 17L18 11" 
                stroke="#F0A500" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span className="font-['IBM_Plex_Sans',sans-serif] font-bold text-[18px] text-white tracking-[-0.02em]">
                FinSaathi
              </span>
              <span className="font-['IBM_Plex_Sans',sans-serif] font-medium text-[9px] text-[#F0A500] tracking-[0.18em] uppercase">
                Know · Verify · Protect
              </span>
            </div>
          </div>
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-[#8B9BB4] font-['IBM_Plex_Sans',sans-serif] text-[13px] font-medium no-underline transition-colors duration-150 hover:text-white"
          >
            How It Works
          </Link>
          <Link
            href="#trust"
            className="text-[#8B9BB4] font-['IBM_Plex_Sans',sans-serif] text-[13px] font-medium no-underline transition-colors duration-150 hover:text-white"
          >
            Trust & Privacy
          </Link>
          <Link
            href="/analyze"
            className="bg-[#F0A500] text-[#0A1628] font-['IBM_Plex_Sans',sans-serif] text-[13px] font-bold px-[18px] py-[8px] rounded-[5px] no-underline transition-colors duration-150 hover:bg-[#C47F00] shadow-none"
          >
            Analyse a Document
          </Link>
        </div>

        {/* MOBILE CTA */}
        <Link
          href="/analyze"
          className="md:hidden bg-[#F0A500] text-[#0A1628] font-['IBM_Plex_Sans',sans-serif] text-[13px] font-bold px-[18px] py-[8px] rounded-[5px] no-underline transition-colors duration-150 hover:bg-[#C47F00] shadow-none"
        >
          Analyse
        </Link>
      </div>
    </nav>
  );
}
