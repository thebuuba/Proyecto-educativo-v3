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

@Controller('schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  /** Obtiene todas las entradas de horario con filtros opcionales */
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionId') sectionId?: string,
    @Query('schoolYearId') schoolYearId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('gradeId') gradeId?: string,
  ) {
    return this.scheduleService.findAll(user.schoolId, sectionId, schoolYearId, teacherId, gradeId)
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
    return this.scheduleService.getTimeSlots(user.schoolId)
  }

  /** Crea una nueva franja horaria (solo admin, director, coordinador) */
  @Post('time-slots')
  @Roles('admin', 'director', 'coordinator')
  createTimeSlot(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.scheduleService.createTimeSlot(user.schoolId, body)
  }

  /** Actualiza una franja horaria existente (solo admin, director, coordinador) */
  @Patch('time-slots/:id')
  @Roles('admin', 'director', 'coordinator')
  updateTimeSlot(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.scheduleService.updateTimeSlot(user.schoolId, id, body)
  }

  /** Elimina una franja horaria (solo admin, director, coordinador) */
  @Delete('time-slots/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteTimeSlot(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.scheduleService.deleteTimeSlot(user.schoolId, id)
  }

  /** Obtiene las entradas de horario con filtros opcionales */
  @Get('entries')
  findEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionId') sectionId?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('schoolYearId') schoolYearId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('gradeId') gradeId?: string,
  ) {
    return this.scheduleService.findEntries(user.schoolId, sectionId, dayOfWeek, schoolYearId, teacherId, gradeId)
  }

  /** Crea una nueva entrada de horario (solo admin, director, coordinador) */
  @Post('entries')
  @Roles('admin', 'director', 'coordinator')
  createEntry(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.scheduleService.createEntry(user.schoolId, body)
  }

  /** Actualiza una entrada de horario existente (solo admin, director, coordinador) */
  @Patch('entries/:id')
  @Roles('admin', 'director', 'coordinator')
  updateEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.scheduleService.updateEntry(user.schoolId, id, body)
  }

  /** Elimina una entrada de horario (solo admin, director, coordinador) */
  @Delete('entries/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteEntry(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.scheduleService.deleteEntry(user.schoolId, id)
  }
}
