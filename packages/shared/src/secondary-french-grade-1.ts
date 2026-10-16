import type { ContextualTopicCriterion } from './secondary-topic-criteria'
import { frenchReceptive, frenchSource, type FrenchAction, type FrenchFeature } from './secondary-french-task'

export const frenchGradeOneModule = { id: 'frances-comunicacion-1', grade: 1, subjectCode: 'FRA', pdfPages: [181, 182, 183, 184], policy: 'EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1' }
type Levels = ContextualTopicCriterion['progressionLevels']
export const frenchRow = (id: string, title: string, levels: Levels, weight = 4): ContextualTopicCriterion => ({ templateId: `fra-1-${id}`, title, observable: levels[0], progressionLevels: levels, weight })
const reading = (a: FrenchAction) => frenchReceptive(a.mode)
const list = (items: string[]) => items.length < 2 ? items[0] : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`

/** Only requested identification fields: residence is neither nationality nor a street address. */
export function frenchPersonalFields(text: string) {
  return [['name', 'el nombre', 'nombre|nom'], ['age', 'la edad', 'edad|age'], ['nationality', 'la nacionalidad', 'nacionalidad|nationalite'], ['occupation', 'la ocupación', 'ocupacion|profession|metier'], ['residence', 'el lugar de residencia', 'residencia|residence|habite\\w*']]
    .filter(([, , match]) => new RegExp(`\\b(?:${match})\\b`).test(text)
      && !new RegExp(`\\b(?:sin|no|ni|sans|pas de)\\s+(?:(?:el|la|su|sus|le|les|leur|lugar de|lieu de)\\s+)*(?:${match})\\b`).test(text))
}

/** AulaBase adaptations; select only the requested function, never all curricular traits. */
export const frenchGradeOneFeatures: FrenchFeature[] = [
  { id: 'greetings', match: /\b(?:salud\w*|desp[ei]d\w*|salue\w*|salutations?|prendre conge|dites au revoir)\b/, criterion: a => {
    const greeting = /salud\w*|salue\w*|salutations?/.test(a.text), farewell = /desp[ei]d\w*|prendre conge|dites au revoir/.test(a.text)
    const target = greeting && farewell ? 'saludo y despedida' : farewell ? 'despedida' : 'saludo'
    const row = frenchRow('greetings', 'Fórmulas de contacto social', [
      reading(a) ? `Distingue las fórmulas de ${target} del ${frenchSource(a.mode)} en francés y su función en el contacto social.` : `Emplea en francés fórmulas de ${target} acordes con la situación de contacto indicada.`,
      `Se reconoce la función de ${target}; una fórmula necesita ajuste a la situación.`,
      `Aporta una fórmula de contacto, pero no distingue su función de ${target} en la situación.`,
      'Confunde la apertura con el cierre del contacto y dificulta reconocer su intención.',
      `No aporta evidencia reconocible de ${target} en francés.`,
    ])
    if (greeting && farewell) row.checklistParts = ['saludo', 'despedida'].map((kind, index) => {
      const levels: Levels = [reading(a) ? `Reconoce la fórmula de ${kind} en francés y su función en la situación.` : `Emplea una fórmula de ${kind} en francés acorde con la situación indicada.`, `Se reconoce la función de ${kind}; la fórmula necesita un ajuste.`, `Aporta una fórmula de contacto, pero su función de ${kind} queda ambigua.`, `La fórmula expresa una función diferente de ${kind}.`, `No aporta una fórmula reconocible de ${kind}.`]
      return { key: index === 0 ? 'greeting' : 'farewell', observable: levels[0], progressionLevels: levels }
    })
    return row
  } },
  { id: 'classroom', match: /\b(?:consign\w* (?:de |del |de la )?(?:aula|clase|classe)|instructions? de (?:classe|aula)|pedir (?:ayuda|repeticion)|demande\w* de repeter|interactu\w* en el aula)\b/, criterion: a => frenchRow('classroom', 'Comprensión y respuesta en el aula', [
    reading(a) ? `Relaciona la consigna del ${frenchSource(a.mode)} en francés con la acción que solicita.` : 'Comunica en francés la petición o respuesta de aula solicitada de modo que el interlocutor reconoce qué necesita o qué acción corresponde.',
    'La petición o acción es reconocible; una expresión necesita aclaración.',
    'Identifica o expresa parte de la petición, pero queda ambiguo qué se necesita o qué debe hacerse.',
    'La respuesta cambia la acción solicitada o la petición que intenta comunicar.',
    'No se reconoce la petición ni una respuesta relacionada con la consigna.',
  ]) },
  { id: 'personal', match: /\b(?:presentaci[oó]n (?:personal|de (?:un|una|el|la) (?:personaje|persona))|presentarse|presenten?se|presentate|vous presenter|se presenter|presentez-vous|informacion personal|informations? personnelles?|identite|nombre|nom|edad|age|nacionalidad|nationalite|residencia|residence|habite\w*)\b/, criterion: a => {
    const fields = frenchPersonalFields(a.text).map(([, label]) => label)
    const target = fields.length ? list(fields) : 'los datos de identificación solicitados'
    const responds = a.mode.includes('interaction') && /\b(?:respond\w*|repond\w*)\b/.test(a.text)
    const verb = responds ? 'Responde en francés las preguntas sobre' : 'Comunica en francés'
    const result = frenchRow('personal', 'Identificación de la persona', [
      reading(a) ? `Identifica ${target} de la persona o personaje según el ${frenchSource(a.mode)} en francés.` : `${verb} ${target} de la persona o personaje, sin confundir a quién corresponde cada dato.`,
      `Se reconocen ${target}; una referencia necesita precisión para atribuir el dato.`,
      `La información sobre ${target} es parcial: quedan datos incompletos o sin atribución clara.`,
      `Atribuye ${target} a otra persona o altera los datos solicitados.`,
      `No aporta información reconocible sobre ${target} de la persona indicada.`,
    ])
    if (fields.length && !/\b(?:o|ou)\b/.test(a.text)) result.checklistParts = fields.map(field => {
      const key: Record<string, string> = { 'el nombre': 'name', 'la edad': 'age', 'la nacionalidad': 'nationality', 'la ocupación': 'occupation', 'el lugar de residencia': 'residence' }
      const levels: Levels = [reading(a) ? `Identifica ${field} de la persona según el ${frenchSource(a.mode)} en francés.` : `${verb} ${field} de la persona indicada.`, `La información sobre ${field} es reconocible, aunque necesita precisión.`, `La información sobre ${field} es parcial y no permite identificar el dato por completo.`, `Atribuye ${field} a otra persona.`, `No aporta ${field} de la persona indicada.`]
      return { key: key[field], observable: levels[0], progressionLevels: levels }
    })
    return result
  } },
  { id: 'description', match: /\b(?:rasgos fisicos|rasgos de caracter|descripcion fisica|apparence|caracteristiques physiques|traits physiques|describ\w* (?:a )?(?:(?:el|unas?|unos?|las?|los?|tus?|sus?|mis?) )?(?:personas?|personajes?|objetos?|amig[oa]s?|companeros?)|decri\w* (?:(?:unes?|uns?|les?|la|des|vos|mes|ses|votre) )?(?:personnes?|personnages?|objets?|amis?|amies?|camarades?)|description (?:physique|de personnes|d'objets))\b/, criterion: a => frenchRow('description', 'Rasgos de la persona u objeto', [
    reading(a) ? `Relaciona los rasgos descritos en el ${frenchSource(a.mode)} en francés con la persona u objeto correspondiente.` : 'Describe en francés los rasgos solicitados de la persona u objeto, de forma que permiten reconocer lo descrito.',
    'Los rasgos permiten reconocer lo descrito; una relación o palabra necesita precisión.',
    'Menciona rasgos aislados, pero varios no quedan vinculados a la persona u objeto.',
    'Confunde los rasgos o su atribución y produce una descripción contradictoria.',
    'No se reconocen rasgos de la persona u objeto que se debía describir.',
  ]) },
  { id: 'location', match: /\b(?:ubic\w*|donde esta\w*|localiz\w*|localisation|situe\w*|ou se trouv\w*|ou sont|posicion de|emplacement)\b/, criterion: a => frenchRow('location', 'Ubicación y referencias espaciales', [
    reading(a) ? `Localiza las personas, lugares u objetos solicitados mediante las referencias espaciales del ${frenchSource(a.mode)} en francés.` : 'Indica en francés la ubicación solicitada relacionando la persona, lugar u objeto con una referencia espacial comprensible.',
    'La ubicación es reconocible; una referencia espacial necesita precisión.',
    'Nombra el elemento o el lugar, pero su relación espacial queda incompleta.',
    'La relación espacial sitúa el elemento en una ubicación diferente a la indicada.',
    'No aporta una referencia que permita reconocer la ubicación solicitada.',
  ]) },
  { id: 'routine', match: /\b(?:rutina\w*|routine\w*|actividades (?:cotidianas|diarias)|activites quotidiennes|journee habituelle)\b/, criterion: a => {
    const time = /\b(?:horas?|horarios?|heures?|horaires?)\b/.test(a.text) ? ' y los horarios solicitados' : ''
    return frenchRow('routine', 'Actividades cotidianas', [
      reading(a) ? `Reconoce las actividades de la rutina${time} según el ${frenchSource(a.mode)} en francés.` : `Comunica en francés las actividades de la rutina${time} mediante frases breves que permiten reconocer qué se hace.`,
      `Se reconocen las actividades${time}; una expresión necesita precisión.`,
      `Se reconocen algunas acciones, pero otras actividades${time} quedan incompletas o ambiguas.`,
      'Confunde las acciones y cambia la rutina que debía comunicar o comprender.',
      'No aporta acciones reconocibles de la rutina solicitada.',
    ])
  } },
]

const grammar: Array<[string, RegExp, string, string, string]> = [
  ['agreement', /\b(?:concordancia|accords? (?:du|de|des)|genre et nombre)\b/, 'Concordancia en francés', 'relaciona género y número entre los términos solicitados', 'Relaciona algunos términos, pero mantiene discordancias que dificultan reconocer sus referentes.'],
  ['articles', /\b(?:articulos (?:definidos|indefinidos|contractos)|articles (?:definis|indefinis|contractes))\b/, 'Artículos solicitados', 'selecciona los artículos solicitados de acuerdo con el sustantivo y su referencia', 'Distingue algunos artículos, pero confunde la determinación o la referencia de otros sustantivos.'],
  ['present', /\b(?:presente (?:de indicativo|de los verbos|de verbos)|present de l'indicatif|verbes? au present)\b/, 'Presente de indicativo', 'relaciona las formas verbales en presente solicitadas con su sujeto y la acción expresada', 'Reconoce el sujeto o la acción, pero no mantiene su relación en varias formas de presente.'],
  ['imperative', /\b(?:imperativo|imperatif)\b/, 'Acción expresada por el imperativo', 'relaciona el imperativo solicitado con la acción y el destinatario de la indicación', 'Se reconoce la acción, pero la forma imperativa no deja claro a quién se dirige.'],
  ['possessives', /\b(?:adjetivos posesivos|adjectifs possessifs)\b/, 'Relaciones de posesión', 'distingue quién posee lo nombrado mediante el adjetivo posesivo solicitado', 'Menciona el poseedor o lo poseído sin establecer con claridad la relación entre ambos.'],
  ['pronouns', /\b(?:pronombres (?:personales|tonicos|interrogativos)|pronoms (?:personnels|toniques|interrogatifs))\b/, 'Referencia de los pronombres', 'vincula los pronombres solicitados con la persona o la información a la que se refieren', 'Identifica algunos referentes, pero otros pronombres quedan sin una referencia clara.'],
  ['prepositions', /\b(?:preposiciones|prepositions)\b/, 'Relación expresada por las preposiciones', 'establece la relación de lugar, tiempo o compañía correspondiente a las preposiciones solicitadas', 'Identifica los elementos relacionados, pero confunde el sentido de varias preposiciones.'],
  ['presentatives', /\b(?:presentativos|presentatifs|diferencia entre c'est|distinction entre c'est)\b/, 'Presentación e identificación', 'distingue la función de los presentativos solicitados para introducir, identificar o señalar existencia', 'Reconoce parte de la información, pero confunde identificación y existencia.'],
  ['connectors', /\b(?:conectores|connecteurs)\b/, 'Relaciones entre ideas', 'relaciona las ideas según la adición, alternativa o causa expresada por los conectores solicitados', 'Menciona las ideas, pero la relación de adición, alternativa o causa queda ambigua.'],
]
export const frenchGradeOneGrammar = grammar.map(([id, match, title, evidence, partial]): FrenchFeature => ({
  id: `grammar-${id}`, match, criterion: a => frenchRow(`grammar-${id}`, title, [
    `${reading(a) ? `A partir del ${frenchSource(a.mode)} en francés,` : 'En su mensaje en francés,'} ${evidence}.`,
    `La relación lingüística solicitada es reconocible; una forma necesita ajuste sin cambiar el sentido.`,
    partial,
    'Las formas elegidas cambian la relación solicitada y producen otro sentido.',
    'No aporta evidencia que permita reconocer la relación lingüística solicitada.',
  ], 3),
}))

export const frenchGradeOneStrategies: FrenchFeature[] = [
  { id: 'revision', match: /\b(?:revis\w* (?:el |su |un )?borrador|reli\w* (?:le |votre )?(?:brouillon|message)|corrige\w* (?:le |votre )?brouillon)\b/, criterion: () => frenchRow('revision', 'Revisión del mensaje', [
    'Contrasta el borrador con la información que desea comunicar; corrige las expresiones confusas detectadas o conserva las que ya expresan el sentido previsto.',
    'La revisión aclara el sentido principal; queda una expresión por comprobar.',
    'Revisa parte del mensaje, pero deja expresiones detectadas que dificultan comprender la información.',
    'Cambia expresiones sin comprobar su sentido y altera la información del mensaje.',
    'No aporta evidencia de haber comprobado el sentido del borrador.',
  ], 2) },
]
