import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',load=name=>JSON.parse(readFileSync(root+name,'utf8'))
const inventory=load('inventario.json'),scope=inventory.scopes.find(s=>s.id==='7e7fbeb7-c16c-526c-9b7f-ff20ef44d44f')
assert.equal(scope.grade,1);assert.equal(scope.character,'COMMON');assert.equal(scope.exit,null)
const linked=new Map()
for(const block of ['gramatica','lexico','estrategias','generos']){
 const doc=load(`ingles-1-${block}-cotejo.json`)
 const visit=value=>{
  if(!value||typeof value!=='object')return
  if(value.source){for(const source of Array.isArray(value.source)?value.source:[value.source])if(source?.id)linked.set(source.id,{provider:value.treatment==='SUPPORT_CONDITION_NOT_SCORED'?'No aplica':`secondary-english-grade-one-${{gramatica:'grammar',lexico:'lexicon',estrategias:'strategies',generos:'genres'}[block]}.ts`,evidence:value.reason??value.name??value.term??value.id??value.status??'Modalidad documentada',verification:`ingles-1-${block}.md`,status:value.treatment==='SUPPORT_CONDITION_NOT_SCORED'||value.status?.startsWith('NOT_')?'EXCLUDED_PEDAGOGICAL_CONDITION':'CONNECTED_CONDITIONAL'})}
  Object.values(value).forEach(v=>Array.isArray(v)?v.forEach(visit):visit(v))
 };visit(doc)
}
const functions=['personal','preferences','instructions/directions','routine','description','description/comparison','weather','opinion','experience','invitation']
const themes=['personal','invitation','routine','comparison','instructions','preferences','instructions','context-positive-care','clarification','description','weather','directions','experience']
const attitudes=[
 ['EXCLUDED_PEDAGOGICAL_CONDITION','Motivación interna; no se infiere ni puntúa una disposición personal.','No aplica'],
 ['CONNECTED_CONDITIONAL','Comunicar acciones para cuidar el ambiente; no calificar el estilo de vida real.','environment'],
 ['CONNECTED_CONDITIONAL','Comunicar acciones de cuidado de salud solicitadas; no exigir hábitos personales.','health'],
 ['CONNECTED_CONDITIONAL','Compatibilidad del mensaje con normas de seguridad proporcionadas.','safety'],
 ['CONNECTED_CONDITIONAL','Pedir permiso y comunicar las condiciones de uso explícitamente acordadas.','property'],
 ['CONNECTED_CONDITIONAL','Expresar la intención sin descalificar y con cortesía pertinente; invitaciones reutilizan su propia evidencia.','courtesy'],
 ['EXCLUDED_BELIEF_WITH_OBSERVABLE_ALTERNATIVE','No puntuar creencias ni posesiones; describir personas sin atribuir limitaciones materiales cuando se pide.','equity'],
 ['CONNECTED_CONDITIONAL','Descripción o intercambio sin estereotipos relativos a las diferencias expresamente indicadas.','equity'],
 ['CONNECTED_CONDITIONAL','Comunicar capacidades sin atribuirlas al género.','equity'],
 ['CONNECTED_CONDITIONAL','Comunicar capacidades sin atribuir limitaciones por discapacidad; se conserva la cita original y se usa lenguaje respetuoso.','equity'],
 ['CONDITION_WITH_COMMUNICATIVE_ALTERNATIVE','No puntuar puntualidad general; comunicar horarios o turnos si la consigna lo exige.','routine/turns'],
 ['CONNECTED_CONDITIONAL','Planificación observable de un mensaje solicitado, sin calificar un rasgo organizativo personal.','planning'],
 ['EXCLUDED_GENERAL_CONDUCT','No incorporar automáticamente cumplimiento de deberes, entrega o compromiso a una calificación lingüística.','No aplica'],
 ['EXCLUDED_BELIEF_WITH_OBSERVABLE_ALTERNATIVE','No puntuar valoración interna del trabajo; describir ocupaciones y opiniones cuando se piden.','occupations/opinion'],
 ['CONNECTED_CONDITIONAL','Ofrecer ayuda concreta relacionada con una dificultad ficticia, sin medir empatía interna.','solidarity'],
 ['CONNECTED_CONDITIONAL','Describir rasgos sin estereotipos y comparar información cultural explícita, sin puntuar identidad.','equity/cultural-comparison'],
 ['CONNECTED_CONDITIONAL','Comparar las costumbres indicadas apoyándose en información, sin juzgar adhesión a una cultura.','cultural-comparison'],
]
const indicators=[
 ['Comprensión oral/escrita de información personal, rutina y preferencias','personal/routine/preferences'],
 ['Frases breves enlazadas y mensaje comprensible, con pausas/apoyos o errores básicos compatibles','written/intelligibility'],
 ['Respuesta pertinente e inteligible al interlocutor','interaction/intelligibility'],
 ['Respuestas sustentadas e inferencias a partir de datos del mensaje','source/inference'],
 ['Organización básica y mensaje comprensible; creatividad no se puntúa como personalidad','written/intelligibility/planning'],
 ['Relación de intervenciones con contexto e intención','interaction/situation'],
 ['Comprensión de datos de situaciones cotidianas','source/description'],
 ['Descripción de elementos, personas y acciones del problema solicitado','description'],
 ['Opciones que responden al problema y consideran a las personas implicadas','fair'],
 ['Escucha/participación observable y comparación cultural explícita; no medir aceptación interna','listening/cultural-comparison/courtesy'],
 ['Preferencias/opiniones comunicadas respetuosamente','preferences/opinion/courtesy'],
 ['Interacción y comparación de diferencias sin estereotipos','interaction/equity/cultural-comparison'],
 ['Comprensión de mensajes cotidianos científicos/tecnológicos, sin convertirla en dominio científico avanzado','source/science'],
 ['Identificar/describir anatomía, tecnología o naturaleza pedidas mediante vocabulario básico','description/body/technology'],
 ['Intercambio de información, ideas y opiniones del entorno tecnológico','interaction/opinion/technology'],
 ['Reconocer información de cuidado del ambiente/salud; no calificar hábitos reales','source/health/environment'],
 ['Acciones comunicadas compatibles con el cuidado solicitado','health/environment'],
 ['Preferencias comunicadas y pertinencia de acciones de cuidado cuando se solicitan','preferences/health/environment'],
 ['Descripción sin descalificaciones de rasgos y preferencias','description/courtesy/equity'],
 ['Información personal/preferencias expresadas respetuosamente; humildad interna no se puntúa','personal/preferences/courtesy'],
 ['Intercambio respetuoso de información, opiniones e instrucciones','interaction/opinion/instructions/courtesy'],
]
const records=[]
for(const [type,elements] of Object.entries(scope.elements))for(const [index,source] of elements.entries()){
 let mapping=linked.get(source.id)
 if(type==='CONCEPT'&&index>=1&&index<=13)mapping={status:'CONTEXT_THEME_NOT_STANDALONE_CRITERION',evidence:'El tema contextualiza la acción; no impone todas las estructuras ni actitudes.',provider:'secondary-english-grade-one.ts',contract:themes[index-1],verification:'ingles-1-funciones.md'}
 if(type==='PROCEDURE'&&index>=1&&index<=10)mapping={status:'CONNECTED_CONDITIONAL',evidence:`Función ${functions[index-1]} en la modalidad pedida.`,provider:'secondary-english-grade-one.ts',contract:functions[index-1],verification:'ingles-1-funciones.md'}
 if(type==='ATTITUDE_VALUE'){const [status,evidence,contract]=attitudes[index];mapping={status,evidence,contract,provider:contract==='No aplica'?'No aplica':'secondary-english-grade-one-context.ts / estrategias y léxico existentes',verification:'englishContext.spec.ts y contratos de función/estrategia/léxico; ingles-1-final-servicio.json para contextos nuevos'}}
 if(type==='ACHIEVEMENT_INDICATOR'){const [evidence,contract]=indicators[index];mapping={status:'CONNECTED_CONDITIONAL_INDICATOR',evidence,contract,provider:'secondary-english-grade-one.ts y proveedores grammar/lexicon/strategies/genres/context',verification:'Suites English1 y evidencia HTTP/UI por bloque; controles de ausencia y alcance'}}
 if(type==='SPECIFIC_COMPETENCY'||type==='FUNDAMENTAL_COMPETENCY')mapping={status:'GOVERNING_COMPETENCY_NOT_A_GENERIC_ROW',evidence:'Orientación del grado: se concreta mediante sus indicadores y requisitos de la consigna, sin sumar una fila genérica de competencia.',provider:'Funciones/modalidades y21 indicadores cotejados',verification:'Correspondencia visual PDF134 y139; contratos definidos de Inglés1'}
 if(!mapping&&!source.text.startsWith('•'))mapping={status:'SOURCE_HEADING_NOT_ASSESSABLE',evidence:'Encabezado o agrupación, no evidencia de desempeño independiente.',provider:'No aplica',verification:`Cotejo visual PDF${source.pdfPage}`}
 assert(mapping,`Registro sin decisión: ${source.id}`)
 records.push({type,source,...mapping})
}
assert.equal(records.length,201);assert.equal(new Set(records.map(r=>r.source.id)).size,201)
assert.equal(records.filter(r=>r.type==='ATTITUDE_VALUE').length,17);assert.equal(records.filter(r=>r.type==='ACHIEVEMENT_INDICATOR').length,21)
assert.equal(records.find(r=>r.source.id==='f7aeafe6-d2f1-5421-a301-7d191ba68d6d').status,'EXCLUDED_PEDAGOGICAL_CONDITION')
writeFileSync(root+'ingles-1-cotejo-integral.json',JSON.stringify({sourceSha256:inventory.source.sha256,scopeId:scope.id,visualReview:{pdfPages:[134,135,136,137,138,139],printedPages:[133,134,135,136,137,138],confirmedCommonFirstGrade:true},records,limits:'Criterios evaluativos propios basados en el currículo; no rúbricas literales del MINERD. Conexión condicional a consignas y familias ensayadas, sin prometer interpretar cualquier redacción.'},null,2)+'\n')
console.log(JSON.stringify({records:201,attitudes:17,indicators:21,unmapped:0}))
