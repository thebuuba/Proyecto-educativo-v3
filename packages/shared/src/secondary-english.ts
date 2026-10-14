import {commonFirstGradeEnglish,resolveFirstGradeEnglishTask,firstGradeEnglishCriteria,firstGradeEnglishSelections,type EnglishTask} from './secondary-english-grade-one'
import {commonSecondGradeEnglish,resolveSecondGradeEnglishTask,secondGradeEnglishCriteria,secondGradeEnglishSelections,type EnglishGradeTwoTask} from './secondary-english-grade-two'
import type {InstrumentAcademicContext} from './secondary-science'

export type CommonEnglishTask=EnglishTask|EnglishGradeTwoTask
export const commonSecondaryEnglish=(context?:InstrumentAcademicContext|null)=>commonFirstGradeEnglish(context)||commonSecondGradeEnglish(context)
export const englishTaskGrade=(task:CommonEnglishTask)=>'grade' in task?task.grade:1
export function resolveCommonEnglishTask(title:string,description:string,context?:InstrumentAcademicContext|null):CommonEnglishTask|null{
 return resolveFirstGradeEnglishTask(title,description,context)??resolveSecondGradeEnglishTask(title,description,context)
}
export const commonEnglishCriteria=(task:CommonEnglishTask)=>'grade' in task?secondGradeEnglishCriteria(task):firstGradeEnglishCriteria(task)
export const commonEnglishSelections=(task:CommonEnglishTask,description:string)=>'grade' in task?secondGradeEnglishSelections(task,description):firstGradeEnglishSelections(task,description)
