import { normalizedTask as normalize } from '@aula/shared'
import type { AuthoredCriterion } from './types'

export function calligramCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const freeVerse = /verso libre/.test(normalize(description))
  if (activityType === 'CALLIGRAM_ANALYSIS') return [
    { templateId: 'calligram-relation', title: 'Relación entre texto y figura', observable: 'Interpreta cómo la figura formada por las palabras se relaciona con el tema y mensaje del poema.', weight: 6 },
    { templateId: 'calligram-intention', title: 'Intención y sentimientos', observable: 'Explica la intención comunicativa y los sentimientos expresados en el caligrama.', weight: 4 },
    { templateId: 'calligram-resources', title: 'Recursos expresivos presentes', observable: 'Analiza el vocabulario y las figuras literarias efectivamente presentes, sin exigir recursos ausentes.', weight: 4 },
    { templateId: 'calligram-visual', title: 'Organización visual', observable: 'Explica cómo tipografía, disposición y legibilidad contribuyen al significado.', weight: 3 },
    { templateId: 'calligram-evidence', title: 'Evidencias del caligrama', observable: 'Justifica su interpretación con palabras, versos y rasgos visuales concretos.', weight: 3 },
  ]
  if (activityType === 'CALLIGRAM_COMPARISON') return [
    { templateId: 'calligram-message', title: 'Comparación de mensajes', observable: 'Compara los temas, mensajes y sentimientos de ambos caligramas.', weight: 4 },
    { templateId: 'calligram-figure', title: 'Comparación de figuras', observable: 'Contrasta la relación entre las palabras y la figura formada en cada texto.', weight: 5 },
    { templateId: 'calligram-resources', title: 'Recursos expresivos', observable: 'Establece semejanzas y diferencias en vocabulario y recursos literarios presentes.', weight: 4 },
    { templateId: 'calligram-visual', title: 'Organización visual', observable: 'Compara disposición, tipografía y legibilidad con evidencias de ambos textos.', weight: 4 },
    { templateId: 'calligram-conclusion', title: 'Conclusión comparativa', observable: 'Formula una conclusión coherente sobre las decisiones poéticas y visuales.', weight: 3 },
  ]
  if (activityType === 'CALLIGRAM_RECITATION') return [
    { templateId: 'calligram-clarity', title: 'Claridad de la recitación', observable: 'Recita el texto con dicción y volumen comprensibles.', weight: 5 },
    { templateId: 'calligram-expression', title: 'Entonación y expresión', observable: 'Ajusta la entonación, el ritmo y las pausas a los sentimientos del poema.', weight: 5 },
    { templateId: 'calligram-meaning', title: 'Comprensión del poema', observable: 'Comunica el sentido global del caligrama durante la recitación.', weight: 4 },
    { templateId: 'calligram-fluency', title: 'Fluidez', observable: 'Mantiene continuidad sin que las vacilaciones impidan comprender el texto.', weight: 3 },
    { templateId: 'calligram-individual', title: 'Desempeño individual', observable: 'Sostiene personalmente la recitación del caligrama seleccionado.', weight: 3 },
  ]
  if (activityType === 'CALLIGRAM_EXPLANATION') return [
    { templateId: 'calligram-relation', title: 'Tema, palabras y figura', observable: 'Explica la relación entre el tema, las palabras elegidas y la figura de su caligrama.', weight: 6 },
    { templateId: 'calligram-decisions', title: 'Decisiones poéticas y visuales', observable: 'Justifica el vocabulario, los recursos expresivos y la disposición visual empleados.', weight: 5 },
    { templateId: 'calligram-feelings', title: 'Ideas y sentimientos', observable: 'Explica las ideas, emociones o sentimientos que buscó comunicar.', weight: 4 },
    { templateId: 'calligram-oral', title: 'Claridad de la explicación', observable: 'Presenta sus decisiones con orden, dicción y volumen comprensibles.', weight: 3 },
    { templateId: 'calligram-individual', title: 'Dominio individual', observable: 'Responde preguntas sobre su proceso y producto.', weight: 2 },
  ]
  return [
    { templateId: 'calligram-relation', title: 'Relación entre tema y figura', observable: 'Dispone los versos formando una figura relacionada con el tema del poema.', weight: 5 },
    { templateId: 'calligram-expression', title: 'Expresión de ideas y sentimientos', observable: 'Comunica ideas, sentimientos o emociones coherentes con el tema elegido.', weight: 4 },
    { templateId: 'calligram-visual', title: 'Organización visual y legibilidad', observable: 'Organiza las palabras para construir la figura sin dificultar innecesariamente la lectura.', weight: 4 },
    { templateId: 'calligram-resources', title: 'Vocabulario y recursos expresivos', observable: `Usa vocabulario y recursos poéticos pertinentes${freeVerse ? ' en verso libre, sin exigir rima' : ''}.`, weight: 4 },
    { templateId: 'calligram-revision', title: 'Coherencia y revisión final', observable: 'Revisa la coherencia del poema, la relación texto-figura, la ortografía y la versión final.', weight: 3 },
  ]
}
