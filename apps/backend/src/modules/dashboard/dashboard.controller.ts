import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats()
  }

  @Get('tasks')
  getTasks() {
    return this.dashboardService.getTasks()
  }

  @Post('tasks')
  createTask(@Body() body: any) {
    return this.dashboardService.createTask(body)
  }

  @Patch('tasks/:id')
  updateTask(@Param('id') id: string, @Body() body: any) {
    return this.dashboardService.updateTask(id, body)
  }
}
