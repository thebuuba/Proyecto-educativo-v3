import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { FacebookIcon, GoogleIcon } from '@/components/auth/AuthIcons'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { createAulaSession, requestMagicLink, requestPasswordReset } from '@/modules/auth/services/authService'
import { supabase } from '@/modules/auth/services/supabaseClient'
import { ApiError } from '@/services/apiClient'
import { PromoLayout } from '@/modules/promo/components/PromoLayout'

type LocationState = { from?: { pathname?: string }; registered?: boolean }
type RememberedAccount = {
  email: string
  fullName?: string
  avatarUrl?: string | null
  role?: string
}

function getRememberedAccount(): RememberedAccount | null {
  try {
    const account = JSON.parse(
      localStorage.getItem('aulabase:last-account') ?? 'null',
    ) as Partial<RememberedAccount> | null
    return typeof account?.email === 'string' && account.email.trim()
      ? {
          email: account.email,
          fullName: typeof account.fullName === 'string' && account.fullName.trim() ? account.fullName : account.email,
          avatarUrl: account.avatarUrl,
          role: account.role,
        }
      : null
  } catch {
    return null
  }
}

export function LoginPage() {
  const { authError, isAuthenticated, loading, login, loginWithProvider, profileRequired, refreshAuth } =
    useAuth()
  const location = useLocation()
  const [rememberedAccount, setRememberedAccount] = useState(getRememberedAccount)
  const [rememberedAccountSelected, setRememberedAccountSelected] = useState(false)
  const [email, setEmail] = useState(() => rememberedAccount?.email ?? '')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'totp' | null>(null)
  const [totpCode, setTotpCode] = useState('')
  const requestedMethod = new URLSearchParams(location.search).get('verify')
  const activeVerification = verificationMethod
    ?? (requestedMethod === 'totp' ? 'totp' : requestedMethod === 'email' ? 'email' : null)
    ?? (authError?.startsWith('VERIFICATION_REQUIRED:') ? authError.endsWith(':totp') ? 'totp' : 'email' : null)

  useEffect(() => {
    if (!activeVerification || email) return
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    }).catch(() => undefined)
  }, [activeVerification, email])
  const fromState = location.state as LocationState | null
  const from =
    fromState?.from?.pathname && !['/login', '/'].includes(fromState.from.pathname)
      ? fromState.from.pathname
      : '/inicio'
  if (!loading && isAuthenticated) return <Navigate to={from} replace />
  if (!loading && profileRequired) return <Navigate to="/onboarding" replace />

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login({ email: email.trim(), password })
    } catch (err) {
      if (err instanceof ApiError && err.message === 'VERIFICATION_REQUIRED') {
        setVerificationMethod(err.method === 'totp' ? 'totp' : 'email')
        return
      }
      setError(
        err instanceof Error ? err.message : 'No se pudo iniciar sesión. Revisa tus credenciales.',
      )
    } finally {
      setBusy(false)
    }
  }
  async function resetPassword() {
    if (!email.trim()) {
      setError('Escribe tu correo para restablecer la contraseña.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await requestPasswordReset(email.trim())
      setFeedback('Te enviamos un correo para restablecer tu contraseña.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el correo.')
    } finally {
      setBusy(false)
    }
  }
  async function magicLink() {
    const accountEmail = email.trim()
    if (!accountEmail) {
      setError('Escribe tu correo para recibir el enlace de acceso.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await requestMagicLink(accountEmail)
      setFeedback('Enviamos un enlace de acceso a tu correo.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el enlace.')
    } finally {
      setBusy(false)
    }
  }
  async function provider(name: 'google' | 'facebook') {
    setBusy(true)
    setError('')
    try {
      await loginWithProvider(name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
      setBusy(false)
    }
  }
  async function verifyTotp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError) throw factorsError
      const factor = factors.totp[0]
      if (!factor) throw new Error('No encontramos un autenticador configurado.')
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: totpCode.trim() })
      if (verifyError) throw verifyError
      const { data } = await supabase.auth.getSession()
      if (!data.session?.access_token) throw new Error('Tu sesión expiró. Inicia sesión nuevamente.')
      await createAulaSession(data.session.access_token)
      await refreshAuth()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo verificar el código.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <PromoLayout>
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-14">
        <section className="rounded-[28px] bg-card p-6 shadow-sm sm:p-10">
          <div className="mb-8 grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap size={25} />
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight sm:text-3xl">Inicia sesión</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Entra a Aula Base para continuar con tu trabajo académico.
          </p>
          {(error || (authError && !authError.startsWith('VERIFICATION_REQUIRED:'))) && (
            <p
              role="alert"
              className="mt-6 rounded-2xl bg-destructive/12 p-4 text-sm text-destructive"
            >
              {error || authError}
            </p>
          )}
          {(feedback || fromState?.registered) && (
            <p role="status" className="mt-6 rounded-2xl bg-success/12 p-4 text-sm">
              {feedback || 'Cuenta creada. Ya puedes iniciar sesión.'}
            </p>
          )}
          {activeVerification ? (
            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-semibold">Verifica que eres tú</h2>
              <p className="text-sm text-muted-foreground">
                {activeVerification === 'totp'
                  ? 'Escribe el código de tu aplicación de autenticación.'
                  : 'Te enviaremos un enlace para confirmar el acceso desde este navegador.'}
              </p>
              {activeVerification === 'totp' ? (
                <form onSubmit={(event) => void verifyTotp(event)} className="space-y-4">
                  <label className="block text-sm font-medium">Código de verificación
                    <input className="auth-input mt-2" inputMode="numeric" autoComplete="one-time-code" value={totpCode} onChange={(event) => setTotpCode(event.target.value)} required />
                  </label>
                  <button type="submit" disabled={busy} className="min-h-12 w-full rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-60">Verificar</button>
                </form>
              ) : (
                <>
                  <label className="block text-sm font-medium">Correo electrónico
                    <input className="auth-input mt-2" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  </label>
                  <button type="button" disabled={busy} onClick={() => void magicLink()} className="min-h-12 w-full rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-60">Enviar enlace de verificación</button>
                </>
              )}
            </div>
          ) : rememberedAccount && !rememberedAccountSelected ? (
            <div className="mt-8">
              <p className="login-remembered-label">Continúa donde lo dejaste</p>
              <button
                type="button"
                className="login-account"
                onClick={() => setRememberedAccountSelected(true)}
              >
                <RememberedAvatar account={rememberedAccount} />
                <span className="login-account-copy">
                  <strong>
                    Continuar como {(rememberedAccount.fullName || rememberedAccount.email).trim().split(/\s+/)[0]}
                  </strong>
                  <small>{rememberedAccount.email}</small>
                  {rememberedAccount.role && <em>{rememberedAccount.role}</em>}
                </span>
                <span className="login-account-arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <button
                type="button"
                className="login-text-button login-other-account"
                onClick={() => {
                  setEmail('')
                  setPassword('')
                  setRememberedAccount(null)
                }}
              >
                Usar otra cuenta
              </button>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={submit}>
              {rememberedAccount && rememberedAccountSelected ? (
                <div className="login-chosen-account">
                  <RememberedAvatar account={rememberedAccount} />
                  <span>
                    <strong>{rememberedAccount.fullName}</strong>
                    <small>{rememberedAccount.email}</small>
                  </span>
                  <button type="button" onClick={() => setRememberedAccountSelected(false)}>
                    Cambiar
                  </button>
                </div>
              ) : (
                <label className="block text-sm font-medium">
                  Correo electrónico
                  <input
                    className="auth-input mt-2"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              )}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void resetPassword()}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    ¿La olvidaste?
                  </button>
                </div>
                <div className="relative mt-2">
                  <input
                    id="login-password"
                    className="auth-input pr-12"
                    type={visible ? 'text' : 'password'}
                    autoComplete="current-password"
                    autoFocus={Boolean(rememberedAccount && rememberedAccountSelected)}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={() => setVisible(!visible)}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground"
                  >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="min-h-12 w-full rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {busy ? 'Entrando…' : 'Entrar'}
              </button>
              <button type="button" disabled={busy} onClick={() => void magicLink()} className="login-text-button w-full text-center">
                Entrar con un enlace al correo
              </button>
            </form>
          )}
          <div className="my-7 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />O continúa con
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void provider('google')}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-border text-sm font-medium"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void provider('facebook')}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-border text-sm font-medium"
            >
              <FacebookIcon /> Facebook
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro" className="font-medium text-primary hover:underline">
              Crea una cuenta
            </Link>
          </p>
        </section>
      </div>
    </PromoLayout>
  )
}

function RememberedAvatar({ account }: { account: RememberedAccount }) {
  const initials = (account.fullName || account.email)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return account.avatarUrl ? (
    <img className="login-avatar" src={account.avatarUrl} alt="" />
  ) : (
    <span className="login-avatar login-avatar-fallback">{initials}</span>
  )
}
