import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateSchoolYearDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean
}
