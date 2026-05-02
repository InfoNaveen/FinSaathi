import type { ClauseType, ExtractedClause } from '@/types'

const PATTERNS: { type: ClauseType; regex: RegExp; unit: string }[] = [
  { type: 'processing_fee',      regex: /processing\s*fee[^%\d]*(\d+(\.\d+)?)\s*%/i,          unit: 'percent' },
  { type: 'foreclosure_penalty', regex: /foreclosure[^%\d]*(\d+(\.\d+)?)\s*%/i,               unit: 'percent' },
  { type: 'penal_interest',      regex: /penal\s*(interest|charge)[^%\d]*(\d+(\.\d+)?)\s*%/i, unit: 'percent_per_month' },
  { type: 'lock_in_period',      regex: /lock[- ]in[^0-9]*(\d+)\s*(month|year)/i,             unit: 'months' },
  { type: 'insurance_bundling',  regex: /(mandatory|compulsory|required)\s*insurance/i,       unit: 'boolean' },
  { type: 'auto_renewal',        regex: /auto[- ]renew/i,                                     unit: 'boolean' },
  { type: 'arbitration_clause',  regex: /arbitration/i,                                       unit: 'boolean' },
]

export function fallbackScan(text: string): ExtractedClause[] {
  const results: ExtractedClause[] = []

  for (const { type, regex, unit } of PATTERNS) {
    const match = text.match(regex)
    if (match) {
      const numeric = match[0].match(/(\d+(\.\d+)?)/)
      results.push({
        clause_type: type,
        raw_text: match[0].slice(0, 200),
        extracted_value: unit === 'boolean' ? 1 : parseFloat(numeric?.[1] ?? '0'),
        extracted_unit: unit,
        page_reference: null,
      })
    }
  }

  return results
}
