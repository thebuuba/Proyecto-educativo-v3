import {affirmativeLanguageTask} from './language-feature-criteria'
import {withoutResources,normalizedTask} from './evaluation-task-text'
import type {InstrumentAcademicContext} from './secondary-science'

/** Negation is removed before punctuation normalization, preserving the next
 * affirmative clause. Resources are not independent assessed actions. */
export const englishRequirementSource=(description:string)=>withoutResources(description).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
 .replace(/\bno (?:(?:se|deben?|debera\w*) )?(?:evalu\w*|calific\w*|exig\w*|requer\w*|us\w*|utiliz\w*|emple\w*|respond\w*|formul\w*|intercambi\w*|entrevist\w*|analiz\w*|analic\w*|explic\w*|expliqu\w*|investig\w*|busqu\w*|sistematiz\w*|sistematic\w*|propong\w*|propon\w*)\b[^.;]*/g,'')
export const affirmativeScopedEnglishTask=(description:string)=>affirmativeLanguageTask(englishRequirementSource(description))
/** A narrative supplied for a language exercise is a resource, not a request to
 * reconstruct its plot. Independent writing/narration remains its own action. */
export const englishReceptiveLanguageExercise=(text:string,languageTarget:boolean)=>languageTarget&&/\b(?:leer(?:an)?|lean|lee|leen|escuch\w*)\b/.test(text)&&!/\b(?:escrib\w*|redact\w*|narrar(?:an)?|narren|relatar(?:an)?)\b/.test(text)
export const englishProfileWithoutNarration=(text:string)=>/\b(?:curriculum(?: vitae)?|cv)\b/.test(text)&&!/\b(?:narr\w*|relat\w*|secuencia de acontecimientos)\b/.test(text)
export function commonEnglishGrade(context:InstrumentAcademicContext|null|undefined,grade:number){
 return context?.level==='SECONDARY'&&context.grade===grade&&!context.optativeExitName&&(context.subjectCode.trim().toUpperCase()==='ING'||!context.subjectCode.trim()&&/^(?:(?:lenguas? extranjeras? )?ingles|english)$/.test(affirmativeLanguageTask(context.subjectName??'')))
}
export const englishContextTask=(description:string)=>normalizedTask(withoutResources(description).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\bno (?:se )?(?:evalu\w*|calific\w*|exig\w*|requer\w*)\b[^.;]*/g,''))
/** Finite coordinated actions start their own evidence; purpose infinitives stay
 * attached. The established second-grade splitter is shared unchanged. */
export function independentEnglishActionParts(description:string){
 const raw=withoutResources(description).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\bno (?:se )?(?:evalu\w*|calific\w*|exig\w*|requer\w*|us\w*|utiliz\w*|emple\w*|respond\w*|analiz\w*|analic\w*|explic\w*|expliqu\w*|investig\w*|busqu\w*|sistematiz\w*|sistematic\w*|propong\w*|propon\w*)\b[^.;]*/g,'')
 const action='(?:leer(?:an)?|lee|lean|escuchar(?:an)?|escuchen|redactar(?:an)?|redacten|escribir(?:an)?|escriban|presentar(?:an)?|presenten|expondran|conversar(?:an)?|conversen|dialogar(?:an)?|dialoguen|comunicar(?:an)?|comuniquen|comparar(?:an)?|compar(?:en|an)|crear(?:an)?|creen|elaborar(?:an)?|elaboren|narrar(?:an)?|narren|sistematizar(?:an)?|sistematicen|evaluar(?:an)?|evaluen)'
 const prefix='(?:(?:luego|despues|posteriormente|finalmente),?\\s+)?(?:(?:los estudiantes|el alumnado|cada estudiante|ellos|ellas)\\s+)?(?:(?:lo|la|los|las)\\s+)?'
 return raw.split(new RegExp(`(?:[.;]\\s*|\\s+(?:y|luego|despues|posteriormente|finalmente)\\s+)(?=${prefix}${action}\\b)`,'g'))
}
