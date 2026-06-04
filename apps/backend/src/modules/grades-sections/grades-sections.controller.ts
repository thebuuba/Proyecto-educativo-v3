import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { GradesSectionsService } from './grades-sections.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('grades-sections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesSectionsController {
  constructor(private gradesSectionsService: GradesSectionsService) {}

  @Get('course-data')
  getCourseData(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.getCourseData(user.schoolId)
  }

  @Get('academic-levels')
  getAcademicLevels() {
    return this.gradesSectionsService.getAcademicLevels()
  }

  @Get('cycles')
  getCycles() {
    return this.gradesSectionsService.getCycles()
  }

  @Get('modalities')
  getModalities() {
    return this.gradesSectionsService.getModalities()
  }

  @Get('teachers')
  getTeachers(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.getTeachers(user.schoolId)
  }

  @Get('grades')
  findAllGrades(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.findAllGrades(user.schoolId)
  }

  @Post('grades')
  @Roles('admin', 'director', 'coordinator')
  createGrade(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.gradesSectionsService.createGrade(user.schoolId, body)
  }

  @Patch('grades/:id')
  @Roles('admin', 'director', 'coordinator')
  updateGrade(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.gradesSectionsService.updateGrade(user.schoolId, id, body)
  }

  @Delete('grades/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteGrade(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradesSectionsService.deleteGrade(user.schoolId, id)
  }

  @Get('grades/:gradeId/sections')
  findSectionsByGrade(@CurrentUser() user: AuthenticatedUser, @Param('gradeId') gradeId: string) {
    return this.gradesSectionsService.findSectionsByGrade(user.schoolId, gradeId)
  }

  @Post('sections')
  @Roles('admin', 'director', 'coordinator')
  createSection(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.gradesSectionsService.createSection(user.schoolId, body)
  }

  @Patch('sections/:id')
  @Roles('admin', 'director', 'coordinator')
  updateSection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.gradesSectionsService.updateSection(user.schoolId, id, body)
  }

  @Delete('sections/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteSection(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradesSectionsService.deleteSection(user.schoolId, id)
  }

  @Get('subjects')
  findAllSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.findAllSubjects(user.schoolId)
  }

  @Post('subjects')
  @Roles('admin', 'director', 'coordinator')
  createSubject(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.gradesSectionsService.createSubject(user.schoolId, body)
  }

  @Post('assign-subject')
  @Roles('admin', 'director', 'coordinator')
  assignSubject(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.gradesSectionsService.assignSubject(user.schoolId, body)
  }

  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.getSectionSubjects(user.schoolId)
  }

  @Delete('section-subjects/:id')
  @Roles('admin', 'director', 'coordinator')
  removeSectionSubject(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradesSectionsService.removeSectionSubject(user.schoolId, id)
  }
}
