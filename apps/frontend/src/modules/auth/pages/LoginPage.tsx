import { AlertTriangle, ArrowLeft, ArrowRight, CalendarCheck, CheckCircle, Eye, EyeOff, GraduationCap, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { FacebookIcon, GoogleIcon } from '@/components/auth/AuthIcons'
import { AuthTransitionLink } from '@/modules/auth/components/AuthTransitionLink'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { requestMagicLink, requestPasswordReset } from '@/modules/auth/services/authService'

type LocationState = { from?: { pathname?: string }; registered?: boolean }
type Account = { email: string; fullName: string; avatarUrl?: string | null; role?: string }
type Step = 'remembered' | 'email' | 'password' | 'link'
const accountKey = 'aulabase:last-account'

function rememberedAccount(): Account | null {
  try {
    const account = JSON.parse(localStorage.getItem(accountKey) ?? 'null') as Account | null
    return account?.email && account?.fullName ? account : null
  } catch { return null }
}
function greeting() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
}

export function LoginPage() {
  const { authError, isAuthenticated, loading, login, loginWithProvider, profileRequired } = useAuth()
  const location = useLocation()
  const [remembered] = useState(rememberedAccount)
  const [step, setStep] = useState<Step>(remembered ? 'remembered' : 'email')
  const [email, setEmail] = useState(remembered?.email ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const fromState = location.state as LocationState | null
  const from = fromState?.from?.pathname && !['/login', '/'].includes(fromState.from.pathname) ? fromState.from.pathname : '/inicio'
  if (!loading && isAuthenticated) return <Navigate to={from} replace />
  if (!loading && profileRequired) return <Navigate to="/onboarding" replace />

  function chooseEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    if (email.trim()) setStep('password')
  }
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)
    try { await login({ email: email.trim(), password }) }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión. Revisa tus credenciales.') }
    finally { setIsSubmitting(false) }
  }
  async function handleForgotPassword() {
    setErrorMessage('')
    setIsSubmitting(true)
    try { await requestPasswordReset(email.trim()); setForgotPasswordSent(true) }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : 'No se pudo enviar el correo.') }
    finally { setIsSubmitting(false) }
  }
  async function handleMagicLink() {
    setErrorMessage('')
    setIsSubmitting(true)
    try { await requestMagicLink(email.trim()); setStep('link') }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : 'No se pudo enviar el enlace de acceso.') }
    finally { setIsSubmitting(false) }
  }
  async function handleProvider(provider: 'google' | 'facebook') {
    setErrorMessage('')
    try { await loginWithProvider(provider) }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar con ' + provider + '.') }
  }

  return <main className="login-shell page-enter">
    <section className="login-brand" aria-label="Aula Base">
      <div className="login-brand-mark"><span className="login-brand-logo"><GraduationCap size={21} /></span><span><strong>Aula Base</strong><small>Sistema docente</small></span></div>
      <div className="login-brand-art" aria-hidden="true">
        <div className="login-class-card"><span>CLASE EN CURSO</span><strong>Ciencias Físicas · 3.º A</strong><div className="login-class-bottom"><b>5:10</b><i>MP</i><i>LG</i><i>AR</i><i>JM</i></div></div>
        <div className="login-attendance-card"><span><CalendarCheck size={17} /></span><div><strong>Asistencia registrada</strong><small>24/25 presentes</small><em /></div></div>
        <div className="login-alert-card"><span className="login-alert-icon"><AlertTriangle size={17} /></span><span><strong>2 estudiantes</strong> podrían ir a completiva</span></div>
      </div>
      <div className="login-brand-copy"><h2>Tu salón organizado, para que enseñes más y registres menos.</h2><ul><li><CalendarCheck />Pasa lista en segundos desde cualquier dispositivo</li><li><Sparkles />Alertas de estudiantes en riesgo y completivas</li><li><ShieldCheck />Alineado al currículo por competencias del MINERD</li></ul></div>
      <p className="login-brand-footer">© {new Date().getFullYear()} Aula Base · Hecho para docentes de República Dominicana</p>
    </section>
    <section className="login-main">
      <AuthTransitionLink to="/contacto" direction="forward" className="login-help">¿Necesitas ayuda?</AuthTransitionLink>
      <div className="login-card">
        {step === 'remembered' && <>
          <h1>{greeting()},<br /><span>bienvenido</span></h1><p className="login-subtitle">Entra a Aula Base para gestionar tus clases.</p>
          <div className="login-remembered-label">Continúa donde lo dejaste</div>
          <button className="login-account" type="button" onClick={() => { setEmail(remembered?.email ?? ''); setStep('password') }}><Avatar account={remembered} /><span className="login-account-copy"><strong>Continuar como {remembered?.fullName.split(' ')[0]}</strong><small>{remembered?.email}</small><em>{remembered?.role ?? 'Docente'}</em></span><span className="login-account-arrow"><ArrowRight size={16} /></span></button>
          <button className="login-text-button login-other-account" type="button" onClick={() => { setEmail(''); setStep('email') }}>Usar otra cuenta</button>
        </>}
        {step === 'email' && <>
          <h1>{greeting()},<br /><span>bienvenido</span></h1><p className="login-subtitle">Entra a Aula Base para gestionar tus clases.</p>
          <div className="login-social"><button type="button" onClick={() => void handleProvider('google')}><GoogleIcon />Google</button><button type="button" onClick={() => void handleProvider('facebook')}><span className="login-facebook"><FacebookIcon /></span>Facebook</button></div>
          <div className="login-divider"><span>O CON TU CORREO</span></div>
          <form onSubmit={chooseEmail}><label className="login-label" htmlFor="login-email">Correo electrónico</label><div className="login-email-wrap"><Mail size={16} /><input id="login-email" className="auth-input" type="email" autoComplete="email" placeholder="hombre@centro.edu.do" required value={email} onChange={event => { setEmail(event.target.value); setErrorMessage('') }} /></div><button className="login-primary" type="submit">Continuar <ArrowRight size={17} /></button></form>
        </>}
        {step === 'password' && <>
          <button className="login-back" type="button" onClick={() => { setStep(remembered && email === remembered.email ? 'remembered' : 'email'); setErrorMessage('') }}><ArrowLeft size={16} /> Atrás</button>
          <h1>Escribe tu<br /><span>contraseña</span></h1><p className="login-subtitle">Estás a un paso de entrar a tu panel.</p>
          <div className="login-chosen-account"><Avatar account={remembered?.email === email ? remembered : null} /><span><strong>{remembered?.email === email ? remembered.fullName : email}</strong><small>{email}</small></span><button type="button" onClick={() => setStep('email')}>Cambiar</button></div>
          <form onSubmit={handleLogin}><div className="login-field-heading"><label className="login-label" htmlFor="login-password">Contraseña</label><button type="button" onClick={() => void handleForgotPassword()}>¿La olvidaste?</button></div><div className="login-password-wrap"><input id="login-password" className="auth-input" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={event => { setPassword(event.target.value); setErrorMessage('') }} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><button className="login-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Entrando...' : 'Entrar'} <ArrowRight size={17} /></button></form>
          <button className="login-text-button login-magic" type="button" onClick={() => void handleMagicLink()} disabled={isSubmitting}>Entrar con un enlace al correo</button>
        </>}
        {step === 'link' && <><button className="login-back" type="button" onClick={() => setStep('password')}><ArrowLeft size={16} /> Atrás</button><h1>Revisa tu<br /><span>correo</span></h1><p className="login-subtitle">Enviamos un enlace de acceso a <strong>{email}</strong>.</p><div className="login-link-message"><CheckCircle size={20} /> Abre el enlace en tu correo para continuar de forma segura.</div><button className="login-text-button login-magic" type="button" onClick={() => void handleMagicLink()} disabled={isSubmitting}>Reenviar enlace</button></>}
        {(errorMessage || authError) && <div role="alert" className="login-feedback login-error">{errorMessage || authError}</div>}
        {fromState?.registered && !errorMessage && <div role="status" className="login-feedback">Cuenta creada. Ya puedes iniciar sesión.</div>}
        {forgotPasswordSent && !errorMessage && <div role="status" className="login-feedback">Te enviamos un correo para restablecer tu contraseña.</div>}
        <p className="login-signup">¿Tu centro aún no usa Aula Base? <AuthTransitionLink to="/registro" direction="forward">Solicitar acceso</AuthTransitionLink></p>
      </div>
      <footer className="login-legal"><span><ShieldCheck size={13} /> Conexión segura</span><AuthTransitionLink to="/terminos" direction="forward">Términos</AuthTransitionLink><AuthTransitionLink to="/privacidad" direction="forward">Privacidad</AuthTransitionLink></footer>
    </section>
  </main>
}

function Avatar({ account }: { account: Account | null }) {
  const initials = account?.fullName.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase() || '@'
  return account?.avatarUrl ? <img className="login-avatar" src={account.avatarUrl} alt="" /> : <span className="login-avatar login-avatar-fallback">{initials}</span>
}
