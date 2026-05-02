import type { ClauseType, ExplainedClause, RiskCardData, ScoredClause, Verdict } from '@/types'
import { computeVerdict } from './riskScorer'

const clauseLabels: Record<ClauseType, string> = {
  processing_fee: 'Processing Fee',
  foreclosure_penalty: 'Foreclosure Penalty',
  penal_interest: 'Penal Interest',
  lock_in_period: 'Lock-in Period',
  auto_renewal: 'Auto-renewal Clause',
  arbitration_clause: 'Arbitration Clause',
  insurance_bundling: 'Insurance Bundling',
  variable_rate: 'Variable Rate Clause',
  cross_default: 'Cross-default Clause',
  lien_on_account: 'Lien on Account',
  unknown: 'Unknown Clause'
}

const fallbackCopy: Record<
  ClauseType,
  { english: string; hindi: string; tip: string | null }
> = {
  processing_fee: {
    english: 'You pay this fee before or during loan disbursal.',
    hindi: 'यह शुल्क loan मिलने से पहले या loan मिलते समय देना पड़ता है।',
    tip: 'Ask for a written fee waiver or a lower processing charge.'
  },
  foreclosure_penalty: {
    english: 'You may pay extra money if you close the loan early.',
    hindi: 'Loan जल्दी बंद करने पर आपको extra पैसा देना पड़ सकता है।',
    tip: 'Ask the lender to remove or cap early closure charges.'
  },
  penal_interest: {
    english: 'Late EMI payments can create extra charges quickly.',
    hindi: 'EMI देर होने पर extra charge जल्दी बढ़ सकता है।',
    tip: 'Ask for a clear cap and no compounding on late charges.'
  },
  lock_in_period: {
    english: 'You cannot exit or close the product freely during this period.',
    hindi: 'इस समय तक आप product को आसानी से बंद नहीं कर सकते।',
    tip: 'Ask for a shorter lock-in or a no-penalty exit option.'
  },
  auto_renewal: {
    english: 'This product may renew automatically unless you cancel it.',
    hindi: 'अगर आप cancel नहीं करेंगे, तो यह product अपने आप renew हो सकता है।',
    tip: 'Ask for renewal reminders and an easy cancellation process.'
  },
  arbitration_clause: {
    english: 'Disputes may be settled at a location chosen by the lender.',
    hindi: 'विवाद lender की चुनी हुई जगह पर सुलझाया जा सकता है।',
    tip: 'Ask for a neutral dispute location near your city.'
  },
  insurance_bundling: {
    english: 'The lender is making insurance compulsory with the loan.',
    hindi: 'Lender loan के साथ insurance लेना compulsory बना रहा है।',
    tip: 'Ask for written confirmation that insurance is optional.'
  },
  variable_rate: {
    english: 'Your interest rate can change later.',
    hindi: 'आपका ब्याज दर बाद में बदल सकता है।',
    tip: 'Ask how much notice you will get before any rate change.'
  },
  cross_default: {
    english: 'Missing payment on one loan may affect your other loans too.',
    hindi: 'एक loan की payment छूटने पर दूसरे loans पर भी असर पड़ सकता है।',
    tip: 'Ask to remove cross-default language from the agreement.'
  },
  lien_on_account: {
    english: 'The bank may freeze or use money from your account.',
    hindi: 'Bank आपके account का पैसा रोक या use कर सकता है।',
    tip: 'Ask when the lien can be used and how it will be released.'
  },
  unknown: {
    english: 'This clause needs a closer review before you sign.',
    hindi: 'Sign करने से पहले इस clause को ध्यान से review करना चाहिए।',
    tip: 'Ask the lender to explain this clause in writing.'
  }
}

export function getClauseLabel(type: ClauseType) {
  return clauseLabels[type] ?? 'Unknown Clause'
}

export function explainLocally(
  scoredClauses: ScoredClause[],
  documentType = 'Financial Document'
): RiskCardData {
  const { verdict, overall_risk } = computeVerdict(scoredClauses)
  const clauses: ExplainedClause[] = scoredClauses.map((clause) => {
    const copy = fallbackCopy[clause.clause_type] ?? fallbackCopy.unknown
    const lowRisk = clause.risk_level === 'LOW'

    return {
      ...clause,
      plain_english: copy.english,
      plain_hindi: copy.hindi,
      plain_vernacular: copy.hindi,
      negotiation_tip: lowRisk ? null : copy.tip
    }
  })

  return {
    document_type: documentType,
    overall_risk,
    verdict,
    verdict_reason_english: verdictReason(verdict, 'english'),
    verdict_reason_hindi: verdictReason(verdict, 'hindi'),
    clauses,
    critical_count: scoredClauses.filter((c) => c.risk_level === 'CRITICAL').length,
    high_count: scoredClauses.filter((c) => c.risk_level === 'HIGH').length,
    analyzed_at: new Date().toISOString()
  }
}

function verdictReason(verdict: Verdict, language: 'english' | 'hindi') {
  if (language === 'hindi') {
    if (verdict === 'RISKY') {
      return 'इस document में गंभीर risk मिले हैं। Sign करने से पहले lender से बदलाव मांगें या legal सलाह लें।'
    }
    if (verdict === 'REVIEW') {
      return 'कुछ clauses आपके लिए नुकसानदेह हो सकते हैं। Negotiation tips को ध्यान से पढ़ें और lender से बात करें।'
    }
    return 'हमें कोई बड़ा risk नहीं मिला। आप इसे sign कर सकते हैं, लेकिन सभी clauses को एक बार पढ़ लें।'
  }

  if (verdict === 'RISKY') {
    return 'Critical risks detected. Do not sign without negotiating changes or seeking legal advice.'
  }
  if (verdict === 'REVIEW') {
    return 'Some clauses are risky or uncommon. Review the negotiation tips and clarify with the lender.'
  }
  return 'No major risks detected. It appears safe to sign, but please review all terms.'
}
