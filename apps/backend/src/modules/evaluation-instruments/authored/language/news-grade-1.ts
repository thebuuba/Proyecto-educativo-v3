import { normalize } from '../../curriculum-context'
import type { AuthoredCriterion } from './types'

export function newsCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const text = normalize(description)
  if (activityType === 'NEWSCAST' || /noticiero|present(?:ar|aran).*noticia/.test(text)) return [
    { templateId: 'news-content', title: 'Información periodística', observable: 'Presenta hechos relevantes y verificables, distinguiendo la información principal de los detalles.', weight: 5 },
    { templateId: 'news-structure', title: 'Estructura y preguntas de la noticia', observable: 'Comunica un titular y desarrolla qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.', weight: 5 },
    { templateId: 'news-sequence', title: 'Organización del noticiero', observable: 'Ordena las noticias y enlaza las intervenciones con una secuencia clara para la audiencia.', weight: 3 },
    { templateId: 'news-oral', title: 'Claridad de la comunicación oral', observable: 'Expone con dicción, ritmo, entonación y volumen comprensibles.', weight: 4 },
    { templateId: 'news-individual', title: 'Dominio individual de la noticia asignada', observable: 'Explica su noticia con seguridad y responde por su propio desempeño dentro de la presentación del equipo.', weight: 3 },
  ]
  if (activityType === 'NEWS_ANALYSIS' || /leer|analiz|identific/.test(text)) return [
    { templateId: 'news-purpose', title: 'Identificación de la función de la noticia', observable: 'Reconoce el propósito informativo y el hecho que convierte el texto en noticia.', weight: 4 },
    { templateId: 'news-structure', title: 'Identificación de sus partes', observable: 'Identifica titular, entrada o copete y cuerpo en la noticia analizada.', weight: 5 },
    { templateId: 'news-questions', title: 'Interrogantes fundamentales', observable: 'Localiza qué ocurrió, a quién, dónde, cuándo y cómo ocurrió a partir de la información del texto.', weight: 5 },
    { templateId: 'news-interpretation', title: 'Interpretación de la información', observable: 'Explica la información principal y establece inferencias sustentadas en la noticia.', weight: 4 },
    { templateId: 'news-evidence', title: 'Justificación con evidencias', observable: 'Sustenta sus respuestas con datos o fragmentos pertinentes de la noticia.', weight: 2 },
  ]
  if (activityType === 'NEWS_COMPARISON' || /compar/.test(text)) return [
    { templateId: 'news-purpose', title: 'Propósito y hecho noticioso', observable: 'Identifica el propósito y el hecho principal de cada noticia.', weight: 4 },
    { templateId: 'news-comparison', title: 'Comparación de la información', observable: 'Establece semejanzas y diferencias entre los datos, enfoques y organización de las noticias.', weight: 5 },
    { templateId: 'news-structure', title: 'Comparación de la estructura', observable: 'Contrasta el uso del titular, la entrada y el cuerpo en cada texto.', weight: 4 },
    { templateId: 'news-evidence', title: 'Uso de evidencias', observable: 'Sustenta la comparación con información concreta de ambas noticias.', weight: 4 },
    { templateId: 'news-conclusion', title: 'Conclusión de la comparación', observable: 'Formula una conclusión coherente con las semejanzas y diferencias encontradas.', weight: 3 },
  ]
  if (activityType === 'DEBATE' || /debat/.test(text)) return [
    { templateId: 'news-comprehension', title: 'Comprensión del hecho noticioso', observable: 'Explica el hecho debatido y diferencia datos informativos de opiniones.', weight: 5 },
    { templateId: 'news-evidence', title: 'Argumentos sustentados', observable: 'Defiende su postura con datos pertinentes de la noticia.', weight: 5 },
    { templateId: 'news-counterargument', title: 'Respuesta a otras posturas', observable: 'Escucha y responde a argumentos contrarios sin apartarse del tema.', weight: 4 },
    { templateId: 'news-oral', title: 'Claridad de la intervención', observable: 'Comunica sus ideas con orden, precisión y un tono adecuado.', weight: 3 },
    { templateId: 'news-participation', title: 'Participación en el debate', observable: 'Respeta los turnos y las reglas acordadas para el intercambio.', weight: 3 },
  ]
  return [
    { templateId: 'news-essential', title: 'Información esencial de la noticia', observable: 'Redacta un hecho noticioso claro y responde qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.', weight: 5 },
    { templateId: 'news-structure', title: 'Titular, entrada y cuerpo', observable: 'Organiza la noticia con un titular pertinente, una entrada informativa y un cuerpo que desarrolla los datos.', weight: 5 },
    { templateId: 'news-sequence', title: 'Secuencia y cohesión', observable: 'Ordena la información y utiliza conectores de orden y temporales para relacionar las ideas.', weight: 4 },
    { templateId: 'news-language', title: 'Lenguaje periodístico', observable: 'Emplea un registro formal, vocabulario preciso y formas verbales adecuadas al hecho narrado.', weight: 3 },
    { templateId: 'news-revision', title: 'Revisión de la versión escrita', observable: 'Revisa puntuación, ortografía y claridad antes de presentar la versión final.', weight: 3 },
  ]
}
