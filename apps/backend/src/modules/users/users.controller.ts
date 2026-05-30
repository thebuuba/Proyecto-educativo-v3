import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('permissions')
  getPermissions(@Query('roleIds') roleIds: string) {
    const ids = roleIds.split(',').filter(Boolean)
    return this.usersService.getPermissions(ids)
  }

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body)
  }

  @Get(':id/roles')
  getRoles(@Param('id') id: string) {
    return this.usersService.getRoles(id)
  }
}
