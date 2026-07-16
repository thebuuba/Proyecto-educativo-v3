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

  @IsArray()
  @ArrayUnique((member: CourseTeamMemberDto) => member.enrollmentId)
  @ValidateNested({ each: true })
  @Type(() => CourseTeamMemberDto)
  members!: CourseTeamMemberDto[]
}
