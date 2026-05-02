import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null

export function getGeminiFlash() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey)
  }

  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
}
