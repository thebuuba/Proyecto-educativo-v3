/**
 * Controlador REST de calificaciones académicas.
 *
 * Maneja las solicitudes HTTP relacionadas con la gestión de
 * calificaciones de estudiantes en el sistema educativo.
 */
import { Controller, Delete, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { GradesService } from './grades.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { SaveGradeDto } from './dto/save-grade.dto'

@Controller('academic-grades')
@UseGuards(JwtAuthGuard, RolesGuard)
/**
 * Controlador de calificaciones académicas.
 *
 * Expone los endpoints REST para la consulta y registro de
 * calificaciones de los estudiantes en las distintas materias.
 */
export class GradesController {
  /**
   * Inicializa el controlador con el servicio de calificaciones.
   *
   * @param gradesService - Servicio de calificaciones inyectado.
   */
  constructor(private gradesService: GradesService) {}

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
    return this.gradesService.findAll(user.schoolId, sectionSubjectId, academicPeriodId)
  }

  /**
   * Obtiene las materias asignadas a cada sección.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @returns Lista de materias con sus secciones y grados asociados.
   */
  @Get('section-subjects')
  getSectionSubjects(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesService.getSectionSubjects(user.schoolId)
  }

  /**
   * Obtiene los períodos académicos activos.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @returns Lista de períodos académicos activos ordenados por secuencia.
   */
  @Get('academic-periods')
  getAcademicPeriods(@CurrentUser() user: AuthenticatedUser) {
    return this.gradesService.getAcademicPeriods(user.schoolId)
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
    return this.gradesService.getStudentsForGrading(user.schoolId, sectionSubjectId, academicPeriodId)
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
    return this.gradesService.saveGrade(user.schoolId, dto)
  }

  @Delete(':id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  deleteGrade(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.gradesService.deleteGrade(user.schoolId, id)
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
    return this.gradesService.findByStudent(user.schoolId, studentId)
  }
}
