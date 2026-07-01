import { IsNumber, IsOptional, IsString, MaxLength, Min, Max } from 'class-validator'

export class UpdateScheduleEntryDto {
  @IsOptional()
  @IsString()
  sectionSubjectId?: string

  @IsOptional()
  @IsString()
  timeSlotId?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek?: number

  @IsOptional()
  @IsString()
  @MaxLength(200)
  room?: string
}
