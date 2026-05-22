import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import {
  getMissingSupabaseConfigMessage,
  getSupabaseConfig,
} from '@/services/supabase/config'

function createUnavailableSupabaseClient(): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get() {
      throw new Error(getMissingSupabaseConfigMessage())
    },
  })
}

const config = getSupabaseConfig()

export const isSupabaseConfigured = config.isConfigured

export const supabase: SupabaseClient = config.isConfigured
  ? createClient(config.url, config.anonKey)
  : createUnavailableSupabaseClient()
