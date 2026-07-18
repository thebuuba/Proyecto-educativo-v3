import { createClient } from '@supabase/supabase-js'

const REMEMBER_SESSION_KEY = 'aulabase:remember-session'

export function isRememberSessionEnabled() {
  return localStorage.getItem(REMEMBER_SESSION_KEY) === 'true'
}

export function setRememberSession(enabled: boolean) {
  if (enabled) localStorage.setItem(REMEMBER_SESSION_KEY, 'true')
  else localStorage.removeItem(REMEMBER_SESSION_KEY)
}

export const authSessionStorage = {
  getItem(key: string) {
    return (isRememberSessionEnabled() ? localStorage : sessionStorage).getItem(key)
  },
  setItem(key: string, value: string) {
    const selected = isRememberSessionEnabled() ? localStorage : sessionStorage
    const discarded = selected === localStorage ? sessionStorage : localStorage
    selected.setItem(key, value)
    discarded.removeItem(key)
  },
  removeItem(key: string) {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase frontend env is not configured.')
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
