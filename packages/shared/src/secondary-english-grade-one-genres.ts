import type {ContextualTopicCriterion} from './secondary-topic-criteria'
export type Genre={id:string;match:string;title:string;data:string;production:string;error:string;existingFunction?:string}
const genre=(id:string,match:string,title:string,data:string,production:string,error:string,existingFunction?:string):Genre=>({id,match,title,data,production,error,...(existingFunction?{existingFunction}:{})})
/** Discursive examples in PDF134,136. Criteria address basic communication, not professional genre mastery. */
export const englishGradeOneGenres:Genre[]=[
 genre('conversation','conversacion(?:es)?|dialogos?','Intercambio de la conversación','la relación entre las intervenciones de los interlocutores','Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado.','confunde quién interviene o a qué intervención responde'),
 genre('business-card','tarjetas? de presentacion|business cards?','Datos de la tarjeta de presentación','los datos de identificación y contacto solicitados de la tarjeta','Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado.','atribuye los datos de la tarjeta a un referente diferente'),
 genre('list','listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))','Elementos de la lista','los elementos de la lista que corresponden a la búsqueda solicitada','Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada.','incorpora elementos ajenos a la categoría o finalidad de la lista'),
 genre('advertisement','anuncios?|advertisements?','Producto o servicio anunciado','el producto o servicio y la información solicitada del anuncio','Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado.','atribuye al producto o servicio características diferentes de las comunicadas'),
 genre('recipe','recetas?|recipes?','Acciones de la receta','las acciones de preparación y su orden en la receta','Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.','invierte o cambia acciones de preparación y altera las instrucciones','instructions'),
 genre('sign','letreros?|signs?','Indicación del letrero','la indicación del letrero para la situación en que aparece','Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario.','confunde una indicación con su prohibición o comunica una acción diferente'),
 genre('notice','avisos?|notices?','Información del aviso','la información del aviso que permite comprender lo comunicado','Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada.','cambia lo anunciado o a quién se dirige el aviso'),
 genre('poster','afiches?|carteles?|posters?','Mensaje del afiche','el mensaje central del afiche y la información solicitada','Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo.','el mensaje dispuesto comunica un propósito diferente del solicitado'),
 genre('message','mensajes?|messages?','Propósito del mensaje','el propósito del mensaje y los datos solicitados para comprenderlo','Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada.','el contenido cambia la intención o el destinatario del mensaje'),
 genre('email','correos? electronicos?|e mails?|emails?','Comunicación por correo electrónico','el destinatario y propósito del correo y su información solicitada','Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado.','dirige a otra persona información que no corresponde al propósito del correo'),
 genre('cv','curriculum vitae|curriculum|cv','Perfil del currículum vitae','los datos de perfil solicitados en el currículum vitae','Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado.','atribuye datos de perfil a otra persona o los ubica en un apartado diferente'),
 genre('letter','cartas?|letters?','Comunicación de la carta','el destinatario y propósito de la carta y la información solicitada','Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado.','el mensaje se dirige a un destinatario o propósito diferente del acordado'),
 genre('form','formularios?|forms?','Información del formulario','los campos solicitados del formulario y los datos que contienen o requieren','Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada.','sitúa los datos en campos que piden una información diferente'),
 genre('forecast','pronosticos? del tiempo|weather forecasts?','Información del pronóstico','las condiciones atmosféricas y sus referencias solicitadas en el pronóstico','Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.','atribuye al pronóstico condiciones diferentes de las indicadas','weather'),
 genre('news','noticias?|news','Información de la noticia','el suceso comunicado y los datos solicitados de la noticia','Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia.','cambia el suceso o atribuye sus datos a otro acontecimiento'),
 genre('schedule','horarios?|timetables?','Actividad y momento del horario','la actividad y momento que corresponden a la consulta del horario','Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse.','asigna a la actividad un momento diferente del indicado'),
 genre('agenda','agendas?','Compromisos de la agenda','los compromisos y sus referencias temporales solicitadas en la agenda','Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda.','cambia la correspondencia entre el compromiso y su momento'),
 genre('map','croquis|mapas?|maps?','Referencias del croquis','las ubicaciones y referencias del croquis necesarias para responder a la consulta','Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas.','invierte una ubicación o referencia y cambia el recorrido consultado'),
 genre('questionnaire','cuestionarios?|questionnaires?','Información buscada por las preguntas','la información buscada por las preguntas del cuestionario','Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada.','formula o interpreta preguntas que buscan información distinta de la solicitada'),
 genre('brochure','folletos?|brochures?','Información del folleto','la información del folleto pertinente para la consulta solicitada','Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados.','la organización o los datos del folleto conducen a información diferente de la solicitada'),
 genre('song','cancion(?:es)?|songs?','Mensaje de la canción','el mensaje de la canción expresado por las palabras solicitadas','Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada.','cambia palabras o relaciones que alteran el sentido del mensaje de la canción'),
 genre('poem','poesias?|poemas?|poems?','Sentido de los versos','el sentido de los versos y las expresiones solicitadas de la poesía','Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada.','atribuye a los versos un sentido incompatible con sus palabras'),
 genre('comic','historietas?|comics?','Secuencia de la historieta','la relación entre las viñetas y los mensajes de la historieta','Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible.','invierte la secuencia o atribuye a una viñeta un mensaje diferente'),
 genre('tourist-guide','guias? turisticas?|tourist guides?','Orientaciones de la guía turística','los lugares y orientaciones de la guía pertinentes para la consulta','Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada.','confunde los lugares o las orientaciones y conduce a información diferente'),
 genre('description','descripcion(?:es)?|descriptions?','Características de lo descrito','las características solicitadas y el referente descrito','Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.','atribuye las características a un referente distinto','description'),
 genre('biography','biografias?|biographies','Acontecimientos de la biografía','los acontecimientos de la vida de la persona y sus relaciones solicitadas','Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles.','atribuye los acontecimientos a otra persona o cambia su relación'),
 genre('narrative','narracion(?:es)?|relatos?|narratives?','Acontecimientos de la narración','los acontecimientos y personajes presentes en la narración y las relaciones solicitadas','Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda.','cambia los acontecimientos o sus relaciones y altera la narración'),
 genre('meme','memes?','Relación entre texto e imagen','la relación entre texto e imagen que comunica el meme','Relaciona el texto e imagen del meme para comunicar en inglés el mensaje acordado de forma comprensible.','el texto contradice la imagen y cambia la intención comunicativa acordada'),
 genre('audiovisual','produccion(?:es)? audiovisual(?:es)?|videos?','Mensaje de la producción audiovisual','la relación entre los recursos seleccionados y el mensaje audiovisual','Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado.','los recursos comunican ideas incompatibles con el mensaje solicitado'),
]

export const requestedEnglishGenres=(text:string,genres=englishGradeOneGenres)=>genres.filter(g=>new RegExp(`\\b(?:${g.match})\\b`).test(text))

export function englishGenreCriteria(text:string,mode:string,existing:ContextualTopicCriterion[],scope='ing-1',genres=englishGradeOneGenres,preserveRequestedData=false):ContextualTopicCriterion[]{
 const receptive=mode==='reading'||mode==='listening',source=mode==='listening'?'mensaje escuchado':'texto disponible'
 return requestedEnglishGenres(text,genres).filter(g=>{
  if(g.existingFunction&&existing.some(c=>c.templateId===`${scope}-${g.existingFunction}`))return false
  if(existing.length&&['message','conversation','schedule'].includes(g.id))return false
  // A text used to inspect a requested form or strategy is a source, not another deliverable.
  if(receptive&&existing.some(c=>new RegExp(`${scope}-(?:feature|lexicon|strategy)-`).test(c.templateId))){
   const explicitData=preserveRequestedData&&/\b(?:identific\w*|localiz\w*|reconoc\w*)\b.*\b(?:destinatario|proposito|informacion|datos|actividades|horas?|precio|lugares?|acontecimientos|personajes)\b/.test(text)
   if(!explicitData)return false
  }
  return true
 }).map(original=>{
  let g=original
  if(receptive&&g.id==='schedule'){
   const evidence=text.match(/\b(?:identific\w*|localiz\w*|reconoc\w*)\s+(.+)/)?.[1]??''
   if(/\bactividades\b/.test(evidence)&&!/\b(?:hora\w*|momento\w*|informacion|datos)\b/.test(evidence))g={...g,data:'las actividades solicitadas del horario',error:'identifica una actividad distinta de la indicada en el horario'}
  }
  if(receptive&&['email','letter'].includes(g.id)){
   const evidence=text.match(/\b(?:identific\w*|localiz\w*|reconoc\w*)\s+(.+)/)?.[1]??''
   const recipient=/\bdestinatarios?\b/.test(evidence),purpose=/\b(?:proposito|intencion)\b/.test(evidence)
   if(recipient!==purpose&&!/\b(?:informacion|datos|contenido)\b/.test(evidence)){
    const sourceName=g.id==='email'?'del correo':'de la carta'
    g={...g,data:`${recipient?'el destinatario':'el propósito'} ${sourceName}`,error:recipient?'atribuye el mensaje a un destinatario distinto del indicado':'atribuye al mensaje una intención contraria a la comunicada'}
   }
  }
  const levels:ContextualTopicCriterion['progressionLevels']=receptive?[
   `Identifica ${g.data} en el ${source} en inglés.`,
   `Reconoce ${g.data}; una referencia aislada necesita precisión.`,
   `Recupera datos aislados, pero no permite reconocer por completo ${g.data}.`,
   `La interpretación altera la información: ${g.error}.`,
   `No aporta información reconocible sobre ${g.data} a partir del ${source}.`,
  ]:[
   g.production,
   `La producción permite reconocer ${g.data}; una relación necesita precisión.`,
   `Incluye datos o expresiones aislados, pero deja incompleta la relación necesaria para reconocer ${g.data}.`,
   `La producción cambia el sentido: ${g.error}.`,
   `No aporta una producción reconocible que comunique ${g.data}.`,
  ]
  return {templateId:`${scope}-genre-${g.id}`,title:g.title,observable:levels[0],weight:4,progressionLevels:levels}
 })
}
