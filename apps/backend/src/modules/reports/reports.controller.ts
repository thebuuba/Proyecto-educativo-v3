/**
 * Controlador de reportes
 * @module ReportsController
 * @description Expone los endpoints REST para la generación y exportación de reportes
 * académicos, incluyendo reportes individuales de estudiantes y exportación de calificaciones.
 */
import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  /** Obtiene el reporte de calificaciones de un estudiante */
  @Get('student/:studentId')
  getStudentReport(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string) {
    return this.reportsService.getStudentReport(user.schoolId, studentId)
  }

  /** Exporta un reporte en el formato especificado (estudiante, calificaciones, CSV) */
  @Post('export')
  exportReport(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.reportsService.exportReport(user.schoolId, body)
  }
}
