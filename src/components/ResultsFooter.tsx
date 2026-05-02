"use client";
import { AlertCircle, Download, RotateCcw } from "lucide-react";
import Link from "next/link";

export function ResultsFooter() {
  return (
    <div className="mt-10 pt-6 border-t border-navy-light">
      <div className="flex items-start gap-2 p-4 bg-navy-mid rounded-card border border-navy-light mb-6">
        <AlertCircle className="w-4 h-4 text-slate shrink-0 mt-0.5" />
        <p className="text-slate text-xs leading-relaxed">
          <span className="text-off-white font-semibold">Disclaimer:</span> FinSaathi is an AI tool
          for informational purposes only. It does not constitute legal, financial, or regulatory
          advice. Always consult a qualified professional before signing financial agreements.
          Analysis accuracy depends on document quality and completeness.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy-mid border border-navy-light rounded-card text-sm text-off-white hover:border-amber/40 transition-colors duration-200"
        >
          <Download className="w-4 h-4 text-amber" />
          Download Report
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 bg-navy-mid border border-navy-light rounded-card text-sm text-off-white hover:border-amber/40 transition-colors duration-200"
        >
          <RotateCcw className="w-4 h-4 text-slate" />
          Analyse Another Document
        </Link>
      </div>
    </div>
  );
}
