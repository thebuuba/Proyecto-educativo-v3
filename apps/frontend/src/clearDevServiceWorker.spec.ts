import {afterEach,describe,expect,it,vi} from 'vitest'
import {clearDevServiceWorker} from './clearDevServiceWorker'

afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs()})

function setup(url='http://localhost:8787'){
 vi.stubGlobal('window',{location:new URL(url)})
 vi.stubEnv('DEV',false);vi.stubEnv('BASE_URL','/')
 const getRegistrations=vi.fn(),keys=vi.fn().mockResolvedValue(['offline-drafts','other-app-cache']),remove=vi.fn().mockResolvedValue(true)
 vi.stubGlobal('navigator',{serviceWorker:{getRegistrations}})
 vi.stubGlobal('caches',{keys,delete:remove})
 return{getRegistrations,keys,remove}
}
const registration=(scope:string,scriptURL:string)=>({scope,active:{scriptURL},unregister:vi.fn().mockResolvedValue(true)})

describe('El arranque local conserva el almacenamiento y otros service workers',()=>{
 it('desregistra solo el worker propio y no enumera ni borra CacheStorage',async()=>{
  const {getRegistrations,keys,remove}=setup(),own=registration('http://localhost:8787/','http://localhost:8787/sw.js'),otherScope=registration('http://localhost:8787/other/','http://localhost:8787/other/sw.js'),otherWorker=registration('http://localhost:8787/','http://localhost:8787/another-worker.js')
  getRegistrations.mockResolvedValue([own,otherScope,otherWorker])
  await clearDevServiceWorker()
  expect(own.unregister).toHaveBeenCalledOnce();expect(otherScope.unregister).not.toHaveBeenCalled();expect(otherWorker.unregister).not.toHaveBeenCalled()
  expect(keys).not.toHaveBeenCalled();expect(remove).not.toHaveBeenCalled()
 })
 it('conserva las cachés incluso cuando no hay registros',async()=>{
  const {getRegistrations,keys,remove}=setup();getRegistrations.mockResolvedValue([])
  await clearDevServiceWorker();expect(keys).not.toHaveBeenCalled();expect(remove).not.toHaveBeenCalled()
 })
 it('reconoce el worker propio que todavía está instalándose',async()=>{
  const {getRegistrations}=setup(),own={scope:'http://localhost:8787/',installing:{scriptURL:'http://localhost:8787/sw.js'},unregister:vi.fn().mockResolvedValue(true)}
  getRegistrations.mockResolvedValue([own]);await clearDevServiceWorker();expect(own.unregister).toHaveBeenCalledOnce()
 })
 it('no cambia el registro de la aplicación desplegada',async()=>{
  const {getRegistrations,keys,remove}=setup('https://aulabase.example');await clearDevServiceWorker()
  expect(getRegistrations).not.toHaveBeenCalled();expect(keys).not.toHaveBeenCalled();expect(remove).not.toHaveBeenCalled()
 })
 it('un error de registro no impide renderizar',async()=>{
  const {getRegistrations,remove}=setup();getRegistrations.mockRejectedValue(new Error('API unavailable'))
  await expect(clearDevServiceWorker()).resolves.toBeUndefined();expect(remove).not.toHaveBeenCalled()
 })
})
