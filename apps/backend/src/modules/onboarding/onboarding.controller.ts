import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { SaveTourProgressDto } from './dto/save-tour-progress.dto'
import { OnboardingService } from './onboarding.service'

@Controller('onboarding/tours')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.onboardingService.list(user)
  }

  @Put(':tourKey')
  save(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tourKey') tourKey: string,
    @Body() dto: SaveTourProgressDto,
  ) {
    return this.onboardingService.save(user, tourKey, dto)
  }
}
