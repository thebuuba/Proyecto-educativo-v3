import { useEffect } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'

export function AuthCallbackPage() {
  const { finishOAuthCallback } = useAuth()

  useEffect(() => {
    finishOAuthCallback()
      .then((result) => window.location.replace(result === 'profile-required' ? '/onboarding' : '/inicio'))
      .catch(() => window.location.replace('/login'))
  }, [finishOAuthCallback])

  return null
}
