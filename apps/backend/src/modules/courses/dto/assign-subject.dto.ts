import { IsOptional, IsString } from 'class-validator'

export class AssignSubjectDto {
  @IsString()
  gradeId!: string

  @IsString()
  sectionId!: string

  @IsString()
  subjectId!: string

  @IsOptional()
  @IsString()
  schoolYearId?: string

  @IsOptional()
  @IsString()
  teacherId?: string
}
