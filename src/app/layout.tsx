import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vernacular",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinSaathi — AI Financial Document Analyser",
  description:
    "Upload any loan agreement or financial contract. FinSaathi identifies risky clauses, benchmarks them against RBI guidelines, and explains them in plain language.",
  keywords: "loan analysis, financial document review, RBI guidelines, India, legal AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${dmSerifDisplay.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${notoSans.variable} font-sans bg-navy text-off-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
