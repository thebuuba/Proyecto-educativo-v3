import type { InstrumentRecommendation } from '@aula/shared'
import {resolveEvaluationTask,secondaryNovelAnalysisCriteria,actionContentCriteria,commonSecondaryLanguageGrade,resolveFirstGradeEnglishTask,firstGradeEnglishCriteria} from '@aula/shared'
import { distributeScoreUnits, instrumentEvaluationConfiguration, validateInstrumentDefinition } from '@aula/shared'
import { editableAuthoredRecommendation, editableSecondaryTopicRecommendation, findSecondaryLanguageTopic, secondGradeNewsCriteria, withoutResources } from '@aula/shared'
import { findSecondaryScienceTopic, secondaryScienceCriteria, scientificTaskType, type InstrumentAcademicContext } from '@aula/shared'
import { firstGradeNewsCriteria, detectSecondaryLanguageActivity, isFirstGradeNewsActivity } from '@aula/shared'
import { firstGradeGuideCriteria, isFirstGradeGuideActivity, firstSecondaryLanguageGenre } from '@aula/shared'
import { firstGradePosterCriteria, isFirstGradePosterActivity } from '@aula/shared'
import { firstGradeDetectiveCriteria, isFirstGradeDetectiveActivity } from '@aula/shared'
import { firstGradeCalligramCriteria, isFirstGradeCalligramActivity } from '@aula/shared'
import { firstGradeReadingReportCriteria } from '@aula/shared'
import { findSecondaryMathTopic, secondaryMathCriteria } from '@aula/shared'
import { api } from '@/services/apiClient'

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

export function interpretActivity(input: { sectionSubjectId: string; activityTitle: string; description?: string; pedagogicalActivityType?: string; competencyBlock?: string }, signal?: AbortSignal) {
  return api.post<ActivityInterpretation>('/evaluation-instruments/interpret', input, { signal })
}

export function prepareInstrument(input: { sectionSubjectId: string; activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'; pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; curriculumVersionId?: string; preferredInstrumentType?: string; selectedCurriculumElementIds?: string[]; includeAdditionalCandidates?: boolean; levelCount?: 4 | 5 }) {
  return api.post<InstrumentRecommendation>('/evaluation-instruments/recommend', input)
}

export function preparationFingerprint(input: { name: string; description: string; maxScore: string; pedagogicalActivityType?: string; activityType: string; instrumentType: string; selectedCurriculumElementIds?: string[] }) {
  return JSON.stringify([input.name, input.description, input.pedagogicalActivityType, input.activityType, input.instrumentType, input.selectedCurriculumElementIds ?? []])
}

export function editableFallbackRecommendation(input: { activityTitle: string; description?: string; maxScore: number; instrumentType: InstrumentRecommendation['instrumentType']; participationMode: 'INDIVIDUAL' | 'GROUP'; activityType?: string; variation?: number; secondaryLanguageGrade?: number; academicContext?: InstrumentAcademicContext | null; includeAdditionalCandidates?: boolean }): InstrumentRecommendation {
  const english=resolveFirstGradeEnglishTask(input.activityTitle,input.description??'',input.academicContext)
  if(english)return editableAuthoredRecommendation(firstGradeEnglishCriteria(english),input,input.activityType??english.activityType,'ingles-comunicacion-1')
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
  const actionCriteria=input.academicContext?.level==='SECONDARY'&&(input.academicContext.subjectCode==='LEN'||resolveEvaluationTask('',input.description??'').product)?actionContentCriteria(resolvedActivity,input.description??''):[]
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
  ] : [
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
    return { id: `fallback:${index}`, templateId: 'editable-fallback', title, description, maxScore: maxScoreUnits / 100, maxScoreUnits,
      sourceType: 'ACTIVITY_TEMPLATE' as const, sourceReferences: [], descriptors: levels.map(level => ({ levelId: level.id,
        text: level.id === 'L4' ? description : progression ? progression[level.id === 'L3' ? 0 : level.id === 'L2' ? 1 : 2]
          : level.id === 'L3' ? input.variation ? `${description} Cumple la mayor parte de lo solicitado; necesita precisar un detalle.` : `${description} Incluye la evidencia principal, con detalles por precisar.`
            : level.id === 'L2' ? input.variation ? `${description} Desarrolla un aspecto reconocible, pero omite otros necesarios.` : `${description} Incluye solo parte de la evidencia o presenta errores que afectan su sentido.`
              : input.variation ? `${description} La evidencia presentada todavía no permite comprobarlo.` : `${description} Aún no aporta evidencia suficiente de este criterio.`,
        scoreUnits: Math.round(maxScoreUnits * level.proportion) })) }
  })
  return { kind: 'RECOMMENDATION', catalogVersion: 'editable-fallback-v1', instrumentType: input.instrumentType, confidence: 'LOW', activityType: input.activityType ?? 'OTHER', evidenceTypes: ['KNOWLEDGE', 'PERFORMANCE', 'PRODUCT'], participationMode: input.participationMode,
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
