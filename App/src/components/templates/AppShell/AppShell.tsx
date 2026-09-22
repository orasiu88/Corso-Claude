import { ReactNode } from 'react'
import { TabNavigation } from '@organisms/TabNavigation'
import { AlertBanner } from '@organisms/AlertBanner'
import { useAppStore } from '@store/useAppStore'
import styles from './AppShell.module.css'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const activeTab = useAppStore((s) => s.activeTab)

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.brand}>
            <span className={styles.logo} aria-hidden="true">◈</span>
            <div>
              <h1 className={styles.title}>FinanceScope</h1>
              <span className={styles.headerBadge}>Hagenthon 2026</span>
            </div>
          </div>
        </div>
        <TabNavigation activeTab={activeTab} />
      </header>
      <main className={styles.main} id="main-content">
        <AlertBanner />
        {children}
      </main>
    </div>
  )
}
