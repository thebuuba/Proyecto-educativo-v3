import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {setTimeout as delay} from 'node:timers/promises'

export const base='http://localhost:5173/api/v1'
export const context=JSON.parse(readFileSync('.dev-qa-context.local','utf8'))
export const fingerprint=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
export async function localClient() {
  const health=(await fetch(base+'/health').then(r=>r.json())).data
  assert.equal(health.development.supabaseOrigin,'http://127.0.0.1:54321','Only the authorized local environment may be used')
  const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:readFileSync('.dev-qa-account.local','utf8')})
  assert.equal(login.status,201,'Local fictitious account login failed')
  const cookie=login.headers.getSetCookie().find(v=>v.startsWith('aulabase_session='))?.split(';')[0]
  assert(cookie)
  let nextRequest=0
  const request=async(path,input,attempt=0)=>{
    const wait=Math.max(0,nextRequest-Date.now())
    nextRequest=Date.now()+wait+800
    if(wait) await delay(wait)
    const response=await fetch(base+path,{method:input?'POST':'GET',headers:{cookie,'Content-Type':'application/json'},...(input?{body:JSON.stringify(input)}:{})})
    if(response.status===429&&attempt<3) {
      await delay(Math.min(60000,Math.max(1000,Number(response.headers.get('retry-after')||60)*1000)))
      return request(path,input,attempt+1)
    }
    assert(response.ok,`${path}: HTTP ${response.status}`)
    return (await response.json()).data
  }
  return {request,health}
}
