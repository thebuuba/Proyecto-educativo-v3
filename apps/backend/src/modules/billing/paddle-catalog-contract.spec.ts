import { describe, expect, it } from 'vitest'
import { createPaddleSandboxClient } from './paddle-sandbox'
import { checkTrialPrice, checkTrialSubscription } from './billing-trial'

const priceId = `pri_${'c'.repeat(26)}`
const fixture = () => ({ id:priceId, status:'active', unit_price:{amount:'799',currency_code:'USD'},
  billing_cycle:{interval:'month',frequency:1}, tax_mode:'internal', unit_price_overrides:[],
  trial_period:{interval:'month',frequency:1,requires_payment_method:true,unit_price:null as unknown,unit_price_overrides:[] as unknown[]} })
const clientFor = (data: unknown) => createPaddleSandboxClient({
  apiKey:'pdl_sdbx_apikey_SYNTHETIC-CONTRACT', webhookSecret:'SYNTHETIC-CONTRACT',
  request: async () => ({ok:true,status:200,text:async()=>JSON.stringify({data})}),
})

describe('official Paddle catalog response contracts', () => {
  it('reads transaction item price.id from the official response shape', async () => {
    const txn = await clientFor({id:`txn_${'d'.repeat(26)}`,status:'completed',items:[{price:{id:priceId},quantity:1}]}).getTransaction(`txn_${'d'.repeat(26)}`)
    expect(txn.priceIds).toEqual([priceId])
  })

  it('rejects archived prices and paid or regional trial overrides', async () => {
    expect(checkTrialPrice(await clientFor(fixture()).getPrice(priceId))).toEqual({ok:true})
    const paid = fixture()
    paid.trial_period.unit_price = {amount:'100',currency_code:'USD'}
    const regional = fixture()
    regional.trial_period.unit_price_overrides = [{country_codes:['DO'],unit_price:{amount:'100',currency_code:'USD'}}]
    for (const price of [{...fixture(),status:'archived'},paid,regional]) {
      expect(checkTrialPrice(await clientFor(price).getPrice(priceId)).ok).toBe(false)
    }
  })

  it('rejects quantities or additional items that would change the agreed monthly charge', async () => {
    const dates = {starts_at:'2026-10-15T14:00:00Z',ends_at:'2026-11-15T14:00:00Z'}
    const item = {status:'trialing',price:fixture(),quantity:1,recurring:true,trial_dates:dates,next_billed_at:dates.ends_at}
    const subscription = {id:`sub_${'s'.repeat(26)}`,customer_id:`ctm_${'u'.repeat(26)}`,status:'trialing',collection_mode:'automatic',next_billed_at:dates.ends_at,items:[item]}
    for (const items of [[{...item,quantity:2}],[item,{...item,price:{id:`pri_${'e'.repeat(26)}`}}]]) {
      const provided = await clientFor({...subscription,items}).getSubscription(subscription.id)
      expect(checkTrialSubscription(provided,priceId).ok).toBe(false)
    }
  })
})
