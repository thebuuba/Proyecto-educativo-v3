/**
 * Controlador de usuarios.
 * Expone endpoints protegidos para la gestión de usuarios,
 * roles y permisos dentro de una escuela.
 */
import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Obtiene los permisos correspondientes a los roles especificados.
   *
   * @param user - Usuario autenticado.
   * @param roleIds - IDs de roles separados por coma.
   * @returns Lista de permisos activos.
   */
  @Get('permissions')
  getPermissions(@CurrentUser() user: AuthenticatedUser, @Query('roleIds') roleIds: string) {
    const ids = roleIds.split(',').filter(Boolean)
    return this.usersService.getPermissions(user.schoolId, user.id, ids)
  }

  /**
   * Lista todos los usuarios de la escuela del usuario autenticado.
   * Requiere rol de admin o director.
   *
   * @param user - Usuario autenticado.
   * @returns Lista de usuarios.
   */
  @Get()
  @Roles('admin', 'director')
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findAll(user.schoolId)
  }

  /**
   * Obtiene un usuario por ID dentro de la misma escuela.
   * Requiere rol de admin o director.
   *
   * @param user - Usuario autenticado.
   * @param id - ID del usuario a consultar.
   * @returns Datos del usuario o null si no existe.
   */
  @Get(':id')
  @Roles('admin', 'director')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.usersService.findOne(user.schoolId, id)
  }

  /**
   * Actualiza los datos de un usuario.
   * Requiere rol de admin o director.
   *
   * @param user - Usuario autenticado.
   * @param id - ID del usuario a actualizar.
   * @param body - Campos a actualizar.
   * @returns Usuario actualizado.
   */
  @Patch(':id')
  @Roles('admin', 'director')
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.schoolId, id, dto)
  }

  /**
   * Obtiene los roles activos de un usuario dentro de la escuela.
   * Requiere rol de admin o director.
   *
   * @param user - Usuario autenticado.
   * @param id - ID del usuario.
   * @returns Lista de roles activos.
   */
  @Get(':id/roles')
  @Roles('admin', 'director')
  getRoles(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.usersService.getRoles(user.schoolId, id)
  }
}
