import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CourseTeamMemberDto {
  @IsUUID()
  enrollmentId!: string

  @IsOptional()
  @IsString()
  @MaxLength(80)
  role?: string
}

export class CreateCourseTeamDto {
  @IsString()
  @MaxLength(120)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string

  @IsOptional()
  @IsString()
  @MaxLength(40)
  icon?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @IsIn(['permanent', 'temporary'])
  teamType!: 'permanent' | 'temporary'

  @IsOptional()
  @IsDateString()
  startsAt?: string | null

  @IsOptional()
  @IsDateString()
  endsAt?: string | null

  @IsOptional()
  @IsIn(['activity', 'date', 'period', 'project', 'undefined'])
  validityType?: 'activity' | 'date' | 'period' | 'project' | 'undefined'

  @IsOptional()
  @IsUUID()
  validityReferenceId?: string | null

  @IsOptional()
  @IsIn(['P1', 'P2', 'P3', 'P4'])
  validityPeriod?: 'P1' | 'P2' | 'P3' | 'P4' | null

  @IsArray()
  @ArrayUnique((member: CourseTeamMemberDto) => member.enrollmentId)
  @ValidateNested({ each: true })
  @Type(() => CourseTeamMemberDto)
  members!: CourseTeamMemberDto[]
}
