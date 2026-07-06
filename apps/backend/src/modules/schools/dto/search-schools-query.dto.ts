import { IsOptional, IsString, MinLength, MaxLength, IsInt, Min, Max, IsNumber } from 'class-validator'
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
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(-90)
  @Max(90)
  lat?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(-180)
  @Max(180)
  lng?: number
}
