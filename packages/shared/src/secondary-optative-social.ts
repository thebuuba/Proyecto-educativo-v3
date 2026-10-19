import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {SocialTopic} from './secondary-social-grade-1'
import {resolveSocialTaskForTopics,commonSocialCriteria,commonSocialSelections,type CommonSocialTask} from './secondary-social'
import {optativeHcsSocFour} from './secondary-optative-hcs-soc-4'
import {optativeHcsSocFive} from './secondary-optative-hcs-soc-5'
import {demographyTask,demographyCriteria} from './secondary-optative-demography-evidence'

type SocialFacet={label:string;match:string;procedure?:string}
export type OptativeSocialTopic=SocialTopic&{sourceRecordIds:string[];priority:number;facets?:SocialFacet[];applicationNote?:string}
type Evidence={title:string;levels:ContextualTopicCriterion['progressionLevels'];weight:number}
export type OptativeSocialModule={id:string;grade:number;subjectCode:string;subjectName:string;optativeExitName:string;modalityCodes:string[];sourceScopeId:string;pdfPages:number[];topics:OptativeSocialTopic[];evidence:Record<string,Evidence>}
export type OptativeSocialTask=CommonSocialTask&{module:OptativeSocialModule}
export const optativeSocialModules=[optativeHcsSocFour,optativeHcsSocFive]
const additionalVerbs='(?:resum(?:e|en|ir|ira|iran|a|an)|revis(?:a|an|ar|ara|aran|e|en)|corrig(?:e|en)|corrij(?:a|an)|atribuy(?:e|en|a|an)|demuestr(?:a|an|e|en)|aplic(?:a|an|ar|ara|aran|e|en))'
function selectTopics(text:string,provided:SocialTopic[]):SocialTopic[]{
 // «Científico» califica el género del ensayo; su objeto sigue siendo el tema pedido.
 const subject=text.replace(/\bensayo cientifico\b/g,'ensayo')
 let matched=(provided as OptativeSocialTopic[]).filter(t=>new RegExp(t.match).test(subject))
 const demography=provided[0]?.grade===5
 if(demography){
  if(matched.some(t=>t.id==='human-geography')&&/autores.*aportes/.test(text))matched=matched.filter(t=>t.id!=='demography')
  if(matched.some(t=>t.id==='dominican-regions')&&!/macroregion[,\s]+region|macroregiones.*regiones.*provincias/.test(text))matched=matched.filter(t=>t.id!=='territorial-division')
  if(matched.some(t=>t.id==='economic-indicators')&&!/sistema tributario/.test(text))matched=matched.filter(t=>t.id!=='tax-system')
  if(matched.some(t=>t.id==='intercultural-convivence'))matched=matched.filter(t=>t.id!=='peace-dialogue')
 }
 if(/origenes de (?:la )?filosofia/.test(subject)&&/admiracion|\bduda\b/.test(subject))matched=matched.filter(t=>t.id==='philosophy-foundations')
 const priority=Math.max(...matched.map(t=>t.priority))
 return matched.filter(t=>demography?priority===1||t.priority>1:t.priority===priority).map(t=>{
  let facets=(t.facets??[]).map(f=>({...f,index:text.search(new RegExp(f.match))})).filter(f=>f.index>=0).sort((a,b)=>a.index-b.index)
  if(t.id==='philosophy-foundations'&&facets.some(f=>f.match==='admiracion.*duda'))facets=facets.filter(f=>f.match==='admiracion.*duda')
  if(t.id==='ethics'&&facets.some(f=>!['la ética','la moral'].includes(f.label)))facets=facets.filter(f=>!['la ética','la moral'].includes(f.label))
  if(!facets.length)return t
  if(t.id==='territorial-division'&&facets.some(f=>f.match==='colonial.*(?:actual|periodo actual)'))facets=facets.filter(f=>f.match!=='epoca colonial|division territorial colonial')
  if(t.id==='natural-human-resources'&&facets.some(f=>f.match==='mapas de poblacion y zonas protegidas'))facets=facets.filter(f=>f.match==='mapas de poblacion y zonas protegidas')
  if(t.id==='waste'&&facets.some(f=>f.label.includes('salud')))facets=facets.filter(f=>f.label.includes('salud'))
  const alternative=facets.length>1&&/\bo\b/.test(text.slice(facets[0].index,facets.at(-1)!.index))
  let label=facets.length===1?facets[0].label:alternative?'la alternativa elegida entre '+facets.map(f=>f.label).join(' o '):facets.map(f=>f.label).join(' y ')
  if(demography&&t.id==='intercultural-convivence'){
   if(/cultura de paz/.test(text))label+=' en relación con la cultura de paz'
   if(/respeto al entorno/.test(text))label+=' y el respeto al entorno'
  }
  if(t.id==='knowledge'&&/critic[a-z]* de kant al/.test(text))label='la crítica de Kant '+facets.filter(f=>f.label!=='la crítica de Kant').map(f=>f.label.startsWith('el ')?'al '+f.label.slice(3):'a '+f.label).join(', ').replace(/, ([^,]+)$/,' y $1')
  if(t.id==='political-power'&&!/\bsolucion\b/.test(text))label=(/autoritari/.test(text)&&/democratic/.test(text)?'los planteamientos autoritarios y democráticos del poder de ':'las concepciones del poder de ')+label
  if(t.id==='globalization'){
   const related=(provided as OptativeSocialTopic[]).filter(t=>['culture','environment-quality'].includes(t.id)).flatMap(t=>t.facets??[]).filter(f=>new RegExp(f.match).test(text))
   if(related.length)label+=' en relación con '+related.map(f=>f.label).join(' y ')
  }
  return{...t,label,relation:t.relation.replaceAll('{target}',label),applicationNote:facets.length===1?facets[0].procedure:undefined}
 })
}
const head=(text:string)=>text.replace(/^(?:en grupos|en parejas|de forma individual|los estudiantes|cada estudiante)[,\s]*/,'')
function requestedType(task:CommonSocialTask):string{
 const first=head(task.actions[0]?.text??'')
 if(/^(?:revis|corrig|corrij)/.test(first))return'WRITTEN_PRODUCTION'
 if(/^demuestr/.test(first)||/^aplic/.test(first)&&task.actions[0]?.topics.some(t=>t.id==='philosophical-methods'))return'PERFORMANCE'
 if(/^atribuy|^seleccion/.test(first))return'ANALYSIS'
 if(/\b(?:ensayo|resumen|informe)\b[^.;]*\bo\b[^.;]*\b(?:ensayo|resumen|informe)\b/.test(first))return'PROJECT'
 if(/^resum/.test(first)||/^(?:elabor|redact)[a-z]*\s+(?:un\s+)?(?:resumen|informe)\b/.test(first)&&!/\bo\b[^.;]*\b(?:ensayo|resumen|informe)\b/.test(first))return'REPORT'
 if(/dialogo (?:mayeutico|socratico)/.test(first)&&/\b(?:realiz|particip)[a-z]*\b/.test(first))return'ORAL_INTERACTION'
 return task.activityType
}
export function resolveOptativeSocialTask(title:string,description:string,context?:InstrumentAcademicContext|null,modules:OptativeSocialModule[]=optativeSocialModules):OptativeSocialTask|null{
 if(context?.level!=='SECONDARY'||context.cycle!=null&&context.cycle!==2)return null
 const module=modules.find(m=>m.grade===context.grade&&m.subjectCode===context.subjectCode.trim().toUpperCase()&&m.optativeExitName===context.optativeExitName&&context.modalityCode!=null&&m.modalityCodes.includes(context.modalityCode))
 if(!module)return null
 const demography=module.subjectCode==='OPT-HCS-SOC-5'
 // «No degradables» names a material category; it does not negate the requested task.
 const protect=(text:string)=>demography?text.replace(/\bno degradables\b/gi,'nodegradables'):text
 const task=resolveSocialTaskForTopics(protect(title),protect(description),module.grade,module.topics,{selectTopics,additionalVerbs:demography?'(?:'+additionalVerbs+'|defin(?:e|en|ir|a|an)|disen(?:a|an|ar|e|en))':additionalVerbs})
 if(!task)return null
 if(module.subjectCode==='OPT-HCS-SOC-5'){
  task.actions=task.actions.map(action=>({...action,text:action.text.replace(/\bnodegradables\b/g,'no degradables')}))
  const own=demographyTask(task),technique=own.activityType==='DEBATE'?'debate':own.activityType==='ORAL_PRESENTATION'?'presentacion':own.activityType==='PERFORMANCE'?'observacion-sistematica':'analisis-producciones'
  own.actions=own.actions.map(action=>({...action,topics:selectTopics(action.text,module.topics).length?selectTopics(action.text,module.topics):action.topics}))
  return{...own,technique,module}
 }
 const actions:CommonSocialTask['actions']=[]
 for(const action of task.actions){const previous=actions.at(-1),text=head(action.text)
  const linked=previous&&(
   /^argumentos\b/.test(text)
   ||/\bfuentes\b/.test(previous.text)&&/^justifi[a-z]*\s+(?:su|la)\s+(?:eleccion|seleccion|respaldo)/.test(text)
   ||/dialogo (?:mayeutico|socratico)/.test(previous.text)&&(/^(?:revis|respond)[a-z]*\b/.test(text))
   ||/\binvestig[a-z]*\b/.test(previous.text)&&/^expli[a-z]* los hallazgos\b/.test(text)
   ||/\bsolucion\b/.test(previous.text)&&/^justifi[a-z]*\b/.test(text)
  )
  if(linked){previous.text+=' y '+text;previous.topics=selectTopics(previous.text,module.topics);continue}
  actions.push(action)
 }
 const activityType=requestedType({...task,actions}),technique=activityType==='DEBATE'?'debate':activityType==='ORAL_PRESENTATION'?'presentacion':activityType==='ORAL_INTERACTION'?'observacion-directa':activityType==='PERFORMANCE'?'observacion-sistematica':'analisis-producciones'
 return{...task,actions,activityType,technique,module}
}
function authored(module:OptativeSocialModule,topic:SocialTopic,key:string,values:Record<string,string>={}):ContextualTopicCriterion{
 const evidence=module.evidence[key]
 if(!evidence)throw Error('Missing optative social evidence: '+key)
 const fields={label:topic.label,relation:topic.relation.replaceAll('{target}',topic.label),...values},render=(s:string)=>s.replace(/\{([a-z]+)\}/g,(_,name:string)=>fields[name as keyof typeof fields]??'{'+name+'}').replace(/\bde el\b/g,'del').replace(/\ba el\b/g,'al')
 const levels=evidence.levels.map(render) as ContextualTopicCriterion['progressionLevels']
 if(key==='method-application'&&(topic as OptativeSocialTopic).applicationNote)levels[0]+=' '+(topic as OptativeSocialTopic).applicationNote
 return{templateId:module.subjectCode.toLowerCase()+'-'+topic.id+'-'+key,title:render(evidence.title),observable:levels[0],progressionLevels:levels,weight:evidence.weight}
}
export function optativeSocialCriteria(task:OptativeSocialTask):ContextualTopicCriterion[]{
 const {module}=task
 if(module.subjectCode==='OPT-HCS-SOC-5')return demographyCriteria(task,(topic,key,values)=>authored(module,topic,key,values))
 const rows=task.actions.flatMap(action=>{
  const text=head(action.text),one={...task,actions:[action]},topic=action.topics[0],make=(key:string,values?:Record<string,string>)=>authored(module,topic,key,values)
  if(!topic)return[]
  if(/^(?:revis|corrig|corrij)/.test(text)){
   const target=/atribucion|autoria/.test(text)?'la atribución de las ideas a sus autores':/tesis/.test(text)&&/razones|argumentos/.test(text)?'la relación entre la tesis y las razones':'las relaciones filosóficas expresamente señaladas'
   return[make('revision',{target})]
  }
  if(/^atribuy/.test(text))return[make('attribution')]
  if((/^seleccion/.test(text)||/^identific/.test(text)&&/fuentes/.test(text))&&/fuentes/.test(text)){
   const selected=[make('source-selection')]
   if(/justific|confiab|credib|autoria|respaldo/.test(text))selected.push(make('source-credibility'))
   return selected
  }
  if(/dialogo (?:mayeutico|socratico)/.test(text)&&task.activityType==='ORAL_INTERACTION')return[make('dialogue-questions'),make('dialogue-response')]
  if(/^demuestr/.test(text)||/^aplic/.test(text)&&topic.id==='philosophical-methods')return[make('method-application')]
  if(/\b(?:plante|propon|propong)[a-z]*\b/.test(text)&&/\bsolucion\b/.test(text))return[make('proposal')]
  if(/^resum/.test(text))return[make('summary')]
  if(/^(?:elabor|redact)[a-z]*\s+(?:un\s+)?informe\b/.test(text))return[make('report')]
  if(/\b(?:ensayo|resumen|informe)\b[^.;]*\bo\b[^.;]*\b(?:ensayo|resumen|informe)\b/.test(text)){
   const products=[...new Set([...text.matchAll(/\b(?:ensayo|resumen|informe)\b/g)].map(m=>m[0]))]
   const branches=products.map(name=>name==='ensayo'?[make('thesis'),make('reason'),make('organization')]:[make(name==='resumen'?'summary':'report')])
   const levels=[0,1,2,3,4].map(i=>'En la alternativa elegida: '+branches.map((branch,n)=>products[n]+': '+branch.map(r=>r.progressionLevels[i]).join(' ')).join(' O BIEN: ')) as ContextualTopicCriterion['progressionLevels']
   return[{...branches[0][0],templateId:module.subjectCode.toLowerCase()+'-'+topic.id+'-alternative-product',title:'Producto elegido entre '+products.join(' o '),observable:levels[0],progressionLevels:levels}]
  }
  if(/\bensayo\b/.test(text)&&/\b(?:redact|elabor|escrib)[a-z]*\b/.test(text))return[make('thesis'),make('reason'),make('organization')]
  const common=commonSocialCriteria(one)
  const rewritten=common.map(r=>{
   const own=action.topics.find(t=>r.templateId.startsWith('soc-'+task.grade+'-'+t.id+'-'))??topic
   const kind=r.templateId.slice(('soc-'+task.grade+'-'+own.id+'-').length)
   const key=module.evidence[kind]?kind:kind==='summary-content'?'summary':kind==='research-content'?'research':kind==='report-content'?'report':null
   return key?authored(module,own,key):{...r,templateId:r.templateId.replace('soc-'+task.grade+'-',module.subjectCode.toLowerCase()+'-')}
  })
  if(task.activityType==='ORAL_PRESENTATION'&&rewritten.some(r=>r.templateId.endsWith('-oral'))&&!rewritten.some(r=>r.templateId.endsWith('-interpretation')))rewritten.unshift(make('interpretation'))
  if(/\bdebat[a-z]*\b/.test(text)&&/respuestas? a (?:las )?objeciones/.test(text)&&!rewritten.some(r=>r.templateId.endsWith('-response')))rewritten.push(make('response'))
  return rewritten.length?rewritten:[make('interpretation')]
 })
 return rows.filter((r,i)=>rows.findIndex(other=>other.templateId===r.templateId&&other.observable===r.observable)===i)
}
export function optativeSocialSelections(task:OptativeSocialTask){
 return commonSocialSelections(task,task.actions.map(a=>a.text).join('. '))
}
