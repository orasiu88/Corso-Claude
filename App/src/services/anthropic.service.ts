import type { AnthropicContent } from '@t/index'

const GEMINI_MODEL = 'gemini-flash-lite-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const MAX_TOKENS = 4096

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string
  if (!key || key === 'your_api_key_here') {
    throw new Error('API key mancante. Inserisci VITE_GEMINI_API_KEY in .env.local')
  }
  return key
}

function toGeminiParts(content: AnthropicContent[]): object[] {
  return content.map((c) => {
    if (c.type === 'text') return { text: c.text }
    return { inline_data: { mime_type: c.source.media_type, data: c.source.data } }
  })
}

export async function callAnthropicAgent(
  system: string,
  userContent: AnthropicContent[],
): Promise<string> {
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: toGeminiParts(userContent) }],
    generationConfig: { maxOutputTokens: MAX_TOKENS },
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Errore API Gemini (${response.status}): ${errorText}`)
  }

  const data = await response.json() as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Nessuna risposta testuale dall\'AI')

  return text
}
