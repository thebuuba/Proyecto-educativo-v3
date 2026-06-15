/**
 * DTO para la actualización de estudiantes.
 *
 * Define los campos opcionales para modificar los datos de un
 * estudiante existente en el sistema.
 */
import { PartialType } from '@nestjs/mapped-types'
import { CreateStudentDto } from './create-student.dto'

/**
 * DTO para la actualización de un estudiante.
 *
 * Hereda de CreateStudentDto con todos sus campos opcionales,
 * permitiendo actualizar parcialmente los datos de un estudiante.
 */
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
