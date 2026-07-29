/**
 * DTO para el inicio de sesión.
 * Contiene las credenciales necesarias para autenticar a un usuario.
 */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  /** Correo electrónico del usuario. */
  @IsEmail()
  email!: string

  /** Contraseña del usuario. */
  @IsString()
  @IsNotEmpty()
  password!: string
}
