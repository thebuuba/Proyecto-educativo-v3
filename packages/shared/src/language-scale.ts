import {affirmativeLanguageTask} from './language-feature-criteria'
import type {InstrumentRecommendation} from './instrument-recommendation'
import { frenchRequirementText } from './secondary-french-task'

/** The observable is stated once; scale cells express its frequency or degree. */
export function adaptLanguageScale(proposal: InstrumentRecommendation, description: string, language?: 'fr'): InstrumentRecommendation {
  if(proposal.instrumentType!=='escala') return proposal
  const authoredFrenchDegree = language === 'fr' && proposal.criteria.some(criterion => /^fra-[1-6]-/.test(criterion.templateId))
  const english = proposal.criteria.some(criterion => /^(?:ing-[1-6]|opt-hlm-ing-[45])-/.test(criterion.templateId))
  const englishObservation=affirmativeLanguageTask(description).replace(/\badverbios? de frecuencia\b/g,'adverbios')
  const frequency = authoredFrenchDegree
    ? /\b(?:observ\w*|eval\w*|registr\w*|not\w*)\b[^.;]{0,70}\b(?:regularidad|frecuencia|regularite|frequence)\b/.test(frenchRequirementText(description))
    : english?/\b(?:observ\w*|eval\w*|registr\w*|not\w*)\b.{0,70}\b(?:regularidad|frecuencia)\b|\bescala de (?:regularidad|frecuencia)\b/.test(englishObservation)
    : /regularidad|frecuencia/.test(affirmativeLanguageTask(description)) || language === 'fr' && /\b(?:regularite|frequence)\b/.test(frenchRequirementText(description))
  const labels=frequency
    ? ['Siempre','Frecuentemente','A veces','Rara vez','Todavía no']
    : ['Completo','Suficiente','Parcial','Incipiente','Aún no logrado']
  const progression=frequency ? [
    'En todas las oportunidades observadas.',
    'En la mayoría de las oportunidades observadas.',
    'En algunas de las oportunidades observadas.',
    'En pocas oportunidades observadas.',
    'En ninguna de las oportunidades observadas.',
  ] : [
    'Cumple todos los aspectos del indicador.',
    'Cumple lo esencial del indicador; queda un aspecto por completar.',
    'Cumple algunos aspectos del indicador y deja otros sin realizar.',
    'Inicia el desempeño sin completar sus aspectos esenciales.',
    'No demuestra el desempeño descrito en el indicador.',
  ]
  const indexes=proposal.levels.length===4?[0,1,2,4]:[0,1,2,3,4]
  return {...proposal,
    levels:proposal.levels.map((level,index)=>({...level,label:labels[indexes[index]]})),
    criteria:proposal.criteria.map(criterion=>{
      // Degree of a requested revision needs its authored conditional evidence, not inferred edits.
      const selected=!frequency&&(authoredFrenchDegree || /^(?:ing-[1-6]|opt-hlm-ing-[45])-strategy-revision(?:$|:)/.test(criterion.templateId))&&criterion.progressionLevels
        ? criterion.progressionLevels:progression
      return {...criterion,progressionLevels:[...selected],
        descriptors:criterion.descriptors.map((descriptor,index)=>({...descriptor,text:selected[indexes[index]]})),
      }
    }),
  }
}
