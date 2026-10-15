import {requestedLanguageFeatures,type LanguageFeature} from './language-feature-criteria'
import {englishGrammarCriterion} from './secondary-english-grade-one-grammar'
import {affirmativeScopedEnglishTask} from './secondary-english-task-text'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export function requestedScopedEnglishGrammar(description:string,features:LanguageFeature[],extraGuarded:string[]=[]){
 let text=affirmativeScopedEnglishTask(description)
 for(const [category,names] of [['adverbios?','tiempo|duracion|frecuencia|modo|intensidad|grado|certeza'],['preposiciones?','tiempo|lugar'],['conectores?','coordinacion|tiempo|secuencia|causa|consecuencia|finalidad|contraste|concesion']] as const)
  text=text.replace(new RegExp(`\\b(${category}) de ((?:${names})(?:\\s+(?:y\\s+)?(?:${names}))*)\\b`,'g'),(_,label:string,items:string)=>items.split(/\s+(?:y\s+)?/).map(item=>`${label} de ${item}`).join(' y '))
 const guarded=new Set(['used-to','will','going-to','there-be','lets','why-suggestion','agreement-responses',...extraGuarded,...features.filter(f=>f.id.startsWith('modal-')).map(f=>f.id)])
 const forms=features.map(f=>f.match).join('|')
 const cue='(?:utiliz\\w*|emple\\w*|us(?:ar(?:an)?|an|en|ando)|identific\\w*|localiz\\w*|reconoc\\w*|compar(?:ar(?:an)?|an|en)|(?:funcion|significado|uso) de)'
 const article='(?:(?:el|la|los|las|verbo|modal|forma|estructura)\\s+)*'
 const selected=requestedLanguageFeatures(features,text).filter(f=>!guarded.has(f.id)||new RegExp(`\\b${cue}\\s+${article}(?:(?:${forms})(?:\\s+(?:(?:y|o|e)\\s+)?)${article})*(?:${f.match})`).test(text))
 return combineEnglishFeatureAlternatives(text,selected)
}
export function englishAlternativeGroups<T extends {id:string;match:string}>(text:string,selected:T[]):T[][]{
 const article='(?:(?:un|una|el|la|los|las|verbo|modal|forma|estructura)\\s+)*'
 const consumed=new Set<string>(),groups:T[][]=[]
 const ordered=selected.slice().sort((a,b)=>(text.match(new RegExp(a.match))?.index??Infinity)-(text.match(new RegExp(b.match))?.index??Infinity))
 for(const f of ordered){
  if(consumed.has(f.id))continue
  const alternatives=[f],match=text.match(new RegExp(f.match))
  let end=(match?.index??-1)+(match?.[0].length??0)
  for(;;){
   const next=ordered.find(other=>!consumed.has(other.id)&&!alternatives.includes(other)&&new RegExp(`^\\s+o\\s+${article}(?:${other.match})`).test(text.slice(end)))
   if(!next)break
   const continuation=text.slice(end).match(new RegExp(`^\\s+o\\s+${article}(?:${next.match})`))!
   alternatives.push(next);consumed.add(next.id);end+=continuation[0].length
  }
  groups.push(alternatives)
 }
 const membership=new Map(groups.flatMap(g=>g.map(f=>[f.id,g] as const))),emitted=new Set<T[]>()
 return selected.flatMap(f=>{const group=membership.get(f.id)!;if(emitted.has(group))return [];emitted.add(group);return [group]})
}
export function combineEnglishFeatureAlternatives<T extends LanguageFeature>(text:string,selected:T[]){
 return englishAlternativeGroups(text,selected).map(alternatives=>{
  const f=alternatives[0]
  return alternatives.length===1?f:{...f,id:alternatives.map(a=>a.id).join('-or-'),name:alternatives.map(a=>a.name).join(' o ')+', según la alternativa elegida',function:alternatives.map(a=>a.function).join(' o ')+', según la forma elegida y la intención solicitada',error:alternatives.map(a=>a.error).join(' o ')+', según la alternativa elegida',terms:undefined}
 })
}
export function scopedEnglishGrammarCriterion(feature:LanguageFeature,text:string,mode:string,scope:string):ContextualTopicCriterion{
 const c=englishGrammarCriterion(feature,text,['analysis','comparison','research'].includes(mode)?'reading':mode,scope)
 if(mode!=='comparison')return c
 const levels:NonNullable<ContextualTopicCriterion['progressionLevels']>=[
  `Contrasta ${feature.name} en los textos en inglés y sustenta las semejanzas o diferencias mediante ejemplos relacionados con su función para ${feature.function}.`,
  `Localiza ejemplos pertinentes de ${feature.name} y establece un contraste; una relación con su función requiere precisión.`,
  `Enumera ejemplos de ${feature.name}, pero deja sin relacionar las semejanzas o diferencias de sus usos.`,
  `El contraste atribuye a la forma una función incorrecta: ${feature.error}.`,
  `No aporta ejemplos pertinentes que permitan contrastar ${feature.name} en los textos disponibles.`,
 ]
 return {...c,observable:levels[0],progressionLevels:levels}
}
