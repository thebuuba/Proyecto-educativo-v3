import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'

type Kind='HISTORY'|'HISTORY_ORAL'|'NEWS_PUBLISH'|'NEWS_DRAFT'|'NEWS_UNCONFIRMED'|'STORY_DIGITAL'|'STORY_PRINT'|'CALLIGRAM_PUBLISH'|'ENVIRONMENT_FORUM'|'ENVIRONMENT_LETTERS'|'ENVIRONMENT_CLASSROOM'|'ENVIRONMENT_SCRIPT'|'INFERENCE'|'SYNTHESIS'|'SUMMARY'|'PERSPECTIVE'|'PERSPECTIVE_EXCHANGE'|'PERSPECTIVE_READING'|'NEWS_RESPONSE'
export type FirstGradeCommunityTask={kind:Kind;task:string;raw:string;activityType:string}
/** Product phase and requested evidence take precedence over mentions of a genre. */
export function firstGradeCommunityTask(task:string,description:string):FirstGradeCommunityTask|null{
 const raw=description.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase(),found=(kind:Kind,activityType:string)=>({kind,task,raw,activityType})
 // A future purpose («escriban... para publicarlo») must not replace creation.
 const finished=/\brevisad[oa]s?\b|version final|ya revisaron|ya revisamos/.test(task)
 if(finished&&/noticia/.test(task)&&/guard\w*.*borrador/.test(task)&&/plantilla|vista previa/.test(task))return found('NEWS_DRAFT','WRITTEN_PRODUCTION')
 if(finished&&/noticia/.test(task)&&/\bpubli(?:ca|quen|quenla|car)\b/.test(task)&&/digital|portal/.test(task))return found('NEWS_PUBLISH','WRITTEN_PRODUCTION')
 if(finished&&/noticia/.test(task)&&/para compartir/.test(task)&&!/\bpubli\w*|vista previa|plantilla/.test(task))return found('NEWS_UNCONFIRMED','WRITTEN_PRODUCTION')
 if(finished&&/cuento/.test(task)&&/incorpora\w*|publica\w*/.test(task)&&/antologia.*digital/.test(task))return found('STORY_DIGITAL','WRITTEN_PRODUCTION')
 if(finished&&/cuento/.test(task)&&/incorpora\w*|publica\w*/.test(task)&&/antologia.*impresa|revista.*impresa/.test(task))return found('STORY_PRINT','WRITTEN_PRODUCTION')
 if(/caligrama/.test(task)&&/colo(?:ca|quen)\w*.*mural/.test(task)&&/version final|revisad|revisamos/.test(task))return found('CALLIGRAM_PUBLISH','WRITTEN_PRODUCTION')
 if(/tradicion.*dominicana|practica tradicional dominicana/.test(task)&&(/patrimonio natural|recurso natural/.test(task)&&/historia|historico|cambio|antes.*ahora/.test(task)||/explica.*cambio.*antes.*ahora/.test(task)))return found(/oral/.test(task)?'HISTORY_ORAL':'HISTORY',/oral/.test(task)?'EXPOSITION':'ANALYSIS')
 if(/ambiental/.test(task)&&/foro|comunidad/.test(task)&&/pregunta o propuesta|preguntas|pregunta que/.test(task)&&/respond\w*|respuesta|explicacion/.test(task))return found('ENVIRONMENT_FORUM','WRITTEN_PRODUCTION')
 if(/carta/.test(task)&&/otro centro/.test(task)&&/arboles|ambiental/.test(task)&&/respuesta/.test(task))return found('ENVIRONMENT_LETTERS','WRITTEN_PRODUCTION')
 const environmental=/agua|ambiental|conserv\w*.*arboles|arboles.*conserv\w*/.test(task)
 if(environmental&&/prepar\w*.*explicacion/.test(task)&&/guion/.test(task))return found('ENVIRONMENT_SCRIPT','WRITTEN_PRODUCTION')
 if(/intercambio.*dentro del aula/.test(task)&&environmental&&/pregunta o.*propuesta/.test(task)&&/respond\w*|respuesta/.test(task))return found('ENVIRONMENT_CLASSROOM','ORAL_INTERACTION')
 const oralReasoning=/oralmente|explicacion oral|presentacion oral/.test(task)
 if(/relacion.*(?:no aparezca|nueva)/.test(raw)&&/ambos|dos textos|ninguno de los dos/.test(task)&&/formula|explica/.test(task))return found('INFERENCE',oralReasoning?'EXPOSITION':'ANALYSIS')
 if((/sintesis/.test(task)||oralReasoning&&/conclusion propia/.test(task))&&/dos explicaciones|dos textos/.test(task)&&/diferencias?|discrepancias/.test(task)&&/algo mas|conclusion/.test(task))return found('SYNTHESIS',oralReasoning?'EXPOSITION':'WRITTEN_PRODUCTION')
 if(/\bresume\b/.test(task)&&/ideas principales/.test(task)&&/dos textos/.test(task)&&/diferencias/.test(task))return found('SUMMARY','WRITTEN_PRODUCTION')
 if(/fictici|imaginari/.test(task)&&/intercambia/.test(task)&&/nota/.test(task)&&/conservar o modificar|conserva o modifica/.test(task))return found('PERSPECTIVE_EXCHANGE','WRITTEN_PRODUCTION')
 if(/fictici|imaginari/.test(task)&&/que harias|como responderias|tu decision/.test(task)&&/contrasta/.test(task)&&/personaje|respuestas propuestas/.test(task))return found('PERSPECTIVE','ANALYSIS')
 if(/conflicto ficticio/.test(task)&&/explica.*razones.*respuestas/.test(task)&&/informacion del caso/.test(task))return found('PERSPECTIVE_READING','ANALYSIS')
 if(/noticia/.test(task)&&/individualmente/.test(task)&&/que ocurrio/.test(task)&&/dos datos/.test(task))return found('NEWS_RESPONSE','NEWS_ANALYSIS')
 return null
}
const row=(id:string,title:string,weight:number,levels:Criterion['progressionLevels'],coveredDeliveryKeys:string[]=[]):Criterion=>({templateId:'len1-community-'+id,title,weight,observable:levels[0],progressionLevels:levels,fourLevelLowest:`${levels[3]} O bien: ${levels[4]}`,coveredDeliveryKeys})
export function firstGradeCommunitySelections(spec:FirstGradeCommunityTask){
 const publication=/PUBLISH|DIGITAL|PRINT|DRAFT/.test(spec.kind)
 return{suggestedEvaluationTechnique:spec.activityType==='EXPOSITION'?'exposicion':spec.kind==='ENVIRONMENT_CLASSROOM'?'observacion-directa':'analisis-producciones',suggestedInstrumentType:publication?'lista-cotejo' as const:'rubrica' as const}
}
export function firstGradeCommunityCriteria(spec:FirstGradeCommunityTask):Criterion[]{
 const {kind,task,raw}=spec
 const environmentalTopic=/arboles/.test(task)?'la conservación de los árboles del patio':/agua/.test(task)?'el uso del agua en la escuela':'la situación ambiental trabajada'
 if(kind==='ENVIRONMENT_SCRIPT')return[
  row('environment-script-message','Recomendación sustentada para el guion',5,[
   `Prepara en el guion una recomendación comprensible sobre ${environmentalTopic}, apoyada en la ficha y adecuada al equipo que la recibirá.`,
   'La recomendación del guion es fiel a la ficha y comprensible; una relación entre información y acción necesita precisión.',
   'El guion presenta una recomendación pertinente, pero explica poco su respaldo en la ficha.',
   'La recomendación del guion contradice la ficha o le atribuye información que no contiene.',
   'No presenta una recomendación reconocible y sustentada en la ficha en el guion entregado.',
  ]),row('environment-script-organization','Guion preparado para compartir después',3,[
   'Organiza el guion para que el equipo destinatario pueda comprender la explicación prevista; la valoración se limita a esta preparación, sin exigir recepción ni respuesta todavía.',
   'El guion permite seguir la explicación prevista; una transición necesita precisión.',
   'El guion contiene ideas pertinentes, pero deja incompleta su relación para el destinatario.',
   'La secuencia del guion contradice la explicación prevista o presenta como observado lo que aún se prepara.',
   'No hay un guion reconocible que permita seguir la explicación preparada.',
  ]),
 ]
 if(kind==='NEWS_UNCONFIRMED')return[
  row('news-provisional-integrity','Preparación provisional de la noticia revisada',5,[
   'Provisional: conserva la noticia revisada y su procedencia, incluidos los registros y el carácter simulado del estudio; no se presupone una reescritura ni una publicación efectuada.',
   'Provisional: la preparación conserva contenido y procedencia; una identificación necesita precisión.',
   'Provisional: conserva parte de la noticia, pero omite información necesaria para reconocer su procedencia o carácter simulado.',
   'Provisional: cambia datos de la noticia revisada o presenta el estudio simulado como un hecho real.',
   'Provisional: no hay contenido disponible que permita comprobar la conservación de la noticia revisada.',
  ]),
 ]
 if(kind==='HISTORY'||kind==='HISTORY_ORAL'){
  const oral=kind==='HISTORY_ORAL',natural=/patrimonio natural|recurso natural/.test(task),temporal=/cambio|antes.*ahora/.test(task),sources=/testimonios/.test(task)?'los testimonios y documentos':'los documentos'
  return[
   row('history-sources',natural?'Información histórica y patrimonial fiel':'Cambio histórico documentado',4,[
    oral?'Compara cómo era antes y cómo es ahora la práctica tradicional dominicana, conservando la información de testimonios y documentos entregados.':temporal?'Explica qué cambió en la tradición dominicana entre antes y ahora, usando información fiel de los documentos entregados.':'Identifica el hecho histórico, la tradición dominicana y el patrimonio natural del lugar con información fiel de ambos textos.',
    'La información histórica y de la práctica corresponde a los materiales; un detalle contextual necesita precisión.',
    'Reconoce la práctica y parte de su contexto, pero deja incompleta información necesaria para situar el cambio o hecho histórico.',
    'Atribuye a la comunidad hechos o prácticas que los documentos contradicen o no contienen.',
    'No identifica información histórica y de la práctica que pueda contrastarse con los materiales.',
   ]),...(natural?[row('history-relation','Relación social y patrimonio natural',5,[
    temporal?`Explica la relación entre el cambio de la práctica tradicional y el uso de un recurso natural del lugar, sustentándola en ${sources}.`:'Explica la relación entre el hecho histórico, la tradición y el patrimonio natural de la comunidad; muestra cómo la historia ayuda a comprender esa relación actual con apoyo en ambos textos.',
    'La relación social y natural se explica con respaldo; una conexión entre el contexto histórico y la práctica necesita precisión.',
    'Describe por separado la práctica y el entorno natural, pero deja poco explicado cómo se relacionan.',
    'Afirma una relación incompatible con los documentos o atribuye automáticamente superioridad o progreso a una práctica.',
    'No presenta una relación reconocible entre la práctica social y el patrimonio natural.',
   ])]:[]),...(/disting\w*.*documentad|no puede asegurarse/.test(task)?[row('history-limits','Documentación e interpretación delimitadas',3,[
    'Distingue lo documentado de una interpretación o hipótesis plausible y delimita qué todavía no puede asegurarse; admite una lectura crítica razonada sin inventar datos ni una causa única.',
    'Se reconoce qué procede de los documentos y qué se interpreta; una expresión de certeza necesita precisión.',
    'Combina información documentada e interpretación sin delimitar suficientemente el apoyo de alguna afirmación.',
    'Presenta una hipótesis como hecho demostrado o generaliza la relación a comunidades no estudiadas.',
    'No permite distinguir la información de los documentos de las afirmaciones añadidas.',
   ])]:[]),...(oral?[row('history-oral','Explicación oral común comprensible',2,[
    'Organiza la explicación oral breve del equipo para que se siga el antes, el ahora y la relación con el recurso natural; se valora la presentación observada sin atribuir desempeños individuales no observados.',
    'La explicación oral permite seguir la comparación y su relación; una transición necesita claridad.',
    'Se comprenden datos aislados, pero su organización oral dificulta relacionar los momentos y el recurso.',
    'El orden o la expresión oral cambia el sentido de la relación histórica explicada.',
    'No hay una explicación oral común reconocible de la comparación y su relación.',
   ])]:[]),
  ]
 }
 if(['NEWS_PUBLISH','NEWS_DRAFT','STORY_DIGITAL','STORY_PRINT','CALLIGRAM_PUBLISH'].includes(kind)){
  const draft=kind==='NEWS_DRAFT',news=kind.startsWith('NEWS'),print=kind==='STORY_PRINT',calligram=kind==='CALLIGRAM_PUBLISH',indexed=/indice/.test(task)
  const simulatedResearch=news&&/(?:investigacion|estudio).*simulad|(?:investigacion|estudio).*simulacion/.test(task)
  const preserve=simulatedResearch?'Conserva en la noticia revisada qué se investigó, cómo se hicieron las observaciones, los resultados y la conclusión limitada a esos datos; mantiene la referencia a los registros y la indicación de que es una investigación simulada':news?'Conserva el texto y las referencias de la noticia revisada':calligram?'Conserva las palabras y la figura del caligrama revisado, incluida su relación al mantener o ampliar el tamaño':kind==='STORY_DIGITAL'&&/pistas.*desenlace/.test(task)?'Conserva las palabras, las pistas, el desenlace y el orden del cuento revisado':'Conserva el texto completo y su orden en la versión revisada del cuento'
  const rows=[row('publication-integrity','Versión revisada conservada',5,[
   preserve+'; los ajustes de presentación no sustituyen ni omiten contenido.',
   'Presenta una diferencia menor de transcripción que debe restituirse para conservar exactamente la versión revisada, sin alterar información central ni su orden.',
   'Conserva la mayor parte de la versión, pero omite un fragmento o componente que debía mantenerse.',
   'Sustituye o altera contenido de la versión revisada, en lugar de limitarse a su presentación.',
   'No se dispone de una versión comparable que permita comprobar la conservación del contenido.',
  ])]
  if(draft){rows.push(row('publication-preview','Plantilla y vista previa legibles',3,[
   'Coloca texto, referencias y datos de presentación previstos en la plantilla digital; comprueba una vista previa organizada y legible.',
   'La vista previa contiene los componentes previstos y permite leerlos; un detalle de organización necesita ajuste.',
   'La vista previa permite leer parte del contenido, pero un campo previsto queda incompleto o dificulta localizar información.',
   'La disposición oculta contenido necesario o introduce datos de presentación ajenos a la versión prevista.',
   'No presenta una vista previa reconocible de la noticia en la plantilla.',
  ]),row('publication-draft','Borrador guardado y recuperable',3,[
   'Deja el contenido guardado como borrador recuperable y sin publicar'+(/docente/.test(task)?', disponible para la revisión docente prevista.':'.'),
   'El borrador está guardado y se recupera sin publicación; su identificación necesita una precisión menor.',
   'Se conserva parte de la preparación, pero el borrador recuperado no contiene todos los ajustes visibles.',
   'Publica anticipadamente el contenido o guarda una versión distinta de la preparación solicitada.',
   'No queda un borrador recuperable de la preparación realizada.',
  ]));return rows}
  const printMedium=/revista/.test(task)?(/antologia/.test(task)?'una revista o antología impresa':'la revista impresa'):'la antología impresa'
  const availability=news?'Comprueba la publicación efectiva de la noticia en el espacio digital indicado y que sus destinatarios pueden abrirla y leerla':print?`Incorpora el cuento a ${printMedium} y deja un ejemplar completo y legible disponible para consulta en la biblioteca escolar`:calligram?'Comprueba la colocación efectiva del caligrama en el mural escolar, donde sus palabras y su figura resultan legibles':`Integra el cuento en la antología digital y comprueba ${indexed?'que el índice conduce al cuento correcto, completo y legible':'que sus lectores pueden acceder al cuento completo y legible'}`
  rows.push(row('publication-access','Disponibilidad efectiva para los lectores',5,[
   availability+'; una versión guardada privadamente no completa esta publicación.',
   'El producto está disponible y completo, pero presenta un obstáculo menor de acceso o una disposición que dificulta la lectura de un fragmento.',
   'El producto está incorporado al medio, pero parte del contenido o su acceso resulta difícil para los lectores.',
   'El acceso conduce a otro contenido o la presentación impide leer el producto solicitado.',
   'El producto solo permanece guardado o preparado, sin disponibilidad efectiva en el medio indicado.',
  ]))
  const credits=/creditos/.test(task),proof=news?'Identifica la publicación mediante un enlace o una constancia verificable':calligram?'Deja constancia de la colocación mediante una fotografía o la verificación docente':print?'Indica dónde pueden encontrar el ejemplar los lectores, mediante ubicación comprobable directamente o un registro verificable':'Indica una ubicación verificable del cuento dentro de la antología digital'
  if(credits||/enlace|constancia|donde|indica/.test(task))rows.push(row('publication-trace','Créditos y localización comprobables',2,[
   proof+(credits?'; mantiene los créditos previstos y acordados.':'; conserva los datos de presentación previstos.'),
   'La constancia permite localizar el producto correcto; un dato de identificación previsto necesita precisión.',
   'La identificación está incompleta y dificulta comprobar la ubicación o los créditos solicitados.',
   'La constancia corresponde a otro producto o atribuye créditos diferentes de los previstos.',
   'No hay identificación comprobable del producto y de su ubicación solicitada.',
  ]))
  return rows
 }
 if(kind==='ENVIRONMENT_CLASSROOM')return[
  row('classroom-recommendation','Recomendación ambiental sustentada',4,[
   `Explica al equipo vecino una recomendación sobre ${environmentalTopic}, sustentada en la ficha y comprensible para quienes la reciben.`,
   'La recomendación corresponde a la ficha y se entiende; una relación entre información y acción necesita precisión.',
   'La recomendación es pertinente, pero explica poco cómo se apoya en la ficha.',
   'La recomendación contradice la ficha o atribuye efectos ambientales no respaldados por ella.',
   'No comunica una recomendación reconocible y relacionada con la información de la ficha.',
  ]),row('classroom-reception','Comprensión e intervención del equipo receptor',4,[
   'El equipo receptor expresa qué entendió de la recomendación y plantea una pregunta o una propuesta relacionada, representando fielmente el mensaje recibido.',
   'Lo comprendido y la intervención corresponden a la recomendación; una relación necesita precisión.',
   'Recupera parte de la recomendación, pero su pregunta o propuesta se relaciona de forma incompleta con ella.',
   'Atribuye al otro equipo una recomendación distinta o formula una intervención ajena al mensaje recibido.',
   'Durante la oportunidad de intercambio observada, no expresa una comprensión ni una intervención reconocible sobre el mensaje.',
  ]),row('classroom-response','Respuesta sustentada y decisión sobre la recomendación',5,[
   'Responde a la intervención concreta recibida usando la ficha y aclara con razones si mantiene o ajusta la recomendación; ambas decisiones son válidas cuando tienen respaldo.',
   'La respuesta atiende la intervención y fundamenta la decisión; una conexión con la ficha necesita precisión.',
   'Responde a parte de la intervención, pero explica poco el fundamento de mantener o ajustar la recomendación.',
   'La respuesta cambia la intervención recibida, contradice la ficha o sustituye las razones por una descalificación.',
   'Ante la intervención recibida y la oportunidad observada, no ofrece una respuesta reconocible relacionada con ella.',
  ]),row('classroom-record','Registro del intercambio realizado en el aula',2,[
   'Anota fielmente la intervención recibida y su respuesta, de modo que el registro permita reconocer su relación en el intercambio efectivamente realizado dentro del aula.',
   'El registro conserva la intervención y la respuesta; un detalle de identificación necesita precisión.',
   'Registra parte del intercambio, pero omite un dato necesario para relacionar la intervención con la respuesta.',
   'El registro cambia la intervención recibida o presenta como realizada una respuesta que no ocurrió.',
   'No conserva un registro reconocible de la intervención y la respuesta efectivamente realizadas.',
  ]),
 ]
 if(kind==='ENVIRONMENT_FORUM'||kind==='ENVIRONMENT_LETTERS'){
  const letters=kind==='ENVIRONMENT_LETTERS',waiting=letters||/esperando|todavia/.test(raw),onlyInitial=!letters&&/esperando/.test(raw),responseOnly=!letters&&/^responde/.test(task),hasSources=letters||/fuentes|lecturas/.test(task)
  const rows:Criterion[]=responseOnly?[]:[row('environment-message','Comunicación ambiental sustentada para su destinatario',4,[
   letters?'Escribe una carta breve adecuada a un curso de otro centro sobre el cuidado de los árboles; formula una recomendación sustentada en el texto trabajado.':hasSources?'Comparte una explicación breve del problema ambiental con la comunidad, fiel a las lecturas y comprensible para los destinatarios del foro.':'Envía a la comunidad una explicación ambiental comprensible y fiel a la información disponible, de acuerdo con su destinatario.',
   hasSources?'La comunicación conserva la información de las fuentes y se entiende para su destinatario; una relación necesita precisión.':'La comunicación conserva la información disponible y se entiende para su destinatario; una relación necesita precisión.',
   'Comunica información ambiental pertinente, pero explica poco su respaldo o su relación con el destinatario.',
   hasSources?'La comunicación contradice las lecturas o presenta como comprobada información que estas no aportan.':'La comunicación contradice la información disponible o presenta como comprobada información ajena a ella.',
   hasSources?'No hay comunicación ambiental reconocible y relacionada con las fuentes para el destinatario previsto.':'No hay comunicación ambiental reconocible para el destinatario previsto.',
  ])]
  if(!onlyInitial){
   const response=row('environment-response','Respuesta a una intervención recibida',5,[
    letters?'Representa fielmente una idea recibida del otro centro y responde con razones apoyadas en el texto; explica si mantiene o revisa la recomendación, sin obligación de cambiarla.':responseOnly?'Responde de forma pertinente y respetuosa a la pregunta efectivamente recibida de la comunidad, relacionándola con la explicación ambiental disponible sin inventar información.':'Responde a una pregunta o propuesta efectivamente recibida de los participantes, usando las fuentes; puede aceptar, matizar o discrepar con razones y trato respetuoso.',
    'La respuesta observada atiende la idea recibida y tiene sustento; una conexión entre razones e intervención necesita precisión.',
    hasSources?'La respuesta observada retoma parte de la intervención, pero explica poco cómo las fuentes sostienen su posición.':'La respuesta observada retoma parte de la pregunta, pero explica poco su relación con la explicación ambiental disponible.',
    hasSources?'La respuesta observada atribuye al interlocutor otra idea, contradice las fuentes o sustituye razones por descalificación.':'La respuesta observada atribuye al interlocutor otra pregunta, contradice la información disponible o sustituye razones por descalificación.',
    'Ante una intervención externa recibida y una oportunidad de respuesta ya acordada y observada, no presenta una respuesta relacionada con ella.',
   ])
   if(waiting)response.observable+=' Si la respuesta externa aún no llega, esta evidencia queda pendiente; puede valorarse la primera carta sin inventar el intercambio.'
   rows.push(response)
  }
  const record=row('environment-record','Registro fiel de las fases del intercambio',2,[
   letters?'Conserva las cartas del intercambio, distinguiendo la enviada, la recibida y la respuesta propia cuando estas fases hayan ocurrido, en soporte físico o digital.':onlyInitial?'Conserva constancia de la explicación enviada a la comunidad; distingue el envío realizado del intercambio todavía pendiente.':responseOnly?'Conserva la pregunta recibida y su respuesta propia, de manera que se pueda comprobar la relación entre ambas.':'Guarda un registro del intercambio que relaciona explicación, pregunta o propuesta recibida y respuesta, para revisarlo en clase.',
   'El registro permite seguir las fases efectivamente realizadas; un detalle de identificación necesita precisión.',
   onlyInitial?'La constancia omite información necesaria para identificar la explicación enviada o su destinatario.':'El registro de las fases realizadas omite un elemento necesario para comprender la relación entre mensajes.',
   onlyInitial?'La constancia corresponde a otra explicación o presenta como realizado un envío que no ocurrió.':'El registro altera un mensaje recibido o presenta como realizado un intercambio que no ocurrió.',
   'No conserva registro de la comunicación efectivamente realizada y disponible para valorar.',
  ])
  if(waiting)record.observable+=' Las fases dependientes de una respuesta externa pendiente permanecen sin valorar hasta que se observen.'
  rows.push(record);return rows
 }
 if(kind==='INFERENCE'||kind==='SYNTHESIS'){
  const synthesis=kind==='SYNTHESIS',oral=spec.activityType==='EXPOSITION'
  return[
   row('reasoning-sources','Información de ambas fuentes',4,[
    synthesis?'Reconstruye fielmente las ideas pertinentes de ambas explicaciones e identifica una diferencia o tensión significativa entre ellas.':/horarios.*biblioteca/.test(task)?'Selecciona información pertinente y fiel de ambos textos para examinar la relación entre horarios y dificultades de acceso descritas.':'Selecciona información pertinente y fiel de ambos textos para examinar la relación propuesta entre sus ideas.',
    synthesis&&oral?'La información de ambas fuentes y la diferencia identificada son fieles; la explicación de esa diferencia necesita precisión.':'La información de ambas fuentes es fiel y pertinente; una atribución o relación contextual necesita precisión.',
    synthesis&&oral?'Presenta información pertinente, pero integra de manera incompleta la segunda fuente u omite la diferencia entre ambas, aunque sus datos sean fieles.':'Usa información pertinente de una fuente, pero integra de manera incompleta la segunda.',
    synthesis&&oral?'Cambia el sentido de una fuente, inventa una diferencia o presenta como coincidentes ideas que difieren.':'Atribuye a un texto información del otro o cambia el sentido de un dato necesario.',
    'No presenta información reconocible de ambas fuentes para sostener la explicación.',
   ]),row('reasoning-integration',synthesis?'Síntesis que integra las explicaciones':'Relación nueva e inferencia justificada',5,[
    synthesis?`${oral?'Presenta oralmente':'Redacta'} una síntesis que integra información de ambas explicaciones y permite comprender una relación adicional; explica cómo se conectan sus aportes sin reducirlos a dos resúmenes separados.`:`Formula ${oral?'oralmente ':''}una relación nueva que no aparece literalmente en los textos y explica cómo la sostiene con información de ambos; distingue la inferencia del dato literal.`,
    'La integración o relación nueva tiene respaldo en ambas fuentes; un paso del razonamiento necesita precisión.',
    'Presenta los aportes por separado o insinúa una relación, pero no explica suficientemente el vínculo entre ellos.',
    'Construye una relación incompatible con las fuentes o inventa información para unirlas.',
    'No presenta una integración o relación nueva identificable entre los aportes de las fuentes.',
   ]),...(synthesis||/no permiten asegurar|limite/.test(task)?[row('reasoning-limits','Conclusión sustentada y límites reconocidos',3,[
    synthesis?(oral?'Presenta una conclusión sustentada, integrada o provisional, que explica qué permiten comprender ambas fuentes y qué queda sin resolver; puede mantener una tensión abierta delimitada cuando el respaldo no permite resolverla.':'Cierra con una conclusión sustentada que explica qué permiten comprender ambas fuentes, o una cuestión o tensión abierta delimitada cuando el respaldo disponible no permite resolverla.'):'Explica el alcance y el límite de la relación inferida, señalando qué no permiten asegurar ambos textos; no convierte una asociación en una causa demostrada sin respaldo.',
    'La conclusión conserva los límites de la información; una expresión de certeza necesita precisión.',
    synthesis?'Presenta una conclusión con respaldo incompleto, o deja una cuestión abierta sin delimitarla suficientemente.':'Se reconoce una conclusión pertinente, pero queda poco delimitado qué todavía no puede asegurarse.',
    'Elimina discrepancias con datos inventados o afirma una conclusión más amplia que el respaldo disponible.',
    'No presenta una conclusión o delimitación reconocible del alcance de la explicación.',
   ])]:[]),...(oral?[row('reasoning-oral','Explicación oral comprensible del razonamiento',3,[
    'Comunica oralmente el recorrido desde la información de las fuentes hasta la relación construida, de forma que los oyentes puedan seguirlo; puede apoyarse en notas.'+(/parejas|equipos/.test(task)?' Se valora la explicación conjunta observada; una valoración individual requiere evidencia atribuible a cada participante.':''),
    'La explicación oral permite seguir el razonamiento; una transición entre información y conclusión necesita claridad.',
    'Expresa oralmente partes del razonamiento, pero los oyentes no pueden seguir una conexión necesaria entre ellas.',
    'La explicación oral contradice el razonamiento presentado o comunica conexiones distintas de las sustentadas en las fuentes.',
    'No ofrece una explicación oral reconocible del razonamiento; un producto únicamente escrito no sustituye esta evidencia.',
   ])]:[]),
  ]
 }
 if(kind==='SUMMARY')return[
  row('summary-main','Ideas principales fieles de ambos textos',5,[
   'Resume las ideas principales de los dos textos con fidelidad y claridad, distinguiendo sus aportes sin inventar información ni exigir una relación nueva.',
   'El resumen recoge las ideas principales de ambos textos; una relación secundaria necesita precisión.',
   'Resume las ideas de un texto, pero omite una idea principal necesaria del otro.',
   'Cambia el sentido de una idea principal o atribuye a un texto información ajena.',
   'No presenta un resumen reconocible de las ideas principales de los dos textos.',
  ]),row('summary-differences','Diferencias conservadas en el resumen',3,[
   'Conserva las diferencias relevantes entre las ideas de los textos, sin borrar sus discrepancias ni atribuirles una posición común inexistente.',
   'Las diferencias relevantes se reconocen; una atribución necesita precisión.',
   'Menciona una diferencia, pero omite otra necesaria para comprender los aportes.',
   'Presenta como coincidentes ideas que difieren o inventa una diferencia entre las fuentes.',
   'No permite reconocer las diferencias relevantes entre los textos resumidos.',
  ]),
 ]
 if(kind==='PERSPECTIVE_READING')return[
  row('perspective-read-reasons','Razones de la respuesta ajena',5,[
   'Explica las razones de una de las respuestas al conflicto ficticio, representando fielmente esa perspectiva con información del caso.',
   'La respuesta y sus razones corresponden al caso; una relación entre ellas necesita precisión.',
   'Describe la respuesta, pero explica de manera incompleta por qué se propone.',
   'Atribuye a esa respuesta razones incompatibles con el caso o la descalifica en lugar de explicarla.',
   'No presenta razones reconocibles de una respuesta al conflicto ficticio.',
  ]),row('perspective-read-support','Apoyo en la información del caso',3,[
   'Relaciona información pertinente del caso con las razones explicadas, sin inventar motivos ni exigir que se comparta la perspectiva.',
   'El apoyo corresponde al caso; una conexión con las razones necesita precisión.',
   'Menciona información del caso, pero explica poco cómo apoya las razones.',
   'Usa información inexistente o contraria al caso como fundamento de las razones.',
   'No ofrece información reconocible del caso que respalde la explicación.',
  ]),
 ]
 if(kind==='PERSPECTIVE'||kind==='PERSPECTIVE_EXCHANGE'){
  const exchange=kind==='PERSPECTIVE_EXCHANGE'
  return[
   row('perspective-own','Respuesta propia situada en el caso ficticio',4,[
    exchange?'Escribe una respuesta propia al malentendido ficticio y explica sus razones de acuerdo con la información del diálogo, sin requerir experiencias personales.':'Explica una decisión propia dentro de la situación imaginaria y sus razones, considerando las condiciones del caso.',
    'La respuesta propia corresponde al caso y tiene razones; una relación entre decisión y situación necesita precisión.',
    'La respuesta es compatible con parte del caso, pero sus razones quedan poco explicadas.',
    'La respuesta contradice condiciones centrales del caso o se justifica con hechos inventados ajenos a él.',
    'No presenta una decisión propia reconocible dentro de la situación ficticia.',
   ]),row('perspective-other','Otra mirada representada con fidelidad',4,[
    exchange?'Representa fielmente una idea del texto recibido de su compañero o compañera y explica una coincidencia o diferencia concreta con su respuesta.':`Representa fielmente la decisión del personaje y sus razones; explica una coincidencia o diferencia con la decisión propia${/consecuencias/.test(task)?', considerando posibles consecuencias':''}, sin descalificar a las personas.`,
    'La otra mirada y su relación con la propia son reconocibles; una razón o comparación necesita precisión.',
    'Describe la otra perspectiva, pero explica poco su coincidencia o diferencia con la propia.',
    'Distorsiona la perspectiva ajena para sostener la propia o sustituye la comparación por descalificaciones.',
    'No presenta una perspectiva ajena reconocible ni su relación con la propia.',
   ]),...(exchange?[row('perspective-note','Nota individual y reconsideración razonada',3,[
    'Añade una nota de autoría individual que compara ambas miradas; conserva o modifica su respuesta y explica la decisión con razones relacionadas con el caso y el texto recibido.',
    'La nota permite comprender qué conserva o modifica y por qué; una conexión con la comparación necesita precisión.',
    'La nota indica una decisión, pero explica poco cómo se relaciona con la otra mirada y el caso.',
    'La nota atribuye al compañero una postura inexistente o cambia la respuesta sin razones relacionadas con el caso.',
    'No presenta una nota individual reconocible que explique la decisión de conservar o modificar.',
   ])]:[]),
  ]
 }
 if(kind==='NEWS_RESPONSE'){
  const questions=['qué ocurrió',...(/a quienes afecta/.test(raw)?['a quiénes afecta']:[]),...(/como sucedio/.test(raw)?['cómo sucedió']:[])]
  const asks=questions.join(', '),insufficient=/informacion falta|no permite responder|insuficiente/.test(raw)
  return[
   row('reading-answers','Comprensión individual de las preguntas solicitadas',5,[
    `Explica individualmente ${asks}, de acuerdo con la noticia${insufficient?'; para cada pregunta ofrece una respuesta sustentada o identifica justificadamente información insuficiente, sin inventarla':''}.`,
    'Las respuestas solicitadas son fieles al texto y a sus límites; una relación necesita precisión.',
    'Comprende parte de lo solicitado, pero deja una respuesta poco explicada o no justifica suficientemente la información que falta.',
    'La explicación contradice la noticia o inventa información para completar una pregunta.',
    'No hay una respuesta sustentada ni un reconocimiento justificado de los límites del texto para las preguntas solicitadas.',
   ]),row('reading-two-data','Respaldo con dos datos pertinentes',3,[
    'Relaciona dos datos pertinentes de la noticia con su explicación individual; conserva su sentido y hace comprensible qué afirmación o límite apoya cada dato.',
    'Los dos datos son fieles y pertinentes; una conexión con la explicación necesita precisión.',
    'Utiliza un dato pertinente o menciona dos sin explicar suficientemente su relación con la respuesta.',
    'Cambia el sentido de los datos o los usa para sostener una afirmación incompatible con la noticia.',
    'No aporta datos reconocibles de la noticia que respalden la explicación individual.',
   ],['quantity-dato']),
  ]
 }
 return[]
}
