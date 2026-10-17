import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-two-lexicon-contracts.json'
const context={level:'SECONDARY' as const,grade:2,subjectCode:'ING',cycle:1,optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,format:typeof formats[number]='rubrica',score=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Léxico común de segundo: familias de palabras y expresiones observables',()=>{
 for(const f of fixtures)for(const mode of ['reading','explanation','writing'] as const)for(const format of formats)for(const score of [20,17.35])it(`${f.id} ${mode} ${format} ${score}`,()=>{
  const target=f.category==='vocabulary'?`vocabulario de ${f.label}`:`expresiones para ${f.label}`
  const description=mode==='reading'?`Leerán un mensaje en inglés e identificarán ${target}.`:mode==='explanation'?`Explicarán el significado de ${target} con ejemplos de un texto en inglés.`:`Escribirán un mensaje en inglés utilizando ${target}.`
  const p=propose(description,format,score),c=p.criteria.find(c=>c.templateId===`ing-2-lexicon-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  const evidence=format==='escala'?propose(description,'rubrica',score).criteria.find(item=>item.templateId===c!.templateId)!:c!
  expect(evidence.progressionLevels?.[0]).toContain(mode==='writing'?'Emplea':'Identifica')
  expect(evidence.progressionLevels?.[3]).toContain('mensaje')
  if(format==='escala')expect(c!.descriptors[0].text).toBe(c!.progressionLevels?.[0])
  expect(evidence.progressionLevels?.[4]).toMatch(/^No /)
  expect(p.criteria).toEqual(propose(description,format,score,'La célula').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(score*100))
  expect(JSON.stringify(p.criteria)).not.toMatch(/pronunciación nativa|posesiones reales|motivación para|ansiedad del/)
 })
 it('el tema cotidiano y los recursos no imponen un examen de vocabulario',()=>{
  const p=propose('Escribirán un correo en inglés para expresar planes de un encuentro en un parque. Recursos: vocabulario de medicamentos y tecnología.')
  expect(p.criteria.some(c=>c.templateId.includes('-lexicon-'))).toBe(false)
 })
 it('no importa familias ausentes del currículo común de segundo',()=>{
  const p=propose('Escribirán un mensaje en inglés utilizando vocabulario de géneros musicales, mobiliario y accidentes geográficos.')
  expect(p.criteria.some(c=>c.templateId.startsWith('ing-2-lexicon-'))).toBe(false)
 })
 it('conserva lexemas afirmativos después de una exclusión',()=>{
  const p=propose('Escribirán en inglés un mensaje utilizando vocabulario de dinero. No se evaluará vocabulario de tecnología. Utilizarán vocabulario de vías.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-lexicon-money')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-lexicon-roads')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-2-lexicon-technology')
 })
})
