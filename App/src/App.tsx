import { AppShell } from '@templates/AppShell'
import { useAppStore } from '@store/useAppStore'
import { ExpenseTrackerPage } from '@pages/ExpenseTracker'
import { DocumentAnalysisPage } from '@pages/DocumentAnalysis'
import { DashboardPage } from '@pages/Dashboard'

export default function App() {
  const activeTab = useAppStore((s) => s.activeTab)

  return (
    <AppShell>
      <div
        role="tabpanel"
        id="panel-tab1"
        aria-labelledby="tab-tab1"
        hidden={activeTab !== 'tab1'}
      >
        {activeTab === 'tab1' && <ExpenseTrackerPage />}
      </div>
      <div
        role="tabpanel"
        id="panel-tab2"
        aria-labelledby="tab-tab2"
        hidden={activeTab !== 'tab2'}
      >
        {activeTab === 'tab2' && <DocumentAnalysisPage />}
      </div>
      <div
        role="tabpanel"
        id="panel-tab3"
        aria-labelledby="tab-tab3"
        hidden={activeTab !== 'tab3'}
      >
        {activeTab === 'tab3' && <DashboardPage />}
      </div>
    </AppShell>
  )
}
