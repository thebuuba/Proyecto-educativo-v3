# Apreciación y Producción Literarias de 4.º, Humanidades y Lenguas Modernas

> Ejecutar individualmente con executing-plans y TDD, después del commit de FHR de 6.º. El usuario autoriza continuidad sin preguntas rutinarias y prohíbe subagentes.

**Objetivo:** conectar la primera optativa académica con contexto explícito y criterios pertinentes para poesía romántica y novela de viajes y aventuras.

**Arquitectura:** reutilizar composición de criterios, procedimientos de lectura/escritura, rasgos lingüísticos y formateadores existentes. Añadir metadata y un adaptador de contexto optativo compartido por motor, sugerencias y alternativa local. No habilitar por coincidencia de palabra «novela» en cualquier asignatura ni copiar la cobertura común como evidencia optativa.

**Stack:** TypeScript, Nest, React, Vitest y pnpm existentes; sin dependencias nuevas. Especificación: [encargo integral](../specs/2026-10-17-secundaria-pendiente-encargo.md).

## Límites

Development eolgunypmtgrsyrjzcld exclusivamente. Rama actual; commits locales españoles; push retenido. Sin main, producción, despliegues, resets, borrados, migraciones remotas, cambios de permisos/integraciones, cuentas nuevas o IA. Conservar datos, puntos pendientes, selección manual, preparación silenciosa e historia inmutable.

Fuente MINERD 2023, SHA 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. PDF427–431 / impresas426–430 ya leídas visualmente completas. Scope d619d96a-6e30-5201-8264-3bc09502e53e:115 registros39C/28P/13A/21I/14competencias. No repetir renders. Clasificación privada de80C/P/A:40contenidos adaptables,12encabezados estructurales,15referencias opcionales,12disposiciones privadas excluidas y1contexto de interacción solo si se pide. El mismo nombre en Humanidades y Ciencias Sociales no acredita su contexto.

## Foco de revisión

- Poesía romántica y novela de viajes/aventuras tienen perfiles distintos; autores, obras y estrofas sugeridos son opciones.
- Escuchar, inferir, parafrasear, resumir, recitar, narrar oralmente, analizar, comparar, planificar, redactar y revisar conservan su evidencia propia. No exigir producción al interpretar un texto dado.
- Solo los recursos, rasgos, entregas, soportes y procesos pedidos. No imponer todas las métricas/rimas/figuras ni grupo, ilustración, publicación real o cuentas.
- Voz, intención y decisiones expresivas son observables; gusto, disfrute, sinceridad, intimidad, talento y empatía privada no se califican.
- Conservar fragmento «título y otras» dePDF430 sin inventar continuación. La extracción de poesía dePDF428 intercala texto entre celdas; atribuir la adaptación a la lectura visual, no presentar una recomposición inferida como cita oficial.
- Contexto optativo exacto, primeros grados rechazados, salida equivocada rechazada, título antiguo incapaz de imponer género y cambios de descripción sin respuesta obsoleta.

## Bloque verificable

- [x] Revisar composeLanguageCriteria, rasgos/procedimientos y detección existentes; comprobar datos efectivos de contexto por frontend/backend y código académico de la optativa. Resolver la identificación de modalidad/salida con evidencia, sin ampliar permisos o esquema.
- [x] Publicar notas, correspondencias y contratos con anclas exactas de40contenidos adaptables, encabezados y referencias conservados. Separar ancla literal, adaptación, referente opcional y disposición privada; no declarar80temas.
- [x] Crear ficheros de contrato backend/frontend y observar RED por contexto optativo ausente. Matriz: géneros y acciones pertinentes, breves, desarrolladas, alternativas/negaciones, recursos, título incompatible, individual/grupo pedido, cuatro formatos y20/17.35/sin puntos. Incluir contextos negativos de salida/grado/asignatura.
- [x] Conectar metadata por ámbito y adaptador mínimo en packages/shared/src; reutilizar composeLanguageCriteria y detectTopicActivity cuando sean compatibles. Añadir export, catálogo, motor, servicio, sugerencias y preparación local. No otro motor de formatos ni cambios globales no demostrados. Si una ayuda común exige un cambio, regresión RED antes de corregirla.
- [x] Revisar instrumentos completos de cada tema/familia: filas, niveles, pesos, unidades y requisitos. Registrar huellas solo tras lectura; corregir defectos con regresión y releer cambios.
- [x] Congelar123 una vez contra payload instalado mediante consulta READONLY, tras comprobar commit6. Nuevo candidato individual124; preservar catálogos e instrumentos anteriores con comparaciones completas. No asumir que un instalador de fuente común admite optativas: revisar su contrato y añadir soporte explícito comprobado, sin fingir salida común.
- [x] Ejecutar backend test/build, frontend afectado/build, cloudflare:build dry-run, lints, inventario y precaché. Detener Worker propio verificado antes de modificar dist; no generarPrisma con instaladores/HTTP/helpers activos.
- [x] Arrancar compilados finales; guard de PostgreSQL/Auth/Storage/variables públicas/assets soloDevelopment antes de cualquier escritura. Instalar124 y la fuente optativa individual/idempotentemente con trazabilidad; conservar baseline histórico protegido.
- [x] Reutilizar QA ficticio existente y contexto optativo real para HTTP/DB: cuatroformatos,20/17.35,puntos pendientes, fuente/exclusiones, paridad local, edición manual, guardar/reabrir y estrategia sola exacta. Medir tiempos; no crear o copiar cuentas ni editar contexto personal para forzar pruebas.
- [ ] Recorrido personal cuando haya sesión: formulario vacío, estrategia, instrumentos, guardar/reabrir e instrumento idéntico al cambiar estrategia. Si requiere contraseña, registrar el bloqueo y pasos manuales sin enviar enlaces ni borrar almacenamiento.
- [x] Informe, matriz, inventario y continuación; revisión propia separada y auditorías de secretos/UTF8/diff; commitlocal español. Continuar con los demás17ámbitos optativos y fuentes de modalidades; no presentar este bloque como cobertura integral.

Decisión de ejecución: aprovechar la composición lingüística existente mediante perfiles fuente específicos. Evita duplicar formateadores y obliga a probar las particularidades optativas. Si el compositor añade requisitos no pedidos o trata toda novela como análisis, corregir por una vía optativa explícita cubierta por regresión, conservando exactamente los instrumentos comunes históricos.

Hallazgo de lectura previo a implementar: curriculum-context.ts ya reconoce OPT-HLM-LEN-4 y exige modalidad académica para resolver la fuente. Sin embargo, GradingService.loadSectionSubjects devuelve nivel/grado pero no modalidad/salida y instrumentAcademicContext.ts reconstruye solo nivel/grado/código/nombre. La conexión optativa necesita una regresión real de propagación de contexto en backend y frontend antes de añadir defaultModality/curriculumContext al select y a SectionSubjectOption. Archivos: apps/backend/src/modules/grading/grading.service.ts, apps/frontend/src/modules/activities/types/index.ts, apps/frontend/src/modules/activities/utils/instrumentAcademicContext.ts y tipo InstrumentAcademicContext de packages/shared/src/secondary-science.ts. No inferir modalidad desde la consigna ni tratar un contexto incompleto como común.

Preparación privada adicional: optative-hlm-apl-four-content-map.json relaciona20conceptos y20procedimientos adaptables con sus anclas, género y familia inicial, sin huérfanos. Los15autores/obras quedan como referentes opcionales. No equivale a40temas conectados o instrumentos revisados; faltan casos por acción y las pruebas de contexto.

Cierre técnico124 con13muestrasHTTP/DB y288instrumentos leídos. Navegador personal bloqueado por autenticación; pasosmanuales eninforme. Pushretenido. Revisión propia sin subagentes; continuar5HLM.
