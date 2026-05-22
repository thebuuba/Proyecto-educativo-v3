type SupabaseConfig = {
  url: string
  anonKey: string
  isConfigured: boolean
}

const missingConfigMessage =
  'Faltan variables de entorno de Supabase. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local.'

export function getSupabaseConfig(): SupabaseConfig {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const isConfigured = Boolean(url && anonKey)

  if (!isConfigured && import.meta.env.DEV) {
    console.warn(missingConfigMessage)
  }

  return {
    url: url ?? '',
    anonKey: anonKey ?? '',
    isConfigured,
  }
}

export function getMissingSupabaseConfigMessage() {
  return missingConfigMessage
}
