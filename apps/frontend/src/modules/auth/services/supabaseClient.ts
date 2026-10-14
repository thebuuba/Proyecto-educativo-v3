import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase frontend env is not configured.')
}

const authStorageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`

// La elección se conserva durante OAuth y, solo con consentimiento, entre reinicios.
const rememberKey = `${authStorageKey}:remember`
const verifierKey = `${authStorageKey}-code-verifier`
const verifierExpiryKey = `${verifierKey}:expires-at`
const AUTH_FLOW_MAX_AGE_MS = 60 * 60 * 1000
const storageKeys = new Set([authStorageKey, verifierKey, `${authStorageKey}-user`])

export function isRememberSessionEnabled() {
  return (sessionStorage.getItem(rememberKey) ?? localStorage.getItem(rememberKey)) === 'true'
}

export function setRememberSessionEnabled(enabled: boolean) {
  const source = enabled ? sessionStorage : localStorage
  const destination = enabled ? localStorage : sessionStorage
  // Mueve los tokens sin conservar una segunda copia persistente.
  for (const key of storageKeys) {
    if (key === verifierKey) continue
    const value = source.getItem(key)
    if (value !== null) destination.setItem(key, value)
    source.removeItem(key)
  }
  sessionStorage.setItem(rememberKey, String(enabled))
  if (enabled) localStorage.setItem(rememberKey, 'true')
  else localStorage.removeItem(rememberKey)
}

export const authSessionStorage = {
  getItem(key: string) {
    storageKeys.add(key)
    // Los enlaces de correo pueden abrir otra pestaña: el verificador no es una sesión.
    if (key === verifierKey) {
      const expiresAt = Number(localStorage.getItem(verifierExpiryKey))
      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        localStorage.removeItem(verifierKey)
        localStorage.removeItem(verifierExpiryKey)
        sessionStorage.removeItem(verifierKey)
        return null
      }
      return localStorage.getItem(verifierKey)
    }
    // Nunca restaura una sesión persistente sin consentimiento explícito.
    return (isRememberSessionEnabled() ? localStorage : sessionStorage).getItem(key)
  },
  setItem(key: string, value: string) {
    storageKeys.add(key)
    if (key === verifierKey) {
      localStorage.setItem(verifierExpiryKey, String(Date.now() + AUTH_FLOW_MAX_AGE_MS))
      localStorage.setItem(verifierKey, value)
      sessionStorage.removeItem(verifierKey)
      return
    }
    const remember = isRememberSessionEnabled()
    const destination = remember ? localStorage : sessionStorage
    const otherStorage = remember ? sessionStorage : localStorage
    destination.setItem(key, value)
    otherStorage.removeItem(key)
  },
  removeItem(key: string) {
    if (key === verifierKey) localStorage.removeItem(verifierExpiryKey)
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
}

export function clearPersistedSupabaseSession() {
  for (const key of storageKeys) authSessionStorage.removeItem(key)
  localStorage.removeItem(rememberKey)
  sessionStorage.removeItem(rememberKey)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
    storage: authSessionStorage,
  },
})
