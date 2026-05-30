import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
import { AttendanceService } from './attendance.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Get()
  findAll(
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findAll(sectionSubjectId, date)
  }

  @Get('daily')
  findDaily(
    @Query('enrollmentId') enrollmentId?: string,
    @Query('sectionId') sectionId?: string,
    @Query('date') date?: string,
  ) {
    if (sectionId && date) {
      return this.attendanceService.findDailyBySection(sectionId, date)
    }
    return this.attendanceService.findDaily(enrollmentId, date)
  }

  @Get('students')
  getStudents(
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('date') date?: string,
    @Query('sectionId') sectionId?: string,
    @Query('schoolYearId') schoolYearId?: string,
  ) {
    if (sectionId && schoolYearId) {
      return this.attendanceService.getStudentsBySection(sectionId, schoolYearId)
    }
    return this.attendanceService.getStudents(sectionSubjectId!, date!)
  }

  @Get('current-period')
  getCurrentPeriod() {
    return this.attendanceService.getCurrentPeriod()
  }

  @Post('upsert')
  upsert(@Body() body: any) {
    return this.attendanceService.upsert(body)
  }
}
