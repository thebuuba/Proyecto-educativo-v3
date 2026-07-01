/**
 * DTO para el inicio de sesión.
 * Contiene las credenciales necesarias para autenticar a un usuario.
 */
import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class LoginDto {
  /** Correo electrónico del usuario. */
  @IsEmail()
  email!: string

  /** Contraseña del usuario. */
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password must contain uppercase, lowercase, and a digit' })
  password!: string
}
