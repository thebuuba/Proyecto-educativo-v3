import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoadingState } from '@/components/ui/LoadingState'
import { AppLayout } from '@/layouts/AppLayout'
import { RequireAuth } from '@/modules/auth/components/RequireAuth'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/pages/RegisterPage'
import { UnauthorizedPage } from '@/modules/auth/pages/UnauthorizedPage'
import { appRoutes } from '@/routes/appRoutes'

const routeFallback = <LoadingState />

function App() {
  return (
    <Suspense fallback={routeFallback}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
