import type { SemaforoColor } from '@t/index'
import styles from './Semaforo.module.css'

interface SemaforoProps {
  color: SemaforoColor
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const EMOJI_MAP: Record<SemaforoColor, string> = {
  verde: '🟢',
  giallo: '🟡',
  rosso: '🔴',
}

const LABEL_MAP: Record<SemaforoColor, string> = {
  verde: 'Tutto chiaro',
  giallo: 'Da verificare',
  rosso: 'Attenzione',
}

// Color + emoji + text — WCAG 1.4.1
export function Semaforo({ color, showLabel = true, size = 'md' }: SemaforoProps) {
  return (
    <span
      className={`${styles.semaforo} ${styles[color]} ${styles[size]}`}
      role="img"
      aria-label={LABEL_MAP[color]}
    >
      <span aria-hidden="true">{EMOJI_MAP[color]}</span>
      {showLabel && <span className={styles.label}>{LABEL_MAP[color]}</span>}
    </span>
  )
}
