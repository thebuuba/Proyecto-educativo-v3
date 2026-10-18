import {describe,expect,it} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/art-grade-three-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'ART',subjectName:'Educación Artística',modalityCode:null,optativeExitName:null}
describe('Artística tercero: lenguaje audiovisual, escénico, musical y aplicado',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${instrumentType}/${maxScore}`,()=>{
   const p=recommend({activityTitle:'Título antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   if(task.id==='musical-communication')expect(p.criteria).toHaveLength(1)
   if(task.id==='photo-series-analysis')expect(p.criteria.every(row=>row.templateId.startsWith('art-3-photo-series-'))).toBe(true)
   expect(p.criteria.every(row=>row.templateId.startsWith('art-3-'))).toBe(true)
   for(const topic of task.topicIds)expect(p.criteria.some(row=>row.templateId.startsWith(`art-3-${topic}-${task.purpose.toLowerCase()}-`))).toBe(true)
   expect(JSON.stringify(p.criteria)).not.toMatch(/células|titulo antiguo/i)
   if('forbidden'in task)expect(p.criteria.map(row=>row.description).join(' ')).not.toMatch(new RegExp(task.forbidden!,'i'))
   expect(p.criteria.reduce((n,row)=>n+row.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  })
 }
})
