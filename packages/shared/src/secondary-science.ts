import { normalizedTask } from './secondary-language-topics'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'

export type InstrumentAcademicContext = { level: 'PRIMARY' | 'SECONDARY'; grade: number; subjectCode: string; subjectName?: string }
export type ScienceTopic = 'cells' | 'ohm'

/** The object and requested purpose take precedence over the medium (drawing, model). */
export function scientificTaskType(title: string, description: string): string | null {
  const text = normalizedTask(description || title)
  if (/\b(?:resolv\w*|calcul\w*)\b/.test(text) && /\b(?:ejercicios?|voltaje|corriente|resistencia|ohm)\b/.test(text)) return 'EXERCISE_SET'
  if (/\b(?:elabor\w*|constru\w*|represent\w*|dibuj\w*|cre\w*)\b/.test(text)
    && /\b(?:maquetas?|modelos?|dibujos?)\b/.test(text)
    && /\b(?:celulas?|celulares|atomos?|moleculas?|sistema solar|circuitos?|organelos?|organulos?)\b/.test(text)
    && !/\b(?:obra artistica|expresion artistica|composicion artistica)\b/.test(text)) return 'PROJECT'
  return null
}

export function findSecondaryScienceTopic(title: string, description: string, context?: InstrumentAcademicContext | null): ScienceTopic | null {
  if (context?.level !== 'SECONDARY') return null
  const code = context.subjectCode.trim().toUpperCase()
  const name = normalizedTask(context.subjectName ?? '')
  const science = code === 'NAT' || (context.grade === 2 ? code === 'NAT-VIDA' : context.grade === 6 ? code === 'NAT-FIS' : false)
    || (!code && /^(?:ciencias de la naturaleza(?: fisica| ciencias de la vida)?|fisica|ciencias de la vida)$/.test(name))
  if (!science) return null
  const text = normalizedTask(`${title} ${description}`)
  if (context.grade === 2 && /\b(?:celulas?|celulares)\b/.test(text)) return 'cells'
  if (context.grade === 6 && (/\bohm\b/.test(text) || /\bvoltaje\b/.test(text) && /\bcorriente\b/.test(text) && /\bresistencia\b/.test(text))) return 'ohm'
  return null
}

const criterion = (topic: ScienceTopic, id: string, title: string, observable: string, evidence: [string,string,string,string,string]): ContextualTopicCriterion =>
  ({ templateId: `science-${topic}-${id}`, title, observable, weight: 4, progressionLevels: evidence })

/** Authored evidence, not a literal MINERD rubric. Select only requested actions. */
export function secondaryScienceCriteria(topic: ScienceTopic, description: string, format = 'rubrica'): ContextualTopicCriterion[] {
  const task = normalizedTask(description)
  const result: ContextualTopicCriterion[] = []
  if (topic === 'cells') {
    const both = /\banimal\b/.test(task) && /\bvegetal\b/.test(task)
    const target = both ? 'la célula animal y la vegetal' : /vegetal/.test(task) ? 'la célula vegetal' : /animal/.test(task) ? 'la célula animal' : 'la célula solicitada'
    const structures = ['núcleo', 'membrana celular', 'citoplasma', 'mitocondrias'].filter((_,i) => task.includes(['nucleo','membrana','citoplasma','mitocondri'][i]))
    const parts = structures.length ? structures.join(', ') : 'las estructuras solicitadas'
    const representation = /maqueta/.test(task) && /dibuj/.test(task)
      ? /maqueta\s+o\s+(?:un\s+)?dibuj|dibuj\w*\s+o\s+(?:una\s+)?maqueta/.test(task) ? 'maqueta o dibujo cuando la consigna permite elegir' : 'maqueta y dibujo, según la consigna'
      : /maqueta/.test(task) ? 'maqueta' : /dibuj/.test(task) ? 'dibujo' : 'modelo científico'
    if (/estructur|identific|partes|nucleo|organel|organul/.test(task)) result.push(criterion(topic,'structures','Identificación de estructuras celulares', `Identifica y ubica ${parts} en ${target}.`, [
      `Ubica y rotula correctamente ${parts} en ${target}, sin confundir las estructuras.`,
      `Identifica las estructuras solicitadas; una ubicación o rótulo necesita precisión.`,
      'Identifica algunas estructuras, pero confunde su ubicación o denominación.',
      'Los rótulos y ubicaciones presentan confusiones que impiden reconocer las partes principales.',
      'No permite identificar las estructuras celulares solicitadas.',
    ]))
    if (/maqueta|dibuj|modelo|represent/.test(task)) result.push(criterion(topic,'representation',both ? 'Representación de ambos tipos celulares' : 'Representación del tipo celular solicitado', `Representa ${target} mediante la alternativa solicitada: ${representation}.`, [
      `La representación de ${target} distingue su organización y sus rasgos propios mediante el medio elegido.`,
      `Representa ${target}; un rasgo diferenciador necesita precisión.`,
      both ? 'Representa solo uno de los dos tipos, o las dos representaciones no permiten diferenciarlos.' : 'La representación es parcial y varios rasgos del tipo celular resultan ambiguos.',
      'La representación contradice la organización del tipo celular solicitado.',
      'No presenta una representación reconocible del tipo celular solicitado.',
    ]))
    if (/funcion/.test(task)) result.push(criterion(topic,'functions','Funciones de los organelos', `Relaciona ${parts} con sus funciones celulares.`, [
      'Relaciona cada organelo solicitado con su función y explica su aporte al funcionamiento celular.',
      'Relaciona los organelos con sus funciones, con una explicación poco desarrollada.',
      'Explica algunas funciones, pero atribuye funciones incorrectas a otros organelos.',
      'Enumera organelos sin establecer relaciones correctas con sus funciones.',
      'No aporta relaciones entre los organelos y sus funciones.',
    ]))
    if (/compar|semejanz|diferenc/.test(task)) result.push(criterion(topic,'comparison','Comparación entre células', 'Explica semejanzas y diferencias entre los tipos celulares solicitados con apoyo en sus estructuras y funciones.', [
      'Explica semejanzas y diferencias pertinentes y las sustenta en las estructuras y funciones de ambos tipos.',
      'Explica semejanzas y diferencias correctas, con justificación parcial.',
      'Reconoce algunas semejanzas o diferencias, pero confunde rasgos de los tipos comparados.',
      'Atribuye los mismos rasgos a ambos tipos sin establecer una comparación válida.',
      'No presenta semejanzas ni diferencias entre los tipos solicitados.',
    ]))
    if (/present|expon|oral|companeros/.test(task)) {
      const topics = result.map(row => ({structures:'las estructuras',representation:'la representación',functions:'las funciones',comparison:'la comparación'}[row.templateId.replace('science-cells-','')])).filter(Boolean).join(', ') || 'el tema celular solicitado'
      const complete = result.length === 4
      result.push(criterion(topic,'oral','Explicación oral del modelo científico', complete ? 'Presenta el trabajo y explica las estructuras, funciones y comparación solicitadas usando vocabulario científico comprensible.' : `Presenta el trabajo y explica ${topics} usando vocabulario científico comprensible.`, [
      complete ? 'Explica el modelo, las funciones y la comparación de manera articulada y usa sus representaciones para apoyar la presentación.' : `Explica ${topics} de manera articulada y con vocabulario científico comprensible.`,
      'La presentación explica el trabajo con vocabulario comprensible; una relación científica queda poco desarrollada.',
      'Presenta el trabajo, pero sus explicaciones son fragmentarias o contienen confusiones científicas.',
      'Muestra el trabajo sin explicar las relaciones científicas solicitadas.',
      'No ofrece una explicación oral del trabajo.',
    ]))
    }
  } else {
    if (/resolv|calcul|ejercicio|despej|formula/.test(task)) {
      result.push(criterion(topic,'data','Datos e incógnitas', 'Identifica los datos conocidos y la magnitud que debe calcular: voltaje, corriente o resistencia.', [
        'Distingue datos e incógnita en cada ejercicio y los expresa con sus magnitudes y unidades correspondientes.', 'Identifica los datos y la incógnita; una unidad o símbolo necesita precisión.', 'Identifica parte de los datos, pero confunde la incógnita o alguna magnitud.', 'Usa valores sin distinguir los datos de la magnitud solicitada.', 'No identifica datos ni incógnita utilizables para resolver el ejercicio.',
      ]))
      result.push(criterion(topic,'formula','Aplicación y despeje de la Ley de Ohm', 'Selecciona V = I × R y despeja la magnitud solicitada antes de sustituir los datos.', [
        'Aplica V = I × R, I = V/R o R = V/I según la incógnita y sustituye los datos de manera coherente.', 'Selecciona y despeja la relación correcta; presenta un paso poco explícito.', 'Reconoce la Ley de Ohm, pero un despeje o sustitución altera la relación entre magnitudes.', 'Selecciona una relación que no permite obtener la incógnita solicitada.', 'No plantea una relación de la Ley de Ohm para el ejercicio.',
      ]))
      result.push(criterion(topic,'calculation','Cálculo y unidades eléctricas', 'Realiza los cálculos y expresa los resultados en voltios, amperios u ohmios según la magnitud.', [
        'Obtiene resultados correctos y utiliza V, A u Ω de forma consistente en los pasos y respuestas.', 'El procedimiento y resultado son correctos, con una omisión menor de notación o unidad.', 'Un error aritmético o de unidades afecta parte de los resultados.', 'Los errores de cálculo y unidades impiden interpretar los resultados obtenidos.', 'No presenta cálculos ni resultados interpretables.',
      ]))
    }
    if (/cotidian|interpret|analiz|aplicacion|vida/.test(task)) result.push(criterion(topic,'interpretation','Interpretación de situaciones cotidianas', 'Relaciona voltaje, corriente y resistencia para explicar las situaciones cotidianas analizadas.', [
      'Explica la relación entre las tres magnitudes y la aplica coherentemente a las situaciones cotidianas planteadas.', 'Relaciona las magnitudes con la situación, con una consecuencia poco desarrollada.', 'Describe la situación, pero relaciona solo parcialmente sus magnitudes eléctricas.', 'Ofrece una explicación incompatible con la relación entre voltaje, corriente y resistencia.', 'No presenta una interpretación eléctrica de las situaciones planteadas.',
    ]))
    if (/\b(?:esquema|diagrama|dibuj\w*)\b/.test(task) && /circuit/.test(task)) result.push(criterion(topic,'diagram','Esquema y funcionamiento del circuito', 'Elabora un esquema de circuito sencillo, identifica sus componentes y explica cómo se relacionan para su funcionamiento.', [
      'El esquema muestra conexiones coherentes; identifica sus componentes y explica el recorrido de la corriente y la función de los elementos representados.', 'El esquema y sus componentes son reconocibles; una conexión o explicación requiere precisión.', 'El esquema es parcial o algunas conexiones y funciones no se corresponden.', 'Las conexiones representadas impiden explicar el funcionamiento del circuito.', 'No presenta un esquema reconocible ni una explicación de su funcionamiento.',
    ]))
  }
  return result.map(row => format === 'lista-cotejo' || format === 'escala' ? { ...row, title:row.observable } : row)
}

export const secondaryScienceModules = [
  { id:'cells', grade:2, subjectCode:'NAT-VIDA', criteria:secondaryScienceCriteria('cells','Representa mediante maqueta o dibujo la célula animal y vegetal; identifica núcleo, membrana, citoplasma y mitocondrias; explica sus funciones, compara y presenta oralmente.'), source:{ topicElementId:'4916701f-df02-5247-84d8-3aa598f61ef5', pdfPages:[296], printedPages:[295], procedureIds:['6dd78416-fb90-5b4f-bfc6-cde194294ff8','2bbe883b-7ada-59cd-a0cf-d87f047d4192','82edb0a8-c51f-57ad-948b-00c90962d448'] } },
  { id:'ohm', grade:6, subjectCode:'NAT-FIS', criteria:secondaryScienceCriteria('ohm','Resuelve ejercicios y calcula voltaje, corriente y resistencia; interpreta situaciones cotidianas y elabora un esquema de circuito.'), source:{ topicElementId:'debd0099-cecd-55bf-8514-7b7132f04ea6', pdfPages:[320,321], printedPages:[319,320], procedureIds:['30945ae6-1caa-53b3-a1b0-5b1d6341b275'] } },
] as const
