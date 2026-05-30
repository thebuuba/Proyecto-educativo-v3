import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ScheduleService } from './schedule.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  findAll(@Query('sectionId') sectionId?: string) {
    return this.scheduleService.findAll(sectionId)
  }

  @Get('sections')
  getSections() {
    return this.scheduleService.getSections()
  }

  @Get('teachers')
  getTeachers() {
    return this.scheduleService.getTeachers()
  }

  @Get('subjects')
  getSubjects() {
    return this.scheduleService.getSubjects()
  }

  @Get('section-subjects')
  getSectionSubjects() {
    return this.scheduleService.getSectionSubjects()
  }

  @Get('time-slots')
  getTimeSlots() {
    return this.scheduleService.getTimeSlots()
  }

  @Post('time-slots')
  createTimeSlot(@Body() body: any) {
    return this.scheduleService.createTimeSlot(body)
  }

  @Patch('time-slots/:id')
  updateTimeSlot(@Param('id') id: string, @Body() body: any) {
    return this.scheduleService.updateTimeSlot(id, body)
  }

  @Delete('time-slots/:id')
  deleteTimeSlot(@Param('id') id: string) {
    return this.scheduleService.deleteTimeSlot(id)
  }

  @Get('entries')
  findEntries(@Query('sectionId') sectionId?: string, @Query('dayOfWeek') dayOfWeek?: string) {
    return this.scheduleService.findEntries(sectionId, dayOfWeek)
  }

  @Post('entries')
  createEntry(@Body() body: any) {
    return this.scheduleService.createEntry(body)
  }

  @Patch('entries/:id')
  updateEntry(@Param('id') id: string, @Body() body: any) {
    return this.scheduleService.updateEntry(id, body)
  }

  @Delete('entries/:id')
  deleteEntry(@Param('id') id: string) {
    return this.scheduleService.deleteEntry(id)
  }
}
