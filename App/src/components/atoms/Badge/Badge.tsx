import type { ExpenseCategory, ExpenseSource } from '@t/index'
import styles from './Badge.module.css'

type BadgeVariant = 'source-pdf' | 'source-manual' | ExpenseCategory

interface BadgeProps {
  variant: BadgeVariant
  label: string
}

export function Badge({ variant, label }: BadgeProps) {
  const cssVariant = variant.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return (
    <span className={`${styles.badge} ${styles[cssVariant] ?? styles.default}`}>
      {label}
    </span>
  )
}

export function SourceBadge({ source }: { source: ExpenseSource }) {
  if (source === 'pdf') return <Badge variant="source-pdf" label="📎 da PDF" />
  return <Badge variant="source-manual" label="✏️ manuale" />
}

export function CategoryBadge({ category }: { category: ExpenseCategory }) {
  return <Badge variant={category} label={category} />
}
