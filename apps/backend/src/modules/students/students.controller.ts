/**
 * Controlador REST de estudiantes.
 *
 * Maneja las solicitudes HTTP relacionadas con la gestión de
 * estudiantes, matrículas y apoderados en el sistema educativo.
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'
import { StudentsService } from './students.service'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { CreateEnrollmentDto } from './dto/create-enrollment.dto'
import {
  CreateCourseStudentDto,
  ImportCourseStudentsDto,
  ImportCourseStudentsPreviewDto,
  TransferCourseStudentDto,
} from './dto/course-enrollment.dto'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
/**
 * Controlador de estudiantes.
 *
 * Expone los endpoints REST para la gestión de estudiantes,
 * incluyendo operaciones CRUD, matrículas, apoderados,
 * notificaciones e importación masiva.
 */
export class StudentsController {
  /**
   * Inicializa el controlador con el servicio de estudiantes.
   *
   * @param studentsService - Servicio de estudiantes inyectado.
   */
  constructor(private studentsService: StudentsService) {}

  /**
   * Obtiene una lista paginada de estudiantes con filtros opcionales.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param search - Término de búsqueda para filtrar por nombre, apellido o código.
   * @param status - Estado del estudiante para filtrar.
   * @param page - Número de página (por defecto 1).
   * @param pageSize - Tamaño de página (por defecto 50).
   * @returns Lista paginada de estudiantes con el total de registros.
   */
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.studentsService.findAll(
      user.schoolId,
      search,
      status,
      page ? Number(page) : 1,
      pageSize ? Number(pageSize) : 50,
    )
  }

  /**
   * Obtiene la lista de grados con sus secciones asociadas.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @returns Lista de grados activos con sus secciones correspondientes.
   */
  @Get('grades-with-sections')
  getGradesWithSections(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.getGradesWithSections(user.schoolId)
  }

  /**
   * Importa estudiantes de forma masiva desde un archivo externo.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param body - Cuerpo con el arreglo de estudiantes a importar.
   * @returns Resultado de la importación con estudiantes creados y errores.
   */
  @Post('import')
  @Roles('admin', 'director', 'coordinator')
  importStudents(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.studentsService.importStudents(
      user.schoolId,
      body.students ?? body,
    )
  }

  @Get('enrollment-courses')
  getEnrollmentCourses(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.getEnrollmentCourses(user.schoolId)
  }

  @Get('courses/:courseId/students')
  getStudentsByCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
  ) {
    return this.studentsService.getStudentsByCourse(user.schoolId, courseId)
  }

  @Post('courses/:courseId/students')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createStudentInCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseStudentDto,
  ) {
    return this.studentsService.createStudentInCourse(
      user.schoolId,
      courseId,
      dto,
    )
  }

  @Post('courses/:courseId/import-preview')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  previewCourseImport(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Body() dto: ImportCourseStudentsPreviewDto,
  ) {
    return this.studentsService.previewCourseImport(
      user.schoolId,
      courseId,
      dto.students,
    )
  }

  @Post('courses/:courseId/import')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  importStudentsInCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Body() dto: ImportCourseStudentsDto,
  ) {
    return this.studentsService.importStudentsInCourse(
      user.schoolId,
      courseId,
      dto.students,
    )
  }

  @Patch('courses/:courseId/students/:studentId/withdraw')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  withdrawStudentFromCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.studentsService.withdrawStudentFromCourse(
      user.schoolId,
      courseId,
      studentId,
    )
  }

  @Patch('courses/:courseId/students/:studentId/transfer')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  transferStudentToCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
    @Body() dto: TransferCourseStudentDto,
  ) {
    return this.studentsService.transferStudentToCourse(
      user.schoolId,
      courseId,
      studentId,
      dto.targetCourseId,
    )
  }

  /**
   * Obtiene un estudiante por su identificador.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param id - Identificador del estudiante.
   * @returns El estudiante encontrado.
   * @throws NotFoundException si el estudiante no existe.
   */
  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.studentsService.findOne(user.schoolId, id)
  }

  /**
   * Crea un nuevo estudiante en el sistema.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param dto - Datos del estudiante a crear.
   * @returns El estudiante creado.
   */
  @Post()
  @Roles('admin', 'director', 'coordinator')
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateStudentDto,
  ) {
    return this.studentsService.create(user.schoolId, dto)
  }

  /**
   * Actualiza los datos de un estudiante existente.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param id - Identificador del estudiante a actualizar.
   * @param dto - Datos parciales a modificar del estudiante.
   * @returns El estudiante actualizado.
   */
  @Patch(':id')
  @Roles('admin', 'director', 'coordinator')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(user.schoolId, id, dto)
  }

  /**
   * Desactiva un estudiante cambiando su estado a inactivo.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param id - Identificador del estudiante a desactivar.
   * @returns El estudiante con el estado actualizado a INACTIVE.
   */
  @Patch(':id/deactivate')
  @Roles('admin', 'director', 'coordinator')
  deactivate(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.studentsService.deactivate(user.schoolId, id)
  }

  /**
   * Obtiene todas las matrículas de un estudiante.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param id - Identificador del estudiante.
   * @returns Lista de matrículas del estudiante.
   */
  @Get(':id/enrollments')
  getEnrollments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.studentsService.getEnrollments(user.schoolId, id)
  }

  /**
   * Crea una nueva matrícula para un estudiante.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param dto - Datos de la matrícula a crear.
   * @returns La matrícula creada.
   */
  @Post('enrollments')
  @Roles('admin', 'director', 'coordinator')
  createEnrollment(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateEnrollmentDto,
  ) {
    return this.studentsService.createEnrollment(user.schoolId, dto)
  }

  /**
   * Elimina una matrícula y sus registros asociados (asistencia y calificaciones).
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param id - Identificador de la matrícula a eliminar.
   * @returns La matrícula eliminada.
   */
  @Delete('enrollments/:id')
  @Roles('admin', 'director', 'coordinator')
  deleteEnrollment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.studentsService.deleteEnrollment(user.schoolId, id)
  }

  /**
   * Obtiene los apoderados asociados a un estudiante.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param id - Identificador del estudiante.
   * @returns Lista de vínculos entre el estudiante y sus apoderados.
   */
  @Get(':id/guardians')
  getGuardians(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.studentsService.getGuardians(user.schoolId, id)
  }

  /**
   * Envía una notificación a los apoderados de un estudiante.
   *
   * @param user - Usuario autenticado que realiza la solicitud.
   * @param id - Identificador del estudiante.
   * @param body - Cuerpo de la notificación con mensaje y asunto.
   * @returns Resultado de la notificación con el número de apoderados notificados.
   */
  @Post(':id/notify-guardians')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  notifyGuardians(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.studentsService.notifyGuardians(
      user.schoolId,
      id,
      user.id,
      body,
    )
  }
}
