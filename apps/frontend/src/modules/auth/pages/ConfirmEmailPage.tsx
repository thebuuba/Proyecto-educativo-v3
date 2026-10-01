import { ArrowLeft, Inbox, Link2, MailOpen, Settings } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { RegistrationLayout } from '@/modules/auth/components/RegistrationLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function ConfirmEmailPage() {
  const { isAuthenticated, profileRequired, onboardingComplete } = useAuth()
  const email = sessionStorage.getItem('aulabase:confirmation-email')
  if (isAuthenticated || profileRequired)
    return <Navigate to={onboardingComplete ? '/inicio' : '/onboarding'} replace />
  return (
    <RegistrationLayout confirmation>
      <div className="confirm-email-icon">
        <Inbox size={32} />
      </div>
      <h1 className="text-3xl font-semibold">
        Revisa tu <span className="text-primary">correo</span>
      </h1>
      <p className="confirm-email-description">
        Tu cuenta fue creada. Para continuar, confirma tu dirección de correo abriendo el enlace que
        enviamos{email ? ' a:' : '.'}
      </p>
      {email && <p className="confirm-email-address">{email}</p>}
      <ol className="confirm-email-steps">
        <li>
          <MailOpen size={16} />
          <p>
            <strong>1.</strong> Abre el correo que te enviamos desde Aula Base.
          </p>
        </li>
        <li>
          <Link2 size={16} />
          <p>
            <strong>2.</strong> Pulsa el enlace de confirmación incluido en el mensaje.
          </p>
        </li>
        <li>
          <Settings size={16} />
          <p>
            <strong>3.</strong> Volverás a Aula Base para configurar tu espacio de trabajo.
          </p>
        </li>
      </ol>
      <p className="confirm-email-hint">
        ¿No lo encuentras? Revisa las carpetas de spam o promociones.
      </p>
      <div className="confirm-email-actions">
        <Link
          to="/registro"
          onClick={() => sessionStorage.removeItem('aulabase:confirmation-email')}
        >
          Usar otro correo
        </Link>
        <Link to="/login">
          <ArrowLeft size={13} />
          Ir a iniciar sesión
        </Link>
      </div>
    </RegistrationLayout>
  )
}
