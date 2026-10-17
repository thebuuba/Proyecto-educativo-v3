/**
 * Controlador de perfil
 * @module ProfileController
 * @description Expone los endpoints REST para la consulta del perfil del usuario autenticado.
 */
import { Body, Controller, Delete, Get, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import { ProfileService } from './profile.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdateProfileSettingsDto } from './dto/update-profile-settings.dto'
import { AVATAR_LIMIT, ProfileAvatar } from './profile-avatar'

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService, private avatar: ProfileAvatar = new ProfileAvatar()) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: AVATAR_LIMIT, files: 1 } }))
  async uploadAvatar(@CurrentUser() user: AuthenticatedUser, @UploadedFile() file?: { buffer: Buffer; mimetype: string }) {
    await this.avatar.upload(user, file)
    return this.profileService.getSettings(user)
  }

  @Delete('avatar')
  async removeAvatar(@CurrentUser() user: AuthenticatedUser) {
    await this.avatar.remove(user)
    return this.profileService.getSettings(user)
  }

  @Get('avatar')
  async getAvatar(@CurrentUser() user: AuthenticatedUser, @Res() response: Response) {
    const photo = await this.avatar.read(user)
    response.setHeader('Content-Type', photo.contentType)
    response.setHeader('Cache-Control', 'private, no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.send(Buffer.from(photo.bytes))
  }

  @Get('settings')
  getSettings(@CurrentUser() user: AuthenticatedUser) { return this.profileService.getSettings(user) }

  @Patch('settings')
  updateSettings(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileSettingsDto) {
    return this.profileService.updateSettings(user, dto)
  }

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
