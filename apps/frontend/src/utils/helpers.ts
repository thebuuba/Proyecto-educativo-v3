/**
 * Utilidades generales.
 */

/**
 * Retorna el primer elemento de un array, o el valor mismo si no es array,
 * o null si el valor es null/undefined/vacío.
 *
 * @param value - Valor o array de valores.
 * @returns El primer elemento, el valor mismo, o null.
 */
export function firstOrNull<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}
