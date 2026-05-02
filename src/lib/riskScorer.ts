import benchmarks from './benchmarks.json'
import type { ClauseType, ExtractedClause, RiskLevel, ScoredClause, Verdict } from '@/types'

type NumericBenchmark = {
  max: number
  source: string
  warning_above?: number
}

type BenchmarkMap = Partial<Record<ClauseType, NumericBenchmark | { source: string }>>

const benchmarkMap = benchmarks as BenchmarkMap

export function scoreClause(clause: ExtractedClause): ScoredClause {
  const benchmark = benchmarkMap[clause.clause_type]

  if (clause.clause_type === 'insurance_bundling') {
    return {
      ...clause,
      risk_level: 'CRITICAL',
      benchmark_max: null,
      benchmark_source: benchmark?.source ?? 'IRDAI Circular 2021 - Prohibition on bundling',
      is_above_benchmark: true
    }
  }

  if (!benchmark || !('max' in benchmark) || clause.extracted_value === null) {
    return {
      ...clause,
      risk_level: clause.clause_type === 'variable_rate' ? 'MEDIUM' : 'LOW',
      benchmark_max: null,
      benchmark_source: benchmark?.source ?? null,
      is_above_benchmark: false
    }
  }

  const val = clause.extracted_value
  const max = benchmark.max
  const warningAbove = benchmark.warning_above || max

  let risk_level: RiskLevel = 'LOW'
  if (val > max * 1.5) risk_level = 'CRITICAL'
  else if (val > max) risk_level = 'HIGH'
  else if (val > warningAbove * 0.8) risk_level = 'MEDIUM'

  return {
    ...clause,
    risk_level,
    benchmark_max: max,
    benchmark_source: benchmark.source,
    is_above_benchmark: val > max
  }
}

export function scoreClauses(clauses: ExtractedClause[]): ScoredClause[] {
  return clauses.map(scoreClause)
}

export function computeVerdict(clauses: ScoredClause[]): { verdict: 'SAFE' | 'REVIEW' | 'RISKY'; overall_risk: RiskLevel } {
  const critical = clauses.filter((c) => c.risk_level === 'CRITICAL').length
  const high = clauses.filter((c) => c.risk_level === 'HIGH').length

  if (critical >= 1) return { verdict: 'RISKY', overall_risk: 'CRITICAL' }
  if (high >= 2) return { verdict: 'REVIEW', overall_risk: 'HIGH' }
  if (high >= 1) return { verdict: 'REVIEW', overall_risk: 'MEDIUM' }
  return { verdict: 'SAFE', overall_risk: 'LOW' }
}
