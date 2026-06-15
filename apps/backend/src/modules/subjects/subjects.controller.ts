/**
 * Controlador de asignaturas.
 * Expone endpoints protegidos para consultar las asignaturas
 * disponibles en la escuela del usuario autenticado.
 */
import { Controller, Get, UseGuards } from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}

  /**
   * Lista todas las asignaturas de la escuela del usuario autenticado
   * ordenadas alfabéticamente por nombre.
   *
   * @param user - Usuario autenticado.
   * @returns Lista de asignaturas.
   */
  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.subjectsService.findAll(user.schoolId)
  }
}
