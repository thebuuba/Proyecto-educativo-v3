import { frenchCurriculumRow as row, frenchGrammar, frenchLexicon } from './secondary-french-curriculum'
import { frenchGradeOneFeatures, frenchGradeOneGrammar, frenchGradeOneStrategies } from './secondary-french-grade-1'
import { frenchGradeOneGenres } from './secondary-french-grade-1-details'
import { frenchReceptive, frenchSource, type FrenchFeature } from './secondary-french-task'

export const frenchGradeFiveModule = { id: 'frances-comunicacion-5', grade: 5, subjectCode: 'FRA', pdfPages: [203, 204, 205, 206], policy: 'EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1' }
const functions: FrenchFeature[] = [
  { id: 'person-description', match: /\b(?:rasgos fisicos|rasgos de caracter|descripcion fisica|apparence|traits physiques|traits de caractere|describ\w* (?:a )?(?:(?:un|el|una|la|los|las) )?(?:personajes?|personas?)|decri\w* (?:une? |le |la |les |des )?(?:personnes?|personnages?))\b/, criterion: a => row(5, 'person-description', 'Rasgos que permiten reconocer al personaje', [
    frenchReceptive(a.mode) ? `Relaciona los rasgos físicos o de carácter solicitados con la persona descrita en el ${frenchSource(a.mode)} en francés.` : 'Describe en francés los rasgos solicitados del personaje, relacionando las características con la persona a quien corresponden.',
    'Se reconoce el personaje por sus rasgos; una referencia necesita precisión.',
    'Nombra rasgos aislados, pero solo parte queda relacionada con el personaje.',
    'Atribuye al personaje rasgos diferentes de los planteados en la situación.',
    'No aporta rasgos reconocibles del personaje solicitado.',
  ]) },
  { id: 'place-description', match: /\b(?:descripcion (?:de |de un |del |de una )?(?:lugar|ciudad|pais)|description (?:d.un |d.une |du |de )?(?:lieu|ville|pays)|describ\w* (?:un |el |una |la )?(?:lugar|ciudad|pais)|decri\w* (?:un |une |le |la )?(?:lieu|ville|pays))\b/, criterion: a => row(5, 'place-description', 'Características del lugar descrito', [
    frenchReceptive(a.mode) ? `Distingue las características solicitadas del lugar en el ${frenchSource(a.mode)} en francés.` : 'Describe en francés las características solicitadas del lugar de modo que se reconoce el entorno presentado.',
    'Se reconoce el lugar y sus características principales; una expresión necesita precisión.',
    'Nombra características aisladas, pero su relación con el lugar queda incompleta.',
    'Confunde las características y comunica un entorno diferente del solicitado.',
    'No aporta características reconocibles del lugar solicitado.',
  ]) },
  ...frenchGradeOneFeatures.filter(f => f.id === 'routine'),
  { id: 'leisure', match: /\b(?:actividades recreativas|actividad recreativa|activites recreatives|activite recreative|ocio|loisirs|tiempo libre)\b/, exclude: /\b(?:invitacion(?:es)?|invitations?|invitez|invitar)\b/, criterion: a => row(5, 'leisure', 'Actividad recreativa comunicada', [
    frenchReceptive(a.mode) ? `Identifica las actividades recreativas solicitadas en el ${frenchSource(a.mode)} en francés.` : 'Comunica en francés la actividad recreativa solicitada de modo que se reconoce qué se realiza o propone.',
    'Se reconoce la actividad recreativa; una expresión necesita precisión.',
    'Menciona una actividad, pero parte de la información solicitada queda ambigua.',
    'Las expresiones comunican otra actividad recreativa.',
    'No se reconoce la actividad recreativa solicitada.',
  ]) },
  { id: 'instructions', match: /\b(?:instrucciones|ordenes|instructions|consignes|ordres)\b/, criterion: a => row(5, 'instructions', 'Acción y secuencia de las instrucciones', [
    frenchReceptive(a.mode) ? `Identifica las acciones indicadas y su orden, cuando hay varios pasos, en el ${frenchSource(a.mode)} en francés.` : 'Formula en francés las acciones solicitadas de modo que se reconoce qué hacer y, cuando hay varios pasos, en qué orden realizarlos.',
    'Se reconoce lo que debe hacerse; una indicación necesita precisión.',
    'Se reconocen algunas acciones, pero quedan indicaciones o relaciones entre pasos incompletas.',
    'Las indicaciones cambian la acción solicitada o invierten una secuencia necesaria.',
    'No se reconocen instrucciones que permitan realizar la acción solicitada.',
  ]) },
  { id: 'prohibition', match: /\b(?:prohibiciones|prohibicion|prohibe\w*|interdictions?|interdisez|interdire)\b/, criterion: a => row(5, 'prohibition', 'Acción que se prohíbe', [
    frenchReceptive(a.mode) ? `Distingue qué acción no está permitida según el ${frenchSource(a.mode)} en francés.` : 'Formula en francés la prohibición solicitada de modo que se reconoce qué acción no está permitida.',
    'Se reconoce la acción prohibida; una expresión necesita precisión.',
    'Se reconoce la acción, pero parte del mensaje deja ambiguo si está prohibida.',
    'La expresión permite la acción que debía prohibir o prohíbe otra distinta.',
    'No se reconoce qué acción está prohibida en el mensaje.',
  ]) },
  { id: 'invitation', match: /\b(?:invitacion(?:es)?|invitations?|invitez|invitar)\b/, criterion: a => {
    const response = /\b(?:acepta\w*|rechaz\w*|accept\w*|refus\w*)\b/.test(a.text)
    return response && !frenchReceptive(a.mode) ? row(5, 'invitation-response', 'Respuesta a la invitación recibida', [
      'Responde en francés a la invitación aceptándola o rechazándola según la opción solicitada o elegida, sin cambiar la actividad a la que responde.',
      'Se reconoce la respuesta a la invitación; una expresión necesita precisión.',
      'La respuesta se relaciona con la invitación, pero no deja clara la aceptación o el rechazo elegidos.',
      'La respuesta contradice la opción elegida o se refiere a otra invitación.',
      'No se reconoce una respuesta pertinente a la invitación recibida.',
    ]) : row(5, 'invitation', 'Propuesta que comunica la invitación', [
      frenchReceptive(a.mode) ? `Reconoce qué se propone en la invitación del ${frenchSource(a.mode)} en francés, usando los datos expresados.` : 'Formula en francés la invitación de modo que se reconoce qué actividad propone y conserva los datos solicitados.',
      'Se reconoce la propuesta de la invitación; una expresión necesita precisión.',
      'La invitación aporta información relacionada, pero la propuesta queda incompleta o ambigua.',
      'La invitación propone una actividad diferente de la solicitada.',
      'No se reconoce qué se propone mediante la invitación.',
    ])
  } },
  { id: 'recipe', match: /\b(?:recetas?|recettes?)\b/, criterion: a => row(5, 'recipe', 'Correspondencia con la preparación de la receta', [
    frenchReceptive(a.mode) ? `Relaciona las indicaciones francesas de la receta con la preparación solicitada y los elementos dados en el ${frenchSource(a.mode)}.` : 'Relaciona las indicaciones en francés con la preparación de la receta solicitada, manteniendo los elementos proporcionados en la consigna.',
    'Se reconoce la preparación de la receta; una relación necesita precisión.',
    'Se relaciona parte de las indicaciones con la receta, pero otras quedan desconectadas de la preparación.',
    'Las indicaciones cambian la preparación de la receta planteada.',
    'No se reconoce la preparación de la receta solicitada.',
  ], 3) },
]
export const frenchGradeFiveFeatures = [
  ...functions, ...frenchGradeOneGrammar.filter(f => ['grammar-present', 'grammar-imperative'].includes(f.id)),
  ...frenchGrammar(5, [
    ['questions', 'pronombres interrogativos|pronoms interrogatifs|(?:utiliz\\w*|utilis\\w*|emplo\\w*)[^.;]{0,20}(?:quand|quel|pourquoi)', 'Información pedida por el interrogativo', 'relaciona el interrogativo solicitado con la información de tiempo, elección o causa que se pregunta', 'La pregunta se reconoce, pero varios interrogativos solicitan información distinta.'],
    ['prepositions', 'preposiciones|prepositions', 'Relación expresada por la preposición', 'mantiene la relación solicitada de lugar, procedencia, destino, compañía o medio mediante las preposiciones indicadas', 'Reconoce los elementos, pero varias preposiciones cambian su relación.'],
    ['adjectives', 'adjetivos calificativos|adjectifs qualificatifs|concordancia|posicion del adjetivo|place de l.adjectif', 'Rasgo y sustantivo al que corresponde', 'relaciona el adjetivo solicitado y su posición o concordancia con el sustantivo y el sentido previsto', 'Se reconoce el rasgo, pero parte de la concordancia o posición dificulta identificar su referente.'],
    ['contracted', 'articulos contractos|articles contractes', 'Contracción de artículo y preposición', 'relaciona el artículo contracto solicitado con su sustantivo y la relación de la frase', 'Se reconoce el sustantivo, pero se confunden varias relaciones expresadas por las contracciones.'],
    ['object-pronouns', 'pronombres de objeto directo|pronoms complements directs|pronoms objets directs', 'Referencia del pronombre de objeto', 'vincula el pronombre de objeto directo solicitado con el elemento al que se refiere en la indicación', 'Se reconoce la acción, pero varios pronombres cambian o dejan ambiguo el objeto al que se refiere.'],
    ['connectors', 'conectores|connecteurs|(?:usando|avec|utiliz\\w*|utilis\\w*)[^.;]{0,20}(?:parce que|mais)', 'Causa o contraste entre las ideas', 'distingue la causa o el contraste expresados por los conectores solicitados', 'Se reconocen las ideas, pero varias conexiones cambian la causa o el contraste.'],
  ]),
  ...frenchLexicon(5, [
    ['body', 'cuerpo|corps', 'partes del cuerpo'], ['appearance', 'rasgos fisicos|apariencia|apparence|traits physiques', 'rasgos físicos'],
    ['character', 'caracter|cualidades|defectos|caractere|qualites|defauts', 'rasgos de carácter'], ['emotions', 'emociones|sentimientos|emotions|sentiments', 'emociones'],
    ['places', 'paises|ciudades|naturaleza|lugares|pays|villes|nature|lieux', 'lugares y entornos'], ['population', 'poblacion|population|habitants', 'población'],
    ['traditions', 'tradiciones|celebraciones|traditions|fetes', 'tradiciones y celebraciones'], ['numbers', 'numeros|nombres', 'números'],
    ['daily', 'actividades cotidianas|activites quotidiennes', 'actividades cotidianas'], ['leisure', 'ocio|actividades recreativas|loisirs|activites recreatives', 'recreación'],
    ['time', 'horarios|horas|fechas|horaires|heures|dates', 'tiempo y fechas'], ['preferences', 'gustos|preferencias|gouts|preferences', 'preferencias'],
    ['invitations', 'invitaciones|invitations', 'fórmulas de invitación y respuesta'],
  ]),
  ...frenchGradeOneGenres.filter(f => ['form', 'message', 'sign'].includes(f.id)), ...frenchGradeOneStrategies,
]
