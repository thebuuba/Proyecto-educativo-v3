import type {SecondaryLanguageTopic} from './secondary-topic-types'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'
import {topicTaskMode} from './secondary-language-topics'
import {affirmativeLanguageTask,requestedLanguageFeatures,languageFeatureCriterion,explicitWritingProcess,type LanguageFeature} from './language-feature-criteria'
import {languageReadingProcedures,languageWritingProcedures} from './language-procedure-criteria'
import {thirdGradeLanguageFeatures} from './secondary-language-grade-three-features'

const profiles:Record<string,{genre:string;target:string;plan:string}>={
 entrevista:{genre:'entrevista',target:'el tema y las informaciones de las preguntas y respuestas',plan:'el propósito, el entrevistado y el orden de las preguntas'},
 cronica:{genre:'crónica',target:'los hechos, su secuencia y la perspectiva del cronista',plan:'el orden de los hechos y la perspectiva desde la que se narrarán'},
 catalogo:{genre:'catálogo',target:'las especies, sus características y la organización de las entradas',plan:'el alcance del catálogo y la organización de las entradas de especies'},
 'informe-experimento':{genre:'informe de experimento',target:'el procedimiento, los resultados y su interpretación',plan:'la relación entre propósito, procedimiento, resultados e interpretación'},
 'articulo-opinion':{genre:'artículo de opinión',target:'la tesis y las razones con que el autor la sostiene',plan:'la relación entre la tesis, los argumentos y su orden de desarrollo'},
 'cuento-social':{genre:'cuento social, político o cultural',target:'el conflicto, las acciones y las motivaciones de los personajes',plan:'la relación del conflicto con las acciones, los personajes y el ambiente'},
 madrigal:{genre:'madrigal',target:'los sentimientos y las imágenes expresadas por los versos',plan:'el desarrollo de los sentimientos y las imágenes a través de los versos'},
}
const criterion=(scope:string,id:string,title:string,levels:Criterion['progressionLevels'],weight=3):Criterion=>({templateId:`${scope}-${id}`,title,observable:levels[0],progressionLevels:levels,weight})

export function thirdGradeLanguageCriteria(topic:SecondaryLanguageTopic,activity:string,description:string):Criterion[] {
 return composeLanguageCriteria(topic,activity,description,profiles[topic.id],thirdGradeLanguageFeatures[topic.id])
}

/** Shared action/procedure composition; every grade supplies its own source-backed profile. */
export function composeLanguageCriteria(topic:SecondaryLanguageTopic,activity:string,description:string,p:{genre:string;target:string;plan:string;oralCreation?:boolean;revisionRequested?:boolean;verifyPrediction?:boolean},availableFeatures:LanguageFeature[]):Criterion[] {
 const task=affirmativeLanguageTask(description),scope=`len-${topic.grade}-${topic.id}`,mode=topicTaskMode(activity)
 const reciting=mode==='ORAL'&&/recit|declam/.test(task)
 const narrating=mode==='ORAL'&&/narr\w*.*oralmente/.test(task)
 const oralCreation=mode==='ORAL'&&(p.oralCreation===true||/produc\w*|elabor\w*|realiz\w*.*entrevista/.test(task)||narrating
  ||topic.grade>=4&&['discurso-agradecimiento','discurso-recibimiento-despedida','discurso-graduacion','informe-investigacion','instructivo','reportaje','monologo'].includes(topic.id)&&/present\w*\s+oralmente/.test(task)&&!/analisis|analiz|interpret|comentario|leido/.test(task))
 const producing=topic.id!=='novela'&&(mode==='PRODUCTION'||mode==='REPORT'&&['informe-experimento','informe-investigacion'].includes(topic.id)||oralCreation)
 // Rhythm is already assessed by recitation-expression; retain distinct requested forms such as rhyme.
 const features=requestedLanguageFeatures(availableFeatures,description).filter(f=>!reciting||f.name!=='el ritmo').map(f=>{
  if(reciting)f={...f,name:f.name.replace(/(?:,| y) el ritmo/g,'')}
  if(f.id!=='graphics')return f
  const matches=(f.terms??[]).flatMap(([pattern,name])=>{
   const m=new RegExp(`\\b(?:${pattern})`).exec(task)
   if(!m)return []
   const singular:Record<string,string>={grafico:'gráfico',grafica:'gráfica',fotografia:'fotografía',ilustracion:'ilustración'}
   return [{name:topic.grade>=4&&singular[m[0]]?singular[m[0]]:/^(?:tabla|diagrama|dibujo|mapa)$/.test(m[0])?m[0]:name.replace(/^(?:los|las) /,''),index:m.index,end:m.index+m[0].length}]
  }).sort((a,b)=>a.index-b.index)
  if(!matches.length)return f
  const joiner=/\bo\b/.test(task.slice(matches[0].index,matches.at(-1)!.end))?' o ':' y '
  return {...f,name:matches.map(m=>m.name).join(joiner)}
 })
 let rows:Criterion[]=topic.dimensions.map(d=>{
  if(activity==='PERFORMANCE'&&d.performance)return {templateId:`${scope}-${d.id}`,title:d.title,observable:d.performance.observable,progressionLevels:[d.performance.observable,...d.performance.evidence],weight:d.weight}
  const observable=mode==='COMPARISON'?d.comparison:producing?d.production:d.analysis
  return {templateId:`${scope}-${d.id}`,title:d.title,observable,progressionLevels:[observable,...d.evidence],weight:d.weight}
 })
 if(features.length){
  const explicitCore=/funcion|estructura|proposito|roles|preguntas y respuestas|hechos|tesis|argumentos|conflicto|personajes|especies|resultados|sentimientos|versos|rima/.test(task)||topic.grade>=4&&/razones|ocasion|instrucciones|pasos|objetivos|metodo|motivaciones|narrador/.test(task)
  if(/\b(?:solo|unicamente|exclusivamente)\b/.test(task)||!producing&&mode!=='ORAL'&&!explicitCore)rows=[]
  rows.push(...features.map(f=>languageFeatureCriterion(f,scope,p.genre,mode==='COMPARISON'?'comparison':reciting?'recitation':oralCreation?'oral-production':producing?'production':'analysis')))
 }
 if(!producing&&mode!=='COMPARISON'&&!reciting) {
  const reading=languageReadingProcedures(description,scope,p.genre,p.target,p.verifyPrediction)
  if(reading.length){
   if(!/identific|analiz|interpret|estructura|tesis|conflicto/.test(task))rows=rows.filter(r=>r.templateId.includes('-feature-'))
   rows.push(...reading)
  }
 }
 if(producing){
  if(/planific/.test(task)&&!/redact|escrib|produc|elabor/.test(task))rows=rows.filter(r=>r.templateId.includes('-feature-'))
  rows.push(...languageWritingProcedures(description,scope,p.genre,p.plan),...explicitWritingProcess(description,scope,p.genre,p.revisionRequested))
 }
 if(/diccionario/.test(task))rows.push(criterion(scope,'procedure-dictionary','Comprobación del significado',[
  `Selecciona en el diccionario una acepción compatible con el pasaje de ${p.genre} y explica qué indicios permiten elegirla.`,
  'La acepción conserva el sentido del pasaje; un indicio de la elección queda implícito.',
  'Copia una definición sin comprobar que corresponda al uso de la palabra en el pasaje.',
  'Elige una acepción que cambia el sentido de la información del texto.',
  'No aporta una definición relacionada con la palabra y el contexto consultados.',
 ]))
 if(!producing&&/mapas? conceptual(?:es)?|organizador grafico/.test(task))rows.push(criterion(scope,'procedure-organizer','Representación de la comprensión',[
  `Organiza el mapa conceptual o representación solicitada relacionando ${p.target} según el texto disponible.`,
  'Las relaciones principales corresponden al texto; un enlace necesita explicarse.',
  'Enumera conceptos del texto sin establecer relaciones entre ellos.',
  'Una conexión invierte o contradice la relación expresada en el texto.',
  'No presenta relaciones reconocibles del texto en la representación solicitada.',
 ]))
 if(topic.id==='cronica'&&/causas|consecuencias/.test(task))rows.push(criterion(scope,'procedure-causes','Causas y posibles consecuencias',[
  `${producing?'Relaciona':'Explica'} las causas documentadas con los hechos de la crónica y distingue las consecuencias observadas de las posibles consecuencias inferidas.`,
  'Las causas se relacionan con los hechos; una consecuencia necesita distinguirse como observada o posible.',
  'Enumera causas y consecuencias sin mostrar su relación con los hechos.',
  'Invierte causa y consecuencia o presenta como ocurrido un efecto solo supuesto.',
  'No relaciona los hechos con causas ni consecuencias sustentadas.',
 ]))
 if(topic.id==='catalogo'&&producing&&/soporte|formato/.test(task)&&/fisico|digital|electronico/.test(task)) {
  const medium=/fisico\s+y\s+(?:digital|electronico)/.test(task)?'físico y digital':/fisico\s+o\s+(?:digital|electronico)/.test(task)?'físico o digital':/digital|electronico/.test(task)?'digital':'físico'
  rows.push(criterion(scope,'procedure-medium','Consulta en el soporte solicitado',[
   `Presenta el catálogo en soporte ${medium} con entradas legibles que permiten localizar la información de las especies.`,
   'Las entradas pueden consultarse; una referencia o distribución dificulta localizar un dato.',
   'Los datos son legibles, pero su distribución dificulta relacionarlos con las entradas.',
   'La disposición mezcla información de distintas especies y cambia sus referencias.',
   'No presenta el catálogo de forma consultable en el soporte solicitado.',
  ]))
 }
 if(producing&&/conclusion/.test(task)&&['informe-experimento','informe-investigacion','articulo-opinion'].includes(topic.id)){
  const target=topic.id.startsWith('informe-')?'los resultados disponibles y la interpretación de sus datos':'la tesis y los argumentos desarrollados'
  rows.push(criterion(scope,'procedure-conclusion','Conclusión sustentada',[
   `Formula una conclusión que retoma ${target}, sin añadir afirmaciones ajenas al desarrollo.`,
   'La conclusión se relaciona con el desarrollo; una afirmación necesita un apoyo más claro.',
   'Repite datos o ideas sin explicar qué permiten concluir.',
   'La conclusión contradice los apoyos del desarrollo o se basa en información ausente.',
   'No presenta la conclusión solicitada ni su relación con el desarrollo.',
  ]))
 }
 if(narrating&&/voz|voces/.test(task))rows.push(criterion(scope,'procedure-voices','Voces de los personajes',[
  'Distingue las intervenciones de los personajes mediante cambios de voz o apoyos de acceso acordados, conservando quién dice cada intervención y su sentido.',
  'Las voces se distinguen; una intervención necesita atribuirse con mayor claridad.',
  'Varía la voz sin mantener identificable a qué personaje corresponde.',
  'El cambio de voz atribuye a un personaje las palabras de otro o altera su intención.',
  'No aporta evidencia de distinción de las intervenciones con los apoyos acordados.',
 ]))
 if(topic.id==='madrigal'&&/rima consonante/.test(task))rows=rows.map(r=>r.templateId.endsWith('-rhyme')?{...r,observable:r.observable.replace('la rima','la rima consonante'),progressionLevels:[r.progressionLevels[0].replace('la rima','la rima consonante'),...r.progressionLevels.slice(1)] as Criterion['progressionLevels']}:r)
 if(topic.id==='articulo-opinion'&&/subray/.test(task))rows.push(criterion(scope,'procedure-underlining','Selección de tesis y apoyos',[
  'Subraya la tesis y sus argumentos distinguiéndolos de ejemplos secundarios y explica por qué los fragmentos seleccionados cumplen esas funciones.',
  'Distingue tesis y argumentos; un fragmento seleccionado requiere justificar su función.',
  'Marca partes del artículo sin distinguir la tesis de sus apoyos.',
  'Selecciona como tesis una afirmación contraria a la postura del autor.',
  'No selecciona fragmentos pertinentes para reconocer la tesis y sus apoyos.',
 ]))
 if(topic.id==='catalogo'&&/habitat|conservacion|amenazas|reproduccion|nombre comun/.test(task)) {
  const terms=[['nombre comun','nombre común'],['reproduccion','reproducción'],['habitat','hábitat'],['conservacion','conservación'],['amenazas','amenazas']].filter(([pattern])=>task.includes(pattern)).map(([,name])=>name).join(', ')
  rows.push(criterion(scope,'procedure-species-data','Datos solicitados de las especies',[
   `${producing?'Registra':'Interpreta'} la información solicitada de cada especie (${terms}) diferenciando sus características y relacionándolas con la entrada correspondiente.`,
   'Los datos corresponden a las especies; una relación entre dato y entrada necesita aclararse.',
   'Menciona datos de especies sin indicar a qué entrada corresponden.',
   'Atribuye a una especie datos incompatibles con sus características.',
   'No aporta los datos solicitados de las especies.',
  ]))
 }
 if(topic.id==='entrevista'&&/investig|seleccion\w*.*(?:personajes|entrevistado)|aportes|valores/.test(task))rows.push(criterion(scope,'procedure-interviewee','Selección informada del entrevistado',[
  'Justifica la selección del entrevistado relacionando sus experiencias o aportes documentados con el tema y el propósito de las preguntas.',
  'Los aportes se relacionan con el tema; queda implícita su relación con una pregunta.',
  'Enumera datos de la persona sin explicar por qué permiten abordar el tema.',
  'Atribuye al entrevistado experiencias ajenas o incompatibles con la información consultada.',
  'No aporta información que justifique la selección del entrevistado.',
 ]))
 if(activity==='RESEARCH')rows=[criterion(scope,'research-information','Información pertinente y comprobable',[
  `Selecciona información que permite fundamentar ${p.target} y distingue datos documentados de interpretaciones propias.`,
  'La información responde al propósito; una afirmación necesita distinguirse como dato o interpretación.',
  'Recopila información sobre el asunto sin mostrar cómo responde al propósito de investigación.',
  'Atribuye al asunto datos de otro caso o presenta opiniones como hechos comprobados.',
  'No presenta información pertinente al propósito de investigación.',
 ],5),...rows.filter(r=>r.templateId.endsWith('procedure-interviewee'))]
 if(activity==='RESEARCH'||producing&&/fuentes|\binvestig(?:ar\w*|an|a|uen|ando)\b|recopil/.test(task))rows.push(criterion(scope,'research-sources','Origen de la información',[
  'Identifica las fuentes de los datos utilizados y comprueba que respaldan la información registrada.',
  'Las fuentes respaldan la información; falta precisar el origen de un dato secundario.',
  'Enumera fuentes sin mostrar cuáles respaldan los datos registrados.',
  'Atribuye a una fuente información que no contiene o que contradice.',
  'No identifica fuentes que permitan comprobar los datos registrados.',
 ]))
 if(reciting)rows=[criterion(scope,'recitation-sequence','Sentido y secuencia de los versos',[
  `Recita el ${p.genre} conservando la secuencia y el sentido de sus versos, con los apoyos acordados.`,
  'Una omisión puntual no impide seguir el sentido del poema.',
  'Las omisiones o repeticiones interrumpen la relación entre varios versos.',
  'Los cambios de orden alteran el sentido del poema recitado.',
  `No se presenta una recitación reconocible del ${p.genre} con los apoyos acordados.`,
 ]),criterion(scope,'recitation-expression','Ritmo y expresión poética',[
  `Comunica los sentimientos del ${p.genre} mediante ritmo, pausas y entonación, o los apoyos de acceso acordados.`,
  'Se perciben los sentimientos; una pausa o énfasis necesita vincularse con el verso.',
  'Los énfasis se limitan a palabras aisladas y no permiten seguir la emoción de los versos.',
  'La expresión comunica un sentimiento contrario al sentido del verso.',
  'No aporta evidencia de expresión del sentido mediante la recitación o el apoyo acordado.',
 ]),...rows.filter(r=>r.templateId.includes('-feature-'))]
 if(reciting&&/gestos|gestual/.test(task))rows=rows.map(r=>r.templateId.endsWith('-feature-nonverbal')?criterion(scope,'feature-nonverbal','Expresión gestual del sentido',[
  `Relaciona los gestos o apoyos de acceso acordados con los sentimientos y las imágenes de los versos del ${p.genre}.`,
  'Los gestos expresan los sentimientos del poema; un movimiento necesita vincularse con el verso.',
  'Usa gestos aislados sin relacionarlos con los sentimientos o imágenes de los versos.',
  'El gesto comunica un sentimiento contrario al expresado por el verso.',
  'No aporta evidencia gestual ni mediante el apoyo acordado del sentido de los versos.',
 ]):r)
 if(mode==='ORAL'&&!reciting&&activity!=='PERFORMANCE')rows.push(criterion(scope,activity==='DEBATE'?'debate':'oral','Comunicación e intercambio de ideas',activity==='DEBATE'?[
  `Defiende una interpretación de ${p.target} con evidencias y responde a los argumentos de otros participantes respetando sus intervenciones.`,
  'La postura tiene apoyos; una respuesta necesita relacionarse con el argumento del interlocutor.',
  'Expone una postura sin responder a las razones de otros participantes.',
  'Atribuye al interlocutor una idea que no sostuvo o sustituye argumentos por descalificaciones.',
  'No aporta una postura sustentada ni una respuesta relacionada con el intercambio.',
 ]:[
  `Comunica ${p.target} mediante una secuencia y un vocabulario comprensibles para la audiencia, con los apoyos de acceso acordados.`,
  'Las ideas se comprenden; una transición o referencia necesita aclararse.',
  'Se comunican ideas aisladas y cuesta reconocer sus relaciones.',
  'La secuencia o el vocabulario cambia el sentido de las ideas comunicadas.',
  'No aporta evidencia de comunicación del contenido mediante la presentación o el apoyo acordado.',
 ]))
 return rows
}
