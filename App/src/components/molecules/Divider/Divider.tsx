import styles from './Divider.module.css'

interface DividerProps {
  text?: string
}

export function Divider({ text = 'oppure' }: DividerProps) {
  return (
    <div className={styles.divider} role="separator" aria-hidden="true">
      <span>{text}</span>
    </div>
  )
}
