import { IsIn, IsOptional, IsString } from 'class-validator'

export const reportKinds = ['boletin', 'registro-grado', 'asistencia', 'rendimiento', 'promocion', 'todos'] as const
export const reportFormats = ['csv', 'xls', 'pdf'] as const

export class ExportReportDto {
  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsIn(reportKinds)
  kind?: (typeof reportKinds)[number]

  @IsOptional()
  @IsIn(reportFormats)
  format?: (typeof reportFormats)[number]

  @IsOptional()
  @IsString()
  studentId?: string

  @IsOptional()
  @IsString()
  sectionSubjectId?: string

  @IsOptional()
  @IsString()
  academicPeriodId?: string
}
