import { useState } from 'react'
import { FileUpload } from '@molecules/FileUpload'
import { StatusMessage } from '@molecules/StatusMessage'
import { ConfirmExpenses } from '@organisms/ConfirmExpenses'
import { ExpenseForm } from '@organisms/ExpenseForm'
import { ExpenseTable } from '@organisms/ExpenseTable'
import { SummaryStrip } from '@organisms/SummaryStrip'
import { HighlightsModal } from '@organisms/HighlightsModal'
import { usePDFParser } from '@hooks/usePDFParser'
import { useAppStore } from '@store/useAppStore'
import styles from './ExpenseTrackerPage.module.css'

export function ExpenseTrackerPage() {
  const { parseExpensesFromPDF } = usePDFParser()
  const tab1Status = useAppStore((s) => s.tab1Status)
  const tab1Error = useAppStore((s) => s.tab1Error)
  const [manualOpen, setManualOpen] = useState(false)

  const handleFile = async (file: File) => {
    try {
      await parseExpensesFromPDF(file)
    } catch (err) {
      useAppStore.getState().setTab1Status(
        'error',
        err instanceof Error ? err.message : "Errore durante l'analisi del PDF",
      )
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h2 className={styles.title}>Le tue spese ricorrenti</h2>
        <p className={styles.description}>
          Carica un PDF (bolletta, estratto abbonamenti) oppure inserisci una spesa manualmente.
          Ti mostriamo quanto spendi ogni mese, in modo chiaro.
        </p>
      </div>

      <div className={styles.inputArea}>
        <section aria-label="Carica PDF">
          <FileUpload
            onFile={handleFile}
            loading={tab1Status === 'loading'}
            label="Carica PDF con le tue spese"
          />
          <StatusMessage
            status={tab1Status}
            error={tab1Error}
            loadingMessage="Stiamo leggendo il documento…"
            successMessage="Spese estratte con successo!"
          />
        </section>

        <button
          className={styles.accordionTrigger}
          onClick={() => setManualOpen((o) => !o)}
          aria-expanded={manualOpen}
          aria-controls="manual-form-section"
          type="button"
        >
          <span className={styles.accordionLine} aria-hidden="true" />
          <span className={styles.accordionLabel}>oppure aggiungi manualmente</span>
          <span className={styles.accordionLine} aria-hidden="true" />
          <span className={`${styles.accordionChevron} ${manualOpen ? styles.accordionChevronOpen : ''}`} aria-hidden="true">▾</span>
        </button>

        <section
          id="manual-form-section"
          aria-label="Inserimento manuale"
          className={`${styles.accordionBody} ${manualOpen ? styles.accordionBodyOpen : ''}`}
          hidden={!manualOpen}
        >
          <ExpenseForm />
        </section>
      </div>

      <ConfirmExpenses />

      <section aria-labelledby="table-heading">
        <h3 id="table-heading" className="sr-only">Riepilogo spese</h3>
        <SummaryStrip />
        <div className={styles.tableWrapper}>
          <ExpenseTable />
        </div>
      </section>

      <HighlightsModal />
    </div>
  )
}
