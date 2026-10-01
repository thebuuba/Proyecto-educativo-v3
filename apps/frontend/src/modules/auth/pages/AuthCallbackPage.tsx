import { useEffect } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ApiError } from '@/services/apiClient'

export function AuthCallbackPage() {
  const { finishOAuthCallback } = useAuth()

  useEffect(() => {
    finishOAuthCallback()
      .then((result) => window.location.replace(result === 'profile-required' ? '/onboarding' : '/inicio'))
      .catch((error) => window.location.replace(
        error instanceof ApiError && error.message === 'VERIFICATION_REQUIRED'
          ? `/login?verify=${error.method === 'totp' ? 'totp' : 'email'}`
          : '/login',
      ))
  }, [finishOAuthCallback])

  return null
}
