# Diagnóstico del creador: estrategia e instrumento

Fecha: 15/10/2026. Rama `amplia-instrumentos-secundaria`, base `3c2f3d9`. Alcance: investigar la ausencia comunicada del campo «Estrategia de enseñanza y aprendizaje» y la preparación del instrumento en la cuenta personal de Development; conservar el formulario vertical, las elecciones manuales y los puntos pendientes sin un valor predeterminado.

**Estado del informe:** compilaciones finales aprobadas y recorrido de creación, guardado y reapertura comprobado en la cuenta personal de Development. La carrera del instrumento quedó reproducida en pruebas; la desaparición original del selector no se reprodujo en esta sesión y su causa histórica sigue sin demostrarse.

## Resultados y atribución de causas

| Observación | Evidencia | Conclusión permitida |
| --- | --- | --- |
| Campo de estrategia comunicado como ausente | Código actual, pruebas de ruta real y sesión personal en localhost muestran exactamente un selector. | No se reprodujo su desaparición. No se añade otro campo ni se atribuye a una condición académica. |
| Instrumento que puede quedarse sin preparar | Dos pruebas deterministas fallaron con la petición anterior todavía pendiente cuando vencía la espera del borrador nuevo. | Carrera de solicitudes reproducida y corregida. No se demostró que fuera la causa del episodio personal original. |
| Falta de señal y acciones durante la preparación inicial | Una prueba falló por ausencia de «Preparar instrumento». | Se incorpora estado visible y acceso a preparar o empezar manualmente cuando ya hay nombre y descripción. |
| Registro y limpieza del service worker en localhost | Una simulación con los scripts existentes permite que `/sw.js` se registre después de terminar la limpieza. | Riesgo de arranque independiente; no prueba que se sirviera un bundle antiguo. No se cambia la configuración de caché en esta intervención. |

## Entorno y recorrido personal comprobados

La comprobación de entorno mediante Node confirmó AulaBase Development (`eolgunypmtgrsyrjzcld`): conexión SQL con `app_backend_local` sin BYPASSRLS, Auth y Storage con HTTP 200, y referencia Development en el frontend servido, sin referencia de producción ni clave service-role en ese frontend. Este resultado comprueba el destino y los accesos técnicos; por sí solo no acredita el recorrido de una cuenta concreta.

El usuario autorizó el acceso a su cuenta personal mediante enlace de acceso. Después del inicio de sesión, se recorrió `localhost:8787` → Actividades → Crear → **6.º A / Inglés / P1 / b1**. El QA anterior de 2.º y esta cuenta personal de 6.º son contextos distintos y no se presentan como equivalentes.

Caso facilitado por el usuario:

- Título: «Una entrevista de trabajo en inglés.»
- Descripción: «En parejas, los estudiantes realizarán una entrevista de trabajo simulada en inglés. Uno entrevistará y el otro responderá sobre la experiencia y las capacidades de un personaje ficticio. Luego intercambiarán los roles.»

Antes de recompilar los cambios de esta intervención, el navegador utilizaba `index-DRaZPRgF.js` y `ActivityEditorWorkspace-HauKZMjo.js`. El entry coincidía con el archivo servido y el código disponible en disco. En esa sesión:

- La estrategia apareció una sola vez y el texto exacto produjo «Simulación».
- Interpretación y recomendación devolvieron HTTP 200, con tiempos aproximados de 5,6 y 5,8 segundos respectivamente.
- La selección automática produjo una rúbrica con tres criterios completos.
- La elección manual de «Lista de cotejo» también mostró su instrumento.

No se reprodujeron la desaparición del selector ni el bloqueo del instrumento en este recorrido personal actual. Como se realizó sobre el bundle anterior a la corrección, esta observación no constituye una prueba visual de la corrección recompilada. Tampoco demuestra retrospectivamente qué ocurrió en la sesión en la que se comunicó el problema. La pestaña de producción identificada durante el inventario inicial permaneció intacta.

### Verificación sobre la compilación final

Después de recompilar, se reinició únicamente el servidor local porque su manifiesto de assets anterior devolvía 404 para `/login`. Se comprobó que el puerto estaba libre antes de iniciar una única instancia. El navegador cargó `index-yWh82mQY.js`; el servidor entregó ese entry y `ActivityEditorWorkspace-Ci9zezSy.js` con HTTP 200, idénticos a los archivos de disco. El segundo contiene el nuevo mensaje de preparación. Se repitió con éxito la verificación de PostgreSQL, Auth, Storage y frontend contra `eolgunypmtgrsyrjzcld`.

Se retomó el borrador autoguardado desde Actividades. Sus selecciones y textos permanecían intactos, al igual que los otros dos borradores existentes. La estrategia era «Simulación», el instrumento era Lista de cotejo y los puntos seguían vacíos. Cambiar solo la estrategia a «Sociodrama o dramatización» dejó exactamente iguales los siete campos DOM del instrumento.

Para completar la prueba de guardado, se eligió modalidad grupal y se introdujeron **30 puntos explícitamente**, sin establecer ningún valor predeterminado en el producto. La actividad se guardó con HTTP 201 y se reabrió desde el listado, conservando la estrategia manual, la lista de cotejo, sus tres criterios y los puntos. La actividad de prueba queda en Development con ID `09f09be0-46c7-4056-8957-43113cb3cac9`; no tiene calificaciones ni equipos asignados.

### Fallo de transacción descubierto al editar la actividad guardada

El guardado posterior de un cambio exclusivo de estrategia falló dos veces en la cuenta personal, con HTTP 500 a los 10,116 y 10,507 segundos de duración total de la petición. El log identificó `PrismaClientKnownRequestError: Transaction API error: Transaction not found` al intentar confirmar la transacción. Las consultas de lectura mostraron que la estrategia anterior y el instrumento permanecían intactos.

`GradingService.saveActivity` no configuraba un plazo propio y utilizaba los 5 segundos predeterminados del cliente compilado de Prisma. La duración HTTP incluye autenticación y comprobaciones previas; no equivale a la duración interna de la transacción. La edición realiza además bloqueo de fila y validaciones del contexto de origen y destino dentro de la transacción. No se halló una desconexión prematura del cliente: el Worker espera la petición antes de desconectarlo.

Se estableció `timeout: 20_000` únicamente para la transacción de `saveActivity`, siguiendo el valor ya utilizado en Auth y Schools. Se conservaron el bloqueo, las validaciones de autorización, la atomicidad, `maxWait` y la configuración del pool. Las tres suites relacionadas pasaron con 160 pruebas y se repitió la suite completa de backend: 94 archivos y 36.840 pruebas aprobadas. La confirmación empírica sobre el mismo formulario se registra en el cierre de este informe.

Con el backend recompilado, se reintentó el mismo formulario conservado: HTTP 201 y «Actividad actualizada». La base registró `SIMULATION / MANUAL`. Las consultas de solo lectura confirmaron igualdad del ID del instrumento, del snapshot, de los criterios, de la fila completa del instrumento y del payload del snapshot; la versión continuó en 1. Los hashes MD5 usados únicamente para comparar contenido fueron `83f78131377c55a10f4bee9b60ea20f9` (criterios), `2ea63b38f395504886aa0fe959a7f734` (fila del instrumento) y `797a6cf9ecd6d60c1a66f26b8bbddb83` (payload). El agotamiento del plazo es la explicación compatible con el código y los dos fallos; no se instrumentó el reloj interno de Prisma para demostrar retrospectivamente el instante exacto de expiración.

Finalmente se reabrió otra vez desde Actividades: el navegador confirmó «Simulación», `lista-cotejo`, 30 puntos y el instrumento visible. La captura de la vista actual mostró el formulario vertical completo, el campo de estrategia y los tres criterios. La captura solicitada como página completa agotó su plazo; la captura de la vista actual sí respondió. Se dejó abierta la actividad en localhost.

## Campo existente y cobertura de integración

La ruta `/actividades/crear` carga `ActivityCreatorPage` → `ActivityCreator` → `ActivityEditorWorkspace` → `ActivityCreationView` → `ActivityDataSections`. Este último ya renderiza `TeachingStrategyField` sin una condición propia, después de «Tipo de actividad» y antes de «Modalidad». El contexto académico filtra las opciones, pero no elimina el control. Los borradores históricos sin esos atributos se normalizan a estrategia ausente y origen `UNKNOWN`; el control sigue visible con «Sin estrategia».

Se añadió [ActivityCreatorStrategyVisibility.spec.tsx](../../../apps/frontend/src/modules/activities/components/ActivityCreatorStrategyVisibility.spec.tsx), que ejecuta la página y el editor reales, incluido el editor de descripción. Solo simula la cuenta y las respuestas de API. Sus dos casos, nuevo e histórico, utilizan Inglés de 6.º de secundaria y comprueban:

- Un único selector visible, situado en el orden del formulario entre el tipo de actividad y Modalidad.
- Puntuación vacía antes y después de elegir manualmente «Debate».
- Persistencia de la elección manual en el borrador del contexto correspondiente.
- Recuperación del título, la descripción exacta y el bloque del borrador histórico sin atributos de estrategia.

Estas pruebas pasaron desde su primera ejecución: caracterizan un comportamiento existente, no representan un fallo RED de visibilidad corregido. El entorno jsdom permite comprobar presencia, visibilidad DOM y orden documental; no sustituye una medición del diseño responsive en navegador. La prueba anterior `ActivityCreator.spec.tsx` simulaba el workspace completo y no podía acreditar la presencia del selector real.

## Carrera de preparación reproducida y corrección

La secuencia determinista fue:

1. Comienza una recomendación para el borrador A y queda pendiente.
2. Se modifica la descripción o la elección del instrumento y se forma el borrador B.
3. Vence la espera programada para preparar B mientras la solicitud de A sigue activa; la protección de solicitudes simultáneas impide iniciar otra.
4. La respuesta de A llega después y se descarta correctamente por estar obsoleta. Antes de la corrección, liberar el indicador de solicitud activa no volvía a programar la preparación de B.

En la ejecución RED de las 13:19:08, fallaron ambos casos —respuesta antigua resuelta y rechazada— porque faltaba la región «Instrumento y estado de criterios», aunque el selector ya mostraba Lista de cotejo. Tras corregir el cierre de la solicitud y reprogramar cuando el contexto o borrador vigente habían cambiado, ambos casos pasaron.

El cambio está acotado a [ActivityCreationView.tsx](../../../apps/frontend/src/modules/activities/components/editor/ActivityCreationView.tsx). La revisión de preparación vuelve a activar la espera solo cuando la petición que termina corresponde a la secuencia vigente y su contenido quedó desactualizado. Se conservan las comprobaciones que descartan respuestas tardías y protegen elecciones y contenido manuales. La preparación inicial muestra ahora «Preparando el instrumento de evaluación…» y ofrece «Preparar instrumento» o «Crear desde cero» cuando existen nombre y descripción.

[ActivityPreparationRace.spec.tsx](../../../apps/frontend/src/modules/activities/components/ActivityPreparationRace.spec.tsx) contiene siete casos: respuesta obsoleta resuelta y rechazada, error visible sin bucle automático con reintento explícito, selección manual durante una petición pendiente, creación manual protegida de una respuesta tardía, y el caso exacto de entrevista en Inglés de 6.º con servicio no disponible tanto en selección automática como con Lista de cotejo explícita. Comprueban criterios utilizables, conservación de la selección y puntuación pendiente sin asignar puntos visibles. La prueba de la acción inicial también se observó fallar antes de añadirla.

## Hallazgo independiente de service worker

`main.tsx` llama a `clearDevServiceWorker()` sin bloquear el arranque. En localhost, esa función consulta los registros, los elimina y borra CacheStorage. El script generado `registerSW.js` añade por separado un listener de `load` que registra `/sw.js`. Una simulación en memoria, sin acceso al navegador del usuario, produjo la secuencia «limpieza completa → registro en load» y dejó un registro en el modelo. Esto demuestra una carrera posible entre esas operaciones, no una respuesta antigua realmente entregada al navegador. La documentación de [unregister()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/unregister) también contempla concurrencia con un registro del mismo ámbito.

El service worker generado actual usa `NetworkOnly` para navegación, no precarga HTML, precarga recursos con hash y configura `skipWaiting` y `clientsClaim`. Las respuestas HEAD inspeccionadas en localhost para `/`, `/sw.js` y `/registerSW.js` incluían `no-cache, no-store, must-revalidate`. Los assets concatenaban esa política global con `public, max-age=31536000, immutable` por la superposición de reglas en `_headers`: es una inconsistencia de política, no evidencia de contenido antiguo.

No se cambió el registro, la limpieza ni la política de caché; tampoco se ejecutó una limpieza manual indiscriminada del almacenamiento del navegador. Los `localStorage.clear()` de las pruebas pertenecen al almacenamiento aislado de jsdom, no al de la cuenta personal. No se inspeccionó el controlador activo del navegador mediante APIs fuera de las permitidas. No hay evidencia suficiente para atribuir el síntoma a la caché.

## Verificaciones finales

| Comando o comprobación | Resultado registrado |
| --- | --- |
| `pnpm --filter backend test` | 94 archivos, 36.840 pruebas pasan; repetido tras el cambio final del plazo de transacción. |
| `pnpm --filter frontend test` | 122 archivos, 37.472 pruebas pasan; ejecución anterior a la última ampliación del spec dirigido. |
| `pnpm --filter frontend test src/modules/activities/components/ActivityPreparationRace.spec.tsx` | 7/7 pasan, incluida Lista de cotejo manual para la entrevista. |
| `pnpm --filter frontend test src/modules/activities/components/ActivityCreatorStrategyVisibility.spec.tsx` | 2/2 pasan; última ejecución de este informe a las 13:29:55. |
| Primera compilación frontend de esta intervención | Falló con TS2345 en el nuevo spec: `draftId` opcional se pasaba a `URLSearchParams.set`. Se corrigió el fixture con un identificador literal de tipo string y se repitieron las dos pruebas dirigidas con éxito. |
| `pnpm --filter backend build` | Pasa, código de salida 0; repetido tras el cambio final de backend. |
| `pnpm --filter frontend build` final | Pasa, código de salida 0. Advertencia de tamaño de chunks; sin errores de compilación. |
| `pnpm cloudflare:build` final | Pasa, código de salida 0; repetido tras el cambio final de backend y termina con `--dry-run: exiting now`. No se desplegó. |
| `git diff --check` | Sin errores en las comprobaciones previas a redactar este informe. |
| Comparación tras cambiar solo estrategia y guardar | Mismos IDs, versión 1, criterios, fila completa del instrumento y payload del snapshot. |
| Auditoría de los cinco archivos preparados para commit | Cero archivos prohibidos, coincidencias de secretos locales o caracteres dañados. `.dev.vars.local`, `.env*` privados, credenciales QA y `.wrangler/` ignorados. |

## Archivos y límites del cierre

- `ActivityCreationView.tsx`: reprogramación de preparación obsoleta, estado inicial visible y recuperación manual.
- `ActivityPreparationRace.spec.tsx`: siete regresiones de preparación, elecciones manuales y puntos pendientes.
- `ActivityCreatorStrategyVisibility.spec.tsx`: dos pruebas de la ruta real con borrador nuevo e histórico.
- `grading.service.ts`: plazo explícito para guardar actividades en una transacción remota.
- Este informe: evidencia, resultados y límites de atribución.

No se aplicaron migraciones ni se modificaron datos, secretos, Hyperdrive o configuración de producción. No se amplió cobertura curricular. Las únicas escrituras funcionales fueron el enlace de acceso autorizado y la actividad de prueba en Development; los demás borradores se conservaron. Los secretos locales, respaldos, logs y credenciales QA permanecen excluidos de Git.

La desaparición original del selector no tiene una causa demostrada: apareció en la cuenta personal tanto antes como después de compilar. No se añadió un duplicado. La carrera reproducida del instrumento tampoco se presenta como prueba retrospectiva del episodio original. El estado real del controlador del service worker no quedó accesible mediante las APIs permitidas; sí se verificaron código, cabeceras y coincidencia de los assets entregados. La advertencia de tamaño de chunks sigue presente y no bloquea el build.

Git partió limpio en `3c2f3d938d5b27beb9af8c4ebc7de1437a22924a`, sincronizado con la rama remota. El cierre se realiza en `amplia-instrumentos-secundaria`, con esos cinco archivos y commit en español. El hash resultante, resultado del push normal y estado final del árbol se informan en la entrega; sin merge ni despliegue.

## Ajuste posterior: preparación automática silenciosa

Por la instrucción complementaria del usuario se retira el banner «Preparando el instrumento de evaluación…», sin reservar su espacio, y los anuncios temporales «Preparando…» e «Instrumento preparado» de los botones. Se conservan los nombres de las acciones, su bloqueo durante solicitudes activas, los errores reales, la recuperación manual y los avisos de autoguardado. Se elimina el estado y temporizador que solo sostenían el anuncio de éxito.

`ActivityPreparationRace.spec.tsx` verifica que no hay anuncio ni contenedor de estado en la sección del instrumento durante una solicitud pendiente; mantiene las siete regresiones de solicitudes obsoletas, selección manual, recuperación y puntaje pendiente. Resultado: 7/7. Backend completo: 37.201/37.201. Los builds finales `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build` terminaron con salida 0; el último confirma `--dry-run: exiting now`. Esta comprobación de componentes no se presenta como prueba visual en el navegador; la sesión personal y sus borradores se conservan.

La suite frontend completa posterior ejecutó 37.776 pruebas: 37.775 pasaron y una prueba de Calificaciones todavía buscaba el antiguo nombre de botón «Instrumento preparado». Se actualizó para exigir su ausencia y pulsar «Generar nuevo instrumento». La repetición del archivo afectado pasó sus 54 pruebas; el recorrido específico también pasó individualmente. No se cambió lógica de producto en esta corrección del test.
