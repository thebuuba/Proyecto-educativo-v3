import type {ContextualTopicCriterion} from './secondary-topic-criteria'

const criterion=(id:string,title:string,levels:ContextualTopicCriterion['progressionLevels']):ContextualTopicCriterion=>({templateId:`ing-1-context-${id}`,title,observable:levels[0],progressionLevels:levels,weight:3})

/** Assess the communication requested, never a student's beliefs, identity or circumstances. */
export function englishContextCriteria(text:string,receptive=false):ContextualTopicCriterion[]{
 const rows:ContextualTopicCriterion[]=[]
 if(receptive)return rows
 if(/\b(?:opciones|alternativas|soluciones) justas\b/.test(text))rows.push(criterion('fair-options','Opciones justas ante la situación',[
  'Propone en inglés opciones relacionadas con el problema indicado que consideran a las personas implicadas sin perjudicarlas.',
  'La opción responde al problema y contempla a las personas implicadas; una relación necesita aclaración.',
  'Propone una opción, pero no queda claro cómo responde al problema o considera a las personas implicadas.',
  'La opción propuesta mantiene el problema o perjudica a alguna persona sin abordar ese efecto.',
  'No aporta una opción reconocible para enfrentar la situación indicada.',
 ]))
 const care=/\b(?:cuid\w*|proteg\w*|preserv\w*|benefici\w*|impact\w* positivamente|efecto positivo)\b/.test(text)
 const target=[/\bsalud\b/.test(text)?'la salud':'',/\b(?:medioambiente|medio ambiente|ambiente)\b/.test(text)?'el medioambiente':''].filter(Boolean).join(' y ')
 if(care&&target)rows.push(criterion('positive-care','Acciones de cuidado solicitadas',[
  `Comunica en inglés acciones pertinentes para cuidar ${target}, relacionándolas con el cuidado solicitado.`,
  `Las acciones contribuyen al cuidado de ${target}; una relación del mensaje necesita precisión.`,
  `Menciona acciones, pero no queda clara su relación con el cuidado de ${target}.`,
  `Las acciones comunicadas contradicen el cuidado de ${target} solicitado.`,
  `No aporta acciones reconocibles relacionadas con el cuidado de ${target}.`,
 ]))
 if(/\b(?:con respeto|con cortesia|respetuos\w*|cortes\w*|asertiv\w*)\b/.test(text))rows.push(criterion('respectful-message','Comunicación respetuosa y asertiva',[
  'Expresa en inglés el mensaje solicitado con fórmulas de cortesía y desacuerdo o petición respetuosa pertinentes, sin descalificar al destinatario.',
  'Comunica su intención respetuosamente; una fórmula necesita ajuste para la situación.',
  'La intención se reconoce, pero la petición o el desacuerdo necesita reformulación para evitar descalificaciones.',
  'Las expresiones descalifican al destinatario o impiden reconocer una petición respetuosa.',
  'No aporta una expresión reconocible de la intención comunicativa solicitada.',
 ]))
 if(/\b(?:sin estereotipos|sin discriminacion|ni discriminacion|sin discriminar|equidad de genero)\b/.test(text)){
 const differences=[['genero','género'],['discapacidad','discapacidad'],['origen|nacionalidad','origen o nacionalidad'],['edad','edad'],['rasgos fisicos|etni','rasgos físicos'],['posesiones|pertenencias','posesiones']].filter(([pattern])=>new RegExp(pattern).test(text)).map(([,label])=>label).join(', ')
 rows.push(criterion('equitable-message','Descripción sin estereotipos',[
  `Comunica en inglés las características o capacidades solicitadas sin atribuir limitaciones por ${differences||'las diferencias indicadas'}.`,
  'La descripción evita atribuciones discriminatorias; una expresión necesita precisión.',
  'Describe características, pero una generalización no se sustenta en la información de la persona o personaje.',
  'Atribuye capacidades o limitaciones a un grupo en lugar de describir la información indicada.',
  'No aporta una descripción reconocible de las características o capacidades solicitadas.',
 ]))
 }
 if(/\b(?:ayuda solidaria|ayuda solidari\w*|ofrec\w* ayuda|solidaridad)\b/.test(text)&&/dificultad|problema/.test(text))rows.push(criterion('support','Ayuda relacionada con la dificultad',[
  'Ofrece en inglés una ayuda concreta relacionada con la dificultad indicada y permite reconocer qué apoyo propone.',
  'La ayuda es pertinente; una referencia del apoyo propuesto necesita aclaración.',
  'Ofrece ayuda de forma general sin relacionarla claramente con la dificultad indicada.',
  'La ayuda propuesta se refiere a otra dificultad y no atiende la situación planteada.',
  'No aporta una propuesta reconocible de ayuda ante la dificultad indicada.',
 ]))
 if(/\b(?:normas|indicaciones|medidas) de seguridad\b/.test(text))rows.push(criterion('safety','Indicaciones compatibles con la seguridad',[
  'Comunica en inglés acciones compatibles con las normas de seguridad proporcionadas para la situación indicada.',
  'Las acciones respetan las normas indicadas; una formulación necesita precisión.',
  'Incluye algunas medidas, pero omite una relación necesaria para comprender la seguridad solicitada.',
  'Una indicación contradice las normas de seguridad proporcionadas.',
  'No aporta acciones reconocibles relacionadas con las normas de seguridad indicadas.',
 ]))
 if(/\bpertenencias (?:ajenas|de (?:otras|las demas) personas)\b/.test(text)&&/permiso|condiciones de uso/.test(text)){
 const conditions=/condiciones de uso|acordad/.test(text)
 rows.push(criterion('property',conditions?'Permiso y condiciones de uso':'Petición de permiso',[
  conditions?'Formula en inglés la petición de permiso y comunica el uso acordado de las pertenencias indicadas sin atribuirse su propiedad.':'Formula en inglés una petición comprensible de permiso para usar las pertenencias indicadas, sin atribuirse su propiedad.',
  conditions?'Se reconocen la petición y las condiciones indicadas; una referencia necesita aclaración.':'Se reconoce la petición de permiso; una referencia a la pertenencia necesita aclaración.',
  conditions?'Pide usar la pertenencia, pero no permite reconocer las condiciones de uso indicadas.':'Nombra la pertenencia sin permitir reconocer claramente la petición de permiso para usarla.',
  conditions?'La petición contradice las condiciones acordadas o atribuye la pertenencia a otra persona.':'La petición atribuye la pertenencia a otra persona y cambia lo que se pide usar.',
  'No aporta una petición reconocible de permiso para el uso indicado.',
 ]))
 }
 return rows
}
