import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator'

export class UpsertAttendanceDto {
  @IsString()
  @IsIn(['class', 'daily'])
  type!: 'class' | 'daily'

  @IsString()
  enrollmentId!: string

  @IsOptional()
  @IsString()
  sectionSubjectId?: string

  @IsString()
  academicPeriodId!: string

  @IsDateString()
  attendanceDate!: string

  @IsString()
  status!: string

  @IsOptional()
  @IsString()
  notes?: string
}
