// Únicamente formato: una moneda ausente no se sustituye por la del prototipo.
export function formatCurrency(value, currency) {
  if (!currency || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('es', {style:'currency',currency}).format(value)
}
