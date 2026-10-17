import {englishGradeFourGenres} from './secondary-english-grade-four-genres'
import {gradeTwoGenreCriteria} from './secondary-english-grade-two-genres'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
/** Independently cotejadas PDF163–164: the four lists exactly repeat fourth:
 * reception12/30, production10/14. AV remains only an explicit requested product. */
export const englishGradeFiveGenres=englishGradeFourGenres.map(g=>({...g}))
export function gradeFiveGenreCriteria(text:string,mode:string,existing:ContextualTopicCriterion[]){
 const fields=[/\bemisor\b/.test(text)?'el emisor':'',/\bfecha\b/.test(text)?'la fecha':'',/\btotal\b/.test(text)?'el total':''].filter(Boolean).join(', ')
 const genres=englishGradeFiveGenres.filter(g=>!(g.id==='narrative'&&existing.some(c=>c.templateId==='ing-5-narrative')&&!/personajes|trama|ambiente|estructura (?:de la )?narracion/.test(text))).map(g=>g.id==='invoice'&&fields?{...g,data:fields+' de la factura y sus referentes'}:g)
 return gradeTwoGenreCriteria(text,['analysis','comparison','research'].includes(mode)?'reading':mode,existing,'ing-5',genres)
}
