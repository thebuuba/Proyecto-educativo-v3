import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'
import type {CommonScienceTask} from './secondary-science-common'
import {extractTaskRequirements,taskConditionLabel} from './task-presentation-requirements'
import {actionableTaskConditions} from './task-requirement-criteria'

export const scienceReportGeneratorVersion='science-descriptive-report-v1'

/** Existing scientific topics, limited to an explicitly descriptive/explanatory report purpose. */
export function descriptiveScienceReportCriteria(task:CommonScienceTask):Criterion[]|null{
 if(task.reportPurpose!=='DESCRIPTIVE')return null
 const text=task.actions.map(a=>a.text).join('. '),report=extractTaskRequirements(task.description??text)
 const requested=actionableTaskConditions(report)
 const topics=[...new Map(task.actions.flatMap(a=>a.topics).map(t=>[t.id,t])).values()]
 const rows:Criterion[]=[]
 const add=(key:string,title:string,levels:Criterion['progressionLevels'],weight:number,ids:string[]=[])=>{
  rows.push({templateId:`nat-${task.grade}-descriptive-${key}`,title,observable:levels[0],progressionLevels:levels,weight,coveredTaskConditionIds:ids})
 }
 const names=topics.map(t=>t.id==='earth-structure'
  ?['corteza','manto','núcleo'].filter(n=>text.includes(n.normalize('NFD').replace(/\p{M}/gu,''))).join(', ')||t.label
  :t.id==='atmosphere'&&/\bcapas\b/.test(text)?`las capas de ${t.label}`:t.label).join('; ')
 add('description','Descripción científica del contenido',[
  `Describe ${names} con características científicas que permiten reconocer cada elemento solicitado, sin confundir sus nombres ni atribuirles rasgos de otros elementos.`,
  `Describe ${names} y permite reconocer los elementos; alguna característica queda enunciada sin aclarar a cuál corresponde.`,
  `Describe solo parte de ${names} o mezcla características que impiden distinguir algunos elementos.`,
  `Los nombres y las características atribuidos a ${names} se contradicen y no permiten reconocer los elementos descritos.`,
  `No presenta una descripción científica reconocible de ${names}.`,
 ],4)
 if(/\bdiferencias\b|\bcompar\w*\b|\bdisting\w*\b/.test(text))add('differences','Diferencias entre los elementos descritos',[
  `Explica diferencias entre ${names}, comparando características equivalentes y manteniendo correspondencia con su descripción científica.`,
  `Explica diferencias pertinentes entre ${names}, pero deja implícita la característica utilizada en alguna comparación.`,
  `Enumera características de ${names}, pero no explica sus diferencias o compara características que no corresponden entre sí.`,
  `Atribuye a ${names} diferencias incompatibles con sus características científicas.`,
  `No establece diferencias entre ${names}.`,
 ],4)
 const drawings=requested.filter(c=>c.property==='drawing')
 if(drawings.length){
  const details=drawings.map(taskConditionLabel).join('; ')
  const labeled=drawings.some(c=>/nombre|r[oó]tul|etiquet/.test(c.values.join(' ')))
  const placed=drawings.some(c=>c.scope!=='documento')
  add('drawing','Representación científica y rótulos',[
   `El dibujo representa ${names} con una disposición científicamente coherente${labeled?'; los nombres o rótulos identifican las partes representadas':''}. Recurso solicitado: ${details}. Se evalúa la representación científica, sin valorar destreza artística.`,
   `La disposición permite reconocer ${names}, pero una relación entre el dibujo y su descripción queda poco clara${labeled?', algún rótulo no corresponde con claridad a la parte señalada':''}${placed?' o el dibujo está fuera de la ubicación solicitada':''}. Recurso: ${details}.`,
   `El dibujo muestra solo parte de ${names}${labeled?' o deja partes sin nombres':''}; la relación entre dibujo y descripción resulta incompleta.`,
   `El dibujo${labeled?' o sus rótulos':''} atribuye a ${names} ubicaciones o relaciones científicas incompatibles con el contenido.`,
   `No presenta el dibujo solicitado de ${names}.`,
  ],3,drawings.map(c=>c.id))
 }
 const sections=requested.filter(c=>c.property==='section'||c.property==='extent'&&/p[aá]rrafo/.test(c.unit??''))
 const details=sections.map(taskConditionLabel).join('; ')
 add('organization','Estructura y claridad del informe',[
  `Ordena la descripción y la explicación de ${names} en una secuencia comprensible; conecta las ideas sin repetirlas ni contradecirlas.${details?' Organización solicitada: '+details+'.':''}`,
  `La descripción y la explicación se comprenden; una transición o la distribución de los párrafos interrumpe su continuidad.${details?' Organización solicitada: '+details+'.':''}`,
  `Se reconocen ideas del contenido, pero las secciones o los párrafos quedan desconectados y no se distingue la función de cada parte.${details?' Organización solicitada: '+details+'.':''}`,
  'El orden de los fragmentos impide seguir la descripción y relacionarla con la explicación.',
  'No presenta un informe organizado que permita seguir las ideas del contenido solicitado.',
 ],2,sections.map(c=>c.id))
 if(/\bortografia\b/.test(text))add('orthography','Ortografía del informe',[
  'La ortografía del informe conserva la escritura correcta de las palabras, la acentuación y las mayúsculas, manteniendo el sentido del texto.',
  'La escritura permite comprender el informe; presenta errores ortográficos localizados que no cambian el sentido de las ideas.',
  'Los errores de escritura o acentuación se repiten y dificultan reconocer palabras o relaciones del informe.',
  'Los errores ortográficos alteran el sentido de las palabras y dificultan comprender las ideas del informe.',
  'No presenta texto legible que permita evaluar la ortografía del informe.',
 ],1)
 return rows
}
