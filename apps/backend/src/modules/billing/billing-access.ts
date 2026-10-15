import { HttpException, ServiceUnavailableException } from '@nestjs/common'
import { effectiveAccess } from './billing-store'
import { readBillingConfig } from './billing-policy'

export function isRecoveryRoute(path: string): boolean {
  return /^\/api\/v1\/(auth|billing|profile|onboarding|school-administration)(\/|$)/.test(path)
}

export async function enforceAcademicAccess(userId: string, path: string) {
  const config = readBillingConfig(process.env)
  // No commercial database dependency is introduced until the module is installed and enabled.
  if (!config.enabled || isRecoveryRoute(path)) return
  const access = await effectiveAccess(userId)
  if (access.enforced !== config.enforce) {
    throw new ServiceUnavailableException('El control comercial del servidor y de la base no coincide. Contacta soporte.')
  }
  if (!access.allowed) throw new HttpException({
    message: 'Tu cobertura docente ha vencido. Puedes gestionar pagos y solicitar soporte.',
    code: 'BILLING_ACCESS_REQUIRED', recoveryUrl: '/cuenta/suscripcion', reason: access.reason,
  }, access.reason === 'suspended' ? 403 : 402)
}
