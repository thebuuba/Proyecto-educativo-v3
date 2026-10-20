import type {InstrumentAcademicContext} from './secondary-science'
import type {CommonScienceTopic} from './secondary-science-common-types'
import {resolveScienceTaskForTopics,commonScienceSelections,adaptScienceScale,type CommonScienceTask} from './secondary-science-common'
import type {InstrumentRecommendation} from './instrument-recommendation'
import {optativeCtFour} from './secondary-optative-ct-4'
import {optativeScienceRequirement,optativeScienceVerbs,optativeScienceEvidence,adaptOptativeScienceTask,selectOptativeScienceTopics,scientificAlternativeBranches,type OptativeScienceEvidenceTask} from './secondary-optative-science-evidence'

export type OptativeScienceTopic=CommonScienceTopic&{sourceRecordIds:string[]}
export type OptativeScienceModule={id:string;grade:number;cycle:number;subjectCode:string;subjectName:string;optativeExitName:string;modalityCodes:string[];sourceScopeId:string;pdfPages:number[];policy:string;topics:OptativeScienceTopic[]}
export type OptativeScienceTask=OptativeScienceEvidenceTask&{module:OptativeScienceModule}
export const optativeScienceModules:OptativeScienceModule[]=[optativeCtFour]
export function resolveOptativeScienceTask(title:string,description:string,context?:InstrumentAcademicContext|null,modules:OptativeScienceModule[]=optativeScienceModules):OptativeScienceTask|null{
 if(context?.level!=='SECONDARY'||context.cycle!=null&&context.cycle!==2)return null
 const module=modules.find(m=>m.grade===context.grade&&m.subjectCode===context.subjectCode.trim().toUpperCase()&&m.modalityCodes.includes(context.modalityCode??'')&&(!context.optativeExitName||context.optativeExitName===m.optativeExitName))
 if(!module)return null
 const requirement=optativeScienceRequirement(description),options={additionalVerbs:optativeScienceVerbs,selectTopics:selectOptativeScienceTopics}
 const task=resolveScienceTaskForTopics(title,requirement,module.grade,module.topics,options)
 if(!task)return null
 const branches=scientificAlternativeBranches(requirement)
 let inherited=task.actions[0].topics
 const alternatives=branches.length>1?branches.map(branch=>{
  const own=selectOptativeScienceTopics(branch.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase(),module.topics)
  if(own.length)inherited=own
  const fallback=inherited
  return resolveScienceTaskForTopics(title,branch,module.grade,module.topics,{...options,selectTopics:(text,topics)=>{const selected=selectOptativeScienceTopics(text,topics);return selected.length?selected:fallback}})
 }):[]
 return{...adaptOptativeScienceTask(task),...(alternatives.length&&alternatives.every((t):t is CommonScienceTask=>t!==null)?{alternatives}:{}),module}
}
export const optativeScienceCriteria=(task:OptativeScienceTask)=>optativeScienceEvidence(task).map(r=>({...r,templateId:r.templateId.replace(`nat-${task.grade}-`,`opt-ct-${task.grade}-`)}))
const selectionTask=(task:OptativeScienceTask):CommonScienceTask=>({...task,actions:task.actions.map(a=>({...a,text:a.text.replace(/\bregistros?\b/g,'datos disponibles')}))})
export const optativeScienceSelections=(task:OptativeScienceTask,description:string)=>commonScienceSelections(selectionTask(task),description)
export const adaptOptativeScienceScale=(proposal:InstrumentRecommendation,description:string,task:OptativeScienceTask)=>adaptScienceScale(proposal,task.actions.some(a=>/^\s*(?:observ\w*|registr(?:a|an|ar|e|en))\b/.test(a.text))?description:description.replace(/\bregistros?\b/gi,'datos disponibles'))
