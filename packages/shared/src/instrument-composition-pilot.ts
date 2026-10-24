import type {InstrumentRecommendation,InstrumentType} from './instrument-recommendation'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentAcademicContext} from './secondary-science'
import {completeFirstGradeNewsCriteria} from './secondary-language-grade-one-complete'
import {explicitScienceContent} from './science-presentation-criteria'
import {commonScienceGradeOneTopics} from './secondary-science-grade-1'
import {deliveryCriteria} from './task-delivery-requirements'
import {editableAuthoredRecommendation} from './secondary-topic-recommendation'
import {extractPilotContract,foldPilotText,pilotCompositionVersion,type PilotContract} from './pilot-task-contract'
export {extractPilotContract,pilotCompositionVersion} from './pilot-task-contract'

type Criterion=ContextualTopicCriterion
type Candidate={criterion:Criterion;requirementIds:string[];dimensionIds:string[]}
export type PilotCompositionTrace={
 version:string;contract:PilotContract;links:{criterionId:string;requirementIds:string[];dimensionIds:string[]}[]
 covered:string[];uncovered:string[];enforcedExclusions:string[];rejected:{criterionId:string;reason:string}[]
}
const row=(id:string,title:string,levels:Criterion['progressionLevels'],weight=3):Criterion=>({templateId:id,title,observable:levels[0],progressionLevels:levels,weight})

/** Pure content boundary: neither authorization, catalog retrieval, I/O nor historical mutation. */
export function composePilotInstrument(input:{
 description:string;context:InstrumentAcademicContext|null|undefined;instrumentType:InstrumentType;maxScore:number
 participationMode:'INDIVIDUAL'|'GROUP';activityType?:string;levelCount?:4|5;includeAdditionalCandidates?:boolean
}):InstrumentRecommendation|null{
 const contract=extractPilotContract(input.description,input.context,input.activityType)
 if(!contract)return null
 const candidates:Candidate[]=[],rejected:PilotCompositionTrace['rejected']=[]
 const req=(...keys:string[])=>contract.requirements.filter(r=>keys.includes(r.key)).map(r=>r.id)
 const has=(key:string)=>req(key).length>0
 const candidate=(criterion:Criterion,keys:string[]=[],dimensions:string[]=[])=>candidates.push({criterion,requirementIds:req(...keys),dimensionIds:dimensions})
 if(contract.family==='NEWS'){
  const bindings:Record<string,string[]>={
   'news-essential':['news-product','news-data','news-questions'],'news-structure':['news-parts'],
   'news-sequence':['news-order'],'news-language':['news-tone'],'news-revision':['news-orthography'],
   'news-feature-punctuation':['news-punctuation'],
  }
  for(const criterion of completeFirstGradeNewsCriteria('NEWS_WRITING',input.description)){
   if(bindings[criterion.templateId])candidate(criterion,bindings[criterion.templateId],contract.dimensions.includes(criterion.templateId)?[criterion.templateId]:[])
   else rejected.push({criterionId:criterion.templateId,reason:'No tiene un requisito o dimensión justificados en este piloto.'})
  }
  for(const criterion of deliveryCriteria(input.description,{requestedOnly:true}))candidate(criterion,contract.requirements.filter(r=>r.kind==='PRESENTATION').map(r=>r.key))
 }else if(contract.family==='ORAL_SCIENCE'){
  // Reuse the source-backed coverage candidate only when all planets were actually requested.
  const topic=commonScienceGradeOneTopics.find(t=>t.id==='solar-system')!
  const coverage=explicitScienceContent(topic,foldPilotText(input.description))?.find(c=>c.templateId.endsWith('-coverage'))
  if(has('planets')&&coverage)candidate(coverage,['planets'])
  if(has('planet-explanation'))candidate(row('pilot-planet-explanation','Explicación científica de los planetas',[
   has('planets')?'Explica qué es cada planeta presentado, relacionando su naturaleza planetaria con el sistema solar sin confundir planetas con estrellas o satélites.':'Explica qué son los planetas del sistema solar como cuerpos que orbitan el Sol y distingue su naturaleza planetaria sin confundirlos con estrellas o satélites.',
   'La explicación conserva la naturaleza planetaria; una relación queda enunciada sin aclarar su significado.',
   has('planets')?'Explica la naturaleza de algunos planetas, pero en otros solo aporta nombres o datos aislados.':'Aporta características compatibles de los planetas, pero no explica su relación con el Sol.',
   'La explicación confunde la naturaleza de un planeta con la de una estrella o un satélite.',
   'No aporta una explicación reconocible de los planetas solicitados.',
  ],4),['planet-explanation'],['scientific-precision'])
  const duration=contract.requirements.find(r=>r.key==='duration')
  const time=duration?.origin.text.replace(/^(?:hasta|máximo|aproximadamente|alrededor de|unos|unas|no más de)\s+/i,'')
  const condition=!duration?'':duration.mode==='MAX'?`La exposición no supera ${time}; una duración menor cumple el límite.`:
   duration.mode==='APPROX'?`La exposición dura aproximadamente ${time}, conforme a la consigna y al juicio docente.`:`La exposición dura ${time}, según la duración exacta indicada.`
  const grouped=Boolean(duration&&input.instrumentType!=='lista-cotejo')
  candidate(row('pilot-oral-communication',grouped?'Organización de la explicación oral y duración solicitada':'Comunicación de la explicación oral',[
   'La voz o el medio de acceso oral permite comprender las ideas; el orden y las referencias enlazan las partes de la explicación.'+(grouped?' '+condition:''),
   'La explicación oral se comprende; una transición o referencia poco clara interrumpe una conexión secundaria.'+(grouped?' También corresponde este nivel si las ideas se enlazan claramente pero no se respeta la condición temporal solicitada.':''),
   'Se comprenden ideas aisladas, pero el orden o las referencias dificultan seguir la explicación completa.',
   'La expresión oral o las conexiones entre ideas impiden reconocer el sentido de la explicación.',
   'No hay evidencia oral que permita comprender la explicación solicitada.',
  ],grouped?4:3),grouped?['oral','duration']:['oral'],['oral-communication'])
  if(duration&&!grouped){
   // Checklist has two decisions; this tuple is not exposed as graduated performance.
   candidate(row('pilot-duration','Duración solicitada',[
    condition,condition,`No cumple: ${condition}`,`No cumple: ${condition}`,`No cumple: ${condition}`,
   ],1),['duration'])
  }
  if(has('support')||has('support-choice')){
   const choice=has('support-choice')?'el dibujo o la lámina que eligió':'el material de apoyo solicitado'
   candidate(row('pilot-support','Uso del apoyo solicitado',[
    `Utiliza ${choice} para aclarar las ideas y relaciona lo mostrado con la explicación oral.`,
    `El apoyo elegido corresponde al contenido; una de sus partes se muestra sin vincularla claramente con la explicación.`,
    'Presenta el apoyo solicitado, pero lo muestra sin utilizarlo para explicar las ideas.',
    'El apoyo mostrado contradice el contenido de la explicación o dificulta comprenderlo.',
    'No utiliza el apoyo solicitado para la explicación.',
   ],2),['support','support-choice'])
  }
 }else if(has('table')){
  candidate(row('pilot-frequency-table','Tabla de frecuencias',[
   'La tabla asigna a cada valor su frecuencia correcta y conserva todos los datos proporcionados, sin añadir ni repetir observaciones.',
   'Los valores están completos; un error de conteo altera una frecuencia y puede localizarse al contrastarla con los datos.',
   'Agrupa parte de los valores, pero omite observaciones o confunde sus frecuencias.',
   'La tabla cambia los valores o cuenta otra información y no representa el conjunto dado.',
   'No presenta una tabla de frecuencias del conjunto proporcionado.',
  ]),['table'])
  candidate(row('pilot-bar-chart','Gráfico de barras',[
   'Las barras representan las frecuencias de los valores dados; los rótulos y la escala permiten interpretar correctamente cada altura.',
   'Las alturas corresponden a las frecuencias; un rótulo incompleto dificulta identificar una barra.',
   'Algunas barras corresponden a los datos, pero faltan valores o la escala altera la comparación de frecuencias.',
   'Las alturas o los rótulos representan valores distintos de los datos proporcionados.',
   'No presenta un gráfico de barras de los datos dados.',
  ]),['chart'])
  if(has('mean'))candidate(row('pilot-mean','Media de los datos',[
   'Obtiene la media correcta del conjunto dado: la suma de los valores dividida por el número de observaciones.',
   'Considera los valores y el divisor correctos, pero un error aritmético altera el resultado de la media.',
   'Incluye solo parte del conjunto o utiliza un divisor que no corresponde a su tamaño.',
   'Presenta como media otra medida o un valor incompatible con el conjunto dado.',
   'No presenta un resultado reconocible para la media solicitada.',
  ]),['mean'])
  if(has('median'))candidate(row('pilot-median','Mediana de los datos',[
   'Obtiene la mediana correcta atendiendo al orden de los valores y a la posición central del conjunto dado.',
   'Localiza la posición central correcta, pero un error aritmético altera el valor cuando debe combinar los dos valores centrales.',
   'Ordena parte de los datos, pero toma una posición que no es central o deja fuera observaciones.',
   'Presenta como mediana otra medida o selecciona un valor sin relación con la posición central.',
   'No presenta un resultado reconocible para la mediana solicitada.',
  ]),['median'])
  if(has('interpretation'))candidate(row('pilot-data-interpretation','Interpretación de las medidas',[
   'Explica qué indica cada medida solicitada en el conjunto dado, distinguiendo el promedio de la posición central sin atribuirles información que no expresan.',
   'Distingue el significado de las medidas; deja implícita la relación de una de ellas con el conjunto dado.',
   'Interpreta una medida, pero solo repite el valor de la otra sin explicar qué indica.',
   'Intercambia el significado de media y mediana o les atribuye una conclusión incompatible con los datos.',
   'No interpreta el significado de las medidas solicitadas.',
  ]),['interpretation'])
  if(has('conclusion'))candidate(row('pilot-data-conclusion','Conclusión sostenida por los datos',[
   'Formula una conclusión defendible y la vincula con valores, frecuencias o medidas del conjunto, sin generalizar fuera de la información proporcionada.',
   'La conclusión es compatible con los datos, pero deja implícita una conexión con la evidencia que la sostiene.',
   'Enuncia una conclusión posible sin aportar una relación verificable con el conjunto.',
   'La conclusión contradice los datos o generaliza a una población que no fue observada.',
   'No presenta una conclusión sobre la información proporcionada.',
  ]),['conclusion'])
  if(has('explanation-choice'))candidate(row('pilot-explanation-choice','Claridad de la explicación elegida',[
   'En el audio o en el texto elegidos, comunica la interpretación y la conclusión de modo comprensible; cualquiera de las dos opciones acredita la entrega.',
   'La opción elegida se comprende; una referencia poco clara interrumpe una relación secundaria.',
   'La opción elegida contiene ideas pertinentes, pero su organización impide seguir parte de la explicación.',
   'La opción elegida comunica afirmaciones inconexas que no permiten reconocer la explicación.',
   'No aporta una explicación reconocible en ninguna de las opciones permitidas.',
  ],2),['explanation-choice'])
 }else{
  candidate(row('pilot-rational-comparison','Comparación de los racionales dados',[
   'Establece correctamente el orden de los dos racionales dados, conservando sus signos y valores.',
   'Establece el orden correcto, pero una notación imprecisa deja ambigua la relación de comparación.',
   'Reconoce características de los valores, pero no establece correctamente su orden.',
   'Invierte la comparación al ignorar el signo o cambiar el valor de uno de los racionales.',
   'No establece una comparación reconocible de los racionales dados.',
  ]),['comparison'],['mathematical-validity'])
  candidate(row('pilot-rational-choice','Justificación mediante la opción elegida',[
   'Justifica la comparación con una recta numérica que sitúa y relaciona correctamente los valores, o con un texto que explica cálculos válidos; basta una opción.',
   'La opción elegida sostiene el orden correcto; una posición o conexión entre los cálculos y la conclusión queda poco precisa.',
   'Presenta la recta o el texto con cálculos, pero no relaciona esa evidencia con el orden de los valores.',
   'La recta elegida cambia las posiciones relativas o el texto utiliza cálculos incompatibles con los valores dados.',
   'No presenta una justificación mediante ninguna de las dos opciones permitidas.',
  ],4),['reasoning-choice'])
 }

 // Reconcile evidence identities and actual semantic bindings, never word overlap.
 const prohibited:Record<string,string[]>={'exclude-support':['pilot-support'],'exclude-draft':['news-process-revision'],'exclude-model':['pilot-model'],'exclude-survey':['pilot-survey']}
 const forbiddenIds=new Set(contract.requirements.filter(r=>r.kind==='EXCLUSION').flatMap(r=>prohibited[r.key]??[]))
 const selected:Candidate[]=[],identities=new Set<string>()
 for(const c of candidates){
  const reason=forbiddenIds.has(c.criterion.templateId)?'La consigna excluye esta obligación.':!c.requirementIds.length&&!c.dimensionIds.length?'Sin obligación o dimensión justificante.':identities.has(c.criterion.templateId)?'Identidad duplicada.':null
  if(reason){rejected.push({criterionId:c.criterion.templateId,reason});continue}
  identities.add(c.criterion.templateId);selected.push(c)
 }
 const covered=[...new Set(selected.flatMap(c=>c.requirementIds))]
 const enforcedExclusions=contract.requirements.filter(r=>r.kind==='EXCLUSION').map(r=>r.id)
 const uncovered=contract.requirements.filter(r=>!covered.includes(r.id)&&!enforcedExclusions.includes(r.id)).map(r=>r.id)
 if(!selected.length)throw new Error('No se pudo componer el piloto; se conservó el contenido anterior.')
 const trace:PilotCompositionTrace={version:pilotCompositionVersion,contract,links:selected.map(c=>({criterionId:c.criterion.templateId,requirementIds:c.requirementIds,dimensionIds:c.dimensionIds})),covered,uncovered,enforcedExclusions,rejected}
 // Already reconciled presentation rows: do not run the legacy delivery appender a second time.
 const proposal=editableAuthoredRecommendation(selected.map(c=>c.criterion),{activityTitle:'',maxScore:input.maxScore,instrumentType:input.instrumentType,participationMode:input.participationMode,activityType:contract.activityType,includeAdditionalCandidates:input.includeAdditionalCandidates,levelCount:input.levelCount},contract.activityType,'composition-pilot')
 proposal.internalTrace.composition=trace
 proposal.internalTrace.reasons=[`composition=${pilotCompositionVersion}`,...uncovered.map(id=>`uncovered=${id}`)]
 return proposal
}
