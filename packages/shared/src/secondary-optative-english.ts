import type {InstrumentAcademicContext} from './secondary-science'
import {createUpperEnglishProvider} from './secondary-english-upper-task'
import {requestedGradeFourFunctions,fourthGradeEnglishContent} from './secondary-english-grade-four'
import {resolveEnglishTaskMedia} from './secondary-english'
import {requestedGradeFiveFunctions} from './secondary-english-grade-five'
import {fifthOptativeEnglishContent} from './secondary-optative-english-literature'
import {requestedGradeSixFunctions} from './secondary-english-grade-six'
import {sixthOptativeEnglishContent} from './secondary-optative-english-critical'

export const optativeEnglishModules=[{
 id:'optativa-hlm-ingles-4',grade:4,subjectCode:'OPT-HLM-ING-4',subjectName:'Manejo de la información en inglés',
 optativeExitName:'Humanidades y Lenguas Modernas',modalityCodes:['academic','general'],
 sourceScopeId:'b2d7a388-b852-52a5-adf5-d78642f21f96',pdfPages:[445,446,447,448,449],
 policy:'EXPLICIT_OPTATIVE_SCOPE_REQUESTED_FUNCTION_MEDIUM_FORM_SOURCE_REVIEW_V1',
},{
 id:'optativa-hlm-ingles-5',grade:5,subjectCode:'OPT-HLM-ING-5',subjectName:'Apreciación de la Literatura Anglófona',
 optativeExitName:'Humanidades y Lenguas Modernas',modalityCodes:['academic','general'],
 sourceScopeId:'95d4757b-5e0a-5821-af62-37d031ccf922',pdfPages:[450,451,452,453,454,455],
 policy:'EXPLICIT_OPTATIVE_SCOPE_REQUESTED_FUNCTION_MEDIUM_BASIC_LITERATURE_SOURCE_REVIEW_V1',
},{
 id:'optativa-hlm-ingles-6',grade:6,subjectCode:'OPT-HLM-ING-6',subjectName:'Análisis Crítico y Evaluación de Textos en Inglés',
 optativeExitName:'Humanidades y Lenguas Modernas',modalityCodes:['academic','general'],
 sourceScopeId:'7e02a1ba-12f8-5862-81ff-0ad9bb34f8cc',pdfPages:[456,457,458,459,460],
 policy:'EXPLICIT_OPTATIVE_SCOPE_REQUESTED_FUNCTION_MEDIUM_CRITICAL_INFORMATION_SOURCE_REVIEW_V1',
}]
const acceptsContext=(module:typeof optativeEnglishModules[number],context?:InstrumentAcademicContext|null)=>{
 return context?.level==='SECONDARY'&&context.grade===module.grade&&(context.cycle==null||context.cycle===2)
  &&context.subjectCode.trim().toUpperCase()===module.subjectCode&&context.optativeExitName===module.optativeExitName
  &&module.modalityCodes.includes(context.modalityCode??'')
}
const content={4:{functions:requestedGradeFourFunctions,criteria:fourthGradeEnglishContent},5:{functions:requestedGradeFiveFunctions,criteria:fifthOptativeEnglishContent},6:{functions:requestedGradeSixFunctions,criteria:sixthOptativeEnglishContent}}
const providers=optativeEnglishModules.map(module=>{
 const grade=module.grade as 4|5|6,definition=content[grade]
 return createUpperEnglishProvider({grade,acceptsContext:context=>acceptsContext(module,context),functions:definition.functions,criteria:task=>definition.criteria(task).map(row=>({...row,templateId:row.templateId.replace(new RegExp(`^ing-${grade}-`),`opt-hlm-ing-${grade}-`)}))})
})
export function resolveOptativeEnglishTask(title:string,description:string,context?:InstrumentAcademicContext|null){
 return resolveEnglishTaskMedia(description,text=>providers.map(provider=>provider.resolve(title,text,context)).find(Boolean)??null)
}
