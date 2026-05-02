"use client";
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Lightbulb,
  FileText,
  TrendingUp,
  AlertOctagon,
} from "lucide-react";
import type { ExplainedClause, Language, RiskLevel } from "@/types";
import { RISK_COLOR } from "@/types";
import { useSpeech } from "@/hooks/useSpeech";

interface ClauseCardProps {
  clause: ExplainedClause;
  language: Language;
  index: number;
}

const RISK_LABELS: Record<RiskLevel, string> = {
  CRITICAL: "Critical",
  HIGH: "High Risk",
  MEDIUM: "Medium",
  LOW: "Low Risk",
};

const RISK_BADGE_STYLE: Record<RiskLevel, string> = {
  CRITICAL: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
  HIGH: "bg-risk-high/15 text-risk-high border-risk-high/30",
  MEDIUM: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  LOW: "bg-risk-low/15 text-risk-low border-risk-low/30",
};

function BenchmarkBar({
  value,
  max,
  source,
  isAbove,
  unit,
}: {
  value: number;
  max: number;
  source: string;
  isAbove: boolean;
  unit: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const fillPct = Math.min((value / (max * 1.5)) * 100, 100);
  const benchmarkPct = Math.min((max / (max * 1.5)) * 100, 100);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.setProperty("--target-width", `${fillPct}%`);
    }
  }, [fillPct]);

  return (
    <div className="mt-4 mb-2">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-slate">Benchmark comparison</span>
        <span className={`font-mono font-semibold ${isAbove ? "text-risk-high" : "text-risk-low"}`}>
          {value}{unit} {isAbove ? "▲" : "▼"} Max {max}{unit}
        </span>
      </div>
      <div className="relative h-2 bg-navy-light rounded-pill overflow-hidden">
        <div
          ref={barRef}
          className={`absolute top-0 left-0 h-full rounded-pill animate-benchmark ${
            isAbove ? "bg-risk-high" : "bg-risk-low"
          }`}
          style={{ "--target-width": `${fillPct}%` } as React.CSSProperties}
        />
        {/* benchmark marker */}
        <div
          className="absolute top-0 w-0.5 h-full bg-off-white/50"
          style={{ left: `${benchmarkPct}%` }}
        />
      </div>
      <p className="text-slate/60 text-xs mt-1.5">Source: {source}</p>
    </div>
  );
}

function getExplanation(clause: ExplainedClause, language: Language): string {
  if (language === "EN") return clause.plain_english;
  if (language === "HI") return clause.plain_hindi;
  return clause.plain_vernacular || clause.plain_hindi || clause.plain_english;
}

export function ClauseCard({ clause, language, index }: ClauseCardProps) {
  const [rawExpanded, setRawExpanded] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const { speak, stopSpeaking, isSpeaking } = useSpeech();

  // Always derive displayedText from current props — no stale state
  const displayedText = getExplanation(clause, language);

  const risk = clause.risk_level as RiskLevel;
  const borderColor = RISK_COLOR[risk];
  const showNegotiation = risk === "HIGH" || risk === "CRITICAL";

  // Brief opacity flash on language change
  useEffect(() => {
    setTransitioning(true);
    const t = setTimeout(() => setTransitioning(false), 200);
    return () => clearTimeout(t);
  }, [language]);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const text = getExplanation(clause, language);
      speak(text);
    }
  };

  return (
    <div
      className="clause-card bg-navy-mid rounded-card border border-navy-light/60 overflow-hidden animate-fade-in-up opacity-0"
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: borderColor,
        animationFillMode: "forwards",
        animationDelay: `${index * 0.07}s`,
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 shrink-0">
            {risk === "CRITICAL" ? (
              <AlertOctagon className="w-4 h-4 text-risk-critical" />
            ) : (
              <TrendingUp className="w-4 h-4 text-slate" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-off-white font-semibold text-sm leading-tight">{clause.clause_type}</p>
            {clause.page_reference && (
              <p className="text-slate/60 text-xs mt-0.5 font-mono">{clause.page_reference}</p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-pill border ${RISK_BADGE_STYLE[risk]}`}
        >
          {RISK_LABELS[risk]}
        </span>
      </div>

      {/* Benchmark bar */}
      {clause.extracted_value !== null && clause.benchmark_max !== null && (
        <div className="px-5 pb-1">
          <BenchmarkBar
            value={clause.extracted_value}
            max={clause.benchmark_max}
            source={clause.benchmark_source || ""}
            isAbove={clause.is_above_benchmark}
            unit={clause.extracted_unit ? ` ${clause.extracted_unit}` : ""}
          />
        </div>
      )}

      {/* Explanation */}
      <div className="px-5 pb-4">
        <div
          className={`text-sm leading-relaxed transition-opacity duration-200 ${
            transitioning ? "opacity-0" : "opacity-100"
          } ${language !== "EN" ? "font-vernacular" : ""} text-slate-light`}
        >
          {displayedText}
        </div>
      </div>

      {/* Negotiation tip */}
      {showNegotiation && clause.negotiation_tip && (
        <div className="mx-5 mb-4 p-3 bg-amber/5 border border-amber/20 rounded-card">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber shrink-0 mt-0.5" />
            <div>
              <p className="text-amber text-xs font-semibold uppercase tracking-wide mb-1">
                Negotiation Tip
              </p>
              <p className="text-off-white/80 text-xs leading-relaxed">{clause.negotiation_tip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="px-5 pb-4 flex items-center gap-3">
        <button
          onClick={() => setRawExpanded(!rawExpanded)}
          className="flex items-center gap-1.5 text-xs text-slate hover:text-off-white transition-colors duration-200"
        >
          <FileText className="w-3.5 h-3.5" />
          {rawExpanded ? "Hide" : "View"} original text
          {rawExpanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>

        <button
          onClick={handleSpeak}
          className={`ml-auto flex items-center gap-1.5 text-xs transition-colors duration-200 ${
            isSpeaking ? "text-amber" : "text-slate hover:text-off-white"
          }`}
          aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
        >
          {isSpeaking ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
          {isSpeaking ? "Stop" : "Read aloud"}
        </button>
      </div>

      {/* Raw text expandable */}
      {rawExpanded && (
        <div className="mx-5 mb-4 p-3 bg-navy rounded-card border border-navy-light/60 animate-fade-in-up">
          <p className="text-slate/60 text-xs uppercase tracking-wide font-medium mb-2">
            Original clause text
          </p>
          <p className="text-slate text-xs font-mono leading-relaxed whitespace-pre-wrap">
            {clause.raw_text}
          </p>
        </div>
      )}
    </div>
  );
}
