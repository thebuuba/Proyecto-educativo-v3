/**
 * Componente raíz de la aplicación.
 * Define las rutas públicas y privadas con layouts, lazy loading
 * y protección por roles de usuario.
 */
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { ErrorBoundary } from '@/components/ui/ErrorFallback'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { AppLayout } from '@/layouts/AppLayout'
import { RequireAuth } from '@/modules/auth/components/RequireAuth'
import { appRoutes } from '@/routes/appRoutes'
import { getOAuthCallbackPath } from '@/utils/oauthCallback'

// ponytail: named-export resolver for lazy()
const lazyPage = (importFn: () => Promise<Record<string, unknown>>, exportName: string) =>
  lazy(() => importFn().then((m) => ({ default: m[exportName] as import('react').ComponentType })))

const LoginPage = lazyPage(() => import('@/modules/auth/pages/LoginPage'), 'LoginPage')
const AuthCallbackPage = lazyPage(() => import('@/modules/auth/pages/AuthCallbackPage'), 'AuthCallbackPage')
const OnboardingPage = lazyPage(() => import('@/modules/auth/pages/OnboardingPage'), 'OnboardingPage')
const RegisterPage = lazyPage(() => import('@/modules/auth/pages/RegisterPage'), 'RegisterPage')
const UnauthorizedPage = lazyPage(() => import('@/modules/auth/pages/UnauthorizedPage'), 'UnauthorizedPage')
const PromoPage = lazyPage(() => import('@/modules/promo/pages/PromoPage'), 'PromoPage')
const PrivacyPage = lazyPage(() => import('@/modules/promo/pages/PrivacyPage'), 'PrivacyPage')
const TermsPage = lazyPage(() => import('@/modules/promo/pages/TermsPage'), 'TermsPage')
const ContactPage = lazyPage(() => import('@/modules/promo/pages/ContactPage'), 'ContactPage')
const ResetPasswordPage = lazyPage(() => import('@/modules/auth/pages/ResetPasswordPage'), 'ResetPasswordPage')

/** Componente de carga mostrado durante la carga diferida de módulos. */
const routeFallback = <PageSkeleton />

/**
 * Componente principal de la aplicación.
 * Configura las rutas públicas (login, registro, sin acceso) y las
 * rutas privadas envueltas en AppLayout con protección RequireAuth.
 */
function App() {
  const location = useLocation()
  const oauthCallbackPath = getOAuthCallbackPath(location.pathname, location.search, location.hash)

  if (oauthCallbackPath) {
    return <Navigate to={oauthCallbackPath} replace />
  }

  return (
    <Suspense fallback={routeFallback}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<PromoPage />} />
        <Route path="/promo" element={<Navigate to="/" replace />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/sin-acceso" element={<UnauthorizedPage />} />
        <Route element={<AppLayout />}>
          {appRoutes.map((route) => {
            const Page = route.component
            const path = route.index ? undefined : route.path.replace(/^\//, '')

            return (
              <Route
                key={route.path}
                index={route.index}
                path={path}
                element={
                  <RequireAuth allowedRoles={route.allowedRoles}>
                    <ErrorBoundary key={route.path}>
                      <Page />
                    </ErrorBoundary>
                  </RequireAuth>
                }
              />
            )
          })}
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
