import { useAppStore, monthlyTotal } from '@store/useAppStore'
import { formatCurrency } from '@utils/currency'
import styles from './SummaryStrip.module.css'

export function SummaryStrip() {
  const expenses = useAppStore((s) => s.expenses)
  const total = monthlyTotal(expenses)
  const annual = total * 12

  if (expenses.length === 0) return null

  return (
    <div className={styles.strip}>
      <div>
        <p className={styles.label}>Spesa mensile totale</p>
        <p className={styles.amount} data-amount>{formatCurrency(total)}</p>
        <p className={styles.sub}>pari a {formatCurrency(annual)} all'anno</p>
      </div>
      <div className={styles.countBlock}>
        <p className={styles.countLabel}>Voci attive</p>
        <p className={styles.count}>{expenses.length}</p>
      </div>
    </div>
  )
}
