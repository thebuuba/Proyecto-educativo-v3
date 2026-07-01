import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreateAcademicPeriodDto {
  @IsString()
  schoolYearId!: string

  @IsString()
  @MaxLength(200)
  name!: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number

  @IsDateString()
  startDate!: string

  @IsDateString()
  endDate!: string
}
