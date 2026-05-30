import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('school')
  getSchool() {
    return this.settingsService.getSchool()
  }

  @Patch('school')
  updateSchool(@Body() body: any) {
    return this.settingsService.updateSchool(body)
  }

  @Get('school-years')
  getSchoolYears() {
    return this.settingsService.getSchoolYears()
  }

  @Post('school-years')
  createSchoolYear(@Body() body: any) {
    return this.settingsService.createSchoolYear(body)
  }

  @Patch('school-years/:id')
  updateSchoolYear(@Param('id') id: string, @Body() body: any) {
    return this.settingsService.updateSchoolYear(id, body)
  }

  @Post('school-years/:id/set-current')
  setCurrentSchoolYear(@Param('id') id: string) {
    return this.settingsService.setCurrentSchoolYear(id)
  }

  @Get('academic-periods')
  getAcademicPeriods() {
    return this.settingsService.getAcademicPeriods()
  }
}
