import { NextResponse } from 'next/server'
import { getGeminiFlash } from '@/lib/gemini'
import { parseJsonFromModel } from '@/lib/json'
import { explainLocally } from '@/lib/localExplanations'
import { buildExplanationPrompt } from '@/lib/prompts'
import { computeVerdict, scoreClauses } from '@/lib/riskScorer'
import type { ExtractedClause, ExplainedClause, RiskCardData, SupportedLanguage } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

type ExplanationResponse = {
  document_type: string
  verdict_reason_english: string
  verdict_reason_hindi: string
  verdict_reason_vernacular?: string
  clauses: Array<{
    clause_type: string
    plain_english: string
    plain_hindi?: string
    plain_vernacular?: string
    negotiation_tip: string | null
  }>
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      clauses?: ExtractedClause[]
      document_type?: string
      language?: SupportedLanguage
      suspicious?: boolean
      suspicious_flags?: string[]
      fallback?: boolean
    }
    const extractedClauses = body.clauses ?? []
    const language = body.language ?? 'hi'

    if (!Array.isArray(extractedClauses)) {
      return NextResponse.json({ error: 'Clauses must be an array.' }, { status: 400 })
    }

    const scoredClauses = scoreClauses(extractedClauses)
    const { verdict, overall_risk } = computeVerdict(scoredClauses)

    let card: RiskCardData

    try {
      const model = getGeminiFlash()
      const result = await model.generateContent(buildExplanationPrompt(scoredClauses, language))
      const modelJson = parseJsonFromModel<ExplanationResponse>(result.response.text())

      const explainedClauses: ExplainedClause[] = scoredClauses.map((clause, index) => {
        const explanation =
          modelJson.clauses.find((item) => item.clause_type === clause.clause_type) ??
          modelJson.clauses[index]

        const plainEnglish = explanation?.plain_english ?? 'Review this clause carefully before signing.'
        const plainHindi = explanation?.plain_hindi ?? 'Sign karne se pehle is clause ko dhyan se review karein.'
        const plainVernacular =
          language === 'en'
            ? plainEnglish
            : explanation?.plain_vernacular && explanation.plain_vernacular !== explanation.plain_hindi
            ? explanation.plain_vernacular
            : explanation?.plain_hindi
            ?? plainEnglish

        return {
          ...clause,
          plain_english: plainEnglish,
          plain_hindi: plainHindi,
          plain_vernacular: plainVernacular,
          negotiation_tip:
            clause.risk_level === 'LOW'
              ? null
              : explanation?.negotiation_tip ?? 'Ask the lender for a written clarification or waiver.'
        }
      })

      card = {
        document_type: modelJson.document_type || body.document_type || 'Financial Document',
        overall_risk,
        verdict,
        verdict_reason_english: modelJson.verdict_reason_english,
        verdict_reason_hindi: modelJson.verdict_reason_hindi,
        verdict_reason_vernacular: modelJson.verdict_reason_vernacular ?? modelJson.verdict_reason_hindi,
        clauses: explainedClauses,
        critical_count: scoredClauses.filter((c) => c.risk_level === 'CRITICAL').length,
        high_count: scoredClauses.filter((c) => c.risk_level === 'HIGH').length,
        analyzed_at: new Date().toISOString(),
        suspicious: body.suspicious,
        suspicious_flags: body.suspicious_flags,
        fallback: body.fallback
      }
    } catch {
      card = explainLocally(scoredClauses, body.document_type, language)
      card.suspicious = body.suspicious
      card.suspicious_flags = body.suspicious_flags
      card.fallback = body.fallback
    }

    return NextResponse.json(card)
  } catch {
    return NextResponse.json(
      { error: 'Unable to generate the Risk Card. Please try again.' },
      { status: 500 }
    )
  }
}
