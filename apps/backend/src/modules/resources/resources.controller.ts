import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { ResourcesService } from './resources.service'

@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'director', 'coordinator', 'teacher')
export class ResourcesController {
  constructor(private readonly resources: ResourcesService) {}

  @Get() list(@CurrentUser() user: AuthenticatedUser, @Query('sectionSubjectId') id: string, @Query('status') status?: string, @Query('kind') kind?: string, @Query('q') q?: string) {
    return this.resources.list(user, id, { status, kind, q })
  }

  @Post('link') createLink(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.resources.createLink(user, body)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  upload(@CurrentUser() user: AuthenticatedUser, @UploadedFile() file: any, @Body() body: any) {
    return this.resources.upload(user, body, file)
  }

  @Get(':id/open') async open(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Res() response: Response) {
    response.redirect(await this.resources.open(user, id))
  }

  @Patch(':id/archive') archive(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.resources.setArchived(user, id, true) }
  @Patch(':id/restore') restore(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.resources.setArchived(user, id, false) }
  @Delete(':id') remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.resources.remove(user, id) }
}
