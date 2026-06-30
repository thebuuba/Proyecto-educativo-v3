/**
 * DTO para la creación de estudiantes.
 *
 * Define las reglas de validación para los datos de entrada al
 * crear un nuevo estudiante en el sistema.
 */
import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator'

/**
 * DTO para la creación de un estudiante.
 *
 * Contiene los campos obligatorios (código, nombre, apellido, fecha de
 * nacimiento) y opcionales (documento, género, dirección) requeridos
 * para registrar un nuevo estudiante en el sistema.
 */
export class CreateStudentDto {
  @IsString()
  @MinLength(1)
  studentCode!: string

  @IsString()
  @MinLength(1)
  firstName!: string

  @IsString()
  @MinLength(1)
  lastName!: string

  @IsOptional()
  @IsString()
  documentId?: string

  @IsOptional()
  @IsDateString()
  birthDate?: string

  @IsOptional()
  @IsString()
  gender?: string

  @IsOptional()
  @IsString()
  address?: string
}
