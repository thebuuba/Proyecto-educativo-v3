import type {CommonSocialTask} from './secondary-social'
import type {SocialTopic} from './secondary-social-grade-1'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {OptativeSocialTopic} from './secondary-optative-social'

const head=(text:string)=>text.replace(/^(?:en grupos|en parejas|de forma individual|los estudiantes|cada estudiante)[,\s]*/,'').trim()
const startsAction=/^(?:analiz|analic|interpret|expli|compar|contrast|identifi|describ|orden|elabor|constru|redact|investig|consult|debat|argument|justifi|propon|propong|present|expon|registr|represent|simul|formul|realiz|respond|particip|observ|discut|evalu|seleccion|atribuy|revis|corrig|corrij|disen|cumpl|conserv|sosten)[a-z]*\b/
const creates=/^(?:elabor|redact|escrib|disen|formul|propon|propong|realiz|present|cre(?:a|e))[a-z]*\b/
/** One requested object can contain several related concepts without duplicating each product. */
export function citizenshipTopics(text:string,provided:SocialTopic[]):SocialTopic[]{
 let matched=(provided as OptativeSocialTopic[]).filter(t=>new RegExp(t.match).test(text))
 const normalize=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase(),object=text.match(/^analiz[a-z]* (.*?) en el texto proporcionado/),exact=object&&matched.find(t=>object[1]===normalize(t.label))
 if(exact)matched=[exact]
 else {const specific=matched.some(t=>t.priority>1);matched=matched.filter(t=>t.id!=='democracy'||!specific||/\bdemocracia\b(?!\s+(?:representativa|participativa))/.test(text)).filter(t=>t.id!=='citizenship'||!specific||/\bciudadania\b(?!\s+(?:global|democratica|responsable))/.test(text))}
 if(/convivencia vial/.test(text)&&!/cultura de paz|diversidad|intercultur|multicultur/.test(text))matched=matched.filter(t=>t.id!=='peace')
 if(matched.some(t=>t.id==='national-symbols'))matched=matched.filter(t=>t.id!=='civic-participation')
 const reliable=matched.find(t=>t.id==='reliable-sources'),subjects=matched.filter(t=>t.id!=='reliable-sources')
 const selected=subjects.length?subjects:matched
 if(!selected.length)return[]
 const labels=selected.flatMap(t=>{
  const facets=(t.facets??[]).filter(f=>new RegExp(f.match).test(text))
  return facets.length?facets.map(f=>f.label):[t.label]
 })
 const first=reliable??selected[0],label=[...new Set(labels)].join(' y ')
 return[{...first,label,relation:first.relation.replaceAll('{target}',label),sourceRecordIds:[...new Set(matched.flatMap(t=>t.sourceRecordIds))]} as OptativeSocialTopic]
}
function kind(text:string):string{
 if(/^observ/.test(text)&&/frecuencia/.test(text))return'OBSERVATION'
 if(/^(?:revis|corrig|corrij)/.test(text))return'WRITTEN_PRODUCTION'
 if(/^atribuy|^seleccion|^identifi|^analiz|^expli|^argument/.test(text))return'ANALYSIS'
 if(/^compar/.test(text))return'COMPARISON'
 if(/^debat/.test(text))return'DEBATE'
 if(/^discut/.test(text)||/mesa redonda|conversatorio|dialogo/.test(text)&&/^particip|^realiz/.test(text))return'ORAL_INTERACTION'
 if(/^expon|^present[a-z]* oralmente/.test(text))return'ORAL_PRESENTATION'
 if(/^investig|^consult/.test(text))return'RESEARCH'
 if(/^registr/.test(text))return'REPORT'
 if(/simulacion/.test(text)&&/^realiz|^particip|^simul/.test(text))return'PERFORMANCE'
 if(creates.test(text)){
  if(/\b(?:ensayo|informe|brochure|campana)\b[^.;]*\bo\b[^.;]*\b(?:ensayo|informe|brochure|campana)\b/.test(text))return'PROJECT'
  if(/borrador|periodico|articulo|memoria/.test(text.split(/\bsobre\b/)[0])||/^redact[a-z]*\b[^.;]*\bmensaje\b/.test(text))return'WRITTEN_PRODUCTION'
  if(/ensayo/.test(text))return'ESSAY'
  if(/informe/.test(text))return'REPORT'
  return'PROJECT'
 }
 return'ANALYSIS'
}
/** Keep requested actions; shared parsing removes resources and negative requirements. */
export function citizenshipTask(task:CommonSocialTask):CommonSocialTask{
 const actions:CommonSocialTask['actions']=[]
 for(const original of task.actions){const text=head(original.text),prior=actions.at(-1)
  if(prior&&(!startsAction.test(text)&&!creates.test(text)||/^justifi/.test(text)&&/^seleccion|^identifi/.test(prior.text)||/^(?:corrig|corrij)/.test(text)&&/^revis/.test(prior.text)||/^(?:cumpl|conserv|registr[a-z]* la decision|sosten)/.test(text)||/^registr[a-z]* los hallazgos/.test(text))){prior.text+=' y '+text;continue}
  actions.push({...original,text})
 }
 const first=kind(actions[0]?.text??''),types=actions.map(a=>kind(a.text)),activityType=first==='ANALYSIS'&&types.includes('PROJECT')?'PROJECT':first
 const technique=activityType==='DEBATE'?'debate':activityType==='ORAL_PRESENTATION'?'presentacion':activityType==='ORAL_INTERACTION'?'observacion-directa':['PERFORMANCE','OBSERVATION'].includes(activityType)?'observacion-sistematica':'analisis-producciones'
 return{...task,actions,activityType,technique}
}
export function citizenshipCriteria(task:CommonSocialTask,make:(topic:SocialTopic,key:string,values?:Record<string,string>)=>ContextualTopicCriterion):ContextualTopicCriterion[]{
 const rows=task.actions.flatMap(action=>action.topics.flatMap(topic=>{
  const text=head(action.text),row=(key:string,values?:Record<string,string>)=>make(topic,key,values)
  const style=/\bpauta apa\b/.test(text)?'la pauta APA proporcionada':/\bpauta mla\b/.test(text)?'la pauta MLA proporcionada':/\bpauta lm\b/.test(text)?'la pauta LM proporcionada':'la pauta de atribución dada o elegida',attribution=()=>row('attribution',{style})
  if(/^observ/.test(text)&&/frecuencia/.test(text))return[row('frequency')]
  if(/^(?:revis|corrig|corrij)/.test(text))return[row('revision',{target:/atribucion/.test(text)?'la atribución de las fuentes':/pregunta.*pasos/.test(text)?'la relación entre la pregunta y los pasos':'las relaciones expresamente señaladas en la pauta'})]
  if(/^atribuy/.test(text))return[attribution()]
  if(/^seleccion/.test(text)||/^identifi/.test(text)&&/fuentes/.test(text)){
   if(/estructura.*periodico/.test(text))return[row('newspaper-structure')]
   if(/pasos/.test(text))return[row('project-steps')]
   return[row('source-selection'),...(/justific|justifiq|autoria|respaldo/.test(text)?[row('source-credibility')]:[])]
  }
  if(/^orden/.test(text)&&/pasos|finalidad/.test(text))return[row('project-steps')]
  if(/^registr/.test(text))return[row('data-record')]
  if(/^investig|^consult/.test(text))return[row('research'),...(/atribuy|\bpauta (?:apa|mla|lm)\b/.test(text)?[attribution()]:[])]
  if(/^(?:realiz|particip|simul)[a-z]*\b/.test(text)&&/simulacion/.test(text)){
   if(/bandera|himno/.test(text))return[row('ritual-procedure')]
   if(/electoral/.test(text))return[row('electoral-procedure'),...(/rol/.test(text)?[row('role-contribution')]:[])]
   if(/decision democratica/.test(text))return[row('decision-procedure')]
   return[row('role-contribution')]
  }
  if(/^debat/.test(text))return[row('reason'),...(/compar|participativa.*representativa/.test(text)?[row('comparison')]:[]),...(/respond|objeciones/.test(text)?[row('response')]:[])]
  if(/^discut/.test(text)||/^particip/.test(text)&&/mesa redonda|conversatorio/.test(text))return[row(/razon/.test(text)?'reason':'interpretation'),...(/respond|intervenciones/.test(text)?[row('response')]:[])]
  if(/^respond/.test(text))return[row('response')]
  if(/^compar/.test(text))return[row('comparison')]
  if(/^argument|^justifi/.test(text))return[row('reason')]
  if(/^identifi/.test(text))return[row('identification')]
  if(/^expon|^present[a-z]* oralmente/.test(text))return[row('interpretation'),row('oral')]
  if(creates.test(text)){
   const alternatives=/\b(?:ensayo|informe|brochure|campana)\b[^.;]*\bo\b[^.;]*\b(?:ensayo|informe|brochure|campana)\b/.test(text)
   if(alternatives){const names=[...new Set([...text.matchAll(/\b(?:ensayo|informe|brochure|campana)\b/g)].map(m=>m[0]))],branches=names.map(name=>name==='ensayo'?[row('thesis'),row('reason'),row('organization')]:[row(name==='informe'?'report':name==='campana'?'campaign-plan':'brochure')]),levels=[0,1,2,3,4].map(i=>'En la alternativa elegida: '+branches.map((b,n)=>names[n]+': '+b.map(r=>r.progressionLevels[i]).join(' ')).join(' O BIEN: ')) as ContextualTopicCriterion['progressionLevels'];return[{...branches[0][0],templateId:branches[0][0].templateId.replace(/-(?:thesis|report|brochure|campaign-plan)$/,'-alternative-product'),title:'Producto elegido sobre '+topic.label,observable:levels[0],progressionLevels:levels}]}
   if(/borrador/.test(text))return[row('draft')]
   if(/periodico/.test(text))return[row('newspaper'),...(/fuentes|materiales proporcionados/.test(text)?[attribution()]:[])]
   if(/\bmensaje\b/.test(text)&&/unicamente/.test(text))return[row('campaign-message')]
   if(/\barticulo\b/.test(text))return[row('article')]
   if(/\bmemoria\b/.test(text))return[row('memory')]
   if(/\bensayo\b/.test(text))return[row('thesis'),row('reason'),row('organization')]
   if(/\binforme\b/.test(text))return[row('report')]
   if(/brochure|folleto/.test(text))return[row('brochure')]
   if(/cuadro sinoptico|organizador grafico/.test(text))return[row('organizer')]
   if(/campana/.test(text))return[row('campaign-plan'),...(/atribuy/.test(text)?[attribution()]:[])]
   if(/propuesta.*investigacion|proyecto de investigacion/.test(text))return[row('research-plan')]
   if(/^propon|^propong|propuesta/.test(text))return[row('proposal')]
   return[row('project-plan')]
  }
  if(/^analiz/.test(text)&&/articulos|disposiciones/.test(text))return[row('document-analysis')]
  if(/^expli/.test(text)&&/confiabilidad/.test(text))return[row('reliability-analysis')]
  return[row('interpretation')]
 }))
 return rows.filter((r,i)=>rows.findIndex(other=>other.templateId===r.templateId&&other.observable===r.observable)===i)
}
