/**
 * Componente raíz de la aplicación.
 * Define las rutas públicas y privadas con layouts, lazy loading
 * y protección por roles de usuario.
 */
import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoadingState } from '@/components/ui/LoadingState'
import { AppLayout } from '@/layouts/AppLayout'
import { RequireAuth } from '@/modules/auth/components/RequireAuth'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/pages/RegisterPage'
import { UnauthorizedPage } from '@/modules/auth/pages/UnauthorizedPage'
import { PromoPage } from '@/modules/promo/pages/PromoPage'
import { appRoutes } from '@/routes/appRoutes'

/** Componente de carga mostrado durante la carga diferida de módulos. */
const routeFallback = <LoadingState />

/**
 * Componente principal de la aplicación.
 * Configura las rutas públicas (login, registro, sin acceso) y las
 * rutas privadas envueltas en AppLayout con protección RequireAuth.
 */
function App() {
  return (
    <Suspense fallback={routeFallback}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/promo" element={<PromoPage />} />
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
                    <Page />
                  </RequireAuth>
                }
              />
            )
          })}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
