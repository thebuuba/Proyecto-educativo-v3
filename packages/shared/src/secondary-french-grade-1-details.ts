import { frenchRow } from './secondary-french-grade-1'
import { frenchReceptive, frenchSource, type FrenchFeature } from './secondary-french-task'

// These labels describe curricular lexical fields, not arbitrary words copied from a title.
const lexicalFields: Array<[string, string, string]> = [
  ['school', 'materiales escolares|utiles escolares|objetos del aula|materiel scolaire|objets de la classe', 'materiales y objetos del aula'],
  ['family', 'miembros de la familia|membres de la famille', 'miembros de la familia'],
  ['body', 'partes del cuerpo|parties du corps', 'partes del cuerpo'],
  ['appearance', 'rasgos fisicos|caracteristiques physiques', 'rasgos físicos'],
  ['colors', 'colores|couleurs', 'colores'],
  ['shapes', 'formas geometricas|formes geometriques', 'formas geométricas'],
  ['materials', 'materiales de los objetos|materiaux des objets', 'materiales de los objetos'],
  ['home', 'muebles|mobiliario|meubles|piezas de la casa|pieces de la maison', 'mobiliario y espacios de la vivienda'],
  ['occupations', 'ocupaciones|profesiones|professions|metiers', 'ocupaciones'],
  ['nationalities', 'nacionalidades|nationalites', 'nacionalidades'],
  ['time', 'dias de la semana|meses del ano|jours de la semaine|mois de l.annee|horas|heures', 'días, meses u horas solicitados'],
  ['numbers', 'numeros cardinales|numeros ordinales|nombres cardinaux|nombres ordinaux', 'números solicitados'],
  ['transport', 'medios de transporte|moyens de transport', 'medios de transporte'],
  ['technology', 'objetos tecnologicos|appareils technologiques', 'objetos tecnológicos'],
]
export const frenchGradeOneLexicon: FrenchFeature[] = lexicalFields.map(([id, words, label]) => ({
  id: `lexicon-${id}`,
  match: new RegExp(`\\b(?:vocabulario|lexico|vocabulaire|lexique|terminos|mots)\\b[^.;]{0,55}\\b(?:${words})\\b|\\b(?:nombr\\w*|identific\\w*|nómbr\\w*|nommez|identifiez)\\b[^.;]{0,35}\\b(?:${words})\\b`),
  criterion: action => frenchRow(`lexicon-${id}`, `Léxico de ${label}`, [
    frenchReceptive(action.mode) ? `Relaciona las palabras francesas de ${label} con sus referentes en el ${frenchSource(action.mode)}.` : `Emplea las palabras francesas de ${label} con un significado que permite reconocer los referentes solicitados.`,
    `Se reconocen los referentes de ${label}; una elección léxica necesita precisión.`,
    `Relaciona algunas palabras de ${label} con sus referentes, pero confunde otras.`,
    `Las palabras seleccionadas designan otros referentes y cambian la información solicitada sobre ${label}.`,
    `No aporta vocabulario reconocible sobre ${label}.`,
  ], 3),
}))

export const frenchGradeOneGenres: FrenchFeature[] = [
  { id: 'form', match: /\b(?:formularios?|fichas? de (?:inscripcion|identificacion)|formulaires?|fiches? d'inscription)\b/, criterion: action => frenchRow('form', 'Correspondencia entre campos y datos', [
    frenchReceptive(action.mode) ? 'Localiza los datos del formulario en francés relacionándolos con la etiqueta de cada campo solicitado.' : 'Completa los campos solicitados del formulario en francés con datos del tipo que corresponde a cada etiqueta.',
    'Los datos corresponden a los campos; uno necesita precisión o reubicación.',
    'Completa o localiza algunos campos, pero otros quedan vacíos o contienen otro tipo de dato.',
    'Confunde las etiquetas y atribuye los datos a campos que no les corresponden.',
    'No establece correspondencia reconocible entre campos y datos.',
  ]) },
  { id: 'card', match: /\b(?:tarjetas? de presentacion|cartes? de visite)\b/, criterion: action => frenchRow('card', 'Identificación en una tarjeta', [
    frenchReceptive(action.mode) ? 'Distingue en la tarjeta en francés los datos de identificación solicitados y a quién pertenecen.' : 'Dispone en la tarjeta en francés los datos de identificación solicitados de manera que se distingue a quién pertenece cada dato.',
    'La tarjeta permite identificar a la persona; un dato necesita mayor claridad.',
    'La tarjeta presenta datos aislados sin permitir relacionarlos claramente con la persona.',
    'Los datos de la tarjeta se contradicen y cambian la identidad presentada.',
    'No aporta datos reconocibles en el formato de tarjeta solicitado.',
  ]) },
  { id: 'message', match: /\b(?:correos? electronicos?|courriels?|emails?|mensajes?|messages?)\b/, criterion: action => frenchRow('message', 'Propósito y destinatario del mensaje', [
    frenchReceptive(action.mode) ? 'Reconoce qué comunica el mensaje en francés al destinatario según las expresiones que contiene.' : 'Dirige el mensaje en francés al destinatario indicado y hace reconocible su propósito comunicativo.',
    'Se reconoce el propósito del mensaje; una referencia al destinatario necesita aclaración.',
    'El mensaje contiene información pertinente, pero no permite reconocer con claridad para qué se comunica.',
    'El mensaje comunica una intención distinta de la solicitada para ese destinatario.',
    'No se reconoce el propósito del mensaje solicitado.',
  ], 2) },
  { id: 'sign', match: /\b(?:letreros?|avisos?|carteles?|affiches?|panneaux|annonces?)\b/, criterion: action => frenchRow('sign', 'Información breve para el destinatario', [
    frenchReceptive(action.mode) ? 'Identifica la información o indicación principal del aviso en francés y a qué situación se refiere.' : 'Formula en francés la información o indicación del aviso solicitado con expresiones breves que hacen reconocible su sentido.',
    'La información principal del aviso es reconocible; una expresión necesita precisión.',
    'Se reconocen palabras relacionadas con el aviso, pero no la indicación completa.',
    'El aviso expresa una indicación diferente o contradictoria con la solicitada.',
    'No se reconoce la información que el aviso debía comunicar.',
  ]) },
  { id: 'verse', match: /\b(?:poemas?|rimas?|canciones?|poemes?|comptines?|chansons?)\b/, criterion: action => frenchRow('verse', 'Sentido de las expresiones del texto', [
    frenchReceptive(action.mode) ? `Reconoce el sentido de las expresiones solicitadas del ${frenchSource(action.mode)} en francés sin confundirlo con palabras de sonido parecido.` : 'Enuncia las expresiones francesas del poema, rima o canción solicitados conservando su sentido reconocible.',
    'Se reconoce el sentido del texto; una expresión necesita aclaración.',
    'Se reconocen expresiones aisladas, pero varias relaciones de sentido quedan incompletas.',
    'Confunde expresiones de sonido parecido y cambia el sentido del texto.',
    'No aporta expresiones reconocibles del texto solicitado.',
  ]) },
]
