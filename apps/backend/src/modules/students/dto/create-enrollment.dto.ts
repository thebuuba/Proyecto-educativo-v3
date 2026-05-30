import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator'

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
