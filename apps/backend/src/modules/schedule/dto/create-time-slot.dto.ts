import { IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator'

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

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek?: number | null

  @IsOptional()
  @IsIn(['CLASS', 'BREAK', 'BREAKFAST', 'LUNCH', 'PAUSE', 'FREE'])
  blockType?: string

  @IsOptional()
  @IsUUID()
  journeyId?: string | null
}
