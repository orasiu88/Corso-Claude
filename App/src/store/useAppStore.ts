import { create } from 'zustand'
import type { AppTab, AsyncStatus, DocumentReport, Expense, HistoryEntry } from '@t/index'
import { generateId } from '@utils/id'

interface AppState {
  // Navigation
  activeTab: AppTab

  // Tab 1 — Expense Tracker
  expenses: Expense[]
  pendingExpenses: Expense[] // extracted but not yet confirmed
  tab1Status: AsyncStatus
  tab1Error: string | null
  activeModal: Expense | null

  // Tab 2 — Document Analysis
  tab2Report: DocumentReport | null
  tab2Status: AsyncStatus
  tab2Error: string | null

  // Tab 3 — Dashboard
  budget: number | null
  history: HistoryEntry[]
}

interface AppActions {
  setActiveTab: (tab: AppTab) => void

  // Tab 1
  addExpenses: (expenses: Expense[]) => void
  addManualExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  setPendingExpenses: (expenses: Expense[]) => void
  confirmPending: () => void
  discardPending: () => void
  setTab1Status: (status: AsyncStatus, error?: string) => void
  openModal: (expense: Expense) => void
  closeModal: () => void

  // Tab 2
  setTab2Report: (report: DocumentReport | null) => void
  setTab2Status: (status: AsyncStatus, error?: string) => void

  // Tab 3
  setBudget: (budget: number | null) => void
}

// Derived values — computed on the fly, never stored
export const monthlyTotal = (expenses: Expense[]) =>
  expenses.reduce((sum, e) => sum + e.monthly_amount, 0)

export const useAppStore = create<AppState & AppActions>((set) => ({
  // ─── Initial state ────────────────────────────────────────────────────
  activeTab: 'tab1',
  expenses: [],
  pendingExpenses: [],
  tab1Status: 'idle',
  tab1Error: null,
  activeModal: null,
  tab2Report: null,
  tab2Status: 'idle',
  tab2Error: null,
  budget: (() => {
    const saved = localStorage.getItem('financescope_budget')
    return saved ? parseFloat(saved) : null
  })(),
  history: [],

  // ─── Actions ──────────────────────────────────────────────────────────
  setActiveTab: (tab) => set({ activeTab: tab }),

  addExpenses: (expenses) =>
    set((state) => ({
      expenses: [...state.expenses, ...expenses],
      history: [
        ...state.history,
        ...expenses.map((e) => ({
          id: generateId(),
          date: new Date().toISOString(),
          action: 'add' as const,
          expenseName: e.name,
          amount: e.monthly_amount,
          source: e.source,
        })),
      ],
    })),

  addManualExpense: (expense) =>
    set((state) => ({
      expenses: [...state.expenses, expense],
      history: [
        ...state.history,
        {
          id: generateId(),
          date: new Date().toISOString(),
          action: 'add' as const,
          expenseName: expense.name,
          amount: expense.monthly_amount,
          source: expense.source,
        },
      ],
    })),

  removeExpense: (id) =>
    set((state) => {
      const expense = state.expenses.find((e) => e.id === id)
      return {
        expenses: state.expenses.filter((e) => e.id !== id),
        history: expense
          ? [
              ...state.history,
              {
                id: generateId(),
                date: new Date().toISOString(),
                action: 'remove' as const,
                expenseName: expense.name,
                amount: expense.monthly_amount,
                source: expense.source,
              },
            ]
          : state.history,
      }
    }),

  setPendingExpenses: (expenses) => set({ pendingExpenses: expenses }),

  confirmPending: () =>
    set((state) => ({
      expenses: [...state.expenses, ...state.pendingExpenses],
      pendingExpenses: [],
      history: [
        ...state.history,
        ...state.pendingExpenses.map((e) => ({
          id: generateId(),
          date: new Date().toISOString(),
          action: 'add' as const,
          expenseName: e.name,
          amount: e.monthly_amount,
          source: e.source,
        })),
      ],
    })),

  discardPending: () => set({ pendingExpenses: [] }),

  setTab1Status: (status, error?) =>
    set({ tab1Status: status, tab1Error: error ?? null }),

  openModal: (expense) => set({ activeModal: expense }),
  closeModal: () => set({ activeModal: null }),

  setTab2Report: (report) => set({ tab2Report: report }),

  setTab2Status: (status, error?) =>
    set({ tab2Status: status, tab2Error: error ?? null }),

  setBudget: (budget) => {
    if (budget !== null) {
      localStorage.setItem('financescope_budget', String(budget))
    } else {
      localStorage.removeItem('financescope_budget')
    }
    set({ budget })
  },
}))
