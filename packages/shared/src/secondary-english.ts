import {commonFirstGradeEnglish,resolveFirstGradeEnglishTask,firstGradeEnglishCriteria,firstGradeEnglishSelections,type EnglishTask} from './secondary-english-grade-one'
import {commonSecondGradeEnglish,resolveSecondGradeEnglishTask,secondGradeEnglishCriteria,secondGradeEnglishSelections,type EnglishGradeTwoTask} from './secondary-english-grade-two'
import {commonThirdGradeEnglish,resolveThirdGradeEnglishTask,thirdGradeEnglishCriteria,thirdGradeEnglishSelections,type EnglishGradeThreeTask} from './secondary-english-grade-three'
import type {InstrumentAcademicContext} from './secondary-science'

export type CommonEnglishTask=EnglishTask|EnglishGradeTwoTask|EnglishGradeThreeTask
export const commonSecondaryEnglish=(context?:InstrumentAcademicContext|null)=>commonFirstGradeEnglish(context)||commonSecondGradeEnglish(context)||commonThirdGradeEnglish(context)
export const englishTaskGrade=(task:CommonEnglishTask)=>'grade' in task?task.grade:1
export function resolveCommonEnglishTask(title:string,description:string,context?:InstrumentAcademicContext|null):CommonEnglishTask|null{
 return resolveFirstGradeEnglishTask(title,description,context)??resolveSecondGradeEnglishTask(title,description,context)??resolveThirdGradeEnglishTask(title,description,context)
}
export const commonEnglishCriteria=(task:CommonEnglishTask)=>'grade' in task?task.grade===2?secondGradeEnglishCriteria(task):thirdGradeEnglishCriteria(task):firstGradeEnglishCriteria(task)
export const commonEnglishSelections=(task:CommonEnglishTask,description:string)=>'grade' in task?task.grade===2?secondGradeEnglishSelections(task,description):thirdGradeEnglishSelections(task,description):firstGradeEnglishSelections(task,description)
