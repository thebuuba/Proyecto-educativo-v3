/**
 * Controlador del dashboard
 * @module DashboardController
 * @description Expone los endpoints REST para el panel de control, incluyendo
 * estadísticas del colegio y gestión de tareas del dashboard.
 */
import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  /** Resumen operativo del inicio, limitado al rol y relaciones del usuario. */
  @Get('overview')
  getOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getOverview(user)
  }

  /** Datos secundarios que no bloquean la primera pintura del inicio. */
  @Get('insights')
  getInsights(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getInsights(user)
  }

  /** Obtiene las estadísticas del colegio (estudiantes, profesores, matrículas activas) */
  @Get('stats')
  @Roles('admin', 'director', 'coordinator')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getStats(user.schoolId)
  }

  /** Obtiene las últimas tareas del dashboard */
  @Get('tasks')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  getTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getTasks(user)
  }

  /** Crea una nueva tarea en el dashboard (solo admin, director, coordinador, teacher) */
  @Post('tasks')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createTask(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) {
    return this.dashboardService.createTask(user, dto)
  }

  /** Actualiza una tarea existente del dashboard (solo admin, director, coordinador, teacher) */
  @Patch('tasks/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  updateTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.dashboardService.updateTask(user, id, dto)
  }
}
