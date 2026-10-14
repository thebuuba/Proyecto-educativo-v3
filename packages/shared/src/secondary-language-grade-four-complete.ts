import type {SecondaryLanguageTopic} from './secondary-topic-types'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'
import {composeLanguageCriteria} from './secondary-language-grade-three-complete'
import {fourthGradeLanguageFeatures} from './secondary-language-grade-four-features'
import {affirmativeLanguageTask} from './language-feature-criteria'
import {topicTaskMode} from './secondary-language-topics'
const profiles:Record<string,{genre:string;target:string;plan:string}>={
 cronica:{genre:'crónica',target:'los hechos, su secuencia y la perspectiva del cronista',plan:'el orden de los hechos y la perspectiva desde la que se narrarán'},
 instructivo:{genre:'instructivo',target:'el propósito, las instrucciones y sus condiciones de ejecución',plan:'el propósito, la secuencia de instrucciones y sus condiciones'},
 'informe-investigacion':{genre:'informe de investigación',target:'el problema, los objetivos, el método y los resultados comunicados',plan:'la relación entre problema, objetivos, método y resultados disponibles'},
 'articulo-opinion':{genre:'artículo de opinión',target:'la tesis y las razones con que el autor la sostiene',plan:'la relación entre tesis, argumentos y posibles objeciones'},
 'discurso-agradecimiento':{genre:'discurso de agradecimiento',target:'la ocasión, los participantes y las razones del agradecimiento',plan:'la relación entre la ocasión, los aportes reconocidos y las razones para agradecer'},
 novela:{genre:'novela',target:'los acontecimientos, las motivaciones y las voces del pasaje disponible',plan:'la relación entre la interpretación y las evidencias del pasaje'},
 soneto:{genre:'soneto',target:'los sentimientos, las imágenes y la organización de los versos',plan:'el desarrollo del sentimiento a través de las imágenes y estrofas'},
}
export function fourthGradeLanguageCriteria(topic:SecondaryLanguageTopic,activity:string,description:string):Criterion[] {
 const task=affirmativeLanguageTask(description),scope=`len-4-${topic.id}`,mode=topicTaskMode(activity)
 let rows=composeLanguageCriteria(topic,activity,description,profiles[topic.id],fourthGradeLanguageFeatures[topic.id])
 if(topic.id==='novela'&&/\b(?:solo|unicamente|exclusivamente)\b/.test(task)){
  const focus:Record<string,RegExp>={plot:/acontecimientos|trama|causalidad|estructura/,characters:/personajes|motivaciones|ambiente/,narrator:/narrador|voces/,theme:/temas/}
  const selected=Object.entries(focus).filter(([,pattern])=>pattern.test(task)).map(([id])=>`${scope}-${id}`)
  if(selected.length)rows=rows.filter(r=>!topic.dimensions.some(d=>r.templateId===`${scope}-${d.id}`)||selected.includes(r.templateId))
 }
 const add=(id:string,title:string,levels:Criterion['progressionLevels'])=>rows.push({templateId:`${scope}-${id}`,title,observable:levels[0],progressionLevels:levels,weight:3})
 if(topic.id==='instructivo'&&mode==='PRODUCTION'&&/soporte|formato/.test(task)&&/fisico|digital|electronico/.test(task)){
  const medium=/fisico\s+y\s+(?:digital|electronico)/.test(task)?'físico y digital':/fisico\s+o\s+(?:digital|electronico)/.test(task)?'físico o digital':/digital|electronico/.test(task)?'digital':'físico'
  add('procedure-medium','Consulta de las instrucciones en el soporte solicitado',[
   `Dispone el instructivo en soporte ${medium} con pasos legibles y referencias que permiten seguir las indicaciones.`,
   'Las instrucciones pueden consultarse; una referencia dificulta localizar un paso.',
   'El texto es legible, pero su distribución dificulta reconocer la secuencia de pasos.',
   'La disposición mezcla pasos o recursos y cambia el orden de las indicaciones.',
   'No presenta las instrucciones de forma consultable en el soporte solicitado.',
  ])
 }
 if(topic.id==='informe-investigacion'&&/recomendaciones/.test(task))add('recommendations','Recomendaciones vinculadas con los resultados',[
  `${mode==='PRODUCTION'||mode==='REPORT'?'Propone':'Explica'} recomendaciones que responden al problema y se apoyan en los resultados disponibles, indicando su alcance.`,
  'Las recomendaciones se apoyan en resultados; una condición de aplicación queda implícita.',
  'Enumera recomendaciones sin mostrar qué resultados las justifican.',
  'Una recomendación contradice un resultado o requiere información ausente.',
  'No relaciona recomendaciones con resultados del informe.',
 ])
 if(topic.id==='informe-investigacion'&&/bases teoricas|marco teorico/.test(task))add('theory','Bases teóricas relacionadas con el problema',[
  'Relaciona los conceptos de las fuentes con el problema investigado y distingue esos apoyos de los resultados comunicados.',
  'Los conceptos ayudan a comprender el problema; una relación necesita explicarse.',
  'Enumera definiciones sin relacionarlas con el problema del informe.',
  'Presenta una definición de la fuente como resultado observado de la investigación.',
  'No relaciona conceptos de las fuentes con el problema tratado.',
 ])
 // A written report on a text is not a request to compose the genre being studied.
 if(mode==='REPORT'&&topic.id!=='informe-investigacion')add('report-evidence','Interpretación sustentada en el texto',[
  `Organiza el informe sobre ${profiles[topic.id].genre} enlazando sus interpretaciones con pasajes o datos identificables del texto disponible.`,
  'Las interpretaciones tienen apoyos; una referencia necesita localizarse mejor.',
  'Enumera interpretaciones y pasajes sin explicar sus relaciones.',
  'El informe atribuye al texto información ajena o contraria a sus pasajes.',
  'No presenta interpretaciones vinculadas con evidencia del texto disponible.',
 ])
 return rows
}
