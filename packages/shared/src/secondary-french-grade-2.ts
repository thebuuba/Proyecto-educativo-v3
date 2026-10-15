import { frenchCurriculumRow as row, frenchGrammar, frenchLexicon } from './secondary-french-curriculum'
import { frenchGradeOneFeatures, frenchGradeOneGrammar, frenchGradeOneStrategies } from './secondary-french-grade-1'
import { frenchGradeOneGenres, frenchGradeOneLexicon } from './secondary-french-grade-1-details'
import { frenchReceptive, frenchSource, type FrenchFeature } from './secondary-french-task'

export const frenchGradeTwoModule = { id: 'frances-comunicacion-2', grade: 2, subjectCode: 'FRA', pdfPages: [185, 186, 187, 188], policy: 'EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1' }
const functions: FrenchFeature[] = [
  ...frenchGradeOneFeatures.filter(f => ['personal', 'routine'].includes(f.id)),
  { id: 'coincidence', match: /\b(?:coincidencias?|discrepancias?|accord et desaccord|accords et desaccords)\b/, criterion: a => row(2, 'coincidence', 'Coincidencia y discrepancia de preferencias', [
    frenchReceptive(a.mode) ? `Distingue quién comparte o no comparte la preferencia expresada en el ${frenchSource(a.mode)} en francés.` : 'Relaciona en francés la preferencia propia con la de la otra persona, indicando de forma reconocible la coincidencia o discrepancia solicitada.',
    'La comparación es reconocible; una expresión necesita precisión para saber quién coincide o discrepa.',
    'Menciona preferencias de ambas personas, pero solo parte de las coincidencias o discrepancias queda clara.',
    'Confunde coincidencia y discrepancia y cambia la relación entre las preferencias.',
    'No se reconoce la relación solicitada entre las preferencias de las personas.',
  ], 3) },
  { id: 'home', match: /\b(?:vivienda|logement|habitation|description (?:de |du |d'une |de la )?(?:maison|appartement)|decri\w* (?:votre |une? |la |le )?(?:maison|appartement))\b/, criterion: a => row(2, 'home', 'Características de la vivienda', [
    frenchReceptive(a.mode) ? `Reconoce las características solicitadas de la vivienda según la descripción del ${frenchSource(a.mode)} en francés.` : 'Describe en francés las características solicitadas de la vivienda, relacionando sus espacios o elementos con el lugar descrito.',
    'Se reconoce la vivienda descrita; una característica o referencia espacial necesita precisión.',
    'Nombra espacios o elementos aislados, pero varias características de la vivienda quedan sin relación clara.',
    'Confunde las características o sus referencias y describe una vivienda distinta de la indicada.',
    'No aporta características reconocibles de la vivienda solicitada.',
  ]) },
  { id: 'preferences', match: /\b(?:gustos?|preferencias?|gouts?|preferences?|lo que (?:le|te|me) gusta|aimez|aiment|preferez)\b/, criterion: a => row(2, 'preferences', 'Gustos y preferencias', [
    frenchReceptive(a.mode) ? `Distingue qué le gusta o prefiere al personaje a partir de las expresiones del ${frenchSource(a.mode)} en francés.` : 'Expresa en francés los gustos o preferencias solicitados, vinculando la valoración con aquello que le gusta, no le gusta o prefiere.',
    'Se reconocen los gustos o preferencias; una expresión necesita precisión para distinguir la valoración.',
    'Nombra elementos, pero solo algunas valoraciones permiten reconocer el gusto o la preferencia.',
    'Confunde valoración positiva, negativa o preferencia y cambia lo que se desea comunicar.',
    'No se reconoce una valoración vinculada con los gustos o preferencias solicitados.',
  ]) },
]
export const frenchGradeTwoFeatures = [
  ...functions,
  ...frenchGradeOneGrammar.filter(f => ['grammar-agreement', 'grammar-articles', 'grammar-possessives', 'grammar-pronouns', 'grammar-prepositions', 'grammar-presentatives'].includes(f.id)),
  ...frenchGrammar(2, [
    ['negation', 'negacion|negation|ne.{0,5}pas', 'Sentido de la negación', 'distingue la información negada mediante la estructura ne…pas solicitada', 'Reconoce parte de la información, pero no mantiene con claridad qué se niega.'],
    ['partitives', 'articulos partitivos|articles partitifs|pas de', 'Cantidad no contable y negación', 'relaciona el partitivo o pas de solicitado con la cantidad o ausencia expresada', 'Reconoce el elemento, pero confunde la cantidad indeterminada con su ausencia.'],
    ['questions', 'interrogacion|interrogation|frases interrogativas|phrases interrogatives', 'Información solicitada en la pregunta', 'formula o reconoce la pregunta solicitada según la información que se desea obtener', 'La pregunta permite reconocer el tema, pero no deja clara la información solicitada.'],
    ['present', 'presente de (?:indicativo|los verbos|verbos)|present de l.indicatif|verbes? au present|verbos pronominales|verbes pronominaux', 'Presente y referencia de la acción', 'relaciona las formas de presente solicitadas con su sujeto y, cuando corresponde, la acción pronominal', 'Reconoce el sujeto o la acción, pero no mantiene la relación en varias formas verbales.'],
    ['adverbs', 'adverbios|adverbes', 'Matiz aportado por el adverbio', 'distingue el matiz de frecuencia, intensidad o lugar que aportan los adverbios solicitados', 'Reconoce la acción o característica, pero no el matiz expresado por varios adverbios.'],
    ['si', 'respuesta si|reponse si', 'Respuesta a una pregunta negativa', 'relaciona la respuesta si solicitada con la afirmación que contradice la pregunta negativa', 'Se reconoce una respuesta afirmativa, pero su relación con la pregunta negativa queda ambigua.'],
    ['adjective-position', 'posicion del adjetivo|lugar del adjetivo|place de l.adjectif', 'Posición del adjetivo', 'ubica el adjetivo solicitado en relación con el sustantivo manteniendo el sentido del grupo nominal', 'Se reconoce la característica, pero su posición dificulta relacionarla con el sustantivo.'],
  ]),
  ...frenchLexicon(2, [
    ['identity', 'datos personales|informations personnelles|identite', 'datos personales'],
    ['home', 'muebles|electrodomesticos|meubles|electromenagers|piezas de la casa|pieces de la maison', 'mobiliario y espacios de la vivienda'],
    ['leisure', 'ocio|loisirs|actividades recreativas', 'actividades de ocio'],
    ['music', 'musica|musique|instrumentos musicales|instruments de musique', 'música'],
    ['sports', 'deportes|sports', 'deportes'],
    ['food', 'alimentos|bebidas|aliments|boissons|nourriture', 'alimentos y bebidas'],
    ['time', 'horas|heures|horarios|horaires|dias|jours|meses|mois', 'tiempo y horarios'],
    ['civil-status', 'estado civil|etat civil', 'estado civil'],
    ['addresses', 'direcciones|direcciones postales|adresses|paises|ciudades|pays|villes', 'lugares y direcciones'],
    ['qualities', 'cualidades|defectos|qualites|defauts', 'cualidades y defectos de personajes'],
    ['arts', 'actividades culturales|actividades artisticas|activites culturelles|activites artistiques', 'actividades culturales y artísticas'],
    ['games', 'juegos|jeux', 'juegos'],
    ['chores', 'quehaceres del hogar|tareas domesticas|taches menageres', 'quehaceres del hogar'],
    ['communication', 'medios de comunicacion|moyens de communication', 'medios de comunicación'],
  ]),
  ...frenchGradeOneLexicon.filter(f => ['lexicon-family', 'lexicon-appearance', 'lexicon-colors', 'lexicon-occupations', 'lexicon-nationalities', 'lexicon-numbers'].includes(f.id)),
  ...frenchGradeOneGenres.filter(f => f.id !== 'card'), ...frenchGradeOneStrategies,
]
