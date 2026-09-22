import { useMemo } from 'react'
import { useAppStore, monthlyTotal } from '@store/useAppStore'

export interface Alert {
  id: string
  type: 'expiry' | 'renewal' | 'budget-over' | 'budget-near'
  message: string
}

const daysUntil = (dateStr: string): number =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

export function useAlerts(): Alert[] {
  const expenses = useAppStore((s) => s.expenses)
  const budget = useAppStore((s) => s.budget)

  return useMemo(() => {
    const alerts: Alert[] = []

    // Budget alerts
    if (budget !== null) {
      const total = monthlyTotal(expenses)
      const pct = total / budget

      if (pct > 1) {
        alerts.push({
          id: 'budget-over',
          type: 'budget-over',
          message: `Le tue spese fisse (${formatCurrency(total)}) hanno superato il budget impostato (${formatCurrency(budget)}).`,
        })
      } else if (pct >= 0.8) {
        const remaining = budget - total
        alerts.push({
          id: 'budget-near',
          type: 'budget-near',
          message: `Sei all'${Math.round(pct * 100)}% del budget mensile. Hai ancora ${formatCurrency(remaining)} disponibili per spese fisse.`,
        })
      }
    }

    // Expiry alerts
    for (const expense of expenses) {
      if (!expense.renewal_date) continue
      const days = daysUntil(expense.renewal_date)
      if (days >= 0 && days <= 30) {
        alerts.push({
          id: `expiry-${expense.id}`,
          type: 'expiry',
          message: `Il contratto "${expense.name}" scade il ${formatDate(expense.renewal_date)}. Ricordati di valutare se rinnovarlo o disdirlo.`,
        })
      }
    }

    // Auto-renewal alerts from highlights notes
    for (const expense of expenses) {
      if (!expense.highlights) continue
      const hasAutoRenewal = expense.highlights.note.some(
        (n) => /rinnov/i.test(n) || /disdic/i.test(n) || /recesso/i.test(n),
      )
      if (hasAutoRenewal && expense.renewal_date) {
        const days = daysUntil(expense.renewal_date)
        if (days >= 0 && days <= 30) {
          alerts.push({
            id: `renewal-${expense.id}`,
            type: 'renewal',
            message: `Il contratto "${expense.name}" si rinnova automaticamente. Il preavviso minimo per disdire potrebbe essere richiesto.`,
          })
        }
      }
    }

    return alerts
  }, [expenses, budget])
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
}
