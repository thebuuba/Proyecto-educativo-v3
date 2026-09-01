import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

export class SaveJournalEntryDto {
  @IsIn(['quick_note', 'student_observation', 'incident', 'class_observation', 'pedagogical_idea', 'course_observation'])
  entryType!: string

  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string

  @IsString()
  @MaxLength(8000)
  content!: string

  @IsDateString()
  occurredAt!: string

  @IsOptional() @IsUUID() schoolYearId?: string
  @IsOptional() @IsUUID() sectionId?: string
  @IsOptional() @IsUUID() sectionSubjectId?: string
  @IsOptional() @IsUUID() academicPeriodId?: string

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags?: string[]

  @IsOptional() @Type(() => Boolean) @IsBoolean() requiresFollowUp?: boolean
  @IsOptional() @IsDateString() followUpDate?: string
  @IsOptional() @IsIn(['none', 'pending', 'completed']) followUpStatus?: string
}
