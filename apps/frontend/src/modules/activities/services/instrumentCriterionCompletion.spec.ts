import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'
import { completeInstrumentCriterion, matchingCatalogCriterion, nextCatalogCriterion, fillAuthoredLevelDescriptors, appendInstrumentCriterion } from './instrumentCriterionAddition'

const formats = ['rubrica','lista-cotejo','escala','lista-ponderada'] as const
describe('Completar solamente campos vacíos del criterio', () => {
  it.each(formats)('conserva identidad, textos y puntos en %s', type => {
    const proposal = editableFallbackRecommendation({activityTitle:'Actividad',description:'Redactarán un informe de lectura con resumen, personajes y conclusión.', secondaryLanguageGrade:1,activityType:'READING_REPORT_WRITING',instrumentType:type,maxScore:17.35,participationMode:'INDIVIDUAL'})
    const fields = recommendationToFields(proposal,'Actividad')
    const candidate = proposal.criteria[0]
    fields[`${type}:description:0`] = ''
    if (type === 'lista-ponderada') fields[`${type}:indicator:0`] = ''
    if (type === 'rubrica' || type === 'escala') {
      fields[`${type}:descriptor:0:4`] = 'Mi evidencia manual'
      fields[`${type}:descriptor:0:2`] = ''
    }
    const next = completeInstrumentCriterion(fields,type,0,candidate)
    expect(next[`${type}:description:0`]).toBe(candidate.description)
    expect(next[`${type}:criterion-id:0`]).toBe(fields[`${type}:criterion-id:0`])
    expect(next[`${type}:points:0`]).toBe(fields[`${type}:points:0`])
    expect(next[`${type}:criterion:1`]).toBe(fields[`${type}:criterion:1`])
    if (type === 'rubrica' || type === 'escala') {
      expect(next[`${type}:descriptor:0:4`]).toBe('Mi evidencia manual')
      expect(next[`${type}:descriptor:0:2`]).toBe(candidate.descriptors[2].text)
    }
  })
  it('respeta la intención manual y no elige otro objetivo', () => {
    const proposal = editableFallbackRecommendation({activityTitle:'Actividad',description:'Elaborarán un informe de lectura con resumen y personajes.',secondaryLanguageGrade:1,activityType:'READING_REPORT_WRITING',instrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL'})
    const fields = recommendationToFields(proposal,'Actividad')
    fields['rubrica:criterion:0'] = 'Mis hábitos alimenticios'
    fields['rubrica:description:0'] = ''
    expect(matchingCatalogCriterion(proposal.criteria,fields,'rubrica',0,proposal.criteria)).toBeNull()
  })
  it('no duplica un criterio renombrado completamente', () => {
    const proposal = editableFallbackRecommendation({activityTitle:'Actividad',description:'Elaborarán un informe de lectura con resumen.',secondaryLanguageGrade:1,activityType:'READING_REPORT_WRITING',instrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL'})
    const fields = recommendationToFields(proposal,'Actividad')
    fields['rubrica:criterion:0']='Texto propio'
    fields['rubrica:description:0']='Evidencia escrita por mí'
    expect(nextCatalogCriterion([proposal.criteria[0]],fields,'rubrica',proposal.criteria)).toBeNull()
  })
  it('aprovecha el quinto desempeño sin repetir ni sustituir textos existentes', () => {
    const fields = {'rubrica:meta:criteriaCount':'1','rubrica:meta:levelCount':'5',
      'rubrica:criterion:0':'Evidencia','rubrica:description:0':'Indicador',
      'rubrica:criterion-evidence:0':JSON.stringify({title:'Evidencia',description:'Indicador',progression:['A','B','C','D','E']}),
      'rubrica:descriptor:0:5':'A','rubrica:descriptor:0:4':'B','rubrica:descriptor:0:3':'C','rubrica:descriptor:0:2':'','rubrica:descriptor:0:1':'E'}
    expect(fillAuthoredLevelDescriptors(fields,'rubrica')['rubrica:descriptor:0:2']).toBe('D')
    const manual = {...fields,'rubrica:criterion:0':'Mi objetivo diferente'}
    expect(fillAuthoredLevelDescriptors(manual,'rubrica')['rubrica:descriptor:0:2']).toBe('')
    const six = {...fields,'rubrica:meta:levelCount':'6'}
    expect(fillAuthoredLevelDescriptors(six,'rubrica')['rubrica:descriptor:0:2']).toBe('')
  })
  it('reconoce un nombre docente específico y rechaza una intención ambigua',()=>{
    const proposal=editableFallbackRecommendation({activityTitle:'Matrices',description:'Organizarán matrices de cantidades y precios y resolverán operaciones de suma y resta según corresponda. Explicarán el procedimiento e interpretarán los resultados.',academicContext:{level:'SECONDARY',grade:5,subjectCode:'MAT'},instrumentType:'rubrica',participationMode:'INDIVIDUAL',maxScore:20})
    const fields={'rubrica:meta:criteriaCount':'1','rubrica:criterion-id:0':'manual-one','rubrica:criterion:0':'Compatibilidad de dimensiones','rubrica:description:0':''}
    expect(matchingCatalogCriterion(proposal.criteria,fields,'rubrica',0)?.templateId).toBe('math-matrices-selection')
    expect(matchingCatalogCriterion(proposal.criteria,{...fields,'rubrica:criterion:0':'Matrices'},'rubrica',0)).toBeNull()
    const next=completeInstrumentCriterion(fields,'rubrica',0,proposal.criteria[1])
    expect(next['rubrica:criterion:0']).toBe('Compatibilidad de dimensiones')
  })
  it('no repite cuatro descriptores para aparentar seis niveles',()=>{
    const proposal=editableFallbackRecommendation({activityTitle:'Actividad',description:'Redactarán un informe de lectura con resumen.',secondaryLanguageGrade:1,activityType:'READING_REPORT_WRITING',instrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL'})
    const fields={...recommendationToFields(proposal,'Actividad'),'rubrica:meta:levelCount':'6'}
    const index=proposal.criteria.length
    const next=appendInstrumentCriterion(fields,'rubrica',null,proposal,proposal.criteria[0]).fields
    expect(Array.from({length:6},(_,i)=>next[`rubrica:descriptor:${index}:${6-i}`])).toEqual(Array(6).fill(''))
  })
  it.each(formats)('usa el peso relativo de un candidato adicional en %s',type=>{
    const input={activityTitle:'Matrices',description:'Construirán matrices de cantidades y precios. Resolverán suma, resta y multiplicación según corresponda, explicarán los procedimientos, interpretarán y comprobarán los resultados.',academicContext:{level:'SECONDARY' as const,grade:5,subjectCode:'MAT'},instrumentType:type,participationMode:'INDIVIDUAL' as const,maxScore:20}
    const proposal=editableFallbackRecommendation(input)
    const pool=editableFallbackRecommendation({...input,maxScore:100,includeAdditionalCandidates:true})
    const candidate=pool.criteria.find(row=>row.templateId==='math-matrices-verification')!
    const fields=scoreInstrumentFields(recommendationToFields(proposal,'Matrices'),type,17.35,proposal)
    const next=appendInstrumentCriterion(fields,type,17.35,proposal,candidate)
    const last=proposal.criteria.length
    if(type==='lista-ponderada') expect(Number(next.fields[`${type}:weight:${last}`])/Number(next.fields[`${type}:weight:0`])).toBeCloseTo(0.5,2)
    else {
      const weights=JSON.parse(next.fields[`${type}:meta:scoreWeights`])
      expect(weights[last]/weights[0]).toBeCloseTo(0.5,4)
    }
    expect(Array.from({length:last+1},(_,index)=>Math.round(Number(next.fields[`${type}:points:${index}`])*100)).reduce((a,b)=>a+b,0)).toBe(1735)
  })
})
