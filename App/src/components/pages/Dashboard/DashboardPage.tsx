import { BudgetSetting } from '@organisms/BudgetSetting'
import { BudgetBar } from '@organisms/BudgetBar'
import { PaymentTimeline } from '@organisms/PaymentTimeline'
import { ExpenseHistory } from '@organisms/ExpenseHistory'
import { useAppStore } from '@store/useAppStore'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const budget = useAppStore((s) => s.budget)

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h2 className={styles.title}>La tua dashboard</h2>
        <p className={styles.description}>
          Monitora le tue spese fisse, tieni d'occhio il budget e ricorda le prossime scadenze.
        </p>
      </div>

      <div className={styles.grid}>
        <section aria-label="Budget mensile" className={styles.budgetSection}>
          <BudgetSetting />
          {budget !== null && <BudgetBar />}
        </section>

        <section aria-label="Prossimi rinnovi">
          <PaymentTimeline />
        </section>

        <section aria-label="Storico spese" className={styles.historySection}>
          <ExpenseHistory />
        </section>
      </div>
    </div>
  )
}
