import {affirmativeLanguageTask} from './language-feature-criteria'
import {firstGradeCalligramCriteria} from './secondary-calligram-grade-one'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'

const criterion=(id:string,title:string,weight:number,levels:Criterion['progressionLevels']):Criterion=>({templateId:id,title,weight,observable:levels[0],progressionLevels:levels})
const replace=(rows:Criterion[],row:Criterion)=>[...rows.filter(r=>r.templateId!==row.templateId),row]
const join=(parts:string[])=>parts.length<2?parts[0]??'':parts.slice(0,-1).join(', ')+' y '+parts.at(-1)
const figures=(task:string)=>([
 [/epiteto/,'el epíteto','destacar expresivamente una cualidad del referente','la cualidad se atribuye a otro referente'],
 [/anafora/,'la anáfora','dar énfasis mediante reiteración al inicio de versos o expresiones','se confunde la reiteración inicial con una repetición sin esa función'],
 [/comparacion|simil/,'la comparación','establecer una semejanza explícita entre referentes','la semejanza contradice los referentes comparados'],
 [/personific/,'la personificación','atribuir rasgos humanos a lo no humano para construir el sentido','se toma como dato literal la atribución de rasgos humanos'],
 [/metafora/,'la metáfora','asociar referentes mediante una imagen figurada','la asociación figurada contradice el sentido del pasaje'],
] as const).filter(([pattern])=>pattern.test(task))

/** Refinements for the current release, without rewriting historical exports. */
export function refineFirstGradeCalligramRequirements(activity:string,description:string,initial:Criterion[]):Criterion[]{
 const task=affirmativeLanguageTask(description),creating=/CREATION|WRITTEN_PRODUCTION|ARTISTIC_PRODUCTION/.test(activity),analyzing=/ANALYSIS/.test(activity)||activity==='REPORT',reciting=activity==='CALLIGRAM_RECITATION',comparing=/COMPARISON/.test(activity)
 const listening=analyzing&&/escuch|grabacion/.test(task),hasVisual=/laminas?|apoyo visual|imagen entregada/.test(task),audioOnly=listening&&!hasVisual
 const planOnly=creating&&/planifi[cq]\w*|\bplan\b/.test(task)&&!/\b(?:redact\w*|escrib\w*)\b|\b(?:hagan|cre\w*|elabor\w*)\s+(?:un\s+)?caligrama/.test(task)
 const editing=creating&&/edicion final/.test(task)&&/ya revisado/.test(task),correcting=creating&&/corrij|correg/.test(task)&&/unicamente|solo|exclusivamente/.test(task)&&/caligrafia|tipografia/.test(task)
 const revising=creating&&/revis/.test(task)&&/borrador.*entregado/.test(task)
 const focusMatch=analyzing?task.match(/\b(?:analic\w*|analiz\w*|expli[cq]\w*|identifi[cq]\w*)\s+(?:\w+\s+){0,2}?(?:solo|solamente|unicamente|exclusivamente)\s+(.+)$/):null
 const focused=Boolean(focusMatch),focusTask=focusMatch?.[1].split(/\b(?:con un|con ejemplos|localicen|aporten|para|y expliquen)\b/)[0]??task
 let rows=initial
 if(correcting)return[criterion('calligram-feature-typography','Legibilidad de la escritura conservada',4,[
  `Corrige la ${/caligrafia/.test(task)?'caligrafía':'tipografía'} para hacer legibles las palabras y reconocer la figura; conserva exactamente texto, versos y disposición del caligrama entregado.`,
  'La escritura es legible y conserva texto y figura; queda una palabra que requiere precisión gráfica.',
  'Mejora parte de la escritura, pero varias palabras siguen sin poder leerse.',
  'La corrección cambia palabras, versos o disposición y altera la figura que debía conservarse.',
  'No presenta una mejora reconocible de la legibilidad de la escritura solicitada.',
 ])]
 if(editing){
  const media=['mural','libro artesanal','revista escolar'].filter(m=>task.includes(m)),destination=media.length>1?`un medio elegido entre ${media.join(', ')}`:media[0]??'el medio elegido'
  return[criterion('calligram-edition','Edición para el medio elegido',4,[
   `Prepara la edición final para ${destination} con legibilidad y presentación adecuadas; conserva exactamente palabras, versos, intención e imagen del caligrama ya revisado.`,
   'La edición conserva el contenido y se lee en el medio elegido; un detalle de presentación necesita ajuste.',
   'Presenta una edición, pero parte de las palabras no se lee o su distribución dificulta reconocer la imagen.',
   'La edición modifica palabras, versos, intención o imagen que debía conservar.',
   'No presenta una edición legible del caligrama para uno de los medios indicados.',
  ])]
 }
 if(planOnly){
 const given=/unicamente la distribucion/.test(task)&&/ya.*dados|ficha/.test(task)
 const outline=criterion('calligram-procedure-outline','Esquema de distribución de palabras y versos',4,[
  `Organiza un esquema que relaciona la distribución prevista de palabras y versos con la figura y el mensaje${given?'; conserva intención, tema e imagen dados en la ficha':', para anticipar la composición del caligrama'}.`,
  'El esquema relaciona palabras y figura; una disposición prevista necesita aclaración.',
  'Enumera palabras o versos previstos, pero no organiza su relación con la figura.',
  given?'La distribución cambia la intención, el tema o la imagen dados en la ficha.':'La distribución prevista contradice la figura o el mensaje elegido.',
  'No presenta un esquema reconocible de la distribución prevista.',
 ])
 if(given)return[outline]
 return[criterion('calligram-plan-purpose','Intención, tema e imagen previstos',4,[
  'Define en el plan intención, tema, imagen y emoción representada, que puede ser ficticia, relacionándolos con el mensaje previsto del caligrama.',
  'Los componentes previstos se relacionan; un vínculo con la intención necesita precisión.',
  'Nombra componentes, pero no establece cómo se relacionarán con el mensaje previsto.',
  'La imagen o las palabras previstas contradicen la intención y el tema del plan.',
  'No define una relación reconocible entre intención, tema e imagen en el plan.',
 ]),outline]}
 if(focused){
  const focusRules:Record<string,RegExp>={
   nouns:/sustantiv/,adjectives:/adjetiv/,description:/descripci|descriptiv/,literary:/figuras? literarias?|epiteto|anafora|comparacion|personific|metafora/,
   typography:/tipografia|caligrafia/,'free-verse':/verso libre/,'rhyme-rhythm':/\brima\b|\britmo\b/,
   intention:/intencion|sentimientos|emocion|tema|mensaje/,relation:/funcion|estructura|relacion|imagen|\bfigura\b(?! literaria)/,visual:/organizacion visual|distribucion|legibilidad/,
  }
  rows=rows.filter(r=>focusRules[r.templateId.replace('calligram-feature-','').replace('calligram-','')]?.test(focusTask))
 }
 else if(analyzing&&/parafras|propias palabras/.test(task))for(const r of firstGradeCalligramCriteria('CALLIGRAM_ANALYSIS',task)){
  if(!/-resources$|-evidence$/.test(r.templateId)&&!rows.some(x=>x.templateId===r.templateId))rows.push(r)
 }
 if(audioOnly)rows=rows.filter(r=>!['calligram-relation','calligram-visual','calligram-feature-typography'].includes(r.templateId))
 if(comparing){
  if(!/conclusion/.test(task))rows=rows.filter(r=>r.templateId!=='calligram-conclusion')
  if(/mismo caligrama/.test(task)&&/tipografia/.test(task)&&/caligrafia/.test(task))return[criterion('calligram-feature-typography','Tipografía y caligrafía de dos ediciones',4,[
   'Compara tipografía digital y caligrafía manuscrita del mismo poema: explica cómo tamaño, forma y disposición de las letras afectan legibilidad y relación entre palabras y figura, manteniendo el mensaje como referencia.',
   'Contrasta ambas ediciones y su función; un efecto sobre la lectura o la figura necesita precisión.',
   'Describe las letras de ambas ediciones, pero no contrasta su efecto sobre legibilidad y figura.',
   'Atribuye a una edición la disposición o un efecto de la otra y contradice el mensaje conservado.',
   'No presenta un contraste funcional de la tipografía y caligrafía de las dos ediciones.',
  ])]
 }
 if(revising){
  rows=rows.filter(r=>r.templateId.startsWith('calligram-feature-')||r.templateId==='calligram-process-revision')
 }
 const selected=figures(task)
 if(rows.some(r=>r.templateId==='calligram-feature-literary')&&selected.length){
  const names=join(selected.map(([,name])=>name)),functions=selected.map(([,name,purpose])=>`${name} permite ${purpose}`).join('; ')
  const oneExample=selected.length===1&&/un ejemplo/.test(task),evidence=/ejemplo de cada/.test(task)?'con un ejemplo de cada figura presente':oneExample?'con un ejemplo presente':'con los usos presentes'
  const expression=join([/pausas/.test(task)?'pausas':'',/entonacion/.test(task)?'entonación':'',/gestual/.test(task)?'lenguaje gestual':'',/enfasis/.test(task)?'énfasis':''].filter(Boolean))||'la expresión acordada'
  const available=!creating&&/present/.test(task)?selected.length===1?' que esté presente':' que estén presentes':''
  const poetry=criterion('calligram-feature-literary','Función de las figuras literarias presentes',3,[
   `${reciting?'Permite percibir':creating?'Emplea':comparing?'Contrasta':'Identifica y explica'} ${names}${available} ${reciting?(available?'en el caligrama dado':'del caligrama dado')+' mediante '+expression+' o el apoyo acordado':creating?'en el poema para construir su mensaje':evidence+' y su efecto en el mensaje'}: ${functions}.`,
   reciting?'La expresión permite percibir la función de las figuras presentes; un énfasis necesita vincularse con el sentido.':'Las figuras se relacionan con su función en el poema; un vínculo entre expresión y efecto necesita precisión.',
   reciting?'Comunica las palabras, pero la expresión no permite percibir el efecto de algunas figuras presentes.':creating?'Incluye las figuras solicitadas, pero sus usos no contribuyen al mensaje del poema.':'Identifica figuras presentes, pero no explica cómo su función contribuye al mensaje.',
   reciting?'La expresión o el apoyo confunde la relación entre las figuras presentes y el sentido de los versos.':`El sentido se altera: ${selected.map(([pattern, , ,error])=>creating&&pattern.source==='personific'?'la atribución de rasgos humanos no se relaciona con el sentido elegido':error).join('; o ')}.`,
   reciting?'No permite percibir las figuras presentes mediante los recursos o el apoyo acordados.':creating?'No incorpora usos reconocibles de las figuras solicitadas.':'No explica funciones reconocibles de las figuras presentes del poema.',
  ])
  rows=replace(rows,{...poetry,...(/ejemplo de cada/.test(task)||oneExample?{coveredDeliveryKeys:['quantity-ejemplo']}: {})})
 }
 if(rows.some(r=>r.templateId==='calligram-feature-rhyme-rhythm')){
  const target=focused?focusTask:task,rhyme=/\brima\b/.test(target),rhythm=/\britmo\b/.test(target),names=join([rhyme?'la rima':'',rhythm?'el ritmo':''].filter(Boolean))
  const functions=[rhyme?'la rima relaciona coincidencias sonoras entre versos':'',rhythm?'el ritmo organiza pausas y acentos de los versos':''].filter(Boolean).join('; ')
  rows=replace(rows,criterion('calligram-feature-rhyme-rhythm','Función '+(names.startsWith('el ')?'del '+names.slice(3):'de '+names),3,[
   `${reciting?'Permite percibir':creating?'Emplea':'Explica'} ${names}${!creating&&/present/.test(task)?rhyme&&rhythm?' que estén presentes':' que esté presente':''} en relación con el sentido del poema${reciting?' durante la recitación, mediante la expresión o el apoyo acordado':''}: ${functions}.`,
   'Los elementos sonoros se relacionan con el sentido; una relación entre sonido y verso necesita precisión.',
   creating?'Usa los elementos sonoros solicitados, pero parte de ellos dificulta relacionar los versos.':reciting?'Comunica los versos, pero la expresión no hace perceptible parte de su organización sonora.':'Reconoce elementos sonoros, pero no explica suficientemente su relación con el sentido de los versos.',
   revising&&rhyme?'La versión revisada rompe las coincidencias sonoras pedidas o las fuerza cambiando el sentido de los versos.':rhyme&&rhythm?'Atribuye coincidencias sonoras inexistentes o pausas y acentos que cambian el sentido de los versos.':rhyme?'Atribuye coincidencias sonoras inexistentes a los versos disponibles.':'Atribuye a pausas y acentos relaciones que contradicen el sentido de los versos.',
   'No aporta evidencia reconocible de la función de los elementos sonoros solicitados.',
  ]))
 }
 const typography=rows.find(r=>r.templateId==='calligram-feature-typography')
 if(typography&&creating&&/tipografia/.test(task)&&/caligrafia/.test(task)&&/digital|a mano/.test(task))rows=replace(rows,criterion(typography.templateId,'Escritura legible según el medio elegido',3,[
  'Cuida la tipografía si el caligrama es digital o la caligrafía si se realiza a mano para leer las palabras e integrarlas en la figura, según el medio elegido.',
  'La escritura del medio elegido se lee e integra en la figura; una palabra necesita precisión gráfica.',
  'La figura se reconoce, pero varias palabras del medio elegido resultan difíciles de leer.',
  'La escritura impide reconocer palabras o contradice la figura del poema.',
  'No presenta escritura legible en el medio elegido para el caligrama.',
 ]))
 rows=rows.map(r=>{
  const noNounClasses=r.templateId==='calligram-feature-nouns'&&!/clasifi|clases|propios|comunes|abstractos/.test(task)
  const each=/ejemplo de cada/.test(task)&&/calligram-feature-(?:nouns|adjectives|description)/.test(r.templateId)
  const adapt=(s:string)=>{let t=s;if(noNounClasses)t=t.replace(' o la clase de sustantivo','');if(each)t=t.replace('con ejemplos presentes','con un ejemplo de cada recurso');return t}
  return{...r,...(each?{coveredDeliveryKeys:['quantity-ejemplo']}:{}),observable:adapt(r.observable),progressionLevels:r.progressionLevels.map(adapt) as Criterion['progressionLevels']}
 })
 if(creating&&/intencion|fictici/.test(task)&&!revising)rows=replace(rows,criterion('calligram-expression','Intención y emoción representadas en el poema',3,[
  'Comunica la intención, las ideas y la emoción representada mediante palabras relacionadas con el tema y la imagen del poema; la emoción puede ser ficticia.',
  'La emoción y la intención se reconocen en las palabras; una expresión necesita relacionarse con el tema.',
  'Presenta expresiones evocadoras, pero solo parte de ellas se relaciona con intención y tema.',
  'Las expresiones contradicen la intención o la emoción que representa el poema.',
  'No comunica una intención o emoción representada reconocible en el poema.',
 ]))
 if(analyzing&&rows.some(r=>r.templateId==='calligram-intention')){
  const scope=focused?focusTask:task,wantIntention=/intencion/.test(scope),wantFeelings=/sentimientos|emocion/.test(scope)
  const target=join([wantIntention?'la intención del autor':'',wantFeelings?'los sentimientos expresados':''].filter(Boolean))||'el tema y el mensaje del poema'
  rows=replace(rows,criterion('calligram-intention',wantIntention&&wantFeelings?'Intención y sentimientos expresados':wantIntention?'Intención comunicativa':wantFeelings?'Sentimientos expresados':'Tema y mensaje del poema',3,[
   `Explica ${target} con indicios de las palabras ${listening?'del audio escuchado':'del caligrama leído'} que sostienen su interpretación.`,
   `Relaciona ${target} con indicios disponibles; una relación necesita precisión.`,
   `Nombra ${target}, pero la interpretación carece de apoyo suficiente en los indicios disponibles.`,
   'La interpretación atribuida al poema contradice sus palabras.',
   `No identifica ${target} de forma reconocible en los indicios disponibles.`,
  ]))
 }
 if(analyzing&&!focused&&/funcion/.test(task))rows=replace(rows,criterion('calligram-relation','Función y estructura del poema visual',4,[
  'Explica la función expresiva del caligrama y cómo su estructura relaciona palabras y versos con una figura alusiva al tema y al mensaje.',
  'Relaciona función, palabras y figura; un vínculo con el mensaje necesita precisión.',
  'Reconoce palabras y figura, pero no explica cómo su relación construye el mensaje.',
  'Atribuye a la figura un sentido que contradice las palabras del poema.',
  'No explica una relación reconocible entre función, palabras y figura del caligrama.',
 ]))
 if(listening&&hasVisual)rows=replace(rows,criterion('calligram-relation','Relación entre lo escuchado y la lámina',4,[
  'Relaciona las palabras escuchadas en el audio con la figura alusiva de la lámina disponible para explicar cómo contribuyen al tema y al mensaje del caligrama.',
  'Relaciona audio y lámina; un vínculo entre palabras y figura necesita precisión.',
  'Describe lo escuchado y la lámina por separado, sin explicar su relación con el mensaje.',
  'Atribuye a la lámina palabras o una figura incompatibles con el audio del poema.',
  'No relaciona lo escuchado con la figura de la lámina disponible.',
 ]))
 if(analyzing&&/implicito|no se dice literalmente/.test(task))rows=replace(rows,criterion('calligram-inference','Sentido explícito e implícito sustentado',4,[
  `Explica el sentido explícito e infiere el implícito con indicios de palabras, rima o figuras presentes ${audioOnly?'en el audio':'en el caligrama disponible'}, sin confundir una interpretación con información literal.`,
  'La inferencia se sostiene en indicios; una relación con el significado necesita precisión.',
  'Propone un significado implícito, pero no lo relaciona suficientemente con indicios del poema.',
  'La inferencia contradice los indicios o atribuye al poema información ausente.',
  'No presenta una inferencia reconocible apoyada en indicios disponibles.',
 ]))
 if(rows.some(r=>r.templateId==='calligram-procedure-paraphrase'))rows=replace(rows,criterion('calligram-procedure-paraphrase',listening?'Paráfrasis oral del sentido global':'Paráfrasis del sentido global',3,[
  `Reconstruye ${listening?'oralmente ':''}con sus propias palabras el sentido global y la emoción representada ${listening?'en el audio':'en el caligrama'}, con vocabulario apropiado y sin añadir información ajena al poema.`,
  'La paráfrasis conserva el sentido global; una expresión necesita aclaración sin cambiar su significado.',
  'Recupera palabras o ideas aisladas, pero no reconstruye su relación en el sentido global.',
  'La paráfrasis cambia el sentido o añade información ajena al poema disponible.',
  'No presenta una paráfrasis global reconocible del poema disponible.',
 ]))
 if(reciting){
  if(/seleccion/.test(task))rows=replace(rows,criterion('calligram-selection','Selección según la intención que se comunicará',3,[
   'Selecciona un caligrama de los autores entregados cuya intención y sentimientos representados corresponden al mensaje que quiere transmitir al curso; pueden ser ficticios.',
   'La selección corresponde al mensaje previsto; una relación con la intención necesita precisión.',
   'Elige un caligrama, pero solo parte de su intención se relaciona con el mensaje previsto.',
   'La intención del caligrama elegido contradice el mensaje que se propone comunicar.',
   'No presenta una selección relacionada de manera reconocible con la intención que comunicará.',
  ]))
  const vocal=/entonacion/.test(task),gestural=/gestual/.test(task)
  if(vocal||gestural)rows=replace(rows,criterion('calligram-expression',vocal&&!gestural?'Entonación y expresión':'Expresión de versos e intención',3,[
   `Usa ${join([vocal?'entonación':'',gestural?'lenguaje gestual':''].filter(Boolean))}, o el apoyo de comunicación acordado, para comunicar versos, intención y sentimientos representados en el caligrama.`,
   'Los recursos acordados transmiten el mensaje; una relación expresiva con el verso necesita precisión.',
   'Comunica versos, pero varios recursos expresivos no se relacionan con el mensaje.',
   'La expresión o el apoyo cambia las relaciones o la intención de los versos.',
   'No comunica una relación reconocible entre versos y mensaje mediante los recursos o el apoyo acordados.',
  ]))
 }
 if(creating&&/borrador/.test(task)&&/sugerencias/.test(task)){
 const sources=join([/docente/.test(task)?'de la docente':/profesora/.test(task)?'de la profesora':/profesor/.test(task)?'del profesor':'',/compan/.test(task)?'de compañeros':''].filter(Boolean))||'disponibles'
 const targets=join([/\brima\b/.test(task)?'rima':'',/vocabulario/.test(task)?'vocabulario':'',/figuras literarias/.test(task)?'figuras presentes':'',/relacion.*(?:palabras|imagen)|figura/.test(task)?'relación palabras-imagen':''].filter(Boolean))||'los aspectos señalados en las sugerencias'
 const purpose=join([/intencion/.test(task)?'la intención':'',/emocion|sentimiento/.test(task)?`la emoción representada${/fictici/.test(task)?', que puede ser ficticia':''}`:''].filter(Boolean))
 const preserve=/conserven la (?:imagen y la intencion|intencion y la imagen)/.test(task)?'; conserva la imagen y la intención dadas':''
 const revision=criterion('calligram-process-revision','Revisión de borradores con sugerencias',3,[
  `Muestra cambios del borrador a la versión revisada según las sugerencias ${sources}, ajustando ${targets}${purpose?' para comunicar '+(/emocion ficticia ya dadas/.test(task)?'la intención y la emoción ficticia ya dadas':purpose):''}${preserve}.`,
  /\brima\b/.test(task)&&preserve?'Los cambios responden a las sugerencias y conservan la imagen y la intención dadas; queda un detalle secundario por ajustar.':'Los cambios responden a las sugerencias y aclaran el mensaje; queda un detalle secundario por ajustar.',
  `Presenta cambios, pero mantiene problemas de ${targets} señalados en las sugerencias.`,
  /\brima\b/.test(task)&&preserve?'Los cambios sustituyen la imagen o la intención que debía conservar, o contradicen el mensaje que se buscaba aclarar.':'Los cambios contradicen la intención o el mensaje que se buscaba aclarar.',
  'No muestra cambios reconocibles entre borrador y versión revisada a partir de las sugerencias.',
 ])
 if(/\brima\b/.test(task)&&preserve)revision.fourLevelLowest=`${revision.progressionLevels[3]} O bien: ${revision.progressionLevels[4]}`
 rows=replace(rows,revision)}
 if(creating&&!revising&&/publi/.test(task)&&/mural/.test(task))rows=replace(rows,criterion('calligram-edition','Edición final para el mural',3,[
  'Prepara la edición final legible del caligrama revisado para publicarla en el mural, manteniendo la relación entre palabras, figura e intención.',
  'La edición del mural permite seguir el poema; un detalle de presentación necesita ajuste.',
  'La edición permite reconocer la figura, pero parte del poema no puede leerse.',
  'La edición altera palabras o figura y cambia la intención de la versión revisada.',
  'No presenta una edición legible para el mural solicitado.',
 ]))
 if(listening){
  const adapt=(s:string)=>s.replace(/texto leído/g,'audio escuchado').replace(/texto de caligrama/g,'audio del caligrama').replace(/del texto/g,'del audio').replace(/texto disponible/g,'audio disponible')
  rows=rows.map(r=>({...r,observable:adapt(r.observable),progressionLevels:r.progressionLevels.map(adapt) as Criterion['progressionLevels']}))
 }
 return rows
}
