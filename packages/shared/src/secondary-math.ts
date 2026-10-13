import { normalizedTask } from './secondary-language-topics'
import type { InstrumentAcademicContext } from './secondary-science'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'

export type MathTopic = 'matrices' | 'trigonometry'
export const secondaryMathModules = [
  { id: 'matrices' as const, grade: 5, sourcePdfPages: [231,232], status: 'PARTIAL_CONTEXTUAL_OPERATIONS' },
  { id: 'trigonometry' as const, grade: 6, sourcePdfPages: [231,232], sourceGrade: 5, status: 'TEACHER_TASK_ADAPTATION_GRADE_MISMATCH' },
]
export function findSecondaryMathTopic(title: string, description: string, context?: InstrumentAcademicContext | null): MathTopic | null {
  if (context?.level !== 'SECONDARY' || context.subjectCode.trim().toUpperCase() !== 'MAT') return null
  const task = normalizedTask(description || title)
  if (context.grade === 5 && /\bmatri(?:ces|z)\b/.test(task)) return 'matrices'
  if (context.grade === 6 && /trigonom|\bseno\b|\bcoseno\b|\btangente\b/.test(task) && /alturas?|distancias?/.test(task)) return 'trigonometry'
  return null
}
const row = (topic: MathTopic, id: string, title: string, observable: string, weight: number,
  progressionLevels: ContextualTopicCriterion['progressionLevels']): ContextualTopicCriterion =>
  ({templateId:`math-${topic}-${id}`,title,observable,weight,progressionLevels})

/** Teacher-task adaptation, not a literal curricular rubric. Only requested evidence is selected. */
export function secondaryMathCriteria(topic: MathTopic, description: string): ContextualTopicCriterion[] {
  const task = normalizedTask(description)
  const solving = /resolv|calcul|operacion|operar|suma|resta|multiplica/.test(task)
  const explaining = /explic|justific|procedimiento|argument/.test(task)
  const interpreting = /interpret|significado|situacion|cotidian|contexto/.test(task)
  const rows: ContextualTopicCriterion[] = []
  if (topic === 'matrices') {
    const commerce = /ventas?|productos?|cantidades|precios?/.test(task)
    const data = commerce ? 'los datos de cantidades, precios o ventas proporcionados' : 'los datos proporcionados'
    const constructing = /constru|organiz/.test(task)
    if (solving || /constru|organiz|filas|columnas|analiz|explic/.test(task)) rows.push(row(topic,'data','Organización y significado de los datos',
      constructing ? `Organiza ${data} en matrices e identifica qué representan sus filas, columnas y entradas.` : 'Identifica el significado de las filas, columnas y entradas de las matrices proporcionadas.',4,[
      constructing ? `Organiza ${data} sin alterar sus relaciones y vincula cada fila, columna y entrada con su significado.` : 'Relaciona correctamente las filas, columnas y entradas de las matrices con el significado de los datos.',
      'La matriz conserva los datos y sus relaciones; una etiqueta o significado necesita precisión.',
      'Organiza parte de los datos, pero alguna entrada no coincide con la fila o columna correspondiente.',
      'La disposición impide reconocer las relaciones entre los datos y el significado de las filas y columnas.',
      'No presenta evidencia que permita reconocer la organización de los datos en una matriz.',
    ]))
    if (solving) {
      const operations = ['suma','resta','multiplicación'].filter((_,i)=>task.includes(['suma','resta','multiplica'][i]))
      const selection = operations.length ? operations.join(', ') : 'la operación solicitada'
      const conditional = /segun corresponda|cuando corresponda|segun (?:el|cada)|o bien/.test(task)
      rows.push(row(topic,'selection','Selección de operaciones y dimensiones',
        `Selecciona ${selection}${conditional ? ', según corresponda a cada situación' : ' conforme a la consigna'}, y comprueba la compatibilidad de las dimensiones antes de operar.`,4,[
        'Relaciona la operación con la pregunta, verifica las dimensiones necesarias y descarta las operaciones que no corresponden.',
        'La operación corresponde a la situación y sus dimensiones son compatibles; la explicación de una condición es incompleta.',
        'Reconoce una operación pertinente, pero omite una condición de dimensiones o elige otra sin relación con la pregunta.',
        'Elige operaciones con incompatibilidades de dimensiones que impiden resolver la situación.',
        'No identifica una operación pertinente ni sus condiciones de dimensiones.',
      ]))
      rows.push(row(topic,'operations','Ejecución de las operaciones requeridas',
        `Realiza ${conditional ? 'las operaciones que corresponden a cada situación' : 'las operaciones requeridas'} respetando el orden y la posición de las entradas de las matrices.`,5,[
        `Ejecuta correctamente las operaciones seleccionadas, manteniendo la correspondencia de entradas${task.includes('multiplica') ? ' y el orden de los productos cuando corresponde' : ''}.`,
        'El procedimiento es correcto; un error aritmético aislado afecta una entrada.',
        'Completa parte de las operaciones, con errores de correspondencia o cálculo en varias entradas.',
        'Los pasos no respetan las reglas de las operaciones y no permiten resolver la situación.',
        'No desarrolla las operaciones necesarias para obtener un resultado.',
      ]))
    }
    if (/(?:compar|contrast)\w*\s+(?:(?:dos|las|estas|ambas|sus)\s+)?matrices\b|(?:diferencias|semejanzas)\s+entre\s+(?:las\s+)?matrices/.test(task)) rows.push(row(topic,'comparison','Comparación de matrices',
      'Compara las matrices atendiendo a sus dimensiones, entradas y significado de los datos, según la comparación solicitada.',4,[
      'Establece semejanzas y diferencias pertinentes usando dimensiones y entradas correspondientes como evidencia.',
      'Reconoce las diferencias principales usando entradas correspondientes; una relación necesita precisión.',
      'Reconoce diferencias, pero compara entradas que no representan el mismo dato.',
      'Presenta diferencias sin vincularlas con las matrices ni con el significado de sus entradas.',
      'No aporta una comparación verificable de las matrices.',
    ]))
    if (explaining && (solving || /procedimiento|justific/.test(task))) rows.push(row(topic,'justification','Justificación del procedimiento',
      'Explica por qué el procedimiento con matrices responde a la pregunta y relaciona sus pasos con los datos utilizados.',3,[
      'Justifica el procedimiento enlazando pregunta, datos y pasos; permite reconstruir el razonamiento seguido.',
      'Relaciona los pasos con la pregunta; una decisión queda poco justificada.',
      'Enumera pasos, pero justifica solo algunas decisiones o no los relaciona con los datos.',
      'La explicación no relaciona las decisiones con el procedimiento desarrollado.',
      'No aporta una explicación del procedimiento utilizado.',
    ]))
    if (interpreting) rows.push(row(topic,'interpretation','Interpretación en el contexto',
      `Interpreta las entradas de la matriz resultante en relación con ${commerce ? 'las cantidades, precios o ventas de la situación' : 'los datos y la pregunta de la situación'}.`,4,[
      'Relaciona las entradas del resultado con lo que representan y responde de forma coherente a la situación.',
      'Interpreta el resultado en su contexto; una entrada o relación necesita precisión.',
      'Interpreta parte del resultado, pero atribuye un significado incorrecto a alguna entrada.',
      'Repite resultados numéricos sin establecer qué significan para la situación.',
      'No aporta una interpretación del resultado en el contexto planteado.',
    ]))
  } else {
    if (solving || /datos|identific|analiz/.test(task)) rows.push(row(topic,'data','Datos conocidos e incógnita',
      'Identifica medidas y ángulos conocidos, la altura o distancia buscada y sus relaciones en la situación.',4,[
      'Distingue los datos y la incógnita y relaciona las medidas con la situación geométrica, sin añadir datos no disponibles.',
      'Reconoce datos e incógnita; una relación entre las medidas necesita precisión.',
      'Identifica parte de los datos, pero confunde una medida conocida con la incógnita o su relación geométrica.',
      'Confunde los datos y la incógnita e impide plantear la situación.',
      'No identifica los datos ni la altura o distancia que se busca.',
    ]))
    if (solving || /seleccion|razon/.test(task)) rows.push(row(topic,'ratio','Elección de la razón trigonométrica',
      'Selecciona seno, coseno o tangente según las medidas conocidas y la altura o distancia buscada; plantea la relación correspondiente.',5,[
      'Elige y plantea la razón que relaciona datos e incógnita, distinguiendo cada lado respecto al ángulo.',
      'La razón y el planteamiento son pertinentes; la identificación de un lado necesita precisión.',
      'Reconoce una razón posible, pero confunde lados o no la vincula con la incógnita.',
      'La razón planteada no relaciona las medidas disponibles con la incógnita.',
      'No plantea una razón trigonométrica útil para la situación.',
    ]))
    if (solving) rows.push(row(topic,'calculation','Cálculo de la altura o distancia',
      'Despeja la incógnita y calcula la altura o distancia con la razón elegida, expresando el resultado en las unidades de la situación.',5,[
      'Despeja y calcula correctamente, conserva las unidades y usa una precisión numérica coherente con los datos.',
      'El despeje y el cálculo son correctos; una unidad o aproximación necesita precisión.',
      'El planteamiento es aprovechable, pero un error de despeje o cálculo afecta la medida obtenida.',
      'Los errores de despeje o cálculo impiden obtener una medida válida.',
      'No desarrolla un cálculo que permita obtener la altura o distancia.',
    ]))
    if (explaining) rows.push(row(topic,'justification','Explicación del procedimiento',
      'Explica la elección de la razón y los pasos seguidos para obtener la altura o distancia.',3,[
      'Justifica la razón y conecta datos, planteamiento, despeje y cálculo en una explicación reconstruible.',
      'Explica la razón y los pasos principales; una decisión queda poco justificada.',
      'Enumera algunos pasos sin explicar su relación con los datos o la incógnita.',
      'La explicación no permite reconstruir el procedimiento desarrollado.',
      'No aporta una explicación del procedimiento.',
    ]))
    if (interpreting) rows.push(row(topic,'interpretation','Interpretación de la medida obtenida',
      'Explica qué representa la altura o distancia obtenida y si es coherente con las condiciones de la situación cotidiana.',3,[
      'Interpreta la medida y contrasta su coherencia con los datos y condiciones de la situación.',
      'Interpreta la medida en la situación; la comprobación de coherencia es incompleta.',
      'Relaciona parcialmente el número con la medida, sin revisar una condición importante.',
      'Menciona el número sin explicar su significado en la situación.',
      'No relaciona el resultado con la altura o distancia buscada.',
    ]))
  }
  if (/verific|comprob|revis.*resultado/.test(task)) rows.push(row(topic,'verification','Comprobación del resultado',
    'Comprueba el resultado mediante la revisión solicitada, contrastándolo con los datos y las relaciones originales.',2,[
    'Aplica la comprobación solicitada y localiza o descarta errores usando datos y resultado.',
    'Comprueba el resultado; una parte de la revisión queda sin documentar.',
    'La comprobación es parcial y no permite revisar todos los aspectos solicitados.',
    'La comprobación no guarda relación con el resultado que debía revisar.',
    'No aporta la comprobación solicitada.',
  ]))
  return rows
}
