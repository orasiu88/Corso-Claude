import { useCallback } from 'react'
import { callAnthropicAgent } from '@services/anthropic.service'
import { readPdfAsBase64 } from '@services/pdf.service'
import { EXTRACTOR_AGENT_PROMPT } from '@services/agents/prompts'
import { parseAgentJson } from '@utils/parseAgentJson'
import { generateId } from '@utils/id'
import { toMonthlyAmount } from '@utils/currency'
import { useAppStore } from '@store/useAppStore'
import type { Expense, ExtractorAgentResponse } from '@t/index'

export function usePDFParser() {
  const { setTab1Status, setPendingExpenses } = useAppStore()

  const parseExpensesFromPDF = useCallback(async (file: File) => {
    setTab1Status('loading')

    const base64 = await readPdfAsBase64(file)

    const rawResponse = await callAnthropicAgent(EXTRACTOR_AGENT_PROMPT, [
      {
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      },
      { type: 'text', text: 'Analizza questo documento ed estrai le spese ricorrenti.' },
    ])

    let parsed: ExtractorAgentResponse
    try {
      parsed = parseAgentJson<ExtractorAgentResponse>(rawResponse)
    } catch {
      setTab1Status('error', 'Documento non riconosciuto. Prova con una bolletta o un contratto.')
      return []
    }

    if (!parsed.expenses || parsed.expenses.length === 0) {
      setTab1Status('success')
      return []
    }

    const validExpenses: Expense[] = parsed.expenses
      .filter((e) => {
        if (e.amount <= 0) {
          console.warn(`[FinanceScope] Spesa ignorata — importo non valido (${e.amount}€):`, e.name)
          return false
        }
        return true
      })
      .map((e) => ({
        ...e,
        id: generateId(),
        source: 'pdf' as const,
        monthly_amount: toMonthlyAmount(e.amount, e.frequency),
      }))

    // Set as pending — user must confirm before expenses are tracked
    setPendingExpenses(validExpenses)
    setTab1Status('success')
    return validExpenses
  }, [setTab1Status, setPendingExpenses])

  return { parseExpensesFromPDF }
}
