import { useEffect, useId, useRef } from 'react'
import { useAppStore } from '@store/useAppStore'
import { Semaforo } from '@atoms/Semaforo'
import type { ClausolaRestrittiva, ClausolaTipo } from '@t/index'
import styles from './HighlightsModal.module.css'

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

function ModalClauseCard({ clause }: { clause: ClausolaRestrittiva }) {
  return (
    <div className={`${styles.clauseCard} ${styles[`clause_${clause.gravita}`]}`}>
      <div className={styles.clauseHeader}>
        <span aria-hidden="true">{CLAUSE_ICON[clause.tipo]}</span>
        <span className={styles.clauseType}>{CLAUSE_LABEL[clause.tipo]}</span>
        <span className={`${styles.gravityBadge} ${styles[`gravity_${clause.gravita}`]}`}>
          {clause.gravita === 'alta' ? '⚠ Alta' : clause.gravita === 'media' ? 'Media' : 'Bassa'}
        </span>
      </div>
      <p className={styles.clauseDesc}>{clause.descrizione}</p>
      {clause.importo && <p className={styles.clauseAmount}>{clause.importo}</p>}
    </div>
  )
}

export function HighlightsModal() {
  const { activeModal, closeModal } = useAppStore()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  const isVisible =
    activeModal !== null &&
    activeModal.source === 'pdf' &&
    activeModal.highlights !== null

  useEffect(() => {
    if (isVisible) dialogRef.current?.focus()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isVisible, closeModal])

  useEffect(() => {
    if (!isVisible) return
    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    dialog.addEventListener('keydown', trap)
    return () => dialog.removeEventListener('keydown', trap)
  }, [isVisible])

  if (!isVisible || !activeModal?.highlights) return null

  const { highlights, name } = activeModal

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 id={titleId} className={styles.title}>{name}</h2>
            <p className={styles.subtitle}>Analisi automatica del documento</p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={closeModal}
            aria-label="Chiudi dettagli"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <Semaforo color={highlights.semaforo} size="md" showLabel />

          <div className={styles.reportGrid}>
            <div className={`${styles.reportItem} ${styles.reportItemHighlight}`}>
              <p className={styles.reportLabel}>Importo principale</p>
              <p className={styles.reportValueHighlight}>{highlights.importo_principale}</p>
            </div>
            {highlights.campi_chiave.slice(0, 2).map((item, i) => (
              <div key={i} className={styles.reportItem}>
                <p className={styles.reportValue}>{item}</p>
              </div>
            ))}
          </div>

          <p className={styles.riassunto}>{highlights.riassunto_semplice}</p>

          {highlights.note.length > 0 && (
            <div className={styles.attentionBox}>
              <p className={styles.attentionTitle}>⚠️ Da controllare</p>
              <ul className={styles.list}>
                {highlights.note.map((nota, i) => (
                  <li key={i} className={styles.listItem}>{nota}</li>
                ))}
              </ul>
            </div>
          )}

          {highlights.clausole_restrittive && highlights.clausole_restrittive.length > 0 && (
            <div className={styles.clauseSection}>
              <p className={styles.clauseSectionTitle}>📋 Clausole restrittive</p>
              <div className={styles.clauseList}>
                {highlights.clausole_restrittive.map((clause, i) => (
                  <ModalClauseCard key={i} clause={clause} />
                ))}
              </div>
            </div>
          )}

          {highlights.campi_chiave.length > 2 && (
            <ul className={styles.list}>
              {highlights.campi_chiave.slice(2).map((item, i) => (
                <li key={i} className={styles.listItem}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
