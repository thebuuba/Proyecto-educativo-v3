/**
 * Placeholder temporal.
 *
 * Reemplazar este archivo después de aplicar las migraciones en Supabase:
 *
 * npx supabase gen types typescript --project-id <project-id> \
 *   --schema public > src/services/supabase/database.types.ts
 *
 * No escribir tipos manuales de tablas aquí cuando la base de datos real esté
 * disponible; la fuente de verdad debe ser Supabase/PostgreSQL.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
