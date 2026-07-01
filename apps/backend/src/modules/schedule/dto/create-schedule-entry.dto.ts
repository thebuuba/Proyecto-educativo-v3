import { IsNumber, IsOptional, IsString, MaxLength, Min, Max } from 'class-validator'

export class CreateScheduleEntryDto {
  @IsString()
  schoolYearId!: string

  @IsString()
  sectionId!: string

  @IsString()
  sectionSubjectId!: string

  @IsString()
  timeSlotId!: string

  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek!: number

  @IsOptional()
  @IsString()
  academicPeriodId?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  room?: string
}
