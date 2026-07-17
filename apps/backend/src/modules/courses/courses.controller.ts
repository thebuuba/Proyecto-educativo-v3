/**
 * Controlador de grados y secciones
 * @module CoursesController
 * @description Expone los endpoints REST para la gestión de grados, secciones, materias
 * y la asignación de materias a secciones dentro de un colegio.
 */
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { CoursesService } from './courses.service'
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
import { CreateCourseTeamDto } from './dto/create-course-team.dto'
import { UpdateCourseTeamDto } from './dto/update-course-team.dto'
import { UpdateSectionSubjectAppearanceDto } from './dto/update-section-subject-appearance.dto'

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  /** Obtiene los datos completos del curso: grados, secciones, asignaciones y catálogos */
  @Get('course-data')
  getCourseData(@CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.getCourseData(user.schoolId, user.id)
  }

  /** Obtiene los niveles académicos del sistema */
  @Get('academic-levels')
  getAcademicLevels() {
    return this.coursesService.getAcademicLevels()
  }

  /** Obtiene los ciclos académicos del sistema */
  @Get('cycles')
  getCycles() {
    return this.coursesService.getCycles()
  }

  /** Obtiene las modalidades del sistema */
  @Get('modalities')
  getModalities() {
    return this.coursesService.getModalities()
  }

  /** Obtiene los profesores activos del colegio */
  @Get('teachers')
  getTeachers(@CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.getTeachers(user.schoolId)
  }

  /** Obtiene todos los grados del colegio */
  @Get('grades')
  findAllGrades(@CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.findAllGrades(user.schoolId)
  }

  /** Crea un nuevo grado (solo admin, director, coordinador) */
  @Post('grades')
  @Roles('admin', 'director', 'coordinator')
  createGrade(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateGradeDto) {
    return this.coursesService.createGrade(user.schoolId, dto)
  }

  /** Actualiza un grado existente (solo admin, director, coordinador) */
  @Patch('grades/:id')
  @Roles('admin', 'director', 'coordinator')
  updateGrade(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateGradeDto,
  ) {
    return this.coursesService.updateGrade(user.schoolId, id, dto)
  }

  /** Desactiva un grado (solo admin, director, coordinador) */
  @Delete('grades/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteGrade(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.coursesService.deleteGrade(user.schoolId, id)
  }

  /** Obtiene las secciones activas de un grado */
  @Get('grades/:gradeId/sections')
  findSectionsByGrade(@CurrentUser() user: AuthenticatedUser, @Param('gradeId') gradeId: string) {
    return this.coursesService.findSectionsByGrade(user.schoolId, gradeId)
  }

  /** Crea una nueva sección (solo admin, director, coordinador) */
  @Post('sections')
  @Roles('admin', 'director', 'coordinator')
  createSection(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSectionDto) {
    return this.coursesService.createSection(user.schoolId, dto)
  }

  /** Actualiza una sección existente (solo admin, director, coordinador) */
  @Patch('sections/:id')
  @Roles('admin', 'director', 'coordinator')
  updateSection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.coursesService.updateSection(user.schoolId, id, dto)
  }

  /** Desactiva una sección (solo admin, director, coordinador) */
  @Delete('sections/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteSection(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.coursesService.deleteSection(user.schoolId, id)
  }

  /** Obtiene todas las materias del colegio */
  @Get('subjects')
  findAllSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.findAllSubjects(user.schoolId)
  }

  /** Crea una nueva materia (solo admin, director, coordinador) */
  @Post('subjects')
  @Roles('admin', 'director', 'coordinator')
  createSubject(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSubjectDto) {
    return this.coursesService.createSubject(user.schoolId, dto)
  }

  /** Asigna una materia a una sección con un profesor (solo admin, director, coordinador) */
  @Post('assign-subject')
  @Roles('admin', 'director', 'coordinator')
  assignSubject(@CurrentUser() user: AuthenticatedUser, @Body() dto: AssignSubjectDto) {
    return this.coursesService.assignSubject(user.schoolId, dto, user.id)
  }

  /** Obtiene todas las asignaciones materia-sección activas */
  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.getSectionSubjects(user.schoolId)
  }

  /** Desactiva una asignación materia-sección (solo admin, director, coordinador) */
  @Delete('section-subjects/:id')
  @Roles('admin', 'director', 'coordinator')
  removeSectionSubject(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.coursesService.removeSectionSubject(user.schoolId, id)
  }

  /** Actualiza exclusivamente la apariencia visual de una asignatura del curso. */
  @Patch('section-subjects/:id/appearance')
  @Roles('admin', 'director', 'coordinator')
  updateSectionSubjectAppearance(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateSectionSubjectAppearanceDto,
  ) {
    return this.coursesService.updateSectionSubjectAppearance(user.schoolId, id, dto)
  }

  /** Restaura una asignatura previamente archivada. */
  @Patch('section-subjects/:id/restore')
  @Roles('admin', 'director', 'coordinator')
  restoreSectionSubject(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.coursesService.restoreSectionSubject(user.schoolId, id)
  }

  /** Elimina definitivamente una asignatura archivada y su historial. */
  @Delete('section-subjects/:id/permanent')
  @Roles('admin', 'director', 'coordinator')
  permanentlyDeleteSectionSubject(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('confirmation') confirmation?: string,
  ) {
    return this.coursesService.permanentlyDeleteSectionSubject(user.schoolId, id, confirmation)
  }

  /** Obtiene los equipos propios de una asignatura-sección. */
  @Get('section-subjects/:id/teams')
  getCourseTeams(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.coursesService.getCourseTeams(user.schoolId, id)
  }

  /** Crea un equipo permanente o temporal dentro del curso. */
  @Post('section-subjects/:id/teams')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createCourseTeam(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateCourseTeamDto,
  ) {
    return this.coursesService.createCourseTeam(user.schoolId, user.id, id, dto)
  }

  /** Actualiza los datos y la composición de un equipo. */
  @Patch('teams/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  updateCourseTeam(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCourseTeamDto,
  ) {
    return this.coursesService.updateCourseTeam(user.schoolId, id, dto)
  }

  /** Archiva un equipo sin eliminar su historial. */
  @Delete('teams/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  archiveCourseTeam(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.coursesService.archiveCourseTeam(user.schoolId, id)
  }
}
