import {describe,expect,it} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation} from './instrumentPreparation'

describe('contexto dedicado al integrar proveedores comunes y editor modular',()=>{
  for(const [subjectCode,grade,evidenceInstructions] of [
    ['NAT-FIS',6,'Calcula la corriente mediante la ley de Ohm con los datos proporcionados y explica el resultado sin construir un circuito.'],
    ['MAT',1,'Resuelve las multiplicaciones y divisiones con los valores proporcionados.'],
    ['FRA',1,'Presenta en francés tu nombre y edad con frases breves.'],
  ] as const)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${subjectCode}/${format}: conserva la evidencia explícita en servicio y alternativa local`,()=>{
    const context={level:'SECONDARY' as const,subjectCode,grade,cycle:grade<=3?1:2,subjectName:'',modalityCode:'academic',optativeExitName:null},input={activityTitle:'Actividad',description:'Usa la información proporcionada.',evidenceInstructions,maxScore:17.35,participationMode:'INDIVIDUAL' as const}
    const local=editableFallbackRecommendation({...input,instrumentType:format,academicContext:context})
    const server=recommend({...input,preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
    const content=(p:typeof local)=>({activity:p.activityType,levels:p.levels,criteria:p.criteria.map(({id,sourceType,sourceReferences,...criterion})=>criterion)})
    expect(content(server)).toEqual(content(local))
  })
})
