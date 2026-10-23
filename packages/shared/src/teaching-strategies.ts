import { frenchRequirementText } from './secondary-french-task'
import {resolveFirstGradeTransversalTask} from './secondary-language-grade-one-transversal'
/** Pedagogical strategies/teaching techniques; never evaluation criteria or techniques. */
export type TeachingStrategyOrigin = 'AUTO' | 'MANUAL' | 'UNKNOWN'
export type TeachingStrategyContext = { level?: string | null; grade?: number | null; subjectCode?: string | null; optativeExitName?:string|null }
export type TeachingStrategy = {
  id: string; name: string; aliases: string[]; definition: string
  traits: string[]; exclusions: string[]; sources: { document: string; url: string; location: string }[]
  provenance: 'CURRICULAR' | 'COMPLEMENTARY'; kind: 'STRATEGY' | 'TEACHING_TECHNIQUE'
  levels?: string[]; subjectCodes?: string[]
}
export const teachingStrategyCatalogVersion = 'teaching-strategies-2026.1'
const bases = 'https://www.ministeriodeeducacion.gob.do/docs/direccion-general-de-curriculo/PnHJ-bases-de-la-revision-y-actualizacion-curricularpdf.pdf'
const design = 'https://www.ministeriodeeducacion.gob.do/docs/direccion-general-de-educacion-media/G9Ph-diseno-curricular-modalidad-academicapdf.pdf'
const adequacy = 'https://ministeriodeeducacion.gob.do/docs/direccion-general-de-curriculo/Ht7X-adecuacion-secundaria-2023pdf.pdf'
function entry(id: string, name: string, aliases: string[], definition: string, traits: string[], exclusions: string[], page: number, basesPage?: number, kind: TeachingStrategy['kind'] = 'STRATEGY'): TeachingStrategy {
  return {id, name, aliases, definition, traits, exclusions, provenance:'CURRICULAR', kind,
    sources:[{document:'Adecuación Curricular, Nivel Secundario (2023)',url:adequacy,location:`PDF ${page}; impresa ${page-1}`},
      {document:'Diseño Curricular, Nivel Secundario, Modalidad Académica',url:design,location: id==='DIALOGIC_INQUIRY'?'PDF 45–46':id==='PROBLEM_BASED'?'PDF 46–47':id==='CASE_STUDY'?'PDF 47–48':id==='PROJECT_BASED'?'PDF 48–49':id==='DEBATE'?'PDF 50–51':page===29?'PDF 52':'PDF 51–52'},
      ...(basesPage?[{document:'Bases de la Revisión y Actualización Curricular (2016)',url:bases,location:`PDF ${basesPage}; impresa ${basesPage}`}]:[])],
    ...(!basesPage?{levels:['SECONDARY']}:{}),
  }
}
export const teachingStrategies: readonly TeachingStrategy[] = [
  entry('PRIOR_EXPERIENCES','Recuperación de experiencias previas',['saberes previos','conocimientos previos'],
    'Relaciona saberes y experiencias del alumnado con el nuevo aprendizaje.', ['recuperar vivencias','relacionar saberes previos'],['Recordar un dato aislado no prueba esta estrategia.'],28,53),
  entry('EXPOSITORY','Expositivas de conocimientos elaborados o acumulados',['estrategia expositiva','exposición de conocimientos'],
    'Organiza la enseñanza de conocimientos mediante explicación y recursos pertinentes.', ['explicación organizada','mediación para comprender conocimientos'],['Una presentación estudiantil aislada no describe el proceso de enseñanza.'],28,53),
  entry('INQUIRY','Descubrimiento e indagación',['indagación','aprendizaje por descubrimiento'],
    'Construye explicaciones mediante preguntas, búsqueda y contraste de información o experimentación.', ['preguntas o hipótesis','investigar y contrastar'],['Mencionar investigación como objeto de lectura o un recurso no basta.'],28,53),
  entry('ENVIRONMENT_IMMERSION','Inserción en el entorno',['inserción en el entorno','aprendizaje en el entorno'],
    'Vincula el aprendizaje con el intercambio e intervención en el contexto de la comunidad.', ['contacto con el entorno','intercambio o propuestas contextualizadas'],['Una salida recreativa sin propósito de aprendizaje no basta.'],28,54),
  entry('GROUP_SOCIALIZATION','Socialización centrada en actividades grupales',['socialización grupal','socialización centrada en actividades grupales'],
    'Construye aprendizajes mediante intercambio de opiniones, aportes y acuerdos.', ['intercambio de aportes','conclusiones compartidas'],['La modalidad grupal por sí sola no demuestra socialización ni aprendizaje cooperativo.'],28,54),
  entry('DIALOGIC_INQUIRY','Indagación dialógica o cuestionamiento',['diálogo socrático','indagación dialógica','cuestionamiento'],
    'Guía la reflexión y comprensión mediante preguntas y diálogo abierto.', ['preguntas abiertas','diálogo guiado'],['Un cuestionario de respuestas cerradas no implica diálogo.'],24,54),
  entry('PROBLEM_BASED','Aprendizaje basado en problemas',['ABProblemas','aprendizaje basado en problemas'],
    'Parte de una situación problemática para investigar lo necesario y construir soluciones.', ['problema contextualizado','hipótesis e investigación','alternativas de solución'],['Los ejercicios rutinarios de aplicación no bastan.','ABP solo es ambiguo entre problemas y proyectos.'],25,54),
  entry('PROJECT_BASED','Aprendizaje basado en proyectos',['ABProyectos','aprendizaje basado en proyectos'],
    'Articula planificación, investigación y realización de un resultado para atender una necesidad real.', ['necesidad contextual','planificación e investigación','producto o intervención'],['Un producto aislado o llamar proyecto a una tarea no basta.'],26,55),
  entry('CASE_STUDY','Estudio de caso',['estudio de casos','análisis de caso'],
    'Analiza una situación concreta con datos para construir decisiones y recomendaciones razonadas.', ['caso contextualizado','datos o hechos','decisión fundamentada'],['Decir por ejemplo o en este caso no constituye estudio de caso.'],25,55),
  entry('DRAMATIZATION','Sociodrama o dramatización',['sociodrama','dramatización'],
    'Representa situaciones o hechos mediante personajes, roles y diálogo.', ['representación de una situación','personajes y diálogo'],['Leer sobre teatro sin representarlo no implica dramatización.'],28,55,'TEACHING_TECHNIQUE'),
  entry('DEBATE','Debate',['debate argumentado'],
    'Contrasta posiciones mediante argumentos, evidencias y respuesta al interlocutor.', ['posturas contrapuestas','argumentación y réplica'],['Opinar sin contraste o leer un debate no equivale a debatir.'],27,56),
  entry('ROUND_TABLE','Mesa redonda',['mesas redondas'],
    'Organiza un intercambio moderado de perspectivas sobre un asunto.', ['intercambio de perspectivas','moderación'],['Un grupo sentado en círculo no basta.'],29,undefined,'TEACHING_TECHNIQUE'),
  entry('SYMPOSIUM','Simposio',['simposios'],
    'Reúne exposiciones de distintas perspectivas de un tema para el aprendizaje.', ['exposiciones complementarias','tema común'],['Una exposición individual no constituye un simposio.'],29,undefined,'TEACHING_TECHNIQUE'),
  entry('FORUM','Foro',['foros','foro de discusión'],
    'Abre discusión y respuesta entre participantes para intercambiar perspectivas.', ['aportes y respuestas','discusión'],['Una plataforma llamada foro sin intercambio no basta.'],29,undefined,'TEACHING_TECHNIQUE'),
  entry('WORKSHOP','Taller',['talleres'],
    'Organiza práctica orientada y revisión de lo realizado para aprender haciendo.', ['práctica guiada','revisión o retroalimentación'],['La palabra taller como nombre de un local o lista de ejercicios no basta.'],29,undefined,'TEACHING_TECHNIQUE'),
  entry('SIMULATION','Simulación',['simulaciones','juego de roles','role play','role-play'],
    'Practica decisiones o interacciones mediante una situación representada.', ['situación simulada','roles o decisiones'],['Usar un simulador como recurso sin actividad de aprendizaje no basta.'],29,undefined,'TEACHING_TECHNIQUE'),
]
export const normalizeTeachingStrategyText = (value: string) => value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
export function resolveTeachingStrategy(value: string) {
  const key = normalizeTeachingStrategyText(value)
  return teachingStrategies.find(s=>[s.id,s.name,...s.aliases].some(alias=>normalizeTeachingStrategyText(alias)===key)) ?? null
}
export function teachingStrategyAllowed(id: string, context: TeachingStrategyContext) {
  const strategy = teachingStrategies.find(s=>s.id===id)
  return Boolean(strategy && (!strategy.levels || strategy.levels.includes(context.level ?? '')) &&
    (!strategy.subjectCodes || strategy.subjectCodes.includes(context.subjectCode ?? '')))
}

function taskText(value: string) {
  // Preserve paragraph boundaries, discard resource lists and explicitly negated clauses.
  return normalizeTeachingStrategyText(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ')
    .replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&')
    .replace(/(?:recursos?\s*:|como recurso|con apoyo de)[^.;\n]*/gi,'')
    .replace(/\b(?:como ejemplo|por ejemplo|a modo de ejemplo)[^.;\n]*/gi,'')
    .split(/[.;\n]+/).filter(part=>! /\b(?:no|sin)\b/i.test(part)).join('. '))
}
export function detectTeachingStrategy(input: TeachingStrategyContext & {title?: string; description?: string; activityType?: string; participationMode?: string}) {
  const transversal=input.level==='SECONDARY'&&input.grade===1&&input.subjectCode?.toUpperCase()==='LEN'
    ?resolveFirstGradeTransversalTask(input.title??'',input.description??'',{level:'SECONDARY',grade:1,subjectCode:'LEN',optativeExitName:input.optativeExitName}):null
  const text = transversal?.family==='ARGUMENT'?transversal.task:taskText(input.subjectCode?.toUpperCase() === 'FRA' ? frenchRequirementText(input.description ?? '') : input.description ?? '')
  const title = taskText(input.title ?? '')
  const has=(pattern:RegExp)=>pattern.test(text)
  const candidates:{id:string;reason:string;score:number}[]=[]
  const add=(id:string,condition:boolean,reason:string,score=1)=>{
    if(condition&&teachingStrategyAllowed(id,input))candidates.push({id,reason,score})
  }
  // Describing a strategy as a text's subject is not evidence of applying it.
  if(!text || /\b(?:leen|leer|resumen|resumir|definicion)\b.*\b(?:sobre|definicion de)\b.*(?:aprendizaje basado|estrategia|debate|sociodrama)/.test(text))
    return {id:null,confidence:'NONE' as const,reasons:[] as string[],catalogVersion:teachingStrategyCatalogVersion}
  add('CASE_STUDY',has(/\bcaso\b/)&&has(/\b(?:real|concreto|datos|hechos)\b/)&&has(/decisi\w*|recomenda\w*|alternativas?/)&&has(/justific\w*|razon\w*|fundament\w*/),'Caso con evidencia y decisión fundamentada.',3)
  add('PROJECT_BASED',has(/necesidad|problema.*(?:comunidad|entorno|real)/)&&has(/planific\w*|plane\w*/)&&has(/investig\w*/)&&has(/producto|elabor\w*|implement\w*|intervencion/),'Necesidad, planificación, investigación y resultado.',3)
  add('PROBLEM_BASED',has(/problema.*(?:vida|cotidian\w*|real|comunidad)/)&&has(/hipotesis|preguntas/)&&has(/investig\w*|recopil\w*/)&&has(/soluci\w*|alternativas/),'Problema como punto de partida con investigación de soluciones.',2)
  add('DIALOGIC_INQUIRY',has(/dialog\w*/)&&has(/preguntas.*(?:abiertas|guiadas)|socratic\w*/),'Diálogo reflexivo guiado por preguntas.',2)
  add('DEBATE',has(/\b(?:debaten|debatiran|debatir|debatimos)\b|(?:organiz\w*|reali[cz]\w*|particip\w*|prepar\w*).*debate|defiend\w*.*posturas/)&&has(/argument\w*|replic\w*|posturas.*opuestas/),'Contraste argumentado de posiciones.',2)
  add('DRAMATIZATION',has(/dramatiz\w*|sociodrama|represent\w*.*(?:situacion|hecho)/)&&has(/personajes|roles|dialog\w*/),'Representación con personajes o roles.',2)
  add('ENVIRONMENT_IMMERSION',has(/visit\w*|insercion|recorren/)&&has(/comunidad|entorno|habitantes/)&&has(/dialog\w*|intercamb\w*|soluci\w*|propon\w*/),'Contacto e intercambio con el entorno.',2)
  add('PRIOR_EXPERIENCES',has(/recuper\w*|activ\w*|compart\w*|relacion\w*/)&&has(/experiencias previas|saberes previos|conocimientos previos|lo que ya saben/),'Activación explícita de saberes y experiencias.',2)
  add('EXPOSITORY',has(/(?:docente|profesor\w*|invitad\w*) (?:explica\w*|expone\w*)/)&&has(/organizad\w*|sistematiz\w*|conocimientos.*elaborados/),'Explicación organizada como mediación de enseñanza.',2)
  add('GROUP_SOCIALIZATION',has(/compart\w*|intercamb\w*/)&&has(/opiniones|aportes/)&&has(/acuerd\w*|conclusiones|puesta en comun/),'Intercambio de aportes y construcción compartida.')
  add('INQUIRY',has(/preguntas|hipotesis|explicaciones/)&&has(/busc\w*|investig\w*|experiment\w*/)&&has(/contrast\w*|comprob\w*|verific\w*|conclusion\w*/),'Preguntas, búsqueda y contraste de explicaciones.')
  add('ROUND_TABLE',has(/(?:realiz\w*|organiz\w*|particip\w*).*mesa redonda/)&&has(/moder\w*|perspectivas/),'Mesa redonda con intercambio moderado.',2)
  add('SYMPOSIUM',has(/(?:realiz\w*|organiz\w*|particip\w*).*simposio/)&&has(/expos\w*|perspectivas/),'Simposio con exposiciones complementarias.',2)
  add('FORUM',has(/(?:realiz\w*|organiz\w*|particip\w*).*foro/)&&has(/intercamb\w*|respond\w*|discut\w*/),'Foro de intercambio y respuestas.',2)
  add('WORKSHOP',has(/(?:realiz\w*|organiz\w*|particip\w*).*taller/)&&has(/practic\w*|elabor\w*/)&&has(/revis\w*|retroaliment\w*/),'Taller con práctica y revisión.',2)
  const enacted = has(/\b(?:simul(?:an|aran|ar|en|ez|er|ent|ons)|realiz\w*|represent\w*|practic\w*|dialog(?:an|aran|uen)|asum\w*|interpret\w*)\b/)
  const complementary = has(/\bpregunt\w*\b/)&&has(/\brespond\w*\b/)
    || has(/\buno\b.*\botro\b/)&&has(/entrevist\w*|vendedor|comprador|cliente|roles|papeles/)
  const exchange = has(/\b(?:intercambi\w*|altern\w*|cambi\w*)\s+(?:(?:los|sus|de|ambos)\s+)?(?:roles|papeles)\b/)
  add('SIMULATION',enacted && (has(/simul\w*|juego de roles|role play/)&&has(/\b(?:rol|roles|decision|decisiones|interaccion)\b|practicar.*comunicacion/)
    || has(/dialog\w*|entrevist\w*|situacion/)&&complementary&&exchange),'Práctica de una situación representada con roles, decisiones o interacción.',2)
  candidates.sort((a,b)=>b.score-a.score)
  // A title supports an already evidenced candidate; it never creates one.
  const top=candidates.filter(c=>c.score===candidates[0]?.score)
  const supported=top.filter(c=>{const s=resolveTeachingStrategy(c.id)!;return [s.name,...s.aliases].some(a=>title.includes(normalizeTeachingStrategyText(a)))})
  const chosen=top.length===1?top[0]:supported.length===1?supported[0]:null
  return {id:chosen?.id??null,confidence:chosen?(chosen.score>=2?'HIGH' as const:'MODERATE' as const):'NONE' as const,
    reasons:chosen?[chosen.reason]:[],catalogVersion:teachingStrategyCatalogVersion}
}
