import { topicTaskMode } from './secondary-language-topics'
import type { SecondaryLanguageTopic } from './secondary-topic-types'
import {completeSecondGradeLanguageCriteria} from './secondary-language-grade-two-complete'
import {affirmativeLanguageTask} from './language-feature-criteria'

export type ContextualTopicCriterion = {
  templateId: string; title: string; observable: string; weight: number
  progressionLevels: [string, string, string, string, string]
}

// A scoped topic plus a requested action/element narrows evidence; resources alone never do.
const focusPatterns: Record<string, Record<string, string>> = {
  'guia-turistica': { purpose: 'proposito|destinatario|visitante|orienta', places: 'clasific|caracteristicas de los lugares|descripcion de los lugares', organization: 'estructura|portada|cierre', spatial: 'conectores espaciales|relaciones espaciales|situar|ubicacion', graphics: 'informacion grafica|imagenes|mapas|fotografias' },
  'articulo-expositivo': { 'problem-solution': 'problema|solucion', ideas: 'idea principal|ideas secundarias|parrafos', explanation: 'causa|efecto|finalidad', evidence: 'datos|evidencias|fuentes' },
  'informe-de-lectura': { summary: 'resumen|ideas principales', analysis: 'analisis|temas del texto|interpretacion', structure: 'estructura|introduccion|desarrollo|conclusion', paragraphs: 'oracion tematica|parrafos|cohesion' },
  'cuento-amor-amistad': { conflict: 'conflicto|resolucion|complicacion', characters: 'personajes|motivaciones', setting: 'ambiente|secuencia|tiempo|espacio', language: 'dialogo|figuras|recursos expresivos|recursos literarios' },
  'decima-espinela': { theme: 'tema|sentido|mensaje', verse: 'octosilab|computo|versos', rhyme: 'rima|ritmo', expression: 'figuras|recursos expresivos|recursos literarios' },
}

function baseSecondaryTopicCriteria(topic: SecondaryLanguageTopic, activityType: string, description: string): ContextualTopicCriterion[] {
  const mode = topicTaskMode(activityType)
  const task = affirmativeLanguageTask(description)
  const producing = mode === 'PRODUCTION' || (mode === 'REPORT' && topic.id === 'informe-de-lectura')
    || mode==='ORAL'&&(/\b(?:produc|elabor|cre|compon)\w*/.test(task)||topic.id==='informe-de-lectura'&&/expon|exposicion/.test(task))
  if (mode === 'ORAL' && topic.id === 'cuento-amor-amistad' && /\bnarr\w*\s+oralmente\b/.test(task)) {
    return [
      {
        templateId: `len-${topic.grade}-${topic.id}-oral-story-sequence`, title: 'Secuencia y conflicto de la narración', weight: 5,
        observable: 'Narra el cuento de amor y amistad enlazando la situación inicial, el conflicto y su resolución.',
        progressionLevels: [
          'La situación inicial, el conflicto y la resolución se enlazan en una secuencia comprensible.',
          'La secuencia es comprensible, aunque una transición entre acciones necesita precisión.',
          'Se narran acciones aisladas sin enlazar el conflicto con su resolución.',
          'Los cambios de orden o de acciones contradicen el conflicto narrado.',
          'No se presenta una narración reconocible del cuento.',
        ],
      },
      {
        templateId: `len-${topic.grade}-${topic.id}-oral-story-characters`, title: 'Personajes y ambiente narrados', weight: 4,
        observable: 'Permite reconocer a los personajes y el ambiente del cuento mediante las acciones y referencias de la narración.',
        progressionLevels: [
          'Las acciones y referencias permiten reconocer a los personajes y el ambiente del cuento.',
          'Se reconocen los personajes y el ambiente, aunque una referencia resulta ambigua.',
          'Se nombran personajes o lugares sin relacionarlos con las acciones narradas.',
          'Se confunden personajes o ambientes y cambia el sentido de las acciones.',
          'No hay referencias que permitan reconocer personajes ni ambiente en la narración.',
        ],
      },
      {
        templateId: `len-${topic.grade}-${topic.id}-oral-story-expression`, title: 'Claridad expresiva de la narración', weight: 3,
        observable: 'Usa pausas, entonación y vocabulario comprensible, o los apoyos acordados, para comunicar las acciones del cuento.',
        progressionLevels: [
          'Los recursos expresivos o apoyos acordados permiten comprender las acciones y sus relaciones.',
          'Se comprenden las acciones, aunque una pausa o expresión dificulta una relación.',
          'Las interrupciones o expresiones ambiguas dificultan seguir varias acciones.',
          'La expresión cambia el sentido de las acciones o impide relacionarlas.',
          'No se aporta evidencia de comunicación de las acciones con los apoyos acordados.',
        ],
      },
    ]
  }
  if (mode === 'ORAL' && topic.id === 'decima-espinela' && /\b(?:recit|declam)\w*/.test(task)) {
    return [
      {
        templateId: `len-${topic.grade}-${topic.id}-recitation-sequence`, title: 'Secuencia de la recitación', weight: 4,
        observable: 'Recita la décima conservando la secuencia y el sentido de los versos del texto elegido, con los apoyos acordados.',
        progressionLevels: [
          'La secuencia de versos permite seguir el sentido completo de la décima elegida.',
          'Una omisión o repetición puntual no impide seguir el sentido de la décima.',
          'Las omisiones o cambios de orden interrumpen la relación entre varios versos.',
          'Los cambios de secuencia alteran el sentido del texto recitado.',
          'No se presenta una recitación reconocible de la décima elegida con los apoyos acordados.',
        ],
      },
      {
        templateId: `len-${topic.grade}-${topic.id}-recitation-rhythm`, title: 'Ritmo y pausas', weight: 4,
        observable: 'Usa el ritmo y las pausas de la recitación para que se perciban los versos y sus relaciones.',
        progressionLevels: [
          'El ritmo y las pausas permiten percibir los versos y comprender sus relaciones.',
          'Una pausa o variación de ritmo dificulta un verso, sin perder la continuidad del texto.',
          'Las pausas o el ritmo interrumpen repetidamente la continuidad entre los versos.',
          'Las pausas o el ritmo separan palabras relacionadas y alteran el sentido de los versos.',
          'No hay evidencia de ritmo y pausas en la recitación o en el apoyo de acceso acordado.',
        ],
      },
      {
        templateId: `len-${topic.grade}-${topic.id}-recitation-expression`, title: 'Expresión del sentido', weight: 3,
        observable: 'Comunica el sentido de la décima mediante la entonación y el énfasis, o el apoyo de acceso acordado para la recitación.',
        progressionLevels: [
          'La entonación y el énfasis, o el apoyo acordado, comunican el sentido de los versos.',
          'El sentido se comunica, aunque un énfasis resulta poco relacionado con el verso.',
          'El énfasis ayuda a comprender algunos versos y deja otros sin una relación expresiva clara.',
          'La expresión contradice el sentido de los versos recitados.',
          'No se aporta evidencia de expresión del sentido mediante la recitación o el apoyo acordado.',
        ],
      },
    ]
  }
  const relevant = topic.dimensions
    .filter(dimension => !dimension.requestedOnly || new RegExp(dimension.requestedOnly).test(task)
      || topic.id==='guia-turistica'&&dimension.id==='graphics'&&/informacion grafica|mapas?|fotografias?|imagenes?|graficos?/.test(task))
  const focused = !producing && (mode === 'ANALYSIS' || mode === 'COMPARISON')
    ? relevant.filter(dimension => {
      const pattern = focusPatterns[topic.id]?.[dimension.id]
      return pattern && new RegExp(`\\b(?:identific|reconoc|analiz|compar|explic|revis)\\w*[^.;]{0,85}(?:${pattern})`).test(task)
    }) : []
  const criteria: ContextualTopicCriterion[] = (focused.length ? focused : relevant)
    .map(dimension => {
      const observable = mode === 'COMPARISON' ? dimension.comparison : producing ? dimension.production : dimension.analysis
      return { templateId: `len-${topic.grade}-${topic.id}-${dimension.id}`, title: dimension.title,
        observable, weight: dimension.weight, progressionLevels: [observable, ...dimension.evidence] }
    })
  if (focused.length && focused.length < relevant.length) criteria.push({
    templateId: `len-${topic.grade}-${topic.id}-evidence-verification`, title: 'Apoyo de la interpretación', weight: 3,
    observable: 'Sustenta la identificación o interpretación solicitada con partes pertinentes del texto analizado.',
    progressionLevels: [
      'Las partes señaladas del texto sustentan la identificación o interpretación solicitada.',
      'Se aporta un apoyo pertinente, aunque una relación con la interpretación necesita precisión.',
      'Se señala una parte del texto sin explicar qué identificación sustenta.',
      'Se utiliza una parte del texto que contradice la identificación o interpretación.',
      'No se aporta una parte pertinente del texto para sustentar la identificación.',
    ],
  })
  if (mode === 'ORAL') criteria.push({
    templateId: `len-${topic.grade}-${topic.id}-oral-communication`, title: 'Comunicación oral del contenido', weight: 3,
    observable: 'Comunica las ideas del texto con una secuencia comprensible y vocabulario pertinente, usando los apoyos de acceso que necesite.',
    progressionLevels: [
      'La secuencia y el vocabulario permiten comprender las ideas y sus relaciones.',
      'Se comprenden las ideas principales, aunque una transición entre ellas necesita precisión.',
      'Se comunican ideas aisladas y cuesta reconocer la relación entre ellas.',
      'La secuencia o el vocabulario altera el sentido de las ideas del texto.',
      'No se aporta evidencia oral o mediante el apoyo de acceso acordado para esta actividad.',
    ],
  })
  if (mode === 'REPORT' && topic.id !== 'informe-de-lectura') criteria.push({
    templateId: `len-${topic.grade}-${topic.id}-report-organization`, title: 'Organización del informe', weight: 3,
    observable: 'Organiza el informe con introducción, análisis sustentado del texto y conclusión relacionada con las evidencias.',
    progressionLevels: [
      'Introducción, análisis y conclusión se relacionan con las evidencias del texto.',
      'Las partes son reconocibles, aunque la conclusión no retoma una evidencia del análisis.',
      'Se recopilan datos del texto sin un análisis o una conclusión relacionados.',
      'Se confunde el informe con la creación de un texto nuevo y no se analiza la fuente.',
      'No se presenta un informe reconocible sobre el texto.',
    ],
  })
  return criteria
}

export function secondaryTopicCriteria(topic:SecondaryLanguageTopic,activity:string,description:string):ContextualTopicCriterion[] {
  const base=baseSecondaryTopicCriteria(topic,activity,description)
  return topic.grade===2?completeSecondGradeLanguageCriteria(topic.id,activity,description,base):base
}
