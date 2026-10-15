import { normalizedTask as normalize } from '../../secondary-language-topics'
type AuthoredCriterion = { templateId: string; title: string; observable: string; weight: number }

export function rawFirstGradeReadingReportCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const text = normalize(description)
  const literaryText = /\bcuentos?\b/.test(text) ? 'cuento leído' : /\bleyendas?\b/.test(text) ? 'leyenda leída' : /\bfabulas?\b/.test(text) ? 'fábula leída' : /\bnovelas?\b/.test(text) ? 'novela leída' : /\bnoticias?\b/.test(text)?'la noticia leída':'texto seleccionado'
  if (activityType === 'READING_REPORT_ANALYSIS') return [
    { templateId: 'report-purpose', title: 'Función y propósito del informe', observable: 'Explica para qué se elaboró el informe de lectura y qué texto analiza.', weight: 4 },
    { templateId: 'report-structure', title: 'Identificación de la estructura', observable: 'Identifica título, introducción, desarrollo y conclusión en el informe leído.', weight: 4 },
    { templateId: 'report-summary', title: 'Comprensión del resumen', observable: `Reconoce las ideas principales de ${literaryText} recuperadas en el informe sin confundirlas con el análisis.`, weight: 4 },
    { templateId: 'report-analysis', title: 'Interpretación del análisis sociocultural', observable: 'Explica las interpretaciones del informe sobre comportamientos, costumbres o valores presentes en el texto.', weight: 5 },
    { templateId: 'report-evidence', title: 'Justificación con evidencias', observable: 'Sustenta sus respuestas con información concreta del informe de lectura.', weight: 3 },
  ]
  if (activityType === 'READING_REPORT_PRESENTATION') return [
    { templateId: 'report-summary', title: `Síntesis de ${literaryText}`, observable: `Presenta las ideas principales de ${literaryText} de forma fiel y comprensible.`, weight: 5 },
    { templateId: 'report-analysis', title: 'Análisis sociocultural', observable: 'Explica patrones socioculturales del texto y sustenta su interpretación con ejemplos.', weight: 5 },
    { templateId: 'report-structure', title: 'Organización del informe oral', observable: 'Organiza la exposición con introducción, desarrollo y conclusión reconocibles.', weight: 4 },
    { templateId: 'report-oral', title: 'Claridad de la exposición', observable: 'Expone con orden, dicción, volumen y ritmo comprensibles.', weight: 3 },
    { templateId: 'report-individual', title: 'Dominio individual', observable: 'Responde preguntas sobre el texto y el análisis presentado.', weight: 3 },
  ]
  if (activityType === 'READING_REPORT_COMPARISON') return [
    { templateId: 'report-purpose', title: 'Propósito y textos analizados', observable: 'Compara el propósito y los textos literarios abordados en ambos informes.', weight: 4 },
    { templateId: 'report-structure', title: 'Comparación de la estructura', observable: 'Contrasta la organización de título, introducción, desarrollo y conclusión.', weight: 4 },
    { templateId: 'report-analysis', title: 'Comparación de interpretaciones', observable: 'Establece semejanzas y diferencias entre los análisis socioculturales.', weight: 5 },
    { templateId: 'report-evidence', title: 'Uso de evidencias', observable: 'Sustenta la comparación con información concreta de ambos informes.', weight: 4 },
    { templateId: 'report-conclusion', title: 'Conclusión comparativa', observable: 'Formula una conclusión coherente con las diferencias y semejanzas identificadas.', weight: 3 },
  ]
  return [
    { templateId: 'report-summary', title: `Resumen de ${literaryText}`, observable: `Resume las ideas principales de ${literaryText} mediante selección, omisión, generalización y reconstrucción, sin alterar su sentido.`, weight: 5 },
    { templateId: 'report-analysis', title: 'Análisis sociocultural', observable: 'Analiza comportamientos, costumbres, estilos de vida o valores presentes en el texto y aporta ejemplos pertinentes.', weight: 5 },
    { templateId: 'report-structure', title: 'Estructura del informe de lectura', observable: 'Organiza título, introducción, desarrollo y conclusión de acuerdo con el propósito del informe.', weight: 4 },
    { templateId: 'report-coherence', title: 'Coherencia y recursos lingüísticos', observable: 'Relaciona resumen y análisis con vocabulario adecuado, verbos consistentes y conectores de adición o ejemplificación.', weight: 3 },
    { templateId: 'report-revision', title: 'Revisión y versión final', observable: 'Revisa organización, cohesión, puntuación, ortografía y claridad antes de publicar la versión física o digital.', weight: 3 },
  ]
}
