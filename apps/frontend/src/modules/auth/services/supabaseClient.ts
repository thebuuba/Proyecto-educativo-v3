import { createClient } from '@supabase/supabase-js'

export function isRememberSessionEnabled() {
  return true
}

export const authSessionStorage = {
  getItem(key: string) {
    const value = localStorage.getItem(key) ?? sessionStorage.getItem(key)
    if (value && !localStorage.getItem(key)) localStorage.setItem(key, value)
    sessionStorage.removeItem(key)
    return value
  },
  setItem(key: string, value: string) {
    localStorage.setItem(key, value)
    sessionStorage.removeItem(key)
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
