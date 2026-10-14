type AuthoredCriterion={templateId:string;title:string;observable:string;weight:number}

export function detectiveStoryCriteria(activityType: string): AuthoredCriterion[] {
  if (activityType === 'DETECTIVE_STORY_ANALYSIS') return [
    { templateId: 'detective-structure', title: 'Estructura y trama del cuento', observable: 'Interpreta inicio, nudo y desenlace, y explica cómo progresa el misterio o conflicto.', weight: 5 },
    { templateId: 'detective-narrator', title: 'Narrador y perspectiva', observable: 'Identifica el narrador y explica su perspectiva a partir de la información del cuento.', weight: 3 },
    { templateId: 'detective-characters', title: 'Análisis de personajes', observable: 'Explica cómo las acciones y motivaciones de los personajes contribuyen al conflicto del cuento.', weight: 3 },
    { templateId: 'detective-setting', title: 'Ambiente de la historia', observable: 'Explica la relación entre el ambiente y los hechos relevantes del cuento.', weight: 2 },
    { templateId: 'detective-clues', title: 'Pistas y comprensión del desenlace', observable: 'Relaciona acciones y pistas del texto con la comprensión del desenlace.', weight: 4 },
    { templateId: 'detective-resources', title: 'Recursos narrativos', observable: 'Explica el efecto de recursos lingüísticos o literarios presentes en el cuento.', weight: 3 },
    { templateId: 'detective-evidence', title: 'Evidencias del cuento', observable: 'Justifica su interpretación con ejemplos concretos del texto leído.', weight: 3 },
  ]
  if (activityType === 'DETECTIVE_STORY_NARRATION') return [
    { templateId: 'detective-sequence', title: 'Secuencia de la narración', observable: 'Narra inicio, nudo y desenlace en un orden comprensible.', weight: 5 },
    { templateId: 'detective-mystery', title: 'Desarrollo del misterio', observable: 'Comunica el conflicto, las acciones y la resolución sin contradicciones.', weight: 5 },
    { templateId: 'detective-voice', title: 'Voces de narrador y personajes', observable: 'Diferencia las intervenciones mediante tono, ritmo y volumen pertinentes.', weight: 4 },
    { templateId: 'detective-language', title: 'Claridad y recursos expresivos', observable: 'Emplea vocabulario descriptivo y conectores que dan cohesión al relato oral.', weight: 3 },
    { templateId: 'detective-individual', title: 'Dominio individual', observable: 'Mantiene la narración y responde preguntas sobre los hechos relatados.', weight: 3 },
  ]
  if (activityType === 'DETECTIVE_STORY_COMPARISON') return [
    { templateId: 'detective-comparison', title: 'Comparación de tramas', observable: 'Establece semejanzas y diferencias entre los misterios y la organización de ambos cuentos.', weight: 5 },
    { templateId: 'detective-characters', title: 'Personajes y ambientes', observable: 'Compara personajes, motivaciones y ambientes con ejemplos de ambos textos.', weight: 4 },
    { templateId: 'detective-resolution', title: 'Resolución del misterio', observable: 'Contrasta cómo las acciones y pistas conducen al desenlace de cada cuento.', weight: 5 },
    { templateId: 'detective-evidence', title: 'Evidencias comparativas', observable: 'Sustenta las semejanzas y diferencias con información de ambos cuentos.', weight: 3 },
    { templateId: 'detective-conclusion', title: 'Conclusión', observable: 'Formula una conclusión coherente con la comparación realizada.', weight: 3 },
  ]
  if (activityType === 'DETECTIVE_STORY_ANALYSIS_PRESENTATION') return [
    { templateId: 'detective-analysis', title: 'Interpretación del cuento', observable: 'Explica la trama, el narrador, los personajes, el ambiente y la resolución del misterio.', weight: 6 },
    { templateId: 'detective-evidence', title: 'Sustento textual', observable: 'Justifica el análisis con acciones, descripciones o pistas del cuento.', weight: 5 },
    { templateId: 'detective-organization', title: 'Organización del análisis oral', observable: 'Presenta las ideas en una secuencia clara y diferencia resumen de interpretación.', weight: 4 },
    { templateId: 'detective-oral', title: 'Claridad de la exposición', observable: 'Expone con dicción, volumen y ritmo comprensibles.', weight: 3 },
    { templateId: 'detective-individual', title: 'Dominio individual', observable: 'Responde preguntas sobre su interpretación del texto.', weight: 2 },
  ]
  return [
    { templateId: 'detective-structure', title: 'Inicio, nudo y desenlace', observable: 'Organiza el cuento con inicio, nudo y desenlace claramente relacionados.', weight: 4 },
    { templateId: 'detective-mystery', title: 'Misterio, pistas y resolución', observable: 'Relaciona las pistas y acciones con un desenlace que explica coherentemente el misterio.', weight: 5 },
    { templateId: 'detective-characters', title: 'Personajes y ambiente', observable: 'Caracteriza a los personajes y construye un ambiente pertinente para la trama detectivesca.', weight: 4 },
    { templateId: 'detective-narrator', title: 'Consistencia del narrador', observable: 'Mantiene un narrador reconocible y una perspectiva consistente durante el cuento.', weight: 3 },
    { templateId: 'detective-revision', title: 'Cohesión y revisión final', observable: 'Usa conectores y recursos expresivos pertinentes, y revisa claridad, puntuación y ortografía.', weight: 4 },
  ]
}
