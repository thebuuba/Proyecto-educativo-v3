import { Type } from 'class-transformer'
import { ArrayMinSize, IsArray, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, ValidateNested } from 'class-validator'

export class ScheduleJourneyInputDto {
  @IsOptional()
  @IsUUID()
  id?: string

  @IsString()
  @MaxLength(80)
  name!: string

  @IsIn(['MORNING', 'AFTERNOON', 'NIGHT', 'EXTENDED', 'CUSTOM'])
  kind!: string

  @IsString()
  startTime!: string

  @IsString()
  endTime!: string

  @IsInt()
  @Min(1)
  sequence!: number
}

export class ScheduleBlockInputDto {
  @IsOptional()
  @IsUUID()
  id?: string

  @IsString()
  @MaxLength(120)
  name!: string

  @IsString()
  startTime!: string

  @IsString()
  endTime!: string

  @IsInt()
  @Min(1)
  sequence!: number

  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek!: number

  @IsIn(['CLASS', 'BREAK', 'BREAKFAST', 'LUNCH', 'PAUSE', 'FREE', 'GAP'])
  blockType!: string

  @IsString()
  journeyKey!: string

  @IsOptional()
  @IsIn(['MANUAL', 'INTER_JOURNEY_GAP'])
  blockSource?: string

  @IsOptional()
  @IsString()
  @MaxLength(160)
  sourceKey?: string
}

export class SaveScheduleStructureDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ScheduleJourneyInputDto)
  journeys!: ScheduleJourneyInputDto[]

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ScheduleBlockInputDto)
  blocks!: ScheduleBlockInputDto[]
}
