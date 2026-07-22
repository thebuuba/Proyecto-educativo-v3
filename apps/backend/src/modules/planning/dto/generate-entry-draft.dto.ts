import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'
import { MAX_CURRICULUM_TEXT_LENGTH } from './planning-curriculum-fields.dto'

export class GenerateEntryDraftDto {
  @IsOptional() @IsString() @MaxLength(120) curricularArea?: string
  @IsOptional() @IsString() @MaxLength(80) educationLevel?: string
  @IsOptional() @IsString() @MaxLength(200) topic?: string
  @IsOptional() @IsString() @MaxLength(120) transversalAxis?: string

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
  @MaxLength(MAX_CURRICULUM_TEXT_LENGTH)
  specificCompetence?: string

  @IsOptional()
  @IsString()
  @MaxLength(MAX_CURRICULUM_TEXT_LENGTH)
  achievementIndicator?: string

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
