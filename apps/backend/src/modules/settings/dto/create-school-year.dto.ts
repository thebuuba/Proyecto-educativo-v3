import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateSchoolYearDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsDateString()
  startDate!: string

  @IsDateString()
  endDate!: string

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean
}
