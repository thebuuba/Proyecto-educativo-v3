# Auditoría de instrumentos con actividades docentes realistas

## Estado y alcance

Trabajo iniciado el 22 de octubre de 2026 desde `f7d1be7a5292c91d698ac3359b808a247758edd4`, rama `ampliacion-de-instrumentos-2`. El árbol estaba limpio. Este encargo complementa el anterior y vuelve a suspender los pushes. No se han implementado nuevas especialidades.

La auditoría completa está **en curso**. El banco inicial no cubre aún todos los temas/proveedores. Los resultados del motor local, HTTP/DB y navegador se registran por separado. La especificación literal y el plan están en `docs/superpowers/specs/2026-10-22-auditoria-actividades-realistas.md` y `docs/superpowers/plans/2026-10-22-auditoria-actividades-realistas.md`.

## Estabilidad: hallazgos medidos

- Al iniciar no había proceso escuchando en localhost:8787; el runtime indicado en el informe anterior ya había terminado. Se inició un único Worker local con las variables validadas de Development.
- Conector Supabase: AulaBase Development `eolgunypmtgrsyrjzcld`, `ACTIVE_HEALTHY`.
- Configuración efectiva: PostgreSQL `app_backend_local`, sin bypass RLS; Auth y Storage respondieron 200; frontend y servidor apuntan exclusivamente a Development. Assets relevantes y service worker coinciden con los archivos compilados; entry `/assets/index-CBNy98H1.js`, catálogo `evaluation-2026.150`. No se inspeccionó la caché interna del navegador ni se borró almacenamiento.
- Diagnóstico acotado desde esta PC: DNS 71 ms, TCP 51 ms, conexión/autenticación PG 458 ms, consulta de rol 61 ms, agregado de conexiones 67 ms. Auth 668 ms y Storage 206 ms.
- La lectura de versión del catálogo ejecutó en el servidor en 0,052 ms. No hay evidencia en esta medición de una tabla saturada; esto no descarta incidencias intermitentes.
- El primer sondeo autenticado de MF060 respondió 200: login 1817 ms e interpretación 6895 ms, sin crear actividades.
- Causa de coste confirmada en código y medición: cada interpretación/recomendación enviaba **2.519.005 bytes** del catálogo completo para validar igualdad. En la misma conexión: consulta pequeña 44 ms, comparación completa 3060 ms, comparación de huella 87 ms, consulta pequeña posterior 52 ms. Un EXPLAIN de la comparación completa tardó 2135 ms desde el cliente y 17,773 ms de ejecución SQL. El intervalo restante incluye transferencia, recepción, parseo y demás costes fuera de esa medición SQL; no se atribuye todo a un solo componente.
- Los errores anteriores de conexión no se consideran resueltos definitivamente por una ejecución exitosa. Los logs agregados de las últimas 24 horas muestran eventos de conexión/protocolo, pero no permiten atribuirlos de forma inequívoca a cada fallo del Worker. Los avisos de índices sin cobertura tampoco demuestran que sean la causa de este recorrido.

## Corrección de validación del catálogo

`catalog-fingerprint.ts` calcula localmente la huella del catálogo revisado con la representación JSONB del PostgreSQL 17 utilizado. `evaluation-instruments.service.ts` compara esa huella con el contenido efectivo de la fila en **cada petición**, incluida la primera. No descarga ni sube el catálogo completo y no aprende una huella proporcionada por la base. Un catálogo eliminado o alterado sigue rechazándose. La autorización del contexto sigue ocurriendo antes de validar el catálogo.

No hay caché de resultados ni TTL que oculte alteraciones, dependencias nuevas, escrituras de catálogo, cambios de esquema o incremento de timeouts. Se emplea la función nativa documentada de [PostgreSQL para SHA-256 y codificación](https://www.postgresql.org/docs/17/functions-binarystring.html) y se contrastó la representación y orden de claves con [el código de PostgreSQL 17](https://github.com/postgres/postgres/blob/REL_17_STABLE/src/backend/utils/adt/jsonb_util.c). La elección de conexión se contrastó con la [documentación de Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres); no se modificó el pool ni su configuración.

La huella calculada localmente coincidió con **todo el catálogo 150 instalado**, en consulta de solo lectura: `5d1cb38fcfc472fbeca75efc8fe0492bd09aa0da2f32b40695c7c970128ef13a`. Se enviaron 83 bytes de parámetros en lugar de 2.519.005; la verificación acotada, incluida generación local, tardó 429 ms. Tres vectores adicionales se contrastaron con PostgreSQL real (claves Unicode, escapes/arrays/booleanos/nulos y campos opcionales). El helper está deliberadamente limitado al contrato actual de números enteros seguros del catálogo (7906 valores); rechaza decimales u otros números fuera de contrato. No limita las puntuaciones de instrumentos a enteros. Un cambio de representación de PostgreSQL o de ese contrato requiere volver a verificar su compatibilidad, sin reescribir los históricos.

Se descartó una primera corrección que evitaba la transferencia solo después de una validación inicial: su primera interpretación tras reiniciar devolvió 200 a los **49.500 ms** del Worker y el cliente agotó sus 30 s. Ese resultado permanece en `http-after.json`; no se contó como prueba aprobada ni se reanudaron escrituras. La solución final elimina esa transferencia también al arrancar.

Regresiones: tres fallos observados para la primera variante y dos fallos adicionales para la primera petición y la huella derivada del código. La solución final pasó doce comprobaciones focalizadas de servicio/representación. Cubren validación por huella, catálogo eliminado/alterado, rechazo incompatible, instancia nueva, orden de autorización, Unicode/escapes/arrays y rechazo de números fuera del contrato. La suite completa final pasó: **97.174 pruebas en 214 archivos**. Un escape innecesario detectado por lint en una expectativa de prueba se corrigió; lint y las siete pruebas del helper volvieron a pasar. No cambió el código de aplicación después de su compilación final.

## Conservación comprobada antes de escrituras

Consulta de solo lectura contra `history-before-evaluation-2026.150.json`: los **82 releases y 1185 snapshots anteriores permanecen exactos**; estado **antes de reanudar QA: 83 releases/1185 snapshots**. MF060 tenía **cero actividades** en esa comprobación. Después se reanudó su diario original con los IDs originales y ya se han creado actividades; cero no describe el estado posterior. No se recapturaron referencias históricas.

Los **quince baselines personales pendientes** se compararon con sus originales y pasaron. Los IDs, instrumentos, snapshots, texto manual y puntuaciones comprobados permanecen conservados. Evidencias privadas: `mf060-blocked-preservation.json` y `personal-baselines-preserved-after-mf060.json` en `.wrangler/secondary-completion/`.

Los otros recorridos históricos incompletos conservan sus diarios e IDs. Cada uno requerirá reconciliación específica antes de reanudar sus escrituras; no se declara completado por esta comprobación de MF060.

## Banco inicial y evidencia pedagógica

`data/evaluation-instruments/realistic-audit-bank-v1.json`: **17 casos**, separados en A=1 literal real, B=13 sintéticos/reconstruidos y C=3 reservados. Su SHA-256, fijada antes de generar salidas, es `f4530dedd26e1d12f4f4c92998491d784a87e257b113a163f71fa6feeae2f817`. Las variantes de duración no se cuentan como familias distintas. Autor de banco y correcciones: Codex; sin independencia externa ni subagentes.

El único A es la entrevista laboral en inglés de sexto proporcionada literalmente por el docente. La tabla periódica es una reconstrucción: la consulta limitada a actividades guardadas del usuario en Development no encontró coincidencias; los borradores del navegador siguen sin inspeccionar por autenticación pendiente.

Se generaron **56 resultados locales A/B** (cuatro formatos por catorce consignas), conservando instrumentos completos y tiempos en `docs/curriculum/cobertura-secundaria/auditoria-realista-v1-antes.json`. Cuatro son rechazos esperados de la misma contradicción de páginas, uno por formato. No son 56 recorridos HTTP ni 56 instrumentos revisados completamente. Los tres C permanecen sin ejecutar.

### Discrepancias iniciales reproducidas; correcciones pedagógicas pendientes

| Caso | Evidencia visible en salida local | Revisión pendiente |
|---|---|---|
| Sistema solar, duración exacta/máxima/aproximada | Criterios de comunicación/relaciones/explicación; no explicitan todos los planetas, tiempo ni material de apoyo. Nivel intermedio repite el superior con «una imprecisión puntual». | Extracción de requisitos, diferenciación temporal, cobertura y progresiones; revisar cuatro formatos completos. |
| Tabla periódica, quinto | Sale `EXPOSITION` genérica: «Comprensión de química», «Dominio del tema», «Organización», «Comunicación» y «Precisión». Grupos/períodos/ubicación no quedan evaluados explícitamente. | Resolver contexto/proveedor y lenguaje natural; evitar duplicación oral y no imponer cantidad de filas. |
| Operaciones básicas | Incluye resta, multiplicación y división, sin temperatura ni unidades inventadas. Procedimiento y resultado se agrupan por dimensión. | Revisar que el cotejo no oculte operaciones y que la variante de explicación/crédito parcial distinga evidencias sin fijar porcentajes. |
| Francés primero | Rúbrica identifica saludo, preguntas/respuestas con los tres datos, ambos roles, turnos y comprensibilidad. Progresiones leídas: no exigen pronunciación nativa. | HTTP/DB, estrategia automática, selección manual y navegador; revisión de los otros tres formatos. |
| Informe desarrollado | Solo se extraen máximo dos páginas e interlineado 1.5 como entrega. Arial 12, sangría, dos fragmentos, identificación de autor y Word no se detallan íntegramente. | Separar formato, organización, contenido y evidencias; completar extracción. |
| Informe con requisitos retirados | «Hagan un informe…» se clasifica `READING_REPORT_ANALYSIS`; evalúa un informe leído, no el que debe producir el estudiante. | Corregir reconocimiento de intención/negaciones, preservando título antiguo y contrato original. |
| Ofimática: Word/título/Arial 12/sangría/color | Sale `OTHER`, «Seguimiento de instrucciones» genérico y solo interlineado/fuente; no recoge el resto. | Investigar clasificación y extracción antes de atribuirlo a falta curricular. |
| Afiche o exposición | Se impone exposición oral pese a una alternativa no elegida. | Resolver alternativa sin exigir los dos productos ni ocultar ambigüedad. |
| Tres páginas y máximo dos | Se devuelve `TaskRequirementError` con explicación de límites incompatibles. | Comprobar recuperación visible y conservación del borrador en UI. |
| Entrevista real de inglés sexto | Preguntas, respuestas y comprensibilidad presentes; el intercambio de roles no figura como evidencia explícita en la salida inicial. | Revisar interacción/roles y posible solapamiento, sin alterar el literal del docente. |

Los mapas esperados y agrupaciones están fijados por caso en el banco. Todavía falta relacionar **cada** requisito con cada descriptor/indicador de los cuatro formatos y evaluar las salidas después de corregir. No se han cambiado expectativas ni se presentan estos hallazgos como correcciones realizadas.

El índice `auditoria-realista-proveedores.json` registra **81 ámbitos implementados: 54 comunes, 18 optativos y 9 técnicos**. Es un inventario de identidades y pendientes, no una certificación de sus temas. La causa de tabla periódica está en el reconocimiento de lenguaje natural: la regla existente acepta «grupos y períodos» o «posición…tabla periódica», pero no recoge la enumeración «grupos, períodos» seguida de la explicación de posición de la consigna reconstruida. La materia sí dispone de contenido específico.

## Pruebas y pendientes

- Backend completo final: **97.174 pruebas, 214 archivos, aprobados**. La ejecución previa de 97.167 fue anterior a sustituir la primera solución y no es la validación final.
- Backend build y `pnpm cloudflare:build` finales: exit 0; este último también recompiló el frontend. El frontend build explícito anterior pasó y no hubo cambios frontend posteriores. Lint final corregido: exit 0. Cloudflare fue únicamente `--dry-run`.
- HTTP final: login 201/5849 ms, interpretaciones 200/7214 y 13525 ms, recomendación 200/10061 ms. La interpretación repetida fue idéntica y se devolvió el catálogo 150 esperado. **La latencia continúa variable**, sin evidencia suficiente para declarar resuelta toda la inestabilidad.
- QA MF060 finalizado: 16/16 muestras originales guardadas/reabiertas, 101 respuestas sin 500/429, cuatro formatos con 20/17.35, texto manual conservado y estrategia manual sin alterar instrumento. Se reanudó una sola vez el diario original, preservando el fallo previo; no se duplicaron IDs. Es recuperación representativa del proveedor existente, no auditoría completa de las nuevas consignas.
- Navegador Chrome disponible. La cuenta recordada exige contraseña; pestaña `1796703522`, localhost:8787/login. No se enviaron correos ni se cambiaron credenciales. Prueba visual personal del creador todavía pendiente.
- Añadir/completar, estrategia automática, puntuación inicialmente vacía, 20/17.35, cambios de formato y guardado/reapertura requieren comprobación específica con estas consignas. Las pruebas anteriores no sustituyen la nueva auditoría.
- Resto de proveedores/temas implementados: pendiente de ampliar banco con tareas distintas, fuentes cuando hagan falta y muestreo HTTP/visual justificado. MF061 y artes solo inventariadas están fuera de esta auditoría.

## Límite de publicación

Sin push, merge, despliegue, cambio de producción, Hyperdrive, secretos, integraciones, cuentas, reset, borrado de datos ni migraciones remotas. Los cambios de este bloque se guardarán en commits locales una vez verificados. Los resultados del encargo integral previo permanecen históricos; esta auditoría no certifica todo aquel trabajo.

## Checkpoint posterior: recuperación QA preservada y catálogo 150 congelado

La consulta posterior confirmó **83 releases y 1.201 snapshots**. Los 82 releases y 1.185 snapshots anteriores se compararon contra el original y siguen exactos; los 16 nuevos pertenecen a las 16 actividades QA, sin duplicados. Quince referencias personales originales volvieron a pasar después de las escrituras, sin recapturarlas. Evidencia pública: `auditoria-realista-conservacion-v1.json`.

Se creó una referencia NUEVA previa al catálogo 151 y se congeló el payload 150 en `catalog-v150.ts`, contrastado completo con Development, el payload esperado y el módulo generado. El motor compilado también se conservó en almacenamiento privado. Las 15.176 definiciones inglesas previas coinciden con su referencia 149; esta comparación fija el punto de partida y no aprueba las futuras correcciones pedagógicas. Los archivos originales de historia y catálogos anteriores no se sobrescribieron.

Los cinco archivos focalizados de estrategia/añadir/completar/capacidad pasaron **73 pruebas**. Son pruebas de componentes y lógica con dobles, no recorridos visuales. En el banco A/B la regla selecciona SIMULATION para entrevista inglesa y diálogo francés con intercambio de roles. Los doce casos restantes carecen de fundamento suficiente para inferir una estrategia de enseñanza; una exposición estudiantil no se interpreta como explicación docente. No se añadió una propuesta arbitraria. Falta contrastar estas consignas con HTTP y el borrador real; el navegador personal sigue en login.

Commit inicial de estabilidad y banco: `841c620d`. Sin push. Los defectos pedagógicos listados arriba todavía requieren corrección.

## Primer bloque de reconocimiento natural: candidato 151

Corregidos tres fallos reproducidos antes de editar: «Hagan/Haga/Hagamos/Haced un informe» ahora solicita producción; una enumeración natural de grupos y períodos activa el proveedor científico de quinto; «documento de Word» y formato expresado en singular activan Ofimática. El selector frontend ahora utiliza el mismo detector específico de Lengua que el servicio. Se preservan las selecciones manuales y no se añadieron campos ni banners.

Una ampliación inicial de «fuentes» activó incorrectamente formato en una consigna bibliográfica; la regresión existente lo detectó y se acotó a fuente tipográfica, manteniendo las expectativas originales. Se observaron dieciséis fallos iniciales; las 18 pruebas finales pasaron, junto con 1.886 pruebas de módulos afectados, 1.037 de paridad/frontend y 8.720 de Lengua/estrategia. La suite completa pasó **97.193 pruebas en 215 archivos**. Cuatro comprobaciones de versión se actualizaron de 150 a 151; las comparaciones históricas siguen contra 150 y la huella del payload 150 completo permanece idéntica. Backend/frontend/Cloudflare builds y lints terminaron con código 0; Cloudflare solo dry-run. El primer build detectó una anotación TypeScript faltante en el nuevo congelado; se corrigió sin cambiar el payload y se repitieron las compilaciones.

**No es todavía la corrección pedagógica completa**: leídos los doce instrumentos modificados (tres casos × cuatro formatos), tabla periódica aún agrupa demasiado grupos/períodos, incorpora predicciones no pedidas y repite niveles genéricos. Word todavía omite condiciones y duplica la dimensión de formato. El informe retirado ya se clasifica correctamente y no recupera condiciones suprimidas, pero faltan decisiones de organización y calidad de escala/ponderada. Los 44 resultados restantes del banco son exactos respecto al anterior, normalizando solo la versión. Los C siguen reservados. Evidencias: auditoria-realista-v1-intencion-151.json y auditoria-realista-intencion-151-revision.json.

La cuenta QA no tenía asignación de Lengua común en primero. Se reutilizó su centro, curso, sección, año y docente ficticios existentes para añadir únicamente la materia/asignación LEN; las filas previas permanecen exactas, sin cuentas ni estudiantes nuevos. Diagnóstico previo y diario de creación privados conservados. No se tocó el contexto personal.

El catálogo 151 se instaló individualmente en Development: primera ejecución `CREATED`, comprobación idempotente `UNCHANGED`. Fuente y compilado coinciden; el payload 150 congelado sigue exacto. Se conservaron 83 releases y 1.201 snapshots, añadiendo únicamente el release 151; ninguna migración de esquema, cuenta ni actividad durante la instalación.

## Verificación HTTP/DB del reconocimiento 151

Commit local del código: `00576381674c915399a1b40912e9fd2cab6d8e49`. Un único Worker local sirve 151. PostgreSQL (`app_backend_local`, sin bypass RLS), Auth, Storage y variables públicas apuntan a AulaBase Development `eolgunypmtgrsyrjzcld`. Entry `/assets/index-MT0qUmlD.js`, editor, modal, módulo técnico, planificación y service worker coinciden byte por byte con el build. Esta comprobación HTTP no inspecciona el registro ni la caché interna del navegador.

Cuatro muestras con QA autenticada, sin producto cartesiano: informe retirado de Lengua 1.º/rúbrica/20; tabla periódica de Naturales 5.º/cotejo/17.35; documento Word MF002 4.º/escala/20 y ponderada/17.35. Interpretación y recomendación devolvieron el tipo esperado y paridad exacta con la alternativa local. Las cuatro conservaron puntuación inicialmente vacía, texto manual, guardado, reapertura y el instrumento completo al cambiar únicamente la estrategia. Se registraron los IDs antes de crear y se reconciliaron, sin duplicados.

Las 26 respuestas fueron 200/201. Interpretación: 7.751–12.324 ms; recomendación: 7.950–14.071 ms. La latencia continúa variable; estos resultados no certifican la desaparición de incidencias intermitentes. Historia posterior: **84 releases/1.205 snapshots**, con los 83/1.201 anteriores exactos y cuatro nuevas muestras QA. Las quince referencias personales originales pasaron nuevamente en consultas de solo lectura, sin recapturas. Evidencia pública: `auditoria-realista-intencion-151-http.json`.

Se congeló 151 en un archivo nuevo y se contrastó con el payload instalado completo: SHA-256 JSONB `31871f590cc8f41167bd73679fc93db2bca17b80f199f50caeda8c5d50c9d6eb`. Se registró una referencia nueva previa a 152 (84/1.205), conservando todos los originales. Los scripts de instalación, creación QA y congelado ya finalizaron; no se deben volver a ejecutar.

La aceptación pedagógica sigue parcial: Word y tabla periódica conservan los defectos descritos. El siguiente bloque reproduce extracción/agrupación de formato: 18 pruebas nuevas, 13 fallidas antes de corregir y cinco aprobadas. El navegador personal sigue en login; no se cambió contraseña, se envió correo ni se borró almacenamiento. Sin push, producción, despliegue, merge ni migraciones remotas.

## Extracción y agrupación de formato: candidato 152

Se reproducen y corrigen omisiones de Word, título, Arial 12, sangría y color indicado. No se inventan medidas ni colores: cuando se solicita una medida concreta de sangría, se conserva; recursos, opciones, exclusiones e insumos analizados no se convierten en entregas. Los fragmentos cuentan como evidencia textual cuando se solicitan como apoyo, sin confundirlos con un fragmento de teatro musical.

Presentación, organización, extensión y evidencias se separan por dimensión. Para el ejemplo Word, rúbrica/escala/ponderada contienen una dimensión de formato completa; el cotejo tiene cuatro comprobaciones: título, tipografía, párrafo y archivo. Los grupos indican «Sí solo si» se cumplen todas sus condiciones. El modelo no dispone de subindicadores independientes; no se afirma que un Sí/No detecte qué detalle falló. El archivo se integra con presentación en los otros formatos para evitar graduar artificialmente una condición binaria aislada. No se añaden campos ni banners.

Se retiran los criterios genéricos de formato/creación cuando repiten la solicitud puramente formal, conservando el contenido si se pide producir un documento con datos. La suite completa detectó y permitió corregir dos generalizaciones indebidas: color de página web tratado como formato de documento y reaparición del documento genérico en tareas específicas de tablas/imágenes. Los contratos originales permanecen intactos; las pruebas de intención ahora verifican el proveedor y el criterio explícito, sin exigir la fila genérica eliminada.

Verificaciones: 23 regresiones nuevas; 1.828 pruebas afectadas; 1.041 de frontend/paridad con puntos pendientes y 20/17.35; **97.217 pruebas backend en 216 archivos**. Los builds backend, frontend y Cloudflare dry-run, y ambos lints, pasaron. Una anotación de tipo faltante en el nuevo congelado151 fue corregida; nueve pruebas posteriores confirman que sus hashes y payloads siguen exactos. Sin migraciones ni contenido curricular nuevo.

Leídas las ocho salidas cambiadas: Word e informe desarrollado en los cuatro formatos. Las otras 48 son exactas normalizando solo la versión, incluidos cuatro errores esperados de límites incompatibles. Ejemplos completos antes/después: auditoria-realista-v1-intencion-151.json y auditoria-realista-v1-formato-152.json; mapa y revisión: auditoria-realista-formato-152-revision.json. El banco original y su huella no cambian; C sigue reservado.

**Calidad todavía parcial:** el informe necesita identificación de texto/autor, integrar los dos fragmentos con su función argumentativa, evitar título duplicado y corregir niveles binarios de páginas/cantidades. La escala de Lengua aún reemplaza progresiones por descriptores generales. En presentación falta revisar el caso de condiciones solo parcialmente aplicadas cuando ninguna está completa: el formato de cuatro niveles omite una progresión intermedia. Pesos y parcial 50% de ponderada son decisiones editables del formato existente, no exigencias del docente. No se considera cerrada la auditoría ni aprobados todos los instrumentos por estas pruebas.

152 está compilado, pendiente de instalación individual y prueba HTTP/DB. El Worker151 está detenido para recompilar; no arrancar otro sin comprobar el puerto. Sin push, producción, merge ni despliegue.
