import { frenchCurriculumRow as row, frenchGrammar, frenchLexicon } from './secondary-french-curriculum'
import { frenchGradeOneStrategies } from './secondary-french-grade-1'
import { frenchGradeOneGenres } from './secondary-french-grade-1-details'
import { frenchGradeFiveFeatures } from './secondary-french-grade-5'
import { frenchReceptive, frenchSource, type FrenchFeature } from './secondary-french-task'

export const frenchGradeSixModule = { id: 'frances-comunicacion-6', grade: 6, subjectCode: 'FRA', pdfPages: [207, 208, 209], policy: 'EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1' }
const order = /\b(?:pedir|pide\w*|pedido|ordenar|commande\w*)\b[^.;]{0,45}\b(?:platos?|comida|repas|plats?|restaurant|menu)\b/
const functions: FrenchFeature[] = [
  { id: 'travel', match: /\b(?:viajes?|voyages?|alojamiento|hebergement|sejour)\b/, criterion: a => row(6, 'travel', 'Información del viaje o alojamiento solicitado', [
    frenchReceptive(a.mode) ? `Identifica la información solicitada del viaje o alojamiento en el ${frenchSource(a.mode)} en francés, relacionándola con los datos dados.` : 'Comunica o solicita en francés la información del viaje o alojamiento planteado, manteniendo los datos proporcionados en la situación.',
    'Se reconoce la información del viaje o alojamiento; una expresión necesita precisión.',
    'Reconoce o comunica parte de la información, pero algunas relaciones con la situación quedan incompletas.',
    'Cambia los datos y comunica un viaje o alojamiento diferente del planteado.',
    'No aporta información reconocible del viaje o alojamiento solicitado.',
  ]) },
  { id: 'transport', match: /\b(?:servicios? de transporte|services? de transport|medios de transporte|moyens de transport|billetes?|boletos?|billets?)\b/, criterion: a => row(6, 'transport', 'Información del servicio de transporte', [
    frenchReceptive(a.mode) ? `Relaciona la información solicitada del servicio de transporte con los datos del ${frenchSource(a.mode)} en francés.` : 'Comunica o solicita en francés la información requerida del servicio de transporte conservando los datos de la situación.',
    'Se reconoce el servicio y la información solicitada; una expresión necesita precisión.',
    'Expresa o reconoce datos del servicio, pero parte de la información solicitada queda incompleta.',
    'Confunde los datos y los atribuye a un servicio de transporte distinto.',
    'No se reconoce la información solicitada del servicio de transporte.',
  ]) },
  { id: 'opinion', match: /\b(?:opinion(?:es)?|opinions?|avis|point de vue)\b/, criterion: a => row(6, 'opinion', 'Postura expresada sobre el asunto planteado', [
    frenchReceptive(a.mode) ? `Reconoce la postura expresada sobre el asunto planteado en el ${frenchSource(a.mode)} en francés, distinguiéndola de los hechos mencionados.` : 'Expresa en francés una postura reconocible sobre el asunto solicitado y mantiene esa referencia a lo largo de su mensaje.',
    'Se reconoce la postura sobre el asunto; una expresión necesita precisión.',
    'Expresa o identifica una valoración, pero su relación con el asunto queda incompleta o ambigua.',
    'Confunde la postura o la relaciona con otro asunto.',
    'No se reconoce una postura sobre el asunto solicitado.',
  ]) },
  { id: 'opinion-reason', match: /\b(?:opinion(?:es)?|opinions?|avis)\b[^.;]{0,65}\bjustifi\w*|\bjustifi\w*\b[^.;]{0,65}\b(?:opinion(?:es)?|opinions?|avis)\b/, criterion: a => row(6, 'opinion-reason', 'Relación de la razón solicitada con la opinión', [
    frenchReceptive(a.mode) ? `Relaciona la razón expresada en el ${frenchSource(a.mode)} en francés con la opinión que apoya.` : 'Aporta en francés la razón solicitada y explica su relación con la opinión expresada.',
    'La razón se relaciona con la opinión; un enlace necesita precisión.',
    'Menciona una razón, pero solo parte de su relación con la opinión es reconocible.',
    'La razón se refiere a otro asunto o contradice la opinión que debía apoyar.',
    'No aporta una razón reconocible relacionada con la opinión.',
  ], 3) },
  { id: 'reservation', match: /\breserv\w*\b[^.;]{0,45}\b(?:mesa|table)\b/, criterion: a => row(6, 'reservation', 'Petición de reserva de mesa', [
    frenchReceptive(a.mode) ? `Reconoce la petición de reserva de mesa y los datos expresados en el ${frenchSource(a.mode)} en francés.` : 'Formula en francés la petición de reserva de mesa manteniendo los datos expresamente solicitados o proporcionados.',
    'Se reconoce la reserva solicitada; una expresión necesita precisión.',
    'Se reconoce la intención de reservar, pero parte de los datos dados queda ambigua.',
    'La petición comunica una reserva diferente de la planteada.',
    'No se reconoce una petición de reserva de mesa en francés.',
  ]) },
  { id: 'order', match: order, criterion: a => row(6, 'order', 'Petición del plato solicitado', [
    frenchReceptive(a.mode) ? `Identifica el plato solicitado en el ${frenchSource(a.mode)} en francés y lo relaciona con los datos dados.` : `Formula en francés la petición del plato solicitado${/\bmenu\b/.test(a.text) ? ', conservando su referencia al menú dado' : ''}.`,
    'Se reconoce el plato solicitado; una expresión necesita precisión.',
    'Nombra un plato, pero parte de la petición queda incompleta o ambigua.',
    'La petición comunica un plato distinto del solicitado.',
    'No se reconoce qué plato se solicita en francés.',
  ]) },
  { id: 'payment', match: /\b(?:paga\w*|pago|paie\w*|paye\w*)\b/, criterion: a => row(6, 'payment', 'Información del pago solicitado', [
    frenchReceptive(a.mode) ? `Reconoce la información de pago solicitada en el ${frenchSource(a.mode)} en francés y a qué servicio o producto corresponde.` : 'Comunica o solicita en francés la información de pago requerida, manteniendo su relación con el servicio o producto de la situación.',
    'Se reconoce la información de pago y su referencia; una expresión necesita precisión.',
    'Reconoce o comunica parte de la información de pago, pero su referencia queda ambigua.',
    'Confunde la información de pago o la atribuye a otro servicio o producto.',
    'No aporta información reconocible sobre el pago solicitado.',
  ], 3) },
  { id: 'experience', match: /\b(?:experiencias?|experiences?|faits vecus|hechos vividos|acontecimientos vividos)\b/, criterion: a => row(6, 'experience', 'Hechos que componen la experiencia relatada', [
    frenchReceptive(a.mode) ? `Reconoce los hechos solicitados de la experiencia relatada en el ${frenchSource(a.mode)} en francés y quién los vivió.` : 'Relata en francés los hechos solicitados de la experiencia de modo que se reconoce qué ocurrió y a quién.',
    'Se reconoce la experiencia relatada; una referencia a los hechos o participantes necesita precisión.',
    'Se reconocen hechos aislados, pero sus relaciones con la experiencia quedan incompletas.',
    'Confunde los hechos o los atribuye a otra experiencia o persona.',
    'No se reconocen los hechos de la experiencia solicitada.',
  ]) },
  { id: 'menu', match: /\b(?:lisez|lire|lee|lean|leer\w*|escuch\w*)\b[^.;]{0,45}\bmenu\b|\bmenu (?:dado|fourni)\b/, exclude: order, criterion: a => row(6, 'menu', 'Información solicitada del menú', [
    `Relaciona los platos y la información solicitada del menú en francés con sus referentes en el ${frenchSource(a.mode)}.`,
    'Se reconoce la información solicitada del menú; una referencia necesita precisión.',
    'Identifica parte de la información, pero confunde algunos platos o referencias del menú.',
    'Atribuye la información a platos diferentes de los que aparecen en el menú.',
    'No reconoce la información del menú solicitada.',
  ], 3) },
  { id: 'letter', match: /\b(?:cartas?|lettres?)\b/, criterion: a => row(6, 'letter', 'Propósito de la carta solicitada', [
    frenchReceptive(a.mode) ? `Reconoce qué comunica la carta en francés y la información solicitada en el ${frenchSource(a.mode)}.` : 'Hace reconocible en francés el propósito de la carta y conserva la información que la consigna pide comunicar.',
    'Se reconoce el propósito de la carta; una expresión necesita precisión.',
    'La carta comunica información relacionada, pero su propósito queda incompleto o ambiguo.',
    'La carta comunica un propósito distinto del solicitado.',
    'No se reconoce el propósito de la carta solicitada.',
  ], 2) },
]
export const frenchGradeSixFeatures = [
  ...functions,
  ...frenchGrammar(6, [
    ['pronouns', 'pronombres interrogativos|pronoms interrogatifs', 'Información pedida por el interrogativo', 'relaciona el interrogativo solicitado con la información que se pregunta', 'Se reconoce la pregunta, pero varios interrogativos solicitan información distinta.'],
    ['questions', 'formas de interrogacion|formes de l.interrogation|frases interrogativas|phrases interrogatives', 'Sentido de las formas de interrogación', 'mantiene la información que se pregunta al interpretar o formular las formas de interrogación solicitadas', 'La pregunta se reconoce, pero varias formas cambian la información solicitada.'],
  ]),
  ...frenchLexicon(6, [
    ['travel', 'viajes|voyages|lugares|lieux', 'viajes y lugares'], ['lodging', 'alojamiento|hebergement|pension completa|demi pension', 'alojamiento'],
    ['transport', 'transporte|transport|estaciones|gares|billetes|billets', 'servicios de transporte'], ['technology', 'tecnologia|technologie', 'tecnología'],
    ['leisure', 'ocio|loisirs', 'actividades recreativas'], ['occupations', 'ocupaciones|profesiones|professions|metiers', 'ocupaciones'],
    ['payment', 'pago|dinero|paiement|argent', 'pagos y dinero'], ['signs', 'senales|panneaux|signaux', 'señales'],
    ['opinion', 'opiniones|opinions|valoraciones|avis', 'opiniones'], ['restaurant', 'restaurante|restaurant|comidas|repas|platos|plats', 'restaurante y comidas'],
    ['utensils', 'utensilios|couverts|ustensiles', 'utensilios'], ['quantities', 'cantidades|quantites', 'cantidades'],
    ['school', 'estudios|etudes', 'estudios'], ['daily', 'actividades cotidianas|activites quotidiennes', 'actividades cotidianas'],
    ['experiences', 'experiencias|experiences', 'experiencias'],
  ]),
  ...frenchGradeOneGenres.filter(f => f.id === 'message'),
  ...frenchGradeFiveFeatures.filter(f => f.id === 'invitation'), ...frenchGradeOneStrategies,
]
