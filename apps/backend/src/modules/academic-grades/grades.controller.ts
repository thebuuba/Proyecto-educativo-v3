import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { GradesService } from './grades.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('academic-grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private gradesService: GradesService) {}

  @Get()
  findAll(
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('academicPeriodId') academicPeriodId?: string,
  ) {
    return this.gradesService.findAll(sectionSubjectId, academicPeriodId)
  }

  @Get('section-subjects')
  getSectionSubjects() {
    return this.gradesService.getSectionSubjects()
  }

  @Get('academic-periods')
  getAcademicPeriods() {
    return this.gradesService.getAcademicPeriods()
  }

  @Get('students')
  getStudents(
    @Query('sectionSubjectId') sectionSubjectId: string,
    @Query('academicPeriodId') academicPeriodId: string,
  ) {
    return this.gradesService.getStudentsForGrading(sectionSubjectId, academicPeriodId)
  }

  @Post('save')
  saveGrade(@Body() body: any) {
    return this.gradesService.saveGrade(body)
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.gradesService.findByStudent(studentId)
  }
}
