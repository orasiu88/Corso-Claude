import { FormEvent, useId, useState } from 'react'
import { useAppStore } from '@store/useAppStore'
import { Button } from '@atoms/Button'
import styles from './BudgetSetting.module.css'

export function BudgetSetting() {
  const budget = useAppStore((s) => s.budget)
  const setBudget = useAppStore((s) => s.setBudget)
  const baseId = useId()
  const [input, setInput] = useState(budget !== null ? String(budget) : '')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = parseFloat(input)
    if (!input || isNaN(value) || value <= 0) {
      setError('Inserisci un importo valido, ad esempio: 800')
      return
    }
    setBudget(value)
    setError('')
  }

  const handleReset = () => {
    setBudget(null)
    setInput('')
    setError('')
  }

  return (
    <div className={styles.card}>
      <p className={styles.title}>Budget mensile</p>
      <p className={styles.description}>
        Imposta il massimo che vuoi spendere ogni mese in spese fisse.
        Il sistema ti avvisa quando ti avvicini al limite.
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>€</span>
            <input
              id={`${baseId}-budget`}
              type="number"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError('') }}
              placeholder="800"
              min="1"
              step="1"
              aria-label="Budget mensile in euro"
              aria-describedby={error ? `${baseId}-budget-error` : undefined}
              aria-invalid={!!error}
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            {budget !== null ? 'Aggiorna' : 'Imposta'}
          </Button>
          {budget !== null && (
            <Button type="button" variant="ghost" size="md" onClick={handleReset}>
              Rimuovi
            </Button>
          )}
        </div>
        {error && (
          <span id={`${baseId}-budget-error`} className={styles.errorMsg} role="alert">
            {error}
          </span>
        )}
      </form>
    </div>
  )
}
