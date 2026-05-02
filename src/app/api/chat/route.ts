import { getGeminiFlash } from '@/lib/gemini'
import type { NextRequest } from 'next/server'
import type { RiskCardData, SupportedLanguage } from '@/types'

type ChatHistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

// Offline fallback responses when Gemini is unavailable
function getOfflineResponse(message: string, riskCard?: RiskCardData): string {
  const lowerMsg = message.toLowerCase()

  if (!riskCard || !riskCard.clauses) {
    return 'Please upload a document first, and I can help you understand the clauses and risks.'
  }

  const criticalClauses = riskCard.clauses.filter(c => c.risk_level === 'CRITICAL')
  const highClauses = riskCard.clauses.filter(c => c.risk_level === 'HIGH')

  if (lowerMsg.includes('risky') || lowerMsg.includes('dangerous') || lowerMsg.includes('worst') || lowerMsg.includes('critical')) {
    if (criticalClauses.length > 0) {
      const c = criticalClauses[0]
      return `The most critical clause is "${c.clause_type}". ${c.plain_english}${c.negotiation_tip ? ` 💡 Tip: ${c.negotiation_tip}` : ''}`
    }
    return 'No critical-risk clauses were found in your document.'
  }

  if (lowerMsg.includes('safe') || lowerMsg.includes('sign') || lowerMsg.includes('ok')) {
    if (riskCard.verdict === 'SAFE') {
      return `This document appears safe to sign. ${riskCard.verdict_reason_english}`
    } else if (riskCard.verdict === 'RISKY') {
      return `⚠️ We recommend NOT signing this document without changes. ${riskCard.verdict_reason_english}`
    } else {
      return `This document needs careful review. ${riskCard.verdict_reason_english}`
    }
  }

  if (lowerMsg.includes('interest') || lowerMsg.includes('rate')) {
    const interestClause = riskCard.clauses.find(c => c.clause_type.toLowerCase().includes('interest'))
    if (interestClause) {
      return `${interestClause.plain_english}${interestClause.negotiation_tip ? ` 💡 ${interestClause.negotiation_tip}` : ''}`
    }
  }

  if (lowerMsg.includes('penalty') || lowerMsg.includes('prepay') || lowerMsg.includes('foreclosure')) {
    const penaltyClause = riskCard.clauses.find(c =>
      c.clause_type.toLowerCase().includes('penalty') ||
      c.clause_type.toLowerCase().includes('prepay') ||
      c.clause_type.toLowerCase().includes('foreclosure')
    )
    if (penaltyClause) {
      return `${penaltyClause.plain_english}${penaltyClause.negotiation_tip ? ` 💡 ${penaltyClause.negotiation_tip}` : ''}`
    }
  }

  if (lowerMsg.includes('negotiate') || lowerMsg.includes('ask')) {
    const tips = riskCard.clauses
      .filter(c => c.negotiation_tip)
      .map(c => `• ${c.clause_type}: ${c.negotiation_tip}`)
      .slice(0, 3)
    if (tips.length > 0) {
      return `Here are key negotiation points:\n${tips.join('\n')}`
    }
  }

  if (lowerMsg.includes('insurance') || lowerMsg.includes('bundl')) {
    const insuranceClause = riskCard.clauses.find(c => c.clause_type.toLowerCase().includes('insurance'))
    if (insuranceClause) {
      return `${insuranceClause.plain_english}${insuranceClause.negotiation_tip ? ` 💡 ${insuranceClause.negotiation_tip}` : ''}`
    }
  }

  // Default: summary of findings
  return `Your document (${riskCard.document_type}) has ${riskCard.critical_count} critical and ${riskCard.high_count} high-risk clauses. The overall verdict is: ${riskCard.verdict}. ${riskCard.verdict_reason_english} Ask me about specific clauses like interest rate, penalties, or insurance.`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body.message as string
    const riskCard = body.riskCard as RiskCardData | undefined
    const documentText = (body.documentText as string) || ''
    const language = (body.language as SupportedLanguage) || 'en'
    const history = (body.history as ChatHistoryMessage[]) || []

    // Try Gemini first
    try {
      let context = '- No document has been uploaded yet.'
      if (riskCard && riskCard.clauses && Array.isArray(riskCard.clauses)) {
        context = `- Document type: ${riskCard.document_type}
- Verdict: ${riskCard.verdict}
- Critical flags: ${riskCard.critical_count}
- High flags: ${riskCard.high_count}
- Clauses: ${JSON.stringify(
          riskCard.clauses.map((clause) => ({
            type: clause.clause_type,
            risk: clause.risk_level,
            value: clause.extracted_value,
            explanation: clause.plain_english,
          }))
        )}`
      }

      const systemPrompt = `You are FinSaathi's legal assistant for Indian borrowers.

CONTEXT:
${context}

RULES:
1. Respond in: ${language}
2. No legal jargon without explanation
3. Cite clause types when referencing document
4. Keep responses under 4 sentences
5. If question needs legal advice, end with: <escalate/>

USER QUESTION: ${message}`

      const geminiHistory: Array<{ role: string; parts: Array<{ text: string }> }> = []
      for (const item of history) {
        const role = item.role === 'user' ? 'user' : 'model'
        if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === role) {
          continue
        }
        geminiHistory.push({ role, parts: [{ text: item.content }] })
      }

      const model = getGeminiFlash()
      const result = await model.generateContent({
        contents: [
          ...geminiHistory,
          { role: 'user', parts: [{ text: systemPrompt }] },
        ],
        generationConfig: { maxOutputTokens: 512, temperature: 0.3 },
      })

      const raw = result.response.text()
      const escalate = raw.includes('<escalate/>')
      const reply = raw.replace(/<escalate\/>/g, '').trim()

      return Response.json(
        { reply, escalate },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    } catch (geminiError) {
      // Gemini failed (quota/network) — use offline fallback
      console.error('Gemini chat failed, using fallback:', geminiError)
      const reply = getOfflineResponse(message, riskCard)
      return Response.json(
        { reply, escalate: false },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }
  } catch (err) {
    console.error('Chat API fatal error:', err)
    return Response.json(
      { reply: 'Something went wrong. Please try again.', escalate: false },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
