import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { GradesSectionsService } from './grades-sections.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('grades-sections')
@UseGuards(JwtAuthGuard)
export class GradesSectionsController {
  constructor(private gradesSectionsService: GradesSectionsService) {}

  @Get('course-data')
  getCourseData() {
    return this.gradesSectionsService.getCourseData()
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
  getTeachers() {
    return this.gradesSectionsService.getTeachers()
  }

  @Get('grades')
  findAllGrades() {
    return this.gradesSectionsService.findAllGrades()
  }

  @Post('grades')
  createGrade(@Body() body: any) {
    return this.gradesSectionsService.createGrade(body)
  }

  @Patch('grades/:id')
  updateGrade(@Param('id') id: string, @Body() body: any) {
    return this.gradesSectionsService.updateGrade(id, body)
  }

  @Delete('grades/:id')
  deleteGrade(@Param('id') id: string) {
    return this.gradesSectionsService.deleteGrade(id)
  }

  @Get('grades/:gradeId/sections')
  findSectionsByGrade(@Param('gradeId') gradeId: string) {
    return this.gradesSectionsService.findSectionsByGrade(gradeId)
  }

  @Post('sections')
  createSection(@Body() body: any) {
    return this.gradesSectionsService.createSection(body)
  }

  @Patch('sections/:id')
  updateSection(@Param('id') id: string, @Body() body: any) {
    return this.gradesSectionsService.updateSection(id, body)
  }

  @Delete('sections/:id')
  deleteSection(@Param('id') id: string) {
    return this.gradesSectionsService.deleteSection(id)
  }

  @Get('subjects')
  findAllSubjects() {
    return this.gradesSectionsService.findAllSubjects()
  }

  @Post('subjects')
  createSubject(@Body() body: any) {
    return this.gradesSectionsService.createSubject(body)
  }

  @Post('assign-subject')
  assignSubject(@Body() body: any) {
    return this.gradesSectionsService.assignSubject(body)
  }

  @Get('section-subjects')
  getSectionSubjects() {
    return this.gradesSectionsService.getSectionSubjects()
  }

  @Delete('section-subjects/:id')
  removeSectionSubject(@Param('id') id: string) {
    return this.gradesSectionsService.removeSectionSubject(id)
  }
}
