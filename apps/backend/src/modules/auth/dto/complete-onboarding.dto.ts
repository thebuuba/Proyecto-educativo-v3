import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class OnboardingSchoolDto {
  @IsString()
  id!: string

  @IsString()
  name!: string

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

class OnboardingTeacherContextDto {
  @IsArray()
  @IsString({ each: true })
  levels!: string[]

  @IsArray()
  @IsString({ each: true })
  shifts!: string[]

  @IsArray()
  @IsString({ each: true })
  modalities!: string[]
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

  @ValidateNested()
  @Type(() => OnboardingTeacherContextDto)
  teacherContext!: OnboardingTeacherContextDto

  @IsOptional()
  @IsArray()
  periods?: unknown[]

  @IsOptional()
  @IsArray()
  courses?: unknown[]
}
