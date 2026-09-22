// ─── Domain types ──────────────────────────────────────────────────────────

export type ExpenseFrequency = 'mensile' | 'annuale'
export type ExpenseCategory = 'Utenze' | 'Abbonamenti' | 'Mutuo/Affitto' | 'Assicurazioni' | 'Altro'
export type ExpenseSource = 'pdf' | 'manual'
export type SemaforoColor = 'verde' | 'giallo' | 'rosso'

export interface ExpenseHighlights {
  importo_principale: string
  campi_chiave: string[]
  riassunto_semplice: string
  note: string[]
  semaforo: SemaforoColor
}

export interface Expense {
  id: string
  name: string
  amount: number
  frequency: ExpenseFrequency
  monthly_amount: number
  category: ExpenseCategory
  source: ExpenseSource
  highlights: ExpenseHighlights | null
  renewal_date?: string // ISO date string (YYYY-MM-DD), optional
}

export interface DocumentReport {
  importo_periodico: string
  scadenza: string
  condizioni_economiche: string[]
  clausole_importanti: string[]
  semaforo: SemaforoColor
  semaforo_motivo: string
  riassunto_semplice: string
}

// ─── AI content types (input format shared across providers) ───────────────

export type AnthropicContent =
  | { type: 'text'; text: string }
  | { type: 'document'; source: { type: 'base64'; media_type: 'application/pdf'; data: string } }

// ─── Agent response types ───────────────────────────────────────────────────

export interface ExtractorAgentResponse {
  expenses: Array<Omit<Expense, 'id' | 'source'> & { highlights: ExpenseHighlights }>
}

// ─── UI / async state ───────────────────────────────────────────────────────

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

// ─── History ────────────────────────────────────────────────────────────────

export type HistoryAction = 'add' | 'remove'

export interface HistoryEntry {
  id: string
  date: string // ISO timestamp
  action: HistoryAction
  expenseName: string
  amount: number
  source: ExpenseSource
}

// ─── App tabs ───────────────────────────────────────────────────────────────

export type AppTab = 'tab1' | 'tab2' | 'tab3'
