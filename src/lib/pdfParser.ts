import pdfParse from 'pdf-parse'

const MAX_TEXT_CHARS = 30000

export async function parsePdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const data = await pdfParse(buffer)
  const text = data.text.replace(/\s+\n/g, '\n').trim()

  if (!text || text.length < 40) {
    throw new Error('SCANNED_OR_EMPTY_PDF')
  }

  return text.slice(0, MAX_TEXT_CHARS)
}
