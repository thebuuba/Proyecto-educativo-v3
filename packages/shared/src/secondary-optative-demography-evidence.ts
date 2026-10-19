import type {CommonSocialTask} from './secondary-social'
import type {SocialTopic} from './secondary-social-grade-1'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

const head=(text:string)=>text.replace(/^(?:en grupos|en parejas|de forma individual|los estudiantes|cada estudiante)[,\s]*/,'').trim()

/** The source's product names and supplied documents do not constitute extra actions. */
export function demographyTask(task:CommonSocialTask):CommonSocialTask{
 const actions:CommonSocialTask['actions']=[]
 for(const action of task.actions){
  const text=head(action.text),previous=actions.at(-1)
  if(previous&&(/^(?:producto|produccion|datos|relaciones|observaciones|argumentos)\b/.test(text)
   ||/^justifi[a-z]*\s+(?:(?:su|la)\s+(?:eleccion|pertinencia|seleccion)|como atiende)/.test(text)
   ||/^investig/.test(previous.text)&&/^expli[a-z]*\s+(?:su|sus|los)\s+(?:alcances|limites|hallazgos)/.test(text))){
   previous.text+=' y '+text;continue
  }
  actions.push({...action,text})
 }
 const first=actions[0]?.text??''
 const activityType=/^calcul/.test(first)?'EXERCISE_SET'
  :/^(?:revis|corrig|corrij|redact[a-z]*\s+(?:el\s+)?borrador)/.test(first)?'WRITTEN_PRODUCTION'
  :/^debat/.test(first)?'DEBATE'
  :/^compar/.test(first)?'COMPARISON'
  :/^present[a-z]* oralmente|^expon/.test(first)?'ORAL_PRESENTATION'
  :/^realiz[a-z]*\s+(?:una?\s+)?simulacion/.test(first)?'PERFORMANCE'
  :/^(?:investig|disen[a-z]*\s+(?:una?\s+)?encuesta)/.test(first)?'RESEARCH'
  :/^resum|^registr/.test(first)?'REPORT'
  :/^(?:elabor|redact)[a-z]*\s+(?:unicamente\s+)?(?:una?\s+)?(?:informe|monografia)/.test(first)&&!/monografia[^.;]*\bo\b[^.;]*ensayo/.test(first)?'REPORT'
  :/^(?:redact|elabor|escrib)[a-z]*\b[^.;]*\bensayo\b/.test(first)&&!/monografia/.test(first)?'ESSAY'
  :/^propon[a-z]*\s+(?:un\s+)?proyecto|^(?:elabor|redact)[a-z]*\b/.test(first)&&!/definicion/.test(first)?'PROJECT'
  :'ANALYSIS'
 return{...task,actions,activityType}
}

type Make=(topic:SocialTopic,key:string,values?:Record<string,string>)=>ContextualTopicCriterion
export function demographyCriteria(task:CommonSocialTask,make:Make):ContextualTopicCriterion[]{
 return task.actions.flatMap(action=>{
  const text=head(action.text)
  return action.topics.flatMap(topic=>{
   const row=(key:string,values?:Record<string,string>)=>make(topic,key,values)
   if(/^(?:revis|corrig|corrij)/.test(text))return[row('revision',{target:/problema/.test(text)?'la coherencia entre el problema y las acciones de la propuesta':'la relación entre el objetivo y las acciones del borrador'})]
   if(/^defin/.test(text)&&/propuesta/.test(text))return[row('proposal-scope')]
   if(/^analiz|^analic/.test(text)){
    if(/legislaciones|articulos legales/.test(text))return[row('legal-analysis')]
    if(topic.id==='economic-indicators'&&/publicaciones|extractos/.test(text))return[row('data-analysis')]
    if(/(?:los |en los |segun los )?(?:mapas|murales)\b/.test(text))return[row('map-analysis')]
   }
   if(/^atribuy/.test(text))return[row('attribution'),...(/registr|conserv[a-z]* los datos/.test(text)?[row('data-record')]:[])]
   if(/^seleccion/.test(text))return[row(/fuentes/.test(text)?'source-selection':/problem/.test(text)?'problem-selection':'identification')]
   if(/^calcul/.test(text))return[row('calculation')]
   if(/^expli[a-z]*\s+(?:su|el) resultado/.test(text))return[row('result')]
   if(/^registr/.test(text))return[row('data-record')]
   if(/^resum/.test(text))return[row('summary')]
   if(/^ubic|^localiz/.test(text))return[row('location')]
   if(/^identifi/.test(text))return[row('identification')]
   if(/^compar/.test(text))return[row('comparison')]
   if(/^investig/.test(text))return[row('research')]
   if(/^disen/.test(text)&&/encuesta/.test(text))return[row('survey')]
   if(/^realiz/.test(text)&&/simulacion/.test(text))return[row('simulation')]
   if(/^debat/.test(text))return[row('argument'),...(/respond|objeciones/.test(text)?[row('response')]:[])]
   if(/^respond/.test(text))return[row('response')]
   if(/^argument/.test(text))return[row('argument')]
   if(/^propon|^propong/.test(text))return[row('proposal')]
   if(/^present[a-z]* oralmente|^expon/.test(text))return[row(/propuesta/.test(text)?'proposal':'interpretation'),row('oral')]
   if(/^(?:elabor|redact|escrib)[a-z]*\b/.test(text)){
    if(/monografia[^.;]*\bo\b[^.;]*ensayo/.test(text)){
     const branches=[[row('monograph')],[row('thesis'),row('reason'),row('organization')]]
     const levels=[0,1,2,3,4].map(i=>'En la alternativa elegida: monografía: '+branches[0].map(r=>r.progressionLevels[i]).join(' ')+' O BIEN ensayo: '+branches[1].map(r=>r.progressionLevels[i]).join(' ')) as ContextualTopicCriterion['progressionLevels']
     return[{...branches[0][0],templateId:branches[0][0].templateId.replace(/monograph$/,'alternative-product'),title:'Producto elegido: monografía o ensayo sobre '+topic.label,observable:levels[0],progressionLevels:levels}]
    }
    if(/\bmonografia\b/.test(text))return[row('monograph')]
    if(/\bensayo\b/.test(text))return[row('thesis'),row('reason'),row('organization')]
    if(/\binforme\b/.test(text))return[row('report')]
    if(/\bdefinicion\b/.test(text))return[row('interpretation')]
    if(/\bborrador\b/.test(text))return[row('proposal')]
    if(/\bproyecto\b|\bplan\b/.test(text))return[row(/investigacion/.test(text)?'research-plan':'project-plan')]
    return[row('representation')]
   }
   return[row('interpretation')]
  })
 }).filter((row,i,all)=>all.findIndex(other=>other.templateId===row.templateId&&other.observable===row.observable)===i)
}
