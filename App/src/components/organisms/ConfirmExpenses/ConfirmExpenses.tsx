import { useAppStore } from '@store/useAppStore'
import { Button } from '@atoms/Button'
import { Semaforo } from '@atoms/Semaforo'
import { formatCurrency } from '@utils/currency'
import styles from './ConfirmExpenses.module.css'

export function ConfirmExpenses() {
  const pendingExpenses = useAppStore((s) => s.pendingExpenses)
  const { confirmPending, discardPending } = useAppStore()

  if (pendingExpenses.length === 0) return null

  const total = pendingExpenses.reduce((sum, e) => sum + e.monthly_amount, 0)

  return (
    <div className={styles.panel} role="region" aria-label="Spese estratte dal documento">
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Spese trovate nel documento</p>
          <p className={styles.subtitle}>
            Vuoi aggiungere queste {pendingExpenses.length} voc{pendingExpenses.length === 1 ? 'e' : 'i'} al tuo tracker?
          </p>
        </div>
        <div className={styles.totalBlock}>
          <p className={styles.totalLabel}>Totale mensile</p>
          <p className={styles.totalAmount} data-amount>{formatCurrency(total)}</p>
        </div>
      </div>

      <ul className={styles.list} aria-label="Spese estratte">
        {pendingExpenses.map((expense) => (
          <li key={expense.id} className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.itemName}>{expense.name}</span>
              <span className={styles.itemFreq}>{expense.frequency}</span>
            </div>
            <div className={styles.itemRight}>
              {expense.highlights && (
                <Semaforo color={expense.highlights.semaforo} size="sm" showLabel={false} />
              )}
              <span className={styles.itemAmount} data-amount>
                {formatCurrency(expense.monthly_amount)}<span className={styles.itemAmountUnit}>/mese</span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Button variant="primary" size="md" onClick={confirmPending}>
          Aggiungi alle mie spese
        </Button>
        <Button variant="ghost" size="md" onClick={discardPending}>
          Salva solo l'analisi
        </Button>
      </div>
    </div>
  )
}
