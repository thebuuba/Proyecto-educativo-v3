import {describe,it,expect} from 'vitest'
import * as shared from '@aula/shared'
import type {CommonScienceTask} from '@aula/shared'
import type {CommonScienceTopic} from '../../../../../packages/shared/src/secondary-science-common-types'
const topic:CommonScienceTopic={id:'biological-model',grade:4,label:'sistema biológico',match:'sistema biologico',relation:'las entradas y salidas del modelo proporcionado',pages:[500]}
type Resolver=(title:string,description:string,grade:number,topics:CommonScienceTopic[],options?:{additionalVerbs?:string;selectTopics?:(text:string,topics:CommonScienceTopic[])=>CommonScienceTopic[]})=>CommonScienceTask|null

describe('Entrada científica configurable con wrapper común conservado',()=>{
 it('reutiliza la separación de acciones y el selector con verbos propios sin habilitar una optativa por el guard común',()=>{
  const resolve=(shared as unknown as {resolveScienceTaskForTopics:Resolver}).resolveScienceTaskForTopics
  expect(typeof resolve).toBe('function')
  const task=resolve('Título sobre células','Simula el sistema biológico y programa la variante dada y analiza los resultados proporcionados.',4,[topic],{additionalVerbs:'simul\\w*|program\\w*',selectTopics:(text,topics)=>/sistema biologico/.test(text)?topics:[]})
  expect(task?.actions).toHaveLength(3)
  expect(task?.actions.map(a=>a.text)).toEqual(['simula el sistema biologico','programa la variante dada','analiza los resultados proporcionados.'])
  expect(task?.actions.every(a=>a.topics.length===1&&a.topics[0].id==='biological-model')).toBe(true)
  expect(shared.resolveCommonScienceTask('Actividad','Simula el sistema biológico.',{level:'SECONDARY',grade:4,subjectCode:'OPT-CT-4',modalityCode:'academic',optativeExitName:'Ciencias y Tecnología'})).toBeNull()
 })
 it('mantiene la entrada común igual al resolver sin opciones para cada grado y contexto válido',()=>{
  const resolve=(shared as unknown as {resolveScienceTaskForTopics:Resolver}).resolveScienceTaskForTopics
  expect(typeof resolve).toBe('function')
  for(const grade of [1,2,3,4,5,6])for(const t of shared.commonScienceTopicsByGrade[grade]){
   const text='Explica '+t.label+' con las fuentes proporcionadas.'
   expect(resolve('Actividad',text,grade,shared.commonScienceTopicsByGrade[grade])).toEqual(shared.resolveCommonScienceTask('Actividad',text,{level:'SECONDARY',grade,subjectCode:'NAT',optativeExitName:null}))
  }
 })
})
