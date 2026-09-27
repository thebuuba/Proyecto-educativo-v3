/** Ephemeral proposal, never an evaluation_instrument or historical result. */
export type InstrumentType = 'rubrica' | 'lista-cotejo' | 'escala' | 'lista-ponderada'
export type EvidenceType = 'KNOWLEDGE' | 'PERFORMANCE' | 'PRODUCT' | 'ATTITUDE'
export type CriterionSource = 'CURRICULUM_DERIVED' | 'ACTIVITY_TEMPLATE' | 'CONTEXTUALIZED' | 'TEACHER_REUSED'
export interface CurriculumReference {
  elementId: string; scopeId: string; versionId: string; type: string; text: string
  sources: { documentId: string; pdfPage: number; printedPage: string | null }[]
}
export interface RecommendationCriterion {
  id: string; title: string; description: string; maxScore: number; maxScoreUnits: number
  sourceType: CriterionSource; sourceReferences: CurriculumReference[]; templateId: string
  descriptors: { levelId: string; text: string; scoreUnits: number }[]
}
export interface InstrumentRecommendation {
  kind: 'RECOMMENDATION'; catalogVersion: string; instrumentType: InstrumentType
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'; activityType: string; evidenceTypes: EvidenceType[]
  participationMode: 'INDIVIDUAL' | 'GROUP'; curriculumVersionId: string | null; curriculumScopeId: string | null
  selectedCurriculumElements: CurriculumReference[]; criteria: RecommendationCriterion[]
  levels: { id: string; label: string; proportion: number }[]; totalScore: number; totalScoreUnits: number; scoreUnit: 0.01
  internalTrace: {
    mappingStatus: string; reasons: string[]; ruleId: string; activityTypeOrigin: 'EXPLICIT' | 'DETECTED' | 'DEFAULT'
    ranking: { elementId: string; score: number; topicCoverage: number; reasons: string[] }[]
    curriculumStatus: string | null; lowCurriculumConfidence: boolean; consideredTypes: string[]
  }
}
/** Future read model, deliberately not persisted or activated in Phase B. */
export interface TeacherInstrumentPreference {
  schoolId: string; teacherId: string; scopeId: string; activityType: string
  instrumentType: InstrumentType; criterionTemplateIds: string[]; useCount: number
  lastUsedAt: string; acceptedInstrumentId: string
}
