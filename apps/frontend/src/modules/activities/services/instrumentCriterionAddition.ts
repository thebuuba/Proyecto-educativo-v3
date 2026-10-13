import type { InstrumentRecommendation, RecommendationCriterion } from '@aula/shared'
import { INSTRUMENT_MAX_CRITERIA, INSTRUMENT_MIN_LEVELS, INSTRUMENT_MAX_LEVELS } from '@aula/shared'
import { distributeUnits, scoreInstrumentFields, scoreRecommendation } from './instrumentScoring'

type InstrumentType = InstrumentRecommendation['instrumentType']

function authoredProgression(criterion: RecommendationCriterion | null) {
  const authored = criterion?.progressionLevels
  if (!authored || authored.length !== 5 || authored.some(text=>typeof text !== 'string' || !text.trim())) return undefined
  const descriptors = criterion?.descriptors ?? []
  const indexes = descriptors.length === 4 ? [0,1,2,4] : [0,1,2,3,4]
  return descriptors.length === 0 || descriptors.length <= 5 && descriptors.every((item,index)=>item.text === authored[indexes[index]]) ? authored : undefined
}

function descriptorTexts(criterion: RecommendationCriterion | null, count: number) {
  const authored = authoredProgression(criterion)
  const source = authored ?? criterion?.descriptors.map(item=>item.text) ?? []
  if (count > source.length) return Array<string>(count).fill('')
  const indexes = authored === source && count === 4 ? [0,1,2,4]
    : Array.from({length:count},(_,index)=>Math.round(index*(source.length-1)/(count-1)))
  return indexes.map(index=>source[index])
}

function words(value: string) {
  return new Set(value.toLocaleLowerCase('es-DO').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/).filter(word => word.length > 3 && !['para', 'sobre', 'entre', 'texto', 'criterio'].includes(word)))
}

function equivalent(left: string, right: string) {
  const a = words(left); const b = words(right)
  if (!a.size || !b.size) return false
  const shared = [...a].filter(word => b.has(word)).length
  return shared / Math.min(a.size, b.size) >= 0.75
}

export function nextCatalogCriterion(candidates: RecommendationCriterion[], fields: Record<string, string>,
  type: InstrumentType, used: RecommendationCriterion[] = []): RecommendationCriterion | null {
  const count = Number(fields[`${type}:meta:criteriaCount`]) || 0
  const identities = Array.from({length:count},(_,index)=>fields[`${type}:criterion-id:${index}`]).filter(Boolean)
  const activeUsed = identities.length ? used.filter(item=>identities.includes(item.id)) : used
  const titles = Array.from({ length: count }, (_, index) => fields[`${type}:criterion:${index}`] || '')
  const descriptions = Array.from({ length: count }, (_, index) => fields[`${type}:description:${index}`]
    || fields[`${type}:indicator:${index}`] || '')
  return candidates.find(candidate => candidate.title.trim() && candidate.description.trim()
    && !activeUsed.some(item => item.templateId === candidate.templateId)
    && !Array.from({length:count},(_,index)=>fields[`${type}:criterion-template:${index}`]).includes(candidate.templateId)
    && !titles.some(title => equivalent(title, candidate.title))
    && !descriptions.some(description => equivalent(description, candidate.description))) ?? null
}

export function appendInstrumentCriterion(fields: Record<string, string>, type: InstrumentType, score: number | null,
  proposal: InstrumentRecommendation | undefined, criterion: RecommendationCriterion | null) {
  const count = Number(fields[`${type}:meta:criteriaCount`]) || 0
  if (!Number.isInteger(count) || count < 0 || count >= INSTRUMENT_MAX_CRITERIA) throw new RangeError('El instrumento admite hasta 20 criterios.')
  const existingIds = new Set(Object.entries(fields).filter(([key]) => key.startsWith(`${type}:criterion-id:`)).map(([, value]) => value))
  const identity = criterion && !existingIds.has(criterion.id) ? criterion.id : `manual:${crypto.randomUUID()}`
  const next: Record<string, string> = { ...fields, [`${type}:meta:criteriaCount`]: String(count + 1),
    [`${type}:criterion-id:${count}`]: identity,
    [`${type}:criterion-template:${count}`]: criterion?.templateId ?? 'manual',
    [`${type}:criterion:${count}`]: criterion?.title ?? '',
    [`${type}:description:${count}`]: criterion?.description ?? '' }
  if (criterion && authoredProgression(criterion)) next[`${type}:criterion-evidence:${count}`] = JSON.stringify({title:criterion.title,description:criterion.description,progression:authoredProgression(criterion)})
  if (criterion?.relativeWeight) next[`${type}:criterion-weight:${count}`] = String(criterion.relativeWeight)
  if (type === 'lista-ponderada') next[`${type}:indicator:${count}`] = criterion?.description ?? ''
  if (type === 'rubrica' || type === 'escala' && criterion?.descriptors.length) {
    const levels = Number(fields[`${type}:meta:levelCount`] ?? 4)
    if (!Number.isInteger(levels) || levels < INSTRUMENT_MIN_LEVELS || levels > INSTRUMENT_MAX_LEVELS) throw new RangeError('La rúbrica admite entre 2 y 6 niveles.')
    const texts = descriptorTexts(criterion,levels)
    for (let index = 0; index < levels; index++) {
      next[`${type}:descriptor:${count}:${levels - index}`] = texts[index] ?? ''
    }
  }
  const previous: number[] = (() => {
    try {
      const parsed: unknown = JSON.parse(fields[`${type}:meta:scoreWeights`] || '[]')
      return Array.isArray(parsed) && parsed.every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0) ? parsed : []
    } catch { return [] }
  })()
  const basis = previous.length === count ? previous : Array.from({ length: count }, (_, index) => fields[`${type}:points:${index}`] === undefined ? 1 : Number(fields[`${type}:points:${index}`]))
  const addedWeight = (weights:number[]) => {
    const anchor = weights.findIndex((weight,index)=>weight > 0 && Number(fields[`${type}:criterion-weight:${index}`]) > 0)
    if (anchor >= 0 && criterion?.relativeWeight) return weights[anchor] * criterion.relativeWeight / Number(fields[`${type}:criterion-weight:${anchor}`])
    return weights.reduce((a,b)=>a+b,0) / Math.max(1,count) || 1
  }
  next[`${type}:meta:scoreWeights`] = JSON.stringify([...basis, addedWeight(basis)])
  if (type === 'lista-ponderada') {
    const oldWeights = Array.from({ length: count }, (_, index) => {
      const raw = fields[`${type}:weight:${index}`]
      const value = Number(raw)
      return raw !== undefined && raw.trim() !== '' && Number.isFinite(value) && value >= 0 ? value : 1
    })
    const units = distributeUnits(10000, [...oldWeights, addedWeight(oldWeights)])
    units.forEach((value, index) => { next[`${type}:weight:${index}`] = String(value / 100) })
  }
  const prepared = proposal ? { ...proposal, criteria: [...proposal.criteria, criterion ? { ...criterion, id: identity } : {
    id: identity, templateId: 'manual', title: '', description: '', maxScore: 0, maxScoreUnits: 0,
    sourceType: 'TEACHER_REUSED' as const, sourceReferences: [], descriptors: [],
  }] } : undefined
  const scored = scoreInstrumentFields(next, type, score, prepared)
  return { fields: scored, recommendation: prepared ? scoreRecommendation(prepared, scored, score) : undefined }
}

/** Manual intent is authoritative; identity cannot overwrite a different objective. */
export function matchingCatalogCriterion(candidates: RecommendationCriterion[], fields: Record<string,string>,
  type: InstrumentType, row: number, used: RecommendationCriterion[] = []): RecommendationCriterion | null {
  const title = fields[`${type}:criterion:${row}`]?.trim() ?? ''
  const description = (fields[`${type}:indicator:${row}`] || fields[`${type}:description:${row}`])?.trim() ?? ''
  const id = fields[`${type}:criterion-id:${row}`]
  const prior = used.find(item=>item.id === id)
  const template = fields[`${type}:criterion-template:${row}`] || prior?.templateId
  const other = {...fields}
  for(const part of ['criterion','description','indicator','criterion-template']) other[`${type}:${part}:${row}`]=''
  const usedElsewhere = used.filter(item=>item.id !== id)
  if (!title && !description) return nextCatalogCriterion(candidates,other,type,usedElsewhere)
  const matches = candidates.filter(candidate=>
    (!title || title === candidate.title || equivalent(title,candidate.title) || equivalent(title,candidate.description)) &&
    (!description || description === candidate.description || equivalent(description,candidate.description)))
  const exact = matches.find(candidate=>candidate.templateId === template)
  if (exact) return exact
  const eligible = matches.filter(candidate=>nextCatalogCriterion([candidate],other,type,usedElsewhere))
  return eligible.length === 1 ? eligible[0] : null
}

export function completeInstrumentCriterion(fields: Record<string,string>, type: InstrumentType, row: number,
  candidate: RecommendationCriterion): Record<string,string> {
  const count = Number(fields[`${type}:meta:criteriaCount`])
  if (!Number.isInteger(row) || row < 0 || row >= count || count > INSTRUMENT_MAX_CRITERIA) throw new RangeError('Criterio inexistente.')
  const next = {...fields}
  const fill = (part:string,text:string,level?:number) => {
    const key = `${type}:${part}:${row}${level === undefined ? '' : `:${level}`}`
    if (!next[key]?.trim()) next[key] = text
  }
  fill('criterion',candidate.title)
  fill('description',candidate.description)
  if (type === 'lista-ponderada') fill('indicator',candidate.description)
  next[`${type}:criterion-template:${row}`] = candidate.templateId
  if (candidate.relativeWeight) next[`${type}:criterion-weight:${row}`] = String(candidate.relativeWeight)
  if (authoredProgression(candidate)) next[`${type}:criterion-evidence:${row}`] = JSON.stringify({title:next[`${type}:criterion:${row}`],description:next[`${type}:description:${row}`],progression:authoredProgression(candidate)})
  if (type === 'rubrica' || type === 'escala') {
    const levels = Number(fields[`${type}:meta:levelCount`])
    // Never repeat a descriptor to pretend there are more authored levels.
    if (Number.isInteger(levels) && levels >= INSTRUMENT_MIN_LEVELS && levels <= INSTRUMENT_MAX_LEVELS) {
      const texts = descriptorTexts(candidate,levels)
      for(let index=0;index<levels;index++) if(texts[index]) fill('descriptor',texts[index],levels-index)
    }
  }
  return next
}

export function fillAuthoredLevelDescriptors(fields: Record<string,string>, type: 'rubrica' | 'escala') {
  const next = {...fields}
  const levels = Number(fields[`${type}:meta:levelCount`])
  if (!Number.isInteger(levels) || levels < 2 || levels > 5) return next
  for(let row=0;row<Math.min(INSTRUMENT_MAX_CRITERIA,Number(fields[`${type}:meta:criteriaCount`]) || 0);row++) {
    let source: {title:string;description:string;progression:string[]}
    try { source=JSON.parse(fields[`${type}:criterion-evidence:${row}`] || 'null') } catch { continue }
    if (!source || source.title !== fields[`${type}:criterion:${row}`] || source.description !== fields[`${type}:description:${row}`]
      || !Array.isArray(source.progression) || source.progression.length !== 5 || source.progression.some(text=>typeof text !== 'string' || !text.trim())) continue
    const existing = Array.from({length:levels},(_,index)=>next[`${type}:descriptor:${row}:${levels-index}`] || '')
    for(let index=0;index<levels;index++) {
      if (existing[index].trim()) continue
      const left = existing.slice(0,index).reverse().find(text=>text.trim())
      const right = existing.slice(index+1).find(text=>text.trim())
      const leftIndex = left ? source.progression.indexOf(left) : -1
      const rightIndex = right ? source.progression.indexOf(right) : 5
      if (left && leftIndex < 0 || right && rightIndex < 0) continue
      const expected = levels === 4 ? [0,1,2,4][index] : Math.round(index*4/(levels-1))
      const available = source.progression.map((text,i)=>({text,i})).filter(item=>item.i>leftIndex && item.i<rightIndex && !existing.includes(item.text))
      const choice = available.find(item=>item.i===expected) ?? (available.length === 1 ? available[0] : undefined)
      if (choice) { next[`${type}:descriptor:${row}:${levels-index}`]=choice.text; existing[index]=choice.text }
    }
  }
  return next
}
