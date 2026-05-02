"use client";
import { BookOpen } from "lucide-react";
import type { Language } from "@/types";

interface WhatThisMeansProps {
  documentType: string;
  language: Language;
}

const EXPLANATIONS: Record<string, string> = {
  "Home Loan Agreement":
    "A home loan agreement legally binds you to repay borrowed funds over a defined tenure. Every clause affects your financial obligations. Clauses around interest rate, prepayment, and insurance directly impact your total repayment cost.",
};

export function WhatThisMeans({ documentType, language }: WhatThisMeansProps) {
  const explanation =
    EXPLANATIONS[documentType] ||
    "This document governs your financial obligations to the lender. Review each clause carefully—especially those flagged as high risk or critical—before signing.";

  return (
    <div className="mb-6 p-5 bg-navy-mid border border-navy-light rounded-card">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-amber" />
        <p className="text-xs text-amber uppercase tracking-widest font-semibold">
          What This Document Means
        </p>
      </div>
      <p
        className={`text-sm leading-relaxed text-slate-light ${
          language !== "EN" ? "font-vernacular" : ""
        }`}
      >
        {explanation}
      </p>
    </div>
  );
}
