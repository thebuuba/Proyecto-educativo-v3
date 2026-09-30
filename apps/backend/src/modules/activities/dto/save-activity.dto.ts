import { IsArray, IsDateString, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator'
import type { InstrumentRecommendation } from '@aula/shared'
import { evaluationCatalogV1 } from '../../evaluation-instruments/catalog-v1'

export class SaveActivityDto {
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

  @IsOptional()
  @IsObject()
  competencyBlockWeights?: Record<string, number>

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0.01)
  @Max(10000)
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
  @IsIn(evaluationCatalogV1.activityTypes.map(({ id }) => id))
  pedagogicalActivityType?: string

  @IsOptional()
  @IsObject()
  instrumentSnapshot?: InstrumentRecommendation

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
