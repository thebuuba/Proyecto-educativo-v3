const CEDULA_WEIGHTS = [7, 9, 8, 6, 5, 4, 3, 2, 1, 3]

export function formatCedula(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length !== 11) return raw
  return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10)}`
}

export function isValidCedula(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 11) return false

  const checkDigit = Number(digits[10])
  let sum = 0

  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * CEDULA_WEIGHTS[i]
  }

  const remainder = sum % 10
  const expected = remainder === 0 ? 0 : 10 - remainder

  return checkDigit === expected
}
