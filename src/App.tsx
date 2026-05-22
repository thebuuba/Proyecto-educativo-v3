import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/layouts/AppLayout'
import { appRoutes } from '@/routes/appRoutes'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {appRoutes.map((route) => {
          const Page = route.component
          const path = route.index ? undefined : route.path.replace(/^\//, '')

          return route.index ? (
            <Route key={route.path} index element={<Page />} />
          ) : (
            <Route key={route.path} path={path} element={<Page />} />
          )
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
