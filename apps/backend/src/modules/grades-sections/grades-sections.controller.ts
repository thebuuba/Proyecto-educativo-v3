/**
 * Controlador de grados y secciones
 * @module GradesSectionsController
 * @description Expone los endpoints REST para la gestión de grados, secciones, materias
 * y la asignación de materias a secciones dentro de un colegio.
 */
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { GradesSectionsService } from './grades-sections.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CreateGradeDto } from './dto/create-grade.dto'
import { UpdateGradeDto } from './dto/update-grade.dto'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { AssignSubjectDto } from './dto/assign-subject.dto'

@Controller('grades-sections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesSectionsController {
  constructor(private gradesSectionsService: GradesSectionsService) {}

  /** Obtiene los datos completos del curso: grados, secciones, asignaciones y catálogos */
  @Get('course-data')
  getCourseData(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.getCourseData(user.schoolId)
  }

  /** Obtiene los niveles académicos del sistema */
  @Get('academic-levels')
  getAcademicLevels() {
    return this.gradesSectionsService.getAcademicLevels()
  }

  /** Obtiene los ciclos académicos del sistema */
  @Get('cycles')
  getCycles() {
    return this.gradesSectionsService.getCycles()
  }

  /** Obtiene las modalidades del sistema */
  @Get('modalities')
  getModalities() {
    return this.gradesSectionsService.getModalities()
  }

  /** Obtiene los profesores activos del colegio */
  @Get('teachers')
  getTeachers(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.getTeachers(user.schoolId)
  }

  /** Obtiene todos los grados del colegio */
  @Get('grades')
  findAllGrades(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.findAllGrades(user.schoolId)
  }

  /** Crea un nuevo grado (solo admin, director, coordinador) */
  @Post('grades')
  @Roles('admin', 'director', 'coordinator')
  createGrade(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateGradeDto) {
    return this.gradesSectionsService.createGrade(user.schoolId, dto)
  }

  /** Actualiza un grado existente (solo admin, director, coordinador) */
  @Patch('grades/:id')
  @Roles('admin', 'director', 'coordinator')
  updateGrade(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateGradeDto,
  ) {
    return this.gradesSectionsService.updateGrade(user.schoolId, id, dto)
  }

  /** Desactiva un grado (solo admin, director, coordinador) */
  @Delete('grades/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteGrade(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradesSectionsService.deleteGrade(user.schoolId, id)
  }

  /** Obtiene las secciones activas de un grado */
  @Get('grades/:gradeId/sections')
  findSectionsByGrade(@CurrentUser() user: AuthenticatedUser, @Param('gradeId') gradeId: string) {
    return this.gradesSectionsService.findSectionsByGrade(user.schoolId, gradeId)
  }

  /** Crea una nueva sección (solo admin, director, coordinador) */
  @Post('sections')
  @Roles('admin', 'director', 'coordinator')
  createSection(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSectionDto) {
    return this.gradesSectionsService.createSection(user.schoolId, dto)
  }

  /** Actualiza una sección existente (solo admin, director, coordinador) */
  @Patch('sections/:id')
  @Roles('admin', 'director', 'coordinator')
  updateSection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.gradesSectionsService.updateSection(user.schoolId, id, dto)
  }

  /** Desactiva una sección (solo admin, director, coordinador) */
  @Delete('sections/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteSection(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradesSectionsService.deleteSection(user.schoolId, id)
  }

  /** Obtiene todas las materias del colegio */
  @Get('subjects')
  findAllSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.findAllSubjects(user.schoolId)
  }

  /** Crea una nueva materia (solo admin, director, coordinador) */
  @Post('subjects')
  @Roles('admin', 'director', 'coordinator')
  createSubject(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSubjectDto) {
    return this.gradesSectionsService.createSubject(user.schoolId, dto)
  }

  /** Asigna una materia a una sección con un profesor (solo admin, director, coordinador) */
  @Post('assign-subject')
  @Roles('admin', 'director', 'coordinator')
  assignSubject(@CurrentUser() user: AuthenticatedUser, @Body() dto: AssignSubjectDto) {
    return this.gradesSectionsService.assignSubject(user.schoolId, dto)
  }

  /** Obtiene todas las asignaciones materia-sección activas */
  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesSectionsService.getSectionSubjects(user.schoolId)
  }

  /** Desactiva una asignación materia-sección (solo admin, director, coordinador) */
  @Delete('section-subjects/:id')
  @Roles('admin', 'director', 'coordinator')
  removeSectionSubject(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradesSectionsService.removeSectionSubject(user.schoolId, id)
  }
}
