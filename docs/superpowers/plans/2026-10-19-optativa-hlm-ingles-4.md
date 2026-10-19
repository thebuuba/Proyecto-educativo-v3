# Manejo de la información en inglés de 4.º HLM

> Ejecución individual mediante executing-plans y TDD; sin subagentes ni preguntas rutinarias, por instrucciones expresas del usuario.

**Objetivo:** conectar y verificar esta optativa académica según su fuente, conservando Inglés común y las optativas anteriores.

**Arquitectura:** reutilizar la mecánica de acciones/modos del proveedor de inglés superior y las funciones/evidencias de4.º que coincidan con esta fuente. Contexto optativo explícito y namespace propio; no hacer pasar una optativa por un contexto común. Una opción de guard en la factoría puede conservar su comportamiento predeterminado; introducirla solo después del RED correspondiente. Los cuatro formatos y persistencia siguen compartidos.

**Tecnologías:** TypeScript, pnpm, Vitest, scriptsNode, Workerlocal y PostgreSQL/Auth/Storage existentes de Development. Sin nuevas dependencias.

**Spec:** [encargo integral de secundaria](../specs/2026-10-17-secundaria-pendiente-encargo.md). Base `f28884aac5584e2591610e6bb2dc67095ec75240`.

## Límites y decisiones

Solo Development `eolgunypmtgrsyrjzcld`; no producción, main, merges, despliegues, cambios de integraciones/permisos, pushes, resets, borrados, nuevas cuentas, copias, IA en generación ni migraciones remotas de esquema. Commits locales españoles por bloques verificados. No modificar releases, snapshots o migraciones anteriores. Preservar puntos pendientes, preparación silenciosa, elecciones manuales, formulario y estrategia sola exacta.

La fuente fue leída visualmente completa: PDF445–449/impresas444–448, scope `b2d7a388-b852-52a5-adf5-d78642f21f96`,188registros80C/56P/17A/21I/14competencias. No repetir renders. Nombre de asignación/dataset «Manejo de la información en inglés» y encabezado «Manejo de Informaciones en Inglés»: un solo ámbito. El resolvedor estructurado confirma `OPT-HLM-ING-4`/grado4/salidaHLM. No acredita Inglés común ni las mallas literaria/crítica deHLM5/6.

Freeze126 YA ejecutado una vez contraDB por lectura: `catalog-v126.ts` y privado `optative-hlm-english-four-base-126.json`; no repetir. Runtime,DB y compilados permanecen126. Historial59releases/518snapshots al cierre anterior. PersonalFHR1 y demás baselines nunca se regeneran. Precaché126 dispone de54.026bytes antes de2MiB: comprobar crecimiento; no subir el límite para ocultarlo.

Las funciones son información, noticias, predicciones/anuncios, opiniones, experiencias, problemas/motivos, instrucciones y deseos/planes. Dominios, vocabulario, expresiones, gramática, medios y estrategias se evalúan cuando la consigna los pide; no toda la lista simultáneamente. Diferenciar comprensión, producción e interacción. Casos ficticios válidos; sin acento nativo, perfección sin errores, vivencias íntimas, empleo, viajes, correo real, publicaciones o contacto externo obligatorios. La gramática se vincula a la función solicitada. Conservar el literal «Pasado simple» junto a un ejemplo de presente perfecto, advirtiendo su incoherencia sin enseñar esa correspondencia falsa.

## Archivos e interfaces previstos

- Fuente/correspondencias: `docs/curriculum/cobertura-secundaria/optative-hlm-ing-4-{correspondencias,matriz,instrumentos,revision-instrumentos,verificacion-http}.json` y contrato `data/evaluation-instruments/optative-hlm-ing-four-contracts.json`.
- Proveedor nuevo acotado `packages/shared/src/secondary-optative-english.ts`: metadata del ámbito y `resolveOptativeEnglishTask(title,description,context)`, criterios/selecciones reutilizados. Reutilizar `createUpperEnglishProvider`, `requestedGradeFourFunctions`, `fourthGradeEnglishContent` y helpers de gramática/léxico/estrategias/géneros/contexto que hayan sido cotejados. Prefijos `opt-hlm-ing-4-` y traza propia. El guard común sigue rechazando optativas.
- Conexiones existentes: `secondary-english.ts`, motor backend, servicio, alternativa local y `activityDefaultSuggestions.ts` (su rama inglesa es explícita; `resolveEvaluationTask` solo ofrece el fallback general). Introducir una entrada genérica de resolución si evita duplicar ramas, conservando las exportaciones comunes y sus contratos. Modos oral+escrito y acciones independientes deben mantener ambas evidencias, sin fingir contextoING.
- Tests nuevos backend/frontend `optative-hlm-ing-four-contract.spec.ts` / `optativeHlmIngFourContract.spec.ts`, servicio y regresiones pertinentes. Catálogo127 con lookup126 y metadata optativa propia; no alterar arrays comunes o módulosHLM-LEN.
- Scripts de fuente, QA, HTTP e inventario: descriptor explícito solo para este ámbito revisado, sin habilitar optativas por regex general. Reutilizar el curso ficticio académico de4.º sin cambiarlo ni crear cuentas. SourceCode previsto `MINERD_SECUNDARIA_2023_OPT_HLM_ING_4_V1`.

## Foco de revisión

- Anclas mixtas con encabezados/ejemplos: no presentar todos los fragmentos como tareas independientes ni seleccionar encabezados excluidos por HTTP.
- Opinión y comparación cultural: evidencia del mensaje y del texto, sin exigir adhesión o calificar personalidad.
- Gramática/léxico pedidos como recursos de una función: no añadir funciones por palabras que solo nombran categorías léxicas.
- Medio oral/escrito, comprensión/producción e interacción: no imponer pronunciación a un escrito ni interlocución a una lectura.
- Reutilización de4.º común: las coincidencias requieren cotejo y ejemplos completos; el nombre de un proveedor existente no acredita esta optativa ni sus variantes.

## Tareas

### 1. Clasificar y fijar la fuente

- [x] Confirmar commit6, árbol limpio y procesos previos terminados; únicamente Worker126 activo.
- [x] Congelar126 una sola vez contraDB antes de cambios de proveedor. Confirmar código estructurado/nombre/salida.
- [x] Clasificar individualmente153C/P/A con referencias, continuaciones, ejemplos y notas. Leer preparación privada y source-reviewed existentes. Separar encabezados, ejemplos, disposiciones privadas y contexto condicionado de las evidencias adaptables; conservar anclas mixtas completas.
- [x] Crear correspondencias verificadas contra JSONL/PDF y vincular cada contenido adaptable a consignas pertinentes; no confundir inventario con conexión.

### 2. Contratos y conexión

- [x] Escribir primero contratos de funciones/medios/estructuras/estrategias, breves y desarrollados, fuentes pertinentes, contextos negativos, título incompatible, alternativas, negaciones, recursos y acciones independientes. Cuatro formatos,20/17.35/puntos pendientes/grupo cuando corresponda. Observar RED de falta de proveedor optativo.
- [x] Conectar el ámbito con guard secundario4/academic-general/HLM/código exacto. Reutilizar funciones inglesas cotejadas y remapear namespace; conservar interfaces comunes. Añadir cambios compartidos solo con regresión RED→GREEN. Probar específicamente oral+escrito, modo receptivo frente a productivo y consultas de repetición/clarificación.
- [x] Añadir metadata de catálogo127 y lookup congelado126. Capturar manifest desde fuente final; compilados yDB permanecen126 hasta los gates. Preservar exactamente definiciones comunes y436HLM6/272HLM5/288HLM4 ya leídas; incorporar el alias5 sin reescribir evidencia125.

### 3. Instrumentos y revisión

- [x] Generar ejemplos completos con los cuatro formateadores existentes. Leer textos, cinco niveles, pesos/unidades y correspondencias de cada consigna; hashes y pendientes explícitos. No declarar calidad por filas, HTTP200 o tests.
- [x] Corregir hallazgos con RED→GREEN y releer los cambios. Excluir requisitos privados, de publicación/contacto externo, productos alternativos simultáneos o destreza nativa.

### 4. Desarrollo real y cierre

- [x] Detener solo Worker propio trasCIM. Backendtest/build, frontendactivities/build, sharedbuild, cloudflare:build dry-run, lints, fuente/inventario y precaché. Corregir causa de fallos sin subir límites/timeouts. No generarPrisma ni dist mientras instaladores/HTTP estén activos.
- [x] Arrancar compilados nuevos; guard efectivo de PG/Auth/Storage/frontend/assets exclusivamenteDevelopment. Instalar127 y fuente individual revisada con idempotencia e historial preservado; no dbpush/reset/esquema remoto.
- [x] HTTP/DB autenticado con cuatro formatos/20/17.35, selección manual, fuente/exclusiones, paridad, guardado/reapertura y estrategia sola exacta, tiempos y huellas. Conservar progreso ante fallos sin duplicar datos.
- [x] Navegador personal si hay sesión. Si pide contraseña, registrar limitación y pasos manuales; no enlaces, credenciales, tokens ni limpiezas. QA no sustituye la prueba personal.
- [x] Informe/continuación/inventario fieles al estado real; revisión propia separada sin subagentes, auditoría de secretos/UTF8/diff, commit local español y siguiente ámbito autónomamente. Push retenido.

Pre-flight: los consumidores de recomendaciones necesitan contexto y prefijos correctos del mismo proveedor; la fuente/QA/HTTP necesitan la matriz revisada y catálogo compilado coincidente. El instalador no acepta un manifest viejo. No hay permiso para reconstruir datos ni resolver un bloqueo de autenticación mediante cambios de cuenta.

Estado final técnico: ver informe y evidencia personal en contextoQA separado; listado de Actividades con timeout documentado. Auditoría UTF8/secretos/diff completada; commit local de cierre, sin push, antes de continuar5.
