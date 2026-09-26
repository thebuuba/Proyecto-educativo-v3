import { GraduationCap, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LoginBrandPanel } from './LoginBrandPanel'

export function AccessFooter() {
  return <footer className="login-legal"><span><ShieldCheck size={13} />Conexión segura</span><Link to="/terminos">Términos</Link><Link to="/privacidad">Privacidad</Link></footer>
}

export function RegistrationLayout({ children, confirmation = false }: { children: ReactNode; confirmation?: boolean }) {
  return <main className="login-shell registration-shell page-enter">
    <LoginBrandPanel />
    <section className="login-main">
      <div className="login-mobile-brand"><span><GraduationCap size={20} /></span>Aula Base</div>
      <Link className="login-help" to="/contacto">¿Necesitas ayuda?</Link>
      <div className={`login-card register-card${confirmation ? ' confirm-email-card' : ''}`}>{children}</div>
      <AccessFooter />
    </section>
  </main>
}
