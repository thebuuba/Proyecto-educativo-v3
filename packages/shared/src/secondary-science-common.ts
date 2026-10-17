import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentType,InstrumentRecommendation} from './instrument-recommendation'
import type {CommonScienceTopic} from './secondary-science-common-types'
import {commonScienceGradeOneTopics} from './secondary-science-grade-1'
import {commonScienceGradeTwoTopics} from './secondary-science-grade-2'
import {commonScienceGradeThreeTopics} from './secondary-science-grade-3'
import {commonScienceGradeFourTopics} from './secondary-science-grade-4'
import {resolveEvaluationTask} from './evaluation-task-contract'

export const commonScienceTopicsByGrade:Record<number,CommonScienceTopic[]>={1:commonScienceGradeOneTopics,2:commonScienceGradeTwoTopics,3:commonScienceGradeThreeTopics,4:commonScienceGradeFourTopics}
export const commonScienceModules=Object.entries(commonScienceTopicsByGrade).map(([grade,topics])=>({id:`ciencias-naturaleza-comun-${grade}`,grade:Number(grade),topics,policy:'REQUESTED_SCIENTIFIC_ACTIONS_V1'}))
const normalize=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const actionVerb='(?:explic\\w*|describ\\w*|observ\\w*|registr\\w*|identific\\w*|senal\\w*|rotul\\w*|clasific(?:a|an|ar|e|en|aran|ando)|orden\\w*|compar(?:a|an|ar|e|en|aran|ando)|contrast\\w*|analiz\\w*|interpret\\w*|calcul(?:a|an|ar|e|en|aran|ando)|resuel\\w*|resolv\\w*|resolver\\w*|formul\\w*|plante\\w*|realiz\\w*|ejecut\\w*|investig\\w*|consult\\w*|dibuj\\w*|represent\\w*|constru\\w*|elabor\\w*|redact\\w*|escrib\\w*|debat\\w*|argument\\w*|expon\\w*|present\\w*|recolect\\w*|recog\\w*|mid\\w*|medir\\w*|verific\\w*|comprob\\w*)'
export function scienceRequirementText(value:string){
 return normalize(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' '))
  .replace(/\b(?:expliqu|clasifiqu|identifiqu|verifiqu|justifiqu)(?:e|en)\b/g,word=>word.replace('qu','c'))
  .replace(/\b(?:realic|analic|organiz)(?:e|en)\b/g,word=>word.replace('ic','iz'))
  .replace(/\b(?:recursos?|ejemplos?)\s*:[^.;\n]*/g,'')
  .replace(/\b(?:como recurso|como ejemplo|por ejemplo)[^.;\n]*/g,'')
  .replace(/\b(?:podran|pueden|puede|podra)\s+(?:utiliz\w*|usar\w*|apoy\w*)[^.;\n]*/g,'')
  .replace(/\b(?:no\s+(?:(?:se|deben?)\s+)?|sin\s+)(?:solicitar|pedir|requerir)\b[^.;\n]*/g,'')
  .replace(/\b(?:no|sin)\s+(?:celula\s+)?(?:animal|vegetal)\b/g,'')
  .replace(new RegExp(`\\b(?:no\\s+(?:(?:se|deben?|es necesario|hay que)\\s+)?|sin\\s+)${actionVerb}[^.;\\n]*`,'g'),'').trim()
}
type Action={text:string;topics:CommonScienceTopic[]}
export type CommonScienceTask={grade:number;actions:Action[];activityType:string;technique:string}
const explanation=(text:string)=>/\bexplic\w*\b/.test(text)
const cognitiveBefore=(text:string,action:RegExp)=>{
 const operation=text.search(action),cognitive=text.search(/\b(?:explic\w*|describ\w*|analiz\w*|interpret\w*)\b/)
 return operation>=0&&cognitive>=0&&cognitive<operation
}
const solves=(text:string)=>/\b(?:resuel\w*|resolv\w*|resolver\w*)\b/.test(text)&&!cognitiveBefore(text,/\b(?:resuel\w*|resolv\w*|resolver\w*)\b/)
const computes=(text:string)=>(/\bcalcul(?:a|an|ar|e|en|aran|ando)\b/.test(text)||solves(text)&&/\b(?:calculos?|operaciones|numericos?|probabilidad|porcentajes?|densidad|voltaje|corriente|resistencia|ohm)\b/.test(text))&&!cognitiveBefore(text,/\b(?:calcul(?:a|an|ar|e|en|aran|ando)|resuel\w*|resolv\w*|resolver\w*)\b/)
const investigates=(text:string)=>/\b(?:investig(?:a|an|ar|ue|uen|aran|ando)|consult\w*)\b|\bproyecto de investigacion\b/.test(text)
const compares=(text:string)=>/\b(?:compar(?:a|an|ar|e|en|aran|ando)|contrast(?:a|an|ar|e|en|aran|ando)|distingu(?:e|en|ir|ira|iran|iendo)|disting(?:a|an))\b|\b(?:realiz\w*|elabor\w*|present\w*|redact\w*)\s+(?:una?\s+)?comparacion\b/.test(text)
const identifies=(text:string)=>/\b(?:(?:identific|senal|rotul)(?:a|an|ar|e|en|aran|ando))\b/.test(text)
const contrastsHypothesis=(text:string)=>compares(text)&&/hipotesis/.test(text)
const procedure=(text:string)=>!cognitiveBefore(text,/\b(?:realiz\w*|ejecut\w*|desarroll\w*)\b/)&&/\b(?:realiz\w*|ejecut\w*|desarroll\w*)\b(?:(?!\b(?:exposicion|informe|presentacion|sobre)\b)[^.;])*\b(?:practica|experimento|experiencia experimental)\b/.test(text)
const represents=(text:string)=>/\b(?:(?:dibuj|represent|elabor)(?:a|an|ar|e|en|aran|ando)|constru(?:ye|yen|ir|ya|yan|iran|yendo))\b/.test(text)&&/\bdibujo\b|\bmaqueta\b|\bmodelo\b|\besquema\b|\bdibuj\w*\b|\brepresent\w*\b(?!\s+para\b)/.test(text)
const constructsDevice=(text:string)=>/\bconstru(?:ye|yen|ir|ya|yan|iran|yendo)\b/.test(text)&&/circuito|polea|maquina|estructura|dispositivo|instrumento optico/.test(text)&&!cognitiveBefore(text,/\bconstru(?:ye|yen|ir|ya|yan|iran|yendo)\b/)
const designs=(text:string)=>/\bdisen(?:a|an|ar|e|en|aran|ando)\b/.test(text)&&!cognitiveBefore(text,/\bdisen(?:a|an|ar|e|en|aran|ando)\b/)
const oralRequested=(text:string)=>resolveEvaluationTask('',text).oral||/\b(?:expon\w*|exposicion|presentacion oral)\b/.test(text)
function focusedTopic(t:CommonScienceTopic,text:string):CommonScienceTopic{
 if(t.grade===4){
  if(t.id==='cell-theory'&&!/teoria/.test(text))return{...t,label:'evidencias microscópicas de células',relation:'las características celulares reconocibles en las imágenes u observaciones microscópicas solicitadas y los límites de la evidencia disponible'}
  if(t.id==='cell-energy'&&!/mitocondria/.test(text))return{...t,label:'ATP y energía celular',relation:'la función del ATP en la transferencia de energía celular, sin equiparar la molécula con energía en sí misma'}
  if(t.id==='photosynthesis'&&!/fase|oscura|luminosa/.test(text))return{...t,relation:'la transformación de materia y energía durante la fotosíntesis y su relación con los factores o estructuras expresamente solicitados'}
  if(t.id==='membrane-transport'&&/osmosis/.test(text)&&!/difusion|activo/.test(text))return{...t,label:'ósmosis',relation:'el movimiento neto de agua a través de una membrana selectivamente permeable según las condiciones del sistema estudiado'}
  if(t.id==='genetic-variation'&&/ligad[oa]s? al sexo/.test(text))return{...t,label:'herencia ligada al sexo',relation:'la transmisión de los alelos ligados a cromosomas sexuales en el modelo del caso ficticio solicitado, sin inferir información familiar personal'}
  if(t.id==='classification'&&!/clasific|binomial|linneo|taxonom/.test(text))return{...t,label:'organismos solicitados',relation:'las estructuras y funciones solicitadas de los organismos del modelo o fuente, distinguiendo los grupos presentes sin imponer una clasificación adicional'}
 }
 if(t.id==='sound'&&/radar/.test(text))return /sonar|ultrasonido|sonido|oido|audicion|ecolocal/.test(text)
  ?{...t,label:'sonido y localización por ondas',relation:'las ondas mecánicas del sonido y sonar frente a las ondas electromagnéticas del radar en los sistemas solicitados, sin confundir sus mecanismos de propagación y detección'}
  :{...t,label:'radar',relation:'la emisión y recepción de ondas electromagnéticas para la detección o localización descrita, según el modelo proporcionado'}
 if(t.id==='energy-conservation'&&!/eficien|sosten|utiliz|racional/.test(text))return{...t,relation:'las transferencias y transformaciones de energía del sistema delimitado, conservando el balance energético sin confundir conservación con ausencia de disipación'}
 if(t.id==='waves'&&/longitudinal|transversal/.test(text))return{...t,relation:'la orientación de la oscilación respecto a la dirección de propagación, distinguiendo orientación paralela y perpendicular en las ondas solicitadas'}
 if(t.id==='radiation'&&/ionizante/.test(text))return{...t,relation:'la energía de la radiación y su capacidad de producir ionización, distinguiendo los tipos estudiados sin equiparar no ionizante con ausencia de efectos'}
 if(t.grade!==4&&t.id==='immunity'&&!/alerg|asma|autoinmun|deficiencia|alteracion|enfermedad/.test(text))return{...t,relation:'la función de defensa del sistema inmunológico y las relaciones entre sus componentes solicitados'}
 if(t.id==='mendel'&&/aportes|trabajos|historia/.test(text))return{...t,label:'aportes de Gregorio Mendel',relation:'los aportes documentados de Gregorio Mendel y su relación con el estudio de la herencia'}
 if(t.id==='nucleic-acids'){
  const dna=/\badn\b|desoxirribonucleico|doble helice/.test(text),rna=/\barn\b|(?<!desoxir)ribonucleico/.test(text)
  return{...t,label:dna&&rna?'ADN y ARN':dna?'ADN':rna?'ARN':t.label}
 }
 if(t.id!=='cells')return t
 const animal=/\banimal\b/.test(text),plant=/\bvegetal\b/.test(text)
 const choice=/\banimal\s+o\s+(?:celula\s+)?vegetal\b|\bvegetal\s+o\s+(?:celula\s+)?animal\b/.test(text)
 const euk=/\beucariot\w*/.test(text),pro=/\bprocariot\w*/.test(text)
 const label=euk&&pro?'células eucariotas y procariotas':euk?'células eucariotas':pro?'células procariotas':animal&&plant?choice?'tipo celular elegido (animal o vegetal)':'célula animal y vegetal':animal?'célula animal':plant?'célula vegetal':'células solicitadas'
 return{...t,label,relation:`la organización y las relaciones entre las estructuras y funciones solicitadas de ${label}`}
}
export function resolveCommonScienceTask(title:string,description:string,context?:InstrumentAcademicContext|null):CommonScienceTask|null{
 if(context?.level!=='SECONDARY'||context.optativeExitName)return null
 const codes=['NAT-TU','NAT-VIDA','NAT-FISICAS','NAT-BIO','NAT-QUI','NAT-FIS'],code=context.subjectCode.trim().toUpperCase()
 if(code!=='NAT'&&code!==codes[context.grade-1])return null
 const topics=commonScienceTopicsByGrade[context.grade];if(!topics)return null
 const text=scienceRequirementText(description.trim()||title)
 const find=(part:string)=>topics.filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(part)&&(!t.exclude||!new RegExp(t.exclude).test(part)))
  .filter(t=>t.id!=='ecosystems'||!/flujo de energia/.test(part)||/estructura|funcion|sucesion|componentes|interacciones/.test(part))
  .filter(t=>t.id!=='circuits'||!/corriente electrica|voltaje|pilas|baterias/.test(part)||/serie|paralelo|conexiones|conservacion|constru(?:ye|yen|ir|ya|yan)|(?:interpret\w*|analiz\w*)[^.;]*circuito/.test(part))
  .filter(t=>t.id!=='solutions'||!/mezcla|coloide/.test(part)||/concentracion|solubilidad/.test(part)).map(t=>focusedTopic(t,part))
 // A nonempty description never inherits a former title's scientific subject.
 const selected=find(text);if(!selected.length)return null
 const split=new RegExp(`(?:[.;\\n]\\s*|\\s+(?:y|e|luego|despues)\\s+)(?=(?:(?:los estudiantes|cada estudiante)\\s+)?${actionVerb}\\b)`,'g')
 let previous=selected
 const actions=text.split(split).filter(Boolean).map(part=>{const own=find(part);previous=own.length?own:previous;return{text:part,topics:previous}})
 const designedProduct=actions.some(a=>constructsDevice(a.text)||designs(a.text))
 const cellModel=(context.grade===2||context.grade===4)&&actions.some(a=>represents(a.text)&&/maqueta|modelo/.test(a.text)&&!cognitiveBefore(a.text,/\b(?:dibuj\w*|represent\w*|constru\w*|elabor\w*)\b/))
 const activityType=actions.some(a=>procedure(a.text))?'LAB_PRACTICE':/\b(?:redact\w*|elabor\w*|escrib\w*)\b.*\binforme\b/.test(text)?'REPORT':investigates(text)?'RESEARCH':designedProduct||cellModel?'PROJECT':/\b(?:debat\w*|debate)\b/.test(text)?'DEBATE':oralRequested(text)?'ORAL_PRESENTATION':actions.some(a=>computes(a.text)||solves(a.text))?'EXERCISE_SET':/\b(?:elabor\w*|desarroll\w*)\b.*\bproyecto\b/.test(text)?'PROJECT':/\b(?:observ\w*|registr\w*)\b/.test(text)&&!explanation(text)?'OBSERVATION':actions.some(a=>compares(a.text)&&!contrastsHypothesis(a.text))?'COMPARISON':'ANALYSIS'
 const technique=activityType==='LAB_PRACTICE'||activityType==='OBSERVATION'?'observacion-sistematica':activityType==='DEBATE'?'debate':activityType==='ORAL_PRESENTATION'?'presentacion':activityType==='RESEARCH'||activityType==='PROJECT'?'proyecto':'analisis-producciones'
 return{grade:context.grade,actions,activityType,technique}
}
type Levels=ContextualTopicCriterion['progressionLevels']
/** Each row has an observable success condition and distinct, non-personal progression. */
function row(t:CommonScienceTopic,key:string,title:string,success:string,partial:string,error:string,weight=3):ContextualTopicCriterion{
 const progressionLevels:Levels=[success,`${success} Presenta una imprecisión puntual que no cambia la relación principal.`,partial,error,`No aporta evidencia verificable del desempeño solicitado sobre ${t.label}.`]
 return{templateId:`nat-${t.grade}-${t.id}-${key}`,title,observable:success,progressionLevels,weight}
}
function actionCriteria({text,topics}:Action):ContextualTopicCriterion[]{
 const alternatives=text.split(new RegExp(`\\s+(?:o bien|o)\\s+(?!(?:dibujo|registro|calculo|\\w*cion(?:es)?)\\b)(?=${actionVerb}\\b)`))
 if(alternatives.length>1){
  const branches=alternatives.map(text=>{
   const own=topics.filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(text))
   return actionCriteria({text,topics:own.length?own:topics})
  })
  const progressionLevels=[0,1,2,3,4].map(level=>`En la alternativa elegida: ${branches.map(rows=>rows.map(r=>r.progressionLevels[level]).join(' ')).join(' O BIEN: ')}`) as Levels
  return[{templateId:`nat-${topics[0].grade}-${topics[0].id}-alternative`,title:'Alternativa científica solicitada',observable:progressionLevels[0],progressionLevels,weight:4}]
 }
 const rows:ContextualTopicCriterion[]=[]
 for(const t of topics){
  const add=(key:string,title:string,success:string,partial:string,error:string,weight=3)=>rows.push(row(t,key,title,success,partial,error,weight))
  const label=t.label,relation=t.relation,cell=t.id==='cells'
  const executing=procedure(text),data=/\b(?:analiz\w*|interpret\w*)\b/.test(text)&&/datos|tabla|grafic[ao]|observaciones|resultados/.test(text)
  const deviceConstruction=constructsDevice(text)&&!represents(text)
  const hypothesizes=/\b(?:formul\w*|plante\w*)\b.*\bhipotesis\b/.test(text)
  const question=/\b(?:formul\w*|plante\w*)\b.*\bpreguntas?\b/.test(text)
  const report=/\b(?:redact\w*|elabor\w*|escrib\w*)\b.*\binforme\b/.test(text)
  const representation=represents(text)&&!cognitiveBefore(text,/\b(?:dibuj\w*|represent\w*|constru\w*|elabor\w*)\b/)
  const alternative=representation&&/\bdibujo\s+o\s+(?:una?\s+)?maqueta\b|\bmaqueta\s+o\s+(?:una?\s+)?dibujo\b/.test(text)
  const cellFunctions=cell&&/funcion/.test(text)&&explanation(text),cellParts=cell&&/partes|estructur/.test(text)&&explanation(text)
  if(explanation(text)&&!cellFunctions&&!cellParts)add('explanation',`Explicación de ${label}`,`Explica ${relation} con afirmaciones científicamente compatibles con la información disponible.`,`Explica parte de ${label}, pero deja sin relacionar un elemento necesario para entender el fenómeno.`,`La explicación de ${label} contradice la relación científica estudiada.`,4)
  if(cellParts&&!identifies(text))add('structures-explanation',`Partes de ${label}`,`Explica las características y relaciones de las partes solicitadas de ${label}, distinguiendo sus componentes sin exigir una representación gráfica.`,`Describe parte de las estructuras de ${label}, pero confunde una relación entre sus componentes.`,`La explicación atribuye a ${label} estructuras incompatibles con su organización.`,4)
  if(cellFunctions)add('functions',`Funciones de ${label}`,`Relaciona las estructuras solicitadas de ${label} con sus funciones y explica su contribución al funcionamiento celular.`,`Relaciona parte de las estructuras de ${label} con sus funciones, pero una relación queda sin explicar.`,`Atribuye a las estructuras de ${label} funciones incompatibles con el funcionamiento celular.`,4)
  if(compares(text)&&!contrastsHypothesis(text))add('comparison',`Comparación de ${label}`,`Compara los casos solicitados de ${label} mediante características científicas comunes coherentes con ${relation}, distinguiendo semejanzas y diferencias respaldadas por la información disponible.`,`Describe los casos de ${label}, pero compara con características distintas o deja sin justificar una diferencia.`,`Atribuye semejanzas o diferencias a ${label} que contradicen las características examinadas.`)
  if(/\b(?:mid(?:e|en|a|an|iendo)|medir(?:an|a)?)\b/.test(text)&&!cognitiveBefore(text,/\b(?:mid\w*|medir\w*)\b/))add('measurement',`Medición de ${label}`,`Mide la magnitud solicitada de ${label} utilizando el patrón o instrumento indicado y expresa el resultado con la unidad o referencia correspondiente, reconociendo la resolución o incertidumbre cuando se pida.`,`Obtiene una medición de ${label}, pero una lectura o referencia impide interpretar su precisión.`,`El valor presentado de ${label} no corresponde a la magnitud o referencia de la medición solicitada.`,4)
  if(designs(text))add('design',`Diseño sobre ${label}`,`El diseño solicitado de ${label} organiza sus componentes o categorías de forma coherente con ${relation}, permitiendo reconocer su propósito y las condiciones indicadas sin atribuir una construcción no realizada.`,`El diseño de ${label} responde al propósito, pero una relación o categoría no es consistente con las condiciones indicadas.`,`El diseño de ${label} no permite reconocer el propósito o utiliza relaciones incompatibles con el contenido científico.`,4)
  if(deviceConstruction)add('construction',`Construcción sobre ${label}`,`Construye el dispositivo solicitado de ${label} conforme al diseño indicado, manteniendo la disposición y las relaciones necesarias para ${relation}, sin exigir componentes o materiales adicionales.`,`La construcción de ${label} conserva parte del diseño, pero una conexión o disposición no mantiene la relación científica solicitada.`,`La construcción de ${label} presenta una disposición incompatible con el diseño o la función solicitada.`,4)
  if(deviceConstruction&&!executing&&/precaucion|seguridad|riesgo/.test(text))add('construction-safety',`Precauciones de construcción sobre ${label}`,`Aplica las precauciones de construcción indicadas para ${label} y comunica incidencias que impidan continuar de forma segura.`,`Aplica parte de las precauciones de ${label}, pero necesita corregir una condición indicada.`,`Mantiene una condición de riesgo identificada sin aplicar las precauciones indicadas.`,2)
  if(contrastsHypothesis(text))add('hypothesis-evidence',`Contraste de hipótesis sobre ${label}`,`Contrasta la hipótesis de ${label} con las evidencias registradas y determina qué respaldan, contradicen o dejan sin resolver, reconociendo resultados inesperados y limitaciones sin exigir su confirmación.`,`Relaciona parte de las evidencias de ${label} con la hipótesis, pero deja una inferencia sin respaldo.`,`Sostiene o rechaza la hipótesis de ${label} sin atender a las evidencias disponibles o cambia las observaciones para ajustarlas a lo esperado.`,4)
  if(identifies(text))add('identification',`Identificación de ${label}`,`Identifica los elementos solicitados de ${label} por sus características observables o las referencias proporcionadas.`,`Identifica parte de los elementos de ${label}, pero confunde una característica que permite distinguirlos.`,`Asigna nombres o características incompatibles con los elementos solicitados de ${label}.`)
  if(/\bclasific(?:a|an|ar|e|en|aran|ando)\b/.test(text))add('classification',`Clasificación de ${label}`,`Agrupa los elementos solicitados de ${label} aplicando de forma consistente la característica científica que define cada categoría.`,`Clasifica parte de ${label}, pero cambia de característica entre categorías.`,`La clasificación de ${label} contradice las características de los elementos.`)
  if(/\borden\w*\b/.test(text))add('sequence',`Secuencia de ${label}`,`Ordena los elementos o etapas solicitados de ${label}, manteniendo ${relation} y la correspondencia con las referencias proporcionadas.`,`Ordena parte de ${label}, pero una transición no mantiene la relación científica solicitada.`,`La secuencia de ${label} contradice el orden o la integración de los elementos del modelo estudiado.`)
  if(representation)add('representation',`Representación de ${label}`,`${alternative?'En la alternativa elegida, dibujo o maqueta, representa':'Representa'} los elementos solicitados de ${label} y sus relaciones científicas, conservando ${relation}; los rótulos o referencias permiten reconocerlos sin valorar destreza artística.`,`La representación permite reconocer parte de ${label}, pero omite o confunde una relación solicitada.`,`La representación de ${label} altera la ubicación o relación científica de los elementos solicitados.`,4)
  const dataSource=/\b(?:obtenid\w*|registrad\w*|recolectad\w*|recogid\w*)\b/.test(text)?'datos registrados':/\b(?:proporcionad\w*|dados?|tabla|grafic[ao])\b/.test(text)?'datos proporcionados':'datos disponibles'
  if(data)add('data-interpretation',`Interpretación de datos de ${label}`,`Interpreta los ${dataSource} de ${label}, relacionando las variaciones o diferencias con ${relation}, y limita las inferencias a la información disponible.`,`Reconoce datos de ${label}, pero una inferencia no queda respaldada por la evidencia disponible.`,`La interpretación contradice los ${dataSource} de ${label} o inventa observaciones.`,4)
  if(!data&&/\b(?:analiz\w*|interpret\w*)\b/.test(text))add('analysis',`Análisis de ${label}`,`Analiza la información proporcionada de ${label} y relaciona sus evidencias con ${relation}, distinguiendo lo que permite sostener de lo que queda sin determinar.`,`Reconoce información sobre ${label}, pero no conecta una evidencia necesaria con la relación estudiada.`,`El análisis de ${label} contradice la información proporcionada o le atribuye evidencias ausentes.`,4)
  if(!representation&&/^\s*(?:constru\w*|elabor\w*)\b/.test(text)&&/higrometro|filtro/.test(text))add('construction',`Funcionamiento del dispositivo de ${label}`,`Construye el dispositivo solicitado de ${label} conforme al diseño indicado y comprueba su respuesta en las condiciones propuestas, reconociendo ${relation}.`,`El dispositivo de ${label} conserva parte del diseño, pero una conexión o disposición impide relacionar su respuesta con el propósito indicado.`,`El dispositivo de ${label} no permite observar la respuesta prevista por el diseño indicado.`,4)
  if(/\b(?:elabor\w*|desarroll\w*)\b.*\bproyecto\b/.test(text))add('project',`Coherencia del proyecto de ${label}`,`El producto del proyecto relaciona su propósito de ${label}, la evidencia solicitada y la propuesta presentada, atendiendo a ${relation} sin atribuir acciones no realizadas.`,`El proyecto de ${label} presenta un producto, pero no vincula una decisión con la evidencia solicitada.`,`El producto del proyecto de ${label} no responde a su propósito o se apoya en evidencias inventadas.`,4)
  if(computes(text)){
   add('calculation',`Procedimiento de cálculo de ${label}`,`Relaciona los datos y la incógnita de ${label} mediante ${relation} y realiza las operaciones solicitadas sin inventar valores ausentes.`,`Utiliza parte de los datos de ${label}, pero un paso no mantiene la relación necesaria para resolver la incógnita.`,`El procedimiento emplea una relación incompatible con los datos o la incógnita de ${label}.`,4)
   add('result',`Resultado de ${label}`,`Presenta un resultado coherente con las operaciones de ${label} y conserva las magnitudes y unidades que corresponden a los datos del enunciado.`,`El resultado de ${label} conserva parte del procedimiento, pero una operación o unidad impide interpretarlo por completo.`,`El resultado de ${label} contradice el procedimiento o confunde magnitudes.`,2)
  }
  if(solves(text)&&!computes(text))add('problem-reasoning',`Resolución de problemas de ${label}`,`Utiliza los datos y condiciones del ejercicio de ${label} para deducir una respuesta compatible con ${relation}, mostrando las relaciones que la sustentan sin inventar información ausente.`,`Deduce parte de la respuesta de ${label}, pero una relación necesaria no queda respaldada por los datos del ejercicio.`,`La respuesta de ${label} contradice los datos o utiliza una relación científica incompatible con el ejercicio.`,4)
  if(hypothesizes)add('hypothesis',`Hipótesis sobre ${label}`,`Formula una hipótesis contrastable sobre ${label}, relacionando las condiciones y el posible efecto de forma compatible con ${relation}; se evalúa su planteamiento, sin exigir que se confirme.`,`La hipótesis sobre ${label} propone una relación, pero no permite reconocer qué evidencia la contrastaría.`,`La afirmación sobre ${label} no es contrastable o no responde al fenómeno planteado.`)
  if(question)add('question',`Pregunta sobre ${label}`,`Formula una pregunta investigable sobre ${label} que delimita el fenómeno y la evidencia necesaria para responderla.`,`La pregunta se relaciona con ${label}, pero no delimita qué se pretende conocer.`,`La pregunta no se relaciona con el fenómeno de ${label} solicitado.`)
  if(executing){
   add('experiment-procedure',`Procedimiento de la práctica de ${label}`,`Ejecuta el procedimiento indicado para estudiar ${label}, manteniendo las condiciones especificadas y registrando cambios o incidencias que afectan la comparación.`,`Ejecuta parte del procedimiento de ${label}, pero omite una condición indicada que dificulta comparar observaciones.`,`Cambia condiciones esenciales de la práctica de ${label} sin registrarlas, impidiendo relacionar el procedimiento con las observaciones.`,4)
   add('experiment-record',`Registro de observaciones de ${label}`,`Registra fielmente las observaciones de la práctica de ${label}, incluidos resultados inesperados, distinguiendo lo observado de su interpretación, sin inventar resultados.`,`Registra observaciones de ${label}, pero omite información necesaria para relacionarlas con el procedimiento realizado.`,`El registro de ${label} no corresponde al procedimiento observado o sustituye los resultados por lo que esperaba obtener.`)
   // Safety only for an actual practice; no new materials or hazardous instructions.
   add('safety',`Seguridad durante la práctica de ${label}`,`Aplica las precauciones indicadas para la práctica de ${label} y comunica las incidencias observadas antes de continuar cuando exista un riesgo.`,`Aplica parte de las precauciones indicadas en la práctica de ${label}, pero necesita corregir una condición de riesgo.`,`Mantiene una condición de riesgo identificada en la práctica de ${label} sin aplicar la precaución indicada.`,2)
  }
  if(/\b(?:observ\w*|registr\w*|describ\w*)\b/.test(text)&&!executing&&!data)add('observation',`Observación de ${label}`,`Describe o registra las características observadas de ${label}, diferenciándolas de inferencias y manteniendo las condiciones expresamente solicitadas.`,`Registra parte de las características de ${label}, pero mezcla una inferencia con lo observado.`,`El registro de ${label} contradice la evidencia observada o aporta datos inventados.`)
  if(investigates(text)&&!/^\s*(?:explic\w*|describ\w*)\b/.test(text))add('research',`Investigación de ${label}`,`Selecciona información verificable que responde a la investigación solicitada sobre ${label}, identifica su procedencia y distingue afirmaciones respaldadas de información insuficiente.`,`Reúne información de ${label}, pero una afirmación relevante carece de procedencia o respaldo verificable.`,`La información presentada sobre ${label} no responde a la investigación o contradice las fuentes examinadas.`,4)
  if(report)add('report',`Informe sobre ${label}`,`Organiza el informe solicitado de ${label} enlazando propósito, evidencia disponible e interpretación, distinguiendo procedimientos propios de datos o experiencias proporcionados.`,`El informe de ${label} presenta evidencia, pero no permite relacionar una interpretación con su procedencia.`,`El informe de ${label} atribuye procedimientos o resultados no realizados ni proporcionados.`,4)
  if(/\b(?:debat\w*|argument\w*)\b/.test(text))add('argument',`Argumentación sobre ${label}`,`Sustenta la postura solicitada sobre ${label} con evidencias pertinentes y distingue sus alcances de afirmaciones que la información disponible no permite sostener.`,`Presenta una postura sobre ${label}, pero parte de sus razones carece de respaldo pertinente.`,`La postura sobre ${label} se apoya en afirmaciones incompatibles con las evidencias examinadas.`,4)
  if(oralRequested(text))add('oral',`Comunicación científica de ${label}`,`Comunica oralmente ${relation} en una secuencia comprensible y utiliza los términos científicos necesarios o los apoyos de acceso acordados.`,`Comunica ideas sobre ${label}, pero una relación queda ambigua por su organización o por el uso de términos.`,`La comunicación de ${label} no permite reconocer la relación científica solicitada.`)
  if(!rows.some(r=>r.templateId.startsWith(`nat-${t.grade}-${t.id}-`)))add('content',`Relaciones de ${label}`,`Presenta evidencia de ${relation} pertinente al producto solicitado y científicamente compatible con la información disponible.`,`Presenta parte de ${label}, pero omite una relación necesaria para entender la evidencia.`,`La evidencia de ${label} contradice la relación científica estudiada.`)
 }
 return rows
}
export function commonScienceCriteria(task:CommonScienceTask){
 const actions=task.actions.map(a=>({...a,topics:a.topics.flatMap(t=>{
  const facets=t.facets?.filter(f=>new RegExp(f.match).test(a.text))
  return facets?.length?facets.map(f=>({...t,id:`${t.id}-${f.id}`,label:f.label,relation:f.relation,facets:undefined})):[t]
 })}))
 const rows=actions.flatMap(actionCriteria)
 return rows.filter((r,i)=>rows.findIndex(o=>o.templateId===r.templateId)===i)
  .filter(r=>!r.templateId.endsWith('-observation')||!rows.some(o=>o.templateId===r.templateId.replace(/-observation$/,'-experiment-record')))
}
export function commonScienceSelections(task:CommonScienceTask,description:string){
 const text=scienceRequirementText(description)
 const suggestedInstrumentType:InstrumentType=/credito parcial|ponder\w*|puntos por|pesos por/.test(text)?'lista-ponderada':/frecuencia|regularidad/.test(text)&&task.actions.some(a=>procedure(a.text)||/observ\w*|registr\w*/.test(a.text))?'escala':['DEBATE','ORAL_PRESENTATION','REPORT'].includes(task.activityType)||task.actions.some(a=>explanation(a.text)||/compar\w*|analiz\w*|interpret\w*|hipotesis|argument\w*|investig\w*/.test(a.text))?'rubrica':'lista-cotejo'
 return{suggestedInstrumentType,suggestedEvaluationTechnique:task.technique}
}
export function adaptScienceScale(proposal:InstrumentRecommendation,description:string):InstrumentRecommendation{
 if(proposal.instrumentType!=='escala')return proposal
 const text=scienceRequirementText(description),frequency=/frecuencia|regularidad/.test(text)&&/observ\w*|registr\w*/.test(text)
 const indexes=proposal.levels.length===4?[0,1,2,4]:[0,1,2,3,4]
 const labels=frequency?['Siempre','Frecuentemente','A veces','Rara vez','Todavía no']:['Completo','Suficiente','Parcial','Incipiente','Aún no logrado']
 const descriptors=['En todas las oportunidades observadas.','En la mayoría de las oportunidades observadas.','En algunas oportunidades observadas.','En pocas oportunidades observadas.','En ninguna oportunidad observada.']
 return{...proposal,levels:proposal.levels.map((l,i)=>({...l,label:labels[indexes[i]]})),criteria:proposal.criteria.map(c=>({...c,descriptors:c.descriptors.map((d,i)=>({...d,text:frequency?descriptors[indexes[i]]:c.progressionLevels?.[indexes[i]]??d.text}))}))}
}
