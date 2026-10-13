import {readFileSync,writeFileSync} from 'node:fs'
const data=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/inventario.json','utf8'))
const connected=topic=>/^(?:PARTIAL|IMPLEMENTED)/.test(topic.implementation)
let output='# Cobertura real por asignatura y grado · corte .19\n\n'
output+='Cada celda indica **temas con proveedor conectado / candidatos inventariados**. Un proveedor parcial no equivale a completar el tema, el ámbito ni la asignatura. Fuente, servicio, interfaz y pendientes se detallan por tema en `matriz.csv` y `revision.json`.\n\n'
output+='| Asignatura común | 1.º | 2.º | 3.º | 4.º | 5.º | 6.º |\n|---|---|---|---|---|---|---|\n'
for(const subject of new Set(data.scopes.filter(s=>s.character==='COMMON').map(s=>s.subject))) {
  output+=`| ${subject} | `+[1,2,3,4,5,6].map(grade=>{
    const scope=data.scopes.find(s=>s.character==='COMMON'&&s.subject===subject&&s.grade===grade)
    return `${scope.topics.filter(connected).length}/${scope.topics.length}`
  }).join(' | ')+' |\n'
}
output+='\n## Optativas reales\n\nSolo ámbitos de 4.º–6.º correspondientes a la salida indicada. Inventario y extracción disponibles; sin proveedores específicos verificados ni contextos de navegador sembrados.\n\n| Grado | Salida | Asignatura | Conectados / candidatos |\n|---|---|---|---|\n'
for(const scope of data.scopes.filter(s=>s.character!=='COMMON')) output+=`| ${scope.grade}.º | ${scope.exit} | ${scope.subject} | ${scope.topics.filter(connected).length}/${scope.topics.length} |\n`
output+='\n## Límites de la lectura\n\n'
output+='Cero candidatos no implica ausencia de contenido: algunos ámbitos requieren revisar sus límites conceptuales y conservan todos los elementos extraídos. No hay asignaturas completas. Lengua 2.º conserva seis proveedores conectados; su verificación HTTP aislada no equivale a login ni interfaz normal. La conexión se contabiliza, pero la reauditoría queda pendiente. La consigna de trigonometría de 6.º utiliza un proveedor de control que retoma contenido oficial de 5.º; no se contabiliza como tema oficial de 6.º.\n\n'
output+='Los cuatro instrumentos de matrices y las correcciones de composición/filas se documentan en `composicion-y-filas.md`; las reauditorías de noticia, guía, informe, afiche, cuento y caligrama mantienen pendientes explícitos. El total inventariado es 72 ámbitos por grado, 17 por ciclo y 385 candidatos a tema.\n'
output+='\nLengua 5.º incorpora una adaptación evaluativa parcial de la consigna de análisis de fragmento de novela policíaca. Cuenta como conexión parcial, no como validación del módulo oficial La novela: límites y asociación de procedimientos siguen pendientes. El encargo actual corrige el contrato tema/acción/producto y no continúa la ampliación curricular completa.\n'
writeFileSync('docs/curriculum/cobertura-secundaria/cobertura-por-asignatura-grado.md',output)
console.log('Resumen regenerado desde el inventario: nueve asignaturas comunes y 18 ámbitos optativos; sin declarar cobertura completa.')
