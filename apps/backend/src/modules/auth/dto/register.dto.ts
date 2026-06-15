/**
 * DTO para el registro de un nuevo usuario.
 * Contiene los datos necesarios para crear una cuenta
 * junto con la escuela asociada.
 */
import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  /** Nombre de la escuela. */
  @IsString()
  schoolName!: string

  /** Slug personalizado para la escuela (opcional). */
  @IsString()
  slug!: string

  /** Correo electrónico del usuario. */
  @IsEmail()
  email!: string

  /** Contraseña del usuario (mínimo 6 caracteres). */
  @IsString()
  @MinLength(6)
  password!: string

  /** Nombre completo del usuario. */
  @IsString()
  fullName!: string
}
