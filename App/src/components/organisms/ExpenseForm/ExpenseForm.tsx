import { FormEvent, useId, useState } from 'react'
import { useAppStore } from '@store/useAppStore'
import { Button } from '@atoms/Button'
import { generateId } from '@utils/id'
import { toMonthlyAmount } from '@utils/currency'
import type { Expense, ExpenseCategory, ExpenseFrequency } from '@t/index'
import styles from './ExpenseForm.module.css'

interface FormErrors {
  name?: string
  amount?: string
}

const CATEGORIES: ExpenseCategory[] = ['Utenze', 'Abbonamenti', 'Mutuo/Affitto', 'Assicurazioni', 'Altro']

export function ExpenseForm() {
  const { addManualExpense } = useAppStore()
  const baseId = useId()

  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<ExpenseFrequency>('mensile')
  const [category, setCategory] = useState<ExpenseCategory>('Utenze')
  const [renewalDate, setRenewalDate] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Inserisci il nome della spesa'
    const parsed = parseFloat(amount)
    if (!amount || isNaN(parsed) || parsed <= 0) next.amount = 'Inserisci un importo valido, ad esempio: 15.99'
    return next
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const parsedAmount = parseFloat(amount)
    const expense: Expense = {
      id: generateId(),
      name: name.trim(),
      amount: parsedAmount,
      frequency,
      monthly_amount: toMonthlyAmount(parsedAmount, frequency),
      category,
      source: 'manual',
      highlights: null,
      ...(renewalDate ? { renewal_date: renewalDate } : {}),
    }

    addManualExpense(expense)
    setName('')
    setAmount('')
    setFrequency('mensile')
    setCategory('Utenze')
    setRenewalDate('')
    setErrors({})
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Aggiungi una spesa manuale">
      <div className={styles.field}>
        <label htmlFor={`${baseId}-name`} className={styles.label}>
          Nome spesa
        </label>
        <input
          id={`${baseId}-name`}
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })) }}
          placeholder="es. Bolletta luce"
          aria-describedby={errors.name ? `${baseId}-name-error` : undefined}
          aria-invalid={!!errors.name}
          autoComplete="off"
        />
        {errors.name && (
          <span id={`${baseId}-name-error`} className={styles.errorMsg} role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-amount`} className={styles.label}>
          Importo (€)
        </label>
        <input
          id={`${baseId}-amount`}
          type="number"
          className={`${styles.input} ${errors.amount ? styles.inputError : ''}`}
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setErrors((prev) => ({ ...prev, amount: undefined })) }}
          placeholder="0.00"
          min="0.01"
          step="0.01"
          aria-describedby={errors.amount ? `${baseId}-amount-error` : undefined}
          aria-invalid={!!errors.amount}
        />
        {errors.amount && (
          <span id={`${baseId}-amount-error`} className={styles.errorMsg} role="alert">
            {errors.amount}
          </span>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${baseId}-frequency`} className={styles.label}>
            Frequenza
          </label>
          <select
            id={`${baseId}-frequency`}
            className={styles.select}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as ExpenseFrequency)}
          >
            <option value="mensile">Mensile</option>
            <option value="annuale">Annuale</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${baseId}-category`} className={styles.label}>
            Categoria
          </label>
          <select
            id={`${baseId}-category`}
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-renewal`} className={styles.label}>
          Data rinnovo <span className={styles.labelOptional}>(opzionale)</span>
        </label>
        <input
          id={`${baseId}-renewal`}
          type="date"
          className={styles.input}
          value={renewalDate}
          onChange={(e) => setRenewalDate(e.target.value)}
        />
      </div>

      <Button type="submit" variant="primary" size="md">
        Aggiungi spesa
      </Button>
    </form>
  )
}
