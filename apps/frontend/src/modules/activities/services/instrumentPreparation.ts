import {markEnglishTaskProvisional} from '@aula/shared'
import {resolveOptativeSocialTask,optativeSocialCriteria} from '@aula/shared'
import {resolveCommonPhysicalTask,commonPhysicalCriteria,adaptPhysicalScale} from '@aula/shared'
import {resolveCommonFhrTask,commonFhrCriteria,adaptFhrScale} from '@aula/shared'
import {resolveOptativeLanguageTask,optativeLanguageCriteria,adaptOptativeLanguageScale} from '@aula/shared'
import { resolveCommonArtTask, commonArtCriteria, adaptArtScale } from '@aula/shared'
import {resolveCommonSocialTask,commonSocialCriteria,adaptSocialScale} from '@aula/shared'
import {resolveTechnicalTask,technicalCriteria,adaptTechnicalScale} from '@aula/shared'
import {resolveOptativeScienceTask,optativeScienceCriteria,adaptOptativeScienceScale} from '@aula/shared'
import {resolveCommonScienceTask,commonScienceCriteria,adaptScienceScale} from '@aula/shared'
import { resolveCommonFrenchTask, commonFrenchCriteria } from '@aula/shared'
import {resolveOptativeMathTask,optativeMathCriteria} from '@aula/shared'
import {resolveCommonMathTask,commonMathCriteria,adaptMathScale} from '@aula/shared'
import type { InstrumentRecommendation } from '@aula/shared'
import {resolveEvaluationTask,secondaryNovelAnalysisCriteria,actionContentCriteria,commonSecondaryLanguageGrade,resolveCommonEnglishTask,commonEnglishCriteria,englishTaskGrade,resolveOptativeEnglishTask,optativeEnglishModules,adaptLanguageScale} from '@aula/shared'
import { distributeScoreUnits, instrumentEvaluationConfiguration, validateInstrumentDefinition } from '@aula/shared'
import { editableAuthoredRecommendation, editableSecondaryTopicRecommendation, findSecondaryLanguageTopic, secondGradeNewsCriteria, withoutResources } from '@aula/shared'
import { findSecondaryScienceTopic, secondaryScienceCriteria, scientificTaskType, type InstrumentAcademicContext } from '@aula/shared'
import { firstGradeNewsCriteria, detectSecondaryLanguageActivity, isFirstGradeNewsActivity } from '@aula/shared'
import { firstGradeGuideCriteria, isFirstGradeGuideActivity, firstSecondaryLanguageGenre } from '@aula/shared'
import { firstGradePosterCriteria, isFirstGradePosterActivity } from '@aula/shared'
import { firstGradeDetectiveCriteria, isFirstGradeDetectiveActivity } from '@aula/shared'
import { firstGradeCalligramCriteria, isFirstGradeCalligramActivity } from '@aula/shared'
import { firstGradeReadingReportCriteria } from '@aula/shared'
import {resolveFirstGradeHealthGenre,firstGradeHealthGenreCriteria} from '@aula/shared'
import {resolveFirstGradeTransversalTask,firstGradeTransversalCriteria,markFirstGradeProvisional} from '@aula/shared'
import { findSecondaryMathTopic, secondaryMathCriteria } from '@aula/shared'
import { api } from '@/services/apiClient'

type InstrumentPreparationContext = {
  evaluationTechnique?: string
  evidenceInstructions?: string
  resources?: string[]
  evaluationPriorities?: string[]
  organizationMode?: 'INDIVIDUAL' | 'GROUP'
  planningMoment?: string
}

export type ActivityInterpretation = {
  suggestedActivityType: string
  suggestedEvaluationTechnique?: string
  suggestedInstrumentType?: string
  activityType: string
  activityTypes: string[]
  curriculumVersionId: string | null
  curriculumScopeId: string | null
  curriculumCandidates: Array<{ elementId: string; type: string; text: string; sources: Array<{ documentId: string; pdfPage: number; printedPage: string | null }> }>
  curriculumMatch: 'SUGGESTED' | 'NONE'
  message: string
}

export function interpretActivity(input: InstrumentPreparationContext & { sectionSubjectId: string; activityTitle: string; description?: string; pedagogicalActivityType?: string; competencyBlock?: string; participationMode?: 'INDIVIDUAL' | 'GROUP' }, signal?: AbortSignal) {
  return api.post<ActivityInterpretation>('/evaluation-instruments/interpret', input, { signal })
}

export function prepareInstrument(input: InstrumentPreparationContext & { sectionSubjectId: string; activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'; pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; curriculumVersionId?: string; preferredInstrumentType?: string; selectedCurriculumElementIds?: string[]; includeAdditionalCandidates?: boolean; levelCount?: 4 | 5 }) {
  return api.post<InstrumentRecommendation>('/evaluation-instruments/recommend', input)
}

export function preparationFingerprint(input: InstrumentPreparationContext & { name: string; description: string; maxScore: string; pedagogicalActivityType?: string; activityType: string; instrumentType: string; selectedCurriculumElementIds?: string[]; observations?: string; teamIds?: string[] }) {
  return JSON.stringify([input.name, input.description, input.pedagogicalActivityType, input.activityType, input.instrumentType, input.selectedCurriculumElementIds ?? [],
    input.evaluationTechnique ?? '', input.evidenceInstructions ?? '', input.resources ?? [], input.evaluationPriorities ?? [], input.observations ?? '', input.organizationMode ?? '', input.planningMoment ?? '', input.teamIds ?? []])
}

export function editableFallbackRecommendation(input: InstrumentPreparationContext & { activityTitle: string; description?: string; maxScore: number; instrumentType: InstrumentRecommendation['instrumentType']; participationMode: 'INDIVIDUAL' | 'GROUP'; activityType?: string; variation?: number; secondaryLanguageGrade?: number; academicContext?: InstrumentAcademicContext | null; includeAdditionalCandidates?: boolean }): InstrumentRecommendation {
  if (input.evidenceInstructions?.trim()) input = { ...input, description: [input.description, input.evidenceInstructions].filter(Boolean).join('\n') }
  const authorizedGrade=input.academicContext?commonSecondaryLanguageGrade(input.academicContext):input.secondaryLanguageGrade
  if(authorizedGrade)input={...input,secondaryLanguageGrade:authorizedGrade}
  const transversal=resolveFirstGradeTransversalTask(input.activityTitle,input.description??'',input.academicContext)
  if(transversal&&(!input.activityType||input.activityType===transversal.activityType))return markFirstGradeProvisional(editableAuthoredRecommendation(firstGradeTransversalCriteria(transversal),input,input.activityType??transversal.activityType,'lengua-secundaria-1-transversal'),transversal.focused?.kind==='PROGRESS'||transversal.community?.kind==='NEWS_UNCONFIRMED',transversal.community?.kind==='NEWS_UNCONFIRMED'?'Preparación provisional: confirmar fase y medio de difusión; la consigna no acredita publicación efectiva ni desempeño observado.':undefined)
  const healthGenre=resolveFirstGradeHealthGenre(input.activityTitle,input.description??'',input.academicContext)
  if(healthGenre&&(!input.activityType||input.activityType===healthGenre.activityType))return editableAuthoredRecommendation(firstGradeHealthGenreCriteria(healthGenre),input,input.activityType??healthGenre.activityType,'lengua-secundaria-1-generos-indicador-salud')
  const socialOptative=resolveOptativeSocialTask(input.activityTitle,input.description??'',input.academicContext)
  if(socialOptative)return adaptSocialScale(editableAuthoredRecommendation(optativeSocialCriteria(socialOptative),input,input.activityType??socialOptative.activityType,socialOptative.module.id))
  const optative=resolveOptativeLanguageTask(input.activityTitle,input.description??'',input.academicContext)
  if(optative)return adaptOptativeLanguageScale(editableAuthoredRecommendation(optativeLanguageCriteria(optative),input,input.activityType??optative.activityType,optative.module.id))
  const fhr=resolveCommonFhrTask(input.activityTitle,input.description??'',input.academicContext)
  if(fhr)return adaptFhrScale(editableAuthoredRecommendation(commonFhrCriteria(fhr),input,input.activityType??fhr.activityType,`formacion-humana-religiosa-comun-${fhr.grade}`),fhr)
  const physical=resolveCommonPhysicalTask(input.activityTitle,input.description??'',input.academicContext)
  if(physical)return adaptPhysicalScale(editableAuthoredRecommendation(commonPhysicalCriteria(physical),input,input.activityType??physical.activityType,`educacion-fisica-comun-${physical.grade}`),physical)
  const art = resolveCommonArtTask(input.activityTitle, input.description ?? '', input.academicContext)
  if (art) return adaptArtScale(editableAuthoredRecommendation(commonArtCriteria(art), input, input.activityType ?? art.activityType, `educacion-artistica-comun-${art.grade}`), art)
  const social=resolveCommonSocialTask(input.activityTitle,input.description??'',input.academicContext)
  if(social)return adaptSocialScale(editableAuthoredRecommendation(commonSocialCriteria(social),input,input.activityType??social.activityType,`ciencias-sociales-comun-${social.grade}`))
  const technical=resolveTechnicalTask(input.activityTitle,input.description??'',input.academicContext)
  if(technical)return adaptTechnicalScale(editableAuthoredRecommendation(technicalCriteria(technical,input.description),input,input.activityType??technical.activityType,technical.module.id,{includeFileFormats:true,requestedOnly:true,ignoreSelectedSourceArticle:technical.module.moduleCode==='MF_060_3'}),input.description??'',technical)
  const optativeScience=resolveOptativeScienceTask(input.activityTitle,input.description??'',input.academicContext)
  if(optativeScience)return adaptOptativeScienceScale(editableAuthoredRecommendation(optativeScienceCriteria(optativeScience),input,input.activityType??optativeScience.activityType,optativeScience.module.id,optativeScience.grade===6?{includeFileFormats:true,requestedOnly:true}:undefined),input.description??'',optativeScience)
  const commonScience=resolveCommonScienceTask(input.activityTitle,input.description??'',input.academicContext)
  if(commonScience)return adaptScienceScale(editableAuthoredRecommendation(commonScienceCriteria(commonScience),input,input.activityType??commonScience.activityType,`ciencias-naturaleza-comun-${commonScience.grade}`),input.description??'')
  const optativeMath=resolveOptativeMathTask(input.activityTitle,input.description??'',input.academicContext)
  if(optativeMath)return adaptMathScale(editableAuthoredRecommendation(optativeMathCriteria(optativeMath),input,input.activityType??optativeMath.activityType,optativeMath.module.id),input.description??'')
  const commonMath=resolveCommonMathTask(input.activityTitle,input.description??'',input.academicContext)
  if(commonMath)return adaptMathScale(editableAuthoredRecommendation(commonMathCriteria(commonMath),input,input.activityType??commonMath.activityType,`matematica-comun-${commonMath.grade}`),input.description??'')
  const french=resolveCommonFrenchTask(input.activityTitle,input.description??'',input.academicContext)
  if(french)return editableAuthoredRecommendation(commonFrenchCriteria(french),input,input.activityType??french.activityType,`frances-comunicacion-${french.grade}`)
  const optativeEnglish=resolveOptativeEnglishTask(input.activityTitle,input.description??'',input.academicContext)
  if(optativeEnglish)return adaptLanguageScale(editableAuthoredRecommendation(commonEnglishCriteria(optativeEnglish),input,input.activityType??optativeEnglish.activityType,optativeEnglishModules.find(m=>m.grade===englishTaskGrade(optativeEnglish))!.id),input.description??'')
  const english=resolveCommonEnglishTask(input.activityTitle,input.description??'',input.academicContext)
  if(english)return markEnglishTaskProvisional(editableAuthoredRecommendation(commonEnglishCriteria(english),input,input.activityType??english.activityType,`ingles-comunicacion-${englishTaskGrade(english)}`),'preferences' in english?english.preferences?.note:'personal' in english?english.personal?.note:undefined)
  const resolvedActivity=input.activityType??resolveEvaluationTask(input.activityTitle,input.description??'').action??'OTHER'
  const novel=secondaryNovelAnalysisCriteria(input.activityTitle,input.description??'',input.academicContext,resolvedActivity,input.includeAdditionalCandidates)
  if(novel.length&&!findSecondaryLanguageTopic(input.activityTitle,input.description??'',input.academicContext??null)) return editableAuthoredRecommendation(novel,input,resolvedActivity,'novela-analisis-fragmento-5')
  const math = findSecondaryMathTopic(input.activityTitle, input.description ?? '', input.academicContext)
  const mathCriteria = math ? secondaryMathCriteria(math, input.description ?? '').filter(row=>input.includeAdditionalCandidates || !row.templateId.endsWith('-verification')) : []
  if (math && mathCriteria.length) return editableAuthoredRecommendation(mathCriteria,input,input.activityType || 'PROBLEM_SOLVING',`math-${math}-${input.academicContext?.grade}`)
  const science = findSecondaryScienceTopic(input.activityTitle, input.description ?? '', input.academicContext)
  const scienceCriteria = science ? secondaryScienceCriteria(science, input.description ?? '', input.instrumentType) : []
  if (science && scienceCriteria.length) return editableAuthoredRecommendation(scienceCriteria, input,
    input.activityType || scientificTaskType(input.activityTitle, input.description ?? '') || 'ANALYSIS', `science-${science}-${input.academicContext?.grade}`)
  const languageGrade=input.academicContext?commonSecondaryLanguageGrade(input.academicContext):input.secondaryLanguageGrade
  const topic = languageGrade ? findSecondaryLanguageTopic(input.activityTitle, input.description ?? '', { level: 'SECONDARY', grade: languageGrade, subjectCode: 'LEN' }) : null
  if (topic) return editableSecondaryTopicRecommendation(topic, input)
  const text = `${input.activityTitle} ${withoutResources(input.description ?? '')}`.toLocaleLowerCase('es-DO')
  const firstGenre = input.secondaryLanguageGrade === 1 ? firstSecondaryLanguageGenre(input.activityTitle, input.description ?? '') : null
  const news = /noticia|noticiero/.test(text) && (input.secondaryLanguageGrade !== 1 || firstGenre === 'NEWS' && (!input.activityType || isFirstGradeNewsActivity(input.activityType)))
  if (news && input.secondaryLanguageGrade === 1) {
    const activity = input.activityType ?? detectSecondaryLanguageActivity(input.activityTitle, input.description ?? '', { level: 'SECONDARY', grade: 1, subjectCode: 'LEN' }) ?? 'NEWS_WRITING'
    return editableAuthoredRecommendation(firstGradeNewsCriteria(activity, input.description ?? ''), input, activity, 'lengua-secundaria-1-la-noticia')
  }
  const secondNewsActivity=input.activityType??(input.secondaryLanguageGrade===2?detectSecondaryLanguageActivity(input.activityTitle,input.description??'',{level:'SECONDARY',grade:2,subjectCode:'LEN'}):null)
  if (news && input.secondaryLanguageGrade === 2 && ['NEWS_WRITING', 'NEWS_ANALYSIS', 'NEWS_COMPARISON', 'NEWSCAST', 'REPORT', 'DEBATE', 'RESEARCH'].includes(secondNewsActivity ?? '')) {
    return editableAuthoredRecommendation(secondGradeNewsCriteria(secondNewsActivity!, input.description ?? ''), input, secondNewsActivity!, 'lengua-secundaria-2-la-noticia')
  }
  const touristGuide = input.secondaryLanguageGrade === 1 ? firstGenre === 'TOURIST_GUIDE' && (!input.activityType || isFirstGradeGuideActivity(input.activityType)) : /gu[ií]a tur[ií]stica/.test(text)
  if (touristGuide && input.secondaryLanguageGrade === 1) {
    const activity = input.activityType ?? detectSecondaryLanguageActivity(input.activityTitle, input.description ?? '', { level: 'SECONDARY', grade: 1, subjectCode: 'LEN' }) ?? 'TOURIST_GUIDE_CREATION'
    return editableAuthoredRecommendation(firstGradeGuideCriteria(activity, input.description ?? ''), input, activity, 'lengua-secundaria-1-guia-turistica')
  }
  if (firstGenre === 'POSTER' && (!input.activityType || isFirstGradePosterActivity(input.activityType))) {
    const activity = input.activityType ?? detectSecondaryLanguageActivity(input.activityTitle,input.description ?? '',{level:'SECONDARY',grade:1,subjectCode:'LEN'}) ?? 'POSTER_CREATION'
    return editableAuthoredRecommendation(firstGradePosterCriteria(activity,input.activityTitle,input.description ?? ''),input,activity,'lengua-secundaria-1-el-afiche')
  }
  const poster = input.secondaryLanguageGrade !== 1 && input.activityType !== 'REPORT' && /afiche/.test(text)
  const readingReport = input.secondaryLanguageGrade === 1 ? firstGenre === 'READING_REPORT' : /informe de lectura/.test(text)
  if (readingReport && input.secondaryLanguageGrade === 1) {
    const activity = input.activityType ?? detectSecondaryLanguageActivity(input.activityTitle, input.description ?? '', { level: 'SECONDARY', grade: 1, subjectCode: 'LEN' }) ?? 'READING_REPORT_WRITING'
    return editableAuthoredRecommendation(firstGradeReadingReportCriteria(activity, input.description ?? ''), input, activity, 'lengua-secundaria-1-informe-de-lectura')
  }
  if (firstGenre === 'DETECTIVE_STORY' && (!input.activityType || isFirstGradeDetectiveActivity(input.activityType))) {
    const activity = input.activityType ?? detectSecondaryLanguageActivity(input.activityTitle,input.description ?? '',{level:'SECONDARY',grade:1,subjectCode:'LEN'}) ?? 'DETECTIVE_STORY_WRITING'
    return editableAuthoredRecommendation(firstGradeDetectiveCriteria(activity,input.description ?? ''),input,activity,'lengua-secundaria-1-cuento-policiaco')
  }
  const detectiveStory = input.secondaryLanguageGrade !== 1 && input.activityType !== 'REPORT' && /cuento (?:polic[ií]aco|detectivesco)/.test(text) && !readingReport
  if (firstGenre === 'CALLIGRAM' && (!input.activityType || isFirstGradeCalligramActivity(input.activityType))) {
    const activity = input.activityType ?? detectSecondaryLanguageActivity(input.activityTitle,input.description ?? '',{level:'SECONDARY',grade:1,subjectCode:'LEN'}) ?? 'CALLIGRAM_CREATION'
    return editableAuthoredRecommendation(firstGradeCalligramCriteria(activity,input.description ?? ''),input,activity,'lengua-secundaria-1-caligrama')
  }
  const actionCriteria=input.academicContext?.level==='SECONDARY'&&(input.academicContext.subjectCode==='LEN'||input.academicContext.subjectCode==='MAT'&&resolvedActivity==='EXERCISE_SET'||resolveEvaluationTask('',input.description??'').product)?actionContentCriteria(resolvedActivity,input.description??''):[]
  if(actionCriteria.length) return editableAuthoredRecommendation(actionCriteria,input,resolvedActivity,'action-only')
  const calligram = input.secondaryLanguageGrade !== 1 && input.activityType !== 'REPORT' && (/caligrama/.test(text) || /(?:versos|palabras).*formando (?:la )?silueta/.test(text))
  const writingReport = input.activityType ? input.activityType === 'READING_REPORT_WRITING' : readingReport && /(?:redact|escrib|elabor|produc|cre)[a-záéíóú]*\s+(?:(?:un|el|su)\s+)?informe de lectura/.test(text)
  const analyzing = input.activityType ? input.activityType.endsWith('_ANALYSIS') : /leer|analizar|identificar/.test(text) && !writingReport
  const reportAnalysis = /personajes/.test(text) ? ['Análisis de los personajes', 'Analiza las acciones y características de los personajes con ejemplos del texto.']
    : /sociocultural|costumbres|comportamientos|valores/.test(text) ? ['Análisis sociocultural', 'Analiza comportamientos, costumbres o valores con ejemplos del texto.']
    : ['Análisis del texto', 'Sustenta su interpretación del texto leído con ejemplos pertinentes.']
  const oral = input.activityType ? /(?:PRESENTATION|EXPLANATION|NARRATION|NEWSCAST)$/.test(input.activityType) : /noticiero|presentar|exponer/.test(text)
  const comparing = input.activityType ? input.activityType.endsWith('_COMPARISON') : /comparar|comparaci[oó]n/.test(text)
  const graphicsRequested = /imagen|im[aá]genes|foto|mapa|gr[aá]fico|dibujo|collage|recurso visual/.test(text)
  const posterTopic = /agua/.test(text) ? 'el cuidado y ahorro del agua' : /convivencia escolar/.test(text) ? 'la convivencia escolar' : /entorno/.test(text) ? 'el cuidado del entorno' : 'el tema indicado'
  const reciting = input.activityType ? input.activityType === 'CALLIGRAM_RECITATION' : /recitar|declamar/.test(text)
  const normalized = text.normalize('NFD').replace(/\p{M}/gu, '')
  const cellComparison = /celulas?/.test(normalized) && /animal/.test(normalized) && /vegetal/.test(normalized)
  const techniqueTypes: Record<string, string> = { debate: 'DEBATE', 'mapa-conceptual': 'CONCEPT_MAP', ensayo: 'ESSAY', 'analisis-producciones': 'WRITTEN_PRODUCTION' }
  const genericActivity = input.activityType || (/\bdebat\w*\b/.test(normalized) ? 'DEBATE' : /\bmapas? conceptual(?:es)?\b/.test(normalized) ? 'CONCEPT_MAP'
    : /\binforme|\breporte/.test(normalized) ? 'REPORT' : /\bensayo/.test(normalized) ? 'ESSAY'
      : /trabajo escrito|produccion escrita|\bredact/.test(normalized) ? 'WRITTEN_PRODUCTION' : techniqueTypes[input.evaluationTechnique ?? ''] || 'OTHER')
  const definitionsByType: Record<string, Array<{ id: string; title: string; description: string; descriptors: [string, string, string, string] }>> = {
    DEBATE: [
      { id: 'debate-content', title: cellComparison ? 'Comparación científica entre células eucariotas animales y vegetales' : 'Dominio del contenido del debate',
        description: cellComparison ? 'Compara semejanzas y diferencias entre las células eucariotas animales y vegetales con precisión científica.' : 'Utiliza el contenido de la actividad con precisión durante el debate.',
        descriptors: cellComparison ? ['Compara con precisión varias semejanzas y diferencias y explica su importancia.', 'Compara correctamente las semejanzas y diferencias principales.', 'Menciona algunas diferencias, con omisiones o imprecisiones.', 'No logra establecer una comparación científicamente válida.'] : ['Integra el contenido con precisión y profundidad en sus intervenciones.', 'Utiliza correctamente las ideas principales del contenido.', 'Utiliza parte del contenido con algunas imprecisiones.', 'Sus intervenciones no evidencian comprensión suficiente del contenido.'] },
      { id: 'debate-argument', title: 'Argumentación con razones y evidencias', description: 'Sustenta sus ideas con razones, ejemplos o evidencias pertinentes.', descriptors: ['Construye argumentos coherentes y los respalda con razones y evidencias pertinentes.', 'Presenta argumentos claros respaldados por al menos una razón o ejemplo pertinente.', 'Expresa una postura, pero ofrece apoyo limitado o poco relacionado.', 'Formula afirmaciones sin razones ni evidencias que las sustenten.'] },
      { id: 'debate-response', title: 'Respuesta a otros argumentos', description: 'Escucha, contrasta y responde los argumentos presentados por los demás participantes.', descriptors: ['Responde directamente, contrasta ideas y justifica su respuesta con precisión.', 'Responde de manera pertinente a los argumentos principales.', 'Responde parcialmente o se desvía de la idea que debía contrastar.', 'No responde a los argumentos presentados.'] },
      { id: 'debate-clarity', title: 'Claridad de las intervenciones', description: 'Comunica cada intervención de forma clara, audible y comprensible.', descriptors: ['Interviene con claridad, vocabulario preciso y una secuencia fácil de seguir.', 'Expresa sus ideas de manera clara y mayormente ordenada.', 'Algunas intervenciones resultan confusas o poco audibles.', 'Sus intervenciones no permiten comprender la idea que desea comunicar.'] },
      { id: 'debate-listening', title: 'Escucha y respeto de los turnos', description: 'Escucha activamente, respeta los turnos y se relaciona con las ideas de los demás.', descriptors: ['Escucha de forma constante, respeta todos los turnos y retoma ideas ajenas de manera constructiva.', 'Escucha y respeta los turnos durante la mayor parte del debate.', 'Interrumpe ocasionalmente o muestra atención irregular.', 'Interrumpe reiteradamente o no atiende las intervenciones de los demás.'] },
      { id: 'debate-individual', title: 'Aporte individual', description: `Realiza aportes propios y pertinentes${input.organizationMode === 'GROUP' ? ', aunque la actividad se organice en equipos' : ''}.`, descriptors: ['Realiza varios aportes propios, pertinentes y conectados con el desarrollo del debate.', 'Realiza al menos un aporte propio y pertinente.', 'Su aporte es breve, repetitivo o requiere apoyo para relacionarse con el debate.', 'No realiza un aporte individual observable.'] },
    ],
    CONCEPT_MAP: [
      { id: 'map-content', title: 'Selección de conceptos', description: 'Incluye los conceptos esenciales del tema.', descriptors: ['Incluye todos los conceptos esenciales con precisión.', 'Incluye los conceptos principales.', 'Omite varios conceptos importantes.', 'Incluye pocos conceptos o conceptos incorrectos.'] },
      { id: 'map-hierarchy', title: 'Jerarquía conceptual', description: 'Organiza los conceptos desde los generales hasta los específicos.', descriptors: ['La jerarquía es completa, lógica y consistente.', 'La jerarquía principal es correcta.', 'La jerarquía presenta algunos niveles confusos.', 'No se reconoce una jerarquía conceptual.'] },
      { id: 'map-relations', title: 'Relaciones y palabras enlace', description: 'Conecta conceptos mediante relaciones correctas y palabras enlace significativas.', descriptors: ['Todas las conexiones expresan relaciones precisas.', 'La mayoría de las conexiones son correctas.', 'Varias conexiones son vagas o incorrectas.', 'Las conexiones no explican relaciones entre conceptos.'] },
      { id: 'map-readability', title: 'Claridad visual', description: 'Presenta una estructura legible que permite seguir las relaciones.', descriptors: ['La estructura se lee con facilidad y guía claramente el recorrido.', 'La estructura es legible y comprensible.', 'La lectura presenta algunas dificultades.', 'La disposición impide comprender el mapa.'] },
    ],
    REPORT: [
      { id: 'report-purpose', title: 'Propósito y contenido', description: 'Desarrolla el propósito del informe con información pertinente.', descriptors: ['Desarrolla el propósito con información completa y precisa.', 'Desarrolla el propósito con la información principal.', 'Presenta información parcial o algunas imprecisiones.', 'No desarrolla el propósito del informe.'] },
      { id: 'report-method', title: 'Procedimiento', description: 'Describe el procedimiento realizado de forma ordenada y reproducible.', descriptors: ['Describe todos los pasos con orden y detalle suficiente para reproducirlos.', 'Describe los pasos principales en orden.', 'Omite pasos o presenta un orden confuso.', 'No permite reconocer el procedimiento realizado.'] },
      { id: 'report-data', title: 'Registro de resultados', description: 'Presenta observaciones o datos de manera clara y fiel.', descriptors: ['Registra datos completos, claros y sin alteraciones.', 'Registra correctamente los resultados principales.', 'El registro es incompleto o poco claro.', 'No presenta resultados utilizables.'] },
      { id: 'report-analysis', title: 'Análisis y conclusión', description: 'Interpreta los resultados y formula una conclusión coherente.', descriptors: ['Relaciona datos, explicación y conclusión con precisión.', 'Interpreta los resultados y presenta una conclusión coherente.', 'La interpretación o conclusión es parcial.', 'La conclusión no se apoya en los resultados.'] },
    ],
    WRITTEN_PRODUCTION: [
      { id: 'written-content', title: 'Contenido y propósito', description: 'Desarrolla el tema y responde al propósito del trabajo escrito.', descriptors: ['Desarrolla el tema con profundidad, precisión y enfoque sostenido.', 'Desarrolla las ideas principales de acuerdo con el propósito.', 'Desarrolla el tema parcialmente o con algunas imprecisiones.', 'El texto no responde al propósito solicitado.'] },
      { id: 'written-structure', title: 'Organización del texto', description: 'Organiza el texto con una secuencia y partes reconocibles.', descriptors: ['Organiza las ideas con estructura completa y transiciones claras.', 'Presenta una estructura clara y ordenada.', 'La organización contiene saltos o partes poco desarrolladas.', 'Las ideas aparecen sin una estructura reconocible.'] },
      { id: 'written-evidence', title: 'Desarrollo y evidencias', description: 'Explica las ideas mediante razones, ejemplos o información pertinente.', descriptors: ['Desarrolla cada idea con razones y ejemplos pertinentes.', 'Apoya las ideas principales con información adecuada.', 'El apoyo es limitado o poco conectado con las ideas.', 'Presenta afirmaciones sin desarrollo.'] },
      { id: 'written-correctness', title: 'Claridad y corrección', description: 'Utiliza vocabulario adecuado y revisa la escritura.', descriptors: ['Redacta con claridad, vocabulario preciso y corrección consistente.', 'Redacta de forma comprensible con errores menores.', 'Los errores dificultan parcialmente la lectura.', 'Los errores impiden comprender el texto.'] },
    ],
  }
  const generic = !detectiveStory && !calligram && !readingReport && !poster && !touristGuide && !news
    ? definitionsByType[genericActivity === 'ESSAY' ? 'WRITTEN_PRODUCTION' : genericActivity] : undefined
  const authored = detectiveStory && analyzing ? [
    ['Estructura y trama', 'Interpreta inicio, nudo y desenlace y explica cómo progresa el misterio.'],
    ['Narrador, personajes y ambiente', 'Identifica y relaciona estos elementos en la historia.'],
    ['Pistas y desenlace', 'Relaciona acciones y pistas con la comprensión del desenlace.'],
    ['Recursos narrativos', 'Explica recursos lingüísticos o literarios presentes.'],
    ['Evidencias del cuento', 'Justifica su interpretación con ejemplos del texto.'],
  ] : detectiveStory && comparing ? [
    ['Comparación de tramas', 'Compara los misterios y la organización de ambos cuentos.'],
    ['Personajes y ambientes', 'Compara personajes y ambientes con ejemplos.'],
    ['Resolución del misterio', 'Contrasta cómo las pistas conducen a cada desenlace.'],
    ['Evidencias', 'Sustenta la comparación con ambos cuentos.'],
    ['Conclusión', 'Formula una conclusión coherente.'],
  ] : detectiveStory && oral ? [
    ['Secuencia narrativa', 'Comunica inicio, nudo y desenlace en orden.'],
    ['Desarrollo del misterio', 'Relaciona conflicto, acciones y resolución.'],
    ['Voces y expresión', 'Usa tono, ritmo y volumen para diferenciar intervenciones.'],
    ['Claridad oral', 'Narra o explica con vocabulario comprensible.'],
    ['Dominio individual', 'Responde por su propio desempeño.'],
  ] : detectiveStory ? [
    ['Inicio, nudo y desenlace', 'Organiza las partes del cuento de forma relacionada.'],
    ['Misterio, pistas y resolución', 'Relaciona las pistas con un desenlace coherente.'],
    ['Personajes y ambiente', 'Caracteriza personajes y ambiente para la trama.'],
    ['Narrador', 'Mantiene una perspectiva narrativa consistente.'],
    ['Cohesión y revisión', 'Revisa conectores, claridad, puntuación y ortografía.'],
  ] : calligram && analyzing ? [
    ['Relación texto-figura', 'Interpreta cómo la figura formada por palabras se relaciona con el poema.'],
    ['Intención y sentimientos', 'Explica el mensaje y los sentimientos expresados.'],
    ['Recursos presentes', 'Analiza únicamente los recursos expresivos presentes.'],
    ['Organización visual', 'Explica cómo disposición y tipografía aportan significado.'],
    ['Evidencias', 'Justifica con versos y rasgos visuales concretos.'],
  ] : calligram && comparing ? [
    ['Mensajes', 'Compara temas, mensajes y sentimientos.'],
    ['Figuras', 'Contrasta la relación entre palabras y figura.'],
    ['Recursos expresivos', 'Compara vocabulario y recursos presentes.'],
    ['Organización visual', 'Compara disposición y legibilidad.'],
    ['Conclusión', 'Formula una conclusión sustentada.'],
  ] : calligram && reciting ? [
    ['Claridad', 'Recita con dicción y volumen comprensibles.'],
    ['Entonación y expresión', 'Ajusta ritmo y pausas a los sentimientos del poema.'],
    ['Comprensión', 'Comunica el sentido global durante la recitación.'],
    ['Fluidez', 'Mantiene continuidad comprensible.'],
    ['Desempeño individual', 'Sostiene personalmente la recitación.'],
  ] : calligram && oral ? [
    ['Tema, palabras y figura', 'Explica la relación entre los componentes de su caligrama.'],
    ['Decisiones poéticas y visuales', 'Justifica vocabulario, recursos y disposición.'],
    ['Ideas y sentimientos', 'Explica lo que buscó comunicar.'],
    ['Claridad oral', 'Presenta sus decisiones con orden y dicción.'],
    ['Dominio individual', 'Responde preguntas sobre su producto.'],
  ] : calligram ? [
    ['Tema y figura', 'Dispone los versos formando una figura relacionada con el tema.'],
    ['Ideas y sentimientos', 'Comunica ideas o emociones coherentes.'],
    ['Organización visual', 'Construye la figura sin impedir la lectura.'],
    ['Recursos expresivos', /verso libre/.test(text) ? 'Usa recursos pertinentes en verso libre, sin exigir rima.' : 'Usa vocabulario y recursos pertinentes.'],
    ['Revisión final', 'Revisa coherencia, relación texto-figura y ortografía.'],
  ] : readingReport && analyzing ? [
    ['Función y propósito', 'Explica para qué se elaboró el informe de lectura y qué texto analiza.'],
    ['Estructura del informe', 'Identifica título, introducción, desarrollo y conclusión.'],
    ['Comprensión del resumen', 'Reconoce las ideas principales recuperadas sin confundirlas con el análisis.'],
    ['Interpretación del análisis', 'Explica las interpretaciones socioculturales presentadas.'],
    ['Evidencias del informe', 'Justifica sus respuestas con información concreta del informe.'],
  ] : readingReport && comparing ? [
    ['Propósito y textos', 'Compara el propósito y los textos abordados en ambos informes.'],
    ['Comparación de estructura', 'Contrasta título, introducción, desarrollo y conclusión.'],
    ['Comparación de interpretaciones', 'Establece semejanzas y diferencias entre los análisis.'],
    ['Uso de evidencias', 'Sustenta la comparación con ambos informes.'],
    ['Conclusión', 'Formula una conclusión coherente con la comparación.'],
  ] : readingReport && oral ? [
    ['Síntesis del texto', 'Presenta las ideas principales del texto de forma fiel.'],
    reportAnalysis,
    ['Organización oral', 'Ordena introducción, desarrollo y conclusión.'],
    ['Claridad de la exposición', 'Expone con dicción, volumen y ritmo comprensibles.'],
    ['Dominio individual', 'Responde preguntas sobre el texto y el análisis.'],
  ] : readingReport ? [
    ['Resumen del texto', 'Resume las ideas principales sin alterar su sentido.'],
    reportAnalysis,
    ['Estructura del informe', 'Organiza título, introducción, desarrollo y conclusión.'],
    ...(/conclusi[oó]n/.test(text) ? [['Conclusión personal', 'Formula una conclusión personal relacionada con el resumen y el análisis del texto.']] : []),
    ['Coherencia', 'Relaciona resumen y análisis con vocabulario y conectores adecuados.'],
    ['Revisión final', 'Revisa organización, puntuación, ortografía y claridad.'],
  ] : poster && analyzing ? [
    ['Propósito y destinatarios', `Interpreta la intención del afiche sobre ${posterTopic} e identifica a quién se dirige.`],
    ['Interpretación del mensaje', `Explica el mensaje principal sobre ${posterTopic}.`],
    ['Recursos para convencer', 'Explica cómo las palabras, argumentos y recursos persuasivos buscan convencer.'],
    ['Texto y elementos visuales', 'Analiza cómo los elementos visuales contribuyen al mensaje.'],
    ['Evidencias del afiche', 'Justifica su interpretación con elementos concretos del afiche.'],
  ] : poster && comparing ? [
    ['Propósito y destinatarios', `Compara el propósito y el público de los afiches sobre ${posterTopic}.`],
    ['Mensajes y argumentos', 'Establece semejanzas y diferencias entre mensajes y recursos persuasivos.'],
    ['Recursos visuales', 'Contrasta la relación entre texto y elementos visuales.'],
    ['Eficacia comunicativa', 'Valora cuál afiche comunica mejor su mensaje.'],
    ['Justificación', 'Sustenta su valoración con evidencias de ambos afiches.'],
  ] : poster && oral ? [
    [`Mensaje sobre ${posterTopic}`, `Explica el mensaje de su afiche sobre ${posterTopic}.`],
    ['Propósito y público', 'Explica a quién se dirige y cómo busca motivar o convencer.'],
    ['Decisiones comunicativas', 'Justifica la elección de palabras y elementos visuales.'],
    ['Presentación oral', 'Expone con orden, dicción, volumen y ritmo comprensibles.'],
    ['Dominio individual', 'Responde preguntas sobre su propio afiche.'],
  ] : poster ? [
    [`Mensaje sobre ${posterTopic}`, `Comunica acciones o ideas pertinentes sobre ${posterTopic} mediante un mensaje breve y persuasivo.`],
    ['Adecuación al público', 'Adapta el vocabulario, el tono y el llamado a la acción al público indicado.'],
    ['Recursos persuasivos', 'Usa recomendaciones o argumentos pertinentes sin inventar datos.'],
    ['Texto y elementos visuales', graphicsRequested ? 'Integra las imágenes solicitadas con el texto para reforzar el mensaje.' : 'Organiza el texto y los elementos visuales elegidos para reforzar el mensaje.'],
    ['Organización y legibilidad', 'Presenta información clara, jerarquizada y con ortografía cuidada.'],
  ] : touristGuide && analyzing ? [
    ['Propósito y destinatario', 'Explica cómo la guía orienta e informa a sus posibles visitantes.'],
    ['Identificación de la estructura', 'Identifica portada, información, imágenes y cierre, según estén presentes en la guía leída.'],
    ['Recursos para orientar', 'Analiza el vocabulario y los recursos paratextuales disponibles usados para orientar al visitante.'],
    ['Interpretación', 'Explica la información relevante sobre los lugares descritos.'],
  ] : touristGuide && oral ? [
    ['Información de los lugares', 'Presenta información pertinente y veraz sobre los lugares solicitados.'],
    ['Orientación al visitante', 'Describe atractivos y cualidades con vocabulario adecuado al público.'],
    ['Organización oral', 'Ordena la información de la guía en una secuencia clara.'],
    ['Comunicación oral', 'Expone con dicción, volumen, ritmo y entonación comprensibles.'],
    ['Dominio individual', 'Explica los lugares asignados desde su propio dominio del contenido.'],
  ] : touristGuide && comparing ? [
    ['Propósito y destinatario', 'Compara el propósito y el público de cada guía turística.'],
    ['Comparación del contenido', 'Establece semejanzas y diferencias entre la información y los atractivos.'],
    ['Comparación de la estructura', 'Contrasta la organización de las guías.'],
    ['Comparación de recursos', 'Analiza el vocabulario y los recursos usados para orientar al visitante.'],
    ['Conclusión sustentada', 'Formula una conclusión apoyada en evidencias de ambas guías.'],
  ] : touristGuide ? [
    ['Información de los lugares', 'Incluye información pertinente y veraz sobre los lugares solicitados.'],
    ['Estructura de la guía', `Organiza la guía con portada, información y cierre${graphicsRequested ? ', e integra las imágenes solicitadas' : ''}.`],
    ['Descripción y orientación', 'Describe los lugares con vocabulario atractivo y adecuado al público.'],
    ['Organización y claridad', 'Distribuye la información en una secuencia comprensible.'],
    ['Revisión final', 'Revisa claridad, puntuación, ortografía y presentación antes de publicar.'],
  ] : news && analyzing ? [
    ['Función de la noticia', 'Reconoce el propósito informativo y el hecho principal de la noticia.'],
    ['Partes de la noticia', 'Identifica titular, entrada o copete y cuerpo en el texto analizado.'],
    ['Interrogantes fundamentales', 'Localiza qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.'],
    ['Interpretación de la información', 'Explica la información principal con evidencias de la noticia.'],
  ] : news && comparing ? [
    ['Propósito y hecho de ambas noticias', 'Identifica el hecho y el propósito informativo de cada noticia.'],
    ['Semejanzas y diferencias', 'Compara los datos y enfoques de ambas noticias.'],
    ['Estructura periodística', 'Contrasta el titular, la entrada y el cuerpo de los dos textos.'],
    ['Evidencias de ambos textos', 'Sustenta la comparación con datos concretos de las dos noticias.'],
    ['Conclusión comparativa', 'Formula una conclusión coherente con los hallazgos.'],
  ] : news && oral ? [
    ['Información periodística', 'Presenta hechos relevantes y distingue la información principal de los detalles.'],
    ['Estructura de la noticia', 'Comunica un titular y desarrolla qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.'],
    ['Organización del noticiero', 'Ordena las noticias y las intervenciones en una secuencia clara.'],
    ['Comunicación oral', 'Presenta con dicción, ritmo, entonación y volumen comprensibles.'],
    ['Dominio individual', 'Explica la información de su noticia y permite reconocer su aportación dentro de la presentación del equipo.'],
  ] : news ? [
    ['Información esencial', 'Redacta un hecho noticioso claro y responde qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.'],
    ['Titular, entrada y cuerpo', 'Organiza la noticia con un titular pertinente, una entrada informativa y un cuerpo desarrollado.'],
    ['Secuencia y cohesión', 'Ordena la información y usa conectores de orden y temporales.'],
    ['Lenguaje periodístico', 'Emplea un registro formal y vocabulario preciso.'],
    ['Revisión escrita', 'Revisa puntuación, ortografía y claridad antes de presentar la versión final.'],
  ] : generic ? generic.map(({ title, description }) => [title, description]) : [
    ['Dominio del contenido', `Explica con precisión el contenido trabajado en ${input.activityTitle}.`],
    ['Desarrollo de la actividad', 'Realiza la tarea principal solicitada y presenta evidencia observable.'],
    ['Organización', 'Organiza la información o el producto en una secuencia comprensible.'],
    ['Comunicación', 'Comunica el resultado con claridad y vocabulario adecuado.'],
  ]
  if (input.variation && readingReport && !analyzing && !comparing && !oral) {
    authored.splice(0, authored.length,
      ['Identificación de la obra', 'Presenta el título y el autor del cuento e identifica el texto elegido.'],
      ['Síntesis de acontecimientos', 'Reconstruye los acontecimientos principales en orden sin sustituirlos por opiniones.'],
      ['Caracterización de personajes', 'Describe los personajes y relaciona sus acciones con la historia.'],
      ['Interpretación de valores', 'Analiza valores o situaciones sociales con ejemplos del cuento.'],
      ['Conclusión argumentada', 'Expresa una interpretación personal apoyada en el resumen y el análisis.'],
      ['Organización y revisión', 'Organiza el informe y revisa conectores, puntuación y ortografía.'])
  }
  const totalUnits = Math.round(input.maxScore * 100)
  const base = Math.floor(totalUnits / authored.length)
  const levels = input.instrumentType === 'rubrica' || input.instrumentType === 'escala'
    ? ['Destacado', 'Logrado', 'En proceso', 'Inicial'].map((label, index) => ({ id: `L${4 - index}`, label, proportion: (3 - index) / 3 })) : []
  const reportProgressions: Record<string, [string, string, string]> = {
    'Resumen del texto': ['Recupera los acontecimientos principales, aunque omite un detalle relevante.', 'Menciona hechos aislados o altera parte de su secuencia.', 'No identifica todavía los acontecimientos centrales del cuento.'],
    'Análisis de los personajes': ['Explica las acciones de los personajes con al menos un ejemplo pertinente.', 'Describe personajes sin relacionar claramente sus acciones con el cuento.', 'No caracteriza todavía a los personajes ni aporta ejemplos del texto.'],
    'Estructura del informe': ['Incluye las secciones principales, aunque una necesita mayor desarrollo.', 'Presenta secciones incompletas o en un orden que dificulta la lectura.', 'No distingue todavía las partes necesarias del informe.'],
    'Conclusión personal': ['Expresa una interpretación propia vinculada al texto, con apoyo limitado en el análisis.', 'Formula una opinión general sin relacionarla con el resumen y el análisis.', 'No presenta todavía una interpretación personal del cuento.'],
    'Coherencia': ['Relaciona las ideas principales con conectores adecuados, aunque hay transiciones mejorables.', 'Salta entre ideas o emplea conectores que no expresan la relación buscada.', 'Las ideas todavía no forman una secuencia comprensible.'],
    'Revisión final': ['Corrige la mayoría de los problemas de puntuación y ortografía; quedan detalles menores.', 'Conserva errores frecuentes que dificultan partes del informe.', 'No revisa todavía los errores que impiden comprender el escrito.'],
    'Identificación de la obra': ['Nombra la obra y su autor, aunque falta precisar un dato de identificación.', 'Identifica la obra o el autor, pero omite el otro dato.', 'No identifica todavía la obra elegida ni su autor.'],
    'Síntesis de acontecimientos': ['Presenta los hechos centrales en orden con una omisión menor.', 'Recupera algunos hechos, pero confunde el orden o añade opiniones como hechos.', 'No reconstruye todavía los acontecimientos principales.'],
    'Caracterización de personajes': ['Describe personajes y relaciona la mayoría de sus acciones con el cuento.', 'Enumera personajes sin explicar sus acciones en la historia.', 'No describe todavía los personajes del cuento.'],
    'Interpretación de valores': ['Relaciona un valor o situación social con un ejemplo del cuento.', 'Menciona un valor sin explicar cómo aparece en la historia.', 'No identifica todavía valores o situaciones sociales del cuento.'],
    'Conclusión argumentada': ['Expresa una interpretación propia con una referencia pertinente al cuento.', 'Incluye una opinión personal sin apoyarla en el análisis.', 'No formula todavía una conclusión personal.'],
    'Organización y revisión': ['Ordena las secciones y corrige la mayoría de los errores formales.', 'Presenta secciones desordenadas o errores que dificultan algunos pasajes.', 'No organiza ni revisa todavía el informe.'],
  }
  const criteria = authored.map(([title, description], index) => {
    const maxScoreUnits = base + (index < totalUnits - base * authored.length ? 1 : 0)
    const progression = readingReport ? reportProgressions[title] : undefined
    return { id: `fallback:${generic?.[index].id ?? index}`, templateId: generic?.[index].id ?? 'editable-fallback', title, description, maxScore: maxScoreUnits / 100, maxScoreUnits,
      sourceType: 'ACTIVITY_TEMPLATE' as const, sourceReferences: [], descriptors: levels.map(level => ({ levelId: level.id,
        text: generic ? generic[index].descriptors[4 - Number(level.id.slice(1))] : level.id === 'L4' ? description : progression ? progression[level.id === 'L3' ? 0 : level.id === 'L2' ? 1 : 2]
          : level.id === 'L3' ? input.variation ? `${description} Cumple la mayor parte de lo solicitado; necesita precisar un detalle.` : `${description} Incluye la evidencia principal, con detalles por precisar.`
            : level.id === 'L2' ? input.variation ? `${description} Desarrolla un aspecto reconocible, pero omite otros necesarios.` : `${description} Incluye solo parte de la evidencia o presenta errores que afectan su sentido.`
              : input.variation ? `${description} La evidencia presentada todavía no permite comprobarlo.` : `${description} Aún no aporta evidencia suficiente de este criterio.`,
        scoreUnits: Math.round(maxScoreUnits * level.proportion) })) }
  })
  return { kind: 'RECOMMENDATION', catalogVersion: 'editable-fallback-v1', instrumentType: input.instrumentType, confidence: 'LOW', activityType: input.activityType || (generic ? genericActivity : 'OTHER'), evidenceTypes: ['KNOWLEDGE', 'PERFORMANCE', 'PRODUCT'], participationMode: input.participationMode,
    curriculumVersionId: null, curriculumScopeId: null, selectedCurriculumElements: [], criteria, levels, totalScore: input.maxScore,
    totalScoreUnits: criteria.reduce((sum, item) => sum + item.maxScoreUnits, 0), scoreUnit: 0.01,
    internalTrace: { mappingStatus: 'FALLBACK', reasons: ['Plantilla editable local basada en la actividad; requiere revisión docente.'], ruleId: 'editable-fallback', activityTypeOrigin: 'DEFAULT', ranking: [], curriculumStatus: null, lowCurriculumConfidence: true, consideredTypes: [] } }
}

/** Adapter into the existing four builders; no second instrument editor is created. */
export function recommendationToFields(proposal: InstrumentRecommendation, activityName: string): Record<string, string> {
  const type = proposal.instrumentType
  const fields: Record<string, string> = {
    [`${type}:title`]: `${type === 'rubrica' ? 'Rúbrica' : type === 'escala' ? 'Escala estimativa' : type === 'lista-cotejo' ? 'Lista de cotejo' : 'Lista ponderada'} para ${activityName}`,
    [`${type}:meta:criteriaCount`]: String(proposal.criteria.length),
    [`${type}:meta:prepared`]: 'true',
    [`${type}:meta:catalogVersion`]: proposal.catalogVersion,
  }
  if (type === 'rubrica' || type === 'escala') {
    fields[`${type}:meta:levelCount`] = String(proposal.levels.length)
    for (const [index, level] of proposal.levels.entries()) {
      const score = proposal.levels.length - index
      fields[`${type}:level-name:${score}`] = level.label
      fields[`${type}:level-points:${score}`] = String(level.proportion * (type === 'rubrica' ? proposal.levels.length - 1 : proposal.levels.length))
    }
  }
  if (type === 'lista-cotejo') fields['lista-cotejo:meta:pointsMode'] = 'individual'
  if (type === 'lista-ponderada') fields['lista-ponderada:meta:partial'] = 'true'
  for (const [index, criterion] of proposal.criteria.entries()) {
    fields[`${type}:criterion-id:${index}`] = criterion.id
    fields[`${type}:criterion-template:${index}`] = criterion.templateId
    if (criterion.relativeWeight) fields[`${type}:criterion-weight:${index}`] = String(criterion.relativeWeight)
    if (criterion.progressionLevels) fields[`${type}:criterion-evidence:${index}`] = JSON.stringify({title:criterion.title,description:criterion.description,progression:criterion.progressionLevels})
    fields[`${type}:criterion:${index}`] = criterion.title
    fields[`${type}:description:${index}`] = criterion.description
    fields[`${type}:points:${index}`] = String(criterion.maxScoreUnits / 100)
    if (type === 'lista-ponderada') {
      fields[`${type}:indicator:${index}`] = criterion.description
      fields[`${type}:weight:${index}`] = String(Math.round(criterion.maxScoreUnits / proposal.totalScoreUnits * 10000) / 100)
    }
    if (type === 'rubrica') for (const [levelIndex, descriptor] of criterion.descriptors.entries()) {
      fields[`rubrica:descriptor:${index}:${proposal.levels.length - levelIndex}`] = descriptor.text
    }
    if (type === 'escala' && criterion.descriptors.length === proposal.levels.length) for (const [levelIndex, descriptor] of criterion.descriptors.entries()) {
      fields[`escala:descriptor:${index}:${proposal.levels.length - levelIndex}`] = descriptor.text
    }
  }
  if (type === 'lista-ponderada') {
    const authored = proposal.criteria.every(criterion => Number.isFinite(criterion.relativeWeight) && criterion.relativeWeight! > 0)
    const weights = distributeScoreUnits(10000, proposal.criteria.map(criterion => authored ? criterion.relativeWeight! : criterion.maxScoreUnits))
    weights.forEach((weight, index) => { fields[`${type}:weight:${index}`] = String(weight / 100) })
  }
  return fields
}

export function alignRecommendationWithFields(proposal: InstrumentRecommendation, fields: Record<string, string>, maxScore: number): InstrumentRecommendation | null {
  const type = proposal.instrumentType
  if (validateInstrumentDefinition(type, fields, maxScore).length) return null
  const configuration = instrumentEvaluationConfiguration(type, fields, maxScore)
  const top = Math.max(...configuration.levels.map(level => level.points))
  const levels = configuration.levels.map((level, index) => ({ id: `L${configuration.levels.length - index}`, label: level.label, proportion: level.points / top }))
  const used = new Set<string>()
  const criteria = configuration.criteria.map((criterion, index) => {
    // Legacy rows without IDs can match content; never inherit attribution by position.
    const matches = proposal.criteria.filter(prior => !used.has(prior.id) && (criterion.id
      ? prior.id === criterion.id
      : prior.title === criterion.title && prior.description === criterion.description))
    const prior = matches.length === 1 ? matches[0] : undefined
    if (prior) used.add(prior.id)
    const units = Math.round(criterion.maximum * 100)
    const descriptors = levels.map((level, levelIndex) => ({ levelId: level.id,
      text: criterion.descriptors?.[levelIndex] ?? criterion.description, scoreUnits: Math.round(units * level.proportion) }))
    const edited = !prior || prior.title !== criterion.title || prior.description !== criterion.description
      || ((type === 'rubrica' || type === 'escala') && descriptors.some((descriptor, levelIndex) => descriptor.text !== prior.descriptors[levelIndex]?.text))
    return { id: prior?.id ?? criterion.id ?? `teacher:${index}`, templateId: prior?.templateId ?? 'teacher',
      ...(prior?.relativeWeight ? {relativeWeight:prior.relativeWeight} : {}),
      title: criterion.title, description: criterion.description, maxScore: units / 100, maxScoreUnits: units,
      sourceType: edited ? 'ACTIVITY_TEMPLATE' as const : prior.sourceType,
      sourceReferences: edited ? [] : prior.sourceReferences, descriptors }
  })
  if (new Set(criteria.map(criterion => criterion.id)).size !== criteria.length) return null
  const totalScoreUnits = criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0)
  if (totalScoreUnits !== Math.round(maxScore * 100)) return null
  return { ...proposal, criteria, levels, totalScore: maxScore, totalScoreUnits,
    selectedCurriculumElements: [...new Map(criteria.flatMap(criterion => criterion.sourceReferences).map(ref => [ref.elementId, ref])).values()] }
}
