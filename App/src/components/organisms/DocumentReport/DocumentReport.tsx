import { useAppStore } from '@store/useAppStore'
import { Semaforo } from '@atoms/Semaforo'
import type { ClausolaRestrittiva, ClausolaTipo } from '@t/index'
import styles from './DocumentReport.module.css'

const CLAUSE_ICON: Record<ClausolaTipo, string> = {
  mora:               '💸',
  penale_recesso:     '🚪',
  rinnovo_automatico: '🔄',
  preavviso:          '📣',
  variazione_costo:   '📈',
  altro:              'ℹ️',
}

const CLAUSE_LABEL: Record<ClausolaTipo, string> = {
  mora:               'Mora per ritardo',
  penale_recesso:     'Penale di recesso',
  rinnovo_automatico: 'Rinnovo automatico',
  preavviso:          'Preavviso obbligatorio',
  variazione_costo:   'Variazione costo',
  altro:              'Altra clausola',
}

function ClauseCard({ clause }: { clause: ClausolaRestrittiva }) {
  return (
    <div className={`${styles.clauseCard} ${styles[`clause_${clause.gravita}`]}`}>
      <div className={styles.clauseHeader}>
        <span className={styles.clauseIcon} aria-hidden="true">{CLAUSE_ICON[clause.tipo]}</span>
        <span className={styles.clauseType}>{CLAUSE_LABEL[clause.tipo]}</span>
        <span className={`${styles.gravityBadge} ${styles[`gravity_${clause.gravita}`]}`}>
          {clause.gravita === 'alta' ? '⚠ Alta' : clause.gravita === 'media' ? 'Media' : 'Bassa'}
        </span>
      </div>
      <p className={styles.clauseDesc}>{clause.descrizione}</p>
      {clause.importo && (
        <p className={styles.clauseAmount} data-amount>{clause.importo}</p>
      )}
    </div>
  )
}

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
    clausole_restrittive,
  } = tab2Report

  const hasRestrittive = clausole_restrittive && clausole_restrittive.length > 0
  const highGravity = hasRestrittive
    ? clausole_restrittive.filter((c) => c.gravita === 'alta')
    : []

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

      {hasRestrittive && (
        <section className={styles.section} aria-label="Clausole restrittive rilevate">
          <p className={styles.sectionLabel}>
            Clausole restrittive
            {highGravity.length > 0 && (
              <span className={styles.sectionAlert}> · {highGravity.length} ad alta gravità</span>
            )}
          </p>
          <div className={styles.clauseList}>
            {clausole_restrittive.map((clause, i) => (
              <ClauseCard key={i} clause={clause} />
            ))}
          </div>
        </section>
      )}

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
