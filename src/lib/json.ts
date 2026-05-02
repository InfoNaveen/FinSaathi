export function parseJsonFromModel<T>(text: string): T {
  const trimmed = text.trim()
  const withoutFence = trimmed
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim()

  try {
    return JSON.parse(withoutFence) as T
  } catch {
    const firstArray = withoutFence.indexOf('[')
    const lastArray = withoutFence.lastIndexOf(']')
    const firstObject = withoutFence.indexOf('{')
    const lastObject = withoutFence.lastIndexOf('}')

    if (firstArray !== -1 && lastArray > firstArray) {
      return JSON.parse(withoutFence.slice(firstArray, lastArray + 1)) as T
    }

    if (firstObject !== -1 && lastObject > firstObject) {
      return JSON.parse(withoutFence.slice(firstObject, lastObject + 1)) as T
    }

    throw new Error('Gemini returned malformed JSON')
  }
}
