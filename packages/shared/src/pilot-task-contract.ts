import type {InstrumentAcademicContext} from './secondary-science'
import {deliveryConditions} from './task-delivery-requirements'
import {completeFirstGradeNewsCriteria} from './secondary-language-grade-one-complete'
import {resolveFirstGradeTransversalTask} from './secondary-language-grade-one-transversal'
import {presentationDurationMatch} from './science-presentation-criteria'
import {foldedTaskText,taskClauseMatches} from './task-clause-spans'

export const pilotCompositionVersion='composition-pilot-v1'
export type PilotFamily='NEWS'|'ORAL_SCIENCE'|'MATH_REPRESENTATION'
export type PilotRequirement={
 id:string;key:string;kind:'CONTENT'|'EXECUTION'|'PRESENTATION'|'EXCLUSION';label:string
 origin:{start:number;end:number;text:string};mode?:'OR'|'EXACT'|'MAX'|'APPROX';alternatives?:string[]
}
export type PilotContract={
 family:PilotFamily;context:{level:string;grade:number;subjectCode:string};product:string;mainAction:string
 additionalActions:string[];content:string;activityType:string;requirements:PilotRequirement[];dimensions:string[]
}
export const foldPilotText=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()

/** Deliberately bounded dispatcher. Titles and the rest of the curriculum cannot opt a task in. */
export function extractPilotContract(description:string,context:InstrumentAcademicContext|null|undefined,activityType?:string):PilotContract|null{
 if(context?.level!=='SECONDARY'||context.grade!==1||context.optativeExitName)return null
 const folded=foldedTaskText(description),original=folded.text
 // Keep offsets while masking negative clauses; their original spans are retained separately below.
 let text=original
 for(const match of taskClauseMatches(original,/\b(?:no(?!\s+mas de\b)|sin|opcionalmente|si lo deseas)\b[\s\S]*/))text=text.slice(0,match.index)+' '.repeat(match[0].length)+text.slice(match.index+match[0].length)
 const code=context.subjectCode?.trim().toUpperCase(),subject=code==='NAT-TU'?'NAT':code
 const news=/\b(?:escrib\w*|redact\w*|elabor\w*)\s+(?:(?:individualmente|una|la)\s+)*noticia\b/.exec(text)
 const oral=/\b(?:exposicion|expongan|expone\w*|expon\w*|oralmente)\b/.exec(text)
 const solar=/\bplanetas\b/.test(text)&&/\bsistema solar\b/.test(text)
 const stats=/\btabla de frecuencias\b/.test(text)&&/\bgrafico de barras\b/.test(text)&&/\b(?:conclusion|interpret\w*|media|mediana)\b/.test(text)
 const rational=/\bcompar\w*\b/.test(text)&&/\b(?:justifi\w*|explic\w*)\b/.test(text)&&/recta numerica[^.;]*\bo\b[^.;]*(?:texto|explicacion escrita)/.test(text)
 const family:PilotFamily|null=subject==='LEN'&&news?'NEWS':subject==='NAT'&&oral&&solar&&!/\b(?:elij\w*|elige\w*)\s+entre[^.;]*(?:afiche|exposicion)/.test(text)?'ORAL_SCIENCE':subject==='MAT'&&(stats||rational)?'MATH_REPRESENTATION':null
 if(!family)return null
 if(family==='NEWS'){
  const supported=new Set(['news-essential','news-structure','news-sequence','news-language','news-revision','news-feature-punctuation'])
  if(resolveFirstGradeTransversalTask('',description,context)||completeFirstGradeNewsCriteria('NEWS_WRITING',description).some(c=>!supported.has(c.templateId)))return null
 }
 const allowed=family==='NEWS'?['NEWS_WRITING','WRITTEN_PRODUCTION']:family==='ORAL_SCIENCE'?['ORAL_PRESENTATION','EXPOSITION']:['EXERCISE_SET','ANALYSIS','COMPARISON']
 if(activityType&&!allowed.includes(activityType))return null
 const requirements:PilotRequirement[]=[]
 const add=(key:string,kind:PilotRequirement['kind'],match:RegExpExecArray|null,label?:string,extra:Partial<PilotRequirement>={})=>{
  if(!match||requirements.some(r=>r.key===key))return
  const {start,end}=folded.span(match.index,match.index+match[0].length)
  requirements.push({id:`req:${key}`,key,kind,label:label??description.slice(start,end),origin:{start,end,text:description.slice(start,end)},...extra})
 }
 const find=(pattern:RegExp)=>taskClauseMatches(text,pattern).next().value??null
 if(family==='NEWS'){
  add('news-product','CONTENT',news)
  add('news-data','CONTENT',find(/(?:a partir de|con) estos datos[^:]*:|sin inventar datos|evita inventar datos/))
  add('news-parts','CONTENT',find(/(?:incluye|con) (?:un )?titular[\s\S]*(?:entrada|cuerpo)[\s\S]*/))
  add('news-questions','CONTENT',find(/(?:explica|informa) que ocurrio[\s\S]*/))
  add('news-tone','CONTENT',find(/(?:manten|mantengan|usa\w*)\s+(?:un )?tono informativo/))
  add('news-order','CONTENT',find(/revisa[\s\S]*organizacion[\s\S]*/))
  add('news-orthography','CONTENT',find(/(?:revisa[\s\S]*)?ortografia/))
  add('news-punctuation','CONTENT',find(/(?:revisa[\s\S]*)?puntuacion/))
  const patterns:Record<string,RegExp>={font:/arial(?:\s+\d+)?/,size:/arial\s+\d+|tamano[^.;,]*/,spacing:/interlineado\s*(?:de\s*)?\d+(?:[.,]\d+)?/,indent:/sangria[^.;,]*/,color:/titulos?\s+(?:en\s+)?color\s+\w+/}
  for(const condition of deliveryConditions(description,{requestedOnly:true}))add('presentation-'+condition.key,'PRESENTATION',find(patterns[condition.key]??/\b(?!)\b/),condition.label)
 }else if(family==='ORAL_SCIENCE'){
  add('oral','EXECUTION',oral)
  add('planets','CONTENT',find(/(?:todos los|ocho) planetas/))
  add('planet-explanation','CONTENT',find(/(?:explic\w*|expliqu\w*)[\s\S]*(?:que es cada uno|que son|que es cada planeta|planetas)/))
  const duration=presentationDurationMatch(text)
  if(duration)add('duration','EXECUTION',duration,undefined,{mode:duration[1]&&/hasta|maximo|no mas de/.test(duration[1])?'MAX':duration[1]?'APPROX':'EXACT'})
  // A negated support is not an affirmative candidate. Negations remain in the contract.
  if(!/\b(?:no (?:uses?|utilic\w*|utiliz\w*)|sin)\s+material de apoyo/.test(original)){
   add('support','EXECUTION',find(/(?:utilizar\w*|usen?|con|apoyo obligatorio)[\s\S]*material de apoyo|material de apoyo obligatorio[\s\S]*/))
   add('support-choice','EXECUTION',find(/(?:un )?dibujo\s+o\s+(?:una )?lamina/),undefined,{mode:'OR',alternatives:['dibujo','lámina']})
  }
 }else if(stats){
  add('table','CONTENT',find(/tabla de frecuencias/))
  add('chart','CONTENT',find(/grafico de barras/))
  add('mean','CONTENT',find(/\bmedia\b/))
  add('median','CONTENT',find(/\bmediana\b/))
  add('interpretation','CONTENT',find(/interpret\w*[\s\S]*/))
  add('conclusion','CONTENT',find(/(?:formula[\s\S]*|una )conclusion[\s\S]*/))
  add('explanation-choice','PRESENTATION',find(/(?:un )?audio\s+o\s+(?:en )?(?:un )?texto/),undefined,{mode:'OR',alternatives:['audio','texto']})
 }else{
  add('comparison','CONTENT',find(/compar\w*[\s\S]*/))
  add('reasoning-choice','CONTENT',find(/recta numerica[\s\S]*\bo\b[\s\S]*(?:texto|explicacion escrita)[\s\S]*/),undefined,{mode:'OR',alternatives:['recta numérica','texto con cálculos']})
 }
 // Negative obligations constrain selection; they never become additional scored deliverables.
 for(const match of taskClauseMatches(original,/\b(?:no (?:entreg\w*|tienen que|es necesario usar|se pid\w*|construy\w*|uses?|utilic\w*)|sin)\b[\s\S]*/)){
  const key=/borrador/.test(match[0])?'exclude-draft':/maqueta/.test(match[0])?'exclude-model':/encuesta/.test(match[0])?'exclude-survey':/material de apoyo/.test(match[0])?'exclude-support':/amb[oa]s/.test(match[0])?'exclude-both':null
  if(key)add(key,'EXCLUSION',match as RegExpExecArray)
 }
 // Explicit unsupported additional actions stay uncovered, rather than receiving a filler criterion.
 for(const match of taskClauseMatches(text,/\b(?:tradu[cz]\w*|recit\w*|dramatiz\w*|entrevist\w*)\b[\s\S]*/))add('unresolved-'+match.index,'CONTENT',match)
 return {family,context:{level:context.level,grade:context.grade,subjectCode:subject!},product:family==='NEWS'?'noticia escrita':family==='ORAL_SCIENCE'?'explicación oral':stats?'representación y análisis de datos':'comparación justificada de racionales',mainAction:family==='NEWS'?'WRITE':family==='ORAL_SCIENCE'?'EXPLAIN':stats?'REPRESENT':'COMPARE',additionalActions:requirements.filter(r=>['mean','median','interpretation','conclusion','support'].includes(r.key)).map(r=>r.key),content:family==='NEWS'?'hecho noticioso y datos disponibles':family==='ORAL_SCIENCE'?'planetas del sistema solar':stats?'datos proporcionados y medidas solicitadas':'racionales proporcionados',activityType:activityType??(family==='NEWS'?'NEWS_WRITING':family==='ORAL_SCIENCE'?'ORAL_PRESENTATION':stats?'EXERCISE_SET':'ANALYSIS'),requirements,dimensions:family==='NEWS'?['news-essential','news-structure','news-sequence','news-language','news-revision']:family==='ORAL_SCIENCE'?['scientific-precision','oral-communication']:['mathematical-validity']}
}
