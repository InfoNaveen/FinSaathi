import { getGeminiFlash } from '@/lib/gemini'
import type { NextRequest } from 'next/server'
import type { RiskCardData, SupportedLanguage } from '@/types'

type ChatHistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  const {
    message,
    riskCard,
    documentText,
    language,
    history,
  } = (await req.json()) as {
    message: string
    riskCard: RiskCardData
    documentText: string
    language: SupportedLanguage
    history: ChatHistoryMessage[]
  }

  const system = `
You are FinSaathi's legal assistant - a knowledgeable, warm, plain-spoken guide for Indian borrowers.

CONTEXT:
- Document text (first 6000 chars): ${documentText}
- Risk Card verdict: ${riskCard.verdict}
- Critical flags: ${riskCard.critical_count}
- High flags: ${riskCard.high_count}
- Flagged clauses: ${JSON.stringify(
    riskCard.clauses.map((clause) => ({
      type: clause.clause_type,
      risk: clause.risk_level,
      value: clause.extracted_value,
    }))
  )}

RULES:
1. Respond in this language: ${language}
2. Never use legal jargon without explaining it immediately
3. Cite specific clause types when referencing the document
4. When something violates an RBI rule, name the circular
5. Never tell the user what to do - give information to decide
6. Keep responses under 4 sentences unless question is complex
7. Never claim to be a licensed legal professional
8. If the question requires jurisdiction-specific legal advice, end with: <escalate/>

DO NOT: give specific legal advice, guarantee legal outcomes, recommend specific lawyers by name.
`

  const conversationHistory = history.map((item) => ({
    role: item.role === 'user' ? 'user' : 'model',
    parts: [{ text: item.content }],
  }))

  try {
    const model = getGeminiFlash()
    const result = await model.generateContent({
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: `${system}\n\nUSER QUESTION: ${message}` }] },
      ],
      generationConfig: { maxOutputTokens: 512, temperature: 0.3 },
    })

    const raw = result.response.text()
    const escalate = raw.includes('<escalate/>')
    const reply = raw.replace(/<escalate\/>/g, '').trim()

    return Response.json({ reply, escalate }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return Response.json({ reply: 'Analysis service temporarily unavailable.', escalate: false }, { status: 500 })
  }
}
