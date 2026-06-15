import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('permissions')
  getPermissions(@CurrentUser() user: AuthenticatedUser, @Query('roleIds') roleIds: string) {
    const ids = roleIds.split(',').filter(Boolean)
    return this.usersService.getPermissions(user.schoolId, user.id, ids)
  }

  @Get()
  @Roles('admin', 'director')
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findAll(user.schoolId)
  }

  @Get(':id')
  @Roles('admin', 'director')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.usersService.findOne(user.schoolId, id)
  }

  @Patch(':id')
  @Roles('admin', 'director')
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() body: any) {
    return this.usersService.update(user.schoolId, id, body)
  }

  @Get(':id/roles')
  @Roles('admin', 'director')
  getRoles(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.usersService.getRoles(user.schoolId, id)
  }
}
