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
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthSessionDto } from './dto/auth-session.dto'
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto'
import { JwtAuthGuard } from './strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from './types/authenticated-user'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('session')
  createSession(@Body() dto: AuthSessionDto) {
    return this.authService.createSessionFromSupabaseToken(dto.supabaseAccessToken)
  }

  @Post('onboarding/complete')
  completeOnboarding(@Body() dto: CompleteOnboardingDto) {
    return this.authService.completeOnboarding(dto.supabaseAccessToken, dto)
  }

  @Get('onboarding/status')
  @UseGuards(JwtAuthGuard)
  getOnboardingStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getOnboardingStatus(user.schoolId)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id)
  }
}
