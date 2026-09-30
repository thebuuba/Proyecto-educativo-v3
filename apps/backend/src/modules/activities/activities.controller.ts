import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { ActivitiesService } from './activities.service'
import { SaveActivityDto } from './dto/save-activity.dto'

@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('sectionSubjectId') sectionSubjectId?: string,
    @Query('academicPeriodId') academicPeriodId?: string,
    @Query('planningEntryId') planningEntryId?: string,
  ) {
    return this.activities.findAll(user.schoolId, { sectionSubjectId, academicPeriodId, planningEntryId })
  }

  @Get('center')
  getCenter(@CurrentUser() user: AuthenticatedUser) {
    return this.activities.getCenter(user.schoolId, user.id, user.roles)
  }

  @Post()
  @Roles('admin', 'director', 'coordinator', 'teacher')
  save(@CurrentUser() user: AuthenticatedUser, @Body() dto: SaveActivityDto) {
    return this.activities.save(user.schoolId, user.id, dto, user.roles)
  }

  @Post(':id/link-planning')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  linkPlanning(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: { planningEntryId: string | null; planningMoment?: string },
  ) {
    return this.activities.linkPlanning(user.schoolId, id, dto)
  }

  @Delete(':id')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.activities.remove(user.schoolId, id)
  }
}
