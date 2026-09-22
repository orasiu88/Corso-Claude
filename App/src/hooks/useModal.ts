import { useEffect, useRef } from 'react'
import { useAppStore } from '@store/useAppStore'

export function useModal() {
  const { activeModal, openModal, closeModal } = useAppStore()
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const open = (expense: Parameters<typeof openModal>[0], triggerEl: HTMLElement) => {
    lastFocusedRef.current = triggerEl
    openModal(expense)
  }

  // Escape key closes modal (WCAG 2.1.2)
  useEffect(() => {
    if (!activeModal) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [activeModal, closeModal])

  // Return focus to trigger on close (WCAG 2.4.3)
  useEffect(() => {
    if (!activeModal && lastFocusedRef.current) {
      lastFocusedRef.current.focus()
      lastFocusedRef.current = null
    }
  }, [activeModal])

  return { activeModal, open, close: closeModal }
}
