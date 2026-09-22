// Extracts the first valid JSON object from an LLM response string.
// LLMs sometimes wrap JSON in markdown code fences — this strips them.
export function parseAgentJson<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonString = fenced ? fenced[1].trim() : raw.trim()

  const parsed = JSON.parse(jsonString) as T
  return parsed
}
