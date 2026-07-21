import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class GenerateAndCreateEntryDto {
  @IsOptional() @IsString() @MaxLength(200) schoolNameSnapshot?: string
  @IsOptional() @IsString() @MaxLength(200) teacherNameSnapshot?: string
  @IsOptional() @IsString() @MaxLength(120) curricularArea?: string
  @IsOptional() @IsString() @MaxLength(80) educationLevel?: string
  @IsOptional() @IsString() @MaxLength(200) topic?: string
  @IsOptional() @IsString() @MaxLength(120) transversalAxis?: string

  @IsString()
  academicPeriodId!: string

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

  @IsOptional()
  @IsString()
  fundamentalCompetenceId?: string

  @IsOptional()
  @IsDateString()
  plannedDate?: string
}
