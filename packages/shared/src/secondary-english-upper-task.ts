import {affirmativeScopedEnglishTask,commonEnglishGrade,englishContextTask,independentEnglishActionParts} from './secondary-english-task-text'
import {languageInstrumentIntent} from './language-instrument-intent'
import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export type UpperEnglishMode='reading'|'listening'|'writing'|'oral'|'interaction'|'audiovisual'|'analysis'|'comparison'|'research'
export type UpperEnglishEvidence={mode:UpperEnglishMode;text:string;contextText:string;requirementText:string;functions:string[]}
export type UpperEnglishTask=UpperEnglishEvidence&{grade:4|5|6;activityType:string;technique:string;rows:ContextualTopicCriterion[];actions?:UpperEnglishTask[]}
type Definition={grade:4|5|6;functions:(text:string)=>string[];criteria:(task:UpperEnglishEvidence)=>ContextualTopicCriterion[];acceptsContext?:(context?:InstrumentAcademicContext|null)=>boolean}
const modes:Record<UpperEnglishMode,{activityType:string;technique:string}>={
 reading:{activityType:'READING_COMPREHENSION',technique:'analisis-producciones'},listening:{activityType:'LISTENING_COMPREHENSION',technique:'observacion-sistematica'},
 writing:{activityType:'WRITTEN_PRODUCTION',technique:'analisis-producciones'},oral:{activityType:'ORAL_PRESENTATION',technique:'presentacion'},interaction:{activityType:'ORAL_INTERACTION',technique:'observacion-directa'},
 audiovisual:{activityType:'AUDIOVISUAL_PRODUCTION',technique:'analisis-producciones'},analysis:{activityType:'ANALYSIS',technique:'analisis-producciones'},comparison:{activityType:'COMPARISON',technique:'analisis-producciones'},research:{activityType:'RESEARCH',technique:'analisis-producciones'},
}
/** Common action mechanics only. Each grade supplies its own functions and
 * authored evidence after checking its source; unsupported content returns null. */
export function createUpperEnglishProvider(definition:Definition){
 const common=(context?:InstrumentAcademicContext|null)=>definition.acceptsContext?definition.acceptsContext(context):commonEnglishGrade(context,definition.grade)
 const single=(description:string,previous?:UpperEnglishTask):UpperEnglishTask|null=>{
  const text=affirmativeScopedEnglishTask(description),contextText=englishContextTask(description)
  const action=text.replace(/\b(?:para|a fin de) (?:leer|escuchar|escribir|redactar|presentar|dialogar|conversar|comparar)\b/g,'para')
  let mode:UpperEnglishMode|undefined
  if(/\binvestig(?:ar(?:an)?|an|uen|ando)\b/.test(action))mode='research'
  else if(/\b(?:escuch(?:ar(?:an)?|an|en|ando)|listen(?:s|ing)?)\b/.test(action))mode='listening'
  else if(/\b(?:leer(?:an)?|lee|lean|leen|leyendo|read(?:s|ing)?)\b/.test(action))mode='reading'
  else if(/\b(?:video|audiovisual)\b/.test(action)&&/\b(?:grab\w*|crea\w*|elabor\w*)\b/.test(action))mode='audiovisual'
  else if(/\b(?:escrib\w*|redact\w*|por escrito|writ\w*)\b/.test(action))mode='writing'
  else if(/\b(?:dialog(?:ar(?:an)?|an|uen|ando)|convers(?:ar(?:an)?|an|en|ando)|interactu(?:ar(?:an)?|an|en|ando)|intercambio oral|role play)\b/.test(action)||/\b(?:realiz(?:ar(?:an)?|an|en)|simul(?:ar(?:an)?|an|en)|represent(?:ar(?:an)?|an|en))\b.*\bentrevistas?\b/.test(action))mode='interaction'
  else if(/\b(?:compar(?:ar(?:an)?|en|an)|contrast(?:ar(?:an)?|an|en|ando))\b|^contrast[ae]\b/.test(action))mode='comparison'
  else if(/\b(?:analiz\w*|analic\w*)\b/.test(action))mode='analysis'
  else if(/\b(?:oral\w*|present(?:ar|aran|an|en)|expon\w*|narr\w*|ensay\w*|recit\w*|canta\w*)\b/.test(action))mode='oral'
  else if(/\b(?:analiz\w*|analic\w*|explic\w*|expliqu\w*|infer\w*|hipotetiz\w*)\b/.test(action))mode='analysis'
  else if(/\b(?:sistematiz\w*|sistematic\w*|evalu\w*|valor\w*|razon\w*)\b/.test(action))mode='analysis'
  else if(/\b(?:identific\w*|identifiqu\w*|reconoc\w*|reconoz\w*|localiz\w*|localic\w*|seleccion\w*)\b/.test(action))mode='reading'
  else if(/\b(?:utiliz\w*|emple\w*|complet\w*|crea\w*|elabor\w*|planific\w*)\b/.test(action))mode='writing'
  else if(/^(?:lectura|reading)\b/.test(action))mode='reading'
  else if(/^escucha\b/.test(action))mode='listening'
  else if(/^presentacion\b/.test(action))mode='oral'
  else if(/^(?:escritura|produccion escrita)\b/.test(action))mode='writing'
  if(!mode)return null
  const mediumChoice=/\b(?:oral(?:es|mente)? (?:o|u) (?:por )?escrit[ao]s?|(?:por )?escrit[ao]s? (?:o|u) oral(?:es|mente)?)\b/
  const choice=mediumChoice.exec(text)
  if(choice&&['oral','writing','interaction'].includes(mode)){
   const allChoices=new RegExp(mediumChoice.source,'g')
   const oral=single(text.replace(allChoices,'oralmente'),previous),written=single(text.replace(allChoices,'por escrito'),previous)
   if(!oral||!written)return null
   const channel=(r:ContextualTopicCriterion)=>/-(?:written|intelligibility)$/.test(r.templateId)
   const oralCore=oral.rows.filter(r=>!channel(r)),writtenCore=written.rows.filter(r=>!channel(r))
   if(!oralCore.length||JSON.stringify(oralCore)!==JSON.stringify(writtenCore))return null
   const writtenFirst=/^(?:por )?escrit/.test(choice[0]),basis=writtenFirst?written:oral,rows=[...oralCore]
   const oralChannel=oral.rows.find(r=>r.templateId.endsWith('-intelligibility')),writtenChannel=written.rows.find(r=>r.templateId.endsWith('-written'))
   if(oralChannel?.progressionLevels&&writtenChannel?.progressionLevels){
    const ordered=writtenFirst?[writtenChannel,oralChannel]:[oralChannel,writtenChannel]
    const levels=[0,1,2,3,4].map(i=>ordered.map(r=>r.progressionLevels![i]).join(' / ')+' Se valora únicamente la alternativa elegida.') as NonNullable<ContextualTopicCriterion['progressionLevels']>
    rows.push({templateId:oralChannel.templateId.replace(/-intelligibility$/,'-medium-choice'),title:'Comunicación por el medio elegido',observable:levels[0],progressionLevels:levels,weight:Math.max(oralChannel.weight,writtenChannel.weight)})
   }
   return {...basis,text,contextText:englishContextTask(description),requirementText:text,rows}
  }
  const inherited=previous&&/\b(?:lo|la|los|las|sus trabajos)\s+(?:present\w*|expon\w*)\b/.test(text)
  const evidence:UpperEnglishEvidence={mode,text:inherited?previous.text:text,contextText,requirementText:text,functions:inherited?previous.functions:definition.functions(text)}
  const rows=definition.criteria(evidence)
  return rows.length?{...evidence,grade:definition.grade,...modes[mode],rows}:null
 }
 const resolve=(title:string,description:string,context?:InstrumentAcademicContext|null):UpperEnglishTask|null=>{
  if(!common(context))return null
  const actions:UpperEnglishTask[]=[]
  for(const part of independentEnglishActionParts(description||title)){const task=single(part,actions.at(-1));if(task)actions.push(task)}
  if(actions.length<2)return single(description||title)
  const primary=actions.filter(a=>!['reading','listening'].includes(a.mode)).at(-1)??actions.at(-1)!
  return {...primary,text:affirmativeScopedEnglishTask(description||title),actions}
 }
 return {common,resolve}
}
export function upperEnglishCriteria(task:UpperEnglishTask):ContextualTopicCriterion[]{
 if(!task.actions)return task.rows
 const rows:ContextualTopicCriterion[]=[],seen=new Set<string>()
 for(const [i,action] of task.actions.entries())for(const criterion of upperEnglishCriteria(action)){
  const key=JSON.stringify(criterion);if(seen.has(key))continue;seen.add(key)
  rows.push(rows.some(r=>r.templateId===criterion.templateId)?{...criterion,templateId:`${criterion.templateId}:${action.mode}:${i+1}`}:criterion)
 }
 return rows
}
export function upperEnglishSelections(task:UpperEnglishTask,description:string){
 const discrete=(task.actions??[task]).every(a=>['reading','listening'].includes(a.mode)&&!/\b(?:infer\w*|explic\w*|justific\w*|argument\w*)\b/.test(a.text))
 return {suggestedEvaluationTechnique:task.technique,suggestedInstrumentType:languageInstrumentIntent(description)??(discrete?'lista-cotejo':'rubrica')}
}
