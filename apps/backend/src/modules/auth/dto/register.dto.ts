/**
 * DTO para el registro de un nuevo usuario.
 * Contiene los datos necesarios para crear una cuenta
 * junto con la escuela asociada.
 */
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator'

export class RegisterDto {
  /** Nombre de la escuela. */
  @IsString()
  schoolName!: string

  /** Slug personalizado para la escuela (opcional). */
  @IsOptional()
  @IsString()
  slug?: string

  /** Correo electrónico del usuario. */
  @IsEmail()
  email!: string

  /** Contraseña del usuario (mínimo 8 caracteres, mayúscula, minúscula, dígito). */
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password must contain uppercase, lowercase, and a digit' })
  password!: string

  /** Nombre completo del usuario. */
  @IsString()
  fullName!: string
}
