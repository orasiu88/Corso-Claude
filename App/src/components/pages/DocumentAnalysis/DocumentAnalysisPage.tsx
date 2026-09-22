import { FileUpload } from '@molecules/FileUpload'
import { StatusMessage } from '@molecules/StatusMessage'
import { DocumentReport } from '@organisms/DocumentReport'
import { useDocumentAnalysis } from '@hooks/useDocumentAnalysis'
import { useAppStore } from '@store/useAppStore'
import styles from './DocumentAnalysisPage.module.css'

export function DocumentAnalysisPage() {
  const { analyzeDocument } = useDocumentAnalysis()
  const tab2Status = useAppStore((s) => s.tab2Status)
  const tab2Error = useAppStore((s) => s.tab2Error)

  const handleFile = async (file: File) => {
    try {
      await analyzeDocument(file)
    } catch (err) {
      useAppStore.getState().setTab2Status(
        'error',
        err instanceof Error ? err.message : "Errore durante l'analisi del documento",
      )
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h2 className={styles.title}>Analisi documento finanziario</h2>
        <p className={styles.description}>
          Carica una bolletta o un contratto. Ti spieghiamo in parole semplici
          quanto paghi, quando scade e cosa c'è scritto.
        </p>
      </div>

      <section className={styles.uploadSection} aria-labelledby="doc-upload-heading">
        <h3 id="doc-upload-heading" className="sr-only">Carica documento</h3>
        <FileUpload
          onFile={handleFile}
          loading={tab2Status === 'loading'}
          label="Carica bolletta o contratto in PDF"
        />
        <StatusMessage
          status={tab2Status}
          error={tab2Error}
          loadingMessage="Stiamo analizzando il documento…"
          successMessage="Analisi completata!"
        />
      </section>

      <DocumentReport />
    </div>
  )
}
