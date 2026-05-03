"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { VerdictBanner } from "@/components/VerdictBanner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FilterByRisk, DocumentInfo } from "@/components/Sidebar";
import { ClauseCard } from "@/components/ClauseCard";
import { SuspiciousWarning } from "@/components/SuspiciousWarning";
import { WhatThisMeans } from "@/components/WhatThisMeans";
import { ResultsFooter } from "@/components/ResultsFooter";
import { Chatbot } from "@/components/Chatbot";
import { useLanguage } from "@/hooks/useLanguage";
import { useRiskFilter } from "@/hooks/useRiskFilter";
import { RiskCardData, Language, LANGUAGE_LABELS } from "@/types";

export default function AnalyzePage() {
  const router = useRouter();
  const [data, setData] = useState<RiskCardData | null>(null);
  const [translating, setTranslating] = useState(false);
  const { language, switchLanguage, transitioning } = useLanguage("EN");

  useEffect(() => {
    const stored = sessionStorage.getItem("finsaathi-risk-card");
    if (!stored) {
      router.push("/");
      return;
    }
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(JSON.parse(stored));
    } catch {
      router.push("/");
    }
  }, [router]);

  const { activeFilters, toggle, selectAll, clearAll, filtered, counts } = useRiskFilter(
    data?.clauses || []
  );

  const handleLanguageChange = async (newLang: Language) => {
    switchLanguage(newLang);

    // EN and HI are already available from the API response
    if (!data || newLang === "EN" || newLang === "HI") return;

    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riskCard: data,
          language: LANGUAGE_LABELS[newLang],
        }),
      });
      if (res.ok) {
        const translatedData: RiskCardData = await res.json();
        setData(translatedData);
        sessionStorage.setItem("finsaathi-risk-card", JSON.stringify(translatedData));
      }
    } catch (e) {
      console.error("Translation failed", e);
    } finally {
      setTranslating(false);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-navy">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-navy-light/60 bg-navy/90 backdrop-blur-md">
        <div className="max-w-analyze mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate hover:text-off-white text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Inline SVG logo lockup — matches Navbar */}
            <div className="flex items-center gap-[6px]">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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
              <span className="font-bold text-[15px] text-white tracking-[-0.02em]">
                FinSaathi
              </span>
            </div>
            <span className="text-slate text-sm hidden sm:block">/ {data.document_type}</span>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {translating && (
              <Loader2 className="w-4 h-4 text-amber animate-spin" />
            )}
            <LanguageToggle current={language} onChange={handleLanguageChange} />
          </div>
        </div>
      </div>

      {/* Page layout */}
      <div className="max-w-analyze mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              <FilterByRisk
                counts={counts}
                activeFilters={activeFilters}
                onToggle={toggle}
                onSelectAll={selectAll}
                onClearAll={clearAll}
              />
              <DocumentInfo data={data} />

              {/* Help card */}
              <div className="bg-amber/5 border border-amber/20 rounded-card p-4">
                <p className="text-amber text-xs font-semibold mb-1">Need help?</p>
                <p className="text-slate text-xs leading-relaxed">
                  Use the chat button below to ask questions about any clause in plain language.
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <VerdictBanner data={data} language={language} />

            {data.suspicious && (
              <SuspiciousWarning flags={data.suspicious_flags || []} />
            )}

            <WhatThisMeans documentType={data.document_type} language={language} />

            {/* Clause list header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl text-off-white">
                Clause Analysis
              </h2>
              <p className="text-slate text-xs">
                {filtered.length} clause{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-navy-mid rounded-card border border-navy-light">
                <p className="text-slate text-sm">
                  No clauses match your current filters.
                </p>
                <button
                  onClick={selectAll}
                  className="mt-3 text-amber text-xs hover:underline"
                >
                  Show all
                </button>
              </div>
            )}

            {/* Clause cards */}
            <div
              className={`space-y-4 transition-opacity duration-200 ${
                transitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {filtered.map((clause, i) => (
                <ClauseCard
                  key={`${clause.clause_type}-${i}`}
                  clause={clause}
                  language={language}
                  index={i}
                />
              ))}
            </div>

            <ResultsFooter />
          </main>
        </div>
      </div>

      <Chatbot data={data} />
    </div>
  );
}
