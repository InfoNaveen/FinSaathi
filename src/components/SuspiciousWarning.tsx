"use client";
import { ShieldAlert } from "lucide-react";

interface SuspiciousWarningProps {
  flags: string[];
}

export function SuspiciousWarning({ flags }: SuspiciousWarningProps) {
  if (!flags.length) return null;

  return (
    <div className="bg-risk-critical/10 border border-risk-critical/30 rounded-card p-5 mb-6 animate-fade-in-up">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-risk-critical shrink-0 mt-0.5" />
        <div>
          <p className="text-risk-critical font-semibold text-sm mb-2">
            Suspicious Clauses Detected
          </p>
          <p className="text-off-white/70 text-xs mb-3">
            The following issues may indicate non-standard or potentially illegal terms. Consult a
            legal or financial advisor before signing.
          </p>
          <ul className="space-y-1.5">
            {flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-off-white/80">
                <span className="text-risk-critical mt-0.5">▸</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
