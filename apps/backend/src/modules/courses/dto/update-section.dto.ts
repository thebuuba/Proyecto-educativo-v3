import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number

  @IsOptional()
  @IsString()
  gradeId?: string

  @IsOptional()
  @IsString()
  status?: string
}
