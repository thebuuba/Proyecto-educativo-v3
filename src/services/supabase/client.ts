import { createClient } from '@supabase/supabase-js'

import {
  getMissingSupabaseConfigMessage,
  getSupabaseConfig,
} from '@/services/supabase/config'
import type { Database } from '@/types/database.types'

const config = getSupabaseConfig()

type TypedSupabaseClient = ReturnType<typeof createTypedClient>

function createTypedClient() {
  return createClient<Database>(config.url, config.anonKey)
}

function createUnavailableSupabaseClient(): TypedSupabaseClient {
  return new Proxy({} as TypedSupabaseClient, {
    get() {
      throw new Error(getMissingSupabaseConfigMessage())
    },
  })
}

export const isSupabaseConfigured = config.isConfigured

export const supabase: TypedSupabaseClient = config.isConfigured
  ? createTypedClient()
  : createUnavailableSupabaseClient()
