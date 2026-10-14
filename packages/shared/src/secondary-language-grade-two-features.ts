import {firstGradeLanguageFeatures} from './secondary-language-grade-one-complete'
import {firstGradeLanguageProcedureFeatures} from './language-procedure-criteria'
import {firstGradeLanguageCompletionFeatures} from './language-procedure-completion'
import type {LanguageFeature} from './language-feature-criteria'

const take=(genre:string,ids:string[])=>firstGradeLanguageFeatures[genre].filter(f=>ids.includes(f.id))
const indicative:LanguageFeature={id:'indicative',match:'indicativo|tiempos? verbales|preterito|pluscuamperfecto|verbos en presente',name:'los tiempos del indicativo',function:'situar los hechos y distinguir su orden y duración, incluidos los anteriores a otro hecho pasado',error:'se invierte el orden de los hechos o se confunde una acción terminada con una situación en desarrollo',terms:[['presente','el presente del indicativo'],['perfecto simple|indefinido','el pretérito perfecto simple'],['imperfecto','el pretérito imperfecto'],['pluscuamperfecto','el pretérito pluscuamperfecto']]}
const sentences:LanguageFeature={id:'complex-sentences',match:'oraciones coordinadas|oraciones subordinadas|coordinacion|subordinacion',name:'las relaciones entre oraciones',function:'enlazar información del texto distinguiendo la coordinación de ideas y la dependencia entre proposiciones',error:'se atribuye a una proposición una relación sintáctica que cambia lo afirmado',terms:[['coordinad|coordinacion','las oraciones coordinadas'],['subordinad|subordinacion','las oraciones subordinadas']]}
const paragraphs:LanguageFeature={id:'paragraphs',match:'parrafos?|oracion tematica',name:'la organización de los párrafos y sus oraciones',function:'desarrollar una idea central con oraciones relacionadas y separar cambios de asunto',error:'se agrupan ideas incompatibles o se atribuye al párrafo una idea que no desarrolla'}
const literary:LanguageFeature={id:'literary',match:'figuras? literarias?|recursos (?:literarios|expresivos)|metafora|comparacion|epiteto|paradoja|antitesis|ironia',name:'los recursos literarios presentes',function:'expresar sentidos figurados y relacionar imágenes o contrastes con el sentido del pasaje',error:'se interpreta como literal una expresión figurada o se le atribuye un efecto contrario al pasaje',terms:[['metafora','la metáfora'],['comparacion','la comparación literaria'],['epiteto','el epíteto'],['paradoja','la paradoja'],['antitesis','la antítesis'],['ironia','la ironía']]}
const punctuation=firstGradeLanguageCompletionFeatures['informe de lectura'][0]

/** Additional requirements read in the common second-grade table, PDF 76–81. */
export const secondGradeLanguageFeatures:Record<string,LanguageFeature[]>={
  noticia:[...take('noticia',['newsworthiness','connectors','synonyms','paratext','punctuation']).map(f=>f.id==='newsworthiness'?{...f,match:f.match+'|caracteristicas de la noticia'}:f),indicative,sentences,paragraphs,
    ...firstGradeLanguageCompletionFeatures.noticia],
  'guia-turistica':[
    ...take('guía turística',['nouns','adjectives','signs','persuasion','appearance']).map(f=>f.id==='persuasion'?{...f,match:f.match+'|atractivo y persuasivo'}:f),indicative,punctuation,
    ...firstGradeLanguageProcedureFeatures['guía turística'],
    {id:'auxiliary-signs',match:'signos auxiliares|parentesis|corchetes|rayas',name:'los signos auxiliares',function:'delimitar aclaraciones o información añadida sin confundirla con el enunciado principal',error:'se deja sin delimitar una aclaración o se cambia qué palabras pertenecen al enunciado principal',terms:[['parentesis','los paréntesis'],['corchetes','los corchetes'],['rayas','las rayas']]},
    {id:'vocabulary',match:'vocabulario adecuado|lexico adecuado',name:'el vocabulario de orientación al visitante',function:'describir y localizar los lugares con palabras comprensibles para el destinatario de la guía',error:'se usa una palabra que atribuye al lugar una característica o ubicación distinta'},
  ],
  'articulo-expositivo':[
    ...take('guía turística',['adjectives']),indicative,paragraphs,
    {id:'questions',match:'oraciones interrogativas|preguntas',name:'las oraciones interrogativas',function:'plantear preguntas vinculadas con el problema que el artículo explica',error:'se atribuye a una pregunta una respuesta ajena al problema planteado'},
    {id:'agreement',match:'concordancia',name:'la concordancia entre las palabras',function:'mantener las relaciones de género, número y persona entre las palabras vinculadas',error:'el género, número o persona de una palabra no corresponde al término con el que debe concordar'},
    {id:'demonstratives',match:'pronombres demostrativos',name:'los pronombres demostrativos',function:'retomar referentes identificables y mantener la continuidad de la explicación',error:'se atribuye al demostrativo un referente distinto del que retoma en el pasaje'},
    {id:'connectors',match:'conectores.*(?:causa|efecto|finalidad|contraste)|conectores causales',name:'los conectores de relación lógica',function:'enlazar causas, consecuencias, propósitos o contrastes manteniendo las relaciones de la explicación',error:'se invierte la relación entre causa y efecto o se presenta un contraste como coincidencia',terms:[['causa','los conectores de causa'],['efecto','los conectores de efecto'],['finalidad','los conectores de finalidad'],['contraste','los conectores de contraste']]},
    {id:'comparatives',match:'construcciones comparativas',name:'las construcciones comparativas',function:'establecer relaciones de semejanza o diferencia que aclaran el problema explicado',error:'se comparan propiedades incompatibles o se atribuye a un referente la propiedad del otro'},
  ],
  'informe-de-lectura':[...take('informe de lectura',['summary']),indicative,punctuation],
  'cuento-amor-amistad':[
    ...take('cuento policíaco',['adjectives','adverbs','actants','connectors']),indicative,literary,
    {id:'subjunctive',match:'subjuntivo',name:'el modo subjuntivo',function:'expresar deseos, posibilidades o situaciones no afirmadas como hechos',error:'se presenta como hecho una posibilidad o se cambia la relación temporal expresada',terms:[['presente','el presente del subjuntivo'],['imperfecto','el pretérito imperfecto del subjuntivo']]},
    {id:'dialogue',match:'dialogo|estilo directo|estilo indirecto',name:'el diálogo del relato',function:'distinguir las voces de los personajes y relacionar sus palabras con las acciones',error:'se atribuyen a un personaje palabras de otro o se confunde la voz del narrador',terms:[['\\bdirecto\\b','el diálogo de estilo directo'],['\\bindirecto\\b','el diálogo de estilo indirecto']]},
    {id:'pronouns',match:'pronombres',name:'los pronombres del relato',function:'retomar personajes o elementos con referentes identificables y mantener la continuidad narrativa',error:'el pronombre cambia el referente y atribuye la acción a otro personaje'},
    {id:'authorship',match:'autoria|autores|autor del cuento|informacion bibliografica|emilia pardo|oscar wilde|rafael altamira|horacio quiroga|borja rodriguez|juan ruiz|arcipreste',name:'la autoría y las referencias del cuento',function:'relacionar la obra leída con su autoría mediante información bibliográfica disponible',error:'se atribuye la obra a un autor distinto del documentado o se confunde obra y autor'},
  ],
  'decima-espinela':[literary,
    {id:'interjections',match:'interjecciones|exclamaciones',name:'las interjecciones y exclamaciones',function:'hacer reconocible la emoción o énfasis que expresan los versos',error:'se atribuye a la exclamación una emoción incompatible con el verso',terms:[['interjecciones','las interjecciones'],['exclamaciones','las exclamaciones']]},
  ],
}
