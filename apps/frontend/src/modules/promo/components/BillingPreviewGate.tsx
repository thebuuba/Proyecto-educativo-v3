import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { billingPreviewEnabled } from '@/config/billing-preview'

export function BillingPreviewGate({ children }: { children: ReactNode }) {
  return billingPreviewEnabled ? children : <Navigate to="/precios" replace />
}
