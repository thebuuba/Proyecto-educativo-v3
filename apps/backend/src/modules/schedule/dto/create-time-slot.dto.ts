import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreateTimeSlotDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsString()
  startTime!: string

  @IsString()
  endTime!: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number
}
