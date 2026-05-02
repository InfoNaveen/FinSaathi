"use client";
import { useState, useMemo } from "react";
import type { RiskLevel, ExplainedClause } from "@/types";

const ALL_LEVELS: RiskLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export function useRiskFilter(clauses: ExplainedClause[]) {
  const [activeFilters, setActiveFilters] = useState<RiskLevel[]>(ALL_LEVELS);

  const toggle = (level: RiskLevel) => {
    setActiveFilters((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const selectAll = () => setActiveFilters(ALL_LEVELS);
  const clearAll = () => setActiveFilters([]);

  const filtered = useMemo(
    () => clauses.filter((c) => activeFilters.includes(c.risk_level as RiskLevel)),
    [clauses, activeFilters]
  );

  const counts = useMemo(() => {
    return ALL_LEVELS.reduce((acc, level) => {
      acc[level] = clauses.filter((c) => c.risk_level === level).length;
      return acc;
    }, {} as Record<RiskLevel, number>);
  }, [clauses]);

  return { activeFilters, toggle, selectAll, clearAll, filtered, counts };
}
