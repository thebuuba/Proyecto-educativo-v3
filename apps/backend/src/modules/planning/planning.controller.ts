/**
 * Controlador de planificación
 * @module PlanningController
 * @description Expone los endpoints REST para la gestión de planificaciones académicas,
 * incluyendo CRUD de períodos académicos, consulta de competencias y CRUD de entradas de planificación.
 */
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PlanningService } from './planning.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto'
import { UpdateAcademicPeriodDto } from './dto/update-academic-period.dto'
import { CreatePlanningEntryDto } from './dto/create-planning-entry.dto'
import { UpdatePlanningEntryDto } from './dto/update-planning-entry.dto'
import { GenerateEntryDraftDto } from './dto/generate-entry-draft.dto'
import { GenerateAndCreateEntryDto } from './dto/generate-and-create-entry.dto'

@Controller('planning')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanningController {
  constructor(private planningService: PlanningService) {}

  /** Agrupa la carga inicial de Planificación para evitar cascadas de red. */
  @Get('workspace')
  getWorkspace(@CurrentUser() user: AuthenticatedUser) {
    return this.planningService.getWorkspace(user.schoolId)
  }

  /** Obtiene las entradas de planificación filtradas por materia-sección */
  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query('sectionSubjectId') sectionSubjectId?: string) {
    return this.planningService.findAll(user.schoolId, sectionSubjectId)
  }

  /** Obtiene los períodos académicos filtrados por año escolar */
  @Get('academic-periods')
  getAcademicPeriods(@CurrentUser() user: AuthenticatedUser, @Query('schoolYearId') schoolYearId?: string) {
    return this.planningService.getAcademicPeriods(user.schoolId, schoolYearId)
  }

  /** Crea un nuevo período académico (solo admin, director, coordinador) */
  @Post('academic-periods')
  @Roles('admin', 'director', 'coordinator')
  createAcademicPeriod(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAcademicPeriodDto) {
    return this.planningService.createAcademicPeriod(user.schoolId, dto)
  }

  /** Actualiza un período académico existente (solo admin, director, coordinador) */
  @Patch('academic-periods/:id')
  @Roles('admin', 'director', 'coordinator')
  updateAcademicPeriod(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateAcademicPeriodDto,
  ) {
    return this.planningService.updateAcademicPeriod(user.schoolId, id, dto)
  }

  /** Elimina un período académico (solo admin, director, coordinador) */
  @Delete('academic-periods/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteAcademicPeriod(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.planningService.deleteAcademicPeriod(user.schoolId, id)
  }

  /** Obtiene las competencias del currículo, filtradas por materia */
  @Get('competencies')
  getCompetencies(@Query('subjectId') subjectId?: string) {
    return this.planningService.getCompetencies(subjectId)
  }

  /** Obtiene las materias asignadas a secciones, filtradas por profesor */
  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser, @Query('teacherId') teacherId?: string) {
    return this.planningService.getSectionSubjects(user.schoolId, teacherId)
  }

  /** Obtiene las entradas de planificación filtradas por materia-sección y período */
  @Get('entries')
  findEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('academicPeriodId') academicPeriodId?: string,
  ) {
    return this.planningService.findEntries(user.schoolId, sectionSubjectId, academicPeriodId)
  }

  @Post('entries/:id/duplicate')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  duplicateEntry(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.planningService.duplicateEntry(user.schoolId, id)
  }

  @Patch('entries/:id/archive')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  archiveEntry(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.planningService.archiveEntry(user.schoolId, id)
  }

  /** Crea una nueva entrada de planificación (solo admin, director, coordinador, teacher) */
  @Post('entries')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createEntry(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePlanningEntryDto) {
    return this.planningService.createEntry(user.schoolId, dto)
  }

  /** Genera un borrador completo de planificación con IA */
  @Post('entries/generate')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  generateEntryDraft(@CurrentUser() user: AuthenticatedUser, @Body() dto: GenerateEntryDraftDto) {
    return this.planningService.generateEntryDraft(user.schoolId, dto)
  }

  /** Genera y guarda una planificación completa con IA */
  @Post('entries/generate-and-create')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  generateAndCreateEntry(@CurrentUser() user: AuthenticatedUser, @Body() dto: GenerateAndCreateEntryDto) {
    return this.planningService.generateAndCreateEntry(user.schoolId, dto)
  }

  /** Actualiza una entrada de planificación existente (solo admin, director, coordinador, teacher) */
  @Patch('entries/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  updateEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdatePlanningEntryDto,
  ) {
    return this.planningService.updateEntry(user.schoolId, id, dto)
  }

  /** Elimina una entrada de planificación (solo admin, director, coordinador, teacher) */
  @Delete('entries/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteEntry(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.planningService.deleteEntry(user.schoolId, id)
  }
}
