import { NextResponse } from 'next/server'
import { fallbackScan } from '@/lib/fallbackScanner'
import { getGeminiFlash } from '@/lib/gemini'
import { parseJsonFromModel } from '@/lib/json'
import { parsePdfText } from '@/lib/pdfParser'
import { buildExtractionPrompt } from '@/lib/prompts'
import type { ExtractedClause } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

function detectSuspiciousDocument(text: string): { suspicious: boolean; flags: string[] } {
  const flags: string[] = []

  if (!/(CIN|NBFC-[A-Z0-9]+|RBI\s*Reg|Registration\s*No)/i.test(text)) {
    flags.push('No RBI/CIN registration number found')
  }

  if (!/(stamp\s*duty|notari[sz]ed|notary|e-stamp)/i.test(text)) {
    flags.push('No stamp duty or notary reference')
  }

  if (!/(registered\s*office|corporate\s*office|head\s*office)/i.test(text)) {
    flags.push('No registered office address')
  }

  if (!/(signature|signed\s*by|borrower.*sign|authorized\s*signatory)/i.test(text)) {
    flags.push('No signature block found')
  }

  if (text.trim().length < 500) {
    flags.push('Document too short to be a real agreement')
  }

  const rateMatch = text.match(/(\d+(\.\d+)?)\s*%\s*(per\s*(annum|year|month)|p\.a\.|p\.m\.)/gi)
  if (rateMatch) {
    const rates = rateMatch.map((r) => parseFloat(r))
    if (rates.some((r) => r > 60)) flags.push('Interest rate above 60% - possible predatory lending')
  }

  if (/(quick\s*loan|fast\s*cash|easy\s*money|instant\s*approval\s*guaranteed)/i.test(text)) {
    flags.push('Suspicious marketing language in agreement')
  }

  return { suspicious: flags.length >= 3, flags }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please upload a PDF file.' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported.' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File is too large. Maximum size is 10MB.' }, { status: 400 })
    }

    const documentText = await parsePdfText(file)
    const suspiciousResult = detectSuspiciousDocument(documentText)

    try {
      const model = getGeminiFlash()
      const result = await model.generateContent(buildExtractionPrompt(documentText))
      const responseText = result.response.text()
      const clauses = parseJsonFromModel<ExtractedClause[]>(responseText)

      return NextResponse.json({
        clauses,
        text_length: documentText.length,
        documentText: documentText.slice(0, 6000),
        suspicious: suspiciousResult.suspicious,
        suspicious_flags: suspiciousResult.flags,
        fallback: false
      })
    } catch {
      const clauses = fallbackScan(documentText)

      return NextResponse.json({
        clauses,
        text_length: documentText.length,
        documentText: documentText.slice(0, 6000),
        suspicious: suspiciousResult.suspicious,
        suspicious_flags: suspiciousResult.flags,
        fallback: true
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to analyze this PDF.'

    if (message === 'SCANNED_OR_EMPTY_PDF') {
      return NextResponse.json(
        { error: 'This appears to be a scanned document. Try uploading a text-based PDF.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ error: 'Unable to analyze this PDF. Please try another document.' }, { status: 500 })
  }
}
