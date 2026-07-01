/**
 * Controlador de configuración
 * @module SettingsController
 * @description Expone los endpoints REST para la gestión de la configuración del colegio,
 * incluyendo datos de la institución, años escolares y períodos académicos.
 */
import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { UpdateSchoolDto } from './dto/update-school.dto'
import { CreateSchoolYearDto } from './dto/create-school-year.dto'
import { UpdateSchoolYearDto } from './dto/update-school-year.dto'

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  /** Obtiene los datos del colegio */
  @Get('school')
  getSchool(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getSchool(user.schoolId)
  }

  /** Actualiza los datos del colegio (solo admin, director) */
  @Patch('school')
  @Roles('admin', 'director')
  updateSchool(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateSchoolDto) {
    return this.settingsService.updateSchool(user.schoolId, dto)
  }

  /** Obtiene los años escolares del colegio */
  @Get('school-years')
  getSchoolYears(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getSchoolYears(user.schoolId)
  }

  /** Crea un nuevo año escolar (solo admin, director, coordinador) */
  @Post('school-years')
  @Roles('admin', 'director', 'coordinator')
  createSchoolYear(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSchoolYearDto) {
    return this.settingsService.createSchoolYear(user.schoolId, dto)
  }

  /** Actualiza un año escolar existente (solo admin, director, coordinador) */
  @Patch('school-years/:id')
  @Roles('admin', 'director', 'coordinator')
  updateSchoolYear(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateSchoolYearDto,
  ) {
    return this.settingsService.updateSchoolYear(user.schoolId, id, dto)
  }

  /** Establece un año escolar como el actual (solo admin, director, coordinador) */
  @Post('school-years/:id/set-current')
  @Roles('admin', 'director', 'coordinator')
  setCurrentSchoolYear(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.settingsService.setCurrentSchoolYear(user.schoolId, id)
  }

  /** Obtiene los períodos académicos del colegio */
  @Get('academic-periods')
  getAcademicPeriods(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getAcademicPeriods(user.schoolId)
  }
}
