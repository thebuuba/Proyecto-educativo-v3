/**
 * Controlador REST de calificaciones académicas.
 *
 * Maneja las solicitudes HTTP relacionadas con la gestión de
 * calificaciones de estudiantes en el sistema educativo.
 */
import { Controller, Delete, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { GradingService } from './grading.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { SaveGradeDto } from './dto/save-grade.dto'
import { SaveEvaluationActivityDto } from './dto/save-evaluation-activity.dto'

@Controller('grading')
@UseGuards(JwtAuthGuard, RolesGuard)
/**
 * Controlador de calificaciones académicas.
 *
 * Expone los endpoints REST para la consulta y registro de
 * calificaciones de los estudiantes en las distintas materias.
 */
export class GradingController {
  /**
   * Inicializa el controlador con el servicio de calificaciones.
   *
   * @param gradingService - Servicio de calificaciones inyectado.
   */
  constructor(private gradingService: GradingService) {}

  /**
   * Obtiene los registros de calificaciones, opcionalmente filtrados
   * por materia de sección y período académico.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param sectionSubjectId - Identificador de la materia de la sección.
   * @param academicPeriodId - Identificador del período académico.
   * @returns Lista de registros de calificaciones.
   */
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('academicPeriodId') academicPeriodId?: string,
  ) {
    return this.gradingService.findAll(user.schoolId, sectionSubjectId, academicPeriodId)
  }

  /**
   * Obtiene las materias asignadas a cada sección.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @returns Lista de materias con sus secciones y grados asociados.
   */
  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.gradingService.getSectionSubjects(user.schoolId)
  }

  /**
   * Obtiene los períodos académicos activos.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @returns Lista de períodos académicos activos ordenados por secuencia.
   */
  @Get('academic-periods')
  getAcademicPeriods(@CurrentUser() user: AuthenticatedUser) {
    return this.gradingService.getAcademicPeriods(user.schoolId)
  }

  /**
   * Obtiene los estudiantes para calificar en una materia y período académico.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param sectionSubjectId - Identificador de la materia de la sección.
   * @param academicPeriodId - Identificador del período académico.
   * @returns Lista de estudiantes con sus calificaciones existentes.
   */
  @Get('students')
  getStudents(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId: string,
    @Query('academicPeriodId') academicPeriodId: string,
  ) {
    return this.gradingService.getStudentsForGrading(user.schoolId, sectionSubjectId, academicPeriodId)
  }

  @Get('activities')
  getActivities(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('academicPeriodId') academicPeriodId?: string,
    @Query('planningEntryId') planningEntryId?: string,
  ) {
    return this.gradingService.getActivities(user.schoolId, { sectionSubjectId, academicPeriodId, planningEntryId })
  }

  @Post('activities')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  saveActivity(@CurrentUser() user: AuthenticatedUser, @Body() dto: SaveEvaluationActivityDto) {
    return this.gradingService.saveActivity(user.schoolId, user.id, dto)
  }

  @Post('activities/:id/link-planning')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  linkActivityToPlanning(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: { planningEntryId: string | null; planningMoment?: string },
  ) {
    return this.gradingService.linkActivityToPlanning(user.schoolId, id, dto)
  }

  @Delete('activities/:id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteActivity(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradingService.deleteActivity(user.schoolId, id)
  }

  /**
   * Guarda o actualiza una calificación para un estudiante.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param body - Datos de la calificación a guardar o actualizar.
   * @returns La calificación creada o actualizada.
   */
  @Post('save')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  saveGrade(@CurrentUser() user: AuthenticatedUser, @Body() dto: SaveGradeDto) {
    return this.gradingService.saveGrade(user.schoolId, dto)
  }

  @Delete(':id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteGrade(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradingService.deleteGrade(user.schoolId, id)
  }

  /**
   * Obtiene las calificaciones de un estudiante por su identificador.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param studentId - Identificador del estudiante.
   * @returns Lista de registros de calificaciones del estudiante.
   */
  @Get('student/:studentId')
  findByStudent(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string) {
    return this.gradingService.findByStudent(user.schoolId, studentId)
  }
}
