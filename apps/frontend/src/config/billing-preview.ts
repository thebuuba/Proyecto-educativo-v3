/** Una simulación nunca debe convertirse en un estado de pago de producción. */
export function billingPreviewAllowed(development: boolean, enabled: string | undefined) {
  return development && enabled === 'true'
}
export const billingPreviewEnabled = billingPreviewAllowed(import.meta.env.DEV, import.meta.env.VITE_BILLING_PREVIEW_ENABLED)
