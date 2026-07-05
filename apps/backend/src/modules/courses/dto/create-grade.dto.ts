import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreateGradeDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  level?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number

  @IsOptional()
  @IsString()
  academicLevelId?: string

  @IsOptional()
  @IsString()
  academicCycleId?: string

  @IsOptional()
  @IsString()
  defaultModalityId?: string
}
