import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { RequireAuth } from '@/modules/auth/components/RequireAuth'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { UnauthorizedPage } from '@/modules/auth/pages/UnauthorizedPage'
import { appRoutes } from '@/routes/appRoutes'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sin-acceso" element={<UnauthorizedPage />} />
      <Route element={<AppLayout />}>
        {appRoutes.map((route) => {
          const Page = route.component
          const path = route.index ? undefined : route.path.replace(/^\//, '')
          const element = (
            <RequireAuth allowedRoles={route.allowedRoles}>
              <Page />
            </RequireAuth>
          )

          return route.index ? (
            <Route key={route.path} index element={element} />
          ) : (
            <Route key={route.path} path={path} element={element} />
          )
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
