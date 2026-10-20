import type {CommonScienceTopic} from './secondary-science-common-types'

type Facet={label:string;match:string;relation:string}
const facet=(label:string,relation:string,match?:string):Facet=>({label,relation,match:match??label.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()})
const facets:Record<string,Facet[]>={
 'food-nutrients':['carbohidratos','proteínas','lípidos','vitaminas','suplementos'].map(label=>facet(label,`la composición, propiedades y función de ${label} indicadas por el modelo alimentario proporcionado, sin convertirlas en recomendaciones nutricionales o terapéuticas personales`)),
 'food-chain':['transporte de alimentos','recepción de alimentos','almacenamiento de alimentos'].map(label=>facet(label,`las condiciones y controles de ${label} descritos en el caso y su relación con la conservación, sin inventar temperaturas o plazos`)),
 'food-drying':[
  facet('liofilización','la retirada de agua por sublimación bajo las condiciones del modelo proporcionado, distinguiendo su representación de un proceso realmente ejecutado'),
  facet('desecación','la reducción del contenido de agua y las condiciones de secado del modelo alimentario dado, sin exigir preparar ni consumir productos'),
  facet('concentración de alimentos','la proporción entre componentes y agua del modelo alimentario y las condiciones de comparación proporcionadas'),
 ],
 'food-preservatives':['salmuera','vinagre','alcohol','azúcar','sal'].map(label=>facet(label,`la función de ${label} en el método de conservación y las restricciones indicadas por la ficha alimentaria proporcionada, sin formular parámetros seguros ausentes`)),
 'food-temperature':[
  facet('congelación','los cambios de temperatura y sus efectos en el modelo alimentario proporcionado, sin atribuir eliminación universal de microorganismos ni seguridad de consumo'),
  facet('pasteurización','las condiciones térmicas y los resultados del modelo proporcionado, sin equiparar el proceso a eliminación de todo microorganismo'),
  facet('esterilización de alimentos','las condiciones y el resultado previsto del modelo térmico dado, sin atribuir validación de un producto real'),
 ],
 'food-ph':[
  facet('conservación por pH','la acidez y su relación con las condiciones de conservación expresamente dadas, sin inventar un umbral universal de inocuidad','conservacion por ph|ph'),
  facet('ahumado','las transformaciones y restricciones del modelo de conservación proporcionado, sin preparar ni consumir productos'),
  facet('curado de alimentos','las condiciones químicas y resultados del modelo alimentario proporcionado, sin exigir ejecutar el procedimiento'),
 ],
 'food-infections':['salmonella','listeria','Escherichia coli','ameba','shigella','hepatitis A','norovirus'].map(label=>facet(label,`las evidencias y vías de contaminación atribuidas a ${label} en el expediente alimentario ficticio proporcionado, con las medidas preventivas documentadas y sin diagnóstico ni cultivo real`)),
 'food-pesticides':['herbicidas','insecticidas','fungicidas'].map(label=>facet(label,`la función, exposición y riesgos de ${label} descritos en las fichas y resultados dados, sin aplicar sustancias ni inferir residuos no medidos`)),
 'pharmacokinetics':[
  facet('farmacocinética','las relaciones de absorción, distribución, metabolismo y excreción del compuesto ficticio en el modelo y sus parámetros, sin calcular dosis para personas'),
  facet('farmacodinámica','la relación entre el compuesto y la respuesta del modelo proporcionado, con sus supuestos y límites y sin recomendar tratamientos'),
 ],
 'pharmaceutical-synthesis':[
  facet('grupos funcionales','la identificación y relación de los grupos funcionales expresamente solicitados con la estructura del modelo molecular dado, sin exigir síntesis real'),
 ],
 'drug-alternatives':['homeopatía','fitoterapia','naturopatía'].map(label=>facet(label,`las afirmaciones y la calidad de evidencia sobre ${label} en las fuentes profesionales proporcionadas, sin atribuir eficacia o equivalencia clínica por tradición u origen`)),
 'molecular-mechanics':[
  facet('mecánica molecular','las fuerzas, interacciones y energía del modelo molecular dado y los supuestos usados para representar su estructura'),
  facet('dinámica molecular','la evolución temporal de posiciones e interacciones bajo los parámetros del modelo molecular dado y sus límites'),
 ],
 'electronic-structure':[
  facet('densidad electrónica','la distribución espacial de electrones representada en el modelo molecular y su relación con la estructura según las referencias dadas'),
  facet('energía de enlace','la energía asociada al enlace solicitado bajo las condiciones y unidades proporcionadas, distinguiéndola de una energía total no dada'),
  facet('energía de disociación','la energía del proceso de separación especificado en el modelo molecular y las condiciones y unidades proporcionadas'),
 ],
 'textile-colorants':[
  facet('colorantes textiles','la solubilidad y afinidad del colorante con la fibra del modelo proporcionado y su relación con el resultado solicitado'),
  facet('pigmentos textiles','la dispersión y fijación del pigmento en el sistema textil descrito por las fichas dadas, sin equipararlo a una sustancia soluble'),
 ],
 'textile-fibers':[
  facet('fibras textiles','la estructura y propiedades de la fibra solicitada según las muestras ilustradas y datos dados, sin exigir procesos de hilado o fabricación'),
  facet('hilado','la relación entre fibra, formación del hilo y propiedades descritas en el modelo textil proporcionado'),
  facet('tejido','la organización de los hilos y su relación con la estructura del material textil del modelo proporcionado'),
 ],
 'textile-agents':[
  facet('suavizantes','la función del agente en las propiedades superficiales de la fibra y su compatibilidad según las fichas dadas'),
  facet('repelentes al agua','la relación entre tratamiento y humectación de la superficie textil del modelo dado, sin atribuir impermeabilidad no comprobada'),
  facet('retardantes de llama','la función y las limitaciones del tratamiento frente a la combustión descritas en las fichas profesionales dadas, sin ensayos con fuego'),
 ],
 'textile-cleaning':[
  facet('blanqueo','la transformación de las sustancias coloreadas y las restricciones del método textil según el modelo dado, sin manipulación real'),
  facet('desengrasado','la eliminación de sustancias grasas y la compatibilidad del método con la fibra según las fichas proporcionadas'),
 ],
 'textile-innovation':[
  facet('impresión digital','la correspondencia entre soporte, aplicación del diseño y resultado de la tecnología descrita en la fuente textil dada'),
  facet('ropa inteligente','la relación entre componentes, función y limitaciones de la prenda descrita por las fuentes proporcionadas, sin exigir fabricación ni compra'),
 ],
 'textile-tools':[
  facet('máquina de teñido','la función del equipo en la aplicación y control del proceso de coloración descrito en la ficha textil, sin exigir operarlo físicamente'),
  facet('espectrofotómetro','la relación entre la señal óptica y la propiedad textil indicada por la ficha y las referencias dadas, sin exigir mediciones o equipos reales'),
 ],
}
const normalized=(value:string)=>value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const boundary='\\b'
function focused(text:string,topic:CommonScienceTopic,contextText:string):CommonScienceTopic{
 if(text.includes(normalized(topic.label)))return topic
 if(topic.id==='drug-labels'&&/\bprospecto\w*\b/.test(contextText)){
  const sections=[['presentacion','presentación'],['contraindicaciones','contraindicaciones'],['indicaciones','indicaciones'],['reacciones adversas','reacciones adversas'],['caducidad','caducidad']].filter(([pattern])=>new RegExp(boundary+pattern+boundary).test(text)).map(([,label])=>label)
  if(sections.length)return{...topic,label:sections.join(', ')+' del prospecto',relation:'la localización y lectura de las secciones expresamente solicitadas según el prospecto ficticio proporcionado, sin recomendar dosis ni tratamiento'}
 }
 const fiberObject=/\bfibras?\b/.test(text)||/\bmuestras textiles\b/.test(text)&&/\bfibras?\b/.test(contextText)
 const selected=topic.id==='textile-fibers'&&fiberObject&&/\btextil\w*\b/.test(contextText)?[facets['textile-fibers'][0]]:facets[topic.id]?.filter(f=>new RegExp(boundary+'(?:'+f.match+')'+boundary).test(text))
 if(!selected?.length)return topic
 return{...topic,label:selected.map(f=>f.label).join(' y '),relation:selected.map(f=>f.relation).join('; ')}
}

/** CT5 objects only; historical CT4 and common sciences keep their selectors. */
export function selectCtFiveTopics(text:string,topics:CommonScienceTopic[],contextText=text):CommonScienceTopic[]{
 text=text.replace(/\b(?:sin|no se (?:pide|requiere|incluye))\s+[^.;]*/g,'')
 const exact=topics.filter(t=>text.includes(normalized(t.label)))
 let found=exact.length?exact.filter(t=>!exact.some(other=>other!==t&&normalized(other.label).includes(normalized(t.label)))):topics.filter(t=>new RegExp(boundary+'(?:'+t.match+')'+boundary).test(text)||facets[t.id]?.some(f=>new RegExp(boundary+'(?:'+f.match+')'+boundary).test(text)))
 const add=(id:string)=>{const topic=topics.find(t=>t.id===id);if(topic&&!found.some(t=>t.id===id))found.push(topic)}
 if(/\betiquetado de alimentos\b/.test(text))add('food-ethics')
 if(/\balimentos?\b/.test(contextText)&&/\bbiotecnologic\w*\b/.test(text))add('food-biotechnology')
 if(/\bquimica computacional\b/.test(text)&&!found.length)add('computational-foundations')
 if(/\btextil\w*\b/.test(contextText)){
  if(/\bfibras?\b/.test(text)||/\bmuestras textiles\b/.test(text)&&/\bfibras?\b/.test(contextText))add('textile-fibers')
  if(/\b(?:riesgo\w*|seguridad)\b/.test(text))add('textile-safety')
  if(/\b(?:ambiental|residuos?)\b/.test(text))add('textile-environment')
  if(!found.length&&/\btextil\w*\b/.test(text))add('textile-foundations')
 }
 const has=(id:string)=>found.some(t=>t.id===id)
 if(found.some(t=>/^drug-|^pharmacokinetics$|^pharmaceutical-synthesis$/.test(t.id))&&!text.includes('quimica farmaceutica y salud'))found=found.filter(t=>t.id!=='pharmaceutical-chemistry')
 if(/farmaceutic|medicamento|prospecto/.test(contextText)&&!/\balimentos?\b/.test(contextText))found=found.filter(t=>!t.id.startsWith('food-'))
 if(/\bsintesis\b/.test(contextText)&&/farmaceutic|compuesto/.test(contextText)&&/sintesis|modelo molecular/.test(text)){add('pharmaceutical-synthesis');found=found.filter(t=>t.id!=='computational-foundations')}
 if(/\bprospecto\w*\b/.test(contextText)&&/^\s*identific\w*\b/.test(text)&&/presentacion|indicacion|contraindicacion|caducidad/.test(text)){found=[];add('drug-labels')}
 if(has('drug-software'))found=found.filter(t=>t.id!=='molecule-design'&&t.id!=='computational-foundations')
 if(has('computational-ethics'))found=found.filter(t=>t.id!=='computational-project')
 if(has('food-quality-tests'))found=found.filter(t=>t.id!=='food-quality')
 if(has('textile-report'))found=found.filter(t=>t.id!=='textile-finishing')
 if(has('textile-tools'))found=found.filter(t=>t.id!=='textile-finishing')
 if(found.some(t=>t.id.startsWith('textile-')&&t.id!=='textile-foundations'))found=found.filter(t=>t.id!=='textile-foundations')
 return found.map(t=>focused(text,t,contextText))
}

/** Normalize given objects without changing the user's saved description. */
export function ctFiveRequirement(value:string):string{
 return value.replace(/\ban[aá]lisis\s+y\s+presentaci[oó]n\b/gi,'análisis y comunicación documentada').replace(/\bcaracterizaci[oó]n\b/gi,'perfil molecular documentado').replace(/\b(diseña|diseñar|diseñan|diseñe|diseñen)\s+un\s+experimento\s+simulado/gi,'$1 un plan de experimento simulado')
}
