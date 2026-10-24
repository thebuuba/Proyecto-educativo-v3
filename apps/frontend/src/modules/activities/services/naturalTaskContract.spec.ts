import {it,expect} from 'vitest'
import {deliveryConditions,extractTaskRequirements} from '@aula/shared'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {nextCatalogCriterion,matchingCatalogCriterion,completeInstrumentCriterion,appendInstrumentCriterion} from './instrumentCriterionAddition'
import {validateActivityDraft} from '../utils/activityDraftStorage'
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const cases=[
 {code:'ING',description:'Elaboran una presentación oral y escrita en inglés con presente simple sobre información de un personaje ficticio.'},
 {code:'LEN',description:'Hacen un informe de lectura de una noticia'},
 {code:'LEN',description:'Comparan dos noticias'},
 {code:'ING',description:'Escriben en inglés un correo. Entre una y tres páginas, interlineado 1.5, fuente Arial o Calibri, tamaño 12, sin portada.'},
 {code:'MAT',description:'Los estudiantes resuelven ejercicios de suma y resta'},
]
const content=(p:ReturnType<typeof recommend>)=>p.criteria.map(c=>({template:c.templateId,title:c.title,description:c.description,weight:c.relativeWeight,points:c.maxScoreUnits,progression:c.progressionLevels,descriptors:c.descriptors.map(d=>d.text)}))
for(let grade=1;grade<=6;grade++)for(const c of cases)for(const instrumentType of formats)for(const total of [20,17.35])it(`natural ${grade} ${c.code} ${instrumentType} ${total} ${c.description}`,()=>{
 const academicContext={level:'SECONDARY' as const,grade,cycle:(grade<4?1:2) as 1|2,subjectCode:c.code,subjectName:c.code==='LEN'?'Lengua Española':c.code==='MAT'?'Matemática':'Lenguas extranjeras: Inglés',optativeExitName:null,modalityCode:'academic'}
 const input={activityTitle:'Actividad',description:c.description,maxScore:total,participationMode:'INDIVIDUAL' as const,preferredInstrumentType:instrumentType}
 const service=recommend(input,academicContext,null,[],'UNMAPPED',null),local=editableFallbackRecommendation({...input,academicContext,instrumentType})
 expect(content(local)).toEqual(content(service))
 expect(service.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 const fields=recommendationToFields(service,'Actividad'),pending=scoreInstrumentFields(fields,instrumentType,null,service)
 expect(service.criteria.every((_,i)=>pending[`${instrumentType}:points:${i}`]==='')).toBe(true)
 expect(nextCatalogCriterion(service.criteria,fields,instrumentType,service.criteria)).toBeNull()
 const blank=appendInstrumentCriterion(fields,instrumentType,total,service,null)
 const row=service.criteria.length
 // A deleted objective is available to a wholly blank row; an exhausted pool remains manual.
 const one={...service,criteria:service.criteria.slice(0,-1)},oneFields=recommendationToFields(one,'Actividad')
 const added=appendInstrumentCriterion(oneFields,instrumentType,total,one,null)
 const index=one.criteria.length,candidate=matchingCatalogCriterion(service.criteria,added.fields,instrumentType,index,added.recommendation?.criteria)
 expect(candidate?.templateId).toBe(service.criteria.at(-1)?.templateId)
 const completed=completeInstrumentCriterion(added.fields,instrumentType,index,candidate!)
 expect(completed[`${instrumentType}:criterion-id:${index}`]).toBe(added.fields[`${instrumentType}:criterion-id:${index}`])
 expect(completed[`${instrumentType}:points:${index}`]).toBe(added.fields[`${instrumentType}:points:${index}`])
 expect(blank.fields[`${instrumentType}:criterion:${row}`]).toBe('')
})
for(const [description,label] of [
 ['Tres páginas','3 páginas'],['Máximo tres páginas','máximo 3 páginas'],['Mínimo una página','mínimo 1 página'],['Una a tres páginas','entre 1 y 3 páginas'],['Mínimo una página y máximo tres','entre 1 y 3 páginas'],['Mínimo una y máximo tres páginas','entre 1 y 3 páginas'],['Entre una y tres páginas','entre 1 y 3 páginas'],['Interlineado 1,5','interlineado 1.5'],['Interlineado 1.5','interlineado 1.5'],['Fuente Arial o Calibri','fuente Arial o Calibri'],['Sin portada','sin portada'],['Incluye tres ejemplos','3 ejemplos'],['Apartados: introducción, análisis y conclusión','apartados solicitados: introduccion, analisis y conclusion'],
])it(`condición fiel ${description}`,()=>expect(deliveryConditions(description).map(c=>c.label)).toContain(label))
for(const description of ['Como recurso: documento de tres páginas con fuente Arial.','La noticia menciona Arial.','No se exige fuente Arial.','Escriben un informe sin investigar.'])it(`no inventa formato ${description}`,()=>expect(deliveryConditions(description)).toEqual([]))
it('no transfiere a páginas un límite expresado en otra unidad',()=>expect(deliveryConditions('Mínimo dos páginas y máximo tres ejemplos').map(c=>c.label)).toEqual(['mínimo 2 páginas','máximo 3 ejemplos']))
for(const description of ['Mínimo cinco y máximo tres páginas','Tres páginas. Cinco páginas.','Tres páginas y cinco páginas.','Interlineado 1.5 e interlineado 2','Con portada. Sin portada.','Incluye tres ejemplos y cinco ejemplos.'])it(`contradicción ${description}`,()=>{
 expect(()=>deliveryConditions(description)).not.toThrow()
 expect(extractTaskRequirements(description).issues.some(i=>i.kind==='CONFLICT')).toBe(true)
 expect(()=>editableFallbackRecommendation({activityTitle:'Actividad',description:'Escriben en inglés un correo. '+description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:{level:'SECONDARY',grade:4,subjectCode:'ING'}})).not.toThrow()
 const draft={name:'Manual',description,instrumentFields:{},instrumentType:'rubrica'}
 expect(validateActivityDraft(draft).some(i=>i.target==='description'&&/contradictorios/.test(i.detail))).toBe(false)
 expect(draft.description).toBe(description)
})
