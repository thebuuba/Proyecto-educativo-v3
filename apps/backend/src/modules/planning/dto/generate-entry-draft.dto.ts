import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'
export class GenerateEntryDraftDto {
  @IsOptional() @IsString() @MaxLength(120) curricularArea?: string
  @IsOptional() @IsString() @MaxLength(80) educationLevel?: string
  @IsOptional() @IsString() @MaxLength(200) topic?: string
  @IsOptional() @IsString() @MaxLength(120) transversalAxis?: string
  @IsOptional() @IsString() @MaxLength(1000) curricularPolicyContext?: string

  @IsOptional()
  @IsString()
  sectionSubjectId?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  durationMinutes?: number

  @IsOptional()
  @IsString()
  @MaxLength(200)
  fundamentalCompetenceName?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  specificCompetence?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  achievementIndicator?: string

  @IsOptional() @IsString() @MaxLength(1000) contentConceptual?: string
  @IsOptional() @IsString() @MaxLength(1000) contentProcedural?: string
  @IsOptional() @IsString() @MaxLength(1000) contentAttitudinal?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  gradeName?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sectionName?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subjectName?: string
}
