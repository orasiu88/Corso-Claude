import { useRef } from 'react'
import { useAppStore, monthlyTotal } from '@store/useAppStore'
import { SourceBadge } from '@atoms/Badge'
import { Button } from '@atoms/Button'
import { formatCurrency } from '@utils/currency'
import type { Expense, ExpenseCategory } from '@t/index'
import styles from './ExpenseTable.module.css'

const CAT_COLORS: Record<ExpenseCategory, string> = {
  'Utenze':       '#14B8A6',
  'Abbonamenti':  '#A855F7',
  'Mutuo/Affitto':'#F59E0B',
  'Assicurazioni':'#F43F5E',
  'Altro':        '#94A3B8',
}

const daysUntil = (dateStr: string): number => {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function ExpenseTable() {
  const { expenses, removeExpense, openModal } = useAppStore()
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const total = monthlyTotal(expenses)

  if (expenses.length === 0) {
    return (
      <div className={styles.emptyState} role="status">
        <span className={styles.emptyIcon} aria-hidden="true">📋</span>
        <p className={styles.emptyText}>
          Nessuna spesa aggiunta. Carica un PDF o inserisci una spesa manuale.
        </p>
      </div>
    )
  }

  const handleOpenModal = (expense: Expense) => {
    const triggerEl = buttonRefs.current[expense.id]
    if (triggerEl) openModal(expense)
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className="sr-only">Riepilogo spese ricorrenti mensili</caption>
        <thead className={styles.thead}>
          <tr>
            <th scope="col" className={styles.th}>Spesa</th>
            <th scope="col" className={styles.th}>Categoria</th>
            <th scope="col" className={styles.th}>Frequenza</th>
            <th scope="col" className={`${styles.th} ${styles.numeric}`}>Importo mensile</th>
            <th scope="col" className={styles.th}>Fonte</th>
            <th scope="col" className={styles.th}>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => {
            const days = expense.renewal_date ? daysUntil(expense.renewal_date) : null
            const imminent = days !== null && days >= 0 && days <= 30
            return (
            <tr key={expense.id} className={`${styles.tr} ${index % 2 === 1 ? styles.trAlt : ''} ${imminent ? styles.trImminent : ''}`}>
              <td className={`${styles.td} ${styles.nameCell}`}>
                {expense.name}
                {imminent && (
                  <span className={styles.expiryBadge} title={`Scade tra ${days} giorn${days === 1 ? 'o' : 'i'}`}>
                    ⚠ {days === 0 ? 'Scade oggi' : `Scade tra ${days}gg`}
                  </span>
                )}
              </td>
              <td className={styles.td}>
                <span className={styles.catCell}>
                  <span
                    className={styles.catDot}
                    style={{ background: CAT_COLORS[expense.category] ?? '#94A3B8' }}
                    aria-hidden="true"
                  />
                  {expense.category}
                </span>
              </td>
              <td className={styles.td}>{expense.frequency}</td>
              <td className={`${styles.td} ${styles.numeric} ${styles.amount}`} data-amount>
                {formatCurrency(expense.monthly_amount)}
              </td>
              <td className={styles.td}>
                <SourceBadge source={expense.source} />
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  {expense.source === 'pdf' && (
                    <Button
                      ref={(el) => { buttonRefs.current[expense.id] = el }}
                      variant="highlight"
                      size="sm"
                      onClick={() => handleOpenModal(expense)}
                      aria-label={`Vedi dettagli di ${expense.name}`}
                    >
                      ✦ Dettagli
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeExpense(expense.id)}
                    aria-label={`Rimuovi ${expense.name}`}
                  >
                    ✕
                  </Button>
                </div>
              </td>
            </tr>
          )})}

        </tbody>
        <tfoot>
          <tr className={styles.footerRow}>
            <td colSpan={3} className={`${styles.td} ${styles.footerLabel}`}>
              Totale mensile
            </td>
            <td className={`${styles.td} ${styles.numeric} ${styles.footerTotal}`} data-amount>
              {formatCurrency(total)}
            </td>
            <td colSpan={2} className={styles.td} />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
