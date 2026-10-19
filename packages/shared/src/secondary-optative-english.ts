import type {InstrumentAcademicContext} from './secondary-science'
import {createUpperEnglishProvider} from './secondary-english-upper-task'
import {requestedGradeFourFunctions,fourthGradeEnglishContent} from './secondary-english-grade-four'
import {resolveEnglishTaskMedia} from './secondary-english'

export const optativeEnglishModules=[{
 id:'optativa-hlm-ingles-4',grade:4,subjectCode:'OPT-HLM-ING-4',subjectName:'Manejo de la información en inglés',
 optativeExitName:'Humanidades y Lenguas Modernas',modalityCodes:['academic','general'],
 sourceScopeId:'b2d7a388-b852-52a5-adf5-d78642f21f96',pdfPages:[445,446,447,448,449],
 policy:'EXPLICIT_OPTATIVE_SCOPE_REQUESTED_FUNCTION_MEDIUM_FORM_SOURCE_REVIEW_V1',
}]
const acceptsContext=(context?:InstrumentAcademicContext|null)=>{
 const module=optativeEnglishModules[0]
 return context?.level==='SECONDARY'&&context.grade===module.grade&&(context.cycle==null||context.cycle===2)
  &&context.subjectCode.trim().toUpperCase()===module.subjectCode&&context.optativeExitName===module.optativeExitName
  &&module.modalityCodes.includes(context.modalityCode??'')
}
const provider=createUpperEnglishProvider({grade:4,acceptsContext,functions:requestedGradeFourFunctions,criteria:task=>fourthGradeEnglishContent(task).map(row=>({...row,templateId:row.templateId.replace(/^ing-4-/,'opt-hlm-ing-4-')}))})
export function resolveOptativeEnglishTask(title:string,description:string,context?:InstrumentAcademicContext|null){
 return resolveEnglishTaskMedia(description,text=>provider.resolve(title,text,context))
}
