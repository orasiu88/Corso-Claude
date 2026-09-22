import type { AsyncStatus } from '@t/index'
import styles from './StatusMessage.module.css'

interface StatusMessageProps {
  status: AsyncStatus
  error?: string | null
  successMessage?: string
  loadingMessage?: string
}

// WCAG 4.1.3: status messages via aria-live
export function StatusMessage({
  status,
  error,
  successMessage = 'Operazione completata.',
  loadingMessage = 'Analisi in corso…',
}: StatusMessageProps) {
  if (status === 'idle') return null

  return (
    <div aria-live="polite" aria-atomic="true" className={styles.wrapper}>
      {status === 'loading' && (
        <p className={`${styles.message} ${styles.loading}`}>
          <span className={styles.dots} aria-hidden="true" /> {loadingMessage}
        </p>
      )}
      {status === 'success' && (
        <p className={`${styles.message} ${styles.success}`}>{successMessage}</p>
      )}
      {status === 'error' && (
        <p className={`${styles.message} ${styles.error}`} role="alert">
          {error ?? 'Si è verificato un errore. Riprova.'}
        </p>
      )}
    </div>
  )
}
