import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import {
  getMissingSupabaseConfigMessage,
  getSupabaseConfig,
} from '@/services/supabase/config'
import type { Database } from '@/services/supabase/database.types'

function createUnavailableSupabaseClient(): SupabaseClient<Database> {
  return new Proxy({} as SupabaseClient<Database>, {
    get() {
      throw new Error(getMissingSupabaseConfigMessage())
    },
  })
}

const config = getSupabaseConfig()

export const isSupabaseConfigured = config.isConfigured

export const supabase: SupabaseClient<Database> = config.isConfigured
  ? createClient<Database>(config.url, config.anonKey)
  : createUnavailableSupabaseClient()
