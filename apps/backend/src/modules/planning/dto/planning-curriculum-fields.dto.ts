import { Type } from 'class-transformer'
import { IsArray, IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator'

export const MAX_CURRICULUM_TEXT_LENGTH = 50_000

export class PlanningDayDto {
  @IsInt() @Min(1) @Max(30) day!: number
  @IsOptional() @IsDateString() date?: string | null
  @IsString() @MaxLength(10_000) inicio!: string
  @IsString() @MaxLength(10_000) desarrollo!: string
  @IsString() @MaxLength(10_000) cierre!: string
  @IsString() @MaxLength(10_000) evidence!: string
  @IsString() @MaxLength(10_000) evaluationMethod!: string
  @IsOptional() @IsString() @MaxLength(10_000) evaluationInstruments?: string
  @IsOptional() @IsString() @MaxLength(10_000) metacognition?: string
  @IsOptional() @IsString() @MaxLength(10_000) resources?: string
}

export class PlanningActivitiesDto {
  @IsString() @MaxLength(MAX_CURRICULUM_TEXT_LENGTH) inicio!: string
  @IsString() @MaxLength(MAX_CURRICULUM_TEXT_LENGTH) desarrollo!: string
  @IsString() @MaxLength(MAX_CURRICULUM_TEXT_LENGTH) cierre!: string
  @IsOptional() @IsString() @MaxLength(MAX_CURRICULUM_TEXT_LENGTH) learningSituation?: string
  @IsOptional() @IsString() @MaxLength(MAX_CURRICULUM_TEXT_LENGTH) metacognition?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanningDayDto)
  days?: PlanningDayDto[]
}
