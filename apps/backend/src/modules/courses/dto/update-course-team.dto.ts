import { PartialType } from '@nestjs/mapped-types'
import { CreateCourseTeamDto } from './create-course-team.dto'

export class UpdateCourseTeamDto extends PartialType(CreateCourseTeamDto) {}
