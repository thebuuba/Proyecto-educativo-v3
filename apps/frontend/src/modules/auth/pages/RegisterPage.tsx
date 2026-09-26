import { ArrowRight, Check, Circle, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FacebookIcon, GoogleIcon } from '@/components/auth/AuthIcons'
import { Button } from '@/components/ui/Button'
import { RegistrationLayout } from '@/modules/auth/components/RegistrationLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { isValidPassword } from '@/modules/auth/utils/password'

export function RegisterPage() {
  const { loginWithProvider, register, isAuthenticated, onboardingComplete, profileRequired } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [providerLoading, setProviderLoading] = useState(false)
  const busy = isSubmitting || providerLoading
  const passwordRules = [
    { label: '8 caracteres o más', valid: password.length >= 8 },
    { label: 'Una mayúscula', valid: /[A-Z]/.test(password) },
    { label: 'Una minúscula', valid: /[a-z]/.test(password) },
    { label: 'Un número', valid: /[0-9]/.test(password) },
  ]

  if (isAuthenticated && onboardingComplete) return <Navigate to="/inicio" replace />
  if (profileRequired || (isAuthenticated && onboardingComplete === false)) return <Navigate to="/onboarding" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const nextErrors: Record<string, string> = {}
    if (!fullName.trim()) nextErrors.fullName = 'Escribe tu nombre completo.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Escribe un correo electrónico válido.'
    if (!isValidPassword(password)) nextErrors.password = 'Tu contraseña debe cumplir los cuatro requisitos.'
    if (!confirmPassword || password !== confirmPassword) nextErrors.confirmPassword = 'Las contraseñas no coinciden.'
    if (!terms) nextErrors.terms = 'Acepta los términos y el aviso de privacidad para continuar.'
    setErrors(nextErrors)
    setErrorMessage('')
    if (Object.keys(nextErrors).length) return
    setIsSubmitting(true)
    try {
      const result = await register({ email: email.trim(), password, fullName: fullName.trim() })
      if (result === 'confirmation-required') {
        sessionStorage.setItem('aulabase:confirmation-email', email.trim())
        navigate('/registro/confirma-correo', { replace: true })
      } else {
        sessionStorage.removeItem('aulabase:confirmation-email')
        navigate('/onboarding', { replace: true })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear la cuenta. Intenta nuevamente.'
      setErrorMessage(/already registered/i.test(message) ? 'Este correo ya está registrado. Inicia sesión.' : message)
    } finally { setIsSubmitting(false) }
  }

  async function handleProvider(provider: 'google' | 'facebook') {
    if (busy) return
    setProviderLoading(true)
    setErrorMessage('')
    try { await loginWithProvider(provider) }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : 'No se pudo continuar con el proveedor.'); setProviderLoading(false) }
  }

  return <RegistrationLayout>
    <h1>Crea tu <span>cuenta</span></h1>
    <p className="login-subtitle">Empieza a organizar tu trabajo docente.</p>
    <div className="login-social">
      <button type="button" disabled={busy} onClick={() => void handleProvider('google')}><GoogleIcon />Google</button>
      <button type="button" disabled={busy} onClick={() => void handleProvider('facebook')}><FacebookIcon />Facebook</button>
    </div>
    <div className="login-divider"><span>O REGÍSTRATE CON TU CORREO</span></div>
    {errorMessage && <p role="alert" className="login-feedback login-error">{errorMessage}</p>}
    <form className="register-form" noValidate onSubmit={handleSubmit}>
      <RegisterField id="register-name" label="Nombre completo" icon={UserRound} autoComplete="name" placeholder="Ej.: María Altagracia Pérez" value={fullName} onChange={event => setFullName(event.target.value)} error={errors.fullName} disabled={busy} />
      <RegisterField id="register-email" label="Correo electrónico" icon={Mail} type="email" autoComplete="email" placeholder="nombre@centro.edu.do" value={email} onChange={event => setEmail(event.target.value)} error={errors.email} disabled={busy} />
      <div>
        <RegisterField id="register-password" label="Contraseña" icon={LockKeyhole} type="password" autoComplete="new-password" placeholder="Crea una contraseña" value={password} onChange={event => setPassword(event.target.value)} error={errors.password} disabled={busy} describedBy="password-requirements" />
        <div id="password-requirements" className="register-password-rules">
          <div className="register-strength" aria-hidden="true">{passwordRules.map((rule, index) => <span key={rule.label} className={index < passwordRules.filter(item => item.valid).length ? 'is-valid' : ''} />)}</div>
          <ul>{passwordRules.map(rule => <li key={rule.label} className={rule.valid ? 'is-valid' : ''}>{rule.valid ? <Check size={13} /> : <Circle size={13} />}<span>{rule.label}</span><span className="sr-only">{rule.valid ? ': cumplido' : ': pendiente'}</span></li>)}</ul>
        </div>
      </div>
      <RegisterField id="register-confirm" label="Confirmar contraseña" icon={LockKeyhole} type="password" autoComplete="new-password" placeholder="Repite la contraseña" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} error={errors.confirmPassword || (confirmPassword && password !== confirmPassword ? 'Las contraseñas no coinciden.' : '')} disabled={busy} />
      {confirmPassword && password === confirmPassword && <p className="register-match"><Check size={14} />Las contraseñas coinciden</p>}
      <div>
        <div className="register-terms">
          <input id="register-terms" type="checkbox" checked={terms} disabled={busy} aria-invalid={Boolean(errors.terms)} aria-describedby={errors.terms ? 'terms-error' : undefined} onChange={event => setTerms(event.target.checked)} />
          <label htmlFor="register-terms">Acepto los <Link target="_blank" rel="noopener noreferrer" to="/terminos">Términos y condiciones</Link> y el <Link target="_blank" rel="noopener noreferrer" to="/privacidad">Aviso de privacidad</Link> de Aula Base.</label>
        </div>
        {errors.terms && <p id="terms-error" className="register-field-error">{errors.terms}</p>}
      </div>
      <Button type="submit" className="register-submit" loading={isSubmitting} disabled={busy}>{isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}<ArrowRight size={16} /></Button>
    </form>
    <p className="login-signup">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
  </RegistrationLayout>
}

function RegisterField({ label, icon: Icon, error, describedBy, ...input }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; icon: typeof Mail; error?: string; describedBy?: string }) {
  const [visible, setVisible] = useState(false)
  const password = input.type === 'password'
  return <div className="register-field">
    <label className="login-label" htmlFor={input.id}>{label}</label>
    <div className="register-input-wrap"><Icon size={16} aria-hidden="true" />
      <input {...input} required type={password && visible ? 'text' : input.type} className="auth-input" aria-invalid={Boolean(error)} aria-describedby={[describedBy, error ? `${input.id}-error` : ''].filter(Boolean).join(' ') || undefined} />
      {password && <button type="button" disabled={input.disabled} aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
    </div>
    {error && <p id={`${input.id}-error`} className="register-field-error">{error}</p>}
  </div>
}
