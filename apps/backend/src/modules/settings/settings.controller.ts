import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('school')
  getSchool(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getSchool(user.schoolId)
  }

  @Patch('school')
  @Roles('admin', 'director')
  updateSchool(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.settingsService.updateSchool(user.schoolId, body)
  }

  @Get('school-years')
  getSchoolYears(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getSchoolYears(user.schoolId)
  }

  @Post('school-years')
  @Roles('admin', 'director', 'coordinator')
  createSchoolYear(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.settingsService.createSchoolYear(user.schoolId, body)
  }

  @Patch('school-years/:id')
  @Roles('admin', 'director', 'coordinator')
  updateSchoolYear(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.settingsService.updateSchoolYear(user.schoolId, id, body)
  }

  @Post('school-years/:id/set-current')
  @Roles('admin', 'director', 'coordinator')
  setCurrentSchoolYear(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.settingsService.setCurrentSchoolYear(user.schoolId, id)
  }

  @Get('academic-periods')
  getAcademicPeriods(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.getAcademicPeriods(user.schoolId)
  }
}
