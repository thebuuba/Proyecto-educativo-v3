import { Type } from 'class-transformer'
import { IsArray, IsDateString, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator'
import {
  MAX_CURRICULUM_TEXT_LENGTH,
  PlanningActivitiesDto,
} from './planning-curriculum-fields.dto'

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
  @IsOptional() @IsString() @MaxLength(20) curriculumVersion?: string
  @IsOptional() @IsString() @MaxLength(80) curriculumOrdinance?: string
  @IsOptional() @IsString() @MaxLength(40) curriculumSourcePages?: string
  @IsOptional() @IsArray() @IsString({ each: true }) fundamentalCompetencies?: string[]

  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number

  @IsOptional()
  @IsString()
  @MaxLength(MAX_CURRICULUM_TEXT_LENGTH)
  specificCompetence?: string

  @IsOptional()
  @IsString()
  @MaxLength(MAX_CURRICULUM_TEXT_LENGTH)
  achievementIndicator?: string

  @IsOptional()
  @IsString()
  @MaxLength(MAX_CURRICULUM_TEXT_LENGTH)
  contentConceptual?: string

  @IsOptional()
  @IsString()
  @MaxLength(MAX_CURRICULUM_TEXT_LENGTH)
  contentProcedural?: string

  @IsOptional()
  @IsString()
  @MaxLength(MAX_CURRICULUM_TEXT_LENGTH)
  contentAttitudinal?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  strategies?: string

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PlanningActivitiesDto)
  activities?: PlanningActivitiesDto

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
