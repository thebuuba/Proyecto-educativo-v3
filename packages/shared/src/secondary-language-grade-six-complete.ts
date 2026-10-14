import type {SecondaryLanguageTopic} from './secondary-topic-types'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'
import {composeLanguageCriteria} from './secondary-language-grade-three-complete'
import {sixthGradeLanguageFeatures} from './secondary-language-grade-six-features'
import {affirmativeLanguageTask} from './language-feature-criteria'
import {topicTaskMode} from './secondary-language-topics'
const profiles:Record<string,{genre:string;target:string;plan:string}>={
 'informe-investigacion':{genre:'informe de investigación',target:'el problema, los objetivos, el método y los resultados comunicados',plan:'la relación entre problema, objetivos, método y resultados disponibles'},
 reportaje:{genre:'reportaje',target:'los hechos, su contexto y las explicaciones del problema tratado',plan:'la relación entre hechos, contexto y explicaciones que desarrollan el tema'},
 'ensayo-argumentativo':{genre:'ensayo argumentativo',target:'la tesis, los argumentos y la validez de sus razonamientos',plan:'la relación entre tesis, argumentos, contraargumentos y evidencias'},
 'discurso-graduacion':{genre:'discurso de graduación',target:'la ocasión, los participantes y la tesis del mensaje de graduación',plan:'la relación entre ocasión, tesis, razones y destinatarios del discurso'},
 novela:{genre:'novela',target:'los acontecimientos, las motivaciones, las voces y el orden del pasaje disponible',plan:'la relación entre interpretación y evidencias del pasaje'},
 'poesia-social':{genre:'poema social',target:'la problemática, la voz y las imágenes del poema social',plan:'la relación entre problemática social, postura y desarrollo de las imágenes'},
 monologo:{genre:'monólogo',target:'la situación, la voz y el punto de vista desarrollado en el parlamento',plan:'la relación entre la situación, el tema y las intervenciones de la voz monologal'},
}
export function sixthGradeLanguageCriteria(topic:SecondaryLanguageTopic,activity:string,description:string):Criterion[]{
 const task=affirmativeLanguageTask(description),scope=`len-6-${topic.id}`,mode=topicTaskMode(activity),p=profiles[topic.id]
 let rows=composeLanguageCriteria(topic,activity,description,p,sixthGradeLanguageFeatures[topic.id])
 const add=(id:string,title:string,levels:Criterion['progressionLevels'],weight=3)=>rows.push({templateId:`${scope}-${id}`,title,observable:levels[0],progressionLevels:levels,weight})
 if(topic.id==='novela'&&/\b(?:solo|unicamente|exclusivamente)\b/.test(task)){
  const focus:Record<string,RegExp>={plot:/acontecimientos|trama|causalidad|estructura/,characters:/personajes|motivaciones|ambiente/,narrator:/narrador|voces/,theme:/temas/}
  const selected=Object.entries(focus).filter(([,pattern])=>pattern.test(task)).map(([id])=>`${scope}-${id}`)
  if(selected.length)rows=rows.filter(r=>!topic.dimensions.some(d=>r.templateId===`${scope}-${d.id}`)||selected.includes(r.templateId))
 }
 if(topic.id==='informe-investigacion'&&/recomendaciones/.test(task))add('recommendations','Recomendaciones sustentadas en resultados',[
  `${mode==='PRODUCTION'||mode==='REPORT'?'Propone':'Explica'} recomendaciones vinculadas con el problema y sustentadas en los resultados disponibles, indicando su alcance.`,
  'Las recomendaciones se apoyan en resultados; una condición de aplicación queda implícita.',
  'Enumera recomendaciones sin mostrar qué resultado las justifica.',
  'Una recomendación contradice los datos o supone información ausente.',
  'No relaciona recomendaciones con resultados del informe.',
 ])
 if(topic.id==='informe-investigacion'&&/bases teoricas|marco teorico/.test(task))add('theory','Bases teóricas e interpretación de resultados',[
  'Relaciona conceptos de las fuentes con el problema y distingue esos apoyos teóricos de los resultados comunicados por el informe.',
  'Los conceptos ayudan a comprender el problema; una relación necesita explicarse.',
  'Enumera definiciones sin relacionarlas con el problema o los resultados.',
  'Presenta una definición de la fuente como resultado observado de la investigación.',
  'No relaciona los apoyos teóricos con el problema tratado.',
 ])
 if(mode==='REPORT'&&topic.id!=='informe-investigacion')add('report-evidence','Interpretación sustentada en el texto',[
  `Organiza el informe sobre ${p.genre} enlazando las interpretaciones con pasajes identificables del texto disponible.`,
  'Las interpretaciones tienen apoyo; una referencia necesita localizarse mejor.',
  'Enumera interpretaciones y pasajes sin explicar sus relaciones.',
  'Atribuye al texto información ajena o contraria a sus pasajes.',
  'No presenta interpretaciones vinculadas con evidencia del texto disponible.',
 ])
 if((mode==='PRODUCTION'||mode==='REPORT'&&topic.id==='informe-investigacion')&&/soporte|formato/.test(task)&&/fisico|digital|electronico/.test(task)){
  const medium=/fisico\s+y\s+(?:digital|electronico)/.test(task)?'físico y digital':/fisico\s+o\s+(?:digital|electronico)/.test(task)?'físico o digital':/digital|electronico/.test(task)?'digital':'físico'
  add('medium','Consulta en el soporte solicitado',[
   `Dispone el texto o plan solicitado de ${p.genre} en soporte ${medium} con partes legibles y referencias que permiten seguir su contenido.`,
   'El contenido puede consultarse; una referencia dificulta localizar una parte.',
   'El texto es legible, pero su distribución dificulta reconocer las relaciones entre partes.',
   'La disposición mezcla partes o referencias y altera el sentido del contenido.',
   'No presenta el texto o plan de forma consultable en el soporte solicitado.',
  ])
 }
 if(topic.id==='reportaje'&&/fiabilidad|fiables|diversidad.*fuentes|contrastar.*fuentes/.test(task))add('source-reliability','Contraste y fiabilidad de la información',[
  'Contrasta la información del reportaje entre fuentes pertinentes y distingue coincidencias, discrepancias y límites de lo que permiten afirmar.',
  'El contraste permite fundamentar los datos; una discrepancia necesita explicarse.',
  'Enumera fuentes o datos sin comprobar su acuerdo ni su relación con el tema.',
  'Presenta como confirmado un dato que las fuentes contradicen o no respaldan.',
  'No aporta un contraste que permita comprobar la información del reportaje.',
 ])
 if(topic.id==='poesia-social'&&mode==='ORAL'&&/recit|declam/.test(task))rows=rows.filter(r=>!r.templateId.endsWith('-feature-nonverbal')||/gestos|gestual|corporal|postura/.test(task))
 if(topic.id==='monologo'&&activity==='PERFORMANCE'){
  rows=rows.filter(r=>!r.templateId.endsWith('-oral'))
  add('performance','Expresión y comprensión del parlamento',[
   'Representa la voz del personaje con pausas, énfasis y articulación, o apoyos de acceso acordados, que permiten comprender el sentido de sus intervenciones.',
   'Se comprende el parlamento; una pausa o énfasis dificulta seguir una intervención puntual.',
   'Las pausas o énfasis fragmentan las intervenciones y dificultan comprender su sentido.',
   'La expresión cambia el sentido de una intervención del personaje.',
   'No se comprende el parlamento mediante la expresión ni los apoyos acordados.',
  ],5)
 }
 if(topic.id==='monologo'&&/punto de vista.*autor|autor.*implicito/.test(task))add('author-view','Inferencia del punto de vista del autor',[
  'Sustenta la inferencia del punto de vista del autor en la situación e intervenciones y la distingue de opiniones literales del personaje.',
  'La inferencia tiene apoyo; una relación con las intervenciones queda implícita.',
  'Repite una opinión del personaje sin explicar si corresponde al punto de vista del autor.',
  'Atribuye al autor una opinión contraria al tratamiento de la situación.',
  'No presenta una inferencia sustentada del punto de vista del autor.',
 ])
 if(topic.id==='monologo'&&/realidad cotidiana|otras materias|hechos reales|contextualizacion/.test(task))add('connections','Relaciones entre el monólogo y su contexto',[
  'Explica relaciones entre las situaciones del monólogo y los referentes solicitados, distinguiendo hechos de ficción y datos de la realidad cotidiana.',
  'Las relaciones se sustentan; una diferencia entre ficción y contexto necesita precisarse.',
  'Enumera situaciones del monólogo y del contexto sin relacionarlas.',
  'Utiliza un hecho ficticio como prueba de un hecho de la realidad cotidiana.',
  'No relaciona las situaciones del monólogo con los referentes solicitados.',
 ])
 if(topic.id==='monologo'&&/subray/.test(task))add('underlining','Selección de información pertinente',[
  'Subraya las intervenciones que sustentan la interpretación solicitada y explica su relación con la voz o situación del monólogo.',
  'Las intervenciones son pertinentes; una relación necesita aclararse.',
  'Marca intervenciones sin explicar qué interpretación sostienen.',
  'Selecciona una intervención que contradice la interpretación propuesta.',
  'No selecciona intervenciones pertinentes para sustentar la interpretación.',
 ])
 return rows
}
