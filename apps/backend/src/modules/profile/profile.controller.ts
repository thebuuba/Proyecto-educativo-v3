/**
 * Controlador de perfil
 * @module ProfileController
 * @description Expone los endpoints REST para la consulta del perfil del usuario autenticado.
 */
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Patch()
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(user.id, dto)
  }

  /** Obtiene los datos del perfil del usuario autenticado */
  @Get()
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.profileService.getProfile(user.id)
  }
}
