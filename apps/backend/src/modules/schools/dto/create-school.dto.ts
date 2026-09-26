import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value

export class CreateSchoolDto {
  @Transform(trim)
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  name!: string

  @IsIn(['public', 'private'])
  sector!: 'public' | 'private'

  @Transform(trim)
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  district!: string

  @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() || undefined : value)
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9-]{1,20}$/)
  centerCode?: string
}
