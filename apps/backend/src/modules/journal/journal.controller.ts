import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { AuthenticatedUser } from '../auth/types/authenticated-user'
import { SaveJournalEntryDto } from './dto/save-journal-entry.dto'
import { JournalService } from './journal.service'

@Controller('journal')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'director', 'coordinator', 'teacher')
export class JournalController {
  constructor(private readonly journal: JournalService) {}

  @Get() list(@CurrentUser() user: AuthenticatedUser) { return this.journal.list(user.schoolId, user.id) }
  @Post() create(@CurrentUser() user: AuthenticatedUser, @Body() dto: SaveJournalEntryDto) { return this.journal.create(user.schoolId, user.id, dto) }
  @Patch(':id') update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: SaveJournalEntryDto) { return this.journal.update(user.schoolId, user.id, id, dto) }
  @Post(':id/archive') archive(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.journal.setArchive(user.schoolId, user.id, id, true) }
  @Post(':id/restore') restore(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.journal.setArchive(user.schoolId, user.id, id, false) }
  @Post(':id/complete') complete(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.journal.completeFollowUp(user.schoolId, user.id, id) }
  @Delete(':id') remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return this.journal.remove(user.schoolId, user.id, id) }
}
