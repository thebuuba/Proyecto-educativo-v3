import { IsString, MaxLength } from 'class-validator'

export const MAX_CURRICULUM_TEXT_LENGTH = 50_000

export class PlanningActivitiesDto {
  @IsString() @MaxLength(MAX_CURRICULUM_TEXT_LENGTH) inicio!: string
  @IsString() @MaxLength(MAX_CURRICULUM_TEXT_LENGTH) desarrollo!: string
  @IsString() @MaxLength(MAX_CURRICULUM_TEXT_LENGTH) cierre!: string
}
