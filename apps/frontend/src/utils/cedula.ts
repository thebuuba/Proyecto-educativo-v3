/**
 * Utilidades para formato y validación de cédulas dominicanas.
 */

/**
 * Formatea una cédula agregando guiones (XXX-XXXXXXX-X).
 * Si no tiene exactamente 11 dígitos, retorna el valor original.
 *
 * @param raw - Valor sin formato.
 * @returns Cédula formateada o el valor original.
 */
export function formatCedula(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length !== 11) return raw
  return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10)}`
}

/**
 * Elimina todo excepto dígitos de una cédula.
 *
 * @param value - Valor a normalizar.
 * @returns Solo los dígitos.
 */
export function normalizeCedula(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Valida que una cédula tenga exactamente 11 dígitos
 * y no esté compuesta por un solo dígito repetido.
 *
 * @param value - Cédula a validar (con o sin formato).
 * @returns true si la cédula es válida.
 */
export function isValidCedula(value: string): boolean {
  const digits = normalizeCedula(value)
  if (digits.length !== 11) return false

  return !/^(\d)\1{10}$/.test(digits)
}
