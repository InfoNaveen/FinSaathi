import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { UploadZone } from "@/components/UploadZone";
import { TrustFooter } from "@/components/TrustFooter";
import { Chatbot } from "@/components/Chatbot";
import {
  FileSearch,
  ScanLine,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Users,
} from "lucide-react";

const STATS = [
  { value: "12,400+", label: "Documents Analysed" },
  { value: "₹4.2Cr", label: "Saved in Hidden Charges" },
  { value: "97%", label: "Clause Detection Rate" },
  { value: "7", label: "Indian Languages" },
];

const HOW_IT_WORKS = [
  {
    icon: FileSearch,
    step: "01",
    title: "Upload Your Document",
    body: "PDF, scanned image, or photograph of any loan, insurance, or rental agreement.",
  },
  {
    icon: ScanLine,
    step: "02",
    title: "AI Clause Analysis",
    body: "Every clause is extracted, risk-scored against RBI guidelines, and benchmarked to market standards.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Plain Language Report",
    body: "Read your results in English, Hindi, or 5 other Indian languages. Know exactly what you are signing.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-navy">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-landing mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber/10 border border-amber/20 rounded-pill mb-6">
                <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                <span className="text-amber text-xs font-semibold uppercase tracking-wide">
                  AI-Powered Document Intelligence
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-6xl text-off-white leading-tight mb-6 text-balance">
                Know what you&apos;re
                <br />
                <span className="text-amber">signing</span> before
                <br />
                you sign it.
              </h1>

              <p className="text-slate text-lg leading-relaxed mb-8 max-w-lg">
                FinSaathi analyses home loans, credit agreements, and insurance policies in
                seconds—surfacing risky clauses, illegal terms, and hidden charges in plain
                language.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/analyze"
                  className="flex items-center gap-2 px-6 py-3 bg-amber text-navy font-semibold rounded-card hover:bg-amber-dim transition-colors duration-200"
                >
                  Analyse a Document
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-3 border border-navy-light text-off-white rounded-card hover:border-amber/40 transition-colors duration-200 text-sm"
                >
                  How It Works
                </a>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate">
                {["Home Loans", "Credit Cards", "Personal Loans", "Insurance Policies"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-navy-mid border border-navy-light rounded-pill"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Right — Upload */}
            <div>
              <UploadZone />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-navy-light/40 bg-navy-mid/30">
        <div className="max-w-landing mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl text-amber mb-1">{stat.value}</p>
                <p className="text-slate text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-landing mx-auto">
          <p className="text-center text-amber text-xs uppercase tracking-widest font-semibold mb-3">
            Process
          </p>
          <h2 className="font-display text-4xl text-off-white text-center mb-14">
            Analysis in three steps
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-navy-mid border border-navy-light rounded-card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-amber/40 text-sm font-bold">{step.step}</span>
                    <div className="w-10 h-10 bg-amber/10 rounded-card flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-display text-xl text-off-white mb-2">{step.title}</h3>
                  <p className="text-slate text-sm leading-relaxed">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-16 px-6 bg-navy-mid/20">
        <div className="max-w-landing mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-risk-medium/10 rounded-card flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-risk-medium" />
              </div>
              <div>
                <h3 className="text-off-white font-semibold text-sm mb-1">
                  RBI Benchmark Comparison
                </h3>
                <p className="text-slate text-xs leading-relaxed">
                  Every rate and fee is compared against current RBI guidelines and market averages,
                  with source citations.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber/10 rounded-card flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-amber" />
              </div>
              <div>
                <h3 className="text-off-white font-semibold text-sm mb-1">
                  7 Language Support
                </h3>
                <p className="text-slate text-xs leading-relaxed">
                  Explanations in English, Hindi, Kannada, Tamil, Telugu, Marathi, and Gujarati with
                  a single click.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-risk-low/10 rounded-card flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-risk-low" />
              </div>
              <div>
                <h3 className="text-off-white font-semibold text-sm mb-1">
                  Negotiation Intelligence
                </h3>
                <p className="text-slate text-xs leading-relaxed">
                  For every high-risk clause, receive specific, actionable negotiation tips backed by
                  regulatory precedent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustFooter />
      <Chatbot />
    </main>
  );
}
