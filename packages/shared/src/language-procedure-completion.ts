import type {LanguageFeature} from './language-feature-criteria'
import {affirmativeLanguageTask} from './language-feature-criteria'

export function specializePunctuation(feature:LanguageFeature,description:string):LanguageFeature {
  if(feature.id!=='punctuation')return feature
  const task=affirmativeLanguageTask(description)
  const purposes=[
    [/comas?/,'separar elementos y delimitar aclaraciones sin romper la relación entre las ideas','separa elementos que forman una unidad de sentido'],
    [/dos puntos/,'anunciar una enumeración, explicación o cita relacionada con el enunciado anterior','anuncia información que no corresponde al enunciado anterior'],
    [/comillas/,'delimitar citas o expresiones reproducidas y distinguirlas de la voz propia','atribuye a la cita palabras ajenas o deja sin delimitar las palabras reproducidas'],
    [/interrogacion/,'delimitar preguntas y distinguirlas de las afirmaciones','presenta como afirmación una pregunta del texto'],
    [/exclamacion/,'delimitar expresiones enfáticas sin cambiar el sentido del enunciado','altera el alcance de la expresión enfática'],
  ] as const
  const selected=purposes.filter(([pattern])=>pattern.test(task))
  return selected.length?{...feature,function:selected.map(([,purpose])=>purpose).join('; '),error:selected.map(([, ,error])=>error).join('; ')}:feature
}

const punctuation:LanguageFeature={id:'punctuation',match:'puntuacion|comas?|dos puntos|comillas|signos de (?:interrogacion|exclamacion)',name:'los signos de puntuación',function:'delimitar las ideas, las enumeraciones y las citas para conservar el sentido del texto',error:'la delimitación cambia qué se enumera, qué se cita o cómo se relacionan las ideas',terms:[['comas?','las comas'],['dos puntos','los dos puntos'],['comillas','las comillas'],['interrogacion','los signos de interrogación'],['exclamacion','los signos de exclamación']]}

/** Explicit clauses in the first-grade procedures, MINERD PDF 69–73. */
export const firstGradeLanguageCompletionFeatures:Record<string,LanguageFeature[]>={
  noticia:[{id:'thematic-vocabulary',match:'vocabulario tematico|sustantivos y verbos|verbos y sustantivos',name:'los verbos y sustantivos del vocabulario temático',function:'nombrar los referentes del hecho noticioso y expresar las acciones sin confundir quién hace qué',error:'se atribuye una acción a un referente distinto del que participa en el hecho'}],
  'guía turística':[punctuation,{id:'adjective-degree',match:'grados? (?:del |de los )?adjetivo|grado (?:positivo|comparativo|superlativo)|(?:positivo|comparativo|superlativo).*adjetivo',name:'los grados del adjetivo',function:'expresar la intensidad de una cualidad o la relación entre cualidades de los lugares',error:'se invierte qué lugar posee una cualidad en mayor grado o se atribuye una intensidad distinta de la expresada',terms:[['positivo','el grado positivo'],['comparativo','el grado comparativo'],['superlativo','el grado superlativo']]}],
  'informe de lectura':[punctuation],
}
