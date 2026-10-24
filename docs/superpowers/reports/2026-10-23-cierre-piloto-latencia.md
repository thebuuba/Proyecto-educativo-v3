# Cierre acotado del piloto y diagnóstico de lentitud

Base comprobada: `6986662c62d170ea7791d90f64360652a69fed73`, posterior a `33b11595` y `6ca0b9f5`. Rama `ampliacion-de-instrumentos-2`, inicialmente limpia y 45 commits por delante de la referencia remota local. Trabajo individual, sin agentes ni revisión independiente. La ampliación curricular continúa detenida.

## Extracción decimal

Se reprodujo MAT04 antes de corregir: `[^.;]*` terminaba el fragmento en el punto de `−0.75`. El contrato enlazaba un requisito aparentemente cubierto cuyo origen solo decía «Compara −0».

La segmentación compartida distingue el punto entre dígitos del punto de cierre y separa oraciones, punto y coma y saltos de línea. No transforma comas ni valores: `−0,75` permanece literal y una lista `0, 1, 2 y 3` conserva sus separadores. No pretende resolver automáticamente toda ambigüedad de notación numérica. Un mapa entre texto normalizado y original conserva índices incluso con acentos descompuestos. El mismo segmentador se utiliza al localizar tiempos de presentación.

| Ejemplo | Antes | Después |
|---|---|---|
| MAT04 | origen `Compara −0`, intervalo `[0,10)` | `Compara −0.75 y −2/3`, `[0,20)` |
| Coma decimal | se conservaba, sin resolver la causa del punto | `Compara −0,75 y −2/3` íntegro, sin convertir la coma |
| Enumeración | no debía normalizarse como número | `Compara 0, 1, 2 y 3` íntegro |
| Oración siguiente | no debe incorporarse al requisito anterior | `Justifica…` queda en su cláusula y requisito |

Los dos criterios, sus descriptores, OR y puntuaciones de MAT04 siguen exactamente iguales. La mejora está en la procedencia; no se añadieron criterios ni excepciones por ID, título o valores concretos. Los operandos permanecen en el fragmento literal; no se incorpora un evaluador aritmético de respuestas.

## Duración y representación existente

Antes había una fila temporal con cuatro niveles que incluían «la evidencia disponible… no permite confirmar» y una ponderada que concedía 50% a apartarse de una condición casi binaria. Se reprodujo ese comportamiento con pruebas fallidas.

La definición compartida admite niveles globales, de dos a seis; la ponderada permite parcial global. No admite decisiones binarias particulares para una sola fila dentro de una rúbrica graduada. Se mantuvo esa definición y el sistema de calificación:

- Cotejo: duración separada, con cumplimiento Sí/No verificable. Su observable mantiene la condición solicitada; el tuple interno de autoría no se expone como cinco desempeños.
- Rúbrica y escala: organización oral y duración forman un criterio coherente. El nivel superior conserva comprensión, conexiones y condición temporal; el siguiente permite identificar un problema de conexión secundaria o incumplimiento temporal comprobado; los inferiores describen la comunicación efectivamente lograda. Se elimina la fila temporal independiente.
- Ponderada: se valora ese criterio compuesto. El parcial describe comprensión de ideas aisladas y dificultades de organización; no concede 50% por un tiempo binario considerado aisladamente. No se cambia la configuración global de parciales.

Se conserva el peso relativo combinado de oralidad y tiempo, `3 + 1 = 4`. El juicio docente sobre el criterio compuesto sustituye la falsa graduación de una medición puntual; no se presenta como una regla automática para calcular el logro temporal. La escala utiliza desempeño cualitativo, no frecuencia.

| Condición | Observable después |
|---|---|
| Exacta | «La exposición dura cinco minutos, según la duración exacta indicada.» |
| Máxima | «La exposición no supera cinco minutos; una duración menor cumple el límite.» |
| Aproximada | «La exposición dura aproximadamente cinco minutos, conforme a la consigna y al juicio docente.» |
| Preparación y exposición | En «diez minutos para preparar y cinco minutos para exponer», solo los cinco corresponden a presentación. La preparación sola no crea duración expositiva. |

No se inventan intervalos, tolerancias, nuevos productos ni requisitos para rellenar niveles. Se mantienen precisión científica, cobertura solicitada, comunicación oral, apoyo y alternativa dibujo O lámina. Una sola fila puntuable enlaza el requisito temporal. El cotejo conserva cinco filas; los otros formatos pasan de cinco a cuatro en los tres casos temporales afectados.

## Banco inmutable y revisión de instrumentos

Se conservaron las doce consignas y expectativas originales y los hashes de sus bancos de procedencia. Primero se capturó el estado real anterior; esa captura queda privada. La referencia pública anterior sigue siendo `composition-pilot/after-reviewed.json`, sin alteraciones. La evidencia nueva está en `composition-pilot/closure/results.json`: doce actividades y 24 propuestas, incluidas las dieciséis combinaciones completas de los cuatro casos afectados. Cada una comprueba paridad exacta servidor/local, puntuación inicialmente vacía y totales exactos de 20 y 17.35. La lectura pedagógica completa de esos dieciséis instrumentos está en `closure/instrumentos-afectados.md`; revisión del coordinador, no independiente.

| Caso | Filas de la propuesta automática | Resultado |
|---|---:|---|
| LEN01 | 5 | Criterios idénticos |
| LEN02 | 6 | Criterios idénticos |
| B-NAT1-solar-exacta | 4 | Duración agrupada; cotejo conserva 5 |
| B-NAT1-solar-maxima | 4 | Máximo explícito; cotejo conserva 5 |
| MAT03 | 5 | Criterios idénticos |
| MAT04 | 2 | Criterios idénticos; origen decimal íntegro |
| NEW-A1 | 5 | Criterios idénticos |
| NEW-A2 | 7 | Criterios idénticos; requisitos de presentación conservados |
| NEW-B1 | 2 | Criterios idénticos; sin imponer apoyo ni duración |
| NEW-B2 | 4 | Aproximación, apoyo OR y exclusiones conservados; cotejo 5 |
| NEW-C1 | 2 | Criterios y OR idénticos |
| NEW-C2 | 7 | Criterios, datos y alternativa audio/texto idénticos |

Los doce contratos no dejan requisitos detectados sin enlace. Esto no prueba comprensión lingüística exhaustiva. Nueve propuestas mantienen todos sus criterios exactamente iguales; las únicas modificaciones pedagógicas son las tres temporales. Se mantienen diez regresiones representativas fuera del piloto, sin cambios de contenido. No se declara completa ninguna asignatura.

Las expectativas antiguas de B describían cinco grupos separados. Se conservan literalmente en el banco y en la evidencia; no se cambian para aprobar pruebas. Este encargo autoriza una agrupación coherente para evitar niveles temporales ficticios: comunicación y duración comparten criterio en formatos graduados, manteniendo dos requisitos trazables. El cotejo conserva los cinco grupos.

## Instrumentación y mediciones HTTP

Las trazas se activan solamente con `AULABASE_DEV_TIMING=true`, host localhost/127.0.0.1 y URL exacta de AulaBase Development. Están apagadas por defecto. El lanzador habitual admite activarlas con `$env:AULABASE_DEV_TIMING='true'` antes de `pnpm cloudflare:dev`; no arrancar otra instancia si ya existe una. No se modificó `.dev.vars.local`.

El servidor genera un identificador aleatorio, lo devuelve en `X-AulaBase-Development-Request` y añade el total a `Server-Timing`. Registra inicialización/despacho, autenticación y acceso académico, contexto autorizado, verificación íntegra del catálogo, versiones/ámbitos/mappings/elementos curriculares, composición/conversión, lectura/guardado, operaciones Prisma, adquisición de conexión y consultas del driver. La versión final distingue también creación y desconexión del cliente. No registra SQL, valores, tokens, correos, cuentas ni consignas. Las pruebas comprueban aislamiento entre peticiones y no reflejar identificadores arbitrarios del cliente.

Se midieron dos pares interpretar/recomendar y una lectura filtrada por fase, secuencialmente y con la misma actividad QA y contexto NAT-TU. No son pruebas de carga ni recorridos del navegador personal. Evidencia con todas las etapas e identificadores: `closure/latency.json`. La comparación se ejecutó sin suites de pruebas simultáneas. La etapa de búsqueda curricular es la comparación principal. Los totales corresponden al recorrido inicial y al compilado final, que incorpora también los arreglos del piloto; no se presentan como un A/B de una única variable para el tiempo total. La etapa de composición se mantiene en milisegundos. La medición intermedia del primer filtro se conserva en `latency-initial-filter.json`.

Se encontró una causa concreta: al rechazar la versión publicada más reciente, `versionForContext` volvía a descargar las 59 versiones publicadas. Sus metadatos sumaban 366 956 bytes; esa consulta tardó entre 0.881 y 5.701 segundos. El filtro JSON en PostgreSQL conserva catálogos sin `subjectCodes` y los que incluyen el código autorizado, sin distinguir mayúsculas, igual que el validador anterior. La revisión detectó que `array_contains` exacto no preservaba esa política; se sustituyó por una consulta parametrizada con tipos JSON comprobados y comparación `upper`, sin interpolar valores como SQL. Se verificaron por SELECT ocho fixtures, incluidos `nat-Tu`, clave ausente, null, tipos inválidos y otra asignatura; evidencia `case-policy.json`. Después aplica intacto `versionAllowsContext`, incluidos grado, optativa, modalidad y módulo técnico. La búsqueda técnica mantiene su filtro específico. No se omite autorización, aislamiento, validación de la versión explícita ni verificación del fingerprint del catálogo. No se añaden cachés, reintentos ni timeouts.

En esta muestra, la lectura pasó de 59 filas a 1 y tardó entre 0.181 y 0.246 segundos. Permanecen 19 consultas SQL por interpretación/recomendación: se reduce la descarga, no se afirma haber eliminado todas las consultas. La carga de relaciones de contexto/autenticación y las dos conexiones por petición siguen costando segundos. Cambiar el ciclo de vida del pool o la estrategia de relaciones requeriría una revisión separada; no se hizo en este encargo.

Tiempos en segundos: mediana de dos peticiones para interpretar/recomendar; una para lectura. Las etapas contienen subetapas y algunas se solapan: no sumarlas entre sí. `SQL` mide llamada y respuesta del driver, incluida red y servidor remoto; no aísla CPU de PostgreSQL ni demuestra una causa atribuible a Supabase, Prisma o Cloudflare por separado.

| Etapa | Interpretar antes → después | Recomendar antes → después |
|---|---:|---:|
| JWT y carga de roles | 1.281 → 0.876 | 1.589 → 1.011 |
| Acceso académico | 0.000 → 0.000 | 0.000 → 0.000 |
| Contexto académico autorizado | 2.107 → 1.499 | 2.908 → 1.692 |
| Catálogo íntegro | 0.287 → 0.395 | 0.233 → 0.486 |
| Selección de versión curricular | 3.168 → 0.364 | 4.929 → 0.320 |
| Ámbitos y mappings | 0.970 → 0.535 | 0.943 → 0.725 |
| Elementos y procedencias | 0.778 → 0.681 | 0.460 → 0.687 |
| Ranking curricular | 0.002 → 0.002 | Incluido en composición |
| Procesamiento de interpretación | 0.006 → 0.006 | No aplica |
| Composición y conversión | No aplica | 0.005 → 0.005 |
| Conexión: suma de aperturas | 1.205 → 0.766 | 1.368 → 0.940 |
| Adquisición: incluye apertura | 1.208 → 0.768 | 1.368 → 0.940 |
| SQL: suma de llamadas | 7.623 → 3.689 | 9.843 → 4.115 |
| Total servidor | 8.611 → 4.369 | 11.078 → 4.937 |
| Total observado por cliente HTTP | 8.622 → 4.377 | 11.097 → 4.949 |

La lectura filtrada final pasó de 4.047 a 2.708 segundos de servidor y de 4.058 a 2.720 de cliente. La lectura/autorización de actividad pasó de 3.065 a 1.717 segundos. Sin embargo, la medición intermedia había subido a 4.714 segundos y esta ruta no utiliza el filtro optimizado: su variación no se atribuye a esa mejora. No se generaliza una ganancia global desde estos pocos ejemplos ni se comparan como si fueran equivalentes las antiguas mediciones de 23–29 y 54 segundos.

El primer login medido arrancó el Worker: total 2.337 segundos, 0.249 de inicialización y 0.613 de conexión; cliente 2.378. Tras recargar el código, el login final tardó 2.993 de servidor y 3.034 de cliente (0.239 s de inicialización). Las peticiones posteriores están identificadas como no iniciales. No hubo mejora de composición: la etapa permaneció en 2–7 ms antes y 2–7 ms después.

Dos intentos previos acabaron con cierre del runtime y `ENOTFOUND` del pooler. Se conservaron logs; se confirmó ausencia de listener antes de recuperar una única instancia. Una comprobación de aislamiento sin diagnóstico logró health y login; no se incluye en la comparación. La resolución DNS de Windows/Node volvió a responder, sin modificar red ni credenciales. Las trazas satisfactorias posteriores permiten separar esas caídas de la latencia de consultas. La incidencia intermitente sigue pendiente.

## Verificación automática y entorno servido

| Control | Resultado |
|---|---|
| Reproducción focal inicial | 9 fallos esperados de 11 casos, antes de corregir |
| Focalizadas de composición y trazas | 37 aprobadas; después 3 107 con servicio/aislamiento de fuentes |
| Editor frontend final | 181 pruebas, 7 archivos, aprobadas; 61.1 s |
| `pnpm --filter backend test --maxWorkers=6 --bail=1` | 98 332 pruebas, 248 archivos, aprobadas; comprobación final 107.5 s |
| `pnpm --filter backend build` | 0; final 8.3 s |
| `pnpm --filter frontend build` | 0; 19.4 s |
| `pnpm cloudflare:build` | 0; comprobación final 21.3 s; compilación y dry-run, sin despliegue |
| Lint | El primer intento detectó un catch vacío en la prueba de trazas; corregido con una aserción de rechazo. Repetición backend/shared/frontend: 0 |
| Prueba afectada tras lint | 2/1, aprobadas; no cambió código de aplicación |
| Guardas de entorno | 5/5, aprobadas |

No se ejecutaron suites completas simultáneas ni se repitió la suite completa por la corrección de una aserción de prueba. Las pruebas existentes del editor conservan añadir/completar criterios, confirmación de cambios manuales y rechazo de respuestas obsoletas. Las nuevas comprueban texto y pesos manuales en los cuatro formatos científicos, validación de definición y total exacto.

Al cerrar se verificó también que los fallos de etapas síncronas y de desconexión queden marcados como fallos en las métricas. Se repitieron las dos pruebas afectadas de trazas, typecheck de database, backend build, Cloudflare build y lints; todos con código 0. No se repitió la suite completa solo por ese ajuste de observabilidad. Después sí se repitieron la suite completa, los tres builds y lint backend por la corrección de compatibilidad de la consulta; todos aprobaron. La última ejecución corresponde a la consulta parametrizada final. El verificador final comprueba que JSON e instrumentos completos corresponden al código actual serializado, sin normalizar diferencias de contenido.

La verificación HTTP final confirma PostgreSQL `app_backend_local` sin bypass RLS, Auth 200, Storage 200 y frontend exclusivamente Development, proyecto `eolgunypmtgrsyrjzcld`. Se mantiene `evaluation-2026.173`, sin instalar otro catálogo ni ejecutar migraciones. Fingerprint registrado: `e430f8a66da5e3c55f893cee707f2f7b96dc813ce6de7ef05868cea05121ef4c`; el histórico 172 no se modifica.

Entry servido `/assets/index-9_tdxOuL.js`, chunk `/assets/instrumentos-composicion-piloto-cYGe1gFl.js`; entry, editor, chunk y `sw.js` coinciden byte por byte con el build. El service worker precarga el chunk nuevo. Chrome confirmó ese entry tras una recarga normal. No se borraron borradores, cachés ni registros de service worker. Continúan las cabeceras contradictorias no-store/immutable de assets; no se presentan como resueltas.

## Navegador, conservación y cierre

Chrome conservó la sesión personal de Development. Se abrió un creador nuevo, sin reutilizar ni eliminar borradores anteriores, y se usó NEW-B2 sin cambiar su consigna. La estrategia estaba visible. Se comprobó generación automática de rúbrica con cuatro criterios y puntaje vacío; después se eligió manualmente ponderada, se editó un título de criterio y se fijaron pesos 40/30/15/15 con total 17.35. Tras una única confirmación apareció «Actividad creada». La consulta por nombre/contexto pasó de cero a una actividad y la reapertura visual por la ruta de edición existente conservó los cuatro criterios, edición, pesos, total, duración aproximada y dibujo O lámina. No se volvió a guardar al reabrir.

La muestra se identifica como `FICTICIA PERSONAL CIERRE PILOTO 2026-10-23 · Planetas`. Evidencia separada de QA HTTP: `closure/browser.json`; captura local privada `.wrangler/realistic-audit/closure-personal-reopened.png`. Las otras propuestas se comprobaron por código y lectura de instrumentos; no se afirma haber recorrido doce actividades en navegador.

El POST personal tardó 5.898 s de servidor: autenticación 1.303 s y guardado/autorización 4.586 s. La reapertura filtrada tardó 3.743 s: lectura/autorización 2.272 s. Creación del cliente y desconexión quedaron por debajo de la resolución temporal del runtime en ese POST; apertura 0.725 s, incluida en autenticación. No se capturó duración de red precisa del cliente Chrome para guardar/reabrir ni se inventa un antes/después. La confirmación visual y las duraciones HTTP QA se presentan por separado.

Por consultas de solo lectura: los 104 catálogos y 1 281 snapshots existentes al comenzar mantienen exactamente sus hashes. Final: 104 catálogos y 1 282 snapshots; el único nuevo coincide con esta actividad ficticia. La referencia anterior del piloto —103 releases/1 275 snapshots— sigue conservada y no fue recapturada. Las quince referencias personales originales conservan instrumentos, puntuación, referencias, estrategia manual, bloque y textos, con un único registro por nombre/contexto. Las tres QA anteriores conservan todos los campos exactos y sus snapshots; las tres personales anteriores conservan texto, filas, puntuaciones y los puntos manuales 4/6.77/4.61/1.54/3.08 de B. Resumen: `closure/preservation.json`. Checkpoints, diarios y credenciales QA permanecen privados e ignorados por Git.

Durante el cambio de formato se observó una plantilla vacía transitoria, sustituida después por los cuatro criterios preparados. No se pulsó preparar repetidamente ni se añadieron banners. El listado global no se certifica como rápido: se utilizó la reapertura filtrada existente. Las caídas DNS y las demoras variables de conexión/consultas siguen pendientes; el filtro curricular no las elimina.

## Archivos modificados

- Compartido: `task-clause-spans.ts`, `pilot-task-contract.ts`, `science-presentation-criteria.ts`, `instrument-composition-pilot.ts`. Segmentación/procedencia y representación temporal; no se cambia la definición general de instrumentos.
- Backend: `common/development-request-timing.ts`, guard JWT, servicios de actividades e instrumentos; filtro de versiones comunes en el servicio de instrumentos. Pruebas de cierre, trazas, servicio y compositor.
- Base de datos: `packages/database/src/index.ts` y `development-timing.ts`. Observadores locales opcionales de Prisma/pg; no cambio de credenciales, esquema, límites ni arquitectura del pool.
- Worker y lanzador: `worker.ts`, `scripts/cloudflare-local.mjs`. Correlación local y activación opcional, sin configuración de despliegue.
- Frontend: solo `compositionPilot.spec.ts`; no componentes, estilos, controles ni banners nuevos.
- Evidencia y documentación: verificador reproducible `scripts/evaluation-instruments/verify-composition-pilot-closure.ts`, carpeta `composition-pilot/closure/`, este informe, plan y archivo de continuación. Los logs completos, capturas y diarios privados permanecen ignorados.

## Prueba docente: tres actividades de redacción propia

Redacta tú tres pares de título y descripción nuevos, dentro del ámbito real: primero de secundaria común, Lengua Española (producción escrita de noticia), Ciencias NAT-TU (explicación oral de los planetas del sistema solar) y Matemática (tabla de frecuencias con barras y análisis, o comparación justificada de racionales). Estas instrucciones no son tres consignas de muestra ni pruebas ya realizadas. El resto conserva el motor anterior; otros grados, optativas y familias no se incorporan al piloto.

1. Abre localhost:8787 con tu cuenta de Development y un creador nuevo; conserva los borradores anteriores. Introduce tu título y descripción. Observa si se reconocen la acción y los requisitos sin imponer entregas, datos o recursos que no pediste.
2. Revisa el instrumento completo: contenido, alternativas O, exclusiones, descriptores y coherencia de los niveles. En la presentación distingue duración exacta, máxima o aproximada; la aproximada queda a tu juicio sin tolerancia inventada. Cambia manualmente de formato en una muestra y espera a que termine su preparación interna.
3. Comprueba que los puntos empiezan vacíos. Fija 20 o 17.35; edita un texto y una distribución válida, guarda y reabre. Verifica que tipo, texto, pesos y total permanezcan idénticos. No regeneres un instrumento histórico para probar estos cambios.

Si falla, entrega grado/asignatura, título y descripción exactos, formato elegido, requisito esperado y resultado observado, captura del criterio completo y paso donde ocurrió. Para un error HTTP, añade estado y `X-AulaBase-Development-Request` si está disponible en la respuesta. No compartas cookies, tokens ni contraseñas. Ante un guardado dudoso, comprueba primero si ya existe la actividad; no confirmes repetidamente.

Dictamen: **listo para la prueba docente acotada de tres actividades propias, con limitaciones operativas documentadas**. Se corrigieron los dos defectos y se verificó un recorrido personal completo. Esa prueba de redacción nueva sigue pendiente y no se presenta como aprobada; tampoco se acredita comprensión de todas las formulaciones posibles ni una solución general de lentitud. No recomiendo extensión automática ni declaro cerrada ninguna asignatura.

Rama `ampliacion-de-instrumentos-2`; los commits anteriores se conservan. Este cierre se registra en un commit local posterior a `6986662c`, cuyo hash se entrega en el mensaje final. La revisión de Git excluye secretos, respaldos, credenciales QA y capturas privadas. Sin push, fetch, merge con main, reset ni despliegue; sin cambiar producción, integraciones ni credenciales. Se deja una única instancia Development en localhost:8787 y la muestra reabierta. La ampliación curricular queda detenida.
