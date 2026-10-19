import {describe,it,expect} from 'vitest'
import {optativeHcsSocFour} from '../../../../../packages/shared/src/secondary-optative-hcs-soc-4'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'OPT-HCS-SOC-4',subjectName:optativeHcsSocFour.subjectName,modalityCode:'academic',optativeExitName:optativeHcsSocFour.optativeExitName}
describe('consignas breves de cada agrupación filosófica',()=>{
 for(const topic of optativeHcsSocFour.topics)it(topic.id,()=>{
  const proposal=recommend({activityTitle:'Experimento antiguo sobre células',description:'Analiza '+topic.label+' en el texto proporcionado.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(proposal.criteria.length).toBeGreaterThan(0)
  expect(proposal.criteria.every(r=>r.templateId.startsWith('opt-hcs-soc-4-'))).toBe(true)
  expect(proposal.criteria.some(r=>r.templateId.startsWith('opt-hcs-soc-4-'+topic.id+'-'))).toBe(true)
 })
})
