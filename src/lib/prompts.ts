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

export function buildExplanationPrompt(scoredClauses: ScoredClause[], languageParam: SupportedLanguage = 'hi') {
  return `You are a financial literacy expert explaining Indian loan documents to first-generation borrowers with no financial background.

Provide a final verdict for the document as one of these strings EXACTLY:
"SAFE" (if no major risks are found)
"REVIEW" (if there are HIGH risks but no CRITICAL risks)
"RISKY" (if there are 1 or more CRITICAL risks)

Given these flagged clauses from a financial document, generate plain language explanations.

For each clause, provide:
- plain_english: one sentence explanation (max 30 words, no jargon, Class 8 level)
- plain_vernacular: same explanation in the target language below
- negotiation_tip: one actionable tip to negotiate or avoid this clause (null if LOW risk)

Generate plain_vernacular as the field name (replacing plain_hindi).
The target language is: ${languageParam} — use the full native script for that language.
If language is 'en', plain_vernacular = same as plain_english.
All languages must use Class 8 reading level vocabulary.

Also generate:
- document_type: what type of document this is ("Personal Loan", "Home Loan", "Credit Card Agreement", "Insurance Policy", etc.)
- verdict_reason_english: 2 sentences explaining the overall verdict
- verdict_reason_hindi: same in Hindi (Devanagari)

Return ONLY valid JSON with this structure:
{
  "document_type": "...",
  "verdict_reason_english": "...",
  "verdict_reason_hindi": "...",
  "clauses": [
    {
      "clause_type": "...",
      "plain_english": "...",
      "plain_vernacular": "...",
      "negotiation_tip": "..." or null
    }
  ]
}

No markdown. No backticks. Raw JSON only.

CLAUSES DATA:
${JSON.stringify(scoredClauses, null, 2)}`
}
