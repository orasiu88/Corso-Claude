import { useAppStore } from '@store/useAppStore'
import { formatCurrency } from '@utils/currency'
import styles from './ExpenseHistory.module.css'

const formatDateTime = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function ExpenseHistory() {
  const history = useAppStore((s) => s.history)

  if (history.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.title}>Storico spese</p>
        <div className={styles.empty} role="status">
          <span aria-hidden="true">📋</span>
          <p>Nessuna attività registrata. Le aggiunte e rimozioni di spese appariranno qui.</p>
        </div>
      </div>
    )
  }

  const sorted = [...history].reverse()

  return (
    <div className={styles.card}>
      <p className={styles.title}>Storico spese</p>
      <ul className={styles.list} aria-label="Cronologia modifiche alle spese">
        {sorted.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <span
              className={`${styles.dot} ${entry.action === 'add' ? styles.dotAdd : styles.dotRemove}`}
              aria-hidden="true"
            />
            <div className={styles.itemBody}>
              <p className={styles.itemName}>
                <span className={`${styles.action} ${entry.action === 'add' ? styles.actionAdd : styles.actionRemove}`}>
                  {entry.action === 'add' ? '+ Aggiunta' : '− Rimossa'}
                </span>
                {' '}{entry.expenseName}
              </p>
              <p className={styles.itemMeta}>
                <span data-amount>{formatCurrency(entry.amount)}/mese</span>
                {' · '}{formatDateTime(entry.date)}
                {' · '}<span className={styles.source}>{entry.source === 'pdf' ? '📎 da PDF' : '✏ manuale'}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
