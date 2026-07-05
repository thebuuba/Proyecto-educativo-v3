import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreateSubjectDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsString()
  @MaxLength(200)
  code!: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  credits?: number
}
