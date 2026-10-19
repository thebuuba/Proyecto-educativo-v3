import {englishGradeFourGenres} from './secondary-english-grade-four-genres'
import {gradeTwoGenreCriteria} from './secondary-english-grade-two-genres'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {withoutGradeFiveLexicalTargets} from './secondary-english-grade-five-lexicon'
import {englishReceptiveLanguageExercise} from './secondary-english-task-text'
/** Independently cotejadas PDF163–164: the four lists exactly repeat fourth:
 * reception12/30, production10/14. AV remains only an explicit requested product. */
export const englishGradeFiveGenres=englishGradeFourGenres.map(g=>({...g}))
export function gradeFiveGenreCriteria(text:string,mode:string,existing:ContextualTopicCriterion[]){
 const languageResource=englishReceptiveLanguageExercise(text,existing.some(c=>/^ing-5-(?:feature|lexicon)-/.test(c.templateId)))
 text=withoutGradeFiveLexicalTargets(text)
 const fields=[/\bemisor\b/.test(text)?'el emisor':'',/\bfecha\b/.test(text)?'la fecha':'',/\btotal\b/.test(text)?'el total':''].filter(Boolean).join(', ')
 const genres=englishGradeFiveGenres.filter(g=>{
  if(g.id==='narrative'&&languageResource&&!/\b(?:identifiqu\w*|analic\w*|describ\w*)\b[^.;]{0,30}\b(?:personajes|trama|ambiente)\b/.test(text))return false
  if(['notice','sign'].includes(g.id)&&existing.some(c=>/^ing-5-(?:prohibition|obligation)$/.test(c.templateId))&&!/destinatario|estructura del aviso|datos del aviso/.test(text))return false
  return !(g.id==='narrative'&&existing.some(c=>c.templateId==='ing-5-narrative')&&!/\b(?:personajes|trama|ambiente|estructura (?:de la )?narracion)\b/.test(text))
 }).map(g=>g.id==='invoice'&&fields?{...g,data:fields+' de la factura y sus referentes'}:g)
 return gradeTwoGenreCriteria(text,['analysis','comparison','research'].includes(mode)?'reading':mode,existing,'ing-5',genres)
}
