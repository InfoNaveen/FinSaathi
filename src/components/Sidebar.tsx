"use client";
import type { RiskLevel, RiskCardData } from "@/types";
import { RISK_COLOR, RISK_TEXT } from "@/types";
import { FileText, Calendar, AlertOctagon, TrendingUp, Info, CheckCircle } from "lucide-react";

interface FilterByRiskProps {
  counts: Record<RiskLevel, number>;
  activeFilters: RiskLevel[];
  onToggle: (level: RiskLevel) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const RISK_LEVELS: RiskLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const RISK_ICONS: Record<RiskLevel, typeof AlertOctagon> = {
  CRITICAL: AlertOctagon,
  HIGH: TrendingUp,
  MEDIUM: Info,
  LOW: CheckCircle,
};

export function FilterByRisk({
  counts,
  activeFilters,
  onToggle,
  onSelectAll,
  onClearAll,
}: FilterByRiskProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-navy-mid rounded-card border border-navy-light p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate uppercase tracking-widest font-medium">Filter by Risk</p>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onSelectAll}
            className="text-slate hover:text-amber transition-colors"
          >
            All
          </button>
          <span className="text-navy-light">·</span>
          <button
            onClick={onClearAll}
            className="text-slate hover:text-amber transition-colors"
          >
            None
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        {RISK_LEVELS.map((level) => {
          const Icon = RISK_ICONS[level];
          const active = activeFilters.includes(level);
          const color = RISK_COLOR[level];
          const textClass = RISK_TEXT[level];

          return (
            <button
              key={level}
              onClick={() => onToggle(level)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-card text-sm transition-all duration-200 ${
                active
                  ? "bg-navy-light border border-navy-light/80"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              <Icon
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: active ? color : "#8B9BB4" }}
              />
              <span
                className={`flex-1 text-left text-xs font-medium ${
                  active ? textClass : "text-slate"
                }`}
              >
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  active ? textClass : "text-slate"
                }`}
              >
                {counts[level]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-navy-light">
        <p className="text-xs text-slate text-center">
          Showing{" "}
          <span className="text-off-white font-semibold">
            {activeFilters.reduce((a, l) => a + counts[l], 0)}
          </span>{" "}
          of{" "}
          <span className="text-off-white font-semibold">{total}</span> clauses
        </p>
      </div>
    </div>
  );
}

interface DocumentInfoProps {
  data: RiskCardData;
}

export function DocumentInfo({ data }: DocumentInfoProps) {
  const riskColors: Record<string, string> = {
    CRITICAL: "text-risk-critical",
    HIGH: "text-risk-high",
    MEDIUM: "text-risk-medium",
    LOW: "text-risk-low",
  };

  return (
    <div className="bg-navy-mid rounded-card border border-navy-light p-4 space-y-3">
      <p className="text-xs text-slate uppercase tracking-widest font-medium">Document Info</p>

      <div className="space-y-2.5">
        <div className="flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-slate shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate/60">Type</p>
            <p className="text-off-white text-xs font-medium">{data.document_type}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <AlertOctagon className="w-3.5 h-3.5 text-slate shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate/60">Overall Risk</p>
            <p className={`text-xs font-bold ${riskColors[data.overall_risk] || "text-off-white"}`}>
              {data.overall_risk}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate/60">Analysed At</p>
            <p className="text-off-white text-xs font-mono">
              {new Date(data.analyzed_at).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
