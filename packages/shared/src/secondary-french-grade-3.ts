import { frenchCurriculumRow as row, frenchGrammar, frenchLexicon } from './secondary-french-curriculum'
import { frenchGradeOneFeatures, frenchGradeOneGrammar, frenchGradeOneStrategies } from './secondary-french-grade-1'
import { frenchGradeOneGenres } from './secondary-french-grade-1-details'
import { frenchReceptive, frenchSource, type FrenchFeature } from './secondary-french-task'

export const frenchGradeThreeModule = { id: 'frances-comunicacion-3', grade: 3, subjectCode: 'FRA', pdfPages: [189, 190, 191, 192], policy: 'EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1' }
const functions: FrenchFeature[] = [
  ...frenchGradeOneFeatures.filter(f => f.id === 'location'),
  { id: 'directions', match: /\b(?:indicaciones (?:del|de un|para el) (?:camino|recorrido)|direcciones para llegar|itineraire|indications du chemin|chemin pour|recorrido hasta|trayecto hasta)\b/, criterion: a => row(3, 'directions', 'Relación entre indicaciones y recorrido', [
    frenchReceptive(a.mode) ? `Relaciona las indicaciones francesas del ${frenchSource(a.mode)} con el recorrido y el destino solicitados.` : 'Comunica en francés las indicaciones del recorrido solicitado en una secuencia que permite reconocer cómo llegar al destino.',
    'Se reconoce el recorrido y su destino; una referencia o indicación necesita precisión.',
    'Reconoce o comunica algunos tramos, pero quedan referencias que impiden completar el recorrido.',
    'Confunde las indicaciones y conduce a un destino distinto del solicitado.',
    'No aporta indicaciones que permitan reconocer el recorrido solicitado.',
  ]) },
  { id: 'weather', match: /\b(?:tiempo atmosferico|condiciones atmosfericas|clima|meteo|conditions atmospheriques|temps qu.il fait|phenomenes atmospheriques)\b/, criterion: a => row(3, 'weather', 'Condiciones del tiempo atmosférico', [
    frenchReceptive(a.mode) ? `Reconoce las condiciones atmosféricas y su referencia al lugar o momento indicado en el ${frenchSource(a.mode)} en francés.` : 'Describe en francés las condiciones atmosféricas solicitadas, sin confundir el fenómeno con el lugar o momento al que corresponde.',
    'Se reconoce el tiempo atmosférico descrito; una expresión o referencia necesita precisión.',
    'Nombra fenómenos aislados, pero no permite reconocer por completo las condiciones solicitadas.',
    'Confunde los fenómenos atmosféricos o los atribuye a otro lugar o momento.',
    'No aporta condiciones atmosféricas reconocibles en francés.',
  ]) },
  { id: 'ongoing', match: /\b(?:actividades (?:en curso|que se estan llevando a cabo)|acciones (?:en curso|en progreso)|activites en cours|actions en cours|ce que .{0,25}fait maintenant)\b/, criterion: a => row(3, 'ongoing', 'Acciones que se realizan ahora', [
    frenchReceptive(a.mode) ? `Identifica qué acción está realizando cada persona según el ${frenchSource(a.mode)} en francés.` : 'Comunica en francés las acciones en curso solicitadas, relacionando qué se está haciendo con quien realiza cada acción ahora.',
    'Se reconocen las acciones en curso; una referencia a quien actúa necesita precisión.',
    'Identifica o expresa algunas acciones, pero no deja claro cuáles ocurren ahora o quién las realiza.',
    'Confunde acciones habituales o futuras con las que se están realizando.',
    'No se reconoce una acción en curso vinculada con la situación solicitada.',
  ]) },
  { id: 'future', match: /\b(?:planes futuros|planes para|projets futurs|projets pour|plans futurs|activites prevues)\b/, criterion: a => row(3, 'future', 'Acciones previstas para el futuro', [
    frenchReceptive(a.mode) ? `Distingue las acciones previstas y las referencias futuras solicitadas en el ${frenchSource(a.mode)} en francés.` : 'Expresa en francés los planes solicitados como acciones previstas, diferenciándolas de lo que sucede ahora o habitualmente.',
    'Se reconocen los planes futuros; una acción o referencia temporal necesita precisión.',
    'Menciona actividades, pero solo parte queda identificada como un plan futuro.',
    'Presenta los planes como hechos actuales o habituales y cambia su referencia temporal.',
    'No se reconocen acciones previstas para el futuro solicitado.',
  ]) },
]
export const frenchGradeThreeFeatures = [
  ...functions,
  ...frenchGradeOneGrammar.filter(f => ['grammar-present', 'grammar-imperative', 'grammar-prepositions'].includes(f.id)),
  ...frenchGrammar(3, [
    ['negation', 'negacion|negation|ne.{0,5}pas', 'Información negada', 'distingue la información negada con la estructura solicitada ne…pas', 'Reconoce parte de la información, pero no mantiene con claridad qué se niega.'],
    ['questions', 'formas de interrogacion|formes de l.interrogation|frases interrogativas|phrases interrogatives', 'Formas de interrogación', 'mantiene la información que se pregunta en las formas de interrogación solicitadas', 'La pregunta es reconocible, pero algunas formas cambian la información solicitada.'],
    ['pronouns', 'pronombres interrogativos|pronoms interrogatifs', 'Referencia de los interrogativos', 'vincula el pronombre interrogativo solicitado con la información que se desea obtener', 'La pregunta es reconocible, pero varios interrogativos solicitan otro tipo de información.'],
    ['exclamation', 'exclamaciones|oraciones exclamativas|phrases exclamatives|exclamations', 'Sentido de la exclamación', 'relaciona la expresión exclamativa solicitada con la reacción que comunica', 'Se reconoce la reacción, pero varias expresiones no mantienen su sentido exclamativo.'],
    ['contracted', 'articulos contractos|articles contractes', 'Artículos contractos', 'relaciona las contracciones solicitadas de artículo y preposición con el sustantivo y su relación en la frase', 'Reconoce el sustantivo, pero confunde varias relaciones expresadas por la contracción.'],
    ['adverbs', 'adverbios|adverbes', 'Modo de realizar la acción', 'relaciona el adverbio solicitado con la manera en que se realiza la acción', 'Reconoce la acción, pero no distingue el modo expresado por varios adverbios.'],
    ['impersonal', 'verbos impersonales|verbes impersonnels', 'Fenómeno expresado por el verbo impersonal', 'relaciona el verbo impersonal solicitado con el fenómeno atmosférico correspondiente', 'Reconoce un fenómeno, pero confunde varias expresiones impersonales.'],
    ['ongoing', 'etre en train de', 'Expresión de una acción en curso', 'relaciona être en train de y el infinitivo solicitados con la acción en desarrollo y su sujeto', 'Se reconoce la acción, pero la estructura no deja clara su referencia al momento actual.'],
    ['near-future', 'futuro proximo|futur proche|aller.{0,5}infinitiv\w*', 'Expresión del futuro próximo', 'relaciona aller y el infinitivo solicitados con la acción prevista y su sujeto', 'Se reconoce la acción, pero la construcción no mantiene con claridad su referencia futura.'],
    ['presentative', 'presentativo|presentatif|il y a.{0,10}il n.y', 'Existencia y ausencia', 'distingue existencia y ausencia mediante los presentativos solicitados', 'Reconoce los elementos mencionados, pero no distingue con claridad su existencia o ausencia.'],
  ]),
  ...frenchLexicon(3, [
    ['places', 'ciudades|paises|continentes|villes|pays|continents', 'ciudades, países y continentes'],
    ['cardinal', 'puntos cardinales|points cardinaux', 'puntos cardinales'],
    ['city', 'lugares de la ciudad|comercios|sitios de interes|lieux de la ville|commerces|lieux d.interet', 'lugares y servicios de la ciudad'],
    ['transport', 'medios de transporte|moyens de transport', 'medios de transporte'],
    ['measures', 'unidades metricas|unites metriques', 'unidades métricas'],
    ['numbers', 'numeros cardinales|numeros ordinales|nombres cardinaux|nombres ordinaux', 'números solicitados'],
    ['courtesy', 'cortesia|politesse', 'cortesía'],
    ['geography', 'accidentes geograficos|elements geographiques', 'accidentes geográficos'],
    ['weather', 'fenomenos atmosfericos|phenomenes atmospheriques|temperatura|temperature', 'fenómenos y temperatura'],
    ['seasons', 'estaciones del ano|saisons', 'estaciones del año'],
    ['daily', 'actividades cotidianas|activites quotidiennes', 'actividades cotidianas'],
    ['leisure', 'ocio|loisirs|tiempo libre', 'actividades de tiempo libre'],
    ['school', 'actividades del aula|activites de classe', 'actividades del aula'],
    ['dates', 'fechas importantes|celebraciones|dates importantes|fetes', 'fechas y celebraciones'],
    ['time', 'momentos del dia|expresiones de tiempo|moments de la journee|expressions de temps', 'referencias temporales'],
  ]),
  ...frenchGradeOneGenres.filter(f => f.id !== 'card'), ...frenchGradeOneStrategies,
]
