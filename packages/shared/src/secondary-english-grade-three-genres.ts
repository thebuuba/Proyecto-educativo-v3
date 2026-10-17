import {englishGradeTwoGenres,gradeTwoGenreCriteria} from './secondary-english-grade-two-genres'
import {requestedEnglishGenres} from './secondary-english-grade-one-genres'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
/** PDF146: independently checked identical lists (reception28/oral8/written11).
 * AV is an explicit teacher product, not an additional curricular genre. */
export const englishGradeThreeGenres=englishGradeTwoGenres.map(g=>({...g,...(g.id==='email'?{match:'correos?(?: electronicos?)?|e mails?|emails?'}:{})}))
export const requestedGradeThreeGenres=(text:string,mode?:string)=>requestedEnglishGenres(text,englishGradeThreeGenres.filter(g=>!mode||g.modes.includes(['analysis','comparison','research'].includes(mode)?'reading':mode)))
export function gradeThreeGenreCriteria(text:string,mode:string,existing:ContextualTopicCriterion[]){
 const supported=englishGradeThreeGenres.filter(g=>{
  if(g.id==='notice'&&existing.some(c=>['ing-3-prohibition','ing-3-warning'].includes(c.templateId))&&!/destinatario|datos del aviso|estructura del aviso/.test(text))return false
  if(g.id==='news'&&existing.some(c=>c.templateId==='ing-3-news'))return false
  if(g.id==='narrative'&&existing.some(c=>c.templateId==='ing-3-narrative')&&!/personajes|narrador|estructura (?:de la )?narracion/.test(text))return false
  return true
 })
 return gradeTwoGenreCriteria(text,['analysis','comparison','research'].includes(mode)?'reading':mode,existing,'ing-3',supported)
}
