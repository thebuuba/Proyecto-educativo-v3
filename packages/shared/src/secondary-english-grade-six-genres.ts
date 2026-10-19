import {englishGradeFiveGenres} from './secondary-english-grade-five-genres'
import {gradeTwoGenreCriteria} from './secondary-english-grade-two-genres'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {withoutGradeSixLexicalTargets} from './secondary-english-grade-six-lexicon'
import {englishReceptiveLanguageExercise} from './secondary-english-task-text'
/** PDF169–170: independently checked, the four lists repeat fifth exactly. */
export const englishGradeSixGenres=englishGradeFiveGenres.map(g=>({...g}))
export function gradeSixGenreCriteria(text:string,mode:string,existing:ContextualTopicCriterion[]){
 const languageResource=englishReceptiveLanguageExercise(text,existing.some(c=>/^ing-6-(?:feature|lexicon)-/.test(c.templateId)))
 text=withoutGradeSixLexicalTargets(text)
 const fields=[/\bemisor\b/.test(text)?'el emisor':'',/\bfecha\b/.test(text)?'la fecha':'',/\btotal\b/.test(text)?'el total':''].filter(Boolean).join(', ')
 const profile=[/\bexperiencia\b/.test(text)?'la experiencia':'',/\b(?:capacidades|competencias)\b/.test(text)?'las capacidades':''].filter(Boolean).join(' y ')
 const genres=englishGradeSixGenres.filter(g=>!(g.id==='narrative'&&(languageResource&&!/\b(?:identifiqu\w*|analic\w*|describ\w*)\b[^.;]{0,30}\b(?:personajes|trama|ambiente)\b/.test(text)||existing.some(c=>c.templateId==='ing-6-detailed-narrative')&&!/\b(?:personajes|trama|ambiente|estructura (?:de la )?narracion)\b/.test(text)))).map(g=>g.id==='invoice'&&fields?{...g,data:fields+' de la factura y sus referentes'}:g.id==='cv'&&profile?{...g,data:'los datos solicitados de '+profile.replace(/^la /,'').replace(' y las ',' y ')+' del perfil proporcionado'}:g)
 return gradeTwoGenreCriteria(text,['analysis','comparison','research'].includes(mode)?'reading':mode,existing,'ing-6',genres)
}
