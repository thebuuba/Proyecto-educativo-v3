import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {appendInstrumentCriterion} from './instrumentCriterionAddition'

const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Escala de Lengua: grados compartidos y evidencia contextual',()=>{
  for(const [purpose,labels] of [
    ['Se registrará la regularidad de las inferencias durante las lecturas.',['Siempre','Frecuentemente','A veces','Todavía no']],
    ['Se valorarán grados de logro en las inferencias.',['Completo','Suficiente','Parcial','Aún no logrado']],
  ] as const) it(purpose,()=>{
    const description=`Inferirán el significado de palabras desconocidas de una guía turística a partir del contexto. ${purpose}`
    const input={activityTitle:'Lecturas',description,participationMode:'INDIVIDUAL' as const,maxScore:17.35,preferredInstrumentType:'escala' as const}
    const server=recommend(input,context,null,[],'UNMAPPED',null)
    const local=editableFallbackRecommendation({...input,instrumentType:'escala',academicContext:context,secondaryLanguageGrade:1})
    expect(server.levels.map(l=>l.label)).toEqual(labels)
    expect(local.levels).toEqual(server.levels)
    expect(local.criteria.map(c=>c.descriptors)).toEqual(server.criteria.map(c=>c.descriptors))
    const criterion=server.criteria.find(c=>c.templateId==='guide-procedure-vocabulary')!
    expect(criterion.title).toMatch(/significado.*palabras.*contexto/)
    if(labels[0]==='Siempre')expect(criterion.descriptors.every(d=>d.text.length<90)).toBe(true)
    else {
      expect(criterion.descriptors[0].text).toMatch(/significado.*(?:pasaje|contexto)/)
      expect(criterion.descriptors[2].text).toMatch(/palabras|contexto|significado/)
    }
    const existing={...server,criteria:server.criteria.filter(c=>c.id!==criterion.id)}
    const fields=recommendationToFields(existing,'Lecturas')
    const added=appendInstrumentCriterion(fields,'escala',17.35,existing,criterion)
    expect(added.fields['escala:descriptor:1:4']).toBe(criterion.descriptors[0].text)
    expect(added.fields['escala:descriptor:0:4']).toBe(fields['escala:descriptor:0:4'])
    const rubric=recommend({...input,preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
    const rubricCriterion=rubric.criteria.find(c=>c.templateId===criterion.templateId)!
    if(labels[0]==='Completo')expect(criterion.descriptors.map(d=>d.text)).toEqual(rubricCriterion.descriptors.map(d=>d.text))
    expect(rubricCriterion.descriptors[0].text).toMatch(/significado|contexto/)
    expect(rubric.levels[0].label).toBe('Destacado')
  })
})
