import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { GradesService } from './grades.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('academic-grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(private gradesService: GradesService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('academicPeriodId') academicPeriodId?: string,
  ) {
    return this.gradesService.findAll(user.schoolId, sectionSubjectId, academicPeriodId)
  }

  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesService.getSectionSubjects(user.schoolId)
  }

  @Get('academic-periods')
  getAcademicPeriods(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesService.getAcademicPeriods(user.schoolId)
  }

  @Get('students')
  getStudents(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId: string,
    @Query('academicPeriodId') academicPeriodId: string,
  ) {
    return this.gradesService.getStudentsForGrading(user.schoolId, sectionSubjectId, academicPeriodId)
  }

  @Post('save')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  saveGrade(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.gradesService.saveGrade(user.schoolId, body)
  }

  @Get('student/:studentId')
  findByStudent(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string) {
    return this.gradesService.findByStudent(user.schoolId, studentId)
  }
}
