import { useState } from 'react'
import { useAlerts } from '@hooks/useAlerts'
import type { Alert } from '@hooks/useAlerts'
import styles from './AlertBanner.module.css'

const ICON: Record<Alert['type'], string> = {
  'expiry': '📅',
  'renewal': '🔄',
  'budget-over': '⚠️',
  'budget-near': '💡',
}

export function AlertBanner() {
  const alerts = useAlerts()
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visible = alerts.filter((a) => !dismissed.has(a.id))

  if (visible.length === 0) return null

  const dismiss = (id: string) => setDismissed((prev) => new Set([...prev, id]))

  return (
    <div className={styles.container} role="region" aria-label="Notifiche">
      {visible.map((alert) => (
        <div
          key={alert.id}
          className={`${styles.alert} ${styles[alert.type.replace('-', '_') as keyof typeof styles]}`}
          role="status"
          aria-live="polite"
        >
          <span className={styles.icon} aria-hidden="true">{ICON[alert.type]}</span>
          <p className={styles.message}>{alert.message}</p>
          <button
            className={styles.dismiss}
            onClick={() => dismiss(alert.id)}
            aria-label="Chiudi notifica"
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
