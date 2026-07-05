import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator'

export class SaveGradeDto {
  @IsOptional()
  @IsString()
  gradeId?: string

  @IsOptional()
  @IsString()
  enrollmentId?: string

  @IsOptional()
  @IsString()
  sectionSubjectId?: string

  @IsOptional()
  @IsString()
  academicPeriodId?: string

  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxScore?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number

  @IsOptional()
  @IsString()
  assessmentName?: string
}
