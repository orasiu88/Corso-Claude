export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function toMonthlyAmount(amount: number, frequency: 'mensile' | 'annuale'): number {
  return frequency === 'annuale' ? amount / 12 : amount
}
