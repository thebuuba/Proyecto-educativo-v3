import {commonSixthGradeEnglish,resolveSixthGradeEnglishTask} from './secondary-english-grade-six'
import {commonFifthGradeEnglish,resolveFifthGradeEnglishTask} from './secondary-english-grade-five'
import {commonFirstGradeEnglish,resolveFirstGradeEnglishTask,firstGradeEnglishCriteria,firstGradeEnglishSelections,type EnglishTask} from './secondary-english-grade-one'
import {commonSecondGradeEnglish,resolveSecondGradeEnglishTask,secondGradeEnglishCriteria,secondGradeEnglishSelections,type EnglishGradeTwoTask} from './secondary-english-grade-two'
import {commonThirdGradeEnglish,resolveThirdGradeEnglishTask,thirdGradeEnglishCriteria,thirdGradeEnglishSelections,type EnglishGradeThreeTask} from './secondary-english-grade-three'
import {commonFourthGradeEnglish,resolveFourthGradeEnglishTask} from './secondary-english-grade-four'
import {upperEnglishCriteria,upperEnglishSelections,type UpperEnglishTask} from './secondary-english-upper-task'
import type {InstrumentAcademicContext} from './secondary-science'
import {affirmativeScopedEnglishTask,englishRequirementSource} from './secondary-english-task-text'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export type CommonEnglishTask=(EnglishTask|EnglishGradeTwoTask|EnglishGradeThreeTask|UpperEnglishTask)&{additionalCriteria?:ContextualTopicCriterion[]}
export const commonSecondaryEnglish=(context?:InstrumentAcademicContext|null)=>commonFirstGradeEnglish(context)||commonSecondGradeEnglish(context)||commonThirdGradeEnglish(context)||commonFourthGradeEnglish(context)||commonFifthGradeEnglish(context)||commonSixthGradeEnglish(context)
export const englishTaskGrade=(task:CommonEnglishTask)=>'grade' in task?task.grade:1
export function resolveCommonEnglishTask(title:string,description:string,context?:InstrumentAcademicContext|null):CommonEnglishTask|null{
 const resolve=(text:string)=>resolveFirstGradeEnglishTask(title,text,context)??resolveSecondGradeEnglishTask(title,text,context)??resolveThirdGradeEnglishTask(title,text,context)??resolveFourthGradeEnglishTask(title,text,context)??resolveFifthGradeEnglishTask(title,text,context)??resolveSixthGradeEnglishTask(title,text,context)
 const task=resolve(englishRequirementSource(description))
 if(!task)return null
 const text=affirmativeScopedEnglishTask(description)
 const mixed=/\b(?:oral(?:es)? y escrit[ao]s?|escrit[ao]s? y oral(?:es)?)\b/
 if(!mixed.test(text))return task
 const oral=resolve(text.replace(mixed,'oral')),written=resolve(text.replace(mixed,'por escrito'))
 const additionalCriteria=[...(oral?baseEnglishCriteria(oral):[]),...(written?baseEnglishCriteria(written):[])].filter(c=>/-(?:written|intelligibility)$/.test(c.templateId))
 return {...task,additionalCriteria}
}
const baseEnglishCriteria=(task:CommonEnglishTask)=>'grade' in task?task.grade===2?secondGradeEnglishCriteria(task):task.grade===3?thirdGradeEnglishCriteria(task):upperEnglishCriteria(task):firstGradeEnglishCriteria(task)
export function commonEnglishCriteria(task:CommonEnglishTask){
 const rows=baseEnglishCriteria(task)
 return [...rows,...(task.additionalCriteria??[]).filter(c=>!rows.some(r=>r.templateId===c.templateId))]
}
export const commonEnglishSelections=(task:CommonEnglishTask,description:string)=>'grade' in task?task.grade===2?secondGradeEnglishSelections(task,description):task.grade===3?thirdGradeEnglishSelections(task,description):upperEnglishSelections(task,description):firstGradeEnglishSelections(task,description)
