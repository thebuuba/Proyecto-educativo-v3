import type {SecondaryLanguageTopic} from './secondary-topic-types'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'
import {composeLanguageCriteria} from './secondary-language-grade-three-complete'
import {fifthGradeLanguageFeatures} from './secondary-language-grade-five-features'
import {secondaryNovelAnalysisCriteria} from './secondary-novel-analysis'
import {affirmativeLanguageTask} from './language-feature-criteria'
import {topicTaskMode} from './secondary-language-topics'
export const fifthGradeLanguageProfiles:Record<string,{genre:string;target:string;plan:string}>={
 'carta-autopresentacion':{genre:'carta de autopresentación',target:'el propósito, las capacidades y los motivos de la autopresentación',plan:'la relación entre destinatario, capacidades y motivos de la autopresentación'},
 resena:{genre:'reseña',target:'la síntesis y la valoración sustentada de la obra reseñada',plan:'la identificación, síntesis y valoración de la obra'},
 'ensayo-argumentativo':{genre:'ensayo argumentativo',target:'la tesis, sus argumentos y los límites de sus evidencias',plan:'la relación entre tesis, argumentos y posibles objeciones'},
 'discurso-recibimiento-despedida':{genre:'discurso de recibimiento o despedida',target:'la ocasión, los participantes y las razones del recibimiento o despedida',plan:'la relación entre ocasión, participantes y razones del mensaje'},
 novela:{genre:'novela',target:'los acontecimientos, las motivaciones y las voces del pasaje disponible',plan:'la relación entre interpretación y evidencias del pasaje'},
 'poesia-satirica':{genre:'poema satírico',target:'la crítica, el tono y las imágenes del poema',plan:'la relación entre el blanco de la crítica y las imágenes o expresiones satíricas'},
 'entremes-teatral':{genre:'entremés teatral',target:'el conflicto, las intervenciones y la crítica social de la escena',plan:'la relación entre conflicto, personajes, intervenciones y crítica social'},
}
export function fifthGradeLanguageCriteria(topic:SecondaryLanguageTopic,activity:string,description:string,additional=false):Criterion[]{
 const task=affirmativeLanguageTask(description),scope=`len-5-${topic.id}`,mode=topicTaskMode(activity),p=fifthGradeLanguageProfiles[topic.id]
 let rows=composeLanguageCriteria(topic,activity,description,p,fifthGradeLanguageFeatures[topic.id])
 if(topic.id==='poesia-satirica'&&mode==='ORAL'&&/recit|declam/.test(task)){
  rows=rows.filter(r=>!r.templateId.endsWith('-feature-nonverbal')||/gestos|gestual|corporal|postura/.test(task))
   .map(r=>({...r,observable:r.observable.replaceAll('los sentimientos','el sentido de la crítica'),progressionLevels:r.progressionLevels.map(t=>t.replaceAll('los sentimientos','el sentido de la crítica').replaceAll('Los sentimientos','El sentido de la crítica')) as Criterion['progressionLevels']}))
 }
 // Retain the verified police-novel rows and identities, adding only newly requested features/procedures.
 if(topic.id==='novela'){
  const legacy=secondaryNovelAnalysisCriteria('',description,{level:'SECONDARY',grade:5,subjectCode:'LEN'},activity,additional)
  if(legacy.length)rows=[...legacy,...rows.filter(r=>(r.templateId.includes('-feature-')||r.templateId.includes('-procedure-'))&&!(r.templateId.endsWith('-feature-character-roles')&&legacy.some(r=>r.templateId==='novel-analysis-elements')))]
  else if(/\b(?:solo|unicamente|exclusivamente)\b/.test(task)){
   const focus:Record<string,RegExp>={plot:/acontecimientos|trama|causalidad|estructura/,characters:/personajes|motivaciones|ambiente/,narrator:/narrador|voces/,theme:/temas/}
   const selected=Object.entries(focus).filter(([,pattern])=>pattern.test(task)).map(([id])=>`${scope}-${id}`)
   if(selected.length)rows=rows.filter(r=>!topic.dimensions.some(d=>r.templateId===`${scope}-${d.id}`)||selected.includes(r.templateId))
  }
 }
 const add=(id:string,title:string,levels:Criterion['progressionLevels'])=>rows.push({templateId:`${scope}-${id}`,title,observable:levels[0],progressionLevels:levels,weight:3})
 if(mode==='REPORT'&&topic.id!=='novela')add('report-evidence','Interpretación sustentada en el texto',[
  `Organiza el informe sobre ${p.genre} enlazando las interpretaciones con pasajes identificables del texto disponible.`,
  'Las interpretaciones tienen apoyo; una referencia necesita localizarse mejor.',
  'Enumera interpretaciones y pasajes sin explicar sus relaciones.',
  'Atribuye al texto información ajena o contraria a sus pasajes.',
  'No presenta interpretaciones vinculadas con evidencia del texto disponible.',
 ])
 if(topic.id==='poesia-satirica'&&mode==='PRODUCTION'&&(/\bprosa\b/.test(task)!==/\bverso\b/.test(task))){
  const form=/\bprosa\b/.test(task)?'en prosa':'en verso'
  rows=rows.map(r=>({...r,title:r.title.replaceAll('en verso o prosa',form),observable:r.observable.replaceAll('en verso o prosa',form),progressionLevels:r.progressionLevels.map(t=>t.replaceAll('en verso o prosa',form)) as Criterion['progressionLevels']}))
 }
 if(mode==='PRODUCTION'&&/soporte|formato/.test(task)&&/fisico|digital|electronico/.test(task)){
  const medium=/fisico\s+y\s+(?:digital|electronico)/.test(task)?'físico y digital':/fisico\s+o\s+(?:digital|electronico)/.test(task)?'físico o digital':/digital|electronico/.test(task)?'digital':'físico'
  add('medium','Consulta en el soporte solicitado',[
   `Dispone el texto o plan solicitado de ${p.genre} en soporte ${medium} con partes legibles y referencias que permiten seguir su contenido.`,
   'El contenido puede consultarse; una referencia dificulta localizar una parte.',
   'El texto es legible, pero su distribución dificulta reconocer las relaciones entre partes.',
   'La disposición mezcla partes o referencias y altera el sentido del contenido.',
   'No presenta el texto o plan de forma consultable en el soporte solicitado.',
  ])
 }
 if(topic.id==='carta-autopresentacion'&&mode==='PRODUCTION'&&/envi(?:ar|aran|an|o)/.test(task))add('delivery-confirmation','Envío al destinatario acordado',[
  'Aporta constancia del envío de la versión final al destinatario y por el medio acordados, conservando el contenido revisado de la carta.',
  'El envío corresponde al destinatario y versión final; un dato de la constancia necesita precisarse.',
  'Presenta una constancia que no permite identificar la versión enviada o su destinatario.',
  'La constancia corresponde a otra versión o a un destinatario distinto del acordado.',
  'No aporta evidencia del envío solicitado de la versión final.',
 ])
 if(topic.id==='carta-autopresentacion'&&mode==='PRODUCTION'&&/sobre|datos del destinatario/.test(task))add('delivery','Identificación del destinatario en el soporte solicitado',[
  'Consigna los datos del destinatario en el soporte solicitado de modo que correspondan a la persona o institución a la que se dirige la carta.',
  'El destinatario se reconoce; un dato secundario necesita precisarse.',
  'Incluye datos sin distinguir remitente y destinatario.',
  'Los datos corresponden a una persona o institución distinta de la carta.',
  'No aporta los datos solicitados para identificar al destinatario.',
 ])
 if(topic.id==='carta-autopresentacion'&&/brevedad|credibilidad/.test(task))add('credibility','Brevedad y credibilidad de la autopresentación',[
  'Conserva la información pertinente para el propósito de presentarse, con brevedad y afirmaciones que pueden relacionarse con capacidades o experiencias propias.',
  'La información es pertinente y sustentada; una repetición puede condensarse.',
  'Enumera cualidades generales o repite información sin vincularla con experiencias.',
  'Una afirmación contradice las experiencias que se utilizan para sustentarla.',
  'No aporta información pertinente y sustentada para la autopresentación.',
 ])
 if(topic.id==='entremes-teatral'&&/hechos (?:actuales|reales)|otras materias/.test(task))add('connections','Relaciones entre la escena y su contexto',[
  'Explica semejanzas, diferencias o relaciones causales entre hechos de la escena y los referentes solicitados, distinguiendo ficción y datos del contexto.',
  'Las relaciones tienen apoyo; una diferencia entre ficción y contexto necesita precisarse.',
  'Enumera hechos de la escena y del contexto sin relacionarlos.',
  'Presenta un hecho ficticio como prueba de que ocurrió en el contexto real.',
  'No relaciona hechos de la escena con los referentes solicitados.',
 ])
 if(topic.id==='entremes-teatral'&&/subray/.test(task))add('underlining','Selección de intervenciones pertinentes',[
  'Subraya las intervenciones que sustentan la interpretación solicitada y explica su relación con el conflicto o punto de vista de la escena.',
  'Las intervenciones son pertinentes; una relación con la interpretación necesita aclararse.',
  'Marca intervenciones sin explicar qué interpretación sostienen.',
  'Selecciona una intervención que contradice la interpretación propuesta.',
  'No selecciona intervenciones pertinentes para sustentar la interpretación.',
 ])
 if(topic.id==='entremes-teatral'&&/punto de vista.*autor|autor.*implicito/.test(task))add('author-view','Punto de vista inferido de la escena',[
  'Sustenta la inferencia del punto de vista del autor en acciones e intervenciones, distinguiéndola de opiniones literales de los personajes.',
  'La inferencia tiene apoyo en la escena; una relación entre intervención y postura queda implícita.',
  'Repite una opinión de un personaje sin explicar si corresponde al punto de vista del autor.',
  'Atribuye al autor una opinión contraria al tratamiento de las acciones de la escena.',
  'No formula una inferencia del punto de vista sustentada en la escena.',
 ])
 if(topic.id==='entremes-teatral'&&/vida.*autor|contexto social/.test(task)&&/investig|consult|contrast/.test(task))add('author-context','Contexto documentado e interpretación del autor',[
  'Contrasta la interpretación del punto de vista del autor con información documentada sobre su vida o contexto, distinguiendo datos e hipótesis.',
  'La interpretación tiene apoyo documental; una inferencia necesita señalarse como hipótesis.',
  'Reúne datos biográficos o de contexto sin relacionarlos con la interpretación de la escena.',
  'Atribuye al autor una intención contraria a la escena o da por cierta una conjetura no documentada.',
  'No vincula la interpretación con información comprobable sobre el autor o su contexto.',
 ])
 if(topic.id==='entremes-teatral'&&mode==='ORAL'&&/represent|dramatiz|actuar|escenific/.test(task))add('performance','Intervenciones y acción en la representación',[
  'Representa las intervenciones de su personaje relacionándolas con las acciones y respuestas de la escena, con los apoyos de acceso acordados.',
  'Se sigue la acción; una entrada o respuesta necesita vincularse mejor con la intervención anterior.',
  'Dice intervenciones aisladas sin relacionarlas con lo que sucede en la escena.',
  'Atribuye a su personaje intervenciones de otro y cambia el conflicto representado.',
  'No aporta evidencia de las intervenciones de su personaje en la escena con los apoyos acordados.',
 ])
 return rows
}
