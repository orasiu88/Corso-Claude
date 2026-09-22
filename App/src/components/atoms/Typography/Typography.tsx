import { HTMLAttributes } from 'react'
import styles from './Typography.module.css'

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: keyof HTMLElementTagNameMap
}

export function Display({ as: Tag = 'h1', className = '', children, ...props }: TextProps) {
  return <Tag className={`${styles.display} ${className}`} {...props}>{children}</Tag>
}

export function Heading({ as: Tag = 'h2', className = '', children, ...props }: TextProps) {
  return <Tag className={`${styles.heading} ${className}`} {...props}>{children}</Tag>
}

export function Subheading({ as: Tag = 'h3', className = '', children, ...props }: TextProps) {
  return <Tag className={`${styles.subheading} ${className}`} {...props}>{children}</Tag>
}

export function Body({ as: Tag = 'p', className = '', children, ...props }: TextProps) {
  return <Tag className={`${styles.body} ${className}`} {...props}>{children}</Tag>
}

export function Caption({ as: Tag = 'span', className = '', children, ...props }: TextProps) {
  return <Tag className={`${styles.caption} ${className}`} {...props}>{children}</Tag>
}
