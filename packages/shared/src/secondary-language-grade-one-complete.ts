import {firstGradeNewsCriteria as news} from './secondary-news-grade-one'
import {firstGradeGuideCriteria as guide} from './secondary-guide-grade-one'
import {firstGradeReadingReportCriteria as report} from './secondary-reading-report-grade-one'
import {firstGradePosterCriteria as poster} from './secondary-poster-grade-one'
import {firstGradeDetectiveCriteria as detective} from './secondary-detective-grade-one'
import {firstGradeCalligramCriteria as calligram} from './secondary-calligram-grade-one'
import {normalizedTask} from './evaluation-task-text'
import {explicitWritingProcess, languageFeatureCriterion, requestedLanguageFeatures, type LanguageFeature} from './language-feature-criteria'
import {firstGradeLanguageProcedureFeatures,firstGradeLanguageFeatureTerms,languageReadingProcedures,languageWritingProcedures,languagePlaceClassification} from './language-procedure-criteria'
import {firstGradeLanguageCompletionFeatures,specializePunctuation} from './language-procedure-completion'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {isFirstGradeNewsActivity as supportsNews} from './secondary-news-grade-one'
import {isFirstGradeGuideActivity as supportsGuide} from './secondary-guide-grade-one'
import {isFirstGradePosterActivity as supportsPoster} from './secondary-poster-grade-one'
import {isFirstGradeDetectiveActivity as supportsDetective} from './secondary-detective-grade-one'
import {isFirstGradeCalligramActivity as supportsCalligram} from './secondary-calligram-grade-one'

export const isFirstGradeNewsActivity=(activity:string)=>supportsNews(activity)||activity==='RESEARCH'
export const isFirstGradeGuideActivity=(activity:string)=>supportsGuide(activity)||activity==='RESEARCH'
export const isFirstGradePosterActivity=(activity:string)=>supportsPoster(activity)||activity==='REPORT'
export const isFirstGradeDetectiveActivity=(activity:string)=>supportsDetective(activity)||activity==='REPORT'
export const isFirstGradeCalligramActivity=(activity:string)=>supportsCalligram(activity)||activity==='REPORT'

const adjectives: LanguageFeature = {id:'adjectives',match:'adjetiv',name:'los adjetivos',function:'caracterizar los referentes del texto',error:'se atribuye una cualidad o determinación a un referente distinto',terms:[['calificativ','los adjetivos calificativos'],['determinativ','los adjetivos determinativos']]}
const nouns: LanguageFeature = {id:'nouns',match:'sustantiv',name:'los sustantivos',function:'nombrar e identificar personas, lugares, objetos o ideas',error:'se confunde el referente nombrado o la clase de sustantivo',terms:[['propios','los sustantivos propios'],['comunes','los sustantivos comunes'],['abstractos','los sustantivos abstractos']]}
const indicative: LanguageFeature = {id:'indicative',match:'indicativo|tiempos? verbales|verbos? en (?:presente|pasado)|preterito',name:'los tiempos del modo indicativo',function:'situar los hechos y distinguir acciones terminadas de situaciones en desarrollo',error:'se sitúa un hecho en un tiempo distinto del que expresa la forma verbal',terms:[['presente','el presente del indicativo'],['pasado','el pasado del indicativo'],['indefinido','el pretérito indefinido del indicativo'],['imperfecto','el pretérito imperfecto del indicativo']]}
const literary: LanguageFeature = {id:'literary',match:'figuras? literarias?|recursos (?:literarios|expresivos|poeticos)|metafora|pleonasmo|elipsis|exageracion|hiperbole|epiteto|anafora|personificacion|simil',name:'los recursos literarios presentes',function:'construir imágenes o destacar ideas y emociones mediante las palabras',error:'se interpreta como literal una expresión figurada o se atribuye al recurso un efecto contrario al pasaje',terms:[['metafora','la metáfora'],['pleonasmo','el pleonasmo'],['elipsis','la elipsis'],['exageracion|hiperbole','la exageración'],['epiteto','el epíteto'],['anafora','la anáfora'],['personificacion','la personificación'],['simil|figura de comparacion|comparacion literaria|figuras literarias.*comparacion','la comparación literaria']]}

/** Source: MINERD secundaria 2023, PDF 69–74. These are Aula Base adaptations. */
export const firstGradeLanguageFeatures: Record<string, LanguageFeature[]> = {
  noticia: [indicative,
    {id:'newsworthiness',match:'noticiabilidad|hecho sea noticia|hecho noticioso|actualidad|relevancia',name:'los rasgos que hacen noticioso un hecho',function:'justificar su actualidad o relevancia para el público a partir de datos disponibles',error:'se confunde una preferencia personal con un dato que muestra relevancia pública'},
    {id:'connectors',match:'conectores|orden y temporal',name:'los conectores de orden y temporales',function:'enlazar la secuencia de los hechos de la noticia',error:'se invierte el orden temporal o se enlazan hechos que no guardan esa relación'},
    {id:'synonyms',match:'sinonim',name:'los sinónimos',function:'retomar una misma idea sin repeticiones ni cambios de referente',error:'se sustituye una palabra por otra de significado incompatible en ese contexto'},
    {id:'abbreviations',match:'siglas|abreviaturas|acronimos',name:'las formas abreviadas',function:'referirse sin ambigüedad a nombres o expresiones del hecho informado',error:'se asigna a la abreviación un significado ajeno al hecho',terms:[['siglas','las siglas'],['abreviaturas','las abreviaturas'],['acronimos','los acrónimos']]},
    {id:'punctuation',match:'puntuacion',name:'los signos de puntuación',function:'delimitar enunciados y distinguir relaciones entre los datos informados',error:'la delimitación une datos incompatibles o separa información que debe leerse junta'},
    {id:'paratext',match:'paratext',name:'los paratextos',function:'anticipar y orientar la lectura del hecho informado',error:'se atribuye a un paratexto información que no aparece en él'},
  ],
  'guía turística':[nouns,adjectives,indicative,
    {id:'noun-group',match:'(?:grupo|sintagma) nominal|modificador|nucleo',name:'el núcleo y los modificadores del grupo nominal',function:'precisar qué lugar u objeto se describe y cuáles son sus características',error:'se atribuye un modificador a un núcleo distinto del que acompaña'},
    {id:'signs',match:'interrogaci|exclamaci|interrogativa|exclamativa',name:'los signos y oraciones de interrogación y exclamación',function:'distinguir preguntas y expresiones enfáticas dirigidas al visitante',error:'se interpreta una pregunta como afirmación o se pierde el énfasis indicado'},
    {id:'persuasion',match:'(?:vocabulario|lexico).*?(?:persuasiv|atractiv)',name:'el vocabulario persuasivo',function:'invitar al visitante mediante cualidades vinculadas con el lugar descrito',error:'la invitación atribuye al lugar una cualidad contraria a la información disponible'},
    {id:'appearance',match:'apariencia|estimulos|atractivos y contenido',name:'la apariencia y los estímulos de la guía',function:'orientar la atención del visitante hacia información pertinente del lugar',error:'se toma un adorno sin información como prueba de una característica del lugar'},
  ],
  'informe de lectura':[adjectives,indicative,
    {id:'exemplification',match:'ejemplificacion|conectores.*ejempl',name:'los conectores de ejemplificación',function:'relacionar una afirmación del informe con un ejemplo del texto leído',error:'se presenta como ejemplo un dato que no sostiene la afirmación'},
    {id:'summary',match:'estrategias.*resumen|pasos.*resumen|resumir|parafras',name:'las estrategias de resumen y paráfrasis',function:'conservar las ideas principales sin copiar ni agregar información ajena al texto',error:'se cambia una idea principal o se incorpora información que el texto no ofrece'},
  ],
  afiche:[literary,
    {id:'imperative',match:'imperativo',name:'el modo imperativo',function:'dirigir una invitación, instrucción o llamado a la acción al destinatario',error:'se interpreta una orden o invitación como un hecho ya ocurrido'},
    {id:'periphrasis',match:'perifrasis|obligacion y posibilidad',name:'las perífrasis de obligación y posibilidad',function:'distinguir acciones obligatorias de acciones posibles para el destinatario',error:'se presenta una posibilidad como obligación o una obligación como opcional'},
    {id:'connotation',match:'connotacion|connotativo',name:'la connotación',function:'asociar las palabras con ideas o emociones relacionadas con la intención del afiche',error:'se atribuye a una expresión una asociación incompatible con su contexto'},
    {id:'prevention',match:'prevencion|alerta|advertencia',name:'las expresiones de prevención o alerta',function:'relacionar un riesgo con la acción preventiva comunicada',error:'la acción indicada aumenta el riesgo o contradice la advertencia'},
  ],
  'cuento policíaco':[indicative,adjectives,literary,
    {id:'actants',match:'actantes',name:'los actantes',function:'relacionar las funciones de los personajes con la búsqueda, la ayuda y los obstáculos del conflicto',error:'se confunde la función de un personaje con su nombre o con una función contraria a sus acciones'},
    {id:'adverbs',match:'adverbios',name:'los adverbios de tiempo y espacio',function:'localizar las acciones del relato en el tiempo y el espacio',error:'se sitúa una acción en un momento o lugar distinto del señalado'},
    {id:'connectors',match:'conectores|coordinantes|consecuencia',name:'los conectores coordinantes y de consecuencia',function:'relacionar acciones y distinguir la coordinación de la consecuencia',error:'se invierte una consecuencia o se presenta como causal una coordinación'},
    {id:'dialogue',match:'dialogo|descripcion',name:'el diálogo y la descripción',function:'mostrar las acciones, voces y características de los personajes o del ambiente',error:'se atribuye una intervención o un rasgo a un personaje distinto'},
  ],
  caligrama:[nouns,adjectives,literary,
    {id:'typography',match:'tipografia|caligrafia',name:'la tipografía y la caligrafía',function:'hacer legibles las palabras e integrarlas en la figura del poema',error:'la disposición de las letras impide reconocer palabras o contradice la figura'},
    {id:'free-verse',match:'verso libre',name:'el verso libre',function:'organizar el sentido y el ritmo de los versos sin exigir rima ni una medida fija',error:'los cortes entre versos separan palabras relacionadas y alteran el sentido del poema'},
    {id:'description',match:'descripciones|descriptiv',name:'las descripciones poéticas',function:'relacionar los rasgos evocados por las palabras con la imagen visual del poema',error:'se atribuyen a la imagen rasgos que contradicen lo expresado por las palabras'},
  ],
}

const focus: Record<string,Record<string,RegExp>>={
  noticia:{purpose:/funcion|proposito|intencion/,structure:/estructura|partes|titular|entrada|cuerpo/,questions:/interrogantes|preguntas|datos/,interpretation:/interpretacion|inferencia/,comparison:/hechos|datos|enfoques|informacion/,conclusion:/conclusion/},
  'guía turística':{purpose:/funcion|proposito|destinatario|orienta/,structure:/estructura|portada|cierre|partes/,resources:/informacion grafica|mapas?|imagenes?|fotografias?|dibujos?|graficos?/,interpretation:/interpretacion|inferencia|orienta/,comparison:/lugares|informacion|contenido/,conclusion:/conclusion/},
  'informe de lectura':{purpose:/funcion|proposito/,structure:/estructura|introduccion|desarrollo|conclusion|titulo/,summary:/resumen|ideas principales/,analysis:/interpretacion|analisis|personajes|valores/,conclusion:/conclusion/},
  afiche:{purpose:/funcion|proposito|intencion|situacion comunicativa/,message:/mensaje|idea principal/,persuasion:/argument|persua|convencer/,visuals:/estructura|imagen|visual|tipografia/,audience:/publico|destinatario/,effectiveness:/eficacia|efectividad|convencer/},
  'cuento policíaco':{structure:/funcion|estructura|inicio|nudo|trama/,narrator:/narrador/,characters:/personajes/,setting:/ambiente/,clues:/pistas|desenlace|resolucion/,resources:/recursos|literarios|linguisticos/,comparison:/conflicto|hechos/,conclusion:/conclusion/},
  caligrama:{relation:/funcion|estructura|relacion|texto.*figura|imagen visual/,intention:/intencion|sentimientos|emociones/,resources:/recursos|figuras literarias|vocabulario/,visual:/organizacion|tipografia|disposicion|legibilidad/,message:/tema|mensaje/,figure:/figura|imagen|relacion/,conclusion:/conclusion/},
}

const comparisonFocus: Record<string,LanguageFeature[]>={
  noticia:[
    {id:'structure',match:'estructura|titular|entrada|cuerpo',name:'la estructura de las noticias',function:'distinguir el titular, la entrada y el desarrollo de los datos',error:'se atribuye al titular información que corresponde al cuerpo'},
    {id:'questions',match:'interrogantes|datos|preguntas',name:'los datos de las noticias',function:'responder qué ocurrió, a quién, dónde y cuándo a partir de la información disponible',error:'se intercambian los datos de las noticias comparadas'},
  ],
  'guía turística':[
    {id:'structure',match:'estructura|partes|portada|cierre',name:'la estructura de las guías',function:'orientar al visitante entre las partes y la información que ofrecen',error:'se compara una portada con un cierre como si cumplieran la misma función'},
    {id:'resources',match:'mapas?|fotografias?|imagenes?|graficos?|dibujos?',name:'los recursos gráficos de las guías',function:'relacionar la representación visual con los lugares descritos',error:'se atribuye a una guía un recurso o lugar de la otra'},
  ],
  'informe de lectura':[
    {id:'structure',match:'estructura|introduccion|desarrollo|conclusion',name:'la estructura de los informes',function:'relacionar la presentación del texto leído, el análisis y el cierre',error:'se confunden las secciones o se comparan partes con funciones diferentes'},
    {id:'summary',match:'resumen|ideas principales',name:'los resúmenes de los informes',function:'conservar las ideas principales del texto leído y sus relaciones',error:'se considera equivalente un resumen que altera una idea principal'},
  ],
  afiche:[
    {id:'purpose',match:'intencion|proposito|destinatarios?|publico',name:'la intención y el destinatario de los afiches',function:'relacionar el mensaje con el público al que se dirige',error:'se atribuye a un afiche la intención o el público del otro'},
    {id:'persuasion',match:'argumentos|persuasion',name:'los argumentos de los afiches',function:'vincular las razones del mensaje con la acción que se propone al destinatario',error:'se presenta como argumento una frase que contradice la acción propuesta'},
  ],
  'cuento policíaco':[
    {id:'narrator',match:'narrador',name:'los narradores de los cuentos',function:'distinguir quién cuenta los hechos y qué información puede conocer',error:'se confunde al narrador con el autor o se le atribuye información que no posee'},
    {id:'characters',match:'personajes',name:'los personajes de los cuentos',function:'relacionar acciones y motivaciones con el conflicto del relato',error:'se atribuye a un personaje la acción o motivación de otro'},
    {id:'setting',match:'ambiente',name:'los ambientes de los cuentos',function:'relacionar tiempo y espacio con las acciones del relato',error:'se atribuye a un ambiente una influencia contraria a los hechos narrados'},
  ],
  caligrama:[
    {id:'figure',match:'figura|imagen|organizacion visual|relacion',name:'la relación entre palabras y figura',function:'construir una imagen vinculada con el sentido del poema',error:'el contraste atribuye a un poema palabras o rasgos visuales del otro'},
    {id:'message',match:'mensaje|tema',name:'los temas y mensajes de los caligramas',function:'comunicar una idea mediante palabras y disposición visual',error:'se atribuye al poema un mensaje contrario a sus palabras y figura'},
  ],
}

function complete(genre:string,activity:string,description:string,base:ContextualTopicCriterion[]) {
  const scope=({noticia:'news','guía turística':'guide','informe de lectura':'report',afiche:'poster','cuento policíaco':'detective',caligrama:'calligram'} as Record<string,string>)[genre]
  const task=normalizedTask(description)
  const compare=activity.includes('COMPARISON')
  const analyze=activity.includes('ANALYSIS') || ['ANALYSIS','OBSERVATION','REPORT'].includes(activity) && genre!=='informe de lectura'
  const recitation=activity.includes('RECITATION')
  const production=/WRITING|CREATION|WRITTEN_PRODUCTION/.test(activity) || activity==='REPORT' && genre==='informe de lectura'
  const oral=['NEWSCAST','DETECTIVE_STORY_NARRATION','TOURIST_GUIDE_PRESENTATION','READING_REPORT_PRESENTATION','ORAL_PRESENTATION','EXPOSITION'].includes(activity)
  const oralProduction=oral && (['NEWSCAST','DETECTIVE_STORY_NARRATION'].includes(activity)||/emple|utiliz|us(?:ar|aran|ando)/.test(task))
  let features=requestedLanguageFeatures([...firstGradeLanguageFeatures[genre].map(feature=>({...feature,terms:firstGradeLanguageFeatureTerms[genre]?.[feature.id]??feature.terms})),...firstGradeLanguageProcedureFeatures[genre],...firstGradeLanguageCompletionFeatures[genre]??[]],description)
  if(features.some(f=>f.id==='adjective-degree'))features=features.filter(f=>f.id!=='adjectives')
  if(features.some(f=>f.id==='punctuation'))features=features.filter(f=>f.id!=='signs')
  features=features.map(feature=>specializePunctuation(feature,description))
  let rows=base
  if(compare) {
    const focused=requestedLanguageFeatures(comparisonFocus[genre],description)
    const only=/\b(?:solo|unicamente|exclusivamente)\b/.test(task)
    const direct=/\bcompar\w*\s+(?:los|las|el|la)\s+(?:narradores|personajes|ambientes|resumenes|argumentos|estructuras)\b/.test(task)
    if(focused.length && (only||direct)) rows=focused.map(feature=>languageFeatureCriterion(feature,scope,genre,'comparison'))
  }
  if((analyze||compare) && /\b(?:solo|unicamente|exclusivamente)\b/.test(task)) {
    const targets=Object.entries(focus[genre]).filter(([,pattern])=>pattern.test(task)).map(([id])=>id)
    if(targets.length) rows=rows.filter(row=>targets.includes(row.templateId.replace(`${scope}-`,'')) || /-evidence$|-feature-/.test(row.templateId))
  }
  if(genre==='guía turística' && production && !/mapas?|fotografias?|imagenes?|dibujos?|grafic[oa]s?|recursos visuales/.test(task)) {
    rows=rows.filter(row=>row.templateId!=='guide-visual').map(row=>{
      const observable=row.observable.replace(/, e integra el recurso visual solicitado.*$/,'')
      return {...row,observable,progressionLevels:[observable,...row.progressionLevels.slice(1)] as ContextualTopicCriterion['progressionLevels']}
    })
  }
  if(features.length && (analyze||compare)) {
    const broad=/estructura|proposito|intencion|titular|entrada|cuerpo|interrogantes|ideas principales|resumen|personajes|narrador|ambiente|pistas|trama|sentido global|mensaje|relacion entre.*(?:figura|palabras)/.test(task)
    if(!broad) rows=[]
    else rows=rows.filter(row=>!/-resources$|-language$|-revision$/.test(row.templateId))
  }
  if(features.length && (production||oralProduction)) rows=rows.filter(row=>!/-resources$|-language$/.test(row.templateId))
  if(features.length && production && /solo|unicamente|exclusivamente/.test(task) && /revis|correg/.test(task))rows=[]
  rows=[...rows,...features.map(feature=>languageFeatureCriterion(feature,scope,genre,compare?'comparison':production?'production':oralProduction?'oral-production':recitation?'recitation':'analysis'))]
  if(production) {
    const focusedCorrection=features.length && /solo|unicamente|exclusivamente/.test(task) && /revis|correg/.test(task) && !/borrador|versiones|cambios|public/.test(task)
    const process=focusedCorrection?[]:explicitWritingProcess(description,scope,genre)
    if(process.length) rows=rows.filter(row=>!/-revision$/.test(row.templateId))
    rows.push(...process)
    if(genre==='guía turística') rows=rows.map(row=>row.templateId==='guide-revision'?{
      ...row,title:'Claridad y convenciones de la guía',observable:'Presenta la guía con escritura legible, puntuación y ortografía que permiten comprender la información de los lugares.',
      progressionLevels:[
        'La escritura, la puntuación y la ortografía permiten comprender los datos y las indicaciones de la guía.',
        'La guía se comprende; un error aislado dificulta una indicación secundaria.',
        'Varios errores de escritura o puntuación vuelven ambiguos datos o indicaciones de los lugares.',
        'Los errores cambian la información de un lugar o el sentido de una indicación.',
        'La versión presentada no permite leer información comprensible de los lugares.',
      ],
    }:row)
  }
  if(activity==='REPORT' && ['afiche','cuento policíaco','caligrama'].includes(genre)) rows.push({
    templateId:`${scope}-report-organization`,title:'Organización del informe de análisis',weight:3,
    observable:`Organiza el informe sobre ${genre} relacionando las ideas del análisis con sus ejemplos, sin sustituir el texto estudiado por una creación propia.`,
    progressionLevels:[
      'Las ideas del informe forman un análisis comprensible y cada ejemplo se vincula con la idea que apoya.',
      'El análisis puede seguirse; un ejemplo queda separado de la idea que apoya.',
      'El informe enumera ideas y ejemplos, pero no establece relaciones entre ellos.',
      'El orden del informe atribuye a una idea ejemplos que la contradicen.',
      'No presenta un informe reconocible sobre el texto estudiado.',
    ],
  })
  if(activity==='RESEARCH') {
    rows=[{
      templateId:`${scope}-research-information`,title:'Información pertinente de la investigación',weight:5,
      observable:`Selecciona datos sobre ${genre==='noticia'?'el hecho noticioso':'los lugares de la guía turística'} que responden al propósito de la investigación y distingue los datos de las opiniones.`,
      progressionLevels:[
        'Los datos seleccionados responden al propósito de la investigación y están diferenciados de las opiniones.',
        'Los datos responden al propósito; una afirmación queda sin distinguir como dato u opinión.',
        'Recopila información sobre el tema, pero incluye datos ajenos al propósito de la investigación.',
        'Presenta opiniones como hechos o atribuye al tema datos de otro hecho o lugar.',
        'No aporta datos pertinentes sobre el hecho o los lugares investigados.',
      ],
    },{
      templateId:`${scope}-research-sources`,title:'Origen y comprobación de la información',weight:4,
      observable:'Relaciona los datos recopilados con las fuentes consultadas y señala la información que no pudo comprobar.',
      progressionLevels:[
        'Cada dato puede relacionarse con su fuente y se distingue la información comprobada de la pendiente de comprobación.',
        'Se reconocen las fuentes y los datos principales; una referencia queda incompleta.',
        'Enumera fuentes, pero varios datos no pueden relacionarse con la fuente de origen.',
        'Las fuentes citadas no contienen los datos que se les atribuyen.',
        'No identifica el origen de la información recopilada.',
      ],
    },...features.map(feature=>languageFeatureCriterion(feature,scope,genre,'analysis'))]
  }
  if(activity==='REPORT' && /conclusion/.test(task) && !rows.some(row=>/conclusion/.test(row.templateId))) rows.push({
    templateId:`${scope}-report-conclusion`,title:'Conclusión del informe',weight:3,
    observable:`Formula una conclusión sobre ${genre} que se desprende de las relaciones explicadas y los ejemplos del análisis.`,
    progressionLevels:[
      'La conclusión relaciona los hallazgos del análisis y se sostiene en sus ejemplos.',
      'La conclusión retoma los hallazgos; una relación con los ejemplos queda implícita.',
      'La conclusión repite un dato del texto sin relacionarlo con los hallazgos del análisis.',
      'La conclusión contradice los ejemplos o incorpora afirmaciones sin apoyo en el análisis.',
      'No presenta la conclusión solicitada del informe.',
    ],
  })
  if(genre==='guía turística' && oral && /mapas?|fotografias?|imagenes?|dibujos?|grafic[oa]s?/.test(task)) rows.push(...guide('TOURIST_GUIDE_CREATION',description).filter(row=>row.templateId==='guide-visual'))
  if(genre==='guía turística' && /mapas/.test(task) && /fotografias/.test(task)) {
    const resources=/mapas\s+o\s+fotografias|fotografias\s+o\s+mapas/.test(task)?'mapas o fotografías':'mapas y fotografías'
    rows=rows.map(row=>row.templateId==='guide-visual'?{...row,observable:`Incorpora ${resources} que permiten localizar o reconocer los lugares descritos en la guía.`,progressionLevels:[`Los ${resources} corresponden a los lugares y permiten localizarlos o reconocerlos.`,`Los recursos corresponden a los lugares; una referencia visual queda sin identificar.`,`Se incluyen recursos, pero no se establece su relación con los lugares descritos.`,`Los recursos representan lugares distintos de los descritos.`,`No se aportan los recursos visuales solicitados.`]}:row)
  }
  if(genre==='afiche' && production && /fecha|lugar|horario|hora|destinatarios|publico/.test(task) && /evento|actividad|convocatoria/.test(task)) {
    const data=[/fecha/.test(task)?'fecha':'',/lugar/.test(task)?'lugar':'',/horario|hora/.test(task)?'horario':'',/destinatarios|publico/.test(task)?'destinatarios':''].filter(Boolean).join(', ')
    rows.push({templateId:'len-1-poster-event',title:'Información de la convocatoria',weight:3,observable:`Comunica ${data} del evento sin contradicciones con la convocatoria.`,progressionLevels:[`Incluye ${data} y permite reconocer a quién se convoca y cómo participar.`,`Incluye los datos solicitados; una referencia requiere aclaración.`,`Omite un dato solicitado y dificulta decidir cómo participar.`,`Los datos del afiche contradicen la convocatoria del evento.`,`No comunica los datos solicitados para la convocatoria.`]})
  }
  if(analyze) {
    const reading=languageReadingProcedures(description,scope,genre)
    if(reading.length) {
      if(!/analiz\w*.*(?:estructura|narrador|personajes|recursos)|identific\w*.*(?:estructura|narrador|personajes|recursos)/.test(task)) rows=rows.filter(row=>row.templateId.includes('-feature-'))
      rows.push(...reading)
    }
  }
  if(production) {
    const writing=languageWritingProcedures(description,scope,genre)
    if(/\bplanific\w*\b/.test(task)&&!/\b(?:redact\w*|escrib\w*|elabor\w*|crearan)\b/.test(task)) rows=rows.filter(row=>row.templateId.includes('-feature-'))
    rows.push(...writing)
  }
  if(genre==='guía turística') {
    const classification=languagePlaceClassification(description)
    if(classification.length && analyze && !/analiz\w*.*(?:estructura|recursos|proposito)/.test(task)) rows=rows.filter(row=>/-feature-|-procedure-/.test(row.templateId))
    rows.push(...classification)
  }
  return rows
}

export const completeFirstGradeNewsCriteria=(activity:string,description:string)=>complete('noticia',activity,description,news(activity==='RESEARCH'?'NEWS_ANALYSIS':activity,description))
export const completeFirstGradeGuideCriteria=(activity:string,description:string)=>complete('guía turística',activity,description,guide(activity==='RESEARCH'?'TOURIST_GUIDE_ANALYSIS':activity,description))
export const completeFirstGradeReadingReportCriteria=(activity:string,description:string)=>complete('informe de lectura',activity,description,report(activity,description))
export const completeFirstGradePosterCriteria=(activity:string,title:string,description:string)=>complete('afiche',activity,description,poster(activity==='REPORT'?'POSTER_ANALYSIS':activity,title,description))
export const completeFirstGradeDetectiveCriteria=(activity:string,description:string)=>complete('cuento policíaco',activity,description,detective(activity==='REPORT'?'DETECTIVE_STORY_ANALYSIS':activity,description))
export const completeFirstGradeCalligramCriteria=(activity:string,description:string)=>complete('caligrama',activity,description,calligram(activity==='REPORT'?'CALLIGRAM_ANALYSIS':activity,description))
