import { IsArray, IsDateString, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class SaveEvaluationActivityDto {
  @IsOptional()
  @IsString()
  id?: string

  @IsString()
  sectionSubjectId!: string

  @IsString()
  academicPeriodId!: string

  @IsOptional()
  @IsString()
  schoolYearId?: string

  @IsOptional()
  @IsString()
  planningEntryId?: string | null

  @IsOptional()
  @IsString()
  instrumentId?: string | null

  @IsString()
  competencyBlockId!: string

  @IsString()
  @MaxLength(200)
  name!: string

  @IsNumber()
  @Min(0)
  maxScore!: number

  @IsOptional()
  @IsDateString()
  date?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  studentRole?: string

  @IsOptional()
  @IsString()
  teacherRole?: string

  @IsOptional()
  @IsString()
  instrumentType?: string

  @IsOptional()
  @IsObject()
  instrumentCriteria?: Record<string, string>

  @IsOptional()
  @IsString()
  evaluationTechnique?: string

  @IsOptional()
  @IsString()
  observations?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resources?: string[]

  @IsOptional()
  @IsString()
  evidenceInstructions?: string

  @IsOptional()
  @IsString()
  activityType?: 'individual' | 'group'

  @IsOptional()
  @IsString()
  planningMoment?: 'inicio' | 'desarrollo' | 'cierre' | ''

  @IsOptional()
  @IsString()
  source?: 'grading' | 'planning'
}
