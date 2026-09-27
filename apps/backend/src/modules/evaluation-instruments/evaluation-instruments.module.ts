import { Body, Controller, HttpCode, Module, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { RecommendInstrumentDto } from './recommend-instrument.dto'
import { EvaluationInstrumentsService } from './evaluation-instruments.service'

@Controller('evaluation-instruments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationInstrumentsController {
  constructor(private readonly service: EvaluationInstrumentsService) {}

  @Post('recommend')
  @HttpCode(200)
  @Roles('admin', 'director', 'coordinator', 'teacher')
  recommend(@CurrentUser() user: AuthenticatedUser,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })) input: RecommendInstrumentDto) {
    return this.service.recommend(user, input)
  }
}

@Module({ controllers: [EvaluationInstrumentsController], providers: [EvaluationInstrumentsService] })
export class EvaluationInstrumentsModule {}
