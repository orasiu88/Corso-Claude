import type { AppTab } from '@t/index'
import { useAppStore } from '@store/useAppStore'
import styles from './TabNavigation.module.css'

const TABS: { id: AppTab; label: string }[] = [
  { id: 'tab1', label: '📊 Spese Ricorrenti' },
  { id: 'tab2', label: '📄 Analisi Documento' },
  { id: 'tab3', label: '🎯 Dashboard' },
]

interface TabNavigationProps {
  activeTab: AppTab
}

export function TabNavigation({ activeTab }: TabNavigationProps) {
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  return (
    <nav className={styles.nav} aria-label="Sezioni principali">
      <div role="tablist" aria-label="Funzionalità disponibili" className={styles.tablist}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            id={`tab-${id}`}
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            className={`${styles.tab} ${activeTab === id ? styles.active : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
