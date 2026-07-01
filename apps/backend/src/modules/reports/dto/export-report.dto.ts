import { IsOptional, IsString } from 'class-validator'

export class ExportReportDto {
  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsString()
  kind?: string

  @IsOptional()
  @IsString()
  format?: string

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
