import { rawFirstGradeNewsCriteria } from './secondary-topics/language/news-grade-1-core'
import { secondGradeNewsCriteria } from './secondary-news-grade-two'
import { normalizedTask } from './secondary-language-topics'
import {affirmativeLanguageTask} from './language-feature-criteria'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'

type LowerEvidence = [string, string, string, string]
export function isFirstGradeNewsActivity(activity: string) {
  return ['NEWS_WRITING', 'NEWS_ANALYSIS', 'NEWS_COMPARISON', 'NEWSCAST', 'REPORT', 'DEBATE', 'EXPOSITION', 'ORAL_PRESENTATION', 'ANALYSIS', 'OBSERVATION', 'COMPARISON', 'WRITTEN_PRODUCTION'].includes(activity)
}
const evidence: Record<string, LowerEvidence[]> = {
  NEWS_WRITING: [
    ['El hecho y sus datos principales se comprenden; falta precisar un dato secundario.', 'Se reconoce el hecho, pero faltan datos de quién, dónde, cuándo o cómo.', 'Los datos se contradicen y alteran el hecho que se pretende informar.', 'No presenta un hecho noticioso reconocible.'],
    ['Titular, entrada y cuerpo son reconocibles; una parte repite información.', 'Presenta titular y datos, pero la entrada o el desarrollo quedan incompletos.', 'Confunde la función del titular con la entrada o el cuerpo.', 'No organiza el escrito como una noticia.'],
    ['El orden permite seguir el hecho; un enlace temporal necesita precisión.', 'Relaciona algunos datos, pero los saltos de orden dificultan seguir el hecho.', 'Los conectores sitúan los hechos en un orden contradictorio.', 'No se reconoce una secuencia entre los datos de la noticia.'],
    ['El vocabulario y los verbos comunican el hecho con una imprecisión menor.', 'El vocabulario o los tiempos verbales vuelven ambigua parte de la información.', 'El registro o los verbos cambian el sentido de los hechos.', 'El lenguaje no permite comprender el hecho informado.'],
    ['La revisión corrige la mayoría de los errores que afectan la lectura.', 'Corrige algunos errores, pero conserva problemas de puntuación u ortografía que dificultan pasajes.', 'Los errores conservados impiden relacionar datos importantes.', 'La versión presentada no permite leer una noticia comprensible.'],
  ],
  NEWS_ANALYSIS: [
    ['Reconoce la intención informativa y el hecho con una imprecisión menor.', 'Identifica el tema, pero no explica qué hecho se informa.', 'Confunde la información del hecho con una opinión ajena al texto.', 'No identifica el hecho ni el propósito informativo de la noticia.'],
    ['Distingue titular, entrada y cuerpo; una delimitación necesita precisión.', 'Identifica algunas partes, pero confunde sus límites o funciones.', 'Atribuye al titular información del cuerpo y no diferencia las partes.', 'No identifica las partes presentes de la noticia.'],
    ['Localiza la mayoría de los datos disponibles con una atribución imprecisa.', 'Localiza algunos datos, pero omite o confunde otros presentes en la noticia.', 'Asigna datos a personas, lugares o momentos distintos de los informados.', 'No localiza datos que respondan las preguntas de la noticia.'],
    ['Explica la información principal; una inferencia necesita apoyo más preciso.', 'Explica datos aislados sin relacionarlos con el sentido principal.', 'La inferencia contradice la información de la noticia.', 'No presenta una interpretación reconocible de la información.'],
    ['Los datos citados apoyan las respuestas; una relación queda implícita.', 'Señala un dato o fragmento, pero no explica qué respuesta apoya.', 'Usa un fragmento que contradice su respuesta o inventa datos.', 'No aporta datos ni fragmentos de la noticia para sustentar sus respuestas.'],
  ],
  NEWS_COMPARISON: [
    ['Identifica los hechos y propósitos de ambas noticias; uno queda poco preciso.', 'Identifica el hecho o propósito de una noticia y deja el otro incompleto.', 'Confunde los hechos o atribuye a una noticia el propósito de la otra.', 'No identifica los hechos de las noticias comparadas.'],
    ['Relaciona semejanzas y diferencias; una relación necesita precisión.', 'Enumera datos de las noticias sin desarrollar su semejanza o diferencia.', 'Afirma semejanzas o diferencias que contradicen los datos de ambas noticias.', 'No establece una comparación entre las noticias.'],
    ['Contrasta titular, entrada y cuerpo; una función queda poco desarrollada.', 'Reconoce partes de ambos textos, pero no explica cómo se organizan de manera semejante o distinta.', 'Confunde las partes o sus funciones al contrastar los textos.', 'No aporta un contraste de las estructuras de las noticias.'],
    ['Usa datos de ambas noticias; una relación con el contraste necesita precisión.', 'Apoya el contraste con datos de una sola noticia o sin explicar su relación.', 'Los datos citados contradicen el contraste formulado.', 'No aporta datos de las noticias para sustentar la comparación.'],
    ['La conclusión retoma el contraste; una relación necesita desarrollo.', 'La conclusión menciona una diferencia sin relacionarla con lo comparado.', 'La conclusión contradice las semejanzas o diferencias expuestas.', 'No presenta una conclusión de la comparación.'],
  ],
  NEWSCAST: [
    ['Comunica el hecho y sus datos principales con una imprecisión menor.', 'Presenta datos aislados y omite información necesaria para comprender el hecho.', 'La información presentada contradice el hecho de la noticia.', 'No comunica un hecho noticioso reconocible.'],
    ['Comunica titular y la mayoría de los datos disponibles; uno necesita precisión.', 'Comunica el titular y algunos datos, dejando preguntas importantes sin responder.', 'Confunde quién, dónde o cuándo ocurrió el hecho.', 'No comunica datos que permitan reconocer qué ocurrió.'],
    ['La secuencia enlaza las intervenciones; una transición necesita precisión.', 'Se reconocen algunas noticias, pero las intervenciones quedan desconectadas.', 'El orden de las intervenciones confunde las noticias presentadas.', 'No hay una secuencia que permita seguir el noticiero.'],
    ['La comunicación o los apoyos acordados permiten comprender los datos, con una pausa imprecisa.', 'Se comprenden algunos datos, pero el ritmo o las pausas dificultan otros.', 'La expresión altera la relación entre datos importantes.', 'No comunica información comprensible mediante la presentación o los apoyos acordados.'],
    ['Explica su noticia y se reconoce su aportación; un dato necesita precisión.', 'Repite datos de su noticia sin explicar su relación con el hecho.', 'Su explicación confunde el hecho o los datos de la noticia asignada.', 'No se identifica una aportación sobre su noticia en la presentación.'],
  ],
  DEBATE: [
    ['Explica el hecho; una distinción entre dato y opinión necesita precisión.', 'Menciona el tema sin precisar el hecho o distingue solo algunos datos de las opiniones.', 'Presenta opiniones como hechos de la noticia.', 'No identifica el hecho sobre el que se debate.'],
    ['Los datos apoyan su postura; una relación necesita desarrollo.', 'Expresa una postura y cita datos sin explicar cómo la apoyan.', 'Defiende su postura con datos ajenos o contrarios a la noticia.', 'No aporta datos de la noticia para defender una postura.'],
    ['Responde al argumento contrario; una relación con el hecho necesita precisión.', 'Repite su postura sin atender una parte del argumento contrario.', 'La réplica tergiversa la postura contraria o se aparta del hecho.', 'No ofrece una respuesta a las otras posturas.'],
    ['La intervención se comprende; una transición entre razones necesita precisión.', 'Comunica razones aisladas y cuesta seguir su relación con la postura.', 'El orden o vocabulario cambia el sentido de su argumento.', 'No comunica una intervención que permita reconocer su postura.'],
    ['Respeta las reglas y turnos, con una intervención que necesita ajuste.', 'Interviene, pero algunas interrupciones dificultan el intercambio.', 'Las interrupciones reiteradas impiden seguir los argumentos de otros.', 'No hay participación observable en el intercambio acordado.'],
  ],
}

export function firstGradeNewsCriteria(activityType: string, description: string): ContextualTopicCriterion[] {
  if (activityType === 'REPORT') return secondGradeNewsCriteria('REPORT', description)
  const mode = ['EXPOSITION', 'ORAL_PRESENTATION'].includes(activityType) ? 'NEWSCAST'
    : ['ANALYSIS', 'OBSERVATION'].includes(activityType) ? 'NEWS_ANALYSIS'
      : activityType === 'COMPARISON' ? 'NEWS_COMPARISON' : evidence[activityType] ? activityType : 'NEWS_WRITING'
  const raw = rawFirstGradeNewsCriteria(mode, description)
  if (mode === 'NEWSCAST' && !/\b(?:equipos?|grupos?)\b/.test(normalizedTask(description))) {
    raw[4] = { ...raw[4], title: 'Explicación de la noticia presentada', observable: 'Explica con sus palabras la información de la noticia que presenta.' }
  }
  const criteria = raw.map((criterion, index) => ({ ...criterion,
    progressionLevels: [criterion.observable, ...evidence[mode][index]] as ContextualTopicCriterion['progressionLevels'],
  }))
  const task = affirmativeLanguageTask(description)
  if (mode === 'NEWS_ANALYSIS') {
    const focus = [
      /\b(?:proposito|funcion|intencion)\b/.test(task) ? 'news-purpose' : '',
      /\b(?:partes|estructura|titular|entrada|copete|cuerpo)\b/.test(task) ? 'news-structure' : '',
      /\b(?:datos|preguntas|interrogantes|quien|donde|cuando|como)\b/.test(task) ? 'news-questions' : '',
      /\b(?:inferencias|interpretacion|sentido)\b/.test(task) ? 'news-interpretation' : '',
    ].filter(Boolean)
    if (focus.length) return criteria.filter(criterion => focus.includes(criterion.templateId) || criterion.templateId === 'news-evidence')
  }
  return criteria
}

/** Adaptación evaluativa: evalúa la acción solicitada, sin convertir revisión en creación. */
export function refineFirstGradeNewsRequirements(activity:string,description:string,criteria:ContextualTopicCriterion[]):ContextualTopicCriterion[]{
  const task=affirmativeLanguageTask(description)
  const writing=/WRITING|WRITTEN_PRODUCTION/.test(activity)
  const editing=writing&&/\b(?:revis\w*|correg\w*|corrij\w*)\b/.test(task)
    &&/\b(?:borrador|recib\w*|entregad\w*|proporcionad\w*)\b/.test(task)
    &&!/\b(?:redact\w*|escrib\w*|cre\w*|elabor\w*)\s+(?:(?:un|una|el|la)\s+)?noticia\b/.test(task)
    ||writing&&/\b(?:arregl\w*|corrij\w*|correg\w*)\b.*\b(?:solo|unicamente)\b.*puntuacion/.test(task)
  const comparison=activity==='NEWS_COMPARISON'||activity==='COMPARISON'
  let rows=editing?criteria.filter(row=>/-feature-|-process-/.test(row.templateId)):criteria
  const newsworthiness=rows.some(row=>row.templateId==='news-feature-newsworthiness')
  if(newsworthiness&&rows.some(row=>row.templateId==='news-purpose'))rows=rows.filter(row=>row.templateId!=='news-feature-newsworthiness')
  if(rows.some(row=>row.templateId==='news-feature-paratext')&&!/inferen|interpreta|sentido global/.test(task))rows=rows.filter(row=>row.templateId!=='news-interpretation')
  if(comparison&&/titular|paratext/.test(task)&&!/estructura|entrada|cuerpo/.test(task)){
    rows=rows.filter(row=>row.templateId!=='news-structure')
  }
  if(writing&&/\b(?:pondremos|pondran|coloqu\w*|coloc\w*)\b.*\bmural\b/.test(task)&&!rows.some(row=>row.templateId==='news-process-publication'))rows=[...rows,{
    templateId:'news-process-publication',title:'Publicación en el mural solicitado',weight:2,
    observable:'Dispone la versión final de la noticia en el mural del aula, legible y accesible para su destinatario.',
    progressionLevels:['La versión final se puede leer en el mural del aula y sus partes permiten reconocer el hecho comunicado.','La noticia se consulta en el mural; un rótulo o fragmento dificulta leer un dato secundario.','La noticia está en el mural, pero faltan partes de la versión final que permiten comprender el hecho.','El contenido del mural difiere de la versión final y cambia el hecho informado.','No hay evidencia de la publicación solicitada en el mural.'],
  }]
  if(/ANALYSIS/.test(activity)&&/\bescuch\w*\b/.test(task)){
    rows=rows.filter(row=>row.templateId.includes('-feature-'))
    rows.push({templateId:/parafras|(?:sus|propias) palabras/.test(task)?'news-procedure-paraphrase':'news-listening-data',title:'Comprensión de la noticia escuchada',weight:5,
      observable:'Reconstruye con sus palabras el sentido de la noticia escuchada: qué sucedió, quiénes participaron, dónde y cuándo.',
      progressionLevels:['Reconstruye con sus palabras el hecho escuchado y relaciona participantes, lugar y momento sin añadir datos ajenos al audio.','El relato conserva el hecho del audio; una referencia secundaria queda sin precisar.','Repite datos aislados del audio, pero omite una relación necesaria entre lo ocurrido, sus participantes o su contexto.','La reconstrucción atribuye al audio un participante, lugar, momento o hecho distinto del informado.','No presenta una reconstrucción reconocible del hecho escuchado.'],
    })
    if(/interes|relevancia|noticioso/.test(task))rows.push({templateId:'news-listening-relevance',title:'Interés del hecho escuchado para el público',weight:3,
      observable:'Explica por qué el hecho de la noticia escuchada puede interesar al público, apoyándose en datos del audio.',
      progressionLevels:['Relaciona un dato del hecho escuchado con su interés o relevancia para el público indicado.','Identifica un dato relevante del audio; deja implícita su relación con el interés del público.','Expresa una preferencia personal sin relacionarla con el interés del hecho para el público.','Justifica el interés con un dato que contradice la noticia escuchada.','No explica por qué el hecho escuchado puede interesar al público.'],
    })
  }
  return rows.map(row=>{
    const withLevels=(title:string,levels:ContextualTopicCriterion['progressionLevels'])=>({...row,title,observable:levels[0],progressionLevels:levels})
    if(row.templateId==='news-purpose'&&newsworthiness)return withLevels('Propósito y relevancia del hecho noticioso',[
      'Explica el propósito informativo y justifica qué hace noticioso el hecho por su actualidad o relevancia para el público, con datos de la noticia.',
      'Reconoce el propósito y un dato relevante; deja implícita su relación con el interés del público.',
      'Reconoce de qué trata la noticia, pero justifica su relevancia solo por una preferencia personal.',
      'Atribuye actualidad o relevancia al hecho mediante datos que contradicen la noticia.',
      'No identifica el propósito informativo ni justifica la relevancia del hecho.',
    ])
    if(row.templateId==='news-sequence'&&writing)return withLevels(row.title,[
      'Ordena los datos de manera que se reconoce la secuencia y la relación entre los hechos informados.',
      'Se sigue el hecho; una transición deja momentáneamente sin precisar el orden de dos datos.',
      'Presenta datos aislados y omite relaciones necesarias para seguir la secuencia del hecho.',
      'El orden del escrito invierte una relación temporal o causal entre los hechos.',
      'No se reconoce una secuencia comprensible entre los datos de la noticia.',
    ])
    if(row.templateId==='news-language'&&writing)return withLevels(row.title,[
      'El vocabulario y las formas verbales permiten comprender los hechos y sus referentes sin ambigüedad.',
      'Los hechos se comprenden; una palabra o un tiempo verbal deja impreciso un dato secundario.',
      'Varias palabras o formas verbales dificultan reconocer quién hizo qué o cuándo ocurrió.',
      'El vocabulario o los verbos cambian el sentido de los hechos informados.',
      'El lenguaje no permite comprender el hecho que se pretende comunicar.',
    ])
    if(row.templateId==='news-revision'&&writing&&!/\b(?:borrador\w*|revis\w*|correg\w*|corrij\w*)\b/.test(task))return withLevels('Legibilidad y convenciones de la noticia',[
      'Presenta la noticia con puntuación y escritura que permiten comprender los hechos.',
      'La noticia se comprende; un signo o una palabra dificulta un dato secundario.',
      'Varios errores de puntuación o escritura vuelven ambiguos datos del hecho.',
      'La puntuación o escritura cambia quién hizo qué o cuándo ocurrió.',
      'La escritura no permite reconocer los hechos comunicados.',
    ])
    if(row.templateId==='news-essential'&&/\bfichas?\b/.test(task))return withLevels(row.title,[
      'Informa qué ocurrió, a quién, dónde, cuándo y cómo, conservando los hechos de la ficha suministrada.',
      'Conserva los hechos principales de la ficha; una referencia secundaria queda poco precisa.',
      'Recoge datos de la ficha, pero omite una relación necesaria para comprender quién hizo qué, dónde o cuándo.',
      'Añade o cambia un dato de la ficha y altera el hecho informado.',
      'No presenta información reconocible del hecho suministrado.',
    ])
    if(row.templateId==='news-structure'&&writing&&/comunidad escolar/.test(task))return withLevels(row.title,[
      'Titular, entrada y cuerpo organizan los datos con vocabulario comprensible y relevancia para la comunidad escolar.',
      'Las partes orientan a la comunidad escolar; la entrada repite un dato del cuerpo sin destacar lo principal.',
      'Incluye titular y datos, pero falta una entrada que permita al destinatario reconocer el hecho principal.',
      'El titular anuncia un hecho distinto del que desarrolla el cuerpo o el vocabulario impide comprenderlo.',
      'No presenta una organización que permita a la comunidad escolar reconocer la noticia.',
    ])
    if(row.templateId==='news-content'&&/\bfichas?\b/.test(task))return withLevels(row.title,[
      'Comunica los hechos de las fichas suministradas, distinguiendo los datos principales de los detalles sin inventar información.',
      'Conserva los hechos de las fichas; un detalle secundario queda sin precisar.',
      'Comunica datos de las fichas, pero omite una relación necesaria para comprender el hecho.',
      'Atribuye a una noticia datos de otra ficha o añade hechos que contradicen la información suministrada.',
      'No comunica hechos reconocibles de las fichas suministradas.',
    ])
    if(row.templateId==='news-sequence'&&activity==='NEWSCAST')return withLevels(row.title,[
      /temporal|cronologic/.test(task)?'Organiza los turnos y las intervenciones del noticiero, manteniendo el orden temporal de los hechos dentro de cada noticia.':'Organiza los turnos del noticiero y enlaza las intervenciones para que se reconozca cada noticia.',
      'Las intervenciones enlazan noticias reconocibles; una transición deja momentáneamente sin identificar a qué hecho se refiere.',
      'Se reconocen noticias aisladas, pero los cambios de intervención desconectan datos o momentos del hecho.',
      'El orden de las intervenciones atribuye datos a otra noticia o invierte el momento de los hechos.',
      'No hay una secuencia de intervenciones que permita reconocer las noticias presentadas.',
    ])
    if(row.templateId==='news-individual'&&activity==='NEWSCAST')return withLevels('Aportación individual al noticiero',[
      'Cada integrante comunica los datos de su noticia y se reconoce su aportación dentro del noticiero.',
      'Se reconoce la noticia de cada integrante; una intervención deja un dato secundario sin precisar.',
      'Se identifican algunas aportaciones, pero un integrante comunica datos sueltos sin un hecho reconocible.',
      'La intervención atribuye a su noticia datos de otra o contradice el hecho que le corresponde.',
      'No se identifica una aportación sobre la noticia asignada.',
    ])
    if(row.templateId==='news-process-revision'&&editing)return withLevels('Correcciones del texto recibido',[
      /solo|unicamente/.test(task)?'La versión corregida resuelve únicamente la puntuación solicitada y conserva los datos y las palabras del original.':'La versión corregida resuelve los problemas lingüísticos solicitados del borrador recibido y conserva sus hechos.',
      'Corrige los problemas principales del borrador; queda un error localizado entre los aspectos solicitados.',
      'Presenta cambios, pero conserva varios problemas de los aspectos lingüísticos solicitados.',
      'Las correcciones cambian los hechos o introducen errores donde el borrador era comprensible.',
      'No entrega una versión con correcciones reconocibles respecto al borrador recibido.',
    ])
    if(row.templateId==='news-procedure-outline'&&/para quien|destinatario/.test(task))return withLevels('Planificación del hecho y el destinatario',[
      'El plan identifica un hecho que merece contarse y su destinatario, organizando los datos que desarrollará la noticia.',
      'El plan identifica el hecho y el destinatario; un dato queda sin relacionar con la organización prevista.',
      'Enumera datos, pero no establece para quién se informa o qué relación tienen con el hecho elegido.',
      'El plan atribuye al hecho datos ajenos o propone una organización incompatible con el propósito informativo.',
      'No presenta el plan solicitado para desarrollar la noticia.',
    ])
    if(row.templateId==='news-feature-indicative'&&writing)return withLevels(row.title,[
      'Mantiene el modo y los tiempos verbales adecuados al momento y al sentido de los hechos narrados.',
      'Los tiempos sitúan los hechos; un cambio de forma verbal deja ambiguo cuándo ocurre una acción.',
      'Alterna tiempos sin una referencia que permita relacionar varias acciones del hecho.',
      'Una forma verbal presenta como ocurrido un hecho pendiente o cambia el momento informado.',
      'Las formas verbales no permiten reconocer cuándo ocurren los hechos de la noticia.',
    ])
    if(row.templateId==='news-feature-connectors'&&writing)return withLevels(row.title,[
      'Los conectores de orden y temporales permiten seguir la secuencia de los hechos informados.',
      'Se sigue la secuencia; un conector deja ambigua la relación temporal entre dos datos.',
      'Enlaza datos aislados, pero varios hechos quedan sin relación de orden o tiempo.',
      'Un conector invierte el orden de los hechos o presenta como simultáneas acciones sucesivas.',
      'No se reconoce una secuencia de los hechos mediante los conectores solicitados.',
    ])
    if(row.templateId==='news-feature-abbreviations'&&editing){
      const terms=row.title.toLocaleLowerCase('es')
      const explain=/expli\w*.*cambios|expli\w*.*formas abreviadas/.test(task)
      return withLevels(row.title,[
        `Corrige ${terms} presentes en el borrador para conservar sus referentes${explain?' y explica los cambios realizados en cada tipo solicitado':''}.`,
        `Las formas abreviadas mantienen sus referentes; ${explain?'la explicación de un cambio queda sin relacionar con su forma original':'una forma conserva un error localizado de escritura'}.`,
        `Corrige algunas formas, pero deja otro tipo solicitado sin revisar${explain?' o sin explicar su cambio':''}.`,
        'La corrección asigna a una forma abreviada un significado que cambia el referente o el hecho informado.',
        'No presenta correcciones reconocibles de las formas abreviadas solicitadas.',
      ])
    }
    if(row.templateId==='news-feature-synonyms'&&editing)return withLevels(row.title,[
      'Sustituye las repeticiones por sinónimos compatibles con el contexto, conservando los referentes y los hechos.',
      'Las sustituciones conservan el significado; una repetición evitable permanece en el texto.',
      'Sustituye algunas repeticiones, pero otras palabras elegidas dejan ambiguo el referente.',
      'Un sinónimo cambia quién participa, qué ocurre o el sentido de un dato de la noticia.',
      'No presenta sustituciones pertinentes de las repeticiones señaladas.',
    ])
    if(row.templateId==='news-feature-punctuation'&&editing)return withLevels(row.title,[
      /palabras.*original/.test(task)?'Presenta la puntuación corregida debajo del original, delimitando enunciados y conservando los datos y las palabras originales.':'Corrige los signos de puntuación para delimitar enunciados y relaciones entre datos sin cambiar los hechos.',
      'Los enunciados se comprenden; queda un signo que dificulta una relación secundaria.',
      'Corrige signos aislados, pero mantiene uniones o cortes que vuelven ambiguos varios datos.',
      'La puntuación corregida relaciona personas o acciones de manera contraria al hecho informado.',
      'No presenta correcciones de puntuación que permitan comprender los datos del borrador.',
    ])
    if(row.templateId==='news-feature-paratext'){
      const named=[/titular/.test(task)?'el titular':'',/fotografia/.test(task)?'la fotografía':'',/pie (?:de foto|al sentido)|fotografia y su pie/.test(task)?'su pie de foto':''].filter(Boolean)
      const target=/paratext/.test(task)||!named.length?'los titulares y demás paratextos presentes':named.length===1?named[0]:named.slice(0,-1).join(', ')+' y '+named.at(-1)
      return withLevels(row.title,comparison?[
        `Contrasta si ${target} se corresponden con los hechos narrados, apoyándose en datos de ambas noticias.`,
        'Relaciona los paratextos con los hechos de ambas noticias; deja sin explicar una correspondencia del contraste.',
        'Describe los paratextos de las noticias, pero no comprueba su correspondencia con los hechos.',
        'Afirma que un titular o paratexto corresponde a un hecho que el texto contradice.',
        'No relaciona los paratextos de las noticias con los hechos narrados.',
      ]:[
        `Explica qué aportan ${target} al sentido del texto y cómo se relacionan con los hechos informados.`,
        'Relaciona los elementos presentes con el hecho; deja sin explicar el aporte de uno de ellos.',
        'Describe lo que muestran los paratextos sin relacionarlo con el sentido de la noticia.',
        'Atribuye a la fotografía, al pie u otro paratexto información contraria al hecho del texto.',
        'No explica una relación entre los paratextos presentes y la información de la noticia.',
      ])
    }
    return row
  })
}

export const firstGradeNewsModule = {
  id: 'lengua-secundaria-1-la-noticia', grade: 1, subjectCode: 'LEN',
  source: { topicElementId: '55a6ecd4-e9db-5e12-9e15-50f0f179f1b4', pdfPages: [69, 70], printedPages: [68, 69],
    procedureElementIds: ['d60a8e8d-d000-5b43-897d-e0eb48136a1c', '1e8cd77f-d712-535e-b108-203a914fb39c', 'd112b7bd-aa6c-5d0a-9980-83e7c8ef5334', 'bfbe299c-6c2d-599b-88d3-d70b46524187', '52fef8d7-627e-5de8-85ea-95a5ddc97c3d', '71c8091f-c16b-5568-a567-fefeeb6ab5a6'] },
  adaptation: 'Evidencias evaluativas de Aula Base; no texto ni instrumentos oficiales del MINERD.',
  criteriaByActivity: Object.fromEntries(['NEWS_WRITING', 'NEWS_ANALYSIS', 'NEWS_COMPARISON', 'NEWSCAST', 'REPORT', 'DEBATE'].map(activity => [activity, firstGradeNewsCriteria(activity, activity === 'NEWSCAST' ? 'en equipos' : '')])),
}
