/** Lee ajustes de entorno sin aceptar NaN, valores vacíos ni fuera de rango. */
export function numberSetting(env: Record<string, string | undefined>, key: string, fallback: number, min: number, max: number, integer = false) {
  const raw = env[key]?.trim()
  if (!raw) return fallback
  const value = Number(raw)
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    throw new Error(`${key} debe ser ${integer ? 'un entero' : 'un número'} entre ${min} y ${max}.`)
  }
  return value
}
