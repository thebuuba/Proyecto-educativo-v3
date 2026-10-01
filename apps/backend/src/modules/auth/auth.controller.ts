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
  ForbiddenException,
  ConflictException,
  Res,
  Req,
} from '@nestjs/common'
import type { Request, Response } from 'express'
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
import { isDeviceTrustEnabled, requireRecentOnboardingProof, requireTrustedDevice } from './device-trust'
import { getSupabaseUserFromToken } from './supabase-user'
import { prisma } from '@aula/database'

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
    if (isDeviceTrustEnabled()) throw new ForbiddenException('Usa el registro web con confirmación de correo.')
    return respondWithSession(response, await this.authService.register(dto))
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('session')
  async createSession(
    @Headers('authorization') authHeader: string,
    @Headers('x-remember-session') rememberSession: string | undefined,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!token) throw new UnauthorizedException('Missing Authorization header')
    const session = await this.authService.createSessionFromSupabaseToken(token)
    if (isDeviceTrustEnabled()) await requireTrustedDevice(request, response, session.appUser.id, session.appUser.authUserId, token)
    return respondWithSession(
      response,
      session,
      rememberSession === 'true',
    )
  }

  @Post('onboarding/complete')
  async completeOnboarding(
    @Headers('authorization') authHeader: string,
    @Body() dto: CompleteOnboardingDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = authHeader?.replace(/^Bearer\s+/i, '')
    if (!token) throw new UnauthorizedException('Missing Authorization header')
    if (isDeviceTrustEnabled()) {
      const authUser = await getSupabaseUserFromToken(token)
      const existing = await prisma.appUser.findUnique({ where: { authUserId: authUser.id }, select: { id: true } })
      if (existing) await requireTrustedDevice(request, response, existing.id, authUser.id, token)
      else requireRecentOnboardingProof(token, authUser.id)
    }
    const session = await this.authService.completeOnboarding(token, dto)
    if (isDeviceTrustEnabled()) await requireTrustedDevice(request, response, session.appUser.id, session.appUser.authUserId, token)
    return respondWithSession(response, session)
  }

  @Get('onboarding/status')
  @UseGuards(JwtAuthGuard)
  getOnboardingStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getOnboardingStatus(user.schoolId)
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const { session, accessToken, refreshToken } = await this.authService.loginWithToken(dto)
    if (isDeviceTrustEnabled()) {
      try {
        await requireTrustedDevice(request, response, session.appUser.id, session.appUser.authUserId, accessToken)
      } catch (error) {
        if (error instanceof ConflictException) {
          const details = error.getResponse() as { code?: string; method?: string }
          if (details.code === 'VERIFICATION_REQUIRED') {
            return { verificationRequired: details.method, supabaseSession: { accessToken, refreshToken } }
          }
        }
        throw error
      }
    }
    return { ...respondWithSession(response, session, true), supabaseSession: { accessToken, refreshToken } }
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
