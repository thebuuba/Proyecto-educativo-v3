import {describe,it,expect} from 'vitest'
import {resolveSocialTaskForTopics,resolveCommonSocialTask} from '../../../../../packages/shared/src/secondary-social'
const topics=[{id:'philosophy-probe',grade:4,label:'filosofía',match:'filosofia',relation:'las ideas filosóficas solicitadas',pages:[482]}]
const policy={additionalVerbs:'resum(?:e|en|a|an|ir)'}
describe('núcleo social compartido y verbos optativos acotados',()=>{
 it('admite un verbo adicional sin modificar el contexto académico',()=>{
  const task=resolveSocialTaskForTopics('','Resume las ideas de filosofía del texto dado.',4,topics,policy)
  expect(task?.actions).toHaveLength(1);expect(task?.actions[0].text).toContain('resume')
 })
 it('una negación optativa no elimina la explicación positiva posterior',()=>{
  const task=resolveSocialTaskForTopics('','No resume el texto de filosofía. Explica filosofía según el fragmento dado.',4,topics,policy)
  expect(task?.actions).toHaveLength(1);expect(task?.actions[0].text).not.toContain('resume');expect(task?.actions[0].text).toContain('explica')
 })
 it('el resolver común sigue rechazando una salida optativa',()=>{
  expect(resolveCommonSocialTask('','Explica filosofía.',{level:'SECONDARY',grade:4,subjectCode:'SOC',optativeExitName:'Humanidades y Ciencias Sociales'},topics)).toBeNull()
 })
})
