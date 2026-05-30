import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('student/:studentId')
  getStudentReport(@Param('studentId') studentId: string) {
    return this.reportsService.getStudentReport(studentId)
  }

  @Post('export')
  exportReport(@Body() body: any) {
    return this.reportsService.exportReport(body)
  }
}
