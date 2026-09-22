import { useAppStore } from '@store/useAppStore'
import { formatCurrency } from '@utils/currency'
import styles from './PaymentTimeline.module.css'

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
}

const daysUntil = (dateStr: string): number =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

export function PaymentTimeline() {
  const expenses = useAppStore((s) => s.expenses)

  const upcoming = expenses
    .filter((e) => e.renewal_date)
    .map((e) => ({ ...e, days: daysUntil(e.renewal_date!) }))
    .filter((e) => e.days >= 0)
    .sort((a, b) => a.days - b.days)

  if (upcoming.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.title}>Prossimi rinnovi e pagamenti</p>
        <div className={styles.empty} role="status">
          <span aria-hidden="true">📅</span>
          <p>Nessuna scadenza configurata. Aggiungi date di rinnovo alle tue spese per vedere la timeline.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <p className={styles.title}>Prossimi rinnovi e pagamenti</p>
      <ul className={styles.list} aria-label="Timeline scadenze">
        {upcoming.map((expense) => {
          const urgent = expense.days <= 7
          const soon = expense.days <= 30

          return (
            <li key={expense.id} className={`${styles.item} ${urgent ? styles.urgent : soon ? styles.soon : ''}`}>
              <div className={styles.dateBadge} aria-hidden="true">
                <span className={styles.daysNum}>{expense.days}</span>
                <span className={styles.daysLabel}>gg</span>
              </div>
              <div className={styles.itemBody}>
                <p className={styles.itemName}>{expense.name}</p>
                <p className={styles.itemDate}>{formatDate(expense.renewal_date!)}</p>
              </div>
              <div className={styles.itemRight}>
                <p className={styles.itemAmount} data-amount>{formatCurrency(expense.monthly_amount)}</p>
                <p className={styles.itemFreq}>/mese</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
