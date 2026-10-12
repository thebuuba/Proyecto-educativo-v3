import { IsNumber, IsObject, IsOptional, IsString, Min, Max } from 'class-validator'

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

  @IsOptional()
  @IsString()
  evaluationActivityId?: string | null

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(10000)
  score!: number

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0.01)
  @Max(10000)
  maxScore?: number

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  weight?: number

  @IsOptional()
  @IsString()
  assessmentName?: string

  @IsOptional()
  @IsObject()
  instrumentResult?: Record<string, unknown> | null
}
