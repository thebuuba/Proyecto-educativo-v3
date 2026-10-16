import { frenchCurriculumRow as row, frenchGrammar, frenchLexicon } from './secondary-french-curriculum'
import { frenchGradeOneFeatures, frenchGradeOneGrammar, frenchGradeOneStrategies } from './secondary-french-grade-1'
import { frenchGradeOneGenres } from './secondary-french-grade-1-details'
import { frenchReceptive, frenchSource, type FrenchFeature } from './secondary-french-task'

export const frenchGradeFourModule = { id: 'frances-comunicacion-4', grade: 4, subjectCode: 'FRA', pdfPages: [199, 200, 201, 202], policy: 'EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1' }
const functions: FrenchFeature[] = [
  ...frenchGradeOneFeatures.filter(f => f.id === 'personal'),
  { id: 'city-services', match: /\b(?:servicios (?:de la ciudad|urbanos)|services (?:de la ville|urbains)|informacion sobre comercios|renseignements sur les commerces)\b/, criterion: a => row(4, 'city-services', 'Correspondencia entre lugar y servicio', [
    frenchReceptive(a.mode) ? `Relaciona los lugares y los servicios indicados en el ${frenchSource(a.mode)} en francés con la información solicitada.` : 'Comunica en francés qué servicio ofrece el lugar solicitado, de modo que se reconoce dónde atender la necesidad planteada.',
    'Se reconoce el lugar y su servicio; una referencia necesita precisión.',
    'Identifica lugares y servicios aislados, pero solo relaciona correctamente parte de ellos.',
    'Atribuye al lugar un servicio diferente del que corresponde a la situación.',
    'No aporta una relación reconocible entre lugar y servicio.',
  ]) },
  { id: 'shopping', match: /\b(?:compras?|comprar|achat\w*|achet\w*)\b/, criterion: a => row(4, 'shopping', 'Producto solicitado en la compra', [
    frenchReceptive(a.mode) ? `Identifica el producto solicitado en el ${frenchSource(a.mode)} en francés.` : 'Formula en francés la solicitud del producto de manera que se reconoce qué desea adquirir.',
    'Se reconoce el producto solicitado; una expresión necesita precisión.',
    'Menciona el producto, pero parte de la solicitud o de los datos dados queda ambigua.',
    'La solicitud comunica otro producto o cambia los datos de la compra planteada.',
    'No se reconoce qué producto se solicita en francés.',
  ]) },
  { id: 'price', match: /\b(?:precio|prix)\b/, criterion: a => row(4, 'price', 'Precio relacionado con el producto', [
    frenchReceptive(a.mode) ? `Relaciona el precio con el producto correspondiente en el ${frenchSource(a.mode)} en francés.` : 'Expresa o pregunta en francés el precio solicitado, manteniendo su relación con el producto al que corresponde.',
    'Se reconoce el precio y su producto; una expresión necesita precisión.',
    'Reconoce o comunica parte del precio, pero su relación con el producto queda incompleta.',
    'Confunde el precio o lo relaciona con otro producto.',
    'No aporta información reconocible sobre el precio solicitado.',
  ], 3) },
  { id: 'quantity', match: /\b(?:indica\w*|indiqu\w*|solicita\w*|pregunta\w*|demande\w*)\b[^.;]{0,25}\b(?:cantidad|quantite)\b/, criterion: a => row(4, 'quantity', 'Cantidad solicitada del producto', [
    frenchReceptive(a.mode) ? `Relaciona la cantidad solicitada con el producto correspondiente en el ${frenchSource(a.mode)} en francés.` : 'Expresa o pregunta en francés la cantidad solicitada del producto, de modo que se reconoce cuánto se desea adquirir.',
    'Se reconoce la cantidad del producto; una expresión necesita precisión.',
    'Reconoce o comunica una cantidad, pero no la relaciona con claridad con el producto.',
    'La expresión cambia la cantidad solicitada o la atribuye a otro producto.',
    'No se reconoce la cantidad del producto solicitada.',
  ], 3) },
  { id: 'payment', match: /\b(?:pagar|pago|pagamento|paiement|payer)\b/, criterion: a => row(4, 'payment', 'Información solicitada sobre el pago', [
    frenchReceptive(a.mode) ? `Reconoce la información de pago solicitada en el ${frenchSource(a.mode)} en francés.` : 'Comunica en francés la información sobre el pago expresamente solicitada, manteniendo la relación con la compra planteada.',
    'Se reconoce la información de pago; una expresión necesita precisión.',
    'Expresa o reconoce solo parte de la información de pago requerida.',
    'Cambia la información de pago y produce un sentido distinto al solicitado.',
    'No aporta información reconocible sobre el pago solicitado.',
  ], 3) },
  { id: 'feelings', match: /\b(?:sentimientos|emociones|sentiments|emotions)\b/, criterion: a => row(4, 'feelings', 'Sentimiento y persona a quien corresponde', [
    frenchReceptive(a.mode) ? `Identifica los sentimientos expresados en el ${frenchSource(a.mode)} en francés y a quién corresponden.` : 'Expresa en francés los sentimientos solicitados de forma que se reconoce qué siente cada persona.',
    'Se reconoce el sentimiento y a quién corresponde; una expresión necesita precisión.',
    'Nombra sentimientos, pero solo parte queda relacionada con la persona correspondiente.',
    'Confunde el sentimiento expresado o lo atribuye a otra persona.',
    'No aporta un sentimiento reconocible relacionado con la situación.',
  ]) },
  { id: 'needs', match: /\b(?:necesidades (?:fisicas|personales)|necesita\w*|hambre|sed|besoins|faim|soif|avoir (?:froid|chaud|peur|besoin|envie))\b/, criterion: a => row(4, 'needs', 'Estado físico o necesidad expresada', [
    frenchReceptive(a.mode) ? `Distingue el estado físico o la necesidad expresados en el ${frenchSource(a.mode)} en francés.` : 'Expresa en francés el estado físico o la necesidad solicitados, de modo que se reconoce lo que siente o necesita la persona.',
    'Se reconoce el estado o necesidad; una expresión necesita precisión.',
    'Nombra un estado o necesidad, pero no permite reconocerlo con claridad en la situación.',
    'Confunde el estado físico o comunica una necesidad diferente.',
    'No se reconoce el estado físico o la necesidad solicitados.',
  ]) },
  { id: 'health', match: /\b(?:salud|sante|sintomas|symptomes|dolores?|douleurs?|enfermedades|maladies|como se siente|comment .{0,20}se sent)\b/, criterion: a => row(4, 'health', 'Comunicación del estado de salud planteado', [
    frenchReceptive(a.mode) ? `Identifica los síntomas o el estado de salud expresados en el ${frenchSource(a.mode)} en francés.` : 'Comunica en francés los síntomas o el estado de salud dados en la situación, manteniendo su relación con la persona correspondiente.',
    'Se reconoce el estado de salud descrito; una expresión necesita precisión.',
    'Nombra algunos síntomas o estados, pero su relación con la persona o situación queda incompleta.',
    'Las expresiones cambian los síntomas o el estado de salud planteados.',
    'No aporta información reconocible sobre el estado de salud solicitado.',
  ]) },
]
export const frenchGradeFourFeatures = [
  ...functions,
  ...frenchGradeOneGrammar.filter(f => ['grammar-present', 'grammar-imperative'].includes(f.id)),
  ...frenchGrammar(4, [
    ['negation', 'negacion|negation|ne.{0,5}(?:pas|plus|jamais)', 'Alcance de la negación', 'distingue lo negado y su alcance con la estructura ne…pas, ne…plus o ne…jamais solicitada', 'Se reconoce una negación, pero su alcance queda confundido.'],
    ['questions', 'formas de interrogacion|formes de l.interrogation|frases interrogativas|phrases interrogatives', 'Información que solicita la pregunta', 'mantiene la información solicitada al formular o interpretar las formas de interrogación indicadas', 'Reconoce algunas preguntas, pero otras solicitan información diferente.'],
    ['pronouns', 'pronombres interrogativos|pronoms interrogatifs', 'Referencia de los interrogativos', 'vincula el interrogativo simple o compuesto solicitado con la información o el referente de la pregunta', 'La pregunta se reconoce, pero varios interrogativos no señalan el referente previsto.'],
    ['polite-conditional', 'condicional de cortesia|conditionnel de politesse', 'Petición mediante condicional de cortesía', 'relaciona el condicional de cortesía solicitado con la petición y el interlocutor de la situación', 'Se reconoce la petición, pero varias formas no mantienen el sentido solicitado del condicional.'],
    ['contracted', 'articulos contractos|articles contractes', 'Artículos contractos', 'relaciona las contracciones de artículo y preposición solicitadas con el sustantivo y la relación expresada', 'Se reconoce el sustantivo, pero se confunden varias relaciones expresadas por las contracciones.'],
    ['partitives', 'articulos partitivos|articles partitifs', 'Referencia mediante partitivos', 'relaciona los partitivos solicitados con las cantidades no determinadas que se comunican', 'Se reconocen los referentes, pero varias formas cambian el sentido de cantidad.'],
    ['adverbs', 'adverbios|adverbes', 'Cantidad, intensidad o frecuencia', 'distingue el matiz de cantidad, intensidad o frecuencia expresado por los adverbios solicitados', 'Identifica parte del mensaje, pero confunde el matiz que aportan varios adverbios.'],
    ['demonstratives', 'demostrativos|demonstratifs', 'Referencia demostrativa', 'relaciona el demostrativo solicitado con el sustantivo al que señala', 'Se reconoce el objeto, pero varias formas no mantienen la relación con su sustantivo.'],
    ['adjective-position', 'posicion del adjetivo|place de l.adjectif|concordancia de adjetivos|accord des adjectifs', 'Posición y concordancia del adjetivo', 'relaciona la posición o concordancia solicitada del adjetivo con el sustantivo y el sentido de la frase', 'Se reconoce la característica, pero varias formas dificultan relacionarla con el sustantivo.'],
    ['connectors', 'conectores|connecteurs|et y parce que|et et parce que', 'Relaciones entre las ideas', 'distingue la adición o causa expresadas por los conectores et o parce que solicitados', 'Se reconocen las ideas, pero parte de sus relaciones queda alterada.'],
  ]),
  ...frenchLexicon(4, [
    ['identity', 'datos personales|informations personnelles|identite|nombres|apellidos|noms|prenoms', 'datos personales'],
    ['occupations', 'ocupaciones|profesiones|professions|metiers', 'ocupaciones'],
    ['nationalities', 'nacionalidades|nationalites', 'nacionalidades'],
    ['age', 'edad|age', 'edad'], ['preferences', 'gustos|preferencias|gouts|preferences', 'gustos y preferencias'],
    ['city', 'comercios|servicios urbanos|commerces|services urbains', 'comercios y servicios urbanos'],
    ['transport', 'transportes|transports', 'transporte'], ['signs', 'senales|panneaux|signaux', 'señales'],
    ['money', 'dinero|monedas|argent|monnaie', 'dinero'], ['time', 'horas|fechas|heures|dates', 'horas y fechas'],
    ['food', 'alimentos|bebidas|aliments|boissons', 'alimentos y bebidas'], ['clothes', 'ropa|vestimenta|vetements', 'ropa'],
    ['technology', 'tecnologia|tecnologicos|technologie|technologiques', 'objetos tecnológicos'],
    ['payment', 'formas de pago|moyens de paiement', 'formas de pago'], ['measures', 'medidas|mesures', 'medidas'],
    ['feelings', 'sentimientos|emociones|sentiments|emotions', 'sentimientos'], ['needs', 'necesidades|besoins', 'necesidades'],
    ['body', 'cuerpo|corps', 'partes del cuerpo'], ['health', 'enfermedades|sintomas|dolores|maladies|symptomes|douleurs', 'síntomas y estados de salud'],
  ]),
  ...frenchGradeOneGenres.filter(f => ['form', 'message', 'sign'].includes(f.id)), ...frenchGradeOneStrategies,
]
