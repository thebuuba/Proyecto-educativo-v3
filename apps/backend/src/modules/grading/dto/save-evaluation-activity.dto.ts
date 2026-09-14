import { IsArray, IsDateString, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator'

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
  @IsIn(['b1', 'b2', 'b3', 'b4'])
  competencyBlockId!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string

  @IsNumber()
  @Min(0.01)
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
  @IsArray()
  @IsUUID('4', { each: true })
  teamIds?: string[]

  @IsOptional()
  @IsString()
  planningMoment?: 'inicio' | 'desarrollo' | 'cierre' | ''

  @IsOptional()
  @IsString()
  source?: 'grading' | 'planning'
}
