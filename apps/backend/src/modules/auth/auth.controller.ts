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
  Res,
} from '@nestjs/common'
import type { Response } from 'express'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { RegisterDto } from './dto/register.dto'
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto'
import { JwtAuthGuard } from './strategies/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthenticatedUser } from './types/authenticated-user'
import { clearSessionCookie, setSessionCookie } from './session-cookie'

type AuthSession = Awaited<ReturnType<AuthService['login']>>

function respondWithSession(response: Response, session: AuthSession, rememberSession = false) {
  setSessionCookie(response, session.token, rememberSession)
  const { token: _token, ...publicSession } = session
  return publicSession
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    return respondWithSession(response, await this.authService.register(dto))
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('session')
  async createSession(
    @Headers('authorization') authHeader: string,
    @Headers('x-remember-session') rememberSession: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!token) throw new UnauthorizedException('Missing Authorization header')
    return respondWithSession(
      response,
      await this.authService.createSessionFromSupabaseToken(token),
      rememberSession === 'true',
    )
  }

  @Post('onboarding/complete')
  async completeOnboarding(
    @Headers('authorization') authHeader: string,
    @Body() dto: CompleteOnboardingDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!token) throw new UnauthorizedException('Missing Authorization header')
    return respondWithSession(response, await this.authService.completeOnboarding(token, dto))
  }

  @Get('onboarding/status')
  @UseGuards(JwtAuthGuard)
  getOnboardingStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getOnboardingStatus(user.schoolId)
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return respondWithSession(response, await this.authService.login(dto))
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    clearSessionCookie(response)
    return { success: true }
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

  @Get('bootstrap')
  @UseGuards(JwtAuthGuard)
  getBootstrap(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getBootstrap(user.id, user.schoolId)
  }
}
