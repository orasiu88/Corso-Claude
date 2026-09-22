import { useAppStore } from '@store/useAppStore'
import { Semaforo } from '@atoms/Semaforo'
import styles from './DocumentReport.module.css'

export function DocumentReport() {
  const { tab2Report } = useAppStore()

  if (!tab2Report) return null

  const {
    riassunto_semplice,
    semaforo,
    semaforo_motivo,
    importo_periodico,
    scadenza,
    condizioni_economiche,
    clausole_importanti,
  } = tab2Report

  return (
    <article className={styles.card} aria-label="Report documento finanziario">
      <section className={styles.section}>
        <p className={styles.riassunto}>{riassunto_semplice}</p>
      </section>

      <section className={styles.section}>
        <div className={styles.semaforoRow}>
          <Semaforo color={semaforo} showLabel size="md" />
          <p className={styles.semaforoMotivo}>{semaforo_motivo}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Importo periodico</span>
            <span className={styles.infoValue}>{importo_periodico || 'Non specificato'}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Scadenza</span>
            <span className={styles.infoValue}>{scadenza || 'Non specificato'}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Condizioni economiche</p>
        {condizioni_economiche.length > 0 ? (
          <ul className={styles.list}>
            {condizioni_economiche.map((item, i) => (
              <li key={i} className={styles.listItem}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyField}>Non specificato</p>
        )}
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Clausole importanti</p>
        {clausole_importanti.length > 0 ? (
          <ul className={styles.list}>
            {clausole_importanti.map((item, i) => (
              <li key={i} className={styles.listItem}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyField}>Nessuna clausola rilevante segnalata.</p>
        )}
      </section>
    </article>
  )
}
