import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
import { AttendanceService } from './attendance.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findAll(user.schoolId, sectionSubjectId, date)
  }

  @Get('daily')
  findDaily(
    @CurrentUser() user: AuthenticatedUser,
    @Query('enrollmentId') enrollmentId?: string,
    @Query('sectionId') sectionId?: string,
    @Query('date') date?: string,
  ) {
    if (sectionId && date) {
      return this.attendanceService.findDailyBySection(user.schoolId, sectionId, date)
    }
    return this.attendanceService.findDaily(user.schoolId, enrollmentId, date)
  }

  @Get('students')
  getStudents(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('date') date?: string,
    @Query('sectionId') sectionId?: string,
    @Query('schoolYearId') schoolYearId?: string,
  ) {
    if (sectionId && schoolYearId) {
      return this.attendanceService.getStudentsBySection(user.schoolId, sectionId, schoolYearId)
    }
    return this.attendanceService.getStudents(user.schoolId, sectionSubjectId!, date!)
  }

  @Get('current-period')
  getCurrentPeriod(@CurrentUser() user: AuthenticatedUser) {
    return this.attendanceService.getCurrentPeriod(user.schoolId)
  }

  @Post('upsert')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  upsert(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.attendanceService.upsert(user.schoolId, body)
  }
}
