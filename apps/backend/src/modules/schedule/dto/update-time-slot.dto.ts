import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class UpdateTimeSlotDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @IsOptional()
  @IsString()
  startTime?: string

  @IsOptional()
  @IsString()
  endTime?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number
}
