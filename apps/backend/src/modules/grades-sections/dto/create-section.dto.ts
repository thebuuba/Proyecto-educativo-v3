import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreateSectionDto {
  @IsString()
  gradeId!: string

  @IsString()
  @MaxLength(200)
  name!: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number
}
