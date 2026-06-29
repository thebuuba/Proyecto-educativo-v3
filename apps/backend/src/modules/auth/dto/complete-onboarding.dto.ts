import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
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

  @IsString()
  startDate!: string

  @IsString()
  endDate!: string
}

class OnboardingPeriodDto {
  @IsString()
  name!: string

  @IsString()
  startDate!: string

  @IsString()
  endDate!: string
}

class OnboardingCourseDto {
  @IsString()
  gradeName!: string

  @IsString()
  sectionName!: string

  @IsString()
  subjectName!: string

  @IsString()
  subjectCode!: string
}

export class CompleteOnboardingDto {
  @IsString()
  supabaseAccessToken!: string

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

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OnboardingPeriodDto)
  periods!: OnboardingPeriodDto[]

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OnboardingCourseDto)
  courses!: OnboardingCourseDto[]
}
