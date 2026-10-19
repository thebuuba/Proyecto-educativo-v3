# Apreciación de la Literatura Anglófona de 5.º HLM

Bloque verificado sobre b02c680c463d23e6c6434e6165eac2181f8ebaff, en ampliacion-de-instrumentos-2. Exclusivamente AulaBase Development (eolgunypmtgrsyrjzcld). El usuario mantiene los pushes retenidos hasta revisar las integraciones con acceso403. Sin producción, main, merge, despliegue, cambios de integraciones, migraciones de esquema, reset, borrados, cuentas nuevas ni subagentes.

## Fuente y alcance

OPT-HLM-ING-5: secundaria5, ciclo2, modalidad académica o general, salida Humanidades y Lenguas Modernas. Scope95d4757b-5e0a-5821-af62-37d031ccf922; PDF450–455/impresas449–454, revisadas visualmente completas. Se clasificaron individualmente170C/P/A de205registros:114adaptables (78C/34P/2A) y56exclusiones (35ejemplos/5encabezados/7disposiciones privadas/9contextos condicionados). Las continuaciones y anclas mixtas conservan sus literales. Las70coincidencias normalizadas con Inglés común5 no se utilizaron como prueba de conexión; se revisaron también las100noexactas y los21indicadores185–205.

El módulo cubre funciones inglesas solicitadas y literatura sencilla: idea general y detalles, personajes/ambiente/acontecimientos pedidos, estructura básica, sentido literal o figurado, reconocimiento/efecto/uso de figuras con apoyo, punto de vista y razones vinculados al texto. Sin canon, autor, época, interpretación única, talento, creencias, intimidad, acento nativo o perfección obligatorios. Se admiten casos ficticios y simulaciones; el vocabulario médico no prescribe ni ejecuta procedimientos.

La fuente llama «Condicional mixto» a if + cláusula condicional + modal principal. Se conserva el literal y se describe la relación condición/resultado de sus ejemplos; no se impone mezclar tiempos por ese rótulo.

## Implementación y hallazgos

Registro optativo explícito4/5 en secondary-optative-english.ts, con guard de código, grado, ciclo cuando existe, modalidad y salida; namespace propio. Nuevo secondary-optative-english-literature.ts para evidencias literarias básicas, reutilizando funciones, medios y formatos compartidos. Motor, traza y alternativa local resuelven el módulo correspondiente sin asumir siempre4. Catálogo128;127 congelado una sola vez contraDB. Además del módulo y versión,128 registra el matcher de cortesía corregido en las listas4/5/6. Los catálogos anteriores no se reescriben.

RED inicial:208fallos backend y208frontend por proveedor ausente. Regresiones demostraron y corrigieron: imperativos Analicen/Expliquen y sus negaciones; acciones independientes; elementos narrativos incidentales o nombrados como vocabulario; alternativas OR frente a solicitudes conjuntas; oraciones/preguntas independientes sin cohesión de discurso largo; avisos redundantes ante prohibiciones; pedir consejo sin exigir darlo; intercambio duplicado; gramática que arrastraba consultas médicas/compras no pedidas; adverbios de frecuencia confundidos con escala de observación; compartir confundido con comparar; medioambiente confundido con ambiente narrativo; elipsis de ideas principales/secundarias; reflexivo enfático confundido con acción reflexiva. Se mantuvieron controles positivos de contextos reales de la consigna, frecuencia de observación y solicitudes conjuntas.

El cotejo separa idea principal/secundarias cuando ambas se piden y conserva una alternativa ante OR. Solicitar ayuda durante la escucha no exige además identificar fórmulas de ayuda en el audio. No se modifica la UI, el diseño vertical, los cuatro selectores, los puntos pendientes ni la preparación silenciosa.

## Instrumentos y conservación

550consignas y2.200instrumentos completos de cuatro formatos leídos y registrados por huella,0pendientes:413textos exactos,176recetas completas,87vectores y26paquetes numéricos, una escala de grado y cinco cotejos específicos leídos completos. Se revisaron criterios, niveles, pesos, puntos y correspondencias, incluidos21cambios finales por contenido. [Revisión completa](../../curriculum/cobertura-secundaria/optative-hlm-ing-5-revision-instrumentos.json).

Comparación inmutable de15.176definiciones inglesas comunes contra127:14.922idénticas y254correcciones documentadas en2/4/5/6. Se comprobó que el bundle comparado corresponde exactamente al código final. Las1.532definiciones de InglésHLM4 y todas las verificadas de HLM-LEN4/5/6, Sociales, Artística, EFI y FHR se conservan exactamente. Source=compiled y frozen127=DB. Menores editoriales diferidos: contracciones, repeticiones compartidas y artículos en consignas QA; sin requisitos añadidos. Una combinación no probada no hereda esta verificación.

## Comprobaciones finales

Backend completo:72.047pruebas/166archivos,0fallos. Frontendactivities:72.339/103archivos,0fallos; no se presenta como suite completa de todo el frontend. Checkpoints previos fallaron96aserciones de contexto y6de cotejo dividido; se corrigieron las comprobaciones a la situación explícita y se repitió la suite completa. Shared, backend, frontend y pnpm cloudflare:build finalizaron0; Cloudflare fue dry-run. Lints0errores/16advertencias previas. Fuente, inventario y precaché:23pruebas,0fallos.71JS, todos precargados; máximo2.062.992bytes<2MiB. No se elevaron límites ni timeouts.

Worker128 recompilado: PostgreSQL app_backend_local sinBYPASSRLS, Auth200, Storage200 y variables públicas exclusivamenteDevelopment. Entry /assets/index-BMB5l9HX.js, SHA2565c269f1c7af8a106bcfc690233b14d149fb6ab7b82113e4974e72b89e6c7df07. Assets y service worker coinciden con el build; recarga normal observó el entry y registerSW.js, sin limpiar caché, almacenamiento o borradores. No se enviaron correos ni introdujeron credenciales/tokens.

Catálogo128 instalado CREATED/UNCHANGED. Fuente individual MINERD_SECUNDARIA_2023_OPT_HLM_ING_5_V1 publicada CREATED/UNCHANGED: versión95c000d9-5440-58f7-a1a4-890370516b16, scopeimport30fbb17f-f59e-5009-8d1b-c9c9d71b44b0,205elementos/56exclusiones, literales y spans exactos. QA reutiliza contexto ficticio existente,0cuentas nuevas.

## HTTP y navegador personal

28muestras HTTP autenticadas únicas: cuatro formatos (7cada uno),20/17.35, fuente correcta, excluidos400, paridad local, edición manual, guardado/reapertura y cambio exclusivo de estrategia conservando exactamente instrumento y snapshot. Incluyen funciones comunicativas, solicitudes gramaticales sin contexto impuesto, análisis literario pedido, alternativas e ideas principal/secundarias. GROUP se comprobó en contratos; HTTPindividual. Las pruebas de puntos pendientes se realizan antes de asignarlos, no mediante un guardado inválido. Medianas exitosas: interpretación5128ms, recomendación5087ms y escrituras4345ms; no son comparación causal con otro grado. [Evidencia HTTP/DB](../../curriculum/cobertura-secundaria/optative-hlm-ing-5-verificacion-http.json).

El primer intento agotó30s en interpretación, antes de escrituras. El servidor terminó500tras224.564ms con «Connection terminated unexpectedly» de PostgreSQL. La consulta posterior confirmó0actividades de este ámbito QA y ninguna consulta activa. La misma selección/checkpoint completó después las28muestras sin duplicados. No se confirmó si el origen fue red, servidor o pool; ese incidente no se declara corregido.

Con la sesión personal activa se agregó idempotentemente un curso QA específico de5.º separado en su misma escuela, autorizado por la sección10 del encargo.0usuarios/0estudiantes nuevos; cursos, cuentas y filas originales conservados. La optativa genérica original no se alteró. El creador vacío abrió sin error con controles verticales y puntos vacíos. La lectura breve produjo cotejo automático completo de una evidencia. Añadir diálogo y simulación entre lectores produjo Interacción oral, Simulación automática y rúbrica completa de cuatro criterios. Se inspeccionaron los cuatro formatos, ponderada100%,17.35→20→17.35, selección manual y criterio editado. Guardado y reapertura mediante Editar del listado conservaron los datos. Cambiar únicamente a Estudio de caso manual, guardar y recargar mantuvo exactamente instrumento, snapshot y hash e859dcde1a41bf71721292d06d92937c. Actividad5ba83b92-b3f3-4bb5-8f97-1848a48104be. [Evidencia de navegador](../../curriculum/cobertura-secundaria/optative-hlm-ing-5-verificacion-navegador.json).

Esta vez el listado cargó y permitió Editar. Los timeouts anteriores siguen documentados y no se presentan como resueltos. La prueba usa el curso QA específico dentro de la cuenta personal; no acredita cobertura de la asignación genérica sin contexto ni todas las combinaciones posibles.

Historia:60releases/543snapshots previos exactamente conservados; final61/572 (+28QA y1personal). Cambio de estrategia:0snapshots adicionales. Lecturas simples confirman intactas las muestras personalesFHR1 e InglésHLM4 y sus huellas.

## Cierre y continuación

Revisión propia de código conectado y diff, sin subagentes. Auditoría final UTF8, secretos, archivos privados ignorados y gitdiff--check antes del commit local español. Rama ampliacion-de-instrumentos-2:35commits por delante/0detrás antes de este cierre según referencias disponibles; sin fetch ni push. El hash real se consulta después del commit. Builds, previews y despliegues son hechos distintos: esta intervención solo realizó builds locales y dry-run, sin modificar integraciones ni verificar de nuevo el acceso403.

Cinco optativas académicas cuentan con evidencia representativa; quedan13académicas y las modalidades especializadas. Continúa Análisis Crítico y Evaluación de Textos en Inglés6; no se declara completo el encargo integral.
