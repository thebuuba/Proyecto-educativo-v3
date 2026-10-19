import type {InstrumentAcademicContext} from './secondary-science'
import type {SecondaryLanguageTopic,TopicDimension} from './secondary-topic-types'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {LanguageFeature} from './language-feature-criteria'
import {composeLanguageCriteria} from './secondary-language-grade-three-complete'
import {languageWritingProcedures} from './language-procedure-criteria'
import {detectTopicActivity} from './secondary-language-topics'
import {withoutResources} from './evaluation-task-text'
import {adaptLanguageScale} from './language-scale'
import type {InstrumentRecommendation} from './instrument-recommendation'
import {optativeHlmLenFour} from './secondary-optative-hlm-len-4'
import {optativeHlmLenFive} from './secondary-optative-hlm-len-5'
import {optativeHlmLenSix} from './secondary-optative-hlm-len-6'

type OptativeFeature=LanguageFeature&{sourceRecordIds:string[];analysisLevels?:ContextualTopicCriterion['progressionLevels']}
export type OptativeLanguageGenre={id:string;label:string;match:string;sourceRecordIds:string[];pdfPages:number[];profile:{genre:string;target:string;plan:string};planningComponents?:[string,string][];features:OptativeFeature[];dimensions:TopicDimension[]}
export type OptativeLanguageModule={id:string;grade:number;subjectCode:string;subjectName:string;optativeExitName:string;modalityCodes:string[];sourceScopeId:string;pdfPages:number[];topics:OptativeLanguageGenre[]}
type OptativeAction={text:string;genre:OptativeLanguageGenre;activityType:string;plan:boolean;revision:boolean}
export type OptativeLanguageTask={module:OptativeLanguageModule;actions:OptativeAction[];activityType:string;technique:string}
export const optativeLanguageModules=[optativeHlmLenFour,optativeHlmLenFive,optativeHlmLenSix]
const normalize=(value:string)=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const verbs='(?![a-z]*(?:ando|iendo)\\b)(?:analiz|interpret|explic|describ|identific|clasific|compar|contrast|escuch|anticip|le(?:e|er)|infier|infer|parafras|resum|recit|declam|narr|cuent|contar|redact|escrib|cre(?:a(?!cion)|e)|compon|elabor|planific|revis|corrig|corrij|investig|present|expon|evalu|debat|subray|disen(?:a|en))[a-z]*'
function requestedText(value:string){
 return normalize(withoutResources(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ')))
  .replace(new RegExp(`\\b(?:no|sin)\\b[^.;\\n]*?(?=[.;\\n]|\\s+(?:y|pero)\\s+${verbs}\\b|$)`,'g'),'').trim()
}
function languageTopic(genre:OptativeLanguageGenre,grade:number,subjectCode:string):SecondaryLanguageTopic{
 return{id:genre.id,grade,subjectCode,aliases:[genre.label],source:{topicElementId:genre.sourceRecordIds[0],pdfPages:genre.pdfPages,printedPages:genre.pdfPages.map(p=>p-1)},dimensions:genre.dimensions}
}
export function resolveOptativeLanguageTask(title:string,description:string,context?:InstrumentAcademicContext|null,modules:OptativeLanguageModule[]=optativeLanguageModules):OptativeLanguageTask|null{
 if(context?.level!=='SECONDARY'||!context.modalityCode)return null
 const code=context.subjectCode.trim().toUpperCase(),module=modules.find(m=>m.grade===context.grade&&m.modalityCodes.includes(context.modalityCode!)
  &&(!context.optativeExitName||context.optativeExitName===m.optativeExitName)
  &&(m.subjectCode===code||!/^(?:OPT-|LEN$|ING$|FRA$|MAT$|NAT|SOC$|ART$|EFI$|FHR$)/.test(code)&&context.optativeExitName===m.optativeExitName&&normalize(context.subjectName??'')===normalize(m.subjectName)))
 if(!module)return null
 const text=requestedText(description||title),clauses=text.split(new RegExp(`[.;\\n]+|\\s+(?:y|luego|despues|pero)\\s+(?=${verbs}\\b)`)).map(s=>s.trim().replace(/^(?:y|luego|despues|pero)\s+/, '')).filter(Boolean),actions:OptativeAction[]=[]
 for(const clause of clauses){
  const explicit=module.topics.find(t=>new RegExp(t.match).test(clause)),prior=actions.at(-1)
  const start=clause.search(new RegExp(`\\b${verbs}\\b`))
  if(start<0){if(prior)prior.text+='. '+clause;continue}
  const text=clause.slice(start)
  if(prior?.revision&&/^present[a-z]*\b.*(?:cambios|version revisada)/.test(text)){prior.text+='. '+text;continue}
  const genre=explicit??prior?.genre;if(!genre)continue
  const plan=/^planific|^(?:elabor|disen)[a-z]*\s+(?:un\s+)?plan\b/.test(text),revision=/^(?:revis|corrig|corrij)/.test(text)
  const activityType=plan||revision||/^disen(?:a|en)/.test(text)?'WRITTEN_PRODUCTION':detectTopicActivity('',text,languageTopic(genre,module.grade,module.subjectCode))
  actions.push({text,genre,activityType,plan,revision})
 }
 if(!actions.length)return null
 const activityType=actions[0].activityType
 return{module,actions,activityType,technique:activityType==='ORAL_PRESENTATION'?'presentacion':activityType==='DEBATE'?'debate':'analisis-producciones'}
}
const recognitionOnly=(action:OptativeAction)=>action.activityType==='ANALYSIS'&&/^(?:identific|subray)/.test(action.text)&&!/\b(?:explic|justific|analiz|interpret|contrast)[a-z]*\b|funcion|efecto/.test(action.text)
function selectedFeatures(genre:OptativeLanguageGenre,text:string,separate=false):LanguageFeature[]{
 return genre.features.filter(f=>new RegExp(f.match).test(text)&&!(f.id==='novel-characters'&&/qu(?:e|ien(?:es)?) personajes hablan/.test(text))).flatMap(f=>{
  const selected=(f.terms??[]).flatMap(([pattern,name])=>{const m=new RegExp(pattern).exec(text);return m?[{name,index:m.index,end:m.index+m[0].length}]:[]}).sort((a,b)=>a.index-b.index)
  const span=selected.length>1?text.slice(selected[0].index,selected.at(-1)!.end):''
  const alternative=selected.length>1&&/\bo\b/.test(span)
  const name=alternative?'la opción elegida entre '+selected.map(s=>s.name).join(' o '):selected.length?selected.map(s=>s.name).join(' y '):f.name
  // La composición existente recibe los términos ya delimitados por esta consigna optativa.
  return (separate||f.id==='ad-resources')&&selected.length&&!alternative?selected.map(s=>({...f,id:f.id+'-'+normalize(s.name).replaceAll(' ','-'),name:s.name,terms:undefined})):[{...f,name,terms:undefined}]
 })
}
export function optativeLanguageCriteria(task:OptativeLanguageTask):ContextualTopicCriterion[]{
 const result=task.actions.flatMap<ContextualTopicCriterion>(action=>{
  const {genre,text,activityType}=action,prefix=`${task.module.subjectCode.toLowerCase()}-${genre.id}-${activityType.toLowerCase()}`,base=`len-${task.module.grade}-${genre.id}`
  const recognition=recognitionOnly(action),features=/^anticip/.test(text)?[]:selectedFeatures(genre,text,recognition),topic=languageTopic(genre,task.module.grade,task.module.subjectCode),focused=/\b(?:solo|unicamente|exclusivamente)\b/.test(text)
  if(recognition&&features.length)return features.map(f=>({templateId:prefix+'-feature-'+f.id,title:f.name.charAt(0).toUpperCase()+f.name.slice(1),observable:'Localiza '+f.name+' en el texto proporcionado seleccionando los ejemplos que corresponden al recurso solicitado.',weight:3,progressionLevels:[
   'Localiza '+f.name+' en el texto proporcionado seleccionando los ejemplos que corresponden al recurso solicitado.',
   'Reconoce el recurso solicitado; una selección del texto necesita ajustarse para distinguirlo de otro recurso.',
   'Localiza algún ejemplo pertinente, pero mezcla fragmentos que corresponden a recursos diferentes.',
   'Selecciona fragmentos del texto que no corresponden al recurso solicitado.',
   'No localiza ejemplos reconocibles del recurso solicitado en el texto disponible.',
  ]}))
  if(action.plan){
   const components=(genre.planningComponents??(genre.id==='poesia-romantica'?[['intencion','la intención'],['tema','el tema'],['estrofa|forma','la forma elegida']]:[['sucesos|acciones','los sucesos'],['personajes','los personajes'],['lugar','el lugar'],['tiempo','el tiempo']])).filter(([pattern])=>new RegExp(pattern).test(text)).map(([,label])=>label)
   if(genre.id==='epopeya'&&/\b(?:verso|prosa)\b/.test(text))components.push(/\bverso\b/.test(text)&&/\bprosa\b/.test(text)?'la forma elegida entre verso o prosa':/\bverso\b/.test(text)?'la forma en verso':'la forma en prosa')
   const plan=components.length?'la relación entre '+components.join(' y '):genre.planningComponents?genre.profile.plan:'los componentes expresamente pedidos y sus relaciones'
   return languageWritingProcedures(text,base,genre.profile.genre,plan).map(r=>({...r,templateId:r.templateId.replace(base,prefix)}))
  }
  if(action.revision||focused||features.length&&['ANALYSIS','COMPARISON'].includes(activityType))topic.dimensions=topic.dimensions.filter(d=>d.id==='meaning'&&/intencion/.test(text)&&!action.revision)
  const profile={...genre.profile,revisionRequested:action.revision,verifyPrediction:/\bcomprueb[a-z]*\b/.test(text),oralCreation:activityType==='ORAL_PRESENTATION'&&(/^(?:narr|cuent|contar|relat)/.test(text)||/^(?:present|expon)[a-z]*\b.*\bque (?:has|han|hemos) (?:preparado|redactado|creado)\b/.test(text))}
  let rows=composeLanguageCriteria(topic,activityType,text,profile,features)
  if(activityType==='ANALYSIS')rows=rows.map(r=>{
   const source=genre.features.find(f=>f.analysisLevels&&r.templateId===base+'-feature-'+f.id),selected=features.find(f=>f.id===source?.id)
   if(!source?.analysisLevels||!selected)return r
   const levels=source.analysisLevels.map(level=>level.replaceAll('{target}',selected.name)) as ContextualTopicCriterion['progressionLevels']
   return{...r,observable:levels[0],progressionLevels:levels}
  })
  const explicitIntention=genre.id==='poesia-romantica'&&/intencion/.test(text)&&!action.revision&&activityType!=='ORAL_PRESENTATION'
  if(explicitIntention&&!rows.some(r=>r.templateId===base+'-meaning')){
   const d=genre.dimensions.find(d=>d.id==='meaning')!
   const observable=activityType==='COMPARISON'?d.comparison:activityType==='WRITTEN_PRODUCTION'?d.production:d.analysis
   rows.unshift({templateId:base+'-meaning',title:d.title,observable,progressionLevels:[observable,...d.evidence],weight:d.weight})
  }
  if(explicitIntention)rows=rows.filter(r=>!r.templateId.endsWith('-feature-poetry-themes'))
  if(action.revision&&/\bortograf[a-z]*\b/.test(text)&&!features.length&&!/\b(?:contenido|organizacion|secuencias?|tesis|argumentos?|vocabulario|lexico|puntuacion|formato|citas|fuentes|ejemplos)\b/.test(text))rows=rows.map(r=>r.templateId.endsWith('-process-revision')?{...r,observable:'Muestra los cambios que corrigen los problemas ortográficos solicitados entre el borrador y la versión revisada, conservando el sentido del texto.',progressionLevels:[
   'Las correcciones resuelven los problemas ortográficos señalados y conservan el sentido del texto.',
   'Corrige los problemas ortográficos principales; queda un caso señalado sin resolver.',
   'Corrige algunos casos, pero mantiene varios problemas ortográficos señalados.',
   'Las modificaciones introducen errores ortográficos o cambian el sentido del texto.',
   'No aporta evidencia de las correcciones ortográficas solicitadas.',
  ]}:r)
  if(activityType==='WRITTEN_PRODUCTION'||profile.oralCreation)rows=rows.map(r=>({...r,progressionLevels:r.progressionLevels.map(s=>s==='Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.'?'Presenta elementos pertinentes, pero una relación necesaria para seguir el desarrollo del texto queda sin construir.':s) as ContextualTopicCriterion['progressionLevels']}))
  if(rows.some(r=>r.templateId.endsWith('-procedure-vocabulary')))rows=rows.filter(r=>!r.templateId.endsWith('-feature-poetry-vocabulary'))
  const represented=new Set(rows.filter(r=>r.templateId.includes('-feature-')).map(r=>r.templateId.split('-feature-')[1]))
  const pairs:Record<string,string[]>={plot:['novel-plot'],characters:['novel-characters'],narrator:['narrator'],meaning:['poetry-themes']}
  rows=rows.filter(r=>!genre.dimensions.some(d=>r.templateId===base+'-'+d.id&&represented.has(d.id))&&!Object.entries(pairs).some(([id,fs])=>r.templateId===base+'-'+id&&fs.some(f=>represented.has(f))))
  return rows.map(r=>({...r,templateId:r.templateId.replace(base,prefix)}))
 })
 return result.filter((r,i)=>result.findIndex(other=>other.templateId===r.templateId)===i)
}
export function optativeLanguageSelections(task:OptativeLanguageTask){
 return{suggestedInstrumentType:task.actions.every(recognitionOnly)?'lista-cotejo' as const:'rubrica' as const,suggestedEvaluationTechnique:task.technique}
}
export function adaptOptativeLanguageScale(proposal:InstrumentRecommendation):InstrumentRecommendation{
 if(proposal.instrumentType!=='escala')return proposal
 return{...adaptLanguageScale(proposal,''),criteria:proposal.criteria}
}
