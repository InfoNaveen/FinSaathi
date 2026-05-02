"use client";
import type { Language } from "@/types";
import { LANGUAGE_LABELS } from "@/types";

interface LanguageToggleProps {
  current: Language;
  onChange: (lang: Language) => void;
}

const LANGUAGES = Object.entries(LANGUAGE_LABELS) as [Language, string][];

export function LanguageToggle({ current, onChange }: LanguageToggleProps) {
  return (
    <div className="flex flex-wrap gap-1.5 p-1 bg-navy-mid rounded-card border border-navy-light">
      {LANGUAGES.map(([code, label]) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded transition-all duration-200
            ${current === code
              ? "bg-amber text-navy font-semibold"
              : "text-slate hover:text-off-white hover:bg-navy-light"
            }
            ${code !== "EN" ? "font-vernacular" : ""}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
