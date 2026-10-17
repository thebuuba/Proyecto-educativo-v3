# Francés de 1.º: presentación, estrategia e instrumento

## Alcance y entorno

Intervención sobre «Nos presentamos en francés», con la descripción original completa del [caso reproducible](../../../data/evaluation-instruments/french-presentation-case.json). Rama `amplia-instrumentos-secundaria`, inicio `07132f4f17966335564b419162885237559f9b9e`, árbol inicialmente limpio. Catálogo inicial `.75`; final `evaluation-2026.76`.

PostgreSQL, Auth, Storage, URL y clave pública del frontend se verificaron exclusivamente en **AulaBase Development, `eolgunypmtgrsyrjzcld`**. SQL usa `app_backend_local`, sin BYPASSRLS. Auth/Storage responden 200. No se modificaron producción, Hyperdrive, secretos ni datos de producción; no hubo despliegue, merge, reset, force push, dependencias, IA de aplicación ni subagentes.

La cuenta personal confirmada por el usuario está activa, con rol admin y asignación activa de Francés de 1.º: nivel secundario, primer ciclo, código `FRA`. La cuenta QA pertenece a otro centro. Se contrastaron los metadatos mediante lectura, sin copiar cuentas ni datos, sin modificar la cuenta personal y sin sustituir su sesión. La prueba autenticada HTTP/DB usa únicamente el centro ficticio QA de Development: no demuestra el recorrido visual personal.

## Reproducción y causas

1. **Estrategia ausente en el caso:** reproducida con motor compilado `.75` y texto original: resultado `null`. La condición compartida exigía `simul…`, «juego de roles» o «role play». Ahora reconoce práctica de una situación, acciones complementarias de preguntar/responder y cambio explícito de papeles. El resultado es **Simulación**, porque cada estudiante practica ambos papeles en un encuentro oral representado. El título no crea la evidencia; descripción original con título neutral o incompatible produce lo mismo. Se conservan elecciones manuales.
2. **Datos y acciones omitidos:** el proveedor personal compartido extraía nombre, edad, nacionalidad y ocupación; no residencia. La composición añadía turnos y oralidad, pero no preguntar ni cambiar de papeles. Se corrigió la extracción de residencia y su negación, sin convertir nacionalidad, procedencia o dirección exacta en residencia. Se añadieron evidencias distintas para formular preguntas y desempeñar ambos roles cuando se piden. Las respuestas personales se redactan como respuestas cuando esa acción es explícita.
3. **Selector inicialmente desaparecido:** no reproducido visualmente. El código ya contiene exactamente un `TeachingStrategyField`, incondicional, después de Tipo de actividad y antes de Modalidad. Sus estilos no ocultan el contenedor. La prueba de la ruta real `/actividades/crear` pasó para formulario vacío y borrador antiguo sin atributos de estrategia, tanto Francés 1.º como Inglés 6.º, con servicio remoto fallando. No se añadió otro selector ni se inventó una causa histórica.
4. **Demora:** se confirmaron consultas duplicadas de interpretación y recomendación, y consultas independientes de ámbito/mappings ejecutadas en serie. Para una tarea francesa reconocida localmente se elimina la interpretación remota redundante; la recomendación sigue verificando autorización, coincidencia completa del catálogo, versión, ámbito y elementos. Ámbito/mappings se leen en paralelo después de autorizar y validar. Se mantiene la lectura curricular completa y la protección de respuestas obsoletas. No se aumentaron timeouts.
5. **Versión realmente servida:** tras recompilar, se reprodujo una inconsistencia de Wrangler: HTML nuevo, pero URL del bundle nuevo respondía `text/html` (fallback SPA) en vez de JavaScript. Se comprobó el árbol de procesos, se terminó solo esa instancia local y se inició una única instancia mediante `pnpm cloudflare:dev`. Después pasaron las huellas de entry, chunks y `sw.js`, también tras el último build. Entry final `/assets/index-O0t-Eal6.js`, SHA-256 `ed1d833009434e3ebd8d4adbe110538f2257c6877fa66469093e56fef2bc5ab7`. Esto demuestra el incidente de esta recompilación; no prueba que causara el síntoma histórico del selector.

## Instrumentos y alcance compartido

Los [cuatro instrumentos completos, con todos sus descriptores y puntuación de ejemplo](../../curriculum/cobertura-secundaria/frances-presentacion-corregida-ejemplos.md) se generaron desde el motor compilado final y se revisaron por contenido. Son adaptaciones evaluativas de AulaBase, no rúbricas oficiales del currículo.

La rúbrica recomendada conserva seis evidencias: saludo, respuestas de nombre/edad/residencia, formulación de preguntas sobre esos datos, desempeño de ambos papeles, vinculación de turnos y comprensibilidad oral. El cotejo tiene diez indicadores: separa las tres respuestas y las tres preguntas; mantiene saludo, roles, turnos y comprensibilidad como evidencias distintas. Escala por grado y lista ponderada mantienen el mismo contenido y su propósito; la escala conserva descriptores específicos también en 1.º–3.º. Frecuencia solo se usa cuando se solicita como observación.

No se exige acento nativo, ausencia de pausas, producción escrita, dirección exacta ni nacionalidad no solicitada. La puntuación del creador permanece vacía: 20 y 17.35 son elecciones explícitas de QA/ejemplos, no valores predeterminados de la UI.

Se revisaron las familias existentes de los seis grados. El proveedor personal corregido ya se compartía entre 1.º, 2.º y 4.º; no se introdujo esa familia en los grados que no la usaban. El cambio de roles se aplica a las interacciones ya reconocidas cuando la consigna lo solicita. No se añadieron temas ni asignaturas. Las suites de Lengua Española e Inglés permanecen incluidas en la verificación completa.

Negativos y variantes: solo nombre; nombre/edad/residencia; residencia sin nacionalidad/dirección; datos negados dentro de la misma cláusula; lectura y análisis de diálogo; parejas sin representación; ejemplo/recurso de simulación; negación de representación; diálogo sin intercambio; títulos neutral/incompatible. Se encontró y corrigió además un falso positivo al leer sobre una simulación y se conservó el imperativo francés «simulez».

## Mediciones

Mismo equipo, localhost:8787 y proyecto Development. Dos pasadas por fase; servicio directo en proceso Node separado, alternado con HTTP autenticado. La primera pasada no representa un sistema completamente frío: servidor y base estaban activos. La serie «después» se tomó en `.76` tras el reinicio local y la comprobación de entorno, antes del último control de negación. El caso original no contiene esa negación y volvió a verificarse sobre el build final; no se presenta la tabla como una medición visual de ese build. No se compararon peticiones simultáneas ni se restaron tiempos de ejecuciones distintas para atribuirlos a la red.

| Tramo | Antes `.75`, pasadas 1 / 2 (ms) | Después `.76`, pasadas 1 / 2 (ms) |
|---|---:|---:|
| Login QA por HTTP | 2912 | 2419 |
| Interpretación HTTP, llamada diagnóstica explícita | 9148 / 9502 | 9930 / 8768 |
| Recomendación HTTP | 7802 / 7913 | 6429 / 10854 |
| Interpretación directa, incluye I/O DB | 8950 / 7897 | 43246 / 8194 |
| Recomendación directa, incluye I/O DB | 6135 / 6666 | 6644 / 10415 |
| Composición CPU de la recomendación | 16 / 11 | 22 / 10 |

En las recomendaciones directas, autorización/contexto tardó 1151/736 ms antes y 988/845 ms después; validación JSONB del catálogo 873/687 frente a 811/2076; versión 51/479 frente a 53/70; elementos/referencias 3908/4623 frente a 3468/4644. La primera interpretación directa final tuvo un valor atípico de **37980 ms** en elementos/referencias; se conserva en la evidencia. Ámbito y mappings finales se solapan: no se suman como si fueran secuenciales.

La espera programada se mantiene en 450 ms para sugerencias/interpretación y 900 ms para preparación. Un cambio local de selecciones puede reiniciar esos 900 ms: el recorrido de temporizadores se ejercita en pruebas DOM, no se presenta como cronómetro visual. El flujo francés reconocido ahora emite **una** solicitud de recomendación en lugar de interpretación más recomendación. No se añadieron banners, anuncios ni espacios de preparación.

Se separó CPU de composición de las operaciones I/O y se midió el total HTTP; las duraciones DB incluyen pool, red, SQL y decodificación, **no son tiempos SQL puros**. No se dispone de una separación exacta de transporte y ejecución SQL por cada petición HTTP ni de renderizado visual. Comparación adicional de lectura curricular: Prisma 2855/2288 ms frente a join explícito 2854/1361 ms, igualdad de 176 elementos y referencias. No se sustituyó la consulta por esa evidencia limitada. La dispersión observada impide prometer una reducción uniforme de latencia; siguen siendo reales las esperas remotas. No se declara corregido DNS ni se atribuye a DNS una espera sin error DNS registrado.

## Comprobaciones y entrega

Las suites completas finales pasan: **37.574/37.574 backend (97 archivos)** y **38.096/38.096 frontend (125 archivos)**. Incluyen las regresiones de Lengua Española e Inglés, cuatro formatos/paridad local-servicio, puntuación pendiente y reparto 20/17.35, edición inmediata, añadir/completar, agotamiento, edición manual, conservar/adaptar/cancelar y respuestas obsoletas. Se agregó un recorrido francés específico que cambia descripción, estrategia y formato mientras hay una solicitud pendiente; descarta la respuesta anterior y preserva las dos elecciones manuales. Se revisaron y corrigieron los fallos de las nuevas regresiones antes de darlas por válidas.

Los builds finales `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build` terminaron con código 0. Cloudflare finalizó `--dry-run: exiting now`; no fue un despliegue. El build detectó dos errores de tipos en el test nuevo (tipo de instrumento demasiado amplio y opción de locator no admitida), ambos corregidos; regresión de carreras posterior 9/9 y builds repetidos. Persisten los avisos conocidos de tamaño de chunks y el aviso de Node al ejecutar comandos estáticos con `shell:true` en Windows; no se usan argumentos procedentes del contenido del usuario en esos comandos.

La primera prueba HTTP/DB terminó rúbrica y cotejo. Al crear la escala hubo HTTP 500: Prisma informó transacción ya expirada (límite existente 20 s) en la primera lectura de guardado. No se aumentó ese límite ni se clasificó como fallo DNS. Una reconciliación de solo lectura comprobó ausencia por ID de creación y por nombre en el centro QA. La continuación reutilizó exactamente el mismo ID y mantuvo los formatos verificados; el checkpoint conserva la inspección. **Escala y ponderada también terminaron guardado, edición, reapertura y cambio exclusivo de estrategia con instrumento idéntico.** No quedan escrituras inciertas de esta comprobación.

La revalidación final autenticada sobre el último build ejecutó interpretación (Interacción oral / Observación directa / Rúbrica), dos recomendaciones para 20/17.35, paridad servicio/local y lectura de los cuatro guardados, todos con hashes originales. La generación/persistencia de los cuatro formatos y los ejemplos completos se revisaron además por evidencias y pertinencia, no solo por sumas o HTTP 200. Los cuatro guardados conservaron textos y pesos manuales y exactamente los IDs de instrumento/snapshot, versión, contenido, criterios, formato, técnica y puntuación al cambiar solo la estrategia. [Evidencia estructurada y mediciones](../../curriculum/cobertura-secundaria/frances-presentacion-verificacion.json).

La lectura final comparó **38 snapshots históricos y ocho releases**, todos intactos; hay cuatro snapshots QA y un release adicionales. `.75` se congeló antes de modificar el proveedor; la instalación `.76` dio CREATED y luego UNCHANGED, con comparación histórica exacta. **No se ejecutaron migraciones SQL**, ni nuevas ni antiguas: esta intervención solo añadió el release y los datos QA descritos.

Diff y flujo conectado revisados sin subagentes; no se añadieron campos ni anuncios de preparación. Comprobación de secretos contra los valores efectivos de `.dev.vars.local` y credenciales QA, sin imprimirlos; exclusión de `.local`, `.wrangler`, respaldos y artefactos temporales, y revisión UTF-8 aprobadas. Las cabeceras de caché y la sesión personal permanecen con los límites documentados. Se cierra en la rama actual mediante commit en español y push normal; el hash exacto, resultado del push y estado final del árbol se confirman en la entrega, evitando escribir un hash autorreferente en el propio commit.

## Archivos y reproducción

- `packages/shared/src/teaching-strategies.ts`: práctica por acciones y exclusión de ejemplos/lectura.
- `secondary-french-grade-1.ts`, `secondary-french.ts`, `secondary-french-task.ts`, `language-scale.ts`: residencia, respuestas, preguntas, roles, negaciones y descriptores por evidencia compartida.
- `ActivityCreationView.tsx`: evita interpretación francesa redundante; conserva preparación interna y recuperación de errores.
- `evaluation-instruments.service.ts`: paraleliza las dos lecturas independientes, manteniendo el orden de autorización.
- `catalog-current.ts`, `catalog-v75.ts`: release `.76` y payload `.75` congelado.
- Regresiones backend/frontend del caso, visibilidad en ruta y carreras; fixture del caso y scripts `profile-french-*`, `inspect-french-presentation-context.mjs`, `verify-french-presentation-history.mjs`; opciones `--presentation-regression` en los runners existentes.

Mediciones: `node scripts/evaluation-instruments/profile-french-presentation.mjs before|after` (la fase anterior requiere checkout/build anterior; no sobrescribir evidencia de otra fase). Comparación curricular: `profile-french-curriculum.mjs`. Cuenta: `inspect-french-presentation-context.mjs <correo confirmado>`; salida sin correo ni credenciales. Persistencia: `node scripts/evaluation-instruments/run-french-http.mjs 1 --presentation-regression`; su checkpoint impide repetir escrituras ya iniciadas. Ante el fallo registrado: `reconcile-french-presentation.mjs` solo autoriza localmente la continuación si SQL confirma ausencia; `run-french-http.mjs 1 --presentation-regression --resume-verified` reutiliza el identificador y omite los formatos terminados. Revalidar un bloque terminado con `--recheck`, nunca borrar checkpoints para repetirlo. Ejemplos: `node scripts/evaluation-instruments/french-examples.mjs 1 --presentation-regression`.

## Limitación visual y prueba manual

El navegador devolvió «User unavailable» al abrir una pestaña nueva; la sesión personal y sus ediciones no se manipularon. HTTP y pruebas DOM **no son prueba visual**. No se inspeccionaron registros ni cachés reales del service worker personal. Se verificaron recursos y cabeceras por HTTP: `_headers` acumula `no-store` con `immutable` para assets; se registra sin atribuirle la causa del caso. La configuración PWA no usa fallback de navegación; el código existente de limpieza local se revisó, sin ejecutar un borrado manual de cachés ni de borradores.

Pendiente manual: guardar primero cualquier edición personal abierta; abrir una pestaña nueva de localhost:8787 con la cuenta propia de Development; seleccionar Francés de 1.º y abrir un creador nuevo. Antes de escribir, comprobar un único selector entre Tipo de actividad y Modalidad y puntos vacíos. Introducir el caso original; esperar el instrumento, comprobar Simulación y las seis evidencias; elegir manualmente otra estrategia y formato; escribir 20 y luego 17.35; editar un texto/peso, cambiar formato con conservar/adaptar/cancelar, guardar y reabrir. Cambiar solo estrategia debe mantener instrumento, IDs, versión, snapshot, criterios y puntuación. No borrar almacenamiento ni cambiar a producción para esta prueba.
