import { ArrayMaxSize, IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator'
import { evaluationCatalogCurrent } from './catalog-current'
import { ACTIVITY_DESCRIPTION_MAX_LENGTH, INSTRUMENT_MAX_CRITERIA } from '@aula/shared'

export class RecommendInstrumentDto {
  @IsUUID() sectionSubjectId!: string
  @IsString() @MinLength(1) @MaxLength(300) activityTitle!: string
  @IsOptional() @IsString() @MaxLength(ACTIVITY_DESCRIPTION_MAX_LENGTH) description?: string
  @IsOptional() @IsString() @MaxLength(100) evaluationTechnique?: string
  @IsOptional() @IsString() @MaxLength(2000) evidenceInstructions?: string
  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) @MaxLength(150, { each: true }) resources?: string[]
  @IsOptional() @IsArray() @ArrayMaxSize(12) @IsString({ each: true }) @MaxLength(300, { each: true }) evaluationPriorities?: string[]
  @IsOptional() @IsIn(['INDIVIDUAL', 'GROUP']) organizationMode?: 'INDIVIDUAL' | 'GROUP'
  @IsOptional() @IsIn(['inicio', 'desarrollo', 'cierre']) planningMoment?: 'inicio' | 'desarrollo' | 'cierre'
  @IsIn(['INDIVIDUAL', 'GROUP']) participationMode!: 'INDIVIDUAL' | 'GROUP'
  @IsOptional() @IsIn(evaluationCatalogCurrent.activityTypes.map(a => a.id)) pedagogicalActivityType?: string
  @IsNumber({ maxDecimalPlaces: 2, allowInfinity: false, allowNaN: false }) @Min(0.01) @Max(10000) maxScore!: number
  @IsOptional() @IsIn(['b1', 'b2', 'b3', 'b4']) competencyBlock?: string
  @IsOptional() @IsIn([4, 5]) levelCount?: 4 | 5
  @IsOptional() @IsIn(['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']) preferredInstrumentType?: 'rubrica' | 'lista-cotejo' | 'escala' | 'lista-ponderada'
  @IsOptional() @IsBoolean() includeAdditionalCandidates?: boolean
  // Imported curriculum elements use deterministic UUID v5 identifiers.
  @IsOptional() @IsArray() @ArrayMaxSize(INSTRUMENT_MAX_CRITERIA) @IsUUID('all', { each: true }) selectedCurriculumElementIds?: string[]
  /** Explicit DRAFT selection permitted for development; omission selects PUBLISHED only. */
  @IsOptional() @IsUUID() curriculumVersionId?: string
  @IsOptional() @IsUUID() curriculumScopeId?: string
}

export class InterpretActivityDto {
  @IsUUID() sectionSubjectId!: string
  @IsString() @MinLength(1) @MaxLength(300) activityTitle!: string
  @IsOptional() @IsString() @MaxLength(ACTIVITY_DESCRIPTION_MAX_LENGTH) description?: string
  @IsOptional() @IsString() @MaxLength(100) evaluationTechnique?: string
  @IsOptional() @IsString() @MaxLength(2000) evidenceInstructions?: string
  @IsOptional() @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) @MaxLength(150, { each: true }) resources?: string[]
  @IsOptional() @IsArray() @ArrayMaxSize(12) @IsString({ each: true }) @MaxLength(300, { each: true }) evaluationPriorities?: string[]
  @IsOptional() @IsIn(['INDIVIDUAL', 'GROUP']) organizationMode?: 'INDIVIDUAL' | 'GROUP'
  @IsOptional() @IsIn(['inicio', 'desarrollo', 'cierre']) planningMoment?: 'inicio' | 'desarrollo' | 'cierre'
  @IsOptional() @IsIn(['INDIVIDUAL', 'GROUP']) participationMode?: 'INDIVIDUAL' | 'GROUP'
  @IsOptional() @IsIn(evaluationCatalogCurrent.activityTypes.map(a => a.id)) pedagogicalActivityType?: string
  @IsOptional() @IsIn(['b1', 'b2', 'b3', 'b4']) competencyBlock?: string
  @IsOptional() @IsUUID() curriculumVersionId?: string
}
