export function firstOrNull<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value
}

export function getSupabaseErrorMessage(error: { message: string; code?: string }) {
  if (error.code === '23505') {
    return 'Ya existe un registro con esos datos.'
  }

  if (error.code === '42501') {
    return 'No tienes permiso para realizar esta acción.'
  }

  return error.message || 'No se pudo completar la operación en Supabase.'
}

export function assertNoSupabaseError(
  error: { message: string; code?: string } | null,
  fallbackMessage: string,
) {
  if (error) {
    throw new Error(getSupabaseErrorMessage(error) || fallbackMessage)
  }
}
