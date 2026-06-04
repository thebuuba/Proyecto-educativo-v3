import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('student/:studentId')
  getStudentReport(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string) {
    return this.reportsService.getStudentReport(user.schoolId, studentId)
  }

  @Post('export')
  exportReport(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.reportsService.exportReport(user.schoolId, body)
  }
}
