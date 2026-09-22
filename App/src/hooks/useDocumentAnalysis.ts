import { useCallback } from 'react'
import { callAnthropicAgent } from '@services/anthropic.service'
import { readPdfAsBase64 } from '@services/pdf.service'
import { VALIDATOR_AGENT_PROMPT } from '@services/agents/prompts'
import { parseAgentJson } from '@utils/parseAgentJson'
import { useAppStore } from '@store/useAppStore'
import type { DocumentReport } from '@t/index'

interface ValidatorResponse extends DocumentReport {
  error?: string
}

export function useDocumentAnalysis() {
  const { setTab2Status, setTab2Report } = useAppStore()

  const analyzeDocument = useCallback(async (file: File) => {
    setTab2Status('loading')
    setTab2Report(null)

    const base64 = await readPdfAsBase64(file)

    const rawResponse = await callAnthropicAgent(VALIDATOR_AGENT_PROMPT, [
      {
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      },
      { type: 'text', text: 'Analizza questo documento finanziario e produce il report strutturato.' },
    ])

    let parsed: ValidatorResponse
    try {
      parsed = parseAgentJson<ValidatorResponse>(rawResponse)
    } catch {
      setTab2Status('error', 'Documento non riconosciuto. Prova con una bolletta o un contratto.')
      return
    }

    if (parsed.error) {
      setTab2Status('error', 'Documento non riconosciuto. Prova con una bolletta o un contratto.')
      return
    }

    setTab2Report(parsed)
    setTab2Status('success')
  }, [setTab2Status, setTab2Report])

  return { analyzeDocument }
}
