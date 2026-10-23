import {affirmativeLanguageTask} from './language-feature-criteria'
import {languagePlaceClassification} from './language-procedure-criteria'
import {firstGradeGuideCriteria} from './secondary-guide-grade-one'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'

const criterion=(id:string,title:string,weight:number,levels:Criterion['progressionLevels']):Criterion=>({templateId:`guide-${id}`,title,weight,observable:levels[0],progressionLevels:levels})
const replace=(rows:Criterion[],id:string,row:Criterion)=>[...rows.filter(r=>r.templateId!==`guide-${id}`),row]
const grammarIds=['guide-feature-nouns','guide-feature-adjectives','guide-feature-indicative']
const organizationCriterion=(features:Criterion[],listening:boolean)=>criterion('language-organization','Recursos lingüísticos y organización de la información',5,[
 `Explica con ejemplos ${listening?'del audio':'de la guía leída'} cómo ${features.map(r=>r.title.toLowerCase()).join(', ')} organizan la información: nombran lugares e ideas y relacionan sus cualidades actuales o habituales.`,
 'Relaciona los recursos solicitados y el presente con la organización de la guía; un ejemplo necesita precisar qué lugar o cualidad retoma.',
 'Localiza verbos, nombres y adjetivos, pero no explica cómo sus relaciones organizan los datos de los lugares.',
 'Atribuye una cualidad, un nombre o una forma verbal a un lugar distinto y cambia la información organizada.',
 `No aporta ejemplos ${listening?'del audio':'de la lectura'} que relacionen los recursos lingüísticos solicitados con la organización de la guía.`,
])

/** MINERD PDF70–71. Adapt requests, never the exported historical catalog definitions. */
export function refineFirstGradeGuideRequirements(activity:string,description:string,base:Criterion[]):Criterion[]{
 const task=affirmativeLanguageTask(description),analysis=activity.includes('ANALYSIS')||activity==='ANALYSIS',oral=activity==='TOURIST_GUIDE_PRESENTATION'||['ORAL_PRESENTATION','EXPOSITION'].includes(activity)
 const production=activity==='TOURIST_GUIDE_CREATION'||activity==='WRITTEN_PRODUCTION'
 const correction=production&&/\b(?:corrij\w*|correg\w*|revis\w*)\b/.test(task)&&/\b(?:recibida|entregada|original|solo el lenguaje)\b/.test(task)
 let rows=base
 if(correction){
  rows=rows.filter(r=>r.templateId.includes('-feature-')).map(r=>{
   if(r.templateId==='guide-feature-nouns')return criterion('feature-nouns',r.title,3,[
    `Corrige ${r.title.toLowerCase()} de la guía recibida, conservando los lugares y datos del original.`,
    'Las correcciones mantienen referentes y clases de sustantivos; queda un uso secundario por precisar.',
    'Corrige algunos nombres, pero mantiene confusiones entre referentes o clases solicitadas.',
    'La corrección cambia el lugar nombrado o sustituye un concepto por otro ajeno al original.',
    'No presenta correcciones verificables de los sustantivos de la guía recibida.',
   ])
   if(['guide-feature-adjectives','guide-feature-adjective-degree'].includes(r.templateId))return criterion(r.templateId.replace('guide-',''),/grados/.test(task)?'Corrección de adjetivos y sus grados':'Corrección de adjetivos',3,[
    `Revisa ${r.title.toLowerCase()} para expresar las cualidades y referencias de los lugares sin cambiar sus datos.`,
    `La corrección conserva cualidades y referencias; un adjetivo${/grados/.test(task)?' o grado':''} requiere precisión.`,
    `Corrige algunos adjetivos${/grados/.test(task)?' o grados':''}, pero deja expresiones que no corresponden al lugar descrito.`,
    'La corrección atribuye al lugar una cualidad o referencia contraria a los datos.',
    'No aporta correcciones reconocibles de los adjetivos solicitados.',
   ])
   if(r.templateId==='guide-feature-indicative')return criterion('feature-indicative','Presente de indicativo en la descripción',3,[
    'Corrige los verbos en presente de indicativo para expresar las características actuales o habituales de los lugares, conservando los datos de la guía.',
    'Las formas en presente corresponden a las descripciones; queda un uso verbal por ajustar.',
    'Corrige algunas formas, pero conserva discordancias o tiempos que cambian una descripción.',
    'La corrección sitúa una característica en un tiempo incompatible con los datos del lugar.',
    'No presenta una corrección verificable del presente de indicativo solicitado.',
   ])
   if(r.templateId==='guide-feature-noun-group')return criterion('feature-noun-group','Núcleo y modificadores del sintagma nominal',3,[
    `Revisa el núcleo y los modificadores directo e indirecto del sintagma nominal${/expli\w*/.test(task)?'; explica con ejemplos de la guía cómo se relacionan':''}.`,
    'Relaciona núcleo y ambos modificadores con ejemplos pertinentes; una relación queda poco explicada.',
    'Señala el núcleo y algún modificador, pero confunde sus relaciones o deja uno sin explicar.',
    'Atribuye un modificador a otro núcleo y cambia qué lugar o cualidad se describe.',
    'No identifica relaciones verificables entre núcleo y modificadores en la guía disponible.',
   ])
   if(r.templateId==='guide-feature-punctuation')return criterion('feature-punctuation','Puntuación de la guía recibida',3,[
    `Corrige ${r.title.toLowerCase()} donde corresponda, conservando el sentido de los enunciados de la guía recibida.`,
    'Las correcciones delimitan los enunciados y sus funciones; queda un signo secundario por ajustar.',
    'Corrige algunos signos, pero deja enumeraciones, citas o preguntas con límites ambiguos.',
    'Los signos corregidos convierten una pregunta en afirmación o cambian qué datos se enumeran o citan.',
    'No aporta correcciones verificables de la puntuación solicitada.',
   ])
   return r
  })
  if(/original|correccion|cambios/.test(task))rows.push(criterion('revision-evidence','Explicación de las correcciones',2,[
   `${/original/.test(task)?'Entrega el original y la corrección':'Presenta la corrección'} de la guía y explica ${/un cambio/.test(task)?'un cambio lingüístico':'los cambios lingüísticos'} sin modificar los lugares y datos recibidos.`,
   'La corrección permite localizar los cambios solicitados; una explicación necesita precisión.',
   'Presenta correcciones, pero no explica qué problema resuelve el cambio señalado.',
   'La explicación atribuye al texto recibido cambios que no se realizaron.',
   'No aporta una explicación verificable de la corrección solicitada.',
  ]))
  return rows
 }
 const classify=/clasifi(?:c|qu)/.test(task)
 if(classify&&!rows.some(r=>r.templateId==='guide-procedure-classification'))rows.push(...languagePlaceClassification('Clasificar los lugares'))
 const planningOnly=production&&/\bplanifi\w*\b/.test(task)&&/solo.*(?:plan|esquema)|antes de.*(?:produc|present)/.test(task)
 if(planningOnly){
  const planning=rows.filter(r=>r.templateId==='guide-procedure-outline'||r.templateId==='guide-procedure-classification')
  planning.unshift(criterion('plan-purpose','Intención y alcance del plan de guía',4,[
   'Define la intención comunicativa, el público, el tema y el diseño de la futura guía y explica cómo se relacionan en su plan.',
   'Los componentes del plan se corresponden; una decisión de diseño requiere justificación.',
   'Enumera público, tema o diseño, pero no los relaciona con la intención comunicativa.',
   'El diseño o los lugares elegidos contradicen la intención y el público definidos en el plan.',
   'No presenta decisiones reconocibles sobre la intención y el alcance de la guía planificada.',
  ]))
  if(/fichas/.test(task))planning.push(criterion('plan-information','Información disponible para los lugares elegidos',4,[
   'Selecciona lugares de interés y recopila de las fichas los datos necesarios para orientar al público definido en el plan.',
   'Los lugares y sus datos responden al plan; un dato de una ficha necesita precisión.',
   'Elige lugares, pero recopila datos que no permiten reconocer su interés para el público.',
   'Atribuye a una ficha información que corresponde a otro lugar o no está disponible.',
   'No relaciona lugares elegidos y datos disponibles para la guía planificada.',
  ]))
  if(/mapa|grafico|collage/.test(task))planning.push(criterion('plan-visual','Apoyo visual previsto para la ubicación',3,[
   'Elige entre mapa, gráfico o collage el recurso previsto y explica cómo apoyará la descripción topográfica y la ubicación de los lugares en el plan.',
   'El recurso elegido corresponde a los lugares; una relación con su ubicación necesita aclaración.',
   'Nombra un recurso visual, pero no explica cómo ayudará a situar los lugares del plan.',
   'La representación prevista sitúa lugares en relaciones contrarias a las fichas disponibles.',
   'No identifica un recurso previsto ni su relación con la ubicación de los lugares.',
  ]))
  return planning
 }
 if(analysis&&/\bescuch\w*\b/.test(task)){
  const grammatical=rows.filter(r=>grammarIds.includes(r.templateId))
  rows=rows.filter(r=>r.templateId.includes('-procedure-')||r.templateId==='guide-feature-adjectives')
  if(/organiza|estructura/.test(task)&&grammatical.length===3)rows.push(organizationCriterion(grammatical,true))
  const anticipate=/anticip|predicci|que (?:recorrido )?esperan|esperan encontrar/.test(task)
  if(anticipate)rows=replace(rows,'procedure-prediction',criterion('procedure-prediction','Anticipación y comprobación del recorrido',3,[
   'Formula una predicción desde el título y el mapa disponibles y la contrasta con los datos de la guía escuchada.',
   'Relaciona la predicción con un indicio y la comprueba en el audio; una relación necesita precisión.',
   'Propone un recorrido posible, pero no explica qué dato escuchado lo confirma o modifica.',
   'Afirma que el audio confirma un recorrido que contradice la guía escuchada.',
   'No aporta una anticipación ni el contraste solicitado con la guía escuchada.',
  ]))
  if(/parafras|(?:sus|propias) palabras/.test(task))rows=replace(rows,'procedure-paraphrase',criterion('procedure-paraphrase','Reconstrucción del recorrido escuchado',5,[
    `Reconstruye con sus propias palabras los lugares y las indicaciones de la guía escuchada, conservando su sentido${/hablando.*o.*esquema/.test(task)?' mediante la respuesta oral o el esquema permitido':''}.`,
   'El recorrido y sus indicaciones corresponden al audio; una relación requiere aclaración.',
   'Recupera lugares aislados, pero no explica las relaciones que permiten seguir el recorrido.',
   'La respuesta cambia el recorrido o atribuye al audio datos de lugares que no se escucharon.',
   'No ofrece una reconstrucción reconocible del sentido de la guía escuchada.',
  ]))
  if(/cualidades|adjetiv/.test(task))rows=replace(rows,'feature-adjectives',criterion('feature-adjectives','Cualidades de los lugares escuchados',3,[
   `Explica las cualidades de los lugares mediante adjetivos${/calificativos/.test(task)?' calificativos':''} que corresponden a los datos de la guía escuchada.`,
   'Las cualidades corresponden a los lugares; un adjetivo necesita mayor precisión.',
   'Menciona cualidades, pero varias quedan sin relacionarse con los lugares escuchados.',
   'Atribuye a un lugar cualidades contrarias a los datos del audio.',
   'No comunica cualidades reconocibles de los lugares escuchados.',
  ]))
  return rows.map(r=>r.templateId==='guide-procedure-classification'?{...r,observable:r.observable.replace('de la guía','de la guía escuchada')}:r)
 }
 if(analysis){
  const original=firstGradeGuideCriteria('TOURIST_GUIDE_ANALYSIS',description)
  for(const [id,pattern] of [['purpose',/intencion comunicativa|proposito/],['structure',/portada|estructura|cierre/]] as const){
   if(pattern.test(task)&&!rows.some(r=>r.templateId===`guide-${id}`))rows.push(...original.filter(r=>r.templateId===`guide-${id}`))
  }
  if(/intencion comunicativa/.test(task))rows=rows.map(r=>r.templateId==='guide-purpose'?{...r,observable:'Explica la intención comunicativa de la guía disponible relacionando sus datos y recursos con la orientación del visitante.'}:r)
  if(/para que la leeremos|proposito.*lectura|proposito.*leer/.test(task))rows.push(criterion('procedure-reading-purpose','Propósito de la lectura',2,[
   'Define para qué leerá la guía y qué información necesita obtener para orientar la visita.',
   'El propósito corresponde a la guía; una necesidad de información queda poco precisa.',
   'Propone leer para conocer lugares, pero no identifica qué información necesita obtener.',
   'El propósito elegido requiere información que la guía disponible no ofrece.',
   'No explicita el propósito solicitado para la lectura de la guía.',
  ]))
  if(/que esperan encontrar|anticip|predicci/.test(task)&&!rows.some(r=>r.templateId==='guide-procedure-prediction'))rows.push(criterion('procedure-prediction','Anticipación y comprobación de la lectura',3,[
   'Anticipa el contenido desde el título y la fotografía disponibles y contrasta su predicción con datos de la lectura de la guía.',
   'Relaciona indicios y predicción y la comprueba; una relación con lo leído necesita precisión.',
   'Anticipa contenido posible, pero no demuestra qué dato de la lectura lo confirma o modifica.',
   'Afirma que un dato leído confirma una predicción que contradice la guía.',
   'No presenta anticipación ni contraste reconocible con la información leída.',
  ]))
  if(/grafico.*o.*digital/.test(task))rows=rows.map(r=>r.templateId==='guide-procedure-reconstruction'?{...r,observable:'Reconstruye el sentido global y las relaciones entre los lugares de la guía leída mediante un gráfico sencillo o una herramienta digital, sin cambiar sus datos.'}:r)
  if(rows.some(r=>r.templateId==='guide-procedure-reconstruction'||r.templateId==='guide-procedure-paraphrase'))rows=rows.filter(r=>r.templateId!=='guide-interpretation')
  if(/expli\w*.*(?:portada|estructura).*orienta/.test(task))rows=replace(rows,'structure',criterion('structure','Función de las partes de la guía',4,[
   `Explica cómo la portada, la información, ${/imagenes/.test(task)?'las imágenes y ':''}el cierre presentes orientan al visitante, con ejemplos de las partes de la guía disponible.`,
   'Distingue las partes y su función; un ejemplo necesita relacionarse con la orientación del visitante.',
   'Nombra partes de la guía, pero no explica qué información aportan a la visita.',
   'Atribuye a una parte información o una función que corresponde a otra.',
   'No identifica partes ni funciones reconocibles en la guía disponible.',
  ]))
  if(/(?:reconozc\w*|reconoc\w*).*organizar la informacion/.test(task)){
   const grammatical=rows.filter(r=>grammarIds.includes(r.templateId))
   if(grammatical.length===3){
    rows=rows.filter(r=>!grammarIds.includes(r.templateId))
    rows.push(organizationCriterion(grammatical,false))
   }
  }
 }
 if(analysis&&/apariencia|estimulos|atractivos y contenido/.test(task)){
  rows=rows.filter(r=>!['guide-resources','guide-feature-appearance'].includes(r.templateId))
  rows.push(criterion('feature-appearance','Apariencia y estímulos al servicio del contenido',3,[
   'Analiza cómo la apariencia y los estímulos destacan los atractivos y el contenido de la guía disponible, distinguiendo información útil del adorno con evidencias.',
   'Relaciona apariencia e información de los lugares; un efecto del recurso necesita sustento.',
   'Describe colores o adornos, pero no explica qué información de los atractivos ayudan a comprender.',
   'Toma un adorno como prueba de una cualidad que el contenido de la guía no sostiene.',
   'No relaciona la apariencia de la guía con información reconocible de sus lugares.',
  ]))
  rows=replace(rows,'purpose',criterion('purpose','Propósito y destinatario de la guía',4,[
   'Explica a qué destinatario invita la guía y cómo su información orienta la visita, con datos de la guía disponible.',
   'Reconoce destinatario y propósito; un dato de apoyo necesita relacionarse con su explicación.',
   'Identifica un destinatario posible, pero no explica cómo la guía responde a sus necesidades.',
   'Atribuye a la guía un destinatario o propósito contrario a la información disponible.',
   'No identifica el propósito ni el destinatario de la guía analizada.',
  ]))
  if(/portada|cierre|estructura/.test(task))rows=replace(rows,'structure',criterion('structure','Función de las partes de la guía',4,[
   'Explica cómo la portada, la información y el cierre presentes orientan al visitante, con ejemplos de cada parte de la guía disponible.',
   'Distingue las partes y su función; un ejemplo requiere relacionarse mejor con la orientación.',
   'Nombra partes, pero no explica qué información aportan al visitante.',
   'Atribuye al cierre o a la portada información que corresponde a otra parte de la guía.',
   'No identifica partes ni funciones reconocibles en la guía disponible.',
  ]))
  if(/mapa/.test(task))rows=replace(rows,'visual',criterion('visual','Relación del mapa con los lugares',3,[
   'Explica con datos cómo el mapa disponible representa los lugares y ayuda a comprender su ubicación en la guía.',
   'Relaciona los lugares con el mapa; una referencia necesita aclaración.',
   'Menciona lugares del mapa, pero no explica cómo su representación ayuda a orientarse.',
   'Atribuye al mapa un lugar o una ubicación que no representa.',
   'No establece una relación reconocible entre el mapa y los lugares de la guía.',
  ]))
  if(/palabras.*atractiv|persuasiv/.test(task))rows=replace(rows,'feature-persuasion',criterion('feature-persuasion','Vocabulario atractivo y persuasivo',3,[
   'Explica con ejemplos cómo el vocabulario atractivo y persuasivo invita al visitante apoyándose en cualidades presentes en el contenido de la guía.',
   'Relaciona palabras y cualidades de los lugares; un efecto persuasivo queda poco explicado.',
   'Cita palabras llamativas, pero no explica qué cualidad del lugar sostiene la invitación.',
   'Atribuye a las palabras una promesa contraria a los datos disponibles de los lugares.',
   'No aporta ejemplos del vocabulario ni de su función de invitación en la guía.',
  ]))
 }
 if(production||oral){
  const existingContent=rows.find(r=>r.templateId==='guide-content')
  const placeTopic=task.match(/\bguias? turisticas? de (.+?)(?= para | con |\. |$)/)?.[1]
  if(existingContent&&(placeTopic||/barrio|fichas|datos de lugares entregados|informacion que reunimos|informacion (?:disponible|entregada)/.test(task))){
   const source=/fichas/.test(task)?'según las fichas entregadas':/datos de lugares entregados/.test(task)?'según los datos entregados de los lugares':/barrio/.test(task)?'sobre los lugares del barrio':/informacion que reunimos/.test(task)?'a partir de la información disponible reunida de la comunidad':`sobre ${placeTopic??'los lugares de la información disponible'}`
   const observable=`${oral?'Presenta':'Incluye'} datos pertinentes ${source}, conservando la información que permite reconocer las características y atractivos de cada lugar.`
   rows=rows.map(r=>r===existingContent?{...r,observable,progressionLevels:[observable,...r.progressionLevels.slice(1)] as Criterion['progressionLevels']}:r)
  }
  if(production){
   if(rows.some(r=>r.templateId==='guide-structure'))rows=rows.filter(r=>r.templateId!=='guide-organization')
   rows=rows.map(r=>r.templateId==='guide-structure'?{...r,observable:/portada|cierre/.test(task)?'Organiza la guía con portada, información y cierre para que el visitante localice los datos de cada lugar.':'Organiza la información de los lugares en partes reconocibles que permiten orientarse a quien no conoce el lugar.',progressionLevels:/portada|cierre/.test(task)?[
    'La portada, la información y el cierre permiten localizar y relacionar los datos de cada lugar de la guía.',
    'Las tres partes son reconocibles; una relación entre la información y el cierre necesita precisión.',
    'Presenta información de los lugares, pero deja la portada o el cierre sin desarrollar.',
    'La organización mezcla datos de lugares distintos o confunde la función de las partes.',
    'No presenta partes reconocibles para localizar la información de la guía.',
   ]:[
    'La organización permite localizar cada lugar y relacionarlo con las indicaciones para el visitante.',
    'La información de cada lugar se localiza; una indicación queda separada de su referente.',
    'Presenta datos de lugares, pero su distribución dificulta asociarlos con la visita.',
    'Sitúa datos bajo lugares distintos y cambia su sentido para el visitante.',
    'No presenta una organización reconocible de la información de los lugares.',
   ]}:r)
   if(!/sustantiv|adjetiv|indicativo/.test(task))rows=rows.map(r=>r.templateId==='guide-description'?criterion('description','Descripción y orientación al visitante',4,[
    `Describe las características y la ubicación de los lugares con lenguaje comprensible para ${/familias/.test(task)?'las familias visitantes':/estudiantes nuevos/.test(task)?'los estudiantes nuevos del centro':'quien no conoce el lugar'}.`,
    'Las descripciones permiten reconocer y situar los lugares; una expresión necesita precisión.',
    'Nombra lugares y cualidades, pero no explica cómo reconocerlos o ubicarlos en la visita.',
    'La descripción atribuye a un lugar características o ubicación de otro.',
    'No describe características que orienten al visitante sobre los lugares.',
   ]):r)
   else if(/visitantes jovenes/.test(task))rows=rows.map(r=>r.templateId==='guide-description'?criterion('description','Descripción adecuada al visitante',4,[
    `Describe las cualidades de ${placeTopic??'los lugares'} con información comprensible y pertinente para visitantes jóvenes, sin atribuirles atractivos que los datos no sostienen.`,
    'Las descripciones permiten al público reconocer los atractivos; una expresión necesita precisión.',
    'Nombra lugares y cualidades, pero no explica su interés para los visitantes definidos.',
    'La descripción promete atractivos que contradicen los datos de los lugares.',
    'No describe características comprensibles y pertinentes para el visitante definido.',
   ]):r)
   if(/revis\w* que el nucleo/.test(task)&&!/borrador|revis\w* la informacion/.test(task))rows=rows.filter(r=>r.templateId!=='guide-process-revision')
   if(/registro/.test(task))rows.push(criterion('register','Registro adecuado al público',2,[
    `Mantiene el registro acordado y un vocabulario comprensible para ${/estudiantes nuevos/.test(task)?'los estudiantes nuevos del centro':'el público definido para la guía'}.`,
    'El registro permite comprender las indicaciones; una expresión necesita ajustarse al público.',
    'Alterna expresiones que dificultan al público comprender varias indicaciones de la visita.',
    'El registro atribuye información o un trato incompatible con el público definido.',
    'No comunica indicaciones comprensibles para el público de la guía.',
   ]))
   rows=rows.map(r=>r.templateId==='guide-process-revision'?/borrador/.test(task)?criterion('process-revision','Revisión del borrador y versión final',2,[
    `Entrega el borrador y la versión final de la guía y muestra los cambios que resuelven los problemas identificados al revisar${/companero/.test(task)?' con el compañero':''}.`,
    'Ambas versiones permiten reconocer los cambios; queda un problema secundario por corregir.',
    'Presenta ambas versiones, pero los cambios no resuelven los problemas señalados en la revisión.',
    'La versión final cambia los datos de los lugares o introduce contradicciones con el borrador.',
    'No aporta el borrador y la versión final que permitan verificar la revisión solicitada.',
   ]):criterion('process-revision','Revisión de la información de la guía',2,[
    'Revisa que la información y las indicaciones de la guía correspondan a los datos de los lugares antes de entregar la versión revisada.',
    'La información revisada corresponde a los lugares; queda una indicación secundaria por precisar.',
    'La versión conserva datos o indicaciones ambiguos que dificultan reconocer los lugares.',
    'La revisión cambia un dato del lugar o introduce una indicación contradictoria.',
    'No aporta una versión revisada que permita comprobar la información solicitada.',
   ]):r)
   if(/mural/.test(task))rows=replace(rows,'process-publication',criterion('process-publication','Publicación en el mural solicitado',2,[
    `Dispone la versión final de la guía en el mural solicitado, legible y accesible ${/familias/.test(task)?'a las familias visitantes':'al público definido para la guía'}.`,
    'La guía se consulta en el mural; un rótulo dificulta localizar información secundaria.',
    'La guía está en el mural, pero faltan partes de la versión final necesarias para orientar la visita.',
    'La guía publicada contradice datos de la versión final sobre los lugares.',
    'No hay evidencia de la publicación de la guía en el mural solicitado.',
   ]))
   if(/digital.*plataforma|plataforma.*digital/.test(task))rows=rows.map(r=>r.templateId==='guide-process-publication'?criterion('process-publication','Publicación digital en la plataforma',2,[
    'Publica la versión final digital de la guía en la plataforma del curso, legible y accesible al destinatario definido.',
    'La guía digital se consulta en la plataforma; una referencia dificulta localizar información secundaria.',
    'Se puede acceder a la guía en la plataforma, pero faltan partes de la versión final.',
    'La publicación digital cambia los datos o las indicaciones de la versión final.',
    'No hay evidencia de la publicación digital solicitada en la plataforma.',
   ]):r)
  }
  if(oral&&/cada integrante|intervenciones/.test(task))rows=replace(rows,'individual',criterion('individual','Aportación individual en la guía oral',3,[
   'Cada integrante realiza una intervención reconocible que explica con sus palabras los datos de los lugares asignados, según el reparto acordado.',
   'Se reconoce la aportación de cada integrante; una transición entre intervenciones requiere ajuste.',
   'Se escuchan aportes parciales, pero el reparto deja sin comunicar datos de los lugares asignados.',
   'La intervención atribuye a un lugar datos de otro o contradice el reparto de información.',
   'No se reconoce la aportación individual solicitada en la presentación de la guía.',
  ]))
  if(oral&&/intencion/.test(task))rows=replace(rows,'purpose',criterion('purpose','Intención y orientación de la guía oral',4,[
   `Explica la intención de la visita y relaciona los atractivos de los lugares con ${/visitantes jovenes/.test(task)?'los visitantes jóvenes':'el público definido para la guía'}.`,
   'Los atractivos corresponden al público y la intención; una relación requiere mayor precisión.',
   'Menciona lugares atractivos sin explicar cómo responden a la intención y al público de la visita.',
   'La invitación ofrece cualidades que los datos disponibles no sostienen.',
   'No comunica una intención ni información que oriente al público definido para la guía.',
  ]))
  if(oral&&/grado positivo|comparativo|superlativo/.test(task)){
   const degrees=['positivo','comparativo','superlativo'].filter(degree=>task.includes(degree)).map(degree=>`el grado ${degree}`)
   rows=replace(rows,'feature-adjective-degree',criterion('feature-adjective-degree','Grados del adjetivo sustentados en datos',3,[
   `Emplea ${degrees.join(' o ')} del adjetivo para describir las cualidades de los lugares cuando los datos disponibles permiten sostener esa intensidad o comparación.`,
   'Las intensidades y comparaciones corresponden a los datos; una relación entre cualidades requiere precisión.',
   'Usa grados del adjetivo, pero varias intensidades o comparaciones no se relacionan con los datos de los lugares.',
   'Invierte qué lugar tiene una cualidad o afirma una superioridad que los datos contradicen.',
   'No aporta descripciones con grados pertinentes del adjetivo sustentados en la información disponible.',
   ]))
  }
 }
 if((production||oral)&&/mapa.*\bo\b.*collage/.test(task))rows=replace(rows,'visual',criterion('visual','Recurso visual elegido para orientar',3,[
  'Relaciona el mapa o collage de fotografías elegido con los lugares de la guía para permitir reconocerlos y ubicarlos, sin exigir ambas alternativas.',
  'El recurso elegido corresponde a los lugares; una referencia necesita mayor precisión.',
  'Presenta el recurso elegido, pero varias referencias no permiten relacionarlo con los lugares descritos.',
  'El recurso representa lugares distintos o contradice las ubicaciones de la guía.',
  'No aporta el recurso visual elegido entre las alternativas solicitadas.',
 ]))
 if(oral&&/mapa dado/.test(task))rows=rows.map(r=>r.templateId==='guide-visual'?criterion('visual','Uso del mapa dado',3,[
  'Relaciona el mapa dado con las ubicaciones y descripciones de los lugares que presenta, usándolo para orientar al visitante.',
  'El mapa ayuda a seguir las ubicaciones; una referencia de la explicación necesita precisión.',
  'Muestra el mapa, pero no relaciona varias referencias con los lugares presentados.',
  'La explicación sitúa los lugares en posiciones que contradicen el mapa dado.',
  'No utiliza el mapa dado para apoyar la orientación solicitada.',
 ]):r)
 if((production||oral)&&/dibujo/.test(task)&&!/mapa|collage|fotograf/.test(task))rows=rows.map(r=>r.templateId==='guide-visual'?criterion('visual','Dibujo para orientar al visitante',3,[
  'Relaciona el dibujo solicitado con los lugares y sus indicaciones para ayudar al visitante a reconocerlos o ubicarlos.',
  'El dibujo corresponde a los lugares; una referencia necesita relacionarse mejor con las indicaciones.',
  'Representa lugares, pero no permite asociar varias referencias con las indicaciones de la guía.',
  'El dibujo representa ubicaciones o rasgos contrarios a los datos de los lugares.',
  'No presenta el dibujo solicitado como apoyo a la orientación del visitante.',
 ]):r)
 if(oral)rows=rows.map(r=>r.templateId.includes('-feature-')?{...r,progressionLevels:r.progressionLevels.map(text=>text.replace(/en su texto/g,'en su presentación').replace(/del texto/g,'de la presentación')) as Criterion['progressionLevels']}:r)
 return rows
}
