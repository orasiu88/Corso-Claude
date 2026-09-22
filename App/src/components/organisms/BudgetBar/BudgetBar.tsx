import { useAppStore, monthlyTotal } from '@store/useAppStore'
import { formatCurrency } from '@utils/currency'
import styles from './BudgetBar.module.css'

export function BudgetBar() {
  const expenses = useAppStore((s) => s.expenses)
  const budget = useAppStore((s) => s.budget)

  if (budget === null) return null

  const total = monthlyTotal(expenses)
  const pct = Math.min((total / budget) * 100, 100)
  const over = total > budget
  const nearLimit = !over && pct >= 80

  const remaining = budget - total

  let barClass = styles.barFill
  if (over) barClass = `${styles.barFill} ${styles.barOver}`
  else if (nearLimit) barClass = `${styles.barFill} ${styles.barNear}`

  return (
    <div className={styles.card} role="region" aria-label="Budget mensile">
      <div className={styles.header}>
        <p className={styles.title}>Utilizzo del budget</p>
        <p className={styles.pct} aria-live="polite">
          {pct.toFixed(0)}%
        </p>
      </div>

      <div className={styles.barTrack} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`Budget utilizzato: ${pct.toFixed(0)}%`}>
        <div className={barClass} style={{ width: `${pct}%` }} />
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendLabel}>Spese mensili</span>
          <span className={styles.legendValue} data-amount>{formatCurrency(total)}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendLabel}>Budget impostato</span>
          <span className={styles.legendValue} data-amount>{formatCurrency(budget)}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendLabel}>{over ? 'Sforamento' : 'Disponibile'}</span>
          <span className={`${styles.legendValue} ${over ? styles.valueOver : nearLimit ? styles.valueNear : styles.valueOk}`} data-amount>
            {over ? `+${formatCurrency(total - budget)}` : formatCurrency(remaining)}
          </span>
        </div>
      </div>

      {over && (
        <p className={styles.alert} role="alert">
          Le tue spese fisse ({formatCurrency(total)}) hanno superato il budget impostato ({formatCurrency(budget)}).
        </p>
      )}
      {nearLimit && !over && (
        <p className={styles.alertWarn} role="status">
          Sei all'80% del budget mensile. Hai ancora {formatCurrency(remaining)} disponibili per spese fisse.
        </p>
      )}
    </div>
  )
}
