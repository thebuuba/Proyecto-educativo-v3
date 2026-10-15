/**
 * Cuenta atrás calculada con el reloj del servidor.
 *
 * Usa `serverNow` de la vista y mide el tiempo transcurrido desde su carga;
 * nunca autoriza nada, solo muestra cuánto falta. Si no hay fecha válida,
 * muestra el texto alternativo.
 */

import { useEffect, useMemo, useState } from 'react'

import {
  createServerClock,
  formatRemaining,
  msUntilServer,
} from '@/modules/billing/utils/billingFormat'

type ServerCountdownProps = {
  target: string | null | undefined
  serverNow: string
  fallback?: string
}

export function ServerCountdown({ target, serverNow, fallback = 'Sin fecha informada' }: ServerCountdownProps) {
  const [nowMs, setNowMs] = useState(() => Date.now())
  const clock = useMemo(() => createServerClock(serverNow), [serverNow])

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const remaining = msUntilServer(target, clock, nowMs)
  if (remaining === null) return <>{fallback}</>
  return <>{formatRemaining(remaining)}</>
}
