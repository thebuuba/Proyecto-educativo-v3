import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class UpdateAcademicPeriodDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsString()
  status?: string
}
