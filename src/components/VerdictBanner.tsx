"use client";
import { CheckCircle2, AlertTriangle, XCircle, Clock, Volume2, VolumeX } from "lucide-react";
import type { RiskCardData, Language } from "@/types";
import { useSpeech } from "@/hooks/useSpeech";

interface VerdictBannerProps {
  data: RiskCardData;
  language: Language;
}

const VERDICT_CONFIG = {
  SAFE: {
    icon: CheckCircle2,
    bg: "bg-risk-low/10",
    border: "border-risk-low/30",
    iconColor: "text-risk-low",
    label: "Safe to Proceed",
    labelColor: "text-risk-low",
  },
  REVIEW: {
    icon: AlertTriangle,
    bg: "bg-risk-high/10",
    border: "border-risk-high/30",
    iconColor: "text-risk-high",
    label: "Review Required",
    labelColor: "text-risk-high",
  },
  RISKY: {
    icon: XCircle,
    bg: "bg-risk-critical/10",
    border: "border-risk-critical/30",
    iconColor: "text-risk-critical",
    label: "Do Not Sign Yet",
    labelColor: "text-risk-critical",
  },
};

export function VerdictBanner({ data, language }: VerdictBannerProps) {
  const cfg = VERDICT_CONFIG[data.verdict];
  const Icon = cfg.icon;

  const reason =
    language === "EN"
      ? data.verdict_reason_english
      : language === "HI"
      ? data.verdict_reason_hindi
      : data.verdict_reason_vernacular || data.verdict_reason_english;

  const { speak, stopSpeaking, isSpeaking } = useSpeech();

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(`${cfg.label}. ${reason}`);
    }
  };

  const analyzedDate = new Date(data.analyzed_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`rounded-card border ${cfg.bg} ${cfg.border} p-6 mb-6 animate-fade-in-up`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <Icon className={`w-8 h-8 ${cfg.iconColor}`} strokeWidth={1.5} />
          <div>
            <p className="text-xs text-slate uppercase tracking-widest font-medium mb-0.5">
              FinSaathi Verdict
            </p>
            <p className={`font-display text-2xl ${cfg.labelColor}`}>{cfg.label}</p>
          </div>
        </div>

        <div className="sm:border-l sm:border-navy-light sm:pl-6 flex-1 flex items-start justify-between gap-4">
          <p
            className={`text-sm leading-relaxed ${
              language !== "EN" ? "font-vernacular" : ""
            } text-slate-light`}
          >
            {reason}
          </p>
          <button
            onClick={handleSpeak}
            className={`shrink-0 p-2 rounded-full transition-colors duration-200 ${
              isSpeaking ? "bg-amber/20 text-amber" : "bg-navy-light text-slate hover:text-off-white hover:bg-navy-light/80"
            }`}
            aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-navy-light/50 flex flex-wrap items-center gap-4 text-xs text-slate">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-risk-critical inline-block" />
          {data.critical_count} Critical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-risk-high inline-block" />
          {data.high_count} High Risk
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <Clock className="w-3 h-3" />
          Analysed {analyzedDate}
        </span>
      </div>
    </div>
  );
}
