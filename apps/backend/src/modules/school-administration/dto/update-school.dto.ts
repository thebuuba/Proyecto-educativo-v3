import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string

  @IsOptional()
  @IsString()
  logoUrl?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sector?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  centerCode?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  schoolShift?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  primaryModality?: string

  @IsOptional()
  @IsString()
  enabledSubsystems?: string

  @IsOptional()
  @IsBoolean()
  officialExportsEnabled?: boolean
}
