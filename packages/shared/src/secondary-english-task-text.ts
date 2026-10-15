import {affirmativeLanguageTask} from './language-feature-criteria'
import {withoutResources} from './evaluation-task-text'
import type {InstrumentAcademicContext} from './secondary-science'

/** Negation is removed before punctuation normalization, preserving the next
 * affirmative clause. Resources are not independent assessed actions. */
export const affirmativeScopedEnglishTask=(description:string)=>affirmativeLanguageTask(withoutResources(description).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
 .replace(/\bno (?:se )?(?:evalu\w*|calific\w*|exig\w*|requer\w*|us\w*|utiliz\w*|emple\w*|respond\w*)\b[^.;]*/g,''))
export function commonEnglishGrade(context:InstrumentAcademicContext|null|undefined,grade:number){
 return context?.level==='SECONDARY'&&context.grade===grade&&!context.optativeExitName&&(context.subjectCode.trim().toUpperCase()==='ING'||!context.subjectCode.trim()&&/^(?:(?:lenguas? extranjeras? )?ingles|english)$/.test(affirmativeLanguageTask(context.subjectName??'')))
}
