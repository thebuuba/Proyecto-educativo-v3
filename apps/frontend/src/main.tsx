/**
 * Punto de entrada de la aplicación.
 * Renderiza el árbol de componentes en el DOM con soporte
 * para enrutamiento, autenticación y captura de errores.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { clearDevServiceWorker } from './clearDevServiceWorker'
import App from './App.tsx'
import { AuthProvider } from '@/modules/auth/context/AuthProvider'
import { ErrorBoundary } from '@/components/ui/ErrorFallback'

clearDevServiceWorker()

/** Renderiza la aplicación en el elemento raíz del DOM. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
