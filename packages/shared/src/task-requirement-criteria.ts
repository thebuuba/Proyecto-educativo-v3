import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'
import {extractTaskRequirements,taskConditionLabel,type TaskCondition,type TaskRequirementReport} from './task-presentation-requirements'

const formal=new Set(['font','font-size','emphasis','color','line-spacing','alignment','indent','paragraph-spacing','margin','paper-size','orientation','page-numbering','page-number-start'])
const evidence=new Set(['drawing','images','tables','charts','captions','citation','citations','evidence-count','attribution','bibliography','reference-style','fidelity','content-purpose'])
const structure=(c:TaskCondition)=>c.property==='section'||c.property==='extent'&&/p[aá]rrafo/.test(c.unit??'')&&c.scope!=='documento'
const groupFor=(c:TaskCondition)=>formal.has(c.property)?'format':structure(c)?'organization':evidence.has(c.property)?'evidence':'submission'
export const actionableTaskConditions=(report:TaskRequirementReport)=>{
 const unresolved=new Set(report.issues.flatMap(i=>i.conditionIds))
 return report.conditions.filter(c=>!unresolved.has(c.id)&&['REQUIRED','ALTERNATIVE'].includes(c.relation))
}

function row(id:string,title:string,conditions:TaskCondition[]):Criterion{
 const details=conditions.map(taskConditionLabel).join('; ')+(conditions.some(c=>c.property==='extent'&&c.operator==='MAX')?'; sin exigir alcanzar el límite si se satisface el contenido solicitado':'')
 const levels:Criterion['progressionLevels']=[
  `La entrega aplica las condiciones solicitadas en sus ámbitos correspondientes: ${details}.`,
  `La entrega conserva su organización y se reconoce la aplicación de las condiciones, con omisiones localizadas: ${details}.`,
  `La aplicación es parcial: hay elementos que respetan las condiciones y otros que las contradicen o las omiten. Condiciones: ${details}.`,
  `Aplica las condiciones en elementos aislados, mientras el resto de los elementos contradice el formato o la organización solicitados. Condiciones: ${details}.`,
  `La entrega no incorpora las condiciones solicitadas: ${details}.`,
 ]
 if(id==='delivery-evidence'){
  levels[0]=`Los elementos solicitados aportan información pertinente al contenido y se vinculan con su explicación: ${details}.`
  levels[1]=`Los elementos aportan información pertinente; alguna relación con el contenido queda implícita. Condiciones solicitadas: ${details}.`
  levels[2]=`Los elementos se presentan parcialmente o se añaden sin explicar su relación con el contenido. Condiciones solicitadas: ${details}.`
  levels[3]=`Los elementos presentan información que contradice el contenido que deberían apoyar. Condiciones solicitadas: ${details}.`
  levels[4]=`No aporta los elementos informativos solicitados: ${details}.`
 }
 if(id==='delivery-format'){
  const typography=conditions.filter(c=>c.property==='font'||c.property==='font-size').map(taskConditionLabel).join('; ')
  const layout=conditions.filter(c=>c.property!=='font'&&c.property!=='font-size').map(taskConditionLabel).join('; ')
  if(typography&&layout){
   levels[1]=`Mantiene la tipografía solicitada (${typography}); presenta inconsistencias localizadas en la disposición o el estilo: ${layout}.`
   levels[2]=`La fuente o el tamaño se omiten o se aplican a un ámbito distinto del indicado (${typography}); conserva parte de la disposición solicitada: ${layout}.`
   levels[3]=`Aplica formatos aislados sin mantener la tipografía ni la disposición asignadas a los elementos: ${details}.`
  }
 }
 if(id==='delivery-submission'&&conditions.some(c=>c.property==='file-format')&&conditions.some(c=>c.property==='extent')){
  const file=conditions.filter(c=>c.property==='file-format').map(taskConditionLabel).join('; ')
  const extent=conditions.filter(c=>c.property!=='file-format').map(taskConditionLabel).join('; ')
  levels[1]=`El archivo utiliza una de las opciones permitidas (${file}), pero la extensión no respeta ${extent}.`
  levels[2]=`El texto se presenta en un formato distinto de los permitidos (${file}); la cantidad de páginas no compensa ese incumplimiento. Extensión solicitada: ${extent}.`
  levels[3]=`La entrega está incompleta: no presenta el texto completo en una de las opciones permitidas (${file}); no satisface ${extent}.`
 }
 return {templateId:id,title,observable:levels[0],progressionLevels:levels,weight:1,coveredTaskConditionIds:conditions.map(c=>c.id),
  // One grouped check per coherent dimension; no row for each Word property.
  checklistParts:[{key:'requested',observable:`Sí solo si se cumplen las condiciones de ${title.toLowerCase()} en los ámbitos indicados: ${details}.`,progressionLevels:levels}]}
}

/** Reconcile only explicit task conditions; thematic evidence and teacher-edited snapshots stay outside this function. */
export function reconcileTaskCriteria(criteria:Criterion[],description:string,report=extractTaskRequirements(description)):Criterion[]{
 let conditions=actionableTaskConditions(report)
 if(!report.conditions.length)return criteria
 // Providers may have already appended a delivery row. Rebuild those generated rows once, before scoring.
 const generated=new Set(['delivery-format','delivery-submission','delivery-organization','delivery-evidence'])
 const result=criteria.filter(c=>!generated.has(c.templateId)).map(c=>({...c}))
 // Quantity belongs to the existing table/chart/visual evidence when a provider already supplies it.
 const bound=new Set<string>()
 for(const c of conditions){
  const pattern=c.property==='tables'?/table|tabla/:c.property==='charts'?/chart|graf/:c.property==='images'?/image|photo|visual|imagen|foto/:c.property==='drawing'?/drawing|representation/:null
  const target=pattern?result.find(r=>pattern.test(r.templateId)):undefined
  if(!target)continue
  if(!target.coveredTaskConditionIds?.includes(c.id)){
   const detail=taskConditionLabel(c)
   target.observable+=` Condición específica: ${detail}.`
   target.progressionLevels=[target.progressionLevels[0]+` Condición específica: ${detail}.`,...target.progressionLevels.slice(1)] as Criterion['progressionLevels']
   target.coveredTaskConditionIds=[...(target.coveredTaskConditionIds??[]),c.id]
   if(target.checklistParts?.length)target.checklistParts=target.checklistParts.map((p,index)=>({...p,
    coveredTaskConditionIds:[...(p.coveredTaskConditionIds??[]),...(index===0?[c.id]:[])],
    ...(index===0?{observable:p.observable+` Condición específica: ${detail}.`,progressionLevels:[p.progressionLevels[0]+` Condición específica: ${detail}.`,...p.progressionLevels.slice(1)] as Criterion['progressionLevels']}:{}),
   }))
  }
  bound.add(c.id)
 }
 conditions=conditions.filter(c=>!bound.has(c.id))
 if(conditions.some(c=>c.property==='citation'&&/comillas/.test(c.values.join(' ')))){
  for(const c of result.filter(c=>c.templateId==='news-feature-punctuation')){
   c.observable='La puntuación delimita oraciones y relaciona las ideas de la noticia sin alterar el sentido de los hechos; la fidelidad y atribución de la cita se valoran con la información.'
   c.progressionLevels=[c.observable,'Las oraciones se comprenden; un signo aislado deja ambigua una relación secundaria.','Varias omisiones o usos incorrectos de signos dificultan relacionar las ideas.','La puntuación cambia las relaciones entre los hechos comunicados.','No delimita las oraciones de modo que se reconozca el sentido de los hechos.']
   c.checklistParts=undefined
  }
 }
 const hasFormal=conditions.some(c=>formal.has(c.property))
 const compactFile=hasFormal&&!conditions.some(c=>groupFor(c)==='submission'&&c.property!=='file-format')
 const compactTitle=hasFormal&&!conditions.some(c=>structure(c)&&!(c.property==='section'&&/^t[ií]tulo$/.test(c.values[0])))&&!result.some(c=>/structure|organization/.test(c.templateId))
 const groupKey=(c:TaskCondition)=>compactFile&&c.property==='file-format'||compactTitle&&structure(c)?'format':groupFor(c)
 const groups=[
  {key:'format',id:'delivery-format',title:'Formato del documento'},
  {key:'organization',id:'delivery-organization',title:'Organización solicitada'},
  {key:'evidence',id:'delivery-evidence',title:'Evidencias solicitadas'},
  {key:'submission',id:'delivery-submission',title:'Entrega y extensión solicitadas'},
 ]
 for(const group of groups){
  const items=conditions.filter(c=>groupKey(c)===group.key)
  if(!items.length)continue
  let match=group.key==='organization'?result.find(c=>c.templateId==='news-structure')??result.find(c=>(/structure|organization|organizacion/.test(c.templateId)||/estructura|organización/i.test(c.title))&&!/process/.test(c.templateId)):
   group.key==='evidence'?result.find(c=>c.templateId==='news-essential')??result.find(c=>/evidence|resources|support/.test(c.templateId)):
   group.key==='format'?result.find(c=>/document-format|presentation-format/.test(c.templateId)):undefined
  // A single exact/binary condition has no defensible five-step progression of its own.
  const thematic=result.filter(c=>!generated.has(c.templateId))
  if(!match&&items.length===1&&thematic.length)match=thematic.find(c=>/structure|organization|communication|revision|coherence/.test(c.templateId))??thematic.at(-1)
  if(match){
   if(items.every(c=>match.coveredTaskConditionIds?.includes(c.id)))continue
   const prior=match.progressionLevels??[match.observable,match.observable,match.observable,match.observable,match.observable]
   const details=items.map(taskConditionLabel).join('; ')
   match.observable=`${match.observable} Condiciones específicas: ${details}.`
   match.progressionLevels=[`${prior[0]} Condiciones específicas: ${details}.`,
    `${prior[1]} También corresponde este nivel cuando la evidencia principal se conserva, pero falta aplicar una condición específica de este criterio.`,prior[2],prior[3],prior[4]]
   if(match.checklistParts?.length){
    const fold=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
    const parts=match.checklistParts.map(p=>({...p,coveredTaskConditionIds:[] as string[]}))
    for(const item of items){
     const scope=item.scope==='documento'?fold(item.values[0]).split(' ')[0]:fold(item.scope)
     const part=parts.find(p=>fold(p.key)===scope||new RegExp(`\\b${scope}\\b`).test(fold(p.observable)))??parts[0]
     const detail=taskConditionLabel(item)
     part.coveredTaskConditionIds.push(item.id)
     if(item.property!=='section'){
      part.observable+=` Condición específica: ${detail}.`
      part.progressionLevels=[part.progressionLevels[0]+` Condición específica: ${detail}.`,...part.progressionLevels.slice(1)] as Criterion['progressionLevels']
     }
    }
    match.checklistParts=parts
   }
   match.coveredTaskConditionIds=[...(match.coveredTaskConditionIds??[]),...items.map(c=>c.id)]
  }else result.push(row(group.id,group.title,items))
 }
 const unresolved=new Set(report.issues.flatMap(i=>i.conditionIds))
 const negative=report.conditions.filter(c=>!unresolved.has(c.id)&&c.relation==='NEGATED'&&c.property==='section'&&/\b(?:sin portada|no inclu)/i.test(c.condition??''))
 const target=result.find(c=>c.templateId==='delivery-format')??result.find(c=>/structure|organization/.test(c.templateId))??result.at(-1)
 if(target&&negative.length){
  const detail=negative.map(c=>`sin ${c.values.join(' ni ')}`).join('; ')
  if(!target.coveredTaskConditionIds?.some(id=>negative.some(c=>c.id===id))){
   target.observable+=` Respeta la exclusión: ${detail}.`
   target.progressionLevels=[target.progressionLevels[0]+` Respeta la exclusión: ${detail}.`,...target.progressionLevels.slice(1)] as Criterion['progressionLevels']
   target.coveredTaskConditionIds=[...(target.coveredTaskConditionIds??[]),...negative.map(c=>c.id)]
   target.checklistParts=undefined
  }
 }
 return result
}
