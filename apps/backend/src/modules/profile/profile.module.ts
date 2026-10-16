/**
 * Módulo de perfil
 * @module ProfileModule
 * @description Agrupa el controlador y servicio para la gestión del perfil del usuario
 * autenticado, permitiendo consultar sus datos personales.
 */
import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { ProfileAvatar } from './profile-avatar'

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileAvatar],
})
/** Módulo que encapsula la funcionalidad de perfil de usuario */
export class ProfileModule {}
