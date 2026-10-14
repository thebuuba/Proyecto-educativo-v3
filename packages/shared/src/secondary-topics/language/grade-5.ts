import {dimension,type SecondaryLanguageTopic} from '../../secondary-topic-types'
import {secondaryLanguageGradeFourTopics} from './grade-4'
const topic=(id:string,aliases:string[],element:string,pages:number[],dimensions:SecondaryLanguageTopic['dimensions']):SecondaryLanguageTopic=>({id,grade:5,subjectCode:'LEN',aliases,source:{topicElementId:element,pdfPages:pages,printedPages:pages.map(p=>p-1)},dimensions})
/** Adaptaciones evaluativas; conceptos y procedimientos cotejados en PDF105–111. */
export const secondaryLanguageGradeFiveTopics:SecondaryLanguageTopic[]=[
 topic('carta-autopresentacion',['carta de autopresentación','cartas de autopresentación','carta de auto presentación'],'5d3121ba-2636-556d-9fe3-2cabbc81ec1f',[105,106],[
  dimension('purpose','Propósito, destinatario y organización de la carta','Organiza la carta de autopresentación para que el destinatario reconozca quién escribe y con qué propósito se dirige a él.','Explica cómo las partes de la carta permiten reconocer al remitente, al destinatario y el propósito de presentarse.','Contrasta los propósitos, destinatarios y organización de las cartas de autopresentación.',[
   'Se reconocen remitente y propósito; una referencia al destinatario necesita aclararse.','Enumera partes de la carta sin relacionarlas con quién escribe ni para qué.','Confunde al remitente con el destinatario o atribuye un propósito contrario a la carta.','No se reconoce quién se presenta ni el propósito de la carta.']),
  dimension('reasons','Capacidades y razones de la autopresentación','Fundamenta el interés en presentarse relacionando capacidades o experiencias pertinentes con el propósito de la carta.','Explica qué capacidades o experiencias sustentan los motivos de la autopresentación y cómo responden al propósito de la carta.','Compara las capacidades, experiencias y motivos con que cada remitente fundamenta su autopresentación.',[
   'Las capacidades sustentan el interés; una relación con el propósito queda implícita.','Enumera cualidades o experiencias sin explicar su pertinencia para la autopresentación.','Atribuye capacidades ajenas al remitente o razones incompatibles con el propósito.','No relaciona capacidades ni experiencias con los motivos de presentarse.'],5),
 ]),
 topic('resena',['reseña','reseñas'],'0ea78b99-7e34-5be4-9a1f-96b6ea7b45f4',[106],[
  dimension('summary','Identificación y síntesis de la obra reseñada','Sitúa la obra reseñada y sintetiza su contenido conservando sus relaciones principales, distinguiéndolo de la opinión propia.','Distingue la información que identifica y sintetiza la obra de las valoraciones de quien escribe la reseña.','Contrasta la selección y síntesis del contenido de la obra en las reseñas.',[
   'La síntesis conserva el contenido; una referencia a la obra necesita precisarse.','Enumera datos de la obra sin relacionarlos o mezcla resumen con opinión.','Atribuye a la obra hechos que no contiene o presenta la opinión como contenido original.','No presenta una síntesis reconocible del contenido reseñado.']),
  dimension('assessment','Valoración sustentada de la obra','Sustenta la valoración personal de la obra con aspectos identificables de su contenido o realización y explica por qué apoyan su juicio.','Explica los juicios de la reseña y comprueba cómo se apoyan en aspectos identificables de la obra.','Compara los juicios de las reseñas y los aspectos de la obra que utiliza cada una para sustentarlos.',[
   'El juicio tiene apoyo en la obra; una relación con la evidencia necesita explicarse.','Expresa gusto o disgusto sin vincularlo con aspectos reconocibles de la obra.','Justifica el juicio con contenido ajeno o contrario a la obra reseñada.','No presenta una valoración sustentada de la obra.'],5),
 ]),
 topic('ensayo-argumentativo',['ensayo argumentativo','ensayos argumentativos'],'f6f6b823-a101-51b0-9d20-f9b2ffda0a1c',[106,107],[
  dimension('thesis','Tesis y desarrollo del ensayo','Formula una tesis discutible y organiza el ensayo para que se reconozca la postura y su desarrollo sobre el asunto tratado.','Identifica la tesis y explica cómo las partes del ensayo desarrollan la postura del autor.','Contrasta las tesis y la organización del desarrollo de los ensayos.',[
   'La postura es reconocible; una parte del desarrollo necesita relacionarse con ella.','Menciona un tema sin delimitar la postura que se defiende.','Atribuye al ensayo una tesis contraria a la que sostiene su desarrollo.','No se reconoce una tesis ni su desarrollo en el ensayo.']),
  dimension('arguments','Argumentos vinculados con la tesis','Sostiene la tesis con razones y evidencias pertinentes, explicando qué permiten afirmar y cuáles son sus límites.','Explica cómo los argumentos del ensayo sostienen su tesis y distingue las razones de los ejemplos o evidencias.','Contrasta la relación entre tesis, razones y evidencias en los ensayos.',[
   'Las razones apoyan la tesis; una inferencia necesita explicar su apoyo.','Enumera razones o ejemplos sin relacionarlos con la tesis.','Deriva una afirmación que contradice las evidencias o confunde ejemplo con prueba general.','No relaciona argumentos ni evidencias con la tesis del ensayo.'],5),
 ]),
 topic('discurso-recibimiento-despedida',['discurso de recibimiento y despedida','discurso oral de recibimiento y despedida','discurso de recibimiento','discurso de despedida','discurso oral de recibimiento','discurso oral de despedida','discursos de recibimiento','discursos de despedida'],'868a8bf4-0c30-5672-9c57-e7955ff282bd',[107,108],[
  dimension('occasion','Ocasión, roles y destinatarios del discurso','Sitúa la ocasión y los roles de quien habla y de los participantes, adecuando el recibimiento o despedida al destinatario.','Identifica la ocasión y distingue los roles de quien habla, de quien recibe el mensaje y del público del discurso.','Contrasta las ocasiones, destinatarios y roles de los participantes en los discursos.',[
   'Los roles se reconocen; una referencia a los participantes necesita aclararse.','Nombra personas sin distinguir sus papeles en la ocasión.','Confunde a quien recibe la bienvenida o despedida con quien la pronuncia.','No se reconoce la ocasión ni a quién se dirige el discurso.']),
  dimension('reasons','Razones y secuencia del recibimiento o despedida','Relaciona las razones del encuentro o separación con el mensaje de recibimiento o despedida y organiza su desarrollo para los participantes.','Explica cómo las razones y la secuencia del discurso dan sentido al recibimiento o despedida en su ocasión.','Compara las razones y la secuencia con que cada discurso da sentido al recibimiento o despedida.',[
   'Las razones explican la ocasión; una transición necesita vincularse con el mensaje.','Enumera elogios o recuerdos sin relacionarlos con la ocasión.','Atribuye a los participantes razones contrarias al encuentro o separación descritos.','No relaciona razones con el sentido del recibimiento o despedida.'],5),
 ]),
 topic('novela',['novela','novelas'],'b9fb8677-c4d8-57c2-9304-f0b11d879de9',[108,109],secondaryLanguageGradeFourTopics.find(t=>t.id==='novela')!.dimensions),
 topic('poesia-satirica',['poesía satírica','poesías satíricas','poema satírico','poemas satíricos'],'9ba1f04a-8d21-5f0c-93c5-75cff971574b',[109,110],[
  dimension('critique','Blanco y sentido de la crítica satírica','Desarrolla una crítica reconocible de un comportamiento o situación mediante la voz y las imágenes del poema satírico.','Interpreta la crítica del poema satírico y la sustenta en palabras e imágenes que permiten reconocer a qué comportamiento o situación se dirige.','Contrasta los blancos y sentidos de la crítica mediante palabras e imágenes de los poemas satíricos.',[
   'La crítica se reconoce; una imagen necesita relacionarse con su blanco.','Enumera burlas o imágenes sin explicar qué se critica.','Interpreta como aprobación lo que el poema critica o atribuye un blanco ajeno.','No relaciona palabras o imágenes con la crítica del poema.'],5),
  dimension('tone','Organización y tono burlesco','Enlaza las expresiones del poema en verso o prosa para sostener su tono burlesco y el sentido de la crítica.','Explica cómo la organización en verso o prosa y el tono burlesco contribuyen al sentido del poema.','Compara cómo la organización y el tono burlesco sostienen la crítica en los poemas.',[
   'El tono sostiene la crítica; una expresión necesita relacionarse con ella.','Identifica expresiones burlescas sin explicar su relación con el sentido.','Confunde la voz satírica con una afirmación literal y cambia su intención.','No reconoce la relación entre tono, organización y crítica.']),
 ]),
 topic('entremes-teatral',['entremés teatral','entremeses teatrales','entremés','entremeses'],'e3e55532-c167-522b-af89-d39d7054a67f',[110,111],[
  dimension('scene','Conflicto, personajes y diálogo de la escena','Desarrolla una escena breve de entremés en la que las intervenciones de los personajes hacen reconocible el conflicto y sus cambios.','Relaciona el conflicto de la escena disponible con los personajes y las intervenciones que hacen avanzar la acción del entremés.','Compara conflictos e intervenciones de los personajes en las escenas de entremés disponibles.',[
   'Las intervenciones permiten seguir el conflicto; una transición necesita aclararse.','Enumera intervenciones o personajes sin explicar su relación con el conflicto.','Atribuye una intervención a otro personaje y cambia el sentido del conflicto.','No relaciona las intervenciones de los personajes con la acción de la escena.']),
  dimension('critique','Crítica social y sentido del entremés','Construye una crítica social reconocible mediante las situaciones, diálogos y recursos cómicos del entremés.','Interpreta la crítica social del entremés con apoyo en las situaciones y diálogos de la escena disponible.','Contrasta la crítica social mediante situaciones y diálogos de los entremeses.',[
   'La crítica tiene apoyo en la escena; un vínculo con el diálogo necesita explicarse.','Enumera elementos cómicos sin explicar qué conducta o situación se critica.','Atribuye a la escena una crítica contraria a sus situaciones y diálogos.','No relaciona la crítica con evidencia de la escena disponible.'],5),
 ]),
]
// Performance is assessed in the scene itself; an analytical commentary is a different product.
const performanceEvidence:Record<string,NonNullable<SecondaryLanguageTopic['dimensions'][number]['performance']>>={
 scene:{observable:'Hace reconocible el conflicto en la escena representada mediante las intervenciones y reacciones de los personajes, conservando sus relaciones y cambios.',evidence:[
  'El conflicto se comprende; una reacción necesita vincularse mejor con la intervención anterior.',
  'Representa intervenciones aisladas que no permiten seguir los cambios del conflicto.',
  'Atribuye una intervención a otro personaje y cambia el conflicto de la escena representada.',
  'No se reconoce el conflicto a través de las intervenciones representadas.',
 ]},
 critique:{observable:'Comunica la crítica social del entremés mediante el sentido de las situaciones y los recursos cómicos de la representación.',evidence:[
  'La crítica se reconoce en la escena; un énfasis cómico necesita relacionarse mejor con la situación.',
  'Presenta efectos cómicos aislados que no permiten reconocer la conducta o situación criticada.',
  'La representación comunica una postura contraria a la crítica del entremés.',
  'No se reconoce la crítica social en las situaciones representadas.',
 ]},
}
for(const d of secondaryLanguageGradeFiveTopics.find(t=>t.id==='entremes-teatral')!.dimensions)d.performance=performanceEvidence[d.id]
