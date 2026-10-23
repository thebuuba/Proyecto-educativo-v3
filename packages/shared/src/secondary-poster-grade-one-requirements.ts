import {affirmativeLanguageTask} from './language-feature-criteria'
import {firstGradePosterCriteria} from './secondary-poster-grade-one'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'

const criterion=(id:string,title:string,weight:number,levels:Criterion['progressionLevels']):Criterion=>({templateId:id,title,weight,observable:levels[0],progressionLevels:levels})
const replace=(rows:Criterion[],row:Criterion)=>[...rows.filter(r=>r.templateId!==row.templateId),row]
const join=(words:string[])=>words.length<2?words[0]??'':words.slice(0,-1).join(', ')+' y '+words.at(-1)
const graphics=(task:string)=>([[/imagen/,'imágenes'],[/simbolo/,'símbolos'],[/formas/,'formas'],[/color/,'colores'],[/letras|tipograf/,'letras'],[/distribucion/,'distribución'],[/tamano/,'tamaño']] as const).filter(([pattern])=>pattern.test(task)).map(([,name])=>name)
const literary=(task:string,creating:boolean)=>{
 const selected=([
  [/metafor/,'la metáfora','asociar ideas mediante una imagen figurada','la asociación figurada contradice la idea que pretende comunicar'],
  [/pleonasmo/,'el pleonasmo','dar énfasis mediante una reiteración expresiva','la reiteración confunde o contradice la idea que debía enfatizar'],
  [/elipsis/,'la elipsis','omitir palabras recuperables por el contexto','la omisión impide recuperar por el contexto la acción o cambia el sentido del mensaje'],
  [/exageracion|hiperbole/,'la exageración','intensificar una idea sin convertirla en prueba literal de un hecho','la exageración se presenta como un dato literal que el afiche no sostiene'],
 ] as const).filter(([pattern])=>pattern.test(task)),names=join(selected.map(([,name])=>name)),functions=selected.map(([,name,purpose])=>`${name} permite ${purpose}`).join('; ')
 const evidence=/ejemplo de cada/.test(task)?'con un ejemplo de cada recurso solicitado':'con los usos presentes'
 return criterion('poster-feature-literary','Sentido y función de los recursos poéticos',3,[
  `${creating?'Emplea':'Explica'} ${names} ${creating?'para atraer al destinatario sin falsear los datos':evidence+' y su efecto en el destinatario'}: ${functions}.`,
  'Los recursos solicitados se relacionan con su función y el destinatario; una relación entre expresión y efecto necesita precisión.',
  creating?'Los recursos están presentes, pero sus usos no contribuyen al sentido expresivo del mensaje para el destinatario.':'Presenta los recursos solicitados, pero no explica qué aporta su función expresiva al mensaje o al destinatario.',
  `El uso altera el sentido del mensaje: ${selected.map(([, , ,error])=>error).join('; o ')}.`,
  creating?'No incorpora usos reconocibles de los recursos poéticos solicitados.':'No aporta explicaciones reconocibles de los recursos poéticos solicitados.',
 ])
}

export function refineFirstGradePosterRequirements(activity:string,description:string,initial:Criterion[]):Criterion[]{
 const task=affirmativeLanguageTask(description),creating=['POSTER_CREATION','WRITTEN_PRODUCTION'].includes(activity),analyzing=['POSTER_ANALYSIS','ANALYSIS'].includes(activity),comparing=['POSTER_COMPARISON','COMPARISON'].includes(activity)
 const planning=/planifi[cq]\w*|\bplan\b|esquema/.test(task),planOnly=creating&&planning&&!/\b(?:elabor\w*|redact\w*|hagan|cre\w*)\b/.test(task)
 const audience=/familias/.test(task)?'las familias':/publico escolar/.test(task)?'el público escolar':/al curso|para el curso|para el grupo/.test(task)?'el curso':null
 const toAudience=audience?.startsWith('el ')?`al ${audience.slice(3)}`:`a ${audience??'su público'}`
 const graphic=graphics(task),only=/\b(?:solo|unicamente|exclusivamente)\b/.test(task)
 let rows=initial
 if(planOnly){
  const document=/esquema/.test(task)?'esquema':'plan'
  const fields=[/intencion/.test(task)?'intención':'',/destinatario|publico/.test(task)?'destinatario':'',/actividad/.test(task)?'actividad':'',/dia|fecha/.test(task)?'día':'',/lugar/.test(task)?'lugar':'',/acciones/.test(task)?'acciones':''].filter(Boolean)
  rows=fields.length?[criterion('poster-plan-situation','Situación comunicativa prevista',4,[
   `Define en el plan ${join(fields)} de la campaña con los datos entregados, relacionando la convocatoria con lo que necesita comprender su público.`,
   'Los componentes previstos se relacionan con la campaña; un dato secundario necesita precisión.',
   'Enumera componentes de la campaña, pero no relaciona público, intención y acciones previstas.',
   'El plan cambia datos de la actividad o propone acciones incompatibles con la intención y el público.',
   'No define una situación comunicativa reconocible para el afiche previsto.',
  ])]:[]
  rows.push(criterion('poster-procedure-outline','Plan de los componentes textual y visual',3,[
   `Organiza un ${document} de los componentes textual y visual que relaciona las palabras con ${graphic.length?join(graphic):'los recursos gráficos previstos'} para comunicar el mensaje, explicando cómo se distribuirán para facilitar su comprensión.`,
   `El ${document} relaciona texto y decisiones visuales; una relación con el mensaje necesita precisión.`,
   'Nombra recursos previstos, pero no explica cómo su selección o distribución ayudará a comprender el mensaje.',
   'La distribución prevista contradice las relaciones entre el texto y el mensaje de la campaña.',
   `No presenta un ${document} reconocible de los componentes textual y visual previstos.`,
  ]))
  if(/convivencia|equitativ|trato respetuoso/.test(task))rows.push(criterion('poster-plan-convivencia','Mensaje previsto de convivencia',3,[
   'Explica cómo el mensaje previsto promueve convivencia justa y equitativa y un trato respetuoso, sin burlas ni exclusión de participantes.',
   'El mensaje previsto sostiene un trato equitativo; una expresión necesita precisar a quién incluye o qué acción promueve.',
   'Nombra el respeto, pero no relaciona la intención con las acciones previstas para incluir a los participantes.',
   'El mensaje previsto introduce burlas o excluye participantes y contradice la convivencia que anuncia.',
   'No presenta una relación reconocible entre el mensaje previsto y un trato respetuoso y equitativo.',
  ]))
  return rows
 }
 if(comparing&&/hechos/.test(task)&&/cifras/.test(task)&&/ventajas/.test(task)){
  rows=[criterion('poster-arguments-comparison','Contraste de argumentos sustentados',5,[
   'Contrasta cómo ambos afiches usan hechos, cifras y ventajas para convencer y comprueba sus datos con la ficha del evento, sustentando semejanzas y diferencias con información de ambos.',
   'El contraste relaciona los argumentos de ambos afiches con la ficha; una semejanza o diferencia necesita precisar su sustento.',
   'Enumera hechos, cifras o ventajas de ambos afiches, pero no explica la semejanza o diferencia entre sus argumentos.',
   'Atribuye a un afiche datos del otro o sostiene una ventaja que contradice la ficha del evento.',
   'No aporta un contraste reconocible y sustentado de los argumentos de ambos afiches.',
  ])]
  if(/connotativ|connotacion/.test(task))rows.push(criterion('poster-feature-connotation','Asociaciones connotativas en el contraste',3,[
   'Compara las asociaciones connotativas de las palabras de ambos afiches y explica cómo buscan convencer, distinguiéndolas de los hechos y las cifras comprobados.',
   'Las asociaciones corresponden al contexto de ambos mensajes; una relación con la persuasión necesita precisión.',
   'Menciona expresiones de ambos afiches, pero no explica la asociación que añaden al sentido literal.',
   'Presenta una asociación expresiva como un dato comprobado o atribuye al mensaje una asociación contraria a su contexto.',
   'No contrasta asociaciones connotativas reconocibles de ambos afiches.',
  ]))
  return rows
 }
 if(rows.some(r=>r.templateId==='poster-feature-literary')){
  const poetry=literary(task,creating)
  rows=replace(rows,{...poetry,...(/ejemplo de cada/.test(task)?{coveredDeliveryKeys:['quantity-ejemplo']}: {})})
 }
 if(analyzing){
  const reading=/anticip|predicci|inferencia|reconstru|parafras|con sus palabras|propias palabras/.test(task)
  if(reading&&!only){
   const base=firstGradePosterCriteria('POSTER_ANALYSIS','',task)
   for(const row of base)if(!rows.some(r=>r.templateId===row.templateId))rows.push(row)
   if(/proposito|intencion|palabras clave|convencer/.test(task))rows=replace(rows,criterion('poster-purpose','Propósito de lectura e intención del afiche',3,[
    'Relaciona el propósito de lectura con la intención, el destinatario y la acción del afiche, explicando cómo las palabras clave buscan convencer a ese público.',
    'La intención y la acción corresponden al público; una relación con las palabras clave necesita precisión.',
    'Identifica un destinatario o una acción, pero no explica cómo las palabras clave se relacionan con la intención.',
    'Atribuye al afiche una intención o acción que contradice sus palabras y su destinatario.',
    'No relaciona palabras clave, intención y destinatario de manera reconocible.',
   ]))
   if(/anticip|predicci/.test(task))rows=replace(rows,criterion('poster-procedure-prediction','Anticipación desde los indicios gráficos',3,[
    `Utiliza ${join(graphic)} del afiche para anticipar el mensaje y comprueba su predicción con información del texto leído.`,
    'Relaciona un indicio gráfico con la predicción y su comprobación; una relación necesita precisión.',
    'Propone un mensaje posible, pero no relaciona el indicio gráfico con lo que confirma o modifica al leer.',
    'Afirma que el texto confirma una predicción que contradice sus datos.',
    'No presenta una anticipación ni un contraste reconocibles con el afiche leído.',
   ]))
   if(/inferencia/.test(task)){
    rows=rows.filter(r=>r.templateId!=='poster-evidence')
    rows.push(criterion('poster-inference','Inferencia sustentada del mensaje',4,[
     'Formula una inferencia sobre el mensaje y la acción del afiche y explica qué datos o relaciones del texto y la imagen la sostienen.',
     'La inferencia corresponde al mensaje y sus datos; falta precisar una relación entre ellos.',
     'Propone una interpretación posible, pero no explica cómo se desprende de la información del afiche.',
     'La inferencia contradice los datos del afiche o añade una acción ausente.',
     'No presenta una inferencia reconocible y sustentada sobre el mensaje del afiche.',
    ]))
   }
   if(/reconstru|parafras|con sus palabras|propias palabras/.test(task)){
    rows=rows.filter(r=>!['poster-message','poster-procedure-paraphrase'].includes(r.templateId))
    rows.push(criterion('poster-procedure-paraphrase','Reconstrucción del mensaje y sus datos',4,[
     'Reconstruye con sus palabras el mensaje global, la acción propuesta y los datos importantes del afiche, conservando sus relaciones y su intención.',
     'La reconstrucción conserva el mensaje y los datos principales; una relación necesita precisión.',
     'Recupera palabras o datos aislados, pero no reconstruye la relación entre el mensaje y la acción propuesta.',
     'La reconstrucción altera un dato importante o atribuye al afiche una acción que no propone.',
     'No reconstruye un mensaje reconocible con los datos importantes del afiche.',
    ]))
   }
  }
 }
 if(creating){
  if(/feria del libro/.test(task))rows=replace(rows,criterion('poster-message','Invitación a la feria del libro',4,[
   `Comunica una invitación clara a participar en la feria del libro dirigida ${toAudience}, relacionando el mensaje con esa actividad.`,
   'La invitación y la actividad se reconocen; una expresión necesita precisar qué se propone al público.',
   'Nombra la feria, pero el mensaje no permite comprender claramente la invitación a participar.',
   'El mensaje propone una actividad distinta o contradice la intención de invitar a la feria.',
   'No comunica una invitación reconocible a participar en la feria del libro.',
  ]))
  if(audience)rows=rows.map(r=>r.templateId==='poster-audience'?{...r,observable:`Adapta vocabulario, tono y llamado a la acción ${toAudience} para que ${audience.startsWith('las ')?'comprendan':'comprenda'} la propuesta del afiche.`,progressionLevels:[`Adapta vocabulario, tono y llamado a la acción ${toAudience} para que ${audience.startsWith('las ')?'comprendan':'comprenda'} la propuesta del afiche.`,...r.progressionLevels.slice(1)] as Criterion['progressionLevels']}:r)
  if(/hechos/.test(task)&&/cifras/.test(task)&&/ventajas/.test(task)){
   rows=rows.filter(r=>r.templateId!=='poster-feature-statistical-argument')
   rows=replace(rows,criterion('poster-persuasion','Razones sustentadas para participar',4,[
    'Argumenta la invitación con hechos, cifras y ventajas que aparecen en la ficha, relacionándolos con lo que interesa al destinatario sin inventar estadísticas ni promesas.',
    'Los argumentos corresponden a la ficha y la invitación; una relación con la ventaja necesita precisión.',
    'Enumera datos de la ficha, pero no explica por qué sostienen la invitación o la ventaja ofrecida.',
    'Presenta cifras ausentes de la ficha o usa una expresión figurada como prueba de una ventaja literal.',
    'No aporta razones sustentadas en la información disponible para participar.',
   ]))
  }
  if(rows.some(r=>r.templateId==='len-1-poster-event')){
   const data=join([/dia|fecha/.test(task)?'día':'',/hora|horario/.test(task)?'hora':'',/lugar/.test(task)?'lugar':'',/publico|destinatario/.test(task)?'público':'',/actividades|acciones/.test(task)?'actividades':''].filter(Boolean))
   rows=replace(rows,criterion('len-1-poster-event','Datos de la convocatoria según la ficha',3,[
    `Comunica ${data} de la convocatoria según la ficha entregada, sin cambiarlos ni añadir otros datos del evento.`,
    'Los datos principales permiten reconocer cómo participar; una referencia secundaria necesita precisión.',
    'Omite un dato solicitado y dificulta comprender cómo participar en la actividad.',
    'Los datos del afiche contradicen la ficha de la actividad.',
    'No comunica datos reconocibles de la convocatoria solicitada.',
   ]))
  }
  if(planning&&!rows.some(r=>r.templateId==='poster-procedure-outline'))rows.push(criterion('poster-procedure-outline','Plan de los componentes del afiche',2,[
   'Relaciona en el plan las decisiones del componente textual y de la imagen con la intención y los datos del afiche final solicitado.',
   'El plan permite seguir las decisiones principales; una relación con el afiche necesita precisión.',
   'Enumera decisiones de texto e imagen, pero no explica cómo organizarán el mensaje.',
   'El plan propone datos o relaciones entre imagen y texto que contradicen la convocatoria.',
   'No aporta el plan del componente textual y visual solicitado junto con el afiche.',
  ]))
  if(/obligacion.*posibilidad|perifrasis/.test(task)){
   const obligation=/obligacion|deber|tener que/.test(task),possibility=/posibilidad|poder|podria/.test(task)
   if(obligation&&!possibility||possibility&&!obligation){
    const type=obligation?'obligación':'posibilidad',forms=obligation?/deber/.test(task)&&/tener que/.test(task)?'deber y tener que':'las formas de obligación solicitadas':/poder/.test(task)&&/podria/.test(task)?'poder y podría':'las formas de posibilidad solicitadas'
    const reference=/norma/.test(task)&&/ficha/.test(task)?'la norma de la ficha':'la información disponible'
    rows=replace(rows,criterion('poster-feature-periphrasis',`Expresión de ${type} en el afiche`,3,[
     `Emplea ${forms} en el afiche para conservar el alcance de las acciones según ${reference}.`,
     `Las formas de ${type} conservan el alcance de las acciones; un uso aislado requiere precisión.`,
     `Usa formas de ${type}, pero varios enunciados no conservan el alcance de las acciones dadas.`,
     `La forma verbal cambia el alcance de una acción y contradice ${reference}.`,
     `No aporta usos reconocibles de las formas de ${type} solicitadas.`,
    ]))
   }else{
   const forms=/deber/.test(task)&&/tener que/.test(task)&&/poder/.test(task)&&/podria/.test(task)?'las formas de obligación deber y tener que de las formas de posibilidad poder y podría':'las formas de obligación de las formas de posibilidad'
   rows=replace(rows,criterion('poster-feature-periphrasis','Obligación y posibilidad en el mensaje',3,[
    `Distingue en el afiche ${forms} para conservar qué acciones son obligatorias y cuáles son opciones según la información disponible.`,
    'La modalidad conserva obligaciones y opciones; un uso aislado deja ambigua una acción secundaria.',
    'Usa formas modales, pero no distingue en varias acciones lo obligatorio de lo posible.',
    'Convierte una opción en orden o una obligación en sugerencia, contradiciendo la información disponible.',
    'No comunica una distinción reconocible entre obligación y posibilidad.',
   ]))
   }
  }
  if(/norma/.test(task)&&/ficha/.test(task)){
   rows=replace(rows,criterion('poster-message','Acciones y alcance de la norma',4,[
    'Comunica las acciones y el alcance de la norma de la ficha sin inventar otras acciones ni cambiar a quiénes se aplica.',
    'Las acciones corresponden a la norma; una expresión necesita precisar su alcance.',
    'Nombra acciones de la ficha, pero deja ambiguo a quién se aplica la norma o qué pide hacer.',
    'Cambia una acción de la norma o atribuye a la ficha una acción ausente.',
    'No comunica acciones reconocibles de la norma de la ficha.',
   ]))
   if(!/argument|razones/.test(task))rows=rows.filter(r=>r.templateId!=='poster-persuasion')
  }
  if(/convivencia justa y equitativa/.test(task))rows=replace(rows,criterion('poster-message','Acciones de convivencia en el mensaje',4,[
   'Comunica una invitación a participar y acciones concretas de convivencia justa y equitativa con trato respetuoso, sin burlas ni exclusión de compañeros.',
   'Las acciones y la invitación sostienen un trato respetuoso; una expresión necesita precisar cómo incluye a los participantes.',
   'Nombra el respeto, pero no comunica acciones claras para una participación equitativa.',
   'El mensaje contiene burlas o excluye compañeros y contradice la convivencia que anuncia.',
   'No comunica una invitación y acciones reconocibles de convivencia respetuosa y equitativa.',
  ]))
  if(/riesgo/.test(task)&&/ficha|protocolo/.test(task)){
   const source=/simulacro/.test(task)?'la ficha del simulacro y su protocolo dado':'la ficha didáctica proporcionada'
   rows=replace(rows,criterion('poster-message','Riesgo y acciones de la información dada',5,[
    `Comunica el riesgo y las acciones de ${source}, relacionando la alerta con lo que el público debe comprender sin añadir indicaciones ni datos ajenos.`,
    'El riesgo y las acciones corresponden a la información dada; una relación necesita precisión.',
    'Nombra el riesgo, pero no relaciona claramente las acciones disponibles con la alerta.',
    'El mensaje cambia una acción de la información dada o presenta datos ajenos como parte del protocolo.',
    'No comunica una relación reconocible entre el riesgo y las acciones disponibles.',
   ]))
   if(!/argument|razones|convencer/.test(task))rows=rows.filter(r=>r.templateId!=='poster-persuasion')
  }
 }
 if(graphic.length&&!/imagen\s+o\s+simbolo/.test(task)&&rows.some(r=>r.templateId==='poster-visuals'))rows=replace(rows,criterion('poster-visuals',creating?'Decisiones visuales para comunicar':'Función de texto y elementos gráficos',3,[
  creating&&/imagen dada/.test(task)?'Relaciona la imagen dada con el texto y la intención del afiche para ayudar al público a comprender el mensaje.':`${creating?'Selecciona y relaciona':'Explica cómo se relacionan'} ${join(graphic)} con el texto y la intención del afiche para que el público localice y comprenda el mensaje.`,
  'Las decisiones gráficas se relacionan con el texto y la intención; una relación necesita precisión.',
  creating?'Los elementos gráficos están presentes, pero su relación con el texto dificulta reconocer el mensaje o localizar la información.':'Describe elementos gráficos, pero no explica cómo se vinculan con el mensaje y su lectura.',
  'La selección o distribución gráfica contradice el mensaje o confunde una información importante.',
  'No aporta una relación reconocible entre los elementos gráficos solicitados y el texto del afiche.',
 ]))
 if(creating&&rows.some(r=>r.templateId==='poster-visuals'))rows=rows.map(r=>r.templateId==='poster-legibility'?criterion('poster-legibility','Legibilidad y convenciones del texto',2,[
  'Presenta palabras legibles y convenciones de escritura que permiten comprender el texto del afiche sin cambiar su mensaje.',
  'El texto se lee con claridad; un error aislado de escritura necesita ajuste.',
  'Varios errores de escritura vuelven ambiguas partes importantes del mensaje.',
  'La escritura altera el sentido de una acción o un dato importante del afiche.',
  'No presenta texto legible y comprensible para comunicar el mensaje del afiche.',
 ]):r)
 return rows
}
