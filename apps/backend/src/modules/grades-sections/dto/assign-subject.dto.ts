import { IsOptional, IsString } from 'class-validator'

export class AssignSubjectDto {
  @IsString()
  gradeId!: string

  @IsString()
  sectionId!: string

  @IsString()
  subjectId!: string

  @IsString()
  schoolYearId!: string

  @IsOptional()
  @IsString()
  teacherId?: string
}
