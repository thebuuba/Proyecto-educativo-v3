# Sociales de 2.º: contrastes procedimentales y entrevista personal

El catálogo `evaluation-2026.100` amplía Sociales común de 2.º con 58 consignas procedimentales concretas y corrige dos exigencias del caso personal de entrevista de Inglés de 6.º. Está instalado y servido exclusivamente en Development. La cobertura continúa siendo parcial. No se modifican esquemas, cuentas, instrumentos históricos, producción ni integraciones de despliegue.

## Fuente y alcance

Se conserva la fuente MINERD 2023, PDF 249–253, ya revisada visualmente por columnas y continuaciones. La versión publicada de Development sigue siendo `ff5db50d-0340-599f-b306-5efccc060a1b`: 196 registros literales; tres exclusiones evaluativas conservadas en el texto. No se republicó ni reconstruyó la fuente.

El proveedor tiene 39 grupos, 120 consignas representativas y 480 ejemplos de los cuatro formatos. Son 39 explicaciones de grupo, 23 contratos anteriores y 58 nuevos. La auditoría enlaza muestras explícitas a 64 de las 65 filas procedimentales; la restante es participación ceremonial, excluida como adhesión personal evaluable. Un enlace no acredita todas las acciones ni variantes de una fila compuesta.

Las nuevas muestras distinguen lectura de mapas y leyendas, distribución geomorfológica, confiabilidad y finalidad de fuentes históricas, planes preventivos y responsables, manejo y registro meteorológicos, construcción y comparación de climogramas, censos y series poblacionales, investigación e hipótesis históricas, esquemas, artículos, propuestas y representaciones de símbolos. No se operaron aparatos reales ni se ejecutaron investigaciones de campo, ceremonias o intervenciones comunitarias.

## Causas y cambios

- Una justificación posterior «con los datos dados» entraba en el helper estadístico, que sustituía la argumentación. El helper ahora exige una acción estadística pertinente; el caso personal de seguridad vial conserva el argumento independiente.
- La detección por raíces confundía sustantivos o metadatos con acciones: investigaciones, indicadores y diferencias. Se distinguen investigación propia, contraste de fuentes y aclaraciones sobre datos e inferencias.
- Las explicaciones anafóricas añadían filas repetidas a investigaciones, planes, esquemas y gráficos. Se conservan con la evidencia a la que se refieren. Responder objeciones pertenece a la discusión de hipótesis y no añade un producto de relleno.
- «Indicados» al final de una cláusula se trataba como un verbo aislado y fusionaba dos acciones. El análisis de 2.º conserva la representación alternativa del símbolo y su explicación independiente. Alternativas con la misma evidencia ya no repiten el mismo texto con «O BIEN».
- Algunas relaciones heredaban todo el tema general: IDH sin datos, posguerra al investigar solo causas, tipos de clima al proponer sostenibilidad o geopolítica general al estudiar un caso dominicano. Las evidencias se limitan al objeto, espacio, período y propósito expresamente solicitados.
- En la prueba personal, confirmar ponderada mientras se preparaba la escala descartó la elección silenciosamente. `prepare()` retornaba por una solicitud activa sin atender la selección confirmada. Ahora una elección explícita o retorno a automático inicia una nueva secuencia; la respuesta o el error anterior no sustituye la propuesta ni libera el estado de la petición nueva. Dos órdenes de resolución y el retorno a automático tienen regresiones propias. No se añadieron anuncios de preparación.

Se conserva un motor compartido de formatos, puntuación y persistencia. Los ajustes propios de 2.º están en `secondary-social-grade-2-evidence.ts`; no se añadió otro generador. Las 292 definiciones y progresiones verificadas de Sociales de 1.º conservan contenido exacto. El catálogo99 se congeló contra su payload instalado en `catalog-v99.ts` antes de modificar la versión actual.

## Caso original de Inglés de 6.º

La sesión personal autenticada permitió reproducir la consigna de entrevista de trabajo en parejas. En el99 el campo de estrategia era visible, se seleccionaba Simulación automáticamente, aparecía la rúbrica y la selección manual de Lista de cotejo mostraba el editor. El fallo de editor oculto no se reprodujo en esa versión y contexto.

Sí se reprodujeron dos problemas de contenido: se imponía una ficha del personaje no solicitada y no se evaluaban las preguntas del entrevistador, pese al intercambio de roles. La políticaV2 de Inglés6.º hace condicional la ficha y añade preguntas solo cuando la consigna pide ese rol; conserva las negaciones. El borrador QA personal es nuevo y no sustituye otros borradores. No se crearon equipos ni se reorganizaron estudiantes.

Los [cuatro instrumentos completos de la entrevista](../../curriculum/cobertura-secundaria/ingles-6-entrevista-personal-instrumentos.json) se leyeron: respuestas del personaje, preguntas del entrevistador, continuidad del intercambio e inteligibilidad. La escala conserva el sistema compartido de grados de cumplimiento. Esta corrección cierra un contraste del caso original; no amplía la cobertura curricular de Inglés.

## Verificación de código de la candidata100

Sobre los cambios finales de código:

| Comprobación | Resultado |
|---|---|
| `pnpm --filter backend test` | 46.595 pruebas; 139 archivos; aprobado |
| Frontend focal: Sociales1.º, Sociales2.º y entrevista personal | 1.570 pruebas; aprobado |
| Frontend focal del creador, estrategia, selectores y solicitudes | 122 pruebas en ocho archivos; aprobado |
| `pnpm --filter backend build` | Aprobado |
| `pnpm --filter frontend build` | Aprobado |
| `pnpm cloudflare:build` | Aprobado |
| Lints backend y frontend | Sin errores; 16 avisos frontend previos |
| Comparación completa de Sociales1.º | 292 definiciones/niveles exactos |

La regresión específica de Sociales2.º pasó por rojo: diez fallos de contexto, explicación alternativa, respuesta a objeciones y sostenibilidad; después 688 pruebas aprobadas. Dos regresiones del selector reprodujeron la elección descartada antes de corregir el guard. La suite ampliada detectó además una expectativa anterior que exigía la ficha no solicitada; se actualizó para comprobar ambos roles y ausencia de ficha, sin debilitar la conservación del cotejo. La lectura de los 480 ejemplos deduplicó textos idénticos y contrastó cada estructura y total; su registro SHA está separado de las pruebas de código y del navegador. Tras la corrección del creador se repitieron sus pruebas afectadas, los cuatro comandos obligatorios y lint; no toda la suite frontend sin necesidad.

## Instalación y entorno efectivo

Instalación100 mediante el instalador existente: `CREATED` y después `UNCHANGED`, igualdad fuente/compilado/manifiesto aprobada, 32 releases y 195 snapshots previos intactos. Consulta SQL posterior de solo lectura confirmó igualdad del payload instalado. No se sobrescribió99.

Localhost:8787 sirve el asset final `/assets/index-DWyZMmhA.js`, SHA256 `32f8233d037e68fb9fb3c94b545ad325121513c30468d6c6706dd2d893445a03`. Sus bytes coinciden con `frontend/dist`, contienen el proyecto Development y no contienen la referencia de producción. El DOM de la sesión personal cargó ese script. Solo una instancia local, iniciada después del build; launcher10428 en el registro privado de runtime. La prueba inicial de entrevista y la primera ejecución HTTP100 usaron el build anterior100; la corrección del selector conserva exactamente el mismo payload de catálogo. No se reinstaló ni sobrescribió el catálogo. No se borró caché ni almacenamiento y no se alteró el service worker; sus internals no se inspeccionaron.

No hay migración remota de esquema, `reset`, `db push`, copia de datos o cuentas. PostgreSQL, Auth, Storage y variables públicas se comprueban con el guard de `cloudflare-development-environment.mjs`. Solo se autoriza `eolgunypmtgrsyrjzcld`.

## HTTP/DB, navegador y rendimiento

Terminó la nueva [ejecución autenticada100 de doce muestras procedimentales](../../curriculum/cobertura-secundaria/sociales-2-procedimientos-verificacion-http.json), con checkpoint propio que incluye la selección de casos para no repetir escrituras. Los cuatro formatos se probaron con20 y17.35: ocho combinaciones formato/puntuación, doce actividades ficticias QA. Las58 consignas completas se cubren en pruebas de código y lectura de instrumentos, no todas mediante HTTP/DB. El recorrido99 de23 contratos anteriores no se presenta como evidencia de100. Pasaron interpretación, recomendación, paridad con alternativa local, puntos pendientes, edición manual, guardado/reapertura y cambio exclusivo de estrategia con instrumento exacto. La selección forzada de un referente excluido respondió400.

La sesión personal y las pruebas QA tienen contextos distintos. El [registro visual previo de Sociales2.º](../../curriculum/cobertura-secundaria/sociales-2-verificacion-navegador.json) corresponde al99: rúbrica17.35, campo visible, selección automática/manual, guardado y reapertura, instrumento exacto al cambiar solo estrategia. Su huella sigue siendo `a8b64949f942c91851083c39b25f8806`; permanece intacto.

En el [recorrido personal100 de Sociales2.º](../../curriculum/cobertura-secundaria/sociales-2-verificacion-navegador-evaluation-2026.100.json), datos, propuesta y argumentación aparecen como tres evidencias. Se inspeccionaron rúbrica y escala y se guardaron/reabrieron dos actividades QA nuevas: ponderada y cotejo, ambas17.35. La segunda confirmó cotejo con otra preparación activa y lo conservó al terminar, guardar y reabrir. La primera permitió cambiar solo estrategia de Estudio de caso a Descubrimiento e indagación, guardar y recargar: huella exacta de instrumento/snapshot/IDs/puntos/técnica `e3608fcd081a1d69cdc1772b4084e0fe` antes/después. No se afirma guardado visual de rúbrica o escala en100.

En [Inglés6.º con la cuenta personal](../../curriculum/cobertura-secundaria/ingles-6-entrevista-personal-verificacion-navegador.json), el100 se verificó visualmente desde vacío: estrategia automática Simulación, rúbrica de cuatro criterios, cotejo manual completo, puntos inicialmente vacíos y20 introducidos explícitamente. Se guardó una única actividad QA separada de la original, `78c41a95-cf08-4822-a5a4-fff3460e63a1`, y se reabrió. Cambiar solo estrategia a Sociodrama y guardar/recargar mantuvo exactamente instrumento, snapshot, IDs, puntuación y técnica: MD5 `2853fc4b29610e97d726e7a24ff199fd` antes/después. Se capturó la matriz reabierta con cuatro filas y20/20. Escala y ponderada del caso no se probaron visualmente en este recorrido.

La recarga inicial del formulario QA sin guardar lo dejó vacío, coherente con su aviso de que los cambios permanecen en pantalla. Se recuperó exclusivamente esa prueba desde su texto conocido; no se tocó la actividad original ni otros borradores. No presentar ese formulario como un borrador persistido automáticamente. La modalidad grupal sin equipos permitió guardar sin crear equipos ni modificar estudiantes.

Conservación final:33 releases/210 snapshots;32/195 anteriores intactos. Las quince actividades QA añadidas son doce del centro ficticio de automatización y tres sin calificar en el contexto personal (dos Sociales y una Inglés). Los cambios exclusivos de estrategia no agregaron snapshots. No se copiaron usuarios ni datos de producción.

Persisten dos incidencias previas: la lista global de Actividades puede agotar el tiempo y el detalle de Instrumento muestra claves internas; Cursos → asignatura → Actividades permitió probar el creador y el editor correctamente. No se atribuyen a la cuenta QA ni se ocultan con nuevos anuncios o timeouts.

Tiempos HTTP100: interpretación, doce muestras, mediana6312ms (4340–7164); recomendación, doce,7598ms (4852–14566); escrituras de actividad,24,4588ms (3317–6518). Incluyen red, autorización, Worker y DB. La preparación local pura fue aproximadamente0.08ms; son capas distintas. Los tiempos del99 usaron otras consignas y constan en el informe anterior: no permiten atribuir causalmente una regresión a este bloque ni justifican elevar timeouts. No se restauraron prototipos de caché descartados.

## Git y continuidad

Rama `ampliacion-de-instrumentos-2`. Base local verificada previa: `1f5226a6650c99f9e408b187a639e6bd148361c0`. Un nuevo fetch confirmó cero commits por detrás y siete por delante antes del commit de este bloque, identificado por el mensaje «Amplía Sociales de segundo y conserva selecciones durante solicitudes». El archivo de continuación registra el hash observado. Los pushes siguen suspendidos por instrucción expresa del usuario hasta revisar integraciones; no se modificaron permisos ni triggers. El403 de lectura de Workers no permite verificar esos disparadores. Una compilación automática no demuestra un preview o despliegue efectivo de producción.

Instalación, cuatro comandos obligatorios, lints, regresiones afectadas, pruebas HTTP/DB, recorridos personales y comprobaciones históricas terminados. El diff no incluye entornos, sesiones, respaldos ni credenciales QA; la auditoría final se conserva como evidencia privada. Se continúa el encargo maestro en Sociales3.º–6.º y áreas pendientes, sin interpretar este bloque como cierre de secundaria ni como cobertura universal del grado.
