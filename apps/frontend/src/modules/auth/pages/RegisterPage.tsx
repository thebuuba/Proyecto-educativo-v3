import { Eye, EyeOff } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { FacebookIcon, FLOATING_ICONS, GoogleIcon } from '@/components/auth/AuthIcons'
import { AuthTransitionLink } from '@/modules/auth/components/AuthTransitionLink'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { isValidPassword } from '@/modules/auth/utils/password'

function getRegisterErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'No se pudo crear la cuenta. Intenta nuevamente.'
  if (error.message.toLowerCase().includes('already registered')) return 'Este correo ya está registrado'
  if (error.message.toLowerCase().includes('password should contain')) return 'La contraseña debe incluir una mayúscula, una minúscula y un número.'
  return error.message
}

export function RegisterPage() {
  const { loginWithProvider, register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)
  const passwordsMatch = Boolean(password && confirmPassword && password === confirmPassword)

  if (registered) return <Navigate to="/onboarding" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFullName || !trimmedEmail || !password || !confirmPassword) {
      setErrorMessage('Todos los campos son obligatorios.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }
    if (!isValidPassword(password)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres e incluir una mayúscula, una minúscula y un número.')
      return
    }
    if (!terms) {
      setErrorMessage('Debes aceptar los términos para crear la cuenta.')
      return
    }

    setIsSubmitting(true)
    try {
      await register({ email: trimmedEmail, password, fullName: trimmedFullName })
      setRegistered(true)
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-screen page-enter relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <AuthBackdrop />

      <div className="auth-panel dashboard-warm-shadow relative z-10 w-full max-w-sm rounded-3xl bg-card p-6 sm:p-8">
        <div className="mb-7 flex flex-col items-center">
          <div className="relative mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/16 text-lg font-extrabold text-foreground">
            AB
            <span className="absolute -right-1 -top-1 size-3 rounded-full bg-warning" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Empieza a organizar tu trabajo docente</p>
        </div>

        {errorMessage ? (
          <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-destructive/25 bg-destructive/14 px-4 py-3 text-foreground">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/24 text-xs font-extrabold">!</span>
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthField label="Nombre completo"><input type="text" placeholder="Ana García" required value={fullName} onChange={(event) => setFullName(event.target.value)} className="auth-input" /></AuthField>
          <AuthField label="Correo electrónico"><input type="email" placeholder="docente@escuela.edu" required value={email} onChange={(event) => setEmail(event.target.value)} className="auth-input" /></AuthField>

          <AuthField label="Contraseña">
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input pr-11" />
              <PasswordToggle show={showPassword} onClick={() => setShowPassword(!showPassword)} />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">Usa al menos 8 caracteres, una mayúscula, una minúscula y un número.</p>
          </AuthField>

          <AuthField label="Confirmar contraseña">
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={`auth-input pr-11 ${confirmPassword ? (passwordsMatch ? 'border-success/60' : 'border-destructive/60') : ''}`}
              />
              <PasswordToggle show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            </div>
            {confirmPassword ? (
              <div className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold ${passwordsMatch ? 'text-foreground' : 'text-foreground'}`}>
                <span className={`size-2 rounded-full ${passwordsMatch ? 'bg-success' : 'bg-destructive'}`} />
                {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
              </div>
            ) : null}
          </AuthField>

          <label className="flex cursor-pointer items-start gap-2 pt-1">
            <input
              type="checkbox"
              checked={terms}
              onChange={(event) => {
                setTerms(event.target.checked)
                if (errorMessage === 'Debes aceptar los términos para crear la cuenta.') setErrorMessage('')
              }}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
            />
            <span className="text-sm leading-snug text-muted-foreground">
              Acepto los <Link to="/terminos" target="_blank" rel="noopener noreferrer" className="font-extrabold text-foreground decoration-primary hover:underline">términos y condiciones</Link> y el <Link to="/privacidad" target="_blank" rel="noopener noreferrer" className="font-extrabold text-foreground decoration-primary hover:underline">aviso de privacidad</Link>.
            </span>
          </label>

          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary-hover active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">o regístrate con</span><div className="h-px flex-1 bg-border" /></div>

        <div className="grid grid-cols-2 gap-3">
          <ProviderButton onClick={() => loginWithProvider('google').catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar con Google.'))}><GoogleIcon /> Google</ProviderButton>
          <ProviderButton onClick={() => loginWithProvider('facebook').catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar con Facebook.'))}><FacebookIcon /> Facebook</ProviderButton>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">¿Ya tienes cuenta? <AuthTransitionLink to="/login" direction="back" className="font-extrabold text-foreground decoration-primary hover:underline">Iniciar sesión</AuthTransitionLink></p>
        <p className="mt-8 text-center text-xs text-muted-foreground/70">© {new Date().getFullYear()} Aula Base</p>
      </div>
    </main>
  )
}

function AuthBackdrop() {
  return <div className="pointer-events-none absolute inset-0">
    {FLOATING_ICONS.map((item, index) => <item.Icon key={index} style={{ position: 'absolute', top: item.top, left: item.left, width: item.size, height: item.size, color: 'var(--primary)', opacity: 0.055, transform: `translate(-50%, -50%) rotate(${item.rotate}deg)` }} strokeWidth={1.5} />)}
    <div className="absolute -right-32 -top-32 size-[30rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 70%)' }} />
    <div className="absolute -bottom-36 -left-32 size-[30rem] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--warning) 16%, transparent) 0%, transparent 70%)' }} />
  </div>
}

function AuthField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>{children}</label>
}

function PasswordToggle({ show, onClick }: { show: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground" aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
}

function ProviderButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted active:scale-[0.985]">{children}</button>
}
