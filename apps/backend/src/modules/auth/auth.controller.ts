/**
 * Controlador de autenticación.
 * Expone los endpoints públicos y protegidos para el manejo
 * de registro, inicio de sesión, recuperación de contraseña
 * y consulta del perfil del usuario autenticado.
 */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { RegisterDto } from './dto/register.dto'
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto'
import { JwtAuthGuard } from './strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from './types/authenticated-user'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('session')
  createSession(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!token) throw new UnauthorizedException('Missing Authorization header')
    return this.authService.createSessionFromSupabaseToken(token)
  }

  @Post('onboarding/complete')
  completeOnboarding(
    @Headers('authorization') authHeader: string,
    @Body() dto: CompleteOnboardingDto,
  ) {
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!token) throw new UnauthorizedException('Missing Authorization header')
    return this.authService.completeOnboarding(token, dto)
  }

  @Get('onboarding/status')
  @UseGuards(JwtAuthGuard)
  getOnboardingStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getOnboardingStatus(user.schoolId)
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id)
  }
}
