import { normalize } from '../../curriculum-context'
import type { AuthoredCriterion } from './types'

function posterTopic(title: string, description: string) {
  const text = normalize(`${title} ${description}`)
  if (/agua/.test(text)) return 'el cuidado y ahorro del agua'
  if (/convivencia escolar/.test(text)) return 'la convivencia escolar'
  if (/cuidado del entorno|cuidar el entorno/.test(text)) return 'el cuidado del entorno'
  const about = text.match(/afiche (?:sobre|para promover|para prevenir) ([^,.;]+)/)?.[1]
  return about?.trim() || 'el tema indicado'
}

export function posterCriteria(activityType: string, title: string, description: string): AuthoredCriterion[] {
  const text = normalize(description)
  const topic = posterTopic(title, description)
  const visualsRequested = /imagen|imagenes|elementos visuales|forma|color|tipo de letra/.test(text)
  if (activityType === 'POSTER_ANALYSIS') return [
    { templateId: 'poster-purpose', title: 'Propósito y destinatarios del afiche', observable: `Interpreta la intención comunicativa del afiche sobre ${topic} e identifica a quién se dirige.`, weight: 4 },
    { templateId: 'poster-message', title: 'Interpretación del mensaje', observable: `Explica el mensaje principal sobre ${topic} y realiza inferencias coherentes a partir del afiche.`, weight: 5 },
    { templateId: 'poster-persuasion', title: 'Recursos para convencer', observable: 'Identifica y explica cómo las palabras clave, los argumentos y los recursos persuasivos buscan atraer, motivar o convencer.', weight: 5 },
    { templateId: 'poster-visuals', title: 'Relación entre texto y elementos visuales', observable: 'Analiza cómo imágenes, letras, colores y distribución espacial contribuyen al mensaje.', weight: 4 },
    { templateId: 'poster-evidence', title: 'Evidencias del afiche', observable: 'Justifica su interpretación con palabras, frases o elementos visuales concretos del afiche leído.', weight: 2 },
  ]
  if (activityType === 'POSTER_COMPARISON') return [
    { templateId: 'poster-purpose', title: 'Propósito y destinatarios', observable: `Compara el propósito y el público de los dos afiches sobre ${topic}.`, weight: 4 },
    { templateId: 'poster-comparison', title: 'Comparación de mensajes y argumentos', observable: 'Establece semejanzas y diferencias entre los mensajes, argumentos y recursos persuasivos.', weight: 5 },
    { templateId: 'poster-visuals', title: 'Comparación de recursos visuales', observable: 'Contrasta la relación entre texto, imágenes, letras, colores y organización en ambos afiches.', weight: 4 },
    { templateId: 'poster-effectiveness', title: 'Eficacia comunicativa', observable: 'Valora cuál afiche comunica mejor su mensaje considerando claridad, público y capacidad de convencer.', weight: 4 },
    { templateId: 'poster-evidence', title: 'Justificación con evidencias', observable: 'Sustenta su valoración con elementos concretos de ambos afiches.', weight: 3 },
  ]
  if (activityType === 'POSTER_PRESENTATION') return [
    { templateId: 'poster-message', title: `Mensaje sobre ${topic}`, observable: `Explica con precisión el mensaje que comunica su afiche sobre ${topic}.`, weight: 5 },
    { templateId: 'poster-audience', title: 'Propósito y público destinatario', observable: 'Explica a quién se dirige el afiche y cómo busca motivar, orientar o convencer a ese público.', weight: 4 },
    { templateId: 'poster-decisions', title: 'Justificación de decisiones comunicativas', observable: 'Justifica la elección de palabras, argumentos y elementos visuales en relación con el propósito.', weight: 4 },
    { templateId: 'poster-oral', title: 'Claridad de la presentación oral', observable: 'Presenta sus ideas con orden, dicción, volumen y ritmo comprensibles.', weight: 4 },
    { templateId: 'poster-individual', title: 'Dominio individual', observable: 'Responde preguntas sobre el contenido y las decisiones de su propio afiche.', weight: 3 },
  ]
  return [
    { templateId: 'poster-message', title: `Mensaje sobre ${topic}`, observable: `Comunica acciones o ideas pertinentes sobre ${topic} mediante un mensaje breve, claro y persuasivo.`, weight: 5 },
    { templateId: 'poster-audience', title: 'Adecuación al público destinatario', observable: 'Adapta el vocabulario, el tono y el llamado a la acción a la comunidad o público indicado.', weight: 4 },
    { templateId: 'poster-persuasion', title: 'Argumentos y recursos persuasivos', observable: 'Usa recomendaciones, argumentos o expresiones persuasivas pertinentes, sin inventar datos.', weight: 4 },
    { templateId: 'poster-visuals', title: 'Relación entre texto y elementos visuales', observable: visualsRequested ? 'Integra las imágenes solicitadas con el texto para reforzar el mensaje sin dificultar su lectura.' : 'Organiza el texto y los elementos visuales elegidos para reforzar el mensaje sin imponer un recurso específico.', weight: 4 },
    { templateId: 'poster-legibility', title: 'Organización, legibilidad y corrección', observable: 'Presenta la información con jerarquía visual, lectura clara, ortografía cuidada y contenido pertinente.', weight: 3 },
  ]
}
