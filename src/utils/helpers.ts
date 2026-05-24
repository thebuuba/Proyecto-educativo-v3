import { DB_ERROR } from '@/constants'

export function firstOrNull<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

const ERROR_MESSAGES: Record<string, string> = {
  [DB_ERROR.UNIQUE_VIOLATION]: 'Ya existe un registro con esos datos.',
  [DB_ERROR.PERMISSION_DENIED]: 'No tienes permiso para realizar esta acción.',
  [DB_ERROR.FOREIGN_KEY_VIOLATION]: 'No se puede eliminar porque tiene registros asociados.',
  [DB_ERROR.CHECK_VIOLATION]: 'El valor no cumple con las reglas de validación.',
  [DB_ERROR.UNDEFINED_COLUMN]: 'Error interno: columna no encontrada.',
}

export function getSupabaseErrorMessage(error: { message: string; code?: string }) {
  return ERROR_MESSAGES[error.code ?? ''] ?? (error.message || 'No se pudo completar la operación.')
}

export function assertNoSupabaseError(
  error: { message: string; code?: string } | null,
  fallbackMessage: string,
) {
  if (error) {
    throw new Error(getSupabaseErrorMessage(error) || fallbackMessage)
  }
}
