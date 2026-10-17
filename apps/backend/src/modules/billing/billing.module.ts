import { Module } from '@nestjs/common'
import { BillingAdminController, BillingController, BillingWebhookController, CommercialAdminGuard } from './billing.controller'
import { BillingService } from './billing.service'
import { BillingOperations } from './billing-operations'
import { BillingProviderService } from './billing-provider.service'
import { BillingEventsService } from './billing-events.service'
import { BillingReceipts } from './billing-receipts'
import { BillingMaintenance } from './billing-maintenance'

@Module({
  controllers: [BillingController, BillingAdminController, BillingWebhookController],
  providers: [BillingService, BillingOperations, BillingProviderService, BillingEventsService, BillingReceipts, BillingMaintenance, CommercialAdminGuard],
})
export class BillingModule {}
