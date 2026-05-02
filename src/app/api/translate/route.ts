import { NextResponse } from 'next/server'
import { getGeminiFlash } from '@/lib/gemini'
import { parseJsonFromModel } from '@/lib/json'
import type { RiskCardData } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

type TranslationResponse = {
  verdict_reason_vernacular: string
  clauses: Array<{
    clause_type: string
    plain_vernacular: string
  }>
}

export async function POST(request: Request) {
  try {
    const { riskCard, language } = (await request.json()) as {
      riskCard: RiskCardData
      language: string
    }

    const prompt = `Translate the following financial document explanations into the Indian language: ${language.toUpperCase()}.
    
Respond strictly in JSON format matching this structure:
{
  "verdict_reason_vernacular": "translated verdict reason",
  "clauses": [
    {
      "clause_type": "exact clause_type from input",
      "plain_vernacular": "translated plain_english"
    }
  ]
}

DOCUMENT EXPLANATIONS:
Verdict Reason: ${riskCard.verdict_reason_english}
Clauses:
${riskCard.clauses.map(c => `- ${c.clause_type}: ${c.plain_english}`).join('\n')}
`

    const model = getGeminiFlash()
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 },
    })

    const translated = parseJsonFromModel<TranslationResponse>(result.response.text())
    
    // Merge into risk card
    const updatedCard = { ...riskCard }
    updatedCard.verdict_reason_vernacular = translated.verdict_reason_vernacular
    
    updatedCard.clauses = updatedCard.clauses.map((clause) => {
      const trans = translated.clauses.find(c => c.clause_type === clause.clause_type)
      if (trans) {
        return { ...clause, plain_vernacular: trans.plain_vernacular }
      }
      return clause
    })

    return NextResponse.json(updatedCard)
  } catch (err) {
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}
