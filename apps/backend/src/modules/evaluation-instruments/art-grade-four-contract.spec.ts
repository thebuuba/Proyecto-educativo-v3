import {describe,expect,it} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/art-grade-four-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'ART',subjectName:'Educación Artística',modalityCode:null,optativeExitName:null}
describe('Artística cuarto: referentes culturales y desempeño solicitado',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${instrumentType}/${maxScore}`,()=>{
   const p=recommend({activityTitle:'Título antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.activityType).toBe(task.activityType)
   if(task.id==='visual-exponents-research')expect(p.criteria.some(row=>/histórico y la actualidad/.test(row.description))).toBe(true)
   if(task.id==='song-from-analysis')expect(p.criteria.some(row=>/melodía y el ritmo/.test(row.description))).toBe(true)
   if(task.id==='visual-syncretism')expect(p.criteria.some(row=>/explica|explicación/.test(row.description))).toBe(true)
   if(task.purpose==='PLAN')expect(p.criteria.every(row=>/planifica|plan |previst|propuest/i.test(row.description))).toBe(true)
   if('evidenceIds'in task)for(const id of task.evidenceIds!)expect(p.criteria.some(row=>row.templateId.endsWith('-'+id))).toBe(true)
   if('criterionCount'in task)expect(p.criteria).toHaveLength(task.criterionCount!)
   expect(p.criteria.every(row=>task.topicIds.some(topic=>row.templateId.startsWith('art-4-'+topic+'-'+task.purpose.toLowerCase()+'-')))).toBe(true)
   for(const topic of task.topicIds)expect(p.criteria.some(row=>row.templateId.startsWith(`art-4-${topic}-${task.purpose.toLowerCase()}-`))).toBe(true)
   expect(JSON.stringify(p.criteria)).not.toMatch(/células|titulo antiguo/i)
   if('forbidden'in task)expect(p.criteria.map(row=>row.description).join(' ')).not.toMatch(new RegExp(task.forbidden!,'i'))
   expect(p.criteria.reduce((n,row)=>n+row.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  })
 }
})

describe('Alcance de las explicaciones breves de Artística cuarto',()=>{it('no inventa un caso proporcionado para explicar industrias culturales o arte público',()=>{for(const description of ['Explica industrias culturales.','Explica arte público y sus implicaciones.']){const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null);expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/caso ficticio|caso de arte público/);}})})
