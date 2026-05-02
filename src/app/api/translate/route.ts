import { NextResponse } from 'next/server'
import { getGeminiFlash } from '@/lib/gemini'
import { parseJsonFromModel } from '@/lib/json'
import type { RiskCardData } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

type TranslationResponse = {
  verdict_reason: string
  clauses: Array<{
    clause_type: string
    explanation: string
  }>
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const riskCard = body.riskCard as RiskCardData
    const language = body.language as string

    if (!riskCard || !riskCard.clauses || !Array.isArray(riskCard.clauses)) {
      return NextResponse.json({ error: 'Invalid risk card data' }, { status: 400 })
    }

    // Try Gemini translation first
    try {
      const clauseList = riskCard.clauses
        .map((c, i) => `${i + 1}. [${c.clause_type}]: ${c.plain_english}`)
        .join('\n')

      const prompt = `Translate ALL of the following financial document analysis into ${language}. Respond ONLY with valid JSON, no markdown.

VERDICT REASON:
${riskCard.verdict_reason_english}

CLAUSE EXPLANATIONS:
${clauseList}

JSON format:
{"verdict_reason":"translated verdict","clauses":[{"clause_type":"exact type","explanation":"translated text"}]}

Include ALL ${riskCard.clauses.length} clauses.`

      const model = getGeminiFlash()
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
      })

      const translated = parseJsonFromModel<TranslationResponse>(result.response.text())

      const updatedCard: RiskCardData = {
        ...riskCard,
        verdict_reason_vernacular: translated.verdict_reason,
        clauses: riskCard.clauses.map((clause) => {
          const trans = translated.clauses.find(c => c.clause_type === clause.clause_type)
          return {
            ...clause,
            plain_vernacular: trans?.explanation || clause.plain_english,
          }
        }),
      }

      return NextResponse.json(updatedCard)
    } catch (geminiError) {
      // Gemini failed (quota/network) — fall back to using existing vernacular or Hindi
      console.error('Translation API Gemini failed, using fallback:', geminiError)

      const updatedCard: RiskCardData = {
        ...riskCard,
        verdict_reason_vernacular: riskCard.verdict_reason_hindi || riskCard.verdict_reason_english,
        clauses: riskCard.clauses.map((clause) => ({
          ...clause,
          plain_vernacular: clause.plain_vernacular || clause.plain_hindi || clause.plain_english,
        })),
      }

      return NextResponse.json(updatedCard)
    }
  } catch (err) {
    console.error('Translation API fatal error:', err)
    return NextResponse.json(
      { error: 'Translation service temporarily unavailable.' },
      { status: 500 }
    )
  }
}
