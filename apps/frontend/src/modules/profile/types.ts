/**
 * @file Módulo de Perfil — Tipos y constantes
 */

/** Datos para actualizar el perfil del usuario */
export type UpdateProfileInput = {
  fullName: string
  phone: string | null
  avatarUrl: string | null
}
