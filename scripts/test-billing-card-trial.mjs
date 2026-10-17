// Called only by test-billing-workflows inside its guarded disposable database.
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'

export async function testCardTrial({ db, backend, events, reviewer, schoolId, planId, effectiveAccess }) {
  const providerId = prefix => `${prefix}_${randomUUID().replaceAll('-', '').slice(0,26)}`
  const user = { id: randomUUID(), auth: randomUUID(), email: `${randomUUID()}@example.invalid`, schoolId, roles: ['teacher'] }
  const accountId = randomUUID(), priceId = randomUUID()
  const customerId = providerId('ctm'), subscriptionId = providerId('sub'), transactionId = providerId('txn'), remotePriceId = providerId('pri')
  await db.query('insert into auth.users(id) values ($1)', [user.auth])
  await db.query('insert into app_users(id,auth_user_id,full_name,email,school_id) values ($1,$2,$3,$4,$5)', [user.id,user.auth,'Synthetic card trial teacher',user.email,schoolId])
  await db.query("insert into user_roles(user_id,role_id,school_id) select $1,id,$2 from roles where key='teacher'", [user.id,schoolId])
  await db.query('insert into billing_accounts(id,user_id) values ($1,$2)', [accountId,user.id])
  await db.query("insert into billing_prices(id,plan_id,version,currency,amount_minor,status,is_public,provider,provider_price_id) values ($1,$2,3,'USD',799,'active',true,'paddle',$3)", [priceId,planId,remotePriceId])
  await db.query("insert into billing_provider_customers(account_id,provider,provider_customer_id) values ($1,'paddle',$2)", [accountId,customerId])
  const at = new Date(Date.now()-60000), until = new Date(at)
  until.setUTCMonth(until.getUTCMonth()+1)
  const period = { starts_at: at.toISOString(), ends_at: until.toISOString() }
  const price = { id: remotePriceId, status: 'active', unit_price: {amount:'799',currency_code:'USD'}, billing_cycle: {interval:'month',frequency:1},
    tax_mode:'internal', unit_price_overrides:[], trial_period:{interval:'month',frequency:1,requires_payment_method:true,unit_price:null,unit_price_overrides:[]} }
  let subscription = {id:subscriptionId,status:'trialing',customer_id:customerId,collection_mode:'automatic',updated_at:at.toISOString(),next_billed_at:period.ends_at,
    current_billing_period:null,scheduled_change:null,items:[{status:'trialing',price,quantity:1,recurring:true,trial_dates:period,next_billed_at:period.ends_at}]}
  let transaction = {id:transactionId,status:'ready',customer_id:customerId,subscription_id:null,currency_code:'USD',updated_at:at.toISOString(),billed_at:null,
    billing_period:null,items:[{price,quantity:1}],custom_data:null,details:{totals:{total:'0'}}}
  const actualFetch = globalThis.fetch
  const previousTerms = process.env.BILLING_TERMS_VERSION
  const previousOrigin = process.env.FRONTEND_URL
  process.env.BILLING_TERMS_VERSION = 'synthetic-card-month-v1'
  process.env.FRONTEND_URL = 'http://127.0.0.1:5173'
  process.env.PADDLE_SANDBOX_API_KEY = 'pdl_sdbx_apikey_SYNTHETIC-ONLY'
  process.env.PADDLE_SANDBOX_CLIENT_TOKEN = `test_${'a'.repeat(27)}`
  let remoteCreates = 0
  globalThis.fetch = async (input, init) => {
    const remote = new URL(String(input))
    assert.equal(remote.origin,'https://sandbox-api.paddle.com')
    let data
    if (remote.pathname === `/prices/${remotePriceId}`) data = price
    else if (remote.pathname === '/transactions' && init?.method === 'POST') {
      remoteCreates += 1
      const body = JSON.parse(init.body)
      assert.equal(body.customer_id,customerId)
      assert.deepEqual(body.items,[{price_id:remotePriceId,quantity:1}])
      assert.equal(body.trial_period,undefined,'Trial belongs to the catalog price, never the transaction')
      transaction.custom_data = body.custom_data
      data = transaction
    } else if (remote.pathname === '/transactions') data = [transaction]
    else if (remote.pathname === `/transactions/${transactionId}`) data = transaction
    else if (remote.pathname === `/subscriptions/${subscriptionId}`) data = subscription
    else assert.fail(`Unexpected simulated card-trial provider path: ${remote.pathname}`)
    return Response.json({data})
  }
  const deliver = async (type,id) => {
    const body = Buffer.from(JSON.stringify({event_id:`evt_${randomUUID()}`,event_type:type,occurred_at:new Date().toISOString(),data:{id}}))
    const ts = Math.floor(Date.now()/1000)
    const signature = `ts=${ts};h1=${createHmac('sha256',process.env.PADDLE_SANDBOX_WEBHOOK_SECRET).update(`${ts}:`).update(body).digest('hex')}`
    return events.receive(body,signature)
  }
  try {
    const { BillingProviderService } = backend('./dist/modules/billing/billing-provider.service.js')
    const provider = new BillingProviderService()
    const consent = {priceId,acceptEarlyEnd:false,termsVersion:process.env.BILLING_TERMS_VERSION,acceptAutoRenewal:true}
    await assert.rejects(provider.checkout(user,{...consent,acceptAutoRenewal:false}), error=>error.getStatus()===400)
    assert.equal(remoteCreates,0)
    price.trial_period.requires_payment_method = false
    await assert.rejects(provider.checkout(user,consent), error=>error.getStatus()===503)
    assert.equal((await db.query('select count(*)::int n from billing_subscriptions where account_id=$1',[accountId])).rows[0].n,0)
    price.trial_period.requires_payment_method = true
    const checkout = await provider.checkout(user,consent)
    assert.match(checkout.url,/checkout-page/)
    assert.deepEqual(await provider.checkout(user,consent),checkout)
    assert.equal(remoteCreates,1,'A valid pending reservation reuses its original transaction')
    assert.equal((await effectiveAccess(user.id)).allowed,false,'Opening checkout does not grant a trial')
    transaction = {...transaction,status:'completed',subscription_id:subscriptionId,billed_at:at.toISOString()}
    assert.equal((await deliver('transaction.completed',transactionId)).status,'processed')
    assert.equal((await effectiveAccess(user.id)).reason,'trial')
    await deliver('transaction.completed',transactionId)
    await events.reconcile(reviewer,(await db.query('select id from billing_subscriptions where account_id=$1',[accountId])).rows[0].id)
    const trials = (await db.query('select subscription_id,ends_at from billing_trials where account_id=$1',[accountId])).rows
    assert.equal(trials.length,1)
    assert.equal(trials[0].ends_at.toISOString(),period.ends_at)
    assert.ok(trials[0].subscription_id)
    assert.equal((await db.query('select count(*)::int n from billing_payments where account_id=$1',[accountId])).rows[0].n,0)
    assert.equal((await db.query('select count(*)::int n from billing_documents where account_id=$1',[accountId])).rows[0].n,0)
    subscription = {...subscription,status:'canceled',next_billed_at:null,updated_at:new Date().toISOString(),canceled_at:new Date().toISOString()}
    assert.equal((await deliver('subscription.canceled',subscriptionId)).status,'processed')
    assert.equal((await effectiveAccess(user.id)).reason,'trial','Canceling renewal retains the already confirmed trial dates')
    await assert.rejects(provider.checkout(user,consent), error=>error.getStatus()===409)
    assert.equal(remoteCreates,1,'The same account cannot obtain another remote trial')
    console.log('PASS: real DB card consent, reserved sandbox checkout, provider-confirmed month, deduplication/recovery, no zero payment, cancellation and no repeat trial.')
  } finally {
    globalThis.fetch = actualFetch
    if (previousTerms === undefined) delete process.env.BILLING_TERMS_VERSION
    else process.env.BILLING_TERMS_VERSION = previousTerms
    if (previousOrigin === undefined) delete process.env.FRONTEND_URL
    else process.env.FRONTEND_URL = previousOrigin
  }
}
