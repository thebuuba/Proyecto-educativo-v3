import { Controller, Get, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: { id: string }) {
    return this.profileService.getProfile(user.id)
  }
}
