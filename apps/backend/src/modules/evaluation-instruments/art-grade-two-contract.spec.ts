import { describe, expect, it } from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/art-grade-two-contracts.json'
import { recommend } from './recommendation-engine'
import { deliveryConditions } from '@aula/shared'

const context = { level: 'SECONDARY' as const, grade: 2, cycle: 1, subjectCode: 'ART', subjectName: 'Educación Artística', modalityCode: null, optativeExitName: null }
describe('Artística segundo: acciones, técnicas y evidencias solicitadas', () => {
  it('los ejemplos y fuentes proporcionados son insumos, no cantidades nuevas de entrega', () => {
    expect(deliveryConditions('Explica la técnica de pintura en los dos ejemplos proporcionados.')).toEqual([])
    expect(deliveryConditions('Compara las tres fuentes dadas e incluye dos ejemplos propios.')).toEqual([{ key: 'quantity-ejemplo', label: '2 ejemplos' }])
  })
  it('las explicaciones breves no dejan modificadores sueltos ni exigen un caso proporcionado', () => {
    for (const description of ['Explica rutinas de danza urbana.', 'Explica ballet y danzas moderna, posmoderna, contemporánea y folklórica.', 'Explica patrimonio artístico material e inmaterial.']) {
      const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
      expect(p.criteria.map(row=>row.description).join(' ')).not.toMatch(/expresamente[.,]|en el caso[.,]/)
    }
  })
  it('argumentar una alternativa patrimonial exige razones y evidencia para la decisión', () => {
    const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(t=>t.id==='heritage-argument')!.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(p.criteria.some(row=>/justifica.*alternativa.*razones.*evidencias/i.test(row.description))).toBe(true)
  })
  it('investigar montajes no convierte los resultados en un portafolio obligatorio', () => {
    const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(t=>t.id==='broadway-research')!.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(p.activityType).toBe('RESEARCH')
  })
  it('improvisar se observa como respuesta ejecutada y no como una propuesta compuesta', () => {
    const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(t=>t.id==='musical-improvisation')!.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(p.criteria.some(row=>/improvisa.*pauta/i.test(row.description))).toBe(true)
  })
  it('el contraste entre artes nombra solo ritmo y contraste cuando son los elementos pedidos', () => {
    const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(t=>t.id==='shared-art-elements')!.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(p.criteria.map(row=>row.description).join(' ')).toMatch(/ritmo.*contraste/i)
  })
  it('Nunca en la escala de seguridad describe ausencia de la acción observada', () => {
    const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(t=>t.id==='art-safety-observation')!.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'escala'},context,null,[],'UNMAPPED',null)
    expect(p.criteria[0].descriptors.at(-1)?.text).toMatch(/^No realiza.*oportunidades observadas/)
  })
  it('la verificación de pintura separa técnica y soporte sin un requisito genérico duplicado', () => {
    const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(t=>t.id==='art-requirements-check')!.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'lista-cotejo'},context,null,[],'UNMAPPED',null)
    expect(p.criteria).toHaveLength(2)
    expect(p.criteria.map(row=>row.description).join(' ')).toMatch(/técnica.*soporte/)
    expect(p.criteria.map(row=>row.description).join(' ')).not.toMatch(/requisito de los requisitos/)
  })
  for (const task of contracts.cases)
    for (const instrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const)
      for (const maxScore of [20, 17.35]) {
        it(`${task.id}/${instrumentType}/${maxScore}`, () => {
          const proposal = recommend({ activityTitle: 'Título antiguo sobre células', description: task.description, maxScore, preferredInstrumentType: instrumentType, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
          expect(proposal.criteria.length).toBeGreaterThan(0)
          expect(proposal.criteria.every(row => row.templateId.startsWith('art-2-'))).toBe(true)
          for (const topic of task.topicIds) expect(proposal.criteria.some(row => row.templateId.startsWith(`art-2-${topic}-${task.purpose.toLowerCase()}-`))).toBe(true)
          expect(JSON.stringify(proposal.criteria)).not.toMatch(/células|titulo antiguo/i)
          if ('forbidden' in task) expect(proposal.criteria.map(row => row.description).join(' ')).not.toMatch(new RegExp(task.forbidden!, 'i'))
          expect(proposal.criteria.reduce((n,row) => n+row.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
        })
      }
})
