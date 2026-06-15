/**
 * DTO para la creación de matrículas.
 *
 * Define las reglas de validación para inscribir a un estudiante
 * en un curso dentro del sistema.
 */
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator'

/**
 * DTO para la creación de una matrícula.
 *
 * Define los datos necesarios para inscribir a un estudiante en un
 * grado, sección y año escolar específicos.
 */
export class CreateEnrollmentDto {
  @IsString()
  studentId!: string

  @IsString()
  gradeId!: string

  @IsString()
  sectionId!: string

  @IsString()
  schoolYearId!: string

  @IsOptional()
  @IsDateString()
  enrollmentDate?: string

  @IsOptional()
  @IsString()
  academicStatus?: string

  @IsOptional()
  @IsBoolean()
  isRepeating?: boolean
}
