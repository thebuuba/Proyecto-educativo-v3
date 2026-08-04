import { IsString, MaxLength } from 'class-validator'

export class PlanningActivitiesDto {
  @IsString()
  @MaxLength(5000)
  inicio!: string

  @IsString()
  @MaxLength(5000)
  desarrollo!: string

  @IsString()
  @MaxLength(5000)
  cierre!: string
}
