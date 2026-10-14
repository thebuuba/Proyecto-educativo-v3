import { normalizedTask } from '../../secondary-language-topics'
type AuthoredCriterion = { templateId: string; title: string; observable: string; weight: number }

function requestedPlaceCount(text: string) {
  const match = text.match(/\b(\d+|dos|tres|cuatro|cinco)\s+lugares?\b/)
  return match?.[1] ?? null
}

export function rawFirstGradeGuideCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const text = normalizedTask(description)
  const count = requestedPlaceCount(text)
  const placeScope = count ? `${count} lugares solicitados` : 'los lugares seleccionados'
  const graphicsRequested = /imagen|foto|mapa|grafico|dibujo|collage|recurso visual/.test(text)
  if (activityType === 'TOURIST_GUIDE_ANALYSIS') return [
    { templateId: 'guide-purpose', title: 'Propósito y destinatario de la guía', observable: 'Explica cómo la guía orienta e informa a sus posibles visitantes.', weight: 4 },
    { templateId: 'guide-structure', title: 'Identificación de la estructura', observable: 'Identifica portada, información, imágenes y cierre, según estén presentes en la guía leída.', weight: 5 },
    { templateId: 'guide-resources', title: 'Recursos para orientar al visitante', observable: 'Analiza cómo el vocabulario descriptivo y persuasivo, las marcas paratextuales y los recursos gráficos disponibles orientan al visitante.', weight: 5 },
    { templateId: 'guide-interpretation', title: 'Interpretación de la información', observable: 'Reconstruye el sentido global y explica la información relevante sobre los lugares descritos.', weight: 4 },
    { templateId: 'guide-evidence', title: 'Justificación con evidencias', observable: 'Sustenta sus respuestas con datos y ejemplos concretos de la guía analizada.', weight: 2 },
  ]
  if (activityType === 'TOURIST_GUIDE_PRESENTATION') return [
    { templateId: 'guide-content', title: `Información de ${placeScope}`, observable: `Presenta información pertinente y veraz sobre ${placeScope}.`, weight: 5 },
    { templateId: 'guide-purpose', title: 'Orientación al visitante', observable: 'Describe los atractivos y cualidades de los lugares con vocabulario adecuado al público.', weight: 4 },
    { templateId: 'guide-organization', title: 'Organización de la presentación', observable: 'Ordena la información de la guía en una secuencia clara y fácil de seguir.', weight: 4 },
    { templateId: 'guide-oral', title: 'Claridad de la comunicación oral', observable: 'Expone con dicción, volumen, ritmo y entonación comprensibles.', weight: 4 },
    { templateId: 'guide-individual', title: 'Dominio individual', observable: 'Explica los lugares asignados y responde preguntas desde su propio dominio del contenido.', weight: 3 },
  ]
  if (activityType === 'TOURIST_GUIDE_COMPARISON') return [
    { templateId: 'guide-purpose', title: 'Propósito y destinatario', observable: 'Compara el propósito y el público al que se dirige cada guía turística.', weight: 4 },
    { templateId: 'guide-comparison', title: 'Comparación del contenido', observable: 'Establece semejanzas y diferencias entre la información y los atractivos presentados.', weight: 5 },
    { templateId: 'guide-structure', title: 'Comparación de la estructura', observable: 'Contrasta la organización de portada, información, imágenes y cierre en las guías.', weight: 4 },
    { templateId: 'guide-resources', title: 'Comparación de recursos', observable: 'Analiza el vocabulario y los recursos gráficos o paratextuales empleados para orientar y persuadir.', weight: 4 },
    { templateId: 'guide-conclusion', title: 'Conclusión sustentada', observable: 'Formula una conclusión apoyada en evidencias concretas de ambas guías.', weight: 3 },
  ]
  return [
    { templateId: 'guide-content', title: `Información de ${placeScope}`, observable: `Incluye información pertinente y veraz sobre ${placeScope}, destacando sus características y atractivos.`, weight: 5 },
    { templateId: 'guide-structure', title: 'Estructura de la guía turística', observable: `Organiza la guía con portada, información y cierre${graphicsRequested ? ', e integra las imágenes solicitadas' : ''}.`, weight: 5 },
    { templateId: 'guide-description', title: 'Descripción y orientación al visitante', observable: 'Describe los lugares con sustantivos propios, adjetivos y verbos en presente, usando vocabulario atractivo adecuado al público.', weight: 4 },
    { templateId: 'guide-organization', title: 'Organización y claridad', observable: 'Distribuye la información en una secuencia comprensible y relaciona el contenido con el propósito de orientar al visitante.', weight: 3 },
    { templateId: 'guide-revision', title: 'Revisión de la versión final', observable: 'Revisa la claridad, la puntuación, la ortografía y la presentación antes de publicar la guía física o digital.', weight: 3 },
  ]
}
