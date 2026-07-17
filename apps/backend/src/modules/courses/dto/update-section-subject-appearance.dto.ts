import { IsIn, IsOptional, Matches } from 'class-validator'

export const SUBJECT_APPEARANCE_ICONS = [
  'atom',
  'baby',
  'binary',
  'book',
  'book-marked',
  'bot',
  'brain',
  'briefcase',
  'building',
  'calculator',
  'camera',
  'chart',
  'code',
  'cooking-pot',
  'cross',
  'dna',
  'dumbbell',
  'earth',
  'footprints',
  'gavel',
  'leaf',
  'globe',
  'guitar',
  'hammer',
  'hand-heart',
  'heart-pulse',
  'landmark',
  'languages',
  'laptop',
  'flask',
  'microscope',
  'music',
  'palette',
  'pen-tool',
  'plane',
  'presentation',
  'puzzle',
  'scroll-text',
  'shield-check',
  'sprout',
  'stethoscope',
  'telescope',
  'theater',
  'wrench',
] as const

export class UpdateSectionSubjectAppearanceDto {
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color?: string | null

  @IsOptional()
  @IsIn(SUBJECT_APPEARANCE_ICONS)
  icon?: string | null
}
