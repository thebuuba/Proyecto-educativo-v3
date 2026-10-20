/**
 * Controlador de horarios
 * @module ScheduleController
 * @description Expone los endpoints REST para la gestión de horarios escolares,
 * incluyendo CRUD de franjas horarias (time-slots) y entradas de horario (entries),
 * así como consultas de secciones, profesores y materias.
 */
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ScheduleService } from './schedule.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CreateTimeSlotDto } from './dto/create-time-slot.dto'
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto'
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto'
import { UpdateScheduleEntryDto } from './dto/update-schedule-entry.dto'
import { SaveScheduleStructureDto } from './dto/save-schedule-structure.dto'

@Controller('schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  /** Agrupa la carga inicial del horario para evitar cascadas de red. */
  @Get('workspace')
  getWorkspace(@CurrentUser() user: AuthenticatedUser) {
    return this.scheduleService.getWorkspace({ schoolId: user.schoolId, ownerUserId: user.id })
  }

  /** Obtiene todas las entradas de horario con filtros opcionales */
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionId') sectionId?: string,
    @Query('schoolYearId') schoolYearId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('gradeId') gradeId?: string,
  ) {
    return this.scheduleService.findAll({ schoolId: user.schoolId, ownerUserId: user.id }, sectionId, schoolYearId, teacherId, gradeId)
  }

  /** Obtiene las secciones activas del colegio */
  @Get('sections')
  getSections(@CurrentUser() user: AuthenticatedUser) {
    return this.scheduleService.getSections(user.schoolId)
  }

  /** Obtiene los profesores activos del colegio */
  @Get('teachers')
  getTeachers(@CurrentUser() user: AuthenticatedUser) {
    return this.scheduleService.getTeachers(user.schoolId)
  }

  /** Obtiene las materias activas del colegio */
  @Get('subjects')
  getSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.scheduleService.getSubjects(user.schoolId)
  }

  /** Obtiene las materias asignadas a una sección */
  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser, @Query('sectionId') sectionId?: string) {
    return this.scheduleService.getSectionSubjects(user.schoolId, sectionId)
  }

  /** Obtiene las franjas horarias del colegio */
  @Get('time-slots')
  getTimeSlots(@CurrentUser() user: AuthenticatedUser) {
    return this.scheduleService.getTimeSlots({ schoolId: user.schoolId, ownerUserId: user.id })
  }

  @Get('journeys')
  getJourneys(@CurrentUser() user: AuthenticatedUser) {
    return this.scheduleService.getJourneys({ schoolId: user.schoolId, ownerUserId: user.id })
  }

  @Post('structure')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  saveStructure(@CurrentUser() user: AuthenticatedUser, @Body() dto: SaveScheduleStructureDto) {
    return this.scheduleService.saveStructure({ schoolId: user.schoolId, ownerUserId: user.id }, dto)
  }

  @Delete('structure')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteStructure(@CurrentUser() user: AuthenticatedUser) {
    return this.scheduleService.deleteStructure({ schoolId: user.schoolId, ownerUserId: user.id })
  }

  /** Crea una nueva franja horaria (admin, director, coordinador y docente) */
  @Post('time-slots')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createTimeSlot(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTimeSlotDto) {
    return this.scheduleService.createTimeSlot({ schoolId: user.schoolId, ownerUserId: user.id }, dto)
  }

  /** Actualiza una franja horaria existente (admin, director, coordinador y docente) */
  @Patch('time-slots/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  updateTimeSlot(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTimeSlotDto,
  ) {
    return this.scheduleService.updateTimeSlot({ schoolId: user.schoolId, ownerUserId: user.id }, id, dto)
  }

  /** Elimina una franja horaria (admin, director, coordinador y docente) */
  @Delete('time-slots/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteTimeSlot(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.scheduleService.deleteTimeSlot({ schoolId: user.schoolId, ownerUserId: user.id }, id)
  }

  /** Obtiene las entradas de horario con filtros opcionales */
  @Get('entries')
  findEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionId') sectionId?: string,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('schoolYearId') schoolYearId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('gradeId') gradeId?: string,
  ) {
    return this.scheduleService.findEntries({ schoolId: user.schoolId, ownerUserId: user.id }, sectionId, dayOfWeek, schoolYearId, teacherId, gradeId, sectionSubjectId)
  }

  /** Crea una nueva entrada de horario (admin, director, coordinador y docente) */
  @Post('entries')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createEntry(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateScheduleEntryDto) {
    return this.scheduleService.createEntry({ schoolId: user.schoolId, ownerUserId: user.id }, dto)
  }

  /** Actualiza una entrada de horario existente (admin, director, coordinador y docente) */
  @Patch('entries/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  updateEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateScheduleEntryDto,
  ) {
    return this.scheduleService.updateEntry({ schoolId: user.schoolId, ownerUserId: user.id }, id, dto)
  }

  /** Elimina una entrada de horario (admin, director, coordinador y docente) */
  @Delete('entries/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteEntry(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.scheduleService.deleteEntry({ schoolId: user.schoolId, ownerUserId: user.id }, id)
  }
}
