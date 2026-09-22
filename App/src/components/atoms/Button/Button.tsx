import { ButtonHTMLAttributes, forwardRef } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'highlight'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, children, disabled, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
