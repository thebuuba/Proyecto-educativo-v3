import { IsOptional, IsString, MinLength, MaxLength, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class SearchSchoolsQueryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  q!: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number

  @IsOptional()
  @Type(() => Number)
  lat?: number

  @IsOptional()
  @Type(() => Number)
  lng?: number
}
