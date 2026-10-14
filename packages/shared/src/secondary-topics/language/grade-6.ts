import {dimension,type SecondaryLanguageTopic} from '../../secondary-topic-types'
import {secondaryLanguageGradeFourTopics} from './grade-4'
import {secondaryLanguageGradeFiveTopics} from './grade-5'
const topic=(id:string,aliases:string[],element:string,pages:number[],dimensions:SecondaryLanguageTopic['dimensions']):SecondaryLanguageTopic=>({id,grade:6,subjectCode:'LEN',aliases,source:{topicElementId:element,pdfPages:pages,printedPages:pages.map(p=>p-1)},dimensions})
export const secondaryLanguageGradeSixTopics:SecondaryLanguageTopic[]=[
 topic('informe-investigacion',['informe de investigación','informes de investigación','informe investigativo'],'5f005c94-af0b-5100-8283-dc67139a010f',[113,114],secondaryLanguageGradeFourTopics.find(t=>t.id==='informe-investigacion')!.dimensions),
 topic('reportaje',['reportaje','reportajes'],'4552445e-e0c1-55d2-9cdb-2a1c0b7dd4a6',[114,115],[
  dimension('context','Hechos y contexto del reportaje','Explica los hechos y sus relaciones con el problema investigado, distinguiendo información comprobable de interpretaciones y situándolos en su contexto.','Explica cómo los hechos y su contexto permiten comprender el problema tratado por el reportaje y distingue información de interpretación.','Contrasta el tratamiento de los hechos y su contexto en los reportajes, usando información que cada uno aporta.',[
   'Los hechos se relacionan con el problema; un dato de contexto necesita precisarse.','Enumera hechos sin explicar cómo permiten comprender el problema.','Atribuye al hecho un contexto incompatible o presenta una interpretación como dato comprobado.','No relaciona hechos y contexto con el problema tratado.'],5),
  dimension('organization','Desarrollo informativo del reportaje','Organiza la información del reportaje para desarrollar el tema con relaciones comprensibles entre sus hechos, explicaciones y detalles pertinentes.','Explica cómo la organización del reportaje enlaza hechos, explicaciones y detalles para desarrollar el tema.','Compara cómo cada reportaje organiza sus hechos y explicaciones y qué comprensión permite al lector.',[
   'Se sigue el desarrollo del tema; una transición necesita relacionar mejor los datos.','Acumula datos o detalles sin establecer sus relaciones.','La distribución mezcla datos de casos distintos y cambia el sentido del tema tratado.','No presenta un desarrollo reconocible del tema del reportaje.']),
 ]),
 topic('ensayo-argumentativo',['ensayo argumentativo','ensayos argumentativos'],'d30efb3e-9cbc-5609-8cf4-1dbdc1590d75',[115,116],secondaryLanguageGradeFiveTopics.find(t=>t.id==='ensayo-argumentativo')!.dimensions),
 topic('discurso-graduacion',['discurso de graduación','discurso oral de graduación','discursos de graduación','discursos orales de graduación'],'63507baa-230a-5de2-8b57-71b1f96b79a1',[116,117,118],[
  dimension('occasion','Ocasión y participantes de la graduación','Sitúa el significado de la graduación y dirige el mensaje a sus participantes con referencias reconocibles para la ocasión.','Identifica la ocasión, los participantes y el significado que el discurso atribuye a la graduación mediante referencias presentes.','Contrasta el significado de la graduación y las referencias a los participantes en los discursos.',[
   'La ocasión y los participantes se reconocen; una referencia necesita precisarse.','Menciona participantes sin relacionarlos con el significado de la ocasión.','Atribuye a los participantes experiencias contrarias a las referencias del discurso.','No se reconoce el significado de la ocasión ni a quién se dirige el mensaje.']),
  dimension('thesis','Tesis y razones del mensaje de graduación','Fundamenta una tesis pertinente a la graduación con razones y experiencias disponibles, enlazando el desarrollo con el sentido del mensaje para los participantes.','Explica la tesis del discurso y cómo sus razones o experiencias sustentan el mensaje para los participantes de la graduación.','Compara las tesis y sus apoyos en los discursos de graduación.',[
   'Las razones sustentan la tesis; una relación con la ocasión queda implícita.','Enumera deseos o recuerdos sin relacionarlos con una tesis.','Atribuye a una experiencia un significado contrario al argumento del discurso.','No relaciona una tesis con razones pertinentes a la graduación.'],5),
 ]),
 topic('novela',['novela','novelas'],'324f4751-173e-5862-b222-b448ab38d26c',[118],secondaryLanguageGradeFourTopics.find(t=>t.id==='novela')!.dimensions),
 topic('poesia-social',['poesía social','poema social','poemas sociales','poema de contenido social','poemas de contenido social'],'9b92013d-f1f5-5ad3-9cfe-3d749c611421',[119],[
  dimension('meaning','Voz y problemática del poema social','Desarrolla una postura o sentimiento ante una problemática social mediante la voz y las situaciones del poema, manteniendo reconocible su relación.','Interpreta la postura o sentimiento de la voz poética ante una problemática social con apoyo en las palabras y situaciones del poema.','Contrasta posturas y sentimientos de las voces poéticas ante las problemáticas tratadas en los poemas.',[
   'La postura se reconoce; una relación con la situación social necesita explicarse.','Nombra un problema o sentimiento sin relacionarlo con la voz del poema.','Atribuye a la voz una postura contraria a las palabras o situaciones del poema.','No relaciona una postura o sentimiento con la problemática del poema.'],5),
  dimension('images','Imágenes y desarrollo del sentido social','Enlaza palabras e imágenes para desarrollar el sentido del poema social, conservando sus relaciones a través de los versos.','Explica cómo las palabras e imágenes desarrollan el sentido social del poema mediante relaciones presentes en los versos.','Contrasta cómo las imágenes de los poemas contribuyen al desarrollo de su sentido social.',[
   'Las imágenes se relacionan con el sentido; un enlace entre versos necesita aclararse.','Enumera imágenes aisladas sin explicar su relación con el sentido del poema.','Interpreta literalmente una imagen y cambia el sentido de la situación evocada.','No relaciona imágenes o palabras de los versos con el sentido social del poema.']),
 ]),
 topic('monologo',['monólogo','monólogos','monólogo teatral'],'8a46a4a6-74a7-5488-a880-384c273549a4',[119,120],[
  dimension('voice','Voz, personaje y punto de vista del monólogo','Construye una voz monologal reconocible mediante sus ideas, experiencias y formas de expresión, manteniendo el punto de vista del personaje.','Interpreta el punto de vista de la voz monologal relacionando sus ideas, experiencias y formas de expresión en el texto disponible.','Contrasta los puntos de vista y las formas de expresión de las voces de los monólogos.',[
   'La voz mantiene su punto de vista; una expresión necesita vincularse mejor con el personaje.','Enumera ideas o rasgos sin relacionarlos con la voz del personaje.','Confunde la voz del personaje con la del autor y le atribuye ideas ajenas.','No se reconoce una voz ni un punto de vista sustentado en sus intervenciones.'],5),
  dimension('development','Desarrollo del tema y situación del monólogo','Organiza el parlamento relacionando la situación, las ideas y los cambios de la voz monologal para que se comprenda el tema que desarrolla.','Explica cómo la situación y la secuencia del parlamento desarrollan el tema y permiten comprender los cambios de la voz monologal.','Compara cómo las situaciones y secuencias de los monólogos desarrollan sus temas.',[
   'El desarrollo se comprende; una transición entre ideas necesita aclararse.','Enumera intervenciones sin relacionarlas con la situación ni el desarrollo del tema.','Invierte una relación entre intervenciones y cambia el sentido del parlamento.','No relaciona las intervenciones con la situación ni con el tema del monólogo.']),
 ]),
]
const performanceEvidence:Record<string,NonNullable<SecondaryLanguageTopic['dimensions'][number]['performance']>>={
 voice:{observable:'Mantiene reconocible el punto de vista del personaje durante la representación del monólogo mediante sus intervenciones y formas de expresión.',evidence:[
  'El punto de vista se mantiene; una expresión necesita vincularse mejor con la intención del personaje.',
  'Dice intervenciones aisladas sin mantener reconocible el punto de vista de la voz monologal.',
  'La expresión atribuye al personaje una intención contraria al sentido de sus intervenciones.',
  'No se reconoce el punto de vista del personaje en la representación.',
 ]},
 development:{observable:'Hace comprensible la situación y el desarrollo del tema en la representación del monólogo mediante el orden y las relaciones entre sus intervenciones.',evidence:[
  'Se sigue la situación y el tema; una transición necesita enlazarse mejor con la intervención anterior.',
  'Representa fragmentos desconectados que dificultan seguir la situación y el tema.',
  'El orden de las intervenciones cambia el sentido de la situación representada.',
  'No se reconoce una relación entre las intervenciones, la situación y el tema representados.',
 ]},
}
for(const d of secondaryLanguageGradeSixTopics.find(t=>t.id==='monologo')!.dimensions)d.performance=performanceEvidence[d.id]
