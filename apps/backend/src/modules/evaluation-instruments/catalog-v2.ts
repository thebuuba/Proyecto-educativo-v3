import { evaluationCatalogV1, type CriterionTemplate, type EvaluationCatalog } from './catalog-v1'

const productCriteria: CriterionTemplate[] = [
  { id: 'oral-mastery', title: 'Dominio del tema', observable: 'Explica el tema con autonomía, sin depender de la lectura del material de apoyo.', simple: 'Explica el tema con sus propias palabras.', area: '*', families: ['ORAL'], evidence: ['PERFORMANCE', 'KNOWLEDGE'], purpose: 'Valorar dominio oral', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['dominio', 'sin leer', 'propias palabras'], weight: 4 },
  { id: 'oral-resources', title: 'Uso de recursos de apoyo', observable: 'Utiliza los recursos solicitados para aclarar y apoyar la explicación.', simple: 'Usa sus recursos para ayudar a comprender.', area: '*', families: ['ORAL'], evidence: ['PERFORMANCE', 'PRODUCT'], purpose: 'Valorar recursos de apoyo', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['recursos', 'imagenes', 'cartel', 'diapositivas', 'modelo'], weight: 3, requires: ['recursos', 'imagenes', 'cartel', 'diapositivas', 'modelo'] },
  { id: 'oral-responses', title: 'Respuestas a preguntas', observable: 'Responde las preguntas con información pertinente y coherente con lo expuesto.', simple: 'Responde preguntas sobre lo que explicó.', area: '*', families: ['ORAL'], evidence: ['PERFORMANCE', 'KNOWLEDGE'], purpose: 'Valorar respuestas', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['preguntas', 'respuestas'], weight: 2, requires: ['preguntas', 'responder', 'respuestas'] },
  { id: 'debate-evidence', title: 'Uso de evidencias', observable: 'Sustenta sus argumentos con datos, ejemplos o fuentes pertinentes.', simple: 'Apoya sus ideas con ejemplos o información.', area: '*', families: ['ORAL'], evidence: ['PERFORMANCE', 'KNOWLEDGE'], purpose: 'Valorar evidencia argumentativa', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['evidencia', 'datos', 'fuentes', 'ejemplos'], weight: 4 },
  { id: 'debate-response', title: 'Respuesta a posturas', observable: 'Escucha, contrasta y responde a las posturas presentadas sin desviar el argumento.', simple: 'Escucha y responde a las ideas de otros.', area: '*', families: ['ORAL'], evidence: ['PERFORMANCE'], purpose: 'Valorar interacción argumentativa', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['posturas', 'refutar', 'responder', 'debate'], weight: 4 },
  { id: 'concept-hierarchy', title: 'Jerarquía conceptual', observable: 'Organiza los conceptos desde los más generales hasta los específicos.', simple: 'Ordena las ideas principales y sus detalles.', area: '*', families: ['WRITTEN'], evidence: ['PRODUCT', 'KNOWLEDGE'], purpose: 'Valorar jerarquía conceptual', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['jerarquia', 'conceptos', 'mapa conceptual'], weight: 4 },
  { id: 'concept-relations', title: 'Relaciones y palabras enlace', observable: 'Conecta los conceptos mediante relaciones correctas y palabras enlace significativas.', simple: 'Une las ideas con palabras que explican su relación.', area: '*', families: ['WRITTEN'], evidence: ['PRODUCT', 'KNOWLEDGE'], purpose: 'Valorar relaciones conceptuales', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['relaciones', 'conectores', 'palabras enlace', 'mapa conceptual'], weight: 5 },
  { id: 'project-product', title: 'Producto final', observable: 'El producto responde al propósito y a los requisitos explícitos de la actividad.', simple: 'Entrega el producto solicitado con sus partes.', area: '*', families: ['PROJECT_BASED'], evidence: ['PRODUCT'], purpose: 'Valorar producto', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['producto', 'proyecto', 'modelo', 'cartel'], weight: 5 },
  { id: 'project-process', title: 'Proceso de elaboración', observable: 'Documenta y justifica las decisiones tomadas durante la elaboración.', simple: 'Muestra cómo realizó su trabajo.', area: '*', families: ['PROJECT_BASED'], evidence: ['PERFORMANCE', 'PRODUCT'], purpose: 'Valorar proceso', bands: ['PRIMARY_FIRST', 'PRIMARY_SECOND', 'SECONDARY'], keywords: ['proceso', 'etapas', 'evidencia'], weight: 4 },
]

/** New immutable authored release. V1 remains available for historical snapshots. */
export const evaluationCatalogV2: EvaluationCatalog = {
  ...evaluationCatalogV1,
  version: 'evaluation-2026.2',
  activityTypes: evaluationCatalogV1.activityTypes.map((entry) => ({
    ...entry,
    triggers: entry.id === 'WRITTEN_PRODUCTION' ? [...entry.triggers, 'trabajo escrito', 'redactar']
      : entry.id === 'PROJECT' ? [...entry.triggers, 'cartel', 'modelo']
        : entry.id === 'CONCEPT_MAP' ? [...entry.triggers, 'esquema conceptual']
          : entry.triggers,
  })),
  criterionTemplates: [...evaluationCatalogV1.criterionTemplates, ...productCriteria],
}
