export const competencyBlockIds = ['b1', 'b2', 'b3', 'b4'] as const

export type CompetencyBlockId = (typeof competencyBlockIds)[number]
export type EvaluationProfileId = 'primary-official' | 'secondary-official'

export type CompetencyBlockDefinition = {
  id: CompetencyBlockId
  shortName: string
  name: string
}

export type EvaluationProfile = {
  id: EvaluationProfileId
  academicLevelCode: 'primario' | 'secundario'
  expectedBlockTotal: number
  requiredPeriodCount: number
  blocks: readonly CompetencyBlockDefinition[]
}

const communicative = { id: 'b1', shortName: 'Bloque 1', name: 'Competencia Comunicativa' } as const

export const primaryEvaluationProfile: EvaluationProfile = {
  id: 'primary-official',
  academicLevelCode: 'primario',
  expectedBlockTotal: 100,
  requiredPeriodCount: 4,
  blocks: [
    communicative,
    { id: 'b2', shortName: 'Bloque 2', name: 'Pensamiento Lógico, Creativo y Crítico, Resolución de Problemas y Científica y Tecnológica' },
    { id: 'b3', shortName: 'Bloque 3', name: 'Ética y Ciudadana, Desarrollo Personal y Espiritual y Ambiental y de la Salud' },
  ],
}

export const secondaryEvaluationProfile: EvaluationProfile = {
  id: 'secondary-official',
  academicLevelCode: 'secundario',
  expectedBlockTotal: 100,
  requiredPeriodCount: 4,
  blocks: [
    communicative,
    { id: 'b2', shortName: 'Bloque 2', name: 'Pensamiento Lógico, Creativo y Crítico y Resolución de Problemas' },
    { id: 'b3', shortName: 'Bloque 3', name: 'Ética y Ciudadana y Desarrollo Personal y Espiritual' },
    { id: 'b4', shortName: 'Bloque 4', name: 'Científica y Tecnológica y Ambiental y de la Salud' },
  ],
}

/** Resolves the official profile from the stable academic-level code. Unknown legacy levels keep secondary compatibility. */
export function resolveEvaluationProfile(academicLevelCode?: string | null): EvaluationProfile {
  const normalized = academicLevelCode?.trim().toLowerCase()
  return normalized === 'primario' || normalized === 'primaria'
    ? primaryEvaluationProfile
    : secondaryEvaluationProfile
}

export function isBlockInEvaluationProfile(profile: EvaluationProfile, blockId: string): blockId is CompetencyBlockId {
  return profile.blocks.some((block) => block.id === blockId)
}
