import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class OnboardingSchoolDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  regionalName?: string

  @IsOptional()
  @IsString()
  districtName?: string

  @IsOptional()
  @IsString()
  primaryModality?: string

  @IsOptional()
  @IsString()
  schoolShift?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enabledSubsystems?: string[]
}

class OnboardingSchoolYearDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  startDate?: string

  @IsOptional()
  @IsString()
  endDate?: string
}

export class CompleteOnboardingDto {
  @IsString()
  fullName!: string

  @IsOptional()
  @IsEmail()
  email?: string

  @ValidateNested()
  @Type(() => OnboardingSchoolDto)
  school!: OnboardingSchoolDto

  @ValidateNested()
  @Type(() => OnboardingSchoolYearDto)
  schoolYear!: OnboardingSchoolYearDto

  @IsOptional()
  @IsArray()
  periods?: unknown[]

  @IsOptional()
  @IsArray()
  courses?: unknown[]
}
