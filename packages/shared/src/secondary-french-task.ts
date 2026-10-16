import type { ContextualTopicCriterion } from './secondary-topic-criteria'

export type FrenchMode = 'reading' | 'listening' | 'oral' | 'writing' | 'oral-interaction' | 'written-interaction' | 'unspecified'
export type FrenchAction = { text: string; mode: FrenchMode; features: string[]; alternatives?: FrenchAction[] }
export type FrenchTask = { grade: number; actions: FrenchAction[]; activityType: string; technique: string }
export type FrenchFeature = { id: string; match: RegExp; criterion: (action: FrenchAction) => ContextualTopicCriterion }
export const normalizeFrenchTask = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[’‘]/g, "'")

/** Examples, resource lists and excluded actions are not requests. Apostrophes in French words remain intact. */
export function frenchRequirementText(value: string) {
  return normalizeFrenchTask(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi, '. ').replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ').replace(/[«“"][^»”"]*[»”"]/g, ''))
    .replace(/\b(?:recursos?|ressources|ejemplos?|exemples?)\s*:[^.;\n]*/g, '')
    .replace(/\b(?:no\s+(?:(?:se|deben?|hay que)\s+)?(?:\w+\s+)?|sin\s+)(?:present\w*|escrib\w*|redact\w*|dialog\w*|hag\w*|hagan|evalu\w*|exig\w*|inclu\w*|usar|utiliz\w*)\b[^.;\n]*/g, '')
    .replace(/\b(?:ne\s+(?:\w+\s+){1,3}(?:pas|jamais)|sans\s+(?:ecrire|parler|presenter|dialoguer))\b[^.;\n]*/g, '')
    .replace(/\b(?:como recurso|con apoyo de|a l'aide de)\b[^.;\n]*/g, '')
    .trim()
}

export const frenchReceptive = (mode: FrenchMode) => mode === 'reading' || mode === 'listening'
export const frenchWritten = (mode: FrenchMode) => mode === 'writing' || mode === 'written-interaction'
export const frenchOral = (mode: FrenchMode) => mode === 'oral' || mode === 'oral-interaction'
export const frenchSource = (mode: FrenchMode) => mode === 'listening' ? 'mensaje escuchado' : 'texto leído'
const actionVerb = '(?:lee|lean|leer(?:an)?|lisez|lire|lisent|escuch\\w*|ecoutez|ecouter|ecoutent|escrib\\w*|redact\\w*|ecrivez|ecrire|ecrivent|redigez|rediger|present\\w*|presentez|presenter|presentent|describ\\w*|decrivez|decrire|decrivent|convers\\w*|dialog\\w*|echangez|echanger|echangent|achetez|acheter|achetent|demandez|demander|solicita\\w*|exprimez|exprimer|expresa\\w*)'
const independent = new RegExp(`(?:[.;\\n]\\s*|\\s+(?:y|et|luego|despues|puis|ensuite)\\s+)(?=(?:(?:luego|despues|puis|ensuite)[, ]+)?(?:(?:los estudiantes|cada estudiante|les eleves)\\s+)?${actionVerb}\\b)`, 'g')

function modeOf(text: string): FrenchMode | null {
  if (/\b(?:escuch\w*|ecoutez|ecouter|ecoutent|comprehension (?:auditiva|orale))\b/.test(text)) return 'listening'
  if (/\b(?:lee|lean|leer\w*|lectura|lisez|lire|lisent|comprehension (?:lectora|ecrite))\b/.test(text)) return 'reading'
  if (/\b(?:identifi\w*|releve\w*|reconoc\w*|localiz\w*)\b[^.;]{0,55}\b(?:en (?:el|un) texto|dans (?:le|un) texte)\b/.test(text)) return 'reading'
  const written = /\b(?:escrib\w*|redact\w*|ecri\w*|redige\w*|por escrito|par ecrit)\b/.test(text)
  const interaction = /\b(?:dialog\w*|convers\w*|interactu\w*|intercambi\w*|echange\w*|salud\w*|salue\w*)\b|\b(?:en parejas|par deux|roles|jeu de roles)\b/.test(text)
  if (interaction) return written ? 'written-interaction' : 'oral-interaction'
  if (written) return 'writing'
  if (/\b(?:oral(?:ement|mente)?|present(?:a|an|ar|aran|en|ando)|presente(?:z|r|nt)|expone\w*|expondr\w*|recit\w*|cant\w*|chant\w*|parlez)\b/.test(text)) return 'oral'
  if (new RegExp(`\\b${actionVerb}\\b`).test(text) || /\b(?:identifi\w*|releve\w*|localiz\w*|situe\w*|ubica\w*|indica\w*|indiqu\w*|complete\w*|completa\w*|utiliz\w*|utilise\w*|reconoc\w*|reconnai\w*)\b/.test(text)) return 'unspecified'
  return null
}

export function parseFrenchTask(title: string, description: string, grade: number, features: FrenchFeature[]): FrenchTask | null {
  // A non-empty description governs; an incompatible title cannot add content.
  const text = frenchRequirementText(description.trim() || title)
  if (/\ben (?:ingles|anglais|espanol|espagnol)\b/.test(text) && !/\ben (?:frances|francais)\b/.test(text)) return null
  const featureIds = (part: string) => {
    const content = part.replace(/\b(?:oral(?:ement|mente)?|par ecrit|por escrito|en frances|en francais)\b/g, ' ').replace(/\s+/g, ' ')
    const lexicalTask = /\b(?:escrib\w*|identifi\w*|ecri\w*|releve\w*|lisez|lee|lean)\s+(?:(?:el|un|le|du|des|les)\s+)?(?:vocabulario|lexico|terminos|vocabulaire|lexique|mots)\b/.test(content)
    return features.filter(feature => (!lexicalTask || /^(?:lexicon|grammar)-/.test(feature.id)) && feature.match.test(content)).map(feature => feature.id)
  }
  const single = (part: string): FrenchAction | null => {
    const mode = modeOf(part), ids = featureIds(part)
    return mode && ids.length ? { text: part, mode, features: ids } : null
  }
  const actions: FrenchAction[] = []
  for (const part of text.split(independent).filter(Boolean)) {
    const modalBoth = /\b(?:oral(?:ement|mente)?\s+(?:y|et)\s+(?:por escrito|par ecrit)|(?:por escrito|par ecrit)\s+(?:y|et)\s+oral(?:ement|mente)?)\b/
    if (modalBoth.test(part)) {
      for (const mode of ['oralement', 'par ecrit']) {
        const action = single(part.replace(modalBoth, mode))
        if (action) actions.push(action)
      }
      continue
    }
    const modalChoice = /\b(?:oral(?:ement|mente)?\s+(?:o|ou)\s+(?:por escrito|par ecrit)|(?:por escrito|par ecrit)\s+(?:o|ou)\s+oral(?:ement|mente)?)\b/
    const alternativeParts = modalChoice.test(part)
      ? [part.replace(modalChoice, 'oralement'), part.replace(modalChoice, 'par ecrit')]
      : part.split(new RegExp(`\\s+(?:o|ou)\\s+(?=${actionVerb}\\b)`))
    if (alternativeParts.length > 1) {
      const alternatives = alternativeParts.map(p => single(p) ?? (modeOf(p) && featureIds(part).length ? { text: part, mode: modeOf(p)!, features: featureIds(part) } : null)).filter((a): a is FrenchAction => a !== null)
      // Never turn an unrecognized alternative into two mandatory products.
      if (alternatives.length === alternativeParts.length) actions.push({ text: part, mode: 'unspecified', features: [], alternatives })
    } else {
      const action = single(part)
      if (action) actions.push(action)
    }
  }
  if (!actions.length) return null
  const primary = actions.filter(action => !frenchReceptive(action.mode)).at(-1) ?? actions.at(-1)!
  const activities: Record<FrenchMode, string> = { reading: 'READING_COMPREHENSION', listening: 'LISTENING_COMPREHENSION', oral: 'ORAL_PRESENTATION', writing: 'WRITTEN_PRODUCTION', 'oral-interaction': 'ORAL_INTERACTION', 'written-interaction': 'WRITTEN_PRODUCTION', unspecified: 'OTHER' }
  return { grade, actions, activityType: activities[primary.mode], technique: frenchReceptive(primary.mode) || frenchWritten(primary.mode) ? 'analisis-producciones' : primary.mode.includes('interaction') ? 'observacion-directa' : primary.mode === 'oral' ? 'presentacion' : 'observacion-sistematica' }
}
