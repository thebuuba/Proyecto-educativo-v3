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

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  /** Obtiene las estadísticas del colegio (estudiantes, profesores, matrículas activas) */
  @Get('stats')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getStats(user.schoolId)
  }

  /** Obtiene las últimas tareas del dashboard */
  @Get('tasks')
  getTasks(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getTasks(user.schoolId)
  }

  /** Crea una nueva tarea en el dashboard (solo admin, director, coordinador, teacher) */
  @Post('tasks')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createTask(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.dashboardService.createTask(user.schoolId, user.id, body)
  }

  /** Actualiza una tarea existente del dashboard (solo admin, director, coordinador, teacher) */
  @Patch('tasks/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  updateTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.dashboardService.updateTask(user.schoolId, id, body)
  }
}
