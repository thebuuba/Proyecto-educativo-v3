// Real service + app_backend/RLS integration, exclusively against our disposable database.
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
const require = createRequire(new URL('../packages/database/package.json', import.meta.url))
const { Client } = require('pg')
const url = new URL(process.env.BILLING_WORKFLOW_DATABASE_URL ?? '')
assert(['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) && url.port === '55439')
assert(/^\/aulabase_billing_test_[a-f0-9]+$/.test(url.pathname), 'Only the disposable billing database is allowed')
const db = new Client({ connectionString: url.toString() })
await db.connect()
const schoolId = randomUUID(), planId = randomUUID(), priceId = randomUUID()
const users = Array.from({ length: 4 }, (_, i) => ({ id: randomUUID(), auth: randomUUID(),
  email: `workflow-${randomUUID()}@example.invalid`, schoolId, roles: [i === 3 ? 'admin' : 'teacher'] }))
await db.query('insert into public.schools(id,name,slug) values ($1,$2,$3)', [schoolId, 'Synthetic billing workflow school', randomUUID()])
for (const user of users) {
  await db.query('insert into auth.users(id) values ($1)', [user.auth])
  await db.query('insert into public.app_users(id,auth_user_id,full_name,email,school_id) values ($1,$2,$3,$4,$5)', [user.id,user.auth,'Synthetic test teacher',user.email,schoolId])
  await db.query('insert into public.user_roles(user_id,role_id,school_id) select $1,id,$2 from public.roles where key=$3', [user.id,schoolId,user.roles[0]])
}
await db.query("insert into public.billing_admins(user_id,note) values ($1,'Synthetic commercial reviewer')", [users[2].id])
await db.query("insert into public.billing_plans(id,code,name,status,is_public) values ($1,'docente-completo','Synthetic Docente Completo','active',true)", [planId])
await db.query("insert into public.billing_prices(id,plan_id,version,currency,amount_minor,status,is_public) values ($1,$2,1,'DOP',10000,'active',true)", [priceId,planId])
await db.query("update storage.buckets set public=false where id='activity-description-images'")
await db.query('update public.billing_runtime_settings set enforce_access=true')
Object.assign(process.env, {
  BILLING_ENABLED: 'true', BILLING_CHECKOUT_ENABLED: 'true', BILLING_EVENTS_ENABLED: 'true', BILLING_ENFORCE_ACCESS: 'true',
  BILLING_ENVIRONMENT: 'sandbox', BILLING_BANK_ACCOUNT_ID: 'SYNTHETIC-ONLY',
  BILLING_BANK_INSTRUCTIONS: 'PRUEBA AISLADA. No transferir dinero. No es una cuenta operativa.',
  BILLING_TRIAL_DAYS: '14', BILLING_GRACE_DAYS: '7', PADDLE_SANDBOX_WEBHOOK_SECRET: 'SYNTHETIC-WEBHOOK-SECRET',
})
const { runWithPrismaClient, prisma, Prisma } = require('./dist/index.js')
const backend = createRequire(new URL('../apps/backend/package.json', import.meta.url))
const { BillingOperations } = backend('./dist/modules/billing/billing-operations.js')
const { BillingEventsService } = backend('./dist/modules/billing/billing-events.service.js')
const { BillingReceipts } = backend('./dist/modules/billing/billing-receipts.js')
const { effectiveAccess } = backend('./dist/modules/billing/billing-store.js')
url.username = 'app_backend'
const [one, two, reviewer, schoolAdmin] = users
const operations = new BillingOperations()
try {
  await runWithPrismaClient(url.toString(), async () => {
    for (const model of Prisma.dmmf.datamodel.models.filter(model=>model.name.startsWith('Billing'))) {
      await prisma[model.name[0].toLowerCase()+model.name.slice(1)].findMany({take:1})
    }
    console.log('PASS: every commercial Prisma model reads through app_backend against the migrated SQL schema.')
    const [trialA, trialB] = await Promise.all([operations.startTrial(one), operations.startTrial(one)])
    assert.equal(trialA.id, trialB.id)
    assert.equal(trialA.endsAt, trialB.endsAt)
    await db.query('update public.app_users set email=$1 where id=$2', [`changed-${randomUUID()}@example.invalid`,one.id])
    assert.equal((await operations.startTrial(one)).endsAt, trialA.endsAt)
    assert.equal((await effectiveAccess(two.id)).allowed, false)
    await assert.rejects(operations.grantCourtesy(schoolAdmin, { userId: two.id, planId, startsAt: new Date().toISOString(), reason: 'Synthetic courtesy reason', acknowledgeActiveRenewal: false }))
    const courtesy = await operations.grantCourtesy(reviewer, { userId: two.id, planId, startsAt: new Date(Date.now()-60000).toISOString(), reason: 'Synthetic courtesy reason', acknowledgeActiveRenewal: false })
    assert.equal((await effectiveAccess(two.id)).reason, 'courtesy')
    await operations.revokeCourtesy(reviewer, courtesy.id, { reason: 'Synthetic courtesy revocation' })
    assert.equal((await effectiveAccess(two.id)).allowed, false)
    console.log('PASS: concurrent unique trial, immutable expiry after email change, independent teachers and commercial permission.')

    const [a, b] = await Promise.all([operations.createTransfer(one,{priceId}), operations.createTransfer(one,{priceId})])
    assert.equal(a.id,b.id)
    await assert.rejects(operations.reportTransfer(two,a.id,{bankReference:'OTHER-OWNER'}))
    await operations.reportTransfer(one,a.id,{bankReference:'SYNTHETIC-BANK-REF'})
    assert.equal((await effectiveAccess(one.id)).reason,'trial')
    const approval = { bankMovementId: `SYNTHETIC-${randomUUID()}`, amountMinor: 10000, currency: 'DOP', receivedAt: new Date().toISOString(), reason: 'Synthetic bank movement confirmed' }
    const approved = await Promise.all([operations.approveTransfer(reviewer,a.id,approval), operations.approveTransfer(reviewer,a.id,approval)])
    assert.equal(approved[0].paymentId,approved[1].paymentId)
    assert.equal((await effectiveAccess(one.id)).reason,'paid')
    const other = await operations.createTransfer(two,{priceId})
    await assert.rejects(operations.approveTransfer(reviewer,other.id,approval))
    assert.equal((await effectiveAccess(two.id)).allowed,false)
    const counts = await db.query('select (select count(*)::int from billing_payments) as payments,(select count(*)::int from billing_bank_movements) as movements')
    assert.equal(counts.rows[0].payments,1)
    assert.equal(counts.rows[0].movements,1)
    assert.equal((await db.query('select count(*)::int as n from billing_documents')).rows[0].n,1)
    console.log('PASS: double creation/approval, foreign transfer isolation and duplicate bank movement rejection.')

    const support = await operations.createSupport(two,{category:'access',subject:'Synthetic access question',message:'Synthetic expired account needs help.'})
    assert.match(support.number,/^CAS-/)
    await operations.updateSupport(reviewer,support.id,{status:'resolved',reason:'Synthetic support resolution'})
    await assert.rejects(new BillingReceipts().download(two,a.id))
    console.log('PASS: expired account support is persisted and commercially reviewed; foreign receipts denied.')

    const events = new BillingEventsService()
    const body = Buffer.from(JSON.stringify({event_id:`evt_${randomUUID()}`,event_type:'unknown.test',occurred_at:new Date().toISOString(),data:{}}))
    const ts = Math.floor(Date.now()/1000)
    const signature = `ts=${ts};h1=${createHmac('sha256',process.env.PADDLE_SANDBOX_WEBHOOK_SECRET).update(`${ts}:`).update(body).digest('hex')}`
    const first = await events.receive(body,signature)
    assert.equal(first.accepted,true)
    assert.equal(first.status,'ignored')
    assert.equal((await events.receive(body,signature)).status,'duplicate')
    assert.equal((await events.receive(body,'invalid')).accepted,false)
    console.log('PASS: signed unknown events persist without privileges, deduplication and invalid signature rejection.')

    const syntheticPayment = randomUUID(), remoteTransaction = `txn_${randomUUID().replaceAll('-','').slice(0,26)}`
    await db.query("insert into billing_payments(id,account_id,plan_id,price_id,source,provider,provider_payment_id,amount_minor,currency,status) select $1,id,$2,$3,'provider','paddle',$4,10000,'DOP','succeeded' from billing_accounts where user_id=$5",[syntheticPayment,planId,priceId,remoteTransaction,one.id])
    await db.query(`create function app_private.synthetic_refund_delay() returns trigger language plpgsql as $$ begin perform pg_sleep(0.1); return new; end $$;
      create trigger synthetic_refund_delay before update on public.billing_payments for each row execute function app_private.synthetic_refund_delay()`)
    const refund = async amount => {
      const payload = Buffer.from(JSON.stringify({event_id:`evt_${randomUUID()}`,event_type:'adjustment.updated',occurred_at:new Date().toISOString(),data:{id:`adj_${randomUUID()}`,transaction_id:remoteTransaction,action:'refund',status:'approved',totals:{total:String(amount)}}}))
      const stamp = Math.floor(Date.now()/1000)
      const signed = `ts=${stamp};h1=${createHmac('sha256',process.env.PADDLE_SANDBOX_WEBHOOK_SECRET).update(`${stamp}:`).update(payload).digest('hex')}`
      return events.receive(payload,signed)
    }
    const refunds = await Promise.all([refund(1000),refund(2000)])
    assert(refunds.every(result=>result.status==='processed'))
    assert.equal((await db.query('select amount_refunded_minor::text as amount from billing_payments where id=$1',[syntheticPayment])).rows[0].amount,'3000')
    await db.query('drop trigger synthetic_refund_delay on billing_payments; drop function app_private.synthetic_refund_delay()')
    console.log('PASS: concurrent partial refunds retain both amounts and adjustment identities.')
    await refund(7000)
    const income = (await operations.adminOverview(reviewer,{})).metrics.byCurrency.find(row=>row.currency==='DOP')
    assert.equal(income.grossMinor,20000)
    assert.equal(income.refundedMinor,10000)
    assert.equal(income.netMinor,10000)
    console.log('PASS: a full refund remains in gross/refund history and does not appear as net revenue.')

    const { BillingMaintenance } = backend('./dist/modules/billing/billing-maintenance.js')
    await operations.startTrial(reviewer)
    await db.query("update public.billing_trials set ends_at=now()+interval '1 day' where account_id=(select id from billing_accounts where user_id=$1)",[reviewer.id])
    const maintenance = new BillingMaintenance(events)
    await assert.rejects(maintenance.run(schoolAdmin))
    await maintenance.run(reviewer)
    const noticeCount = await db.query("select count(*)::int as n from billing_outbox where template='trial_ending'")
    assert.equal(noticeCount.rows[0].n,1)
    await maintenance.run(reviewer)
    assert.equal((await db.query("select count(*)::int as n from billing_outbox where template='trial_ending'")).rows[0].n,1)
    console.log('PASS: persistent upcoming-expiry notice, maintenance authorization and deduplication.')

    // Simulated Paddle HTTP + real local DB: first payment with a lost checkout response/webhook.
    const paddlePriceId = randomUUID(), localSubscriptionId = randomUUID(), operationId = randomUUID()
    const providerId = prefix => `${prefix}_${randomUUID().replaceAll('-','').slice(0,26)}`
    const customerId = providerId('ctm'), remoteSubscriptionId = providerId('sub'), transactionId = providerId('txn'), remotePriceId = providerId('pri')
    const accountId = (await db.query('select id from billing_accounts where user_id=$1',[two.id])).rows[0].id
    await db.query("insert into billing_prices(id,plan_id,version,currency,amount_minor,status,is_public,provider,provider_price_id) values ($1,$2,2,'DOP',10000,'active',true,'paddle',$3)",[paddlePriceId,planId,remotePriceId])
    await db.query("insert into billing_provider_customers(account_id,provider,provider_customer_id) values ($1,'paddle',$2)",[accountId,customerId])
    await db.query("insert into billing_subscriptions(id,account_id,plan_id,price_id,provider,metadata) values ($1,$2,$3,$4,'paddle',$5)",[localSubscriptionId,accountId,planId,paddlePriceId,JSON.stringify({checkoutOperationId:operationId})])
    const at = new Date().toISOString(), until = new Date(Date.now()+28*86400000).toISOString()
    const transaction = {id:transactionId,status:'completed',customer_id:customerId,subscription_id:remoteSubscriptionId,currency_code:'DOP',updated_at:at,billed_at:at,
      billing_period:{starts_at:at,ends_at:until},custom_data:{checkoutOperationId:operationId},items:[{price_id:remotePriceId}],details:{totals:{total:'10000'}}}
    const actualFetch = globalThis.fetch
    process.env.PADDLE_SANDBOX_API_KEY='pdl_sdbx_apikey_SYNTHETIC-ONLY'
    globalThis.fetch = async input => {
      const remote = new URL(String(input))
      assert.equal(remote.origin,'https://sandbox-api.paddle.com','The simulated provider must never send a real request')
      const data = remote.pathname === '/transactions' ? [transaction]
        : remote.pathname === `/transactions/${transactionId}` ? transaction
        : remote.pathname === `/subscriptions/${remoteSubscriptionId}` ? {id:remoteSubscriptionId,status:'active',customer_id:customerId,updated_at:at,next_billed_at:until,current_billing_period:{starts_at:at,ends_at:until},scheduled_change:null}
        : assert.fail(`Unexpected simulated provider path: ${remote.pathname}`)
      return Response.json({data})
    }
    try {
      await events.reconcile(reviewer,localSubscriptionId)
      await events.reconcile(reviewer,localSubscriptionId)
      const recovered = (await db.query('select id from billing_payments where provider_payment_id=$1',[transactionId])).rows
      assert.equal(recovered.length,1)
      assert.equal((await db.query('select count(*)::int as n from billing_service_periods where payment_id=$1',[recovered[0].id])).rows[0].n,1)
      assert.equal((await db.query('select count(*)::int as n from billing_documents where payment_id=$1',[recovered[0].id])).rows[0].n,1)
      assert.equal((await db.query("select signature_valid from billing_events where provider_event_id like $1",[`reconciliation:${transactionId}:%`])).rows[0].signature_valid,false)
      console.log('PASS: simulated provider recovery of first checkout/payment, immutable owner linkage and idempotent real DB coverage.')
    } finally { globalThis.fetch = actualFetch }

    // The recovery fixture now has paid coverage. Explicitly expire it before
    // exercising the separate HTTP recovery route scenario below.
    await db.query("update billing_service_periods set starts_at=now()-interval '2 days', ends_at=now()-interval '1 day' where account_id=$1",[accountId])
    const checkoutTransaction = providerId('txn')
    const checkoutOwner = (await db.query('select id from billing_accounts where user_id=$1',[one.id])).rows[0].id
    await db.query("insert into billing_subscriptions(id,account_id,plan_id,price_id,provider,metadata) values ($1,$2,$3,$4,'paddle',$5)",
      [randomUUID(),checkoutOwner,planId,paddlePriceId,JSON.stringify({checkoutTransactionId:checkoutTransaction})])

    // Boot the actual Node application: this also verifies DI, global DTO validation and raw-body capture.
    Object.assign(process.env, { DATABASE_URL: url.toString(), NODE_ENV: 'test', JWT_SECRET: 'SYNTHETIC-LOCAL-JWT-SECRET-ONLY',
      SUPABASE_URL: 'http://127.0.0.1:54321', SUPABASE_SERVICE_ROLE_KEY: 'SYNTHETIC-LOCAL-ONLY',
      PADDLE_SANDBOX_API_KEY: 'pdl_sdbx_apikey_SYNTHETIC-ONLY' })
    process.env.PADDLE_SANDBOX_CLIENT_TOKEN = `test_${'a'.repeat(27)}`
    backend('@nestjs/common').Logger.overrideLogger(false)
    const { createApplication } = backend('./dist/bootstrap.js')
    const app = await createApplication()
    await app.listen(0,'127.0.0.1')
    const httpOrigin = await app.getUrl()
    const jwt = new (backend('@nestjs/jwt').JwtService)({secret:process.env.JWT_SECRET})
    const request = (user,path,body) => fetch(`${httpOrigin}/api/v1${path}`,{method:body?'POST':'GET',headers:{
      'content-type':'application/json',...(user?{cookie:`aulabase_session=${jwt.sign({sub:user.id,email:user.email,tokenVersion:1})}`}:{})
    },body:body?JSON.stringify(body):undefined})
    try {
      assert.equal((await request(null,'/billing')).status,401)
      const checkoutPage = await request(one,`/billing/checkout-page?_ptxn=${checkoutTransaction}`)
      assert.equal(checkoutPage.status,200)
      assert.match(checkoutPage.headers.get('content-type'),/text\/html/)
      assert.match(checkoutPage.headers.get('cache-control'),/no-store/)
      const checkoutHtml = await checkoutPage.text()
      assert.match(checkoutHtml,/Paddle.Environment.set\("sandbox"\)/)
      assert.ok(!checkoutHtml.includes(process.env.PADDLE_SANDBOX_API_KEY))
      const nonce = checkoutPage.headers.get('content-security-policy').match(/'nonce-([^']+)'/)[1]
      assert.ok(checkoutHtml.includes(`nonce="${nonce}"`))
      assert.equal((await request(two,`/billing/checkout-page?_ptxn=${checkoutTransaction}`)).status,404)
      assert.equal((await request(null,`/billing/checkout-page?_ptxn=${checkoutTransaction}`)).status,401)
      console.log('PASS: actual HTML checkout page enforces reserved owner, sandbox token, nonce CSP and no-store without exposing the API key.')
      assert.equal((await request(two,'/students')).status,402)
      assert.equal((await request(two,'/billing')).status,200)
      assert.equal((await request(schoolAdmin,'/billing/admin')).status,403)
      assert.equal((await request(reviewer,'/billing/admin')).status,200)
      assert.equal((await request(one,'/billing/transfers',{priceId,amountMinor:1})).status,400)
      const response = await request(two,'/billing/support',{category:'access',subject:'Synthetic HTTP support',message:'Synthetic expired teacher needs support.'})
      assert.equal(response.status,201)
      assert.match((await response.json()).data.number,/^CAS-/)
      const raw = Buffer.from(JSON.stringify({event_id:`evt_${randomUUID()}`,event_type:'unknown.http_test',occurred_at:new Date().toISOString(),data:{}},null,2))
      const stamp = Math.floor(Date.now()/1000)
      const signed = `ts=${stamp};h1=${createHmac('sha256',process.env.PADDLE_SANDBOX_WEBHOOK_SECRET).update(`${stamp}:`).update(raw).digest('hex')}`
      const webhook = await fetch(`${httpOrigin}/api/v1/billing/webhooks/paddle`,{method:'POST',headers:{'content-type':'application/json','paddle-signature':signed},body:raw})
      assert.equal(webhook.status,201)
      assert.equal((await webhook.json()).data.status,'ignored')
      await db.query("update app_users set status='inactive' where id=$1",[one.id])
      assert.equal((await request(one,'/billing')).status,401)
      console.log('PASS: actual Node HTTP auth, expired recovery, admin separation, server-price DTOs and original-byte webhook signatures.')
    } finally { await app.close() }
  })
} finally {
  await db.end()
}
