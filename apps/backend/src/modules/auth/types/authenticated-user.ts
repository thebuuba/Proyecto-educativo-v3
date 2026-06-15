/**
 * Tipo que representa al usuario autenticado tras validar el token JWT.
 * Contiene la información mínima disponible en el contexto de la solicitud.
 */
export type AuthenticatedUser = {
  /** ID único del usuario. */
  id: string
  /** Correo electrónico del usuario. */
  email: string
  /** ID de la escuela a la que pertenece. */
  schoolId: string
  /** Lista de claves de roles asignados al usuario. */
  roles: string[]
}
