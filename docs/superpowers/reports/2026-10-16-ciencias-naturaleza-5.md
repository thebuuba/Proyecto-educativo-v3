# Ciencias de la Naturaleza común: 5.º de secundaria

Estado final: **patrones definidos verificados**, incluidos los cuatro formatos con la cuenta personal de Development. Química es el componente común de quinto; no se incluyen optativas ni otra asignatura. Los apartados cronológicos inferiores conservan las incidencias y comprobaciones intermedias; el cierre siguiente establece los pendientes vigentes.

## Cierre personal y comprobaciones finales

Se generaron, editaron, guardaron una sola vez y reabrieron estos cuatro casos desde Cursos → Química, usando el runtime conjunto final de catálogo 92:

| Formato | Actividad | Puntos | Comprobación de reapertura |
| --- | --- | ---: | --- |
| Rúbrica | Entalpía (`10e0a84e-ae09-4ac1-8fa9-9bd4ce1a551a`) | 20 | Editor: 37 campos idénticos |
| Cotejo | Grupos funcionales (`95757211-9e68-41e2-a03c-76a806acf14f`) | 17,35 | Pestaña Instrumento: cinco valores del editor y definición completa idénticos a DB |
| Escala | ADN y ARN (`96389f7a-45c3-4527-b5c4-5581937a3b75`) | 20 | Pestaña Instrumento: seis valores y 27 claves persistidas exactos |
| Ponderada | Entalpía (`91c007d1-f326-4e1f-9805-f1f6b40ee590`) | 17,35 | Diez valores y 35 claves; pesos 41/19/40, puntos 7,11/3,30/6,94 |

La pestaña Instrumento presenta actualmente la configuración como claves y valores: no se confunde esa reapertura con una tabla editable. La tabla completa sí se inspeccionó y editó antes de guardar; la rúbrica se reabrió además en el editor habitual. DB confirmó identidad de instrumento/snapshot, fuente de quinto, scope correcto y catálogo 92 para los cuatro casos. Los snapshots HTTP anteriores de catálogo 91 se conservan.

Puntuación inicialmente vacía en cada creación, controles visibles y preparación sin anuncios. La pregunta/hipótesis con práctica de entalpía recomendó indagación; cambiar manualmente a Estudio de caso preservó todos los campos de cada instrumento. Completar el descriptor vacío de rúbrica conservó los otros 36 valores; en cotejo, ampliar la consigna y elegir Conservar instrumento actual preservó la edición manual, y Agregar criterio incorporó solo la comparación solicitada sin duplicar la identificación. Al cambiar modalidad después de editar se exigió revisar la preparación; se regeneró y restauró la edición comprobando igualdad antes de guardar.

Comprobaciones conjuntas sobre el código final de sexto, que incluye quinto: backend **45.248/108 archivos**, frontend **45.637/131**, backend/frontend builds y **pnpm cloudflare:build** con salida 0. Cloudflare terminó naturalmente en 86.042 ms; los intentos anteriores interrumpidos no se reclasifican. HTTP/DB de quinto: cuatro guardados/reaperturas y cambio exclusivo de estrategia exacto; recheck catálogo 91 con cinco controles científicos y regresiones FRA/ING/MAT/Ciencias1–4 aprobados. Evidencia separada en [verificación](2026-10-16-ciencias-naturaleza-5-verificacion.json).

Historia tras los cuatro casos personales: los 18 releases/73 snapshots iniciales y los 23/102 del inicio de quinto conservan sus huellas. Hay 7 releases/44 snapshots nuevos respecto al inicio del encargo; incluyen otros grados y QA, no solo quinto. No se reescribió el histórico.

No queda bloqueo de acceso ni de build en este bloque. Persisten limitaciones observadas de latencia, timeout de la lista global de Actividades y DNS intermitente; los recorridos satisfactorios desde el curso no prueban que esas incidencias hayan desaparecido. Las comprobaciones acreditan las consignas definidas y los ejemplos revisados, no toda redacción posible.

## Fuente, alcance y antecedentes de implementación

MINERD 2023, PDF 316–318 / impresas 315–317: tres páginas inspeccionadas visualmente, 138 registros literales. La [matriz](../../curriculum/cobertura-secundaria/ciencias-naturaleza-matriz.json) separa conceptos/procedimientos, indicadores y adaptaciones. Trece encabezados o menús P1–P6 no se convierten en tareas adicionales. El texto oficial conserva «sp1» y la mención de alcanos junto a SN1/SN2; la adaptación usa sp y exige sustratos/grupos salientes compatibles, sin atribuir esos errores al desempeño del estudiante.

51 grupos conectados: modelos atómicos, energía, números cuánticos, Pauli/Hund y configuración; posición, tendencias, familias, conductividad y bloques periódicos; Lewis/octeto, resonancia, enlaces y fuerzas intermoleculares; termoquímica, entalpía, Gibbs/entropía y gases; tipos de reacción, estequiometría/balanceo, conservación de masa, limitante, equilibrio, cinética, activación y catálisis; hibridación, enlaces del carbono, propiedades orgánicas, grupos funcionales y mecanismos; lípidos, carbohidratos, proteínas, ADN/ARN, enzimas/inhibidores y rutas; geoquímica, datación, GEI, contaminación, hidrocarburos, origen de elementos, química nuclear, astroquímica e investigación escolar.

102 consignas definidas y [408 instrumentos completos de ejemplo](../../curriculum/cobertura-secundaria/ciencias-naturaleza-5-instrumentos.json), con [revisión científica](../../curriculum/cobertura-secundaria/ciencias-naturaleza-5-revision.json). La lectura secuencial encontró y corrigió filas redundantes (bloques/subniveles, puente de hidrógeno/elemento) y exigencias no pedidas (resonancia frente a sustitución, otras hibridaciones o mecanismos). Se evalúan coeficientes sin modificar fórmulas al balancear; una negación de balanceo no añade esa tarea. Predicción, caracterización y construcción se distinguen de interpretar modelos o explicar experimentos. Se conservan título neutral, elecciones manuales, puntaje pendiente y cuatro formatos con transformaciones reales. Son adaptaciones de AulaBase, no rúbricas oficiales MINERD.

Fuente Development `MINERD_SECUNDARIA_2023_NAT_COMUN_G5_V1`, versión `b5398277-4f03-589a-9fb7-20e9740d2c72`, scope `2b46e86d-75bd-58ce-b3ad-ce009c8bb90c`: CREATED→UNCHANGED, 138 registros. Catálogo `evaluation-2026.91`: CREATED→UNCHANGED, preservando 23 releases / 102 snapshots previos. Catálogo 90 congelado antes del cambio. Sin migraciones de esquema ni modificación de producción.

Comprobaciones actuales:

- Backend completo: 44.217 pruebas / 107 archivos y build, aprobados; 831 contratos específicos de quinto.
- Frontend completo: 44.626 pruebas / 131 archivos y build, aprobados. Después se añadió el caso de respuesta obsoleta modelos atómicos→enzimas: 19 pruebas afectadas aprobadas y frontend build repetido con salida 0. No se presenta ese nuevo caso como incluido en el conteo anterior de la suite completa.
- Paridad/scoring común: la suite completa incluye los casos de los cuatro formatos y 20/17,35, puntuación pendiente, edición manual, añadir/completar, agotamiento y límite de veinte. Se revisaron completos los cuatro formatos de cálculo estequiométrico y balanceo.
- Cloudflare generó assets y el dry-run, pero volvió a permanecer activo tras anunciar su salida; se interrumpió únicamente el árbol verificado (79.599 ms). No aprobado. No se modificó Wrangler ni se desplegó.
- HTTP/DB y runtime final: pendientes de completar y registrar; no inferir aprobación por instalación o contratos.
- Navegador personal: pendiente de acceso. La sesión terminó en login tras fallo de carga de perfil durante cuarto; no se cambian credenciales ni se envían correos durante la ausencia. [Guion concreto para reanudar](2026-10-16-ciencias-naturaleza-5-prueba-manual.md).

Pendiente: comprobar el servidor realmente servido, HTTP/DB autenticado con cuatro formatos y pesos 41/19/40, regresiones/rendimiento e historia, y recorrido visual personal cuando el acceso esté disponible. No declarar cierre de quinto únicamente por inventario o pruebas aprobadas.

## Corrección detectada durante HTTP/DB

Rúbrica y cotejo ya completaron guardado, reapertura y cambio exclusivo de estrategia con definición exacta. La escala falló dos veces con HTTP 500 al releer la actividad y sus relaciones al final de la transacción: Prisma informó que la transacción había expirado. Las consultas de solo lectura confirmaron rúbrica/cotejo intactos y ausencia de la escala reservada; se reutiliza su identificador, sin duplicar creaciones.

`savePreparedActivity` ahora construye la respuesta con la actividad, instrumento y snapshot realmente devueltos por las escrituras, junto con los equipos ya sincronizados. Se mantienen las validaciones, preferencias y escrituras en la misma transacción; no se amplía su timeout ni se añade una lectura posterior expuesta a otra edición concurrente. Tres regresiones rojas reprodujeron la dependencia de esa relectura; después pasaron 166 pruebas afectadas, incluidos guardado individual/grupal y revisión enlazada sin alterar el snapshot anterior. Suite backend del bloque: **44.220 / 107 archivos**, excluyendo únicamente los tests rojos todavía no confirmados de sexto, ajenos al commit de quinto. Backend build y frontend build protegido repetidos con salida 0; este último 12.649 ms. Cloudflare volvió a quedar abierto tras el dry-run y se interrumpió su árbol a los 182.735 ms: continúa sin aprobación.

El runtime corregido se reinició y verificó de nuevo: PostgreSQL, Auth, Storage y variables públicas exclusivamente Development; entrada `/assets/index-BC-3mRGS.js`, SHA coherentes con dist. La escala devolvió 201 en 20.904 ms con el ID reservado original; su reapertura y los controles restantes siguen en curso al escribir esta nota. El dato no demuestra que haya desaparecido toda la lentitud.

## Resultado más reciente: verificación parcial, bloqueo externo

La escala se reabrió con instrumento exacto, pero su cambio exclusivo de estrategia falló con 500 por expiración de transacción. Se eliminó una segunda validación idéntica del contexto dentro del bloqueo y la recarga de relaciones sin cambios en la respuesta de metadatos. La validación previa y la validación bajo bloqueo se conservan; un traslado a otra asignación/período valida ambos contextos. Cuatro regresiones adicionales comprueban esas rutas y la conservación exacta de criterios, snapshot y calificaciones: **170 pruebas afectadas aprobadas**.

Sobre el código final: backend **44.224 pruebas / 107 archivos**, backend build y frontend build aprobados (5.156 y 12.621 ms). Se excluyó únicamente el archivo rojo no conectado de sexto, que no forma parte de este bloque. El último `pnpm cloudflare:build` permaneció activo después del dry-run y se interrumpió a los **731.695 ms**, deteniendo solo su árbol verificado. Sigue sin aprobación.

El servidor final se levantó en 8787, pero el health check y la conciliación Prisma de solo lectura terminaron con timeout de conexión PostgreSQL. El conector Supabase tampoco pudo completar el transporte de red; no fue posible atribuirlo a un estado del proyecto. No se modificó configuración ni se enviaron más guardados. La comprobación anterior del destino exclusivo Development se conserva como evidencia histórica, no como health check final aprobado. Rúbrica y cotejo: guardado/reapertura/estrategia exacta comprobados. Escala: creada y reabierta, estrategia pendiente de repetir con esta última corrección. Ponderada: aún no creada. No duplicar los identificadores del checkpoint.

La [evidencia parcial](2026-10-16-ciencias-naturaleza-5-verificacion.json) y el [guion manual](2026-10-16-ciencias-naturaleza-5-prueba-manual.md) distinguen lo aprobado de lo pendiente: HTTP final, historia tras QA, sesión personal y CLI. Se continúa con las tareas independientes de sexto por la excepción autorizada para bloqueos; quinto no se declara cerrado.

## Actualización posterior: HTTP/DB final aprobado

La conexión se recuperó sin cambiar configuración. Se repitieron las consultas de solo lectura y el chequeo de runtime: PostgreSQL `app_backend_local` sin bypass RLS, Auth, Storage y variables públicas apuntan exclusivamente a Development. La escala completó la actualización exclusiva de estrategia con el ID reservado; la ponderada se creó una sola vez (`a9426545-03e9-4273-92d7-c0297a7081c9`). Los cuatro formatos quedaron guardados y reabiertos, con instrumento/snapshot/textos/puntos y pesos exactos al cambiar únicamente estrategia.

Recheck final con catálogo 91: cuatro recomendaciones, cuatro reaperturas exactas, cinco controles científicos y regresiones FRA/ING/MAT/Ciencias1–4 aprobados. Historia: 23 releases y 102 snapshots del inicio de quinto intactos, un release y cuatro snapshots nuevos; también se conservan los 18 releases y 73 snapshots del inicio del encargo. Evidencia JSON actualizada. Commit de implementación `5010f9a60aed0821674bff27c2dde1e5604ab27f`, push normal confirmado, 0/0 al comprobar.

Pendientes reales: recorrido personal visual y terminación del CLI Cloudflare. El timeout de conexión anterior queda documentado como incidencia recuperada, no como bloqueo vigente de PostgreSQL. No se presenta quinto como completamente aprobado mientras subsistan esos dos límites.

Actualización del build conjunto final: `pnpm cloudflare:build` terminó naturalmente con salida 0 / 86.042 ms sobre catálogo 92, que incluye quinto y las correcciones de persistencia. El CLI deja de ser bloqueo vigente; sus intentos interrumpidos no se reclasifican como aprobados. La sesión personal también se recuperó automáticamente y se retoman los recorridos visuales; no se sustituyen por QA HTTP.
