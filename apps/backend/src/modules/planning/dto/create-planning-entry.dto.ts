import { IsArray, IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreatePlanningEntryDto {
  @IsString()
  sectionSubjectId!: string

  @IsString()
  academicPeriodId!: string

  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional() @IsString() @MaxLength(200) schoolNameSnapshot?: string
  @IsOptional() @IsString() @MaxLength(200) teacherNameSnapshot?: string
  @IsOptional() @IsString() @MaxLength(120) curricularArea?: string
  @IsOptional() @IsString() @MaxLength(80) educationLevel?: string
  @IsOptional() @IsString() @MaxLength(200) topic?: string
  @IsOptional() @IsString() @MaxLength(120) transversalAxis?: string
  @IsOptional() @IsArray() @IsString({ each: true }) fundamentalCompetencies?: string[]

  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  specificCompetence?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  achievementIndicator?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  contentConceptual?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  contentProcedural?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  contentAttitudinal?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  strategies?: string

  @IsOptional()
  @IsString()
  activities?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resources?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  evaluationMethod?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  durationMinutes?: number

  @IsOptional()
  @IsDateString()
  plannedDate?: string

  @IsOptional()
  @IsString()
  fundamentalCompetenceId?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  evidence?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  evaluationInstruments?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  linkedActivityIds?: string[]
}
