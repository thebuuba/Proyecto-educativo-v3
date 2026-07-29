import { secondaryCurriculumCatalog } from './secondaryCurriculum.generated'
import { verifiedSecondaryCurriculum } from './secondaryCurriculum.verified'

export type CurriculumUnit = {
  title: string
  topics: readonly string[]
}

const areaMatchers = [
  ['Humanidades y Lenguas Modernas', ['humanidades y lenguas modernas']],
  ['Humanidades y Ciencias Sociales', ['humanidades y ciencias sociales']],
  ['Matemática y Tecnología', ['matematica y tecnologia']],
  ['Ciencias y Tecnología', ['ciencias y tecnologia']],
  ['Lengua Española', ['lengua espanola']],
  ['Lenguas Extranjeras (Inglés y Francés)', ['ingles', 'frances']],
  ['Matemática', ['matemat']],
  ['Ciencias Sociales', ['ciencias sociales', 'historia', 'geograf']],
  ['Educación Física', ['educacion fisica', 'deporte']],
  [
    'Ciencias de la Naturaleza',
    ['ciencias de la naturaleza', 'biolog', 'quim', 'fisic', 'tierra', 'universo', 'ciencias de la vida'],
  ],
  ['Educación Artística', ['educacion artistica', 'arte']],
  ['Formación Integral Humana y Religiosa', ['formacion integral', 'relig']],
] as const

export function normalizeCurriculumText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function curricularAreaForSubject(subjectName: string): string | null {
  const normalizedSubject = normalizeCurriculumText(subjectName)
  return (
    areaMatchers.find(([, matches]) =>
      matches.some((match) => normalizedSubject.includes(match)),
    )?.[0] ?? null
  )
}

export function secondaryGradeNumber(gradeName: string, level?: string) {
  const normalizedLevel = normalizeCurriculumText(level ?? '')
  const normalizedGrade = normalizeCurriculumText(gradeName)
  if (
    normalizedLevel &&
    !normalizedLevel.includes('secund') &&
    !normalizedGrade.includes('secund')
  ) {
    return null
  }
  const match = normalizedGrade.match(/\b([1-6])(?:ro|do|to|mo|er|\.?º)?\b/)
  return match ? Number(match[1]) : null
}

export function curriculumUnitsFor(
  gradeName: string,
  area: string,
  level?: string,
  subjectName?: string,
): readonly CurriculumUnit[] {
  const grade = secondaryGradeNumber(gradeName, level)
  if (!grade) return []
  const normalizedSubject = normalizeCurriculumText(subjectName ?? '')
  const catalogArea =
    area === 'Lenguas Extranjeras (Inglés y Francés)'
      ? normalizedSubject.includes('frances')
        ? 'Lenguas Extranjeras: Francés'
        : 'Lenguas Extranjeras: Inglés'
      : area
  const key = `${grade}:${catalogArea}` as keyof typeof secondaryCurriculumCatalog
  return verifiedSecondaryCurriculum[key] ?? secondaryCurriculumCatalog[key] ?? []
}
