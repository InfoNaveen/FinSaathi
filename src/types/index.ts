export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type Language = "EN" | "HI" | "KN" | "TA" | "TE" | "MR" | "GU";
export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr' | 'gu';

export type ClauseType =
  | 'processing_fee'
  | 'foreclosure_penalty'
  | 'penal_interest'
  | 'lock_in_period'
  | 'auto_renewal'
  | 'arbitration_clause'
  | 'insurance_bundling'
  | 'variable_rate'
  | 'cross_default'
  | 'lien_on_account'
  | 'unknown';

export type Verdict = "SAFE" | "REVIEW" | "RISKY";

export interface ExtractedClause {
  clause_type: ClauseType;
  raw_text: string;
  extracted_value: number | null;
  extracted_unit: string | null;
  page_reference: string | null;
}

export interface ScoredClause extends ExtractedClause {
  risk_level: RiskLevel;
  benchmark_max: number | null;
  benchmark_source: string | null;
  is_above_benchmark: boolean;
}

export interface ExplainedClause {
  clause_type: string;
  raw_text: string;
  extracted_value: number | null;
  extracted_unit: string | null;
  page_reference: string | null;
  risk_level: RiskLevel;
  benchmark_max: number | null;
  benchmark_source: string | null;
  is_above_benchmark: boolean;
  plain_english: string;
  plain_hindi: string;
  plain_vernacular: string;
  negotiation_tip: string | null;
}

export interface RiskCardData {
  document_type: string;
  overall_risk: RiskLevel;
  verdict: Verdict;
  verdict_reason_english: string;
  verdict_reason_hindi: string;
  verdict_reason_vernacular?: string;
  clauses: ExplainedClause[];
  critical_count: number;
  high_count: number;
  analyzed_at: string;
  suspicious?: boolean;
  suspicious_flags?: string[];
  fallback?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  escalated?: boolean;
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  EN: "English",
  HI: "हिंदी",
  KN: "ಕನ್ನಡ",
  TA: "தமிழ்",
  TE: "తెలుగు",
  MR: "मराठी",
  GU: "ગુજરાતી",
};

export const LANGUAGE_FONT: Record<Language, string> = {
  EN: "font-sans",
  HI: "font-vernacular",
  KN: "font-vernacular",
  TA: "font-vernacular",
  TE: "font-vernacular",
  MR: "font-vernacular",
  GU: "font-vernacular",
};

export const RISK_COLOR: Record<RiskLevel, string> = {
  CRITICAL: "#E03131",
  HIGH: "#D4730A",
  MEDIUM: "#2563EB",
  LOW: "#16A34A",
};

export const RISK_BG: Record<RiskLevel, string> = {
  CRITICAL: "bg-risk-critical",
  HIGH: "bg-risk-high",
  MEDIUM: "bg-risk-medium",
  LOW: "bg-risk-low",
};

export const RISK_BORDER: Record<RiskLevel, string> = {
  CRITICAL: "border-risk-critical",
  HIGH: "border-risk-high",
  MEDIUM: "border-risk-medium",
  LOW: "border-risk-low",
};

export const RISK_TEXT: Record<RiskLevel, string> = {
  CRITICAL: "text-risk-critical",
  HIGH: "text-risk-high",
  MEDIUM: "text-risk-medium",
  LOW: "text-risk-low",
};
