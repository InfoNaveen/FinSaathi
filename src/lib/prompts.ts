import type { ScoredClause, SupportedLanguage } from '@/types'

export function buildExtractionPrompt(documentText: string) {
  return `You are a financial document analyst specializing in Indian lending and insurance regulations. 

Analyze the following financial document text and extract ALL clauses related to fees, penalties, restrictions, and obligations.

For each clause found, return a JSON object with these exact fields:
- clause_type: one of ["processing_fee", "foreclosure_penalty", "penal_interest", "lock_in_period", "auto_renewal", "arbitration_clause", "insurance_bundling", "variable_rate", "cross_default", "lien_on_account", "unknown"]
- raw_text: the exact text from the document (max 200 chars)
- extracted_value: numeric value if applicable (e.g., 2.5 for 2.5%), null otherwise
- extracted_unit: unit string like "percent", "percent_per_month", "months", null otherwise
- page_reference: page or section reference if visible, null otherwise

Return ONLY a valid JSON array. No markdown. No explanation. No backticks. Just the raw JSON array.

If no relevant clauses found, return empty array [].

DOCUMENT TEXT:
${documentText}`
}

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi using Devanagari script',
  kn: 'Kannada using Kannada script',
  ta: 'Tamil using Tamil script',
  te: 'Telugu using Telugu script',
  mr: 'Marathi using Devanagari script',
  gu: 'Gujarati using Gujarati script',
}

export function buildExplanationPrompt(scoredClauses: ScoredClause[], languageParam: SupportedLanguage = 'hi') {
  const targetLanguage = LANGUAGE_INSTRUCTIONS[languageParam] ?? LANGUAGE_INSTRUCTIONS['hi']

  return `CRITICAL LANGUAGE INSTRUCTION — THIS OVERRIDES EVERYTHING:
You MUST generate plain_vernacular in ${targetLanguage}.
Do NOT use English or Hindi for plain_vernacular unless the target IS English or Hindi.
Use the correct native script. Class 8 reading level vocabulary.
verdict_reason_vernacular MUST also be in ${targetLanguage}.

For plain_english: always English. For plain_hindi: always Hindi Devanagari.
For plain_vernacular: MUST be ${targetLanguage}.

You are a financial literacy expert explaining Indian loan documents to first-generation borrowers.

For each clause provide:
- plain_english: one sentence (max 30 words, no jargon)
- plain_hindi: same in Hindi Devanagari
- plain_vernacular: same in ${targetLanguage}
- negotiation_tip: actionable tip in ${targetLanguage} (null if LOW risk)

Also generate:
- document_type: "Personal Loan", "Home Loan", etc.
- verdict_reason_english: 2 sentences in English
- verdict_reason_hindi: same in Hindi Devanagari
- verdict_reason_vernacular: same in ${targetLanguage}

Return ONLY valid JSON:
{
  "document_type": "...",
  "verdict_reason_english": "...",
  "verdict_reason_hindi": "...",
  "verdict_reason_vernacular": "... in ${targetLanguage} ...",
  "clauses": [
    {
      "clause_type": "...",
      "plain_english": "...",
      "plain_hindi": "...",
      "plain_vernacular": "... in ${targetLanguage} ...",
      "negotiation_tip": "..."
    }
  ]
}

No markdown. No backticks. Raw JSON only.

CLAUSES DATA:
${JSON.stringify(scoredClauses, null, 2)}`
}
