import {affirmativeLanguageTask,languageFeatureCriterion} from './language-feature-criteria'
import {normalizedTask} from './evaluation-task-text'
import {firstGradeReadingReportCriteria} from './secondary-reading-report-grade-one'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'

const criterion=(id:string,title:string,weight:number,levels:Criterion['progressionLevels']):Criterion=>({templateId:`report-${id}`,title,weight,observable:levels[0],progressionLevels:levels})
const replace=(rows:Criterion[],id:string,row:Criterion)=>rows.map(r=>r.templateId===`report-${id}`?row:r)
const rulesRequested=(task:string)=>/omisi|omit|generaliz|reconstr/.test(task)
const summary=(task:string,correcting=false)=>criterion('summary',correcting?'Revisión del resumen':'Resumen del texto literario',5,[
 `${correcting?'Revisa el resumen':'Resume las ideas principales del texto literario'}${rulesRequested(task)?' mediante omisión de detalles secundarios, selección de ideas esenciales, generalización y reconstrucción con palabras propias':''}, conservando las relaciones y el sentido del texto.`,
 'La síntesis conserva las ideas esenciales y sus relaciones; un detalle secundario podría omitirse o integrarse mejor.',
 'Selecciona algunas ideas importantes, pero conserva detalles secundarios o no reconstruye sus relaciones con palabras propias.',
 'La omisión o la generalización cambia una idea principal o añade hechos ajenos al texto.',
 'No aporta una síntesis reconocible que conserve las ideas esenciales del texto.',
])
const correctionEvidence=()=>criterion('correction-evidence','Explicación de las correcciones',2,[
 'Relaciona el fragmento corregido con el original y explica cómo los cambios solicitados conservan o aclaran su sentido.',
 'Los cambios se relacionan con el original; una explicación necesita precisar qué sentido aclara.',
 'Presenta el fragmento corregido, pero enumera cambios sin explicar su relación con el original.',
 'Justifica un cambio con información ausente del original o altera el sentido que debía conservar.',
 'No aporta el fragmento corregido y la explicación que permitan contrastarlo con el original.',
])

export function refineFirstGradeReadingReportRequirements(activity:string,description:string,initial:Criterion[]):Criterion[]{
 const task=affirmativeLanguageTask(description),raw=normalizedTask(description),oral=activity==='READING_REPORT_PRESENTATION'
 const writing=activity==='READING_REPORT_WRITING'||activity==='REPORT',comparison=activity==='READING_REPORT_COMPARISON'
 const listening=/escuch/.test(task)&&!oral,correction=/\bcorrij\w*|\bcorreg\w*/.test(task)&&initial.some(r=>r.templateId.startsWith('report-feature-')),summaryOnly=/revis\w* unicamente el resumen|revis\w* solo el resumen/.test(task)
 const work=/novela/.test(task)?'la novela':/leyenda/.test(task)?'la leyenda':/fabula/.test(task)?'la fábula':/cuento/.test(task)?'el cuento':'el texto literario'
 const ofWork=work.startsWith('el ')?`del ${work.slice(3)}`:`de ${work}`
 let rows=initial
 if(writing&&/planifi[cq]\w*/.test(task)&&!/redact\w*|escrib\w*|elabor\w*/.test(task)){
  return[criterion('plan-information','Información para el informe previsto',3,[
   `Selecciona información ${ofWork} y sus notas para relacionar el resumen y el análisis${/cultural/.test(task)?' de los comportamientos culturales':''} previstos para sus compañeros.`,
   'La selección corresponde al texto y las notas; falta precisar qué información sostendrá una parte del informe.',
   'Reúne datos pertinentes, pero no explica su relación con el resumen o el análisis previsto.',
   'Atribuye al texto o las notas información ausente y cambia el sentido del informe previsto.',
   'No relaciona información disponible con el contenido previsto del informe.',
  ]),{...criterion('procedure-outline','Esquema del informe previsto',4,[
   `Organiza un esquema para el informe ${ofWork} con título previsto, introducción, desarrollo y conclusión, mostrando dónde se relacionarán resumen y análisis.`,
   'El esquema relaciona las partes previstas; una conexión entre resumen y análisis necesita precisión.',
   'Enumera partes, pero no organiza las relaciones necesarias para desarrollar el informe.',
   'El orden del esquema confunde el resumen con el análisis o contradice el contenido seleccionado.',
   'No aporta un esquema reconocible del informe previsto.',
  ]),coveredDeliveryKeys:['title']}]
 }
 if(writing&&/con el borrador/.test(task)&&/ya escribieron/.test(task)){
  const reviewer=/docente/.test(task)?'la docente':/companero/.test(task)?'sus compañeros':'la revisión solicitada'
  const medium=/plataforma digital/.test(task)?'la plataforma digital del curso':/mural/.test(task)?'el mural del aula':'el medio solicitado'
  const audience=/otro grupo/.test(task)?'otro grupo':'el público del informe'
  const revisionRows=[
  criterion('process-revision','Correcciones desde las observaciones recibidas',4,[
   `Relaciona las observaciones de ${reviewer} con cambios entre borrador y versión final que mejoran organización, coherencia y cohesión del informe sin alterar el sentido del análisis.`,
   'Las correcciones resuelven las observaciones principales; una relación entre ideas necesita precisión.',
   `Cambia aspectos de forma, pero conserva problemas de organización o relaciones entre ideas señalados por ${reviewer}.`,
   'Los cambios introducen contradicciones o eliminan apoyos necesarios para comprender el análisis.',
   'No aporta borrador con observaciones y versión revisada que permitan comprobar las correcciones.',
  ])]
  if(/habitos|pautas culturales/.test(task))revisionRows.push(criterion('analysis-fidelity','Fidelidad y respeto en el análisis revisado',4,[
   'Conserva el análisis de los hábitos y las pautas culturales con sus ejemplos del relato, sin burlas ni generalizaciones sobre una comunidad que el texto no sustenta.',
   'El análisis revisado conserva sus ejemplos y trata respetuosamente las prácticas; una expresión necesita precisar su contexto.',
   'Conserva algunas prácticas culturales, pero pierde la relación de sus ejemplos con el análisis.',
   'La revisión atribuye al relato prácticas ausentes o introduce burlas y generalizaciones sobre una comunidad.',
   'No conserva un análisis reconocible y sustentado de los hábitos y las pautas culturales.',
  ]))
  if(/publi\w*/.test(task))revisionRows.push(criterion('process-publication','Publicación del informe revisado',2,[
   `Publica la versión final legible en ${medium} para que ${audience} comprenda el análisis, conservando la organización y el contenido revisados.`,
   'El informe puede consultarse en el medio solicitado; un enlace entre sus partes necesita mejorar su presentación.',
   'La versión está publicada, pero faltan partes necesarias para comprender el análisis revisado.',
   'La versión publicada cambia relaciones o ejemplos respecto del informe revisado.',
   'No aporta la versión final publicada en el medio solicitado.',
  ]))
  return revisionRows
 }
 if(summaryOnly)return[summary(task,true),correctionEvidence()]
 if(correction){
  rows=rows.filter(r=>r.templateId.startsWith('report-feature-')&&!r.templateId.endsWith('-summary'))
  rows=rows.map(r=>{
   const target=r.title.toLowerCase(),ofTarget=target.startsWith('el ')?`del ${target.slice(3)}`:`de ${target}`,purpose=r.templateId.endsWith('indicative')?'distinguir el presente del análisis y el pasado de los hechos narrados':r.templateId.endsWith('adjectives')?'caracterizar fielmente las costumbres del texto':r.templateId.endsWith('additive-connectors')?'añadir ideas compatibles del análisis':r.templateId.endsWith('exemplification')?'relacionar afirmaciones y ejemplos que las sostienen':'distinguir los ejemplos y las citas sin cambiar su sentido'
   return criterion(r.templateId.replace('report-',''),`Corrección ${ofTarget}`,r.weight,[
    `Corrige ${target} en el fragmento recibido para ${purpose}, conservando el sentido del original.`,
    `Las correcciones ${ofTarget} aclaran las relaciones solicitadas; un uso aislado necesita precisión.`,
    `Corrige algunos usos ${ofTarget}, pero otros siguen impidiendo ${purpose}.`,
    `La corrección ${ofTarget} cambia una relación o un dato que debía conservar del original.`,
    `No aporta correcciones reconocibles ${ofTarget} en el fragmento recibido.`,
   ])
  })
  return /expli\w*.*cambios/.test(task)?[...rows,correctionEvidence()]:rows
 }
 if(writing&&/solo un parrafo|unicamente un parrafo/.test(task)){
  rows=rows.filter(r=>r.templateId.startsWith('report-feature-'))
  const object=/costumbre/.test(task)?'una costumbre':/personaje/.test(task)?'las acciones del personaje':'el aspecto solicitado'
  const analysis=criterion('analysis','Párrafo de análisis sustentado',5,[
   `Explica en un párrafo ${object} ${ofWork} con un ejemplo del relato, relacionándolo con lo que permite interpretar.`,
   'La interpretación y el ejemplo se relacionan; falta precisar una parte de su explicación.',
   'Menciona el aspecto solicitado y un ejemplo, pero no explica la relación entre ambos.',
   'El párrafo atribuye al texto un dato o un ejemplo que sus hechos contradicen.',
   'No aporta un párrafo de análisis con el aspecto solicitado y un ejemplo reconocibles del relato.',
  ])
  rows.unshift({...analysis,coveredDeliveryKeys:['quantity-parrafo','quantity-ejemplo']})
  if(/comillas/.test(task)&&/pregunta.*exclamacion/.test(task))rows=replace(rows,'feature-punctuation',{
   ...criterion('feature-punctuation','Puntuación de ejemplos y voces citadas',3,[
    'Usa comas para separar ejemplos y dos puntos para presentar una cita; entre comillas reproduce una pregunta y una exclamación de los personajes conservando sus signos, su atribución y su sentido.',
    'Los signos distinguen ejemplos y voces citadas; un signo aislado deja ambigua una relación secundaria.',
    'Incluye signos solicitados, pero no diferencia claramente los ejemplos, las citas y las voces de los personajes.',
    'La puntuación altera el sentido de una pregunta o exclamación o atribuye a un personaje palabras de otro.',
    'No aporta un uso verificable de los signos solicitados en los ejemplos y las voces citadas.',
   ]),coveredDeliveryKeys:['quantity-cita'],
  })
  return rows
 }
 if(comparison&&/resumen/.test(task)&&/sociocultural|costumbres/.test(task)){
  rows=rows.filter(r=>r.templateId==='report-feature-summary')
  rows.push(criterion('analysis','Comparación de análisis socioculturales',5,[
   'Contrasta las costumbres y sus interpretaciones en ambos informes y sustenta semejanzas y diferencias con datos de ambos y del texto literario, sin jerarquizar culturas.',
   'Relaciona los análisis de ambos informes con el texto literario; una semejanza o diferencia necesita precisar su sustento.',
   'Menciona costumbres de ambos informes, pero no explica la semejanza o diferencia entre sus interpretaciones.',
   'Atribuye a un informe una interpretación del otro o usa datos del texto literario que contradicen su contraste.',
   'No presenta un contraste sustentado de las interpretaciones socioculturales de ambos informes.',
  ]))
  return rows
 }
 if(activity==='READING_REPORT_ANALYSIS'){
  const original=firstGradeReadingReportCriteria(activity,task)
  const focus=/sociocultural|costumbres|practicas culturales|pautas culturales/.test(task)?'las prácticas culturales':/personaje/.test(task)?'las acciones del personaje':'el contenido interpretado'
  const readingSteps=/anticip|predicci|inferenc|parafras|con sus palabras|propias palabras/.test(task)
  if(listening||readingSteps){
   rows=rows.filter(r=>r.templateId.includes('-feature-')&&!r.templateId.endsWith('-summary'))
   if(/proposito|para que|intencion/.test(task))rows.push(criterion('purpose','Propósito del análisis comprendido',3,[
    `${listening?'Relaciona la intención del análisis escuchado':'Relaciona el propósito de lectura'} con la comprensión de ${focus} del texto.`,
    'El propósito corresponde al análisis; una relación con su contenido necesita precisión.',
    'Nombra una intención general, pero no la relaciona con lo que el análisis permite comprender.',
    'Atribuye al análisis una intención contraria a la información disponible.',
    'No explica una intención reconocible del análisis disponible.',
   ]))
   if(/introduccion|desarrollo|conclusion|estructura/.test(task))rows.push(criterion('structure','Función de las partes del informe',4,[
    `Relaciona ${/titulo/.test(task)?'el título, ':''}la introducción, el desarrollo y la conclusión del informe ${listening?'escuchado':'leído'} con la presentación, explicación y cierre del análisis para comprender ${focus}.`,
    'Relaciona las partes con sus funciones en el análisis; una relación necesita precisar qué información organiza.',
    'Nombra partes del informe, pero no explica cómo ayudan a comprender su análisis.',
    'Atribuye a una parte información o una función que corresponde a otra y altera la interpretación.',
    'No relaciona partes reconocibles del informe con la comprensión del análisis.',
   ]))
   const source=listening?'informe escuchado':'informe leído'
   if(/anticip|predicci|que crees|que creen/.test(task)){
    const clues=/subtitulo/.test(task)?'el título y el subtítulo':/titulo/.test(task)?'el título':'los indicios disponibles'
    rows=rows.filter(r=>r.templateId!=='report-procedure-prediction')
    rows.push(criterion('procedure-prediction','Anticipación y comprobación del análisis',3,[
     `Formula una predicción desde ${clues} y explica qué datos del ${source} la confirman o modifican${/durante.*despues/.test(task)?' durante y después de la lectura':''}.`,
     'Relaciona el indicio y la predicción con datos del informe; una relación necesita precisión.',
     'Propone un contenido posible, pero no explica qué dato confirma o modifica su predicción.',
     'Afirma que el informe confirma una predicción que sus datos contradicen.',
     'No aporta una predicción ni el contraste solicitado con la información del informe.',
    ]))
   }
   if(/inferencia/.test(task))rows.push(criterion('inference','Inferencia sustentada del análisis',4,[
    `Explica una inferencia que permite comprender ${focus} y la sustenta relacionando datos del ${source}.`,
    'La inferencia se apoya en datos pertinentes; falta precisar una relación entre ellos.',
    'Propone una inferencia posible, pero no explica cómo se desprende de los datos del informe.',
    'La inferencia contradice datos del informe o agrega información ausente.',
    'No formula una inferencia reconocible sobre el análisis disponible.',
   ]))
   if(listening||/parafras|propias palabras|con sus palabras/.test(task))rows=rows.filter(r=>r.templateId!=='report-procedure-paraphrase').concat(criterion('procedure-paraphrase','Paráfrasis fiel del análisis',4,[
    `Reconstruye brevemente con sus palabras el análisis del ${source} sobre ${focus}, conservando sus relaciones y los datos que lo sostienen.`,
    'La paráfrasis conserva el análisis y sus apoyos; una formulación requiere precisión.',
    'Repite datos aislados sin reconstruir las relaciones que explica el análisis.',
    'La paráfrasis cambia una relación del análisis o atribuye al informe información ausente.',
    'No aporta una reconstrucción reconocible del análisis disponible.',
   ]))
  }else if(!rows.length)rows=original
 }
 if(writing||oral){
  if(rows.some(r=>r.templateId==='report-summary')&&rulesRequested(task))rows=replace(rows,'summary',summary(task))
  const sociocultural=/sociocultural|costumbres|estilos de vida|pautas culturales/.test(task)
  if(sociocultural){
   const cultures=/costumbres.*comportamientos.*estilos de vida.*pautas culturales/.test(task)?'las costumbres, los comportamientos, los estilos de vida y las pautas culturales':'los patrones socioculturales'
   rows=replace(rows,'analysis',criterion('analysis','Análisis sociocultural sustentado',5,[
    `Interpreta ${cultures} presentes en el texto literario mediante ejemplos de sus acciones y relaciones${writing&&/para sus companeros/.test(task)?', con vocabulario comprensible para sus compañeros':''}${/superior/.test(raw)?', sin presentar unas prácticas culturales como superiores a otras':''}.`,
    'Relaciona las prácticas culturales con ejemplos del texto; una relación entre comportamiento y contexto necesita precisión.',
    'Describe prácticas o comportamientos, pero no explica cómo los ejemplos sostienen su interpretación.',
    'La interpretación atribuye al texto prácticas o comportamientos ausentes o contrarios a sus acciones.',
    'No aporta una interpretación sustentada de las prácticas culturales del texto literario.',
   ]))
  }
  if(oral){
   const base=firstGradeReadingReportCriteria('READING_REPORT_PRESENTATION',task)
   const requestedIndividual=/cada integrante|aporte individual|respon\w*.*preguntas/.test(task)
   rows=rows.filter(r=>!r.templateId.includes('-process-')&&(r.templateId!=='report-individual'||requestedIndividual))
   for(const r of base)if(!rows.some(row=>row.templateId===r.templateId)&&(r.templateId!=='report-individual'||requestedIndividual))rows.push(r)
   rows=rows.map(r=>{
    if(!r.templateId.startsWith('report-feature-'))return r
    const purpose=r.observable.match(/(?:su funcion|su función) para (.+?)\.$/)?.[1]
    if(!purpose)return r
    return languageFeatureCriterion({id:r.templateId.replace('report-feature-',''),match:'',name:r.title.toLowerCase(),function:purpose,error:r.progressionLevels[3].split(': ').at(-1)!.replace(/\.$/,'')},'report','informe de lectura','oral-production')
   })
   if(/fabula/.test(task))rows=rows.map(r=>r.templateId==='report-summary'?{...r,title:'Resumen oral de la fábula',observable:r.observable.replace('del texto literario','de la fábula seleccionada'),progressionLevels:[r.observable.replace('del texto literario','de la fábula seleccionada'),...r.progressionLevels.slice(1)] as Criterion['progressionLevels']}:r)
   if(/para que|para ayudar|intencion/.test(task))rows.push(criterion('purpose','Texto e intención de la presentación',3,[
    `Presenta el texto literario elegido y explica cómo el informe ayudará a ${/otro grupo/.test(task)?'otro grupo':'su público'} a comprender sus comportamientos y valores.`,
    'El texto y la intención se reconocen; una relación con lo que necesita comprender el público requiere precisión.',
    'Nombra el texto, pero no relaciona la presentación con lo que pretende ayudar a comprender.',
    'Anuncia una intención incompatible con el texto o atribuye a la obra comportamientos ausentes.',
    'No presenta una relación reconocible entre texto elegido e intención del informe oral.',
   ]))
  }
  if(rows.some(r=>r.templateId.startsWith('report-feature-')))rows=rows.filter(r=>r.templateId!=='report-coherence')
  else rows=replace(rows,'coherence',criterion('coherence','Relación entre resumen y análisis',3,[
   'Enlaza las ideas del resumen y del análisis con vocabulario comprensible y relaciones que conservan el sentido del texto.',
   'La relación entre resumen y análisis se comprende; un enlace necesita precisión.',
   'Presenta ideas aisladas sin explicar la relación entre lo resumido y lo interpretado.',
   'Las relaciones entre ideas contradicen los hechos o la interpretación del texto.',
   'No se reconoce una relación comprensible entre resumen y análisis.',
  ]))
  rows=rows.map(r=>r.templateId==='report-revision'?{...r,title:'Claridad y convenciones del informe'}:r)
  if(writing&&/esquema/.test(task)&&/consult|notas/.test(task))rows=replace(rows,'procedure-outline',criterion('procedure-outline','Elección del texto y planificación del informe',3,[
   'Elige un cuento leído y selecciona información del cuento y las notas entregadas para un esquema con título pertinente, introducción, desarrollo y conclusión dirigido a sus compañeros.',
   'El esquema organiza información pertinente del cuento y las notas; una relación entre sus partes requiere precisión.',
   'Selecciona información pertinente, pero la enumera sin organizar cómo sostendrá el resumen y el análisis.',
   'El esquema atribuye al cuento datos ausentes o dispone relaciones incompatibles con el análisis previsto.',
   'No aporta un esquema que relacione la información consultada con el informe previsto.',
  ]))
  if(writing&&/companero/.test(task))rows=replace(rows,'process-revision',criterion('process-revision','Revisión del borrador con un compañero',2,[
   'Relaciona las observaciones del compañero con correcciones entre borrador e informe final que aclaran contenido, organización o escritura sin alterar el sentido del texto literario.',
   'Los cambios resuelven las observaciones principales; una corrección necesita precisar su relación con el borrador.',
   'Incluye cambios de forma, pero conserva problemas de contenido u organización señalados por el compañero.',
   'Los cambios contradicen el texto literario o eliminan datos necesarios para comprender el análisis.',
   'No aporta borrador revisado e informe final que permitan verificar las correcciones solicitadas.',
  ]))
  if(writing&&/mural/.test(task))rows=replace(rows,'process-publication',criterion('process-publication','Publicación del informe en el mural',2,[
   'Publica en el mural del aula el informe final, legible y organizado para que sus compañeros comprendan el análisis del texto literario.',
   'El informe puede consultarse en el mural; una relación entre sus partes necesita mejorar su presentación.',
   'El mural contiene el informe, pero faltan partes necesarias para comprender su análisis.',
   'La versión publicada cambia datos o interpretaciones respecto del informe final revisado.',
   'No hay evidencia de la publicación del informe final solicitada en el mural.',
  ]))
 }
 return rows.map(r=>{
  const purpose=r.templateId==='report-feature-indicative'&&/presente/.test(task)&&/pasado/.test(task)?'distinguir el presente del análisis y el pasado de los hechos narrados'
   :r.templateId==='report-feature-adjectives'&&/sociocultural|costumbres|practicas culturales/.test(task)?'caracterizar las prácticas culturales mediante cualidades que el texto sustenta':null
  if(purpose)r=languageFeatureCriterion({id:r.templateId.replace('report-feature-',''),match:'',name:r.title.toLowerCase(),function:purpose,error:r.templateId==='report-feature-indicative'?'se confunde el presente del análisis con el pasado de los hechos narrados':'se atribuye a una práctica cultural una cualidad que el texto no sostiene'},'report','informe de lectura',oral?'oral-production':writing?'production':'analysis')
  if(oral&&r.templateId.startsWith('report-feature-'))r={...r,progressionLevels:r.progressionLevels.map(t=>t.replace('en su texto.','en su intervención oral.')) as Criterion['progressionLevels']}
  return r.templateId==='report-structure'?{...r,coveredDeliveryKeys:[...r.coveredDeliveryKeys??[],'title']}:r
 })
}
