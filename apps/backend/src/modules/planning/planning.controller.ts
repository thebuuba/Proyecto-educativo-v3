import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PlanningService } from './planning.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('planning')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanningController {
  constructor(private planningService: PlanningService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query('sectionSubjectId') sectionSubjectId?: string) {
    return this.planningService.findAll(user.schoolId, sectionSubjectId)
  }

  @Get('academic-periods')
  getAcademicPeriods(@CurrentUser() user: AuthenticatedUser, @Query('schoolYearId') schoolYearId?: string) {
    return this.planningService.getAcademicPeriods(user.schoolId, schoolYearId)
  }

  @Post('academic-periods')
  @Roles('admin', 'director', 'coordinator')
  createAcademicPeriod(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.planningService.createAcademicPeriod(user.schoolId, body)
  }

  @Patch('academic-periods/:id')
  @Roles('admin', 'director', 'coordinator')
  updateAcademicPeriod(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.planningService.updateAcademicPeriod(user.schoolId, id, body)
  }

  @Delete('academic-periods/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteAcademicPeriod(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.planningService.deleteAcademicPeriod(user.schoolId, id)
  }

  @Get('competencies')
  getCompetencies(@Query('subjectId') subjectId?: string) {
    return this.planningService.getCompetencies(subjectId)
  }

  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser, @Query('teacherId') teacherId?: string) {
    return this.planningService.getSectionSubjects(user.schoolId, teacherId)
  }

  @Get('entries')
  findEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('academicPeriodId') academicPeriodId?: string,
  ) {
    return this.planningService.findEntries(user.schoolId, sectionSubjectId, academicPeriodId)
  }

  @Post('entries')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createEntry(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.planningService.createEntry(user.schoolId, body)
  }

  @Patch('entries/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  updateEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.planningService.updateEntry(user.schoolId, id, body)
  }

  @Delete('entries/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteEntry(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.planningService.deleteEntry(user.schoolId, id)
  }
}
