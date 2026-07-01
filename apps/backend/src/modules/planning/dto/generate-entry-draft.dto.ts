import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class GenerateEntryDraftDto {
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
