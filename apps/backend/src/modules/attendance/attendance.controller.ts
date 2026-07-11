/**
 * Controlador REST de asistencia.
 *
 * Maneja las solicitudes HTTP relacionadas con el registro y
 * consulta de asistencia de estudiantes en el sistema educativo.
 */
import { Controller, Delete, Get, Param, Post, Body, Query, UseGuards } from '@nestjs/common'
import { AttendanceService } from './attendance.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { UpsertAttendanceDto } from './dto/upsert-attendance.dto'

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
/**
 * Controlador de asistencia.
 *
 * Expone los endpoints REST para la consulta y registro de
 * asistencia diaria y por clase de los estudiantes.
 */
export class AttendanceController {
  /**
   * Inicializa el controlador con el servicio de asistencia.
   *
   * @param attendanceService - Servicio de asistencia inyectado.
   */
  constructor(private attendanceService: AttendanceService) {}

  @Get('courses')
  getCourses(@CurrentUser() user: AuthenticatedUser) {
    return this.attendanceService.getCourses(user.schoolId)
  }

  /**
   * Obtiene los registros de asistencia por clase, opcionalmente filtrados
   * por materia de sección y fecha.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param sectionSubjectId - Identificador de la materia de la sección.
   * @param date - Fecha de la asistencia.
   * @returns Lista de registros de asistencia por clase.
   */
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findAll(user.schoolId, sectionSubjectId, date)
  }

  /**
   * Obtiene los registros de asistencia diaria, opcionalmente filtrados
   * por matrícula, sección y fecha.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param enrollmentId - Identificador de la matrícula.
   * @param sectionId - Identificador de la sección.
   * @param date - Fecha de la asistencia.
   * @returns Lista de registros de asistencia diaria.
   */
  @Get('daily')
  findDaily(
    @CurrentUser() user: AuthenticatedUser,
    @Query('enrollmentId') enrollmentId?: string,
    @Query('sectionId') sectionId?: string,
    @Query('date') date?: string,
  ) {
    if (sectionId && date) {
      return this.attendanceService.findDailyBySection(user.schoolId, sectionId, date)
    }
    return this.attendanceService.findDaily(user.schoolId, enrollmentId, date)
  }

  /**
   * Obtiene los estudiantes para registrar asistencia, ya sea por
   * materia o por sección y año escolar.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param sectionSubjectId - Identificador de la materia de la sección.
   * @param date - Fecha de la asistencia.
   * @param sectionId - Identificador de la sección.
   * @param schoolYearId - Identificador del año escolar.
   * @returns Lista de estudiantes con su estado de asistencia.
   */
  @Get('students')
  getStudents(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('date') date?: string,
    @Query('sectionId') sectionId?: string,
    @Query('schoolYearId') schoolYearId?: string,
  ) {
    if (sectionId && schoolYearId) {
      return this.attendanceService.getStudentsBySection(user.schoolId, sectionId, schoolYearId)
    }
    return this.attendanceService.getStudents(user.schoolId, sectionSubjectId!, date!)
  }

  /**
   * Obtiene el período académico activo actual.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @returns El período académico activo con la menor secuencia.
   */
  @Get('current-period')
  getCurrentPeriod(@CurrentUser() user: AuthenticatedUser) {
    return this.attendanceService.getCurrentPeriod(user.schoolId)
  }

  /**
   * Crea o actualiza un registro de asistencia (por clase o diario).
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param body - Datos del registro de asistencia a crear o actualizar.
   * @returns El registro de asistencia creado o actualizado.
   */
  @Post('upsert')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  upsert(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpsertAttendanceDto) {
    return this.attendanceService.upsert(user.schoolId, dto)
  }

  @Delete(':id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteRecord(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('type') type: 'daily' | 'class' = 'daily',
  ) {
    return this.attendanceService.deleteRecord(user.schoolId, id, type)
  }
}
