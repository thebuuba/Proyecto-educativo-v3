import {createUpperEnglishProvider,type UpperEnglishEvidence} from './secondary-english-upper-task'
import {upperEnglishRow,upperEnglishCommunication} from './secondary-english-upper-communication'
import {englishAlternativeGroups} from './secondary-english-grammar'
import {englishGradeSixGrammar,requestedGradeSixGrammar,gradeSixGrammarCriterion} from './secondary-english-grade-six-grammar'
import {requestedGradeSixLexicon,gradeSixLexicalCriterion,withoutGradeSixLexicalTargets} from './secondary-english-grade-six-lexicon'
import {gradeSixStrategyCriteria} from './secondary-english-grade-six-strategies'
import {gradeSixGenreCriteria} from './secondary-english-grade-six-genres'
import {gradeSixContextCriteria} from './secondary-english-grade-six-context'
export const englishGradeSixModule={id:'ingles-comunicacion-6',grade:6,subjectCode:'ING',pdfPages:[169,170,171,172,173,174],policy:'COMMON_SIXTH_GRADE_DEFINED_FAMILIES_REVIEW_PENDING_V1'}
const row=(id:string,title:string,levels:Parameters<typeof upperEnglishRow>[3])=>upperEnglishRow('ing-6',id,title,levels)
const asks=/\b(?:solicit(?:ar(?:an)?|an|en|ando)|pedir(?:an)?|pid(?:an|en))\b/
const offers=/\b(?:ofrec(?:er(?:an)?|en|iendo)|dar(?:an)?|dan|den|comunic(?:ar(?:an)?|an|en)|expres(?:ar(?:an)?|an|en))\b/
export function requestedGradeSixFunctions(raw:string){
 let text=withoutGradeSixLexicalTargets(raw)
 for(const feature of englishGradeSixGrammar)text=text.replace(new RegExp(feature.match,'g'),' ')
 const ids:string[]=[]
 if(/\b(?:pasado.*presente|presente.*pasado|ambas epocas)\b/.test(text)&&/\b(?:compar\w*|contrast\w*)\b/.test(text))ids.push('past-present')
 if(/\b(?:temas? abstractos?|temas? cultural(?:es)?|ideas? cultural(?:es)?)\b/.test(text))ids.push('cultural-ideas')
 for(const [target,pattern] of [['reasoning','razonamientos?'],['explanations','explicacion(?:es)?']] as const)if(new RegExp(`\\b(?:${pattern})\\b`).test(text)){
  if(asks.test(text))ids.push(`ask-${target}`)
  if(!asks.test(text)||offers.test(text))ids.push(target)
 }
 if(/\bjustific\w*\b/.test(text)&&!ids.includes('reasoning'))ids.push('reasoning')
 const adaptation=/\badaptacion\b|\badaptandose\b/.test(text)
 if(adaptation)ids.push('adaptation')
 if(/\b(?:acostumbrad\w*|familiarizad\w*|familiaridad|costumbres?)\b/.test(text)&&(!adaptation||/\bcostumbres? y (?:la )?adaptacion\b|\badaptacion y (?:la )?costumbres?\b/.test(text)))ids.push('habitual-state')
 if(/\b(?:hipotesis|hipotetiz\w*)\b/.test(text)&&/\b(?:pasad\w*|habria|no cumplid\w*)\b/.test(text))ids.push('past-hypothesis')
 if(/\bentrevistas? (?:de trabajo|laborales?)\b/.test(text))ids.push('job-interview')
 if(/\b(?:narracion(?:es)?|narrar(?:an)?|relatos?|relatar(?:an)?)\b/.test(text))ids.push('detailed-narrative')
 const studyingLanguage=/\b(?:vocabulario|lexico|expresiones para)\b/.test(raw)||/\b(?:funcion|significado|uso)\b/.test(raw)&&requestedGradeSixGrammar(raw).length>0
 if(!studyingLanguage&&/\bexplic(?:ar(?:an)?|an|en|ando)\b/.test(text)&&!ids.includes('explanations'))ids.push('explanations')
 if(!studyingLanguage&&/\brazon(?:ar(?:an)?|an|en|ando)\b/.test(text)&&!ids.includes('reasoning'))ids.push('reasoning')
 return ids
}
export function sixthGradeEnglishContent(task:UpperEnglishEvidence){
 const {mode}=task,receptive=['reading','listening','analysis','comparison','research'].includes(mode),source=mode==='listening'?'mensaje escuchado':'texto disponible'
 const cultural=gradeSixStrategyCriteria(task.requirementText,mode).some(c=>c.templateId.endsWith('cultural-comparison'))
 const rows=(cultural?[]:task.functions).map(id=>{
  switch(id){
   case 'past-present':return row(id,'Cambios y continuidades entre el pasado y el presente',[
    'Contrasta en inglés el pasado y el presente del referente indicado, relacionando los cambios y continuidades solicitados con los datos de ambas épocas.',
    'El contraste permite distinguir las épocas; una relación entre el cambio o continuidad y los datos necesita precisión.',
    'Enumera datos del pasado y del presente sin establecer varias relaciones de cambio o continuidad solicitadas.',
    'Invierte las épocas o atribuye a una de ellas datos incompatibles con la información proporcionada.',
    'No aporta un contraste reconocible entre el pasado y el presente del referente indicado.',
   ])
   case 'cultural-ideas':return row(id,'Ideas relacionadas con el tema abstracto o cultural',[
    receptive?`Relaciona las ideas del ${source} en inglés sobre el tema abstracto o cultural con los datos y ejemplos disponibles.`:'Expresa en inglés ideas relacionadas con el tema abstracto o cultural indicado, enlazándolas con los datos o ejemplos de la tarea para que se comprenda el punto de vista comunicado.',
    'Las ideas y su relación con el tema se comprenden; una referencia a los datos o ejemplos necesita precisión.',
    'Menciona ideas aisladas sin establecer varias relaciones necesarias para seguir el punto de vista sobre el tema.',
    'Atribuye a los ejemplos ideas incompatibles con lo proporcionado o cambia el tema solicitado.',
    'No se reconocen ideas relacionadas con el tema abstracto o cultural indicado.',
   ])
   case 'ask-reasoning':case 'ask-explanations':{
    const reasoning=id==='ask-reasoning',target=reasoning?'un razonamiento':'una explicación'
    return row(id,reasoning?'Solicitud precisa del razonamiento':'Solicitud precisa de explicación',[
     `Solicita en inglés ${target}, precisando qué hecho, decisión o relación entre los datos del caso necesita comprender.`,
     'La solicitud se relaciona con el caso; una referencia al aspecto consultado necesita precisión.',
     'Formula una solicitud general sin precisar qué parte del caso requiere aclarar.',
     'La solicitud cambia el asunto o pregunta por datos ajenos al hecho o decisión del caso.',
     'No se reconoce una solicitud pertinente que permita aclarar el hecho o decisión indicados.',
    ])
   }
   case 'reasoning':return row(id,'Razonamiento que relaciona datos y conclusión',[
    receptive?`Relaciona el razonamiento del ${source} en inglés con los datos que sustentan su conclusión o decisión.`:'Expone en inglés un razonamiento que justifica la decisión o punto de vista solicitado, enlazando los datos proporcionados con la conclusión que sustenta.',
    'El razonamiento relaciona datos y conclusión; una conexión necesita precisión.',
    'Menciona datos y una conclusión sin aclarar varias relaciones necesarias para justificarla.',
    'La conclusión contradice los datos o el razonamiento atribuye a la situación información que no proporciona.',
    'No se reconoce un razonamiento que sustente la conclusión o decisión indicada.',
   ])
   case 'explanations':return row(id,'Explicación de los hechos y sus relaciones',[
    receptive?`Relaciona los hechos y motivos de la explicación del ${source} en inglés para comprender lo ocurrido.`:'Explica en inglés lo ocurrido en el caso, relacionando los hechos y los motivos proporcionados para que se comprenda cómo se vinculan.',
    'Los hechos y su relación se comprenden; una referencia al motivo necesita precisión.',
    'Menciona hechos o motivos aislados sin aclarar una relación necesaria para comprender lo ocurrido.',
    'Confunde el hecho y su motivo o atribuye al caso una explicación incompatible con los datos.',
    'No se reconoce una explicación relacionada con los hechos del caso.',
   ])
   case 'habitual-state':return row(id,'Costumbre o familiaridad del referente indicado',[
    receptive?`Identifica en el ${source} en inglés a qué está acostumbrado o con qué está familiarizado el referente indicado.`:'Expresa en inglés a qué está acostumbrado o con qué está familiarizado el referente de la tarea, relacionando la costumbre establecida con los datos de la situación.',
    'La costumbre o familiaridad se comprende; una referencia a la situación necesita precisión.',
    'Menciona una actividad o referente, pero deja sin aclarar la costumbre o familiaridad solicitada.',
    'Presenta como nueva o no habitual una costumbre establecida, o atribuye otra al referente.',
    'No se reconoce la costumbre o familiaridad del referente indicado.',
   ])
   case 'adaptation':return row(id,'Proceso de adaptación relacionado con el cambio',[
    receptive?`Relaciona el proceso de adaptación del ${source} en inglés con la situación nueva y el cambio del referente.`:'Expresa en inglés el proceso de adaptación del referente a la situación nueva, relacionando el cambio con los datos proporcionados y distinguiéndolo de una costumbre ya establecida.',
    'Se comprende la adaptación y la situación nueva; una referencia al proceso de cambio necesita precisión.',
    'Menciona la situación nueva sin aclarar cómo se está adaptando el referente.',
    'Presenta como adaptación un estado ya establecido o cambia la situación nueva de los ejemplos.',
    'No se reconoce un proceso de adaptación relacionado con la situación indicada.',
   ])
   case 'past-hypothesis':return row(id,'Condición pasada y resultado alternativo de la hipótesis',[
    receptive&&!/\bhipotetiz\w*\b/.test(task.requirementText)?`Relaciona la condición pasada y el resultado alternativo de la hipótesis del ${source} en inglés, distinguiéndolos de lo ocurrido.`:'Formula en inglés una hipótesis sobre la situación pasada indicada, relacionando la condición no cumplida con el resultado alternativo que habría sido posible y distinguiéndolos de lo ocurrido.',
    'La condición pasada y el resultado alternativo se relacionan; una referencia necesita precisión.',
    'Menciona una condición o resultado aislados sin establecer su relación en la hipótesis pasada.',
    'Presenta como ocurrido el resultado hipotético o invierte la relación entre condición pasada y resultado.',
    'No se reconoce una hipótesis sobre la condición pasada y el resultado alternativo solicitados.',
   ])
   case 'job-interview':return row(id,'Respuestas relacionadas con el perfil de la entrevista simulada',[
    receptive?`Relaciona las preguntas y respuestas de la entrevista del ${source} en inglés con el perfil proporcionado del personaje.`:'Responde en inglés a las preguntas de la entrevista de trabajo simulada, relacionando la experiencia y capacidades solicitadas con los datos de la ficha del personaje ficticio.',
    'Las respuestas se relacionan con el perfil y las preguntas; una referencia a la ficha necesita precisión.',
    'Comunica datos aislados del perfil sin relacionarlos claramente con las preguntas de la entrevista.',
    'Las respuestas atribuyen al personaje experiencias o capacidades incompatibles con su ficha.',
    'No se reconocen respuestas relacionadas con las preguntas y el perfil de la entrevista simulada.',
   ])
   case 'detailed-narrative':return row(id,'Detalles y secuencia de los acontecimientos narrados',[
    receptive?`Relaciona los acontecimientos, referentes y detalles solicitados de la narración del ${source} en inglés para seguir su secuencia.`:'Narra en inglés los acontecimientos y experiencias indicados con los detalles proporcionados, enlazando hechos, referentes y secuencia para seguir lo ocurrido.',
    'Los acontecimientos y detalles principales se comprenden en su secuencia; una relación necesita precisión.',
    'Enumera acontecimientos, pero omite detalles o relaciones necesarios para seguir la narración solicitada.',
    'Cambia los referentes o la relación temporal entre los hechos y altera lo ocurrido en la narración.',
    'No se reconocen acontecimientos y detalles relacionados con la narración solicitada.',
   ])
   default:throw new Error('Función de sexto no definida')
  }
 })
 const matches:Record<string,string>={'past-present':'pasado (?:y|con el) presente','cultural-ideas':'ideas? (?:abstractas?|culturales?)','ask-reasoning':'razonamientos?',reasoning:'razonamientos?','ask-explanations':'explicacion(?:es)?',explanations:'explicacion(?:es)?','habitual-state':'costumbres?|familiaridad',adaptation:'adaptacion','past-hypothesis':'hipotesis','job-interview':'entrevistas? de trabajo','detailed-narrative':'narracion(?:es)?|relatos?'}
 const combined=englishAlternativeGroups(task.requirementText,rows.map(c=>({...c,id:c.templateId.slice(6),match:matches[c.templateId.slice(6)]}))).map(group=>{
  if(group.length===1){const {id,match,...criterion}=group[0];return criterion}
  return row(group.map(c=>c.id).join('-or-'),group.map(c=>c.title).join(' o '),[0,1,2,3,4].map(i=>group.map(c=>c.progressionLevels![i]).join(' / ')+' Se valora únicamente la alternativa elegida.') as Parameters<typeof row>[2])
 })
 combined.push(...requestedGradeSixGrammar(task.requirementText).map(f=>gradeSixGrammarCriterion(f,task.requirementText,mode)))
 combined.push(...requestedGradeSixLexicon(task.requirementText).map(f=>gradeSixLexicalCriterion(f,task.requirementText,mode)))
 combined.push(...gradeSixStrategyCriteria(task.requirementText,mode))
 combined.push(...gradeSixContextCriteria(task,combined))
 combined.push(...gradeSixGenreCriteria(task.requirementText,mode,combined))
 if(combined.length)combined.push(...upperEnglishCommunication(task,'ing-6'))
 return combined
}
const provider=createUpperEnglishProvider({grade:6,functions:requestedGradeSixFunctions,criteria:sixthGradeEnglishContent})
export const commonSixthGradeEnglish=provider.common
export const resolveSixthGradeEnglishTask=provider.resolve
