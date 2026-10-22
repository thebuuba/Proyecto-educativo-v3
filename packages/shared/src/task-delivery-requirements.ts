import {withoutResources} from './evaluation-task-text'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export class TaskRequirementError extends RangeError {
 constructor(detail:string){super(`Requisitos de entrega contradictorios: ${detail}. Revisa la consigna; se conservaron tus cambios.`);this.name='TaskRequirementError'}
}
type Condition={key:string;label:string}
export type DeliveryOptions={includeFileFormats?:boolean;requestedOnly?:boolean;ignoreSelectedSourceArticle?:boolean}
const numbers:Record<string,number>={un:1,una:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,trece:13,catorce:14,quince:15,dieciseis:16,diecisiete:17,dieciocho:18,diecinueve:19,veinte:20}
const number='(?:\\d+(?:[.,]\\d+)?|'+Object.keys(numbers).join('|')+')'
const value=(n:string)=>numbers[n]??Number(n.replace(',','.'))
export function deliveryConditions(description:string,options:DeliveryOptions={}):Condition[]{
 let text=withoutResources(description).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
  .replace(/\bno se (?:pide|requiere|exige)\b[^.;]*/g,'')
 if(options.requestedOnly)text=text
  .replace(/\b(?:opcionalmente|si lo deseas|como apoyo|como recurso)\b[^.;]*/g,'')
  .replace(/\b(?:puedes?|podran|podras)\s+(?:consult\w*|utiliz\w*|usar\w*)[^.;]*/g,'')
  .replace(/\b(?:sin\s+|no\s+(?:(?:se|deben?|es necesario|hay que)\s+)*)(?:program\w*|simul\w*|constru\w*|disen\w*|entreg\w*|elabor\w*|ejecut\w*|crea\w*)\b[^.;]*/g,'')
  .replace(new RegExp(`\\b${number}\\s+paginas?\\s+(?:web|html)\\b`,'g'),'producto web')
 const conditions:Condition[]=[],add=(key:string,label:string)=>{if(!conditions.some(c=>c.key===key&&c.label===label))conditions.push({key,label})}
 if(options.includeFileFormats)for(const raw of text.split(/[.;](?!\d)/)){
  if(/^\s*(?:puede|pueden|podra|podran)\b/.test(raw))continue
  const clause=raw.replace(/\b(?:no|sin)\s+[^.;]*/g,'')
  const format=clause.match(/(?:^|\by\s+|\bluego\s+|\bdespues\s+)\s*(?:debe(?:n)?\s+)?(?:entrega(?:n|r|d)?|entregue(?:n)?)\b[^.;]*?\ben\s+(?:formato\s+)?(pdf|docx|odt|pptx|xlsx|csv)\b/)
  if(format)add('file-format','archivo en '+format[1].toUpperCase())
 }
 const pageClauses=text.split(/[.;](?!\d)/).filter(clause=>/\bpaginas?\b/.test(clause))
 const bounds:{min:number[];max:number[];exact:number[]}={min:[],max:[],exact:[]}
 for(const clause of pageClauses){
  let remaining=clause.replace(new RegExp(`(?:entre\\s+)?(${number})\\s+(?:y|a|hasta)\\s+(${number})\\s+paginas?`,'g'),(_,a:string,b:string)=>{bounds.min.push(value(a));bounds.max.push(value(b));return ''})
  remaining=remaining.replace(new RegExp(`(minimo|maximo)\\s+(${number})(\\s+paginas?)?`,'g'),(whole:string,limit:string,n:string,unit:string|undefined,offset:number)=>{
   const tail=remaining.slice(offset+whole.length)
   if(!unit&&/^\s+(?!y\b|o\b)[a-z]/.test(tail))return whole
   bounds[limit==='minimo'?'min':'max'].push(value(n));return ''
  })
  for(const exact of remaining.matchAll(new RegExp(`(${number})\\s+paginas?`,'g')))bounds.exact.push(value(exact[1]))
 }
 const distinct=(n:number[])=>[...new Set(n)]
 const min=bounds.min.length?Math.max(...bounds.min):undefined,max=bounds.max.length?Math.min(...bounds.max):undefined,exact=distinct(bounds.exact)
 if(exact.length>1||min!==undefined&&max!==undefined&&min>max||exact.some(n=>min!==undefined&&n<min||max!==undefined&&n>max))throw new TaskRequirementError('los límites de páginas no son compatibles')
 if(exact.length)add('pages',`${exact[0]} ${options.requestedOnly&&exact[0]===1?'página':'páginas'}`)
 else if(min!==undefined&&max!==undefined)add('pages',`entre ${min} y ${max} páginas`)
 else if(min!==undefined)add('pages',`mínimo ${min} ${min===1?'página':'páginas'}`)
 else if(max!==undefined)add('pages',`máximo ${max} ${max===1?'página':'páginas'}`)
 const spacing=[...text.matchAll(/\binterlineado\s*(?:de\s*)?(\d+(?:[.,]\d+)?)\b/g)].map(m=>value(m[1]))
 if(distinct(spacing).length>1)throw new TaskRequirementError('se indican varios interlineados incompatibles')
 if(spacing.length)add('spacing',`interlineado ${spacing[0]}`)
 const fonts=[...text.matchAll(/(?:\bfuente\s+|(?:^|[.;,])\s*)(arial|calibri|times new roman)\b(?:\s+o\s+(arial|calibri|times new roman)\b)*/g)].map(m=>m[0].replace(/^.*?(?=arial|calibri|times new roman)/,'').split(' o ').map(f=>f==='times new roman'?'Times New Roman':f[0].toUpperCase()+f.slice(1)).join(' o '))
 if(distinctStrings(fonts).length>1)throw new TaskRequirementError('se indican fuentes incompatibles; expresa las alternativas con «o»')
 if(fonts.length)add('font',`fuente ${fonts[0]}`)
 const sizes=[...text.matchAll(/\b(?:tamano(?: de (?:letra|fuente))?|letra de)\s*(?:de\s*)?(\d+(?:[.,]\d+)?)\b/g)].map(m=>value(m[1]))
 if(distinct(sizes).length>1)throw new TaskRequirementError('se indican tamaños de letra incompatibles')
 if(sizes.length)add('size',`tamaño de letra ${sizes[0]}`)
 const noCover=/\b(?:sin portada|no (?:inclu\w*|llev\w*|requiere) (?:una )?portada)\b/.test(text)
 const cover=/\b(?:con|inclu\w*|lleva\w*|debe llevar) (?:una )?portada\b/.test(text.replace(/\bno\s+[^.;]*/g,''))
 if(noCover&&cover)throw new TaskRequirementError('se exige y se excluye la portada')
 if(noCover||cover)add('cover',noCover?'sin portada':'incluye portada')
 const sections=text.match(/\b(?:apartados|secciones)\s*:\s*([^.;]+)/)
  ??text.match(/(?:^|[.;]\s*)(?:apartados|secciones)\s+de\s+([^.;]+)/)
  ??text.match(/\b(?:inclu[a-z]*|con|tendra|contendra|debe tener|debe contener)\s+(?:(?:los|las)\s+)?(?:apartados|secciones)\s+(?:de\s+)?([^.;]+)/)
 if(sections){const content=sections[1].trim();if(content&&!/^(?:y\b|expresamente\b|indicad|senalad|solicitad|previst|segun\b)/.test(content))add('sections',`apartados solicitados: ${content}`)}
 const quantities=new Map<string,{unit:string;min:number[];max:number[];exact:number[]}>()
 for(const m of text.matchAll(new RegExp(`\\b(${number})\\s+(ejemplos?|parrafos?|oraciones?|fuentes?|citas?|imagenes?|apartados?)\\b`,'g'))){
  const clauseBefore=text.slice(0,m.index).split(/[.;]/).at(-1)??'',after=text.slice(m.index!+m[0].length)
  if(options.ignoreSelectedSourceArticle&&m[1]==='una'&&m[2]==='fuente'&&/\bseleccion[a-z]*\b/.test(clauseBefore)&&!/\b(?:inclu|entreg|anad|incorpor)[a-z]*\b/.test(clauseBefore))continue
  // Analizar insumos numerados ya dados no exige producir otra entrega con esa cantidad.
  if(/^\s+(?:proporcionad[oa]s?|dad[oa]s?)\b/.test(after)&&/\b(?:analiz|analic|compar|contrast|explic|expliqu|identific|identifiqu|evalu|valor|seleccion|le)[a-z]*\b/.test(clauseBefore)&&!/\b(?:inclu|entreg|anad|incorpor)[a-z]*\b/.test(clauseBefore))continue
  const prefix=text.slice(Math.max(0,m.index!-12),m.index)
  const qualifier=prefix.match(/\b(minimo|maximo)\s*$/)?.[1]
  const key=m[2].replace(/s$/,''),group=quantities.get(key)??{unit:m[2],min:[],max:[],exact:[]}
  group[qualifier==='minimo'?'min':qualifier==='maximo'?'max':'exact'].push(value(m[1]));quantities.set(key,group)
 }
 for(const [key,g] of quantities){
  const lower=g.min.length?Math.max(...g.min):undefined,upper=g.max.length?Math.min(...g.max):undefined,counts=distinct(g.exact)
  if(counts.length>1||lower!==undefined&&upper!==undefined&&lower>upper||counts.some(n=>lower!==undefined&&n<lower||upper!==undefined&&n>upper))throw new TaskRequirementError(`las cantidades de ${g.unit} no son compatibles`)
  const label=counts.length?`${counts[0]} ${g.unit}`:lower!==undefined&&upper!==undefined?`entre ${lower} y ${upper} ${g.unit}`:lower!==undefined?`mínimo ${lower} ${g.unit}`:`máximo ${upper} ${g.unit}`
  add(`quantity-${key}`,label)
 }
 return conditions
}
const distinctStrings=(values:string[])=>[...new Set(values)]
export function deliveryCriteria(description:string,options:DeliveryOptions={}):ContextualTopicCriterion[]{
 const conditions=deliveryConditions(description,options)
 if(!conditions.length)return []
 const requirements=conditions.map(c=>c.label).join('; ')
 const levels:ContextualTopicCriterion['progressionLevels']=[
  `${options.requestedOnly&&conditions.length===1?'Cumple la condición de entrega solicitada':`Cumple las ${conditions.length} condiciones de entrega solicitadas`}: ${requirements}.`,
  conditions.length>1?`Cumple ${Math.max(1,conditions.length-1)} de las ${conditions.length} condiciones solicitadas: ${requirements}.`:`La condición solicitada se comprueba en la entrega: ${requirements}.`,
  conditions.length>1?`Cumple algunas condiciones y deja otras sin cumplir; contrasta cada condición por separado: ${requirements}.`:`La entrega permite comprobar solo parte de la condición: ${requirements}.`,
  `La entrega no permite comprobar el cumplimiento de las condiciones solicitadas: ${requirements}.`,
  `No cumple las condiciones de entrega solicitadas: ${requirements}.`,
 ]
 return [{templateId:'delivery-format',title:'Condiciones explícitas de entrega',observable:levels[0],weight:1,progressionLevels:levels,
  checklistParts:conditions.map(c=>({key:c.key,observable:`La entrega cumple la condición solicitada: ${c.label}.`,progressionLevels:[
   `La entrega cumple: ${c.label}.`,`Se comprueba el cumplimiento de: ${c.label}.`,`La entrega permite comprobar solo parte de: ${c.label}.`,`No se puede comprobar: ${c.label}.`,`La entrega no cumple: ${c.label}.`,
  ]})),
 }]
}
export function withDeliveryCriteria<T extends {templateId:string}>(criteria:T[],description:string,options:DeliveryOptions={}):(T|ContextualTopicCriterion)[]{
 return [...criteria,...deliveryCriteria(description,options).filter(c=>!criteria.some(row=>row.templateId===c.templateId))]
}
