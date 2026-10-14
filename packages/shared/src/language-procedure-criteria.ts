import {affirmativeLanguageTask, type LanguageFeature} from './language-feature-criteria'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

/** MINERD PDF 69–74: procedural requirements, separate from conceptual subtopics. */
export const firstGradeLanguageProcedureFeatures:Record<string,LanguageFeature[]>={
  noticia:[],
  'guía turística':[
    {id:'spatial-connectors',match:'conectores? (?:espaciales|temporales)|conectores? de (?:espacio|tiempo)',name:'los conectores espaciales y temporales',function:'situar los lugares y ordenar los recorridos o las indicaciones de visita',error:'se invierte una ubicación o la secuencia de las indicaciones',terms:[['espaciales|espacio','los conectores espaciales'],['temporales|tiempo','los conectores temporales']]},
    {id:'topography',match:'topografic',name:'la descripción topográfica',function:'relacionar la ubicación, la distribución y los rasgos de los lugares descritos',error:'se atribuye a un lugar la ubicación o un rasgo de otro'},
  ],
  'informe de lectura':[
    {id:'additive-connectors',match:'conectores? de adici|conectores? aditiv',name:'los conectores de adición',function:'añadir información relacionada con la interpretación del texto leído',error:'se añade como compatible una idea que contradice el análisis anterior'},
  ],
  afiche:[
    {id:'statistical-argument',match:'cifras|estadistic',name:'las cifras estadísticas como argumentos',function:'sustentar la invitación o recomendación del afiche con datos pertinentes',error:'se atribuye a una cifra una conclusión que no se desprende del dato'},
  ],
  'cuento policíaco':[],
  caligrama:[
    {id:'rhyme-rhythm',match:'\\brima\\b|\\britmo\\b',name:'la rima y el ritmo',function:'relacionar las repeticiones sonoras y las pausas de los versos con el sentido del poema',error:'se atribuye una coincidencia sonora inexistente o se corta una expresión cambiando su sentido',terms:[['\\brima\\b','la rima'],['\\britmo\\b','el ritmo']]},
  ],
}

export const firstGradeLanguageFeatureTerms:Record<string,Record<string,[string,string][]>>={
  caligrama:{typography:[['tipografia','la tipografía'],['caligrafia','la caligrafía']]},
  'cuento policíaco':{dialogue:[['dialogo','el diálogo'],['descripcion','la descripción']]},
}

const content:Record<string,string>={
  noticia:'el hecho y los datos principales de la noticia',
  'guía turística':'los lugares y las indicaciones de la guía',
  'informe de lectura':'la interpretación y los apoyos del informe',
  afiche:'el mensaje y la acción propuesta por el afiche',
  'cuento policíaco':'los hechos disponibles y sus relaciones en el cuento',
  caligrama:'el sentido y la emoción evocada por el caligrama',
}
const outline:Record<string,string>={
  noticia:'la relación entre titular, entrada y desarrollo de los datos',
  'guía turística':'el orden de la información sobre los lugares y sus indicaciones',
  'informe de lectura':'la relación entre presentación de la obra, resumen y análisis',
  afiche:'la distribución de los componentes textuales y visuales del mensaje',
  'cuento policíaco':'la secuencia de la trama y la relación entre acciones y pistas',
  caligrama:'la distribución de los versos y su relación con la figura',
}

export function languageReadingProcedures(description:string,scope:string,genre:string,target=content[genre]):ContextualTopicCriterion[] {
  const task=affirmativeLanguageTask(description), rows:ContextualTopicCriterion[]=[]
  if(genre==='guía turística'&&/reconstru/.test(task)&&/grafic|tecnologic/.test(task)) rows.push({
    templateId:'guide-procedure-reconstruction',title:'Reconstrucción del sentido de la guía',weight:4,
    observable:'Reconstruye mediante la representación solicitada las relaciones entre los lugares y las indicaciones de la guía leída, conservando su sentido.',
    progressionLevels:[
      'La representación permite reconocer los lugares y sus relaciones con las indicaciones, sin añadir datos ajenos a la guía leída.',
      'Los lugares y las indicaciones corresponden a la guía; una relación necesita identificarse con mayor claridad.',
      'Representa lugares o datos aislados sin establecer las relaciones que permiten comprender la guía.',
      'La representación atribuye a un lugar indicaciones de otro o cambia una relación descrita en la guía.',
      'No presenta una reconstrucción reconocible de la información de la guía.',
    ],
  })
  if(/parafras|resum(?:iran|ir|e)\b|propias palabras/.test(task)) rows.push({
    templateId:`${scope}-procedure-paraphrase`,title:'Paráfrasis del contenido disponible',weight:5,
    observable:`Reconstruye con sus propias palabras ${target}, conservando su sentido sin añadir información ajena al texto disponible.`,
    progressionLevels:[
      `La paráfrasis conserva ${target} y sus relaciones, con formulaciones propias que mantienen el sentido del texto disponible.`,
      `Recupera ${target}; una formulación requiere aclaración, pero conserva el sentido central.`,
      'Recupera información aislada sin reconstruir las relaciones necesarias para comprender el texto.',
      'La paráfrasis cambia el sentido de la información o añade hechos que no aparecen en el texto disponible.',
      'No presenta una paráfrasis reconocible del texto leído o escuchado.',
    ],
  })
  if(/anticip|predicci/.test(task)) {
    const verify=/comprob|contrast|verific|evalu\w*.*predicci/.test(task)
    rows.push({
    templateId:`${scope}-procedure-prediction`,title:verify?'Anticipación y comprobación del contenido':'Anticipación del contenido',weight:3,
    observable:verify?`Formula una predicción sobre ${target} a partir de indicios textuales o paratextuales y la contrasta con la lectura posterior.`:`Formula una predicción sobre ${target} y explica qué indicios textuales o paratextuales permiten anticiparla.`,
    progressionLevels:verify?[
      'Relaciona su predicción con un indicio identificable y explica qué información de la lectura la confirma o modifica.',
      'Identifica el indicio y contrasta la predicción; deja implícita una relación con la información leída.',
      'Propone una predicción, pero no relaciona su confirmación o cambio con información del texto.',
      'Afirma que la lectura confirma una predicción contradicha por el texto.',
      'No presenta una predicción ni evidencia del contraste solicitado con la lectura.',
    ]:[
      'Relaciona la predicción con indicios identificables del título, las imágenes u otras marcas disponibles y explica cómo permiten anticipar el contenido.',
      'La predicción corresponde a los indicios disponibles; queda implícita una relación entre el indicio y lo anticipado.',
      'Menciona un indicio, pero no explica su relación con el contenido que anticipa.',
      'La predicción contradice el significado del indicio en el que dice apoyarse.',
      'No formula una predicción relacionada con los indicios disponibles.',
    ],
  })}
  if(/(?:significado|vocabulario|palabras desconocidas).*contexto|contexto.*(?:significado|palabras)/.test(task)) rows.push({
    templateId:`${scope}-procedure-vocabulary`,title:'Inferencia del vocabulario en contexto',weight:3,
    observable:`Deduce el significado de las palabras desconocidas de ${genre} mediante indicios del contexto y comprueba que la interpretación mantiene el sentido del pasaje.`,
    progressionLevels:[
      'Propone un significado compatible con el pasaje y señala las palabras o relaciones del contexto que sustentan la inferencia.',
      'El significado propuesto conserva el sentido del pasaje; un indicio necesita explicarse.',
      'Propone un significado posible de la palabra, pero no demuestra que corresponda al contexto del pasaje.',
      'El significado atribuido contradice las relaciones del contexto y cambia el sentido del pasaje.',
      'No propone un significado relacionado con el contexto ni señala indicios para inferirlo.',
    ],
  })
  return rows
}

export function languageWritingProcedures(description:string,scope:string,genre:string,plan=outline[genre]):ContextualTopicCriterion[] {
  const task=affirmativeLanguageTask(description),rows:ContextualTopicCriterion[]=[]
  if(/esquema|guion|planific|mapa (?:conceptual|semantico)|cuadro sinoptico|organizador grafico/.test(task)) {
    const product=/esquema o guion|guion o esquema/.test(task)?'esquema o guion':/mapa conceptual o (?:mapa )?semantico|mapa semantico o (?:mapa )?conceptual/.test(task)?'mapa conceptual o mapa semántico':/mapa semantico/.test(task)?'mapa semántico':/mapa conceptual/.test(task)?'mapa conceptual':/cuadro sinoptico/.test(task)?'cuadro sinóptico':/organizador grafico/.test(task)?'organizador gráfico':/esquema/.test(task)?'esquema':/guion/.test(task)?'guion':'plan'
    rows.push({
    templateId:`${scope}-procedure-outline`,title:'Planificación del texto',weight:3,
    observable:`Organiza un ${product} que permite reconocer ${plan} antes de desarrollar el texto.`,
    progressionLevels:[
      `El ${product} hace explícita ${plan} y permite seguir cómo se desarrollará el texto.`,
      `El ${product} permite seguir el desarrollo previsto; una conexión entre sus componentes necesita aclararse.`,
      `Enumera componentes pertinentes, pero no organiza sus relaciones en el ${product}.`,
      `El orden o las relaciones del ${product} contradicen el propósito o el contenido que se pretende desarrollar.`,
      'No aporta evidencia de la planificación solicitada.',
    ],
  })}
  if(genre==='cuento policíaco'&&/ilustr/.test(task)) rows.push({
    templateId:`${scope}-procedure-illustration`,title:'Ilustración vinculada al relato',weight:2,
    observable:'Relaciona la ilustración con la escena o los elementos del cuento que representa, facilitando su comprensión sin contradecir los hechos narrados.',
    progressionLevels:[
      'La ilustración permite reconocer la escena representada y sus elementos relevantes en el cuento.',
      'La escena se reconoce; un detalle visual necesita relacionarse con el pasaje representado.',
      'Muestra elementos del cuento, pero no permite reconocer su relación en la escena.',
      'La ilustración contradice los hechos o atribuye a un personaje la acción de otro.',
      'No presenta la ilustración solicitada del cuento.',
    ],
  })
  return rows
}

export function languagePlaceClassification(description:string):ContextualTopicCriterion[] {
  if(!/clasific/.test(affirmativeLanguageTask(description)))return []
  return [{templateId:'guide-procedure-classification',title:'Clasificación de los lugares',weight:3,
    observable:'Agrupa los lugares de la guía en categorías coherentes con la función o característica elegida y justifica la ubicación de cada lugar con información disponible.',
    progressionLevels:[
      'Las categorías responden al criterio elegido y la información de cada lugar justifica su inclusión en la categoría asignada.',
      'Mantiene el criterio de clasificación; la asignación de un lugar necesita una justificación más clara.',
      'Agrupa lugares, pero mezcla criterios que impiden comprender por qué pertenecen a cada categoría.',
      'Asigna lugares a categorías que contradicen la información de la guía.',
      'No presenta una clasificación reconocible de los lugares descritos.',
    ]}]
}
