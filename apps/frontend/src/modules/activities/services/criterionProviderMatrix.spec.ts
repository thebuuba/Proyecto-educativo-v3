import {describe,it,expect} from 'vitest'
import {readFileSync,readdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {nextCatalogCriterion,matchingCatalogCriterion,completeInstrumentCriterion,appendInstrumentCriterion} from './instrumentCriterionAddition'
import {scoreInstrumentFields} from './instrumentScoring'

const root=resolve(process.cwd(),'../../data/evaluation-instruments')
const grades=['one','two','three','four','five','six']
const cases=readdirSync(root).filter(name=>/^language-grade-.*contracts\.json$/.test(name)).flatMap(file=>{
 const grade=grades.findIndex(g=>file.includes(`grade-${g}-`))+1
 return (JSON.parse(readFileSync(resolve(root,file),'utf8')) as Array<{id?:string;description:string;type:string;topic?:string}>).map((c,index)=>({...c,grade,key:`${file}:${c.id??index}`}))
})
const novel=JSON.parse(readFileSync(resolve(root,'novel-task-regression.json'),'utf8'))
cases.push({grade:5,key:novel.id,topic:novel.activityTitle,description:novel.description,type:novel.activityType})
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
describe('Matriz de proveedores implementados de Lengua1–6',()=>{
 for(const type of formats)for(const score of [null,20,17.35])it(`${type}: puntuación ${score??'pendiente'} / ${cases.length} consignas`,()=>{
  for(const c of cases){
   const input={activityTitle:c.topic??'Actividad',description:c.description,activityType:c.type,secondaryLanguageGrade:c.grade,academicContext:{level:'SECONDARY' as const,grade:c.grade,cycle:c.grade<=3?1:2,subjectCode:'LEN',subjectName:'Lengua Española',modalityCode:null,optativeExitName:null},instrumentType:type,participationMode:'INDIVIDUAL' as const,maxScore:score??100}
   const p=editableFallbackRecommendation(input),pool=editableFallbackRecommendation({...input,includeAdditionalCandidates:true})
   const service=recommend({activityTitle:input.activityTitle,description:input.description,pedagogicalActivityType:c.type,maxScore:input.maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:type,includeAdditionalCandidates:true},input.academicContext,null,[],'UNMAPPED',null)
   expect(pool.criteria.map(x=>[x.templateId,x.title,x.description,x.progressionLevels]),c.key).toEqual(service.criteria.map(x=>[x.templateId,x.title,x.description,x.progressionLevels]))
   const fields=scoreInstrumentFields(recommendationToFields(p,input.activityTitle),type,score,p)
   const candidate=p.criteria[0]
   expect(candidate,c.key).toBeDefined()
   // A recovered blank row retains its identity/score, and releases its old objective.
   const blank={...fields,[`${type}:criterion-id:0`]:'manual:recovered',[`${type}:criterion-template:0`]:'manual'}
   for(const key of Object.keys(blank))if(key.match(new RegExp(`^${type}:(?:criterion|description|indicator|descriptor):0(?::|$)`)))blank[key]=''
   const match=matchingCatalogCriterion(pool.criteria,blank,type,0,p.criteria)
   expect(match?.templateId,c.key).toBe(candidate.templateId)
   const complete=completeInstrumentCriterion(blank,type,0,match!)
   expect(complete[`${type}:criterion-id:0`]).toBe('manual:recovered')
   expect(complete[`${type}:points:0`]).toBe(blank[`${type}:points:0`])
   for(const key of Object.keys(fields).filter(key=>!key.match(new RegExp(`^${type}:[^:]+:0(?::|$)`))))expect(complete[key],c.key+key).toBe(fields[key])
   const partial={...fields,[`${type}:description:0`]:''}
   if(type==='lista-ponderada')partial[`${type}:indicator:0`]=''
   expect(matchingCatalogCriterion(pool.criteria,partial,type,0,p.criteria)?.templateId,c.key).toBe(candidate.templateId)
   const renamed={...fields,[`${type}:criterion:0`]:'Mi criterio docente'}
   expect(nextCatalogCriterion([candidate],renamed,type,p.criteria),c.key).toBeNull()
   // Exhaust the real pool, without manufacturing rows or conflating it with capacity.
   const full=recommendationToFields(pool,input.activityTitle)
   expect(nextCatalogCriterion(pool.criteria,full,type,pool.criteria),c.key).toBeNull()
   const next=nextCatalogCriterion(pool.criteria,fields,type,p.criteria)
   if(next&&p.criteria.length<20){
    const added=appendInstrumentCriterion(fields,type,score,p,next)
    expect(added.fields[`${type}:criterion:${p.criteria.length}`],c.key).not.toBe('')
    const sum=Array.from({length:p.criteria.length+1},(_,i)=>Math.round(Number(added.fields[`${type}:points:${i}`])*100)).reduce((a,b)=>a+b,0)
    expect(sum,c.key).toBe(score===null?0:Math.round(score*100))
   }
  }
 // Each case checks all 768 curriculum tasks across both providers and editing operations.
 }, 30_000)
})
