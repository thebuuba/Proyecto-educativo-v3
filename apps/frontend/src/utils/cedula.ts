export function formatCedula(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length !== 11) return raw
  return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10)}`
}

export function normalizeCedula(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidCedula(value: string): boolean {
  const digits = normalizeCedula(value)
  if (digits.length !== 11) return false

  return !/^(\d)\1{10}$/.test(digits)
}
