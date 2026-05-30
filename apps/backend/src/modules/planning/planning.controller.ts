import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PlanningService } from './planning.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('planning')
@UseGuards(JwtAuthGuard)
export class PlanningController {
  constructor(private planningService: PlanningService) {}

  @Get()
  findAll(@Query('sectionSubjectId') sectionSubjectId?: string) {
    return this.planningService.findAll(sectionSubjectId)
  }

  @Get('academic-periods')
  getAcademicPeriods() {
    return this.planningService.getAcademicPeriods()
  }

  @Post('academic-periods')
  createAcademicPeriod(@Body() body: any) {
    return this.planningService.createAcademicPeriod(body)
  }

  @Patch('academic-periods/:id')
  updateAcademicPeriod(@Param('id') id: string, @Body() body: any) {
    return this.planningService.updateAcademicPeriod(id, body)
  }

  @Delete('academic-periods/:id')
  deleteAcademicPeriod(@Param('id') id: string) {
    return this.planningService.deleteAcademicPeriod(id)
  }

  @Get('competencies')
  getCompetencies(@Query('subjectId') subjectId?: string) {
    return this.planningService.getCompetencies(subjectId)
  }

  @Get('section-subjects')
  getSectionSubjects() {
    return this.planningService.getSectionSubjects()
  }

  @Get('entries')
  findEntries(@Query('sectionSubjectId') sectionSubjectId?: string) {
    return this.planningService.findEntries(sectionSubjectId)
  }

  @Post('entries')
  createEntry(@Body() body: any) {
    return this.planningService.createEntry(body)
  }

  @Patch('entries/:id')
  updateEntry(@Param('id') id: string, @Body() body: any) {
    return this.planningService.updateEntry(id, body)
  }

  @Delete('entries/:id')
  deleteEntry(@Param('id') id: string) {
    return this.planningService.deleteEntry(id)
  }
}
