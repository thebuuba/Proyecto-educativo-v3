import { Body, CanActivate, Controller, ExecutionContext, Get, Headers, HttpException, HttpStatus, Injectable, Param, ParseUUIDPipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { RawBodyRequest } from '@nestjs/common'
import type { Request, Response } from 'express'
import { randomBytes } from 'node:crypto'
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { prisma } from '@aula/database'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { BillingService } from './billing.service'
import { BillingOperations } from './billing-operations'
import { BillingProviderService } from './billing-provider.service'
import { BillingEventsService } from './billing-events.service'
import { ApproveTransferDto, BillingAdminQueryDto, CheckoutDto, CreateCourtesyDto, CreateTransferDto, ReasonDto, ReportTransferDto, SupportDto, UpdateSupportDto } from './billing.dto'
import { requireBilling, requireCommercialAdmin } from './billing-store'
import { BillingReceipts, RECEIPT_LIMIT } from './billing-receipts'
import { BillingMaintenance } from './billing-maintenance'

@Injectable()
export class CommercialAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    requireBilling()
    await requireCommercialAdmin(context.switchToHttp().getRequest().user.id)
    return true
  }
}

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billing: BillingService, private readonly operations: BillingOperations, private readonly provider: BillingProviderService, private readonly receipts: BillingReceipts) {}
  @Get() overview(@CurrentUser() user: AuthenticatedUser) { return this.billing.overview(user) }
  @Post('trial') trial(@CurrentUser() user: AuthenticatedUser) { return this.operations.startTrial(user) }
  @Post('transfers') transfer(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTransferDto) { return this.operations.createTransfer(user, dto) }
  @Post('transfers/:id/report') report(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: ReportTransferDto) { return this.operations.reportTransfer(user, id, dto) }
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: RECEIPT_LIMIT, files: 1 } }))
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('transfers/:id/receipt') upload(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @UploadedFile() file?: { buffer: Buffer; mimetype: string }) { return this.receipts.upload(user, id, file) }
  @Get('transfers/:id/receipt') receipt(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) { return this.receipts.download(user, id) }
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('checkout') checkout(@CurrentUser() user: AuthenticatedUser, @Body() dto: CheckoutDto) { return this.provider.checkout(user, dto) }
  @Get('checkout-page')
  async checkoutPage(@CurrentUser() user: AuthenticatedUser, @Query('_ptxn') transaction: string, @Res() response: Response) {
    const nonce = randomBytes(18).toString('base64url')
    const html = await this.provider.checkoutPage(user, transaction, nonce)
    response.setHeader('Cache-Control', 'private, no-store, max-age=0')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}' https://cdn.paddle.com; frame-src https://*.paddle.com; connect-src https://*.paddle.com; img-src data: https://*.paddle.com; style-src 'unsafe-inline' https://cdn.paddle.com https://sandbox-cdn.paddle.com; frame-ancestors 'none'; base-uri 'none'; form-action https://*.paddle.com`)
    return response.type('html').send(html)
  }
  @Post('portal') portal(@CurrentUser() user: AuthenticatedUser) { return this.provider.portal(user) }
  @Post('cancel-renewal') cancel(@CurrentUser() user: AuthenticatedUser) { return this.provider.cancelRenewal(user) }
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('support') support(@CurrentUser() user: AuthenticatedUser, @Body() dto: SupportDto) { return this.operations.createSupport(user, dto) }
  @Get('support/:id') detail(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) { return this.billing.supportDetail(user, id) }
}

@Controller('billing/admin')
@UseGuards(JwtAuthGuard, CommercialAdminGuard)
export class BillingAdminController {
  constructor(private readonly operations: BillingOperations, private readonly events: BillingEventsService, private readonly maintenance: BillingMaintenance) {}
  @Get() overview(@CurrentUser() user: AuthenticatedUser, @Query() query: BillingAdminQueryDto) { return this.operations.adminOverview(user, query) }
  @Get('catalog') async catalog() {
    const config = requireBilling()
    return { plans: await prisma.billingPlan.findMany({ where: { code: 'docente-completo', status: 'ACTIVE' }, select: { id: true, name: true } }),
      configuration: { ...config, environment: 'sandbox', bankConfigured: !!process.env.BILLING_BANK_ACCOUNT_ID && !!process.env.BILLING_BANK_INSTRUCTIONS,
        supportEmail: process.env.BILLING_SUPPORT_EMAIL || null, termsVersion: process.env.BILLING_TERMS_VERSION || null } }
  }
  @Post('courtesies') courtesy(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCourtesyDto) { return this.operations.grantCourtesy(user, dto) }
  @Post('courtesies/:id/revoke') revoke(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: ReasonDto) { return this.operations.revokeCourtesy(user, id, dto) }
  @Post('transfers/:id/approve') approve(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: ApproveTransferDto) { return this.operations.approveTransfer(user, id, dto) }
  @Post('transfers/:id/reject') reject(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: ReasonDto) { return this.operations.rejectTransfer(user, id, dto) }
  @Post('support/:id') support(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSupportDto) { return this.operations.updateSupport(user, id, dto) }
  @Post('events/:id/retry') retry(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) { return this.events.retry(user, id) }
  @Post('subscriptions/:id/reconcile') reconcile(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) { return this.events.reconcile(user, id) }
  @Post('maintenance') maintain(@CurrentUser() user: AuthenticatedUser) { return this.maintenance.run(user) }
}

@Controller('billing/webhooks')
export class BillingWebhookController {
  constructor(private readonly events: BillingEventsService) {}
  @SkipThrottle()
  @Post('paddle')
  async paddle(@Req() request: RawBodyRequest<Request>, @Headers('paddle-signature') signature: string) {
    const result = await this.events.receive(request.rawBody ?? Buffer.alloc(0), signature)
    if (!result.accepted) {
      const unavailable = ['events_disabled', 'not_configured', 'race_unresolved'].includes(result.reason ?? '')
      throw new HttpException({ message: unavailable ? 'Webhook sandbox no disponible.' : `Notificación no válida (${result.reason ?? 'rejected'}).` }, unavailable ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.BAD_REQUEST)
    }
    return result
  }
}
