import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-guia-oral-v1.json'),'utf8'))
describe('Guía1: componentes orales de la fuente70',()=>{
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const){
  it(`${format}: organización por escucha conserva las funciones lingüísticas`,()=>{
   const c=bank.cases[0],p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null),t=p.criteria.map(r=>r.description).join(' ')
   expect(t).toMatch(/organización|organiza/)
   expect(t).toMatch(/presente.*indicativo/)
   expect(t).toMatch(/sustantivos/)
   expect(t).toMatch(/adjetivos/)
   expect(t).toMatch(/audio|escuchada/)
   expect(t).toMatch(/propias palabras/)
   expect(t).not.toMatch(/texto leído|texto impreso|mapa|predicción/)
  })
  it(`${format}: grados orales se limitan a datos disponibles, sin mapa negado`,()=>{
   const c=bank.cases[1],p=recommend({activityTitle:c.title,description:c.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null),t=JSON.stringify(p.criteria)
   expect(p.activityType).toBe('TOURIST_GUIDE_PRESENTATION')
   expect(t).toMatch(/datos entregados|datos disponibles/)
   expect(t).toMatch(/intención.*visitantes jóvenes/)
   expect(t).toMatch(/grado positivo/)
   expect(t).toMatch(/comparativo/)
   expect(t).toMatch(/superlativo/)
   expect(t).toMatch(/cuando.*datos.*permit|solo.*datos.*sostien|según.*datos/)
   expect(t).toMatch(/actuales o habituales/)
   expect(t).not.toMatch(/mapa|borrador|en su texto|Identifica.*ejemplos/)
  })
 }
})
