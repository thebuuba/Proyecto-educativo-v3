/**
 * Hook de Suscripción y pagos.
 *
 * Carga la vista del titular desde el servidor y expone estados de carga,
 * error y reintento. No deduce cobertura ni importes en el navegador.
 */

import { useCallback, useEffect, useState } from 'react'

import { getBillingOverview } from '@/modules/billing/services/billingService'
import type { BillingOverview } from '@/modules/billing/types'
import { billingErrorMessage } from '@/modules/billing/utils/billingFormat'

/** Estado y acciones de lectura de la suscripción. */
export function useBilling() {
  const [overview, setOverview] = useState<BillingOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setOverview(await getBillingOverview())
    } catch (err) {
      setError(billingErrorMessage(err, 'No se pudo cargar tu suscripción.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { overview, loading, error, refetch }
}
