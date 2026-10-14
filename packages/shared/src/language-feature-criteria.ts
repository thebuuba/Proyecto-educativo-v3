import {normalizedTask} from './evaluation-task-text'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export type LanguageFeature = {
  id: string
  match: string
  name: string
  function: string
  error: string
  terms?: [string, string][]
}

export const affirmativeLanguageTask = (description: string) => normalizedTask(description
  .normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  .replace(/\b(?:sin|no se (?:pide|requiere)|no es necesario)\b[^.;]*/g, ''))

/** Explicit linguistic requirements, independent of the title and delivered document's name. */
export function requestedLanguageFeatures(features: LanguageFeature[], description: string) {
  const task = affirmativeLanguageTask(description)
  return features.filter(feature => new RegExp(feature.match).test(task)).map(feature => {
    const selected = feature.terms?.filter(([pattern]) => new RegExp(pattern).test(task)).map(([,term]) => term)
    return {...feature, name: selected?.length ? selected.length===1 ? selected[0] : selected.slice(0,-1).join(', ')+' y '+selected.at(-1) : feature.name}
  })
}

export function languageFeatureCriterion(feature: LanguageFeature, scope: string, genre: string, mode: 'analysis'|'comparison'|'production'|'oral-production'|'recitation'): ContextualTopicCriterion {
  const target = feature.name
  const ofTarget = target.startsWith('el ') ? `del ${target.slice(3)}` : `de ${target}`
  const purpose = feature.function
  const source = mode==='oral-production' ? `la producción oral de ${genre}` : `el texto de ${genre}`
  const progressionLevels: ContextualTopicCriterion['progressionLevels'] = mode === 'comparison' ? [
    `Contrasta ${target} en los textos comparados y sustenta sus semejanzas o diferencias por su función para ${purpose}.`,
    `Localiza ${target} en los textos y establece un contraste sustentado, aunque deja sin explicar una relación con su función.`,
    `Enumera ejemplos de ${target} de los textos, pero no establece la semejanza o diferencia entre sus usos.`,
    `El contraste se basa en una atribución incorrecta: ${feature.error}.`,
    `No aporta ejemplos de los textos que permitan contrastar ${target}.`,
  ] : mode === 'production' || mode === 'oral-production' ? [
    `Emplea ${target} en ${source} para ${purpose}, sin alterar el sentido de las ideas.`,
    `Emplea ${target} con la función solicitada; un uso aislado deja ambigua una relación entre ideas.`,
    `Incluye ${target}, pero varios usos no contribuyen a ${purpose}.`,
    `El uso ${ofTarget} altera el sentido del texto: ${feature.error}.`,
    `No incorpora evidencia del uso solicitado ${ofTarget} en su texto.`,
  ] : mode === 'recitation' ? [
    `Hace perceptible ${target} en la recitación mediante pausas o énfasis vinculados con su función para ${purpose}.`,
    `El énfasis permite reconocer ${target}; una pausa dificulta percibir su relación con el sentido del verso.`,
    `Recita las palabras correspondientes a ${target}, pero el énfasis no permite percibir su efecto.`,
    `La expresión altera la relación que establece ${target} entre las palabras recitadas.`,
    `No hay evidencia de la expresión solicitada ${ofTarget} en la recitación.`,
  ] : [
    `Identifica ${target} en ${source} y explica, con ejemplos presentes, su función para ${purpose}.`,
    `Localiza y caracteriza ${target} con ejemplos del texto; deja sin explicar una relación con su función.`,
    `Señala ejemplos de ${target}, pero no explica cómo contribuyen a ${purpose}.`,
    `La explicación se apoya en una identificación incorrecta: ${feature.error}.`,
    `No localiza ejemplos pertinentes ni explica la función ${ofTarget} en el texto disponible.`,
  ]
  return {templateId:`${scope}-feature-${feature.id}`,title:target.charAt(0).toUpperCase()+target.slice(1),observable:progressionLevels[0],weight:3,progressionLevels}
}

export function explicitWritingProcess(description: string, scope: string, genre: string): ContextualTopicCriterion[] {
  const task = affirmativeLanguageTask(description)
  const rows: ContextualTopicCriterion[] = []
  if (/\bborradores?\b|\brevis(?:ar|aran|en|ion)\b|\bcorreg\w*/.test(task)) rows.push({
    templateId:`${scope}-process-revision`,title:'Revisión del borrador',weight:2,
    observable:`Muestra cambios entre el borrador y la versión revisada de ${genre} que resuelven problemas de contenido, organización o escritura encontrados.`,
    progressionLevels:[
      `Los cambios del borrador de ${genre} resuelven los problemas identificados y conservan el sentido que se desea comunicar.`,
      'Los cambios resuelven los problemas principales; queda una relación entre ideas sin corregir.',
      'Presenta cambios de forma, pero conserva problemas de contenido u organización identificados en el borrador.',
      'Los cambios introducen contradicciones o eliminan información necesaria para comprender el texto.',
      'No aporta evidencia de los cambios solicitados entre el borrador y la versión revisada.',
    ],
  })
  if (/\bpublic(?:ar|aran|acion|an|a)\b|\bdifund\w*/.test(task)) rows.push({
    templateId:`${scope}-process-publication`,title:'Publicación para el destinatario',weight:2,
    observable:`Dispone la versión final de ${genre} en el medio solicitado, con texto legible y una organización accesible al destinatario.`,
    progressionLevels:[
      'La versión publicada puede localizarse y leerse en el medio solicitado, con sus partes ordenadas para el destinatario.',
      'La versión puede consultarse en el medio solicitado; una parte de su presentación dificulta la lectura.',
      'La versión se ha dispuesto en el medio, pero faltan partes necesarias para comprenderla.',
      'El contenido publicado difiere de la versión final y cambia su sentido o destinatario.',
      'No hay evidencia de la publicación solicitada.',
    ],
  })
  return rows
}
