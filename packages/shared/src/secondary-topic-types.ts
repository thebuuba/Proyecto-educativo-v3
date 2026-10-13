export type TopicTaskMode = 'PRODUCTION' | 'ANALYSIS' | 'COMPARISON' | 'ORAL' | 'REPORT'
export type TopicDimension = {
  id: string; title: string; production: string; analysis: string; comparison: string
  evidence: [string, string, string, string]; weight: number; requestedOnly?: string
}
export type SecondaryLanguageTopic = {
  id: string; grade: number; subjectCode: string; aliases: string[]
  source: { topicElementId: string; pdfPages: number[]; printedPages: number[] }
  dimensions: TopicDimension[]
}
export const dimension = (id: string, title: string, production: string, analysis: string, comparison: string,
  evidence: TopicDimension['evidence'], weight = 4, requestedOnly?: string): TopicDimension =>
  ({ id, title, production, analysis, comparison, evidence, weight, ...(requestedOnly ? { requestedOnly } : {}) })
