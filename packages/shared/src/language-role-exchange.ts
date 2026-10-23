import type {ContextualTopicCriterion} from './secondary-topic-criteria'

/** Receives scoped requirements with sentence boundaries, before punctuation is
 * flattened. Role exchange in a resource, an option or a negation is not scored. */
export function requestedRoleExchange(requirements:string):boolean{
 const text=requirements.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
 const action=/\b(?:(?:intercambi\w*|altern\w*|cambi\w*)\s+(?:(?:los|sus|de|ambos)\s+)?(?:roles|papeles)|(?:desempen\w*|asum\w*|realiz\w*)\s+ambos\s+(?:roles|papeles))\b/
 return text.split(/[.;\n]/).some(clause=>{
  const match=action.exec(clause)
  if(!match)return false
  const before=clause.slice(0,match.index),after=clause.slice(match.index+match[0].length)
  if(/\b(?:no|sin|opcional\w*|pueden|podran|podrian|si (?:lo )?(?:desean|quieren))\b/.test(before))return false
  return !/^\s*(?:es|sera|resulta)\s+(?:opcional|voluntario|no obligatorio)\b/.test(after)
 })
}

/** Rotation is assessed separately from the quality of each question/answer. */
export function languageRoleExchangeCriterion(scope:string):ContextualTopicCriterion{
 const progressionLevels:NonNullable<ContextualTopicCriterion['progressionLevels']>=[
  'Desempeña ambos roles del intercambio: realiza las acciones correspondientes a cada papel al alternarlos con su compañero.',
  'Desempeña ambos roles; necesita una indicación para completar las acciones de uno de los papeles.',
  'Completa un rol; el otro queda iniciado sin completar o sin realizar.',
  'Mantiene un solo rol aun después del intercambio previsto.',
  'No aporta evidencia de desempeño de los roles solicitados.',
 ]
 return {templateId:`${scope}-roles`,title:'Desempeño de ambos roles',observable:progressionLevels[0],progressionLevels,weight:2}
}
