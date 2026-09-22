import { DragEvent, useId, useRef, useState } from 'react'
import { Button } from '@atoms/Button'
import styles from './FileUpload.module.css'

interface FileUploadProps {
  onFile: (file: File) => void
  loading?: boolean
  label: string
  id?: string
}

export function FileUpload({ onFile, loading = false, label }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (loading) return
    const file = e.dataTransfer.files[0]
    if (file?.type === 'application/pdf') onFile(file)
  }

  const handleChange = () => {
    const file = inputRef.current?.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <label htmlFor={inputId} className={styles.label}>
        <span className={styles.icon} aria-hidden="true">📄</span>
        <span className={styles.text}>{label}</span>
        <span className={styles.hint}>Trascina qui, clicca o premi Invio per scegliere — solo PDF</span>
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf"
        className={styles.input}
        onChange={handleChange}
        aria-describedby={`${inputId}-hint`}
      />
      <Button
        variant="ghost"
        size="sm"
        loading={loading}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {loading ? 'Analisi in corso…' : 'Scegli PDF'}
      </Button>
      <span id={`${inputId}-hint`} className="sr-only">
        Carica un file PDF con le tue spese o contratti
      </span>
    </div>
  )
}
