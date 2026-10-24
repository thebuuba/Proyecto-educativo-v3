import {afterEach,describe,it,expect,vi} from 'vitest'
import {withDevelopmentRequestTiming,timeDevelopmentStage,timeDevelopmentSync,developmentTimingAllowed} from './development-request-timing'
afterEach(()=>{vi.unstubAllEnvs();vi.restoreAllMocks()})
describe('Diagnóstico local por petición, sin datos de usuario',()=>{
 it('queda inactivo por defecto y rechaza hosts/proyectos ajenos',()=>{
  expect(developmentTimingAllowed('http://localhost:8787/api/v1/activities')).toBe(false)
  vi.stubEnv('AULABASE_DEV_TIMING','true');vi.stubEnv('SUPABASE_URL','https://eolgunypmtgrsyrjzcld.supabase.co')
  expect(developmentTimingAllowed('http://localhost:8787/api/v1/activities')).toBe(true)
  expect(developmentTimingAllowed('https://aulabase.com/api/v1/activities')).toBe(false)
  vi.stubEnv('SUPABASE_URL','https://other.supabase.co')
  expect(developmentTimingAllowed('http://localhost:8787/api/v1/activities')).toBe(false)
 })
 it('aísla peticiones simultáneas, registra fallos y nunca refleja identificadores ni cuerpos del cliente',async()=>{
  vi.stubEnv('AULABASE_DEV_TIMING','true');vi.stubEnv('SUPABASE_URL','https://eolgunypmtgrsyrjzcld.supabase.co')
  const log=vi.spyOn(console,'info').mockImplementation(()=>{})
  const responses=await Promise.all(['alpha','beta'].map(stage=>withDevelopmentRequestTiming(new Request('http://localhost:8787/api/v1/evaluation-instruments/recommend?email=private@example.invalid',{method:'POST',headers:{'X-Request-ID':'untrusted-id'},body:'private consigna token password'}),false,async()=>{
   await timeDevelopmentStage(stage,async()=>true)
   await expect(timeDevelopmentStage('failure',async()=>{throw Error('private message')})).rejects.toThrow('private message')
   expect(()=>timeDevelopmentSync('sync.failure',()=>{throw Error('private message')})).toThrow('private message')
   return new Response('ok')
  })))
  const entries=log.mock.calls.map(([text])=>JSON.parse(text))
  expect(entries).toHaveLength(2)
  expect(new Set(entries.map(e=>e.id)).size).toBe(2)
  expect(entries.map(e=>e.spans.map((s:any)=>s.stage))).toEqual([['alpha','failure','sync.failure'],['beta','failure','sync.failure']])
  expect(entries.every(e=>e.spans[1].failed)).toBe(true)
  expect(entries.every(e=>e.spans[2].failed)).toBe(true)
  expect(JSON.stringify(entries)).not.toMatch(/private|consigna|password|untrusted-id|@/)
  expect(responses.map(r=>r.headers.get('X-AulaBase-Development-Request'))).toEqual(entries.map(e=>e.id))
 })
})
