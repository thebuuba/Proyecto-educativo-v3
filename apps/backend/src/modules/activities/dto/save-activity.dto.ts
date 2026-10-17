import { IsArray, Matches, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator'
import { teachingStrategies, type TeachingStrategyOrigin, type InstrumentRecommendation } from '@aula/shared'
import { evaluationCatalogCurrent } from '../../evaluation-instruments/catalog-current'

export class SaveActivityDto {
  @IsOptional()
  @IsUUID('4')
  creationId?: string

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
  @Matches(/^(?:\d{4}-\d{2}-\d{2})?$/)
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
  @IsIn(['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'])
  instrumentType?: string

  @IsOptional()
  @IsObject()
  instrumentCriteria?: Record<string, string>

  @IsOptional()
  @IsIn(evaluationCatalogCurrent.activityTypes.map(({ id }) => id))
  pedagogicalActivityType?: string

  @IsOptional()
  @IsIn(teachingStrategies.map(strategy => strategy.id))
  teachingStrategyId?: string | null

  @IsOptional()
  @IsIn(['AUTO', 'MANUAL', 'UNKNOWN'])
  teachingStrategyOrigin?: TeachingStrategyOrigin

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
  @IsIn(['individual', 'group'])
  activityType?: 'individual' | 'group'

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  teamIds?: string[]

  @IsOptional()
  @IsString()
  @IsIn(['inicio', 'desarrollo', 'cierre', ''])
  planningMoment?: 'inicio' | 'desarrollo' | 'cierre' | ''

  @IsOptional()
  @IsString()
  @IsIn(['grading', 'planning'])
  source?: 'grading' | 'planning'
}
