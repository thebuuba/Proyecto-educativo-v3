# Educación Física de 2.º: bloque representativo verificado

Se conectó y verificó Educación Física común de 2.º de secundaria en AulaBase Development, proyecto eolgunypmtgrsyrjzcld, catálogo evaluation-2026.113. Rama ampliacion-de-instrumentos-2; commit local español y push pendiente hasta revisar las integraciones de despliegue, por instrucción del usuario. No se modificaron producción, Hyperdrive, secretos, cuentas, permisos o integraciones. No hubo despliegue, merge, reset, migraciones de esquema, borrados ni subagentes.

## Fuente y alcance

[Notas de fuente](2026-10-18-educacion-fisica-2-fuente-notas.md), [matriz](../../curriculum/cobertura-secundaria/physical-2-matriz.json) e [instrumentos completos](../../curriculum/cobertura-secundaria/physical-2-instrumentos.json). PDF 362–364, impresas 361–363, SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Tres páginas leídas visualmente completas: 19 conceptos, seis filas procedimentales con 19 acciones agrupadas, 10 actitudes, 21 indicadores y 14 competencias.

Se mapearon 15 filas útiles C/P: diez conceptos y cinco procedimientos. Se excluyeron nueve encabezados conceptuales, uno procedimental y dos disposiciones internas. Se conservan las filas compuestas con desempeños y las orientaciones duplicadas no crean criterios duplicados. Los deportes optativos internos de EFI no equivalen a salidas académicas.

53 temas y 80 contratos específicos más 53 explicaciones breves: 133 consignas y 532 instrumentos de cuatro formatos, todos leídos completos con 532 huellas coincidentes. Se revisaron filas, progresiones, puntos y el parcial ponderado. Son adaptaciones de AulaBase separadas del literal oficial. Esto acredita ejemplos representativos, no todas las combinaciones curriculares ni una clase física ejecutada.

## Cambios y correcciones

Se reutiliza el proveedor secondary-physical.ts con metadata secondary-physical-grade-2.ts y el formateador existente. Las regresiones reprodujeron, antes de corregir, ausencia del grado, verbos motrices no reconocidos, negación incorrecta de «no convencional», solapamiento de orientación general con brújula/GPS, modalidades no pedidas, alimentación convertida en alternativa de hidratación, explicación convertida en verificación y ficción impuesta al contexto real o no especificado.

La selección conserva las modalidades de béisbol/softbol, rolling/flay, lanzador de frente/lado, peones, posiciones defensivas, alimentación/descanso, modelo de alojamiento y caminata/carrera. Se separan preparación general/específica, materiales/espacio y propuestas/acuerdos; «Nunca» sigue distinto de falta de registro. Se corrigieron contracciones y repeticiones en la redacción de progresiones. No se añadieron campos duplicados, banners de preparación ni puntuación predeterminada.

No se generan dosis, dietas personales, diagnósticos, datos privados, excursiones nuevas o instrucciones peligrosas. Las condiciones, supervisión y apoyos son los proporcionados. No se puntúan capacidad natural, apariencia, discapacidad, fe, identidad, emociones o personalidad.

Archivos principales: packages/shared/src/secondary-physical.ts y secondary-physical-grade-2.ts; backend catalog-current.ts/catalog-v112.ts y contratos; contratos frontend; data/evaluation-instruments/physical-grade-two-contracts.json; scripts art-artifacts.mjs, social-http.mjs e install-current-development.mjs; matriz, correspondencias, revisión, evidencias e inventario maestro.

## Development y preservación

El congelado 112 se creó una sola vez tras el commit anterior y se cotejó READ ONLY con la base instalada. Solo cambian physicalCommonModules y version; el módulo físico anterior permanece exacto. Se volvieron a comparar completos los 540 instrumentos de EFI de 1.º, Sociales de 1.º–6.º y Artística de 1.º–6.º, incluidos sus niveles.

Fuente MINERD_SECUNDARIA_2023_EFI_COMUN_G2_V1, versión a942e45b-ce6c-51da-8a50-757336d4fc02: CREATED/UNCHANGED, 70 elementos y 12 exclusiones. Catálogo 113: CREATED/UNCHANGED; fuente, manifiesto, compilado y payload instalado coinciden. Historia anterior: 45 catálogos y 338 snapshots exactos. Final: 46 catálogos y 351 snapshots, con 12 muestras QA y una personal; el cambio exclusivo de estrategia no creó otro snapshot. Se reutilizó el centro/curso ficticio QA de segundo sin nuevas cuentas, copia de producción ni notas.

Worker único launcher 4776, comando local registrado en checkpoint privado. PostgreSQL usa app_backend_local sin BYPASSRLS; Auth/Storage respondieron 200 y las variables públicas son exclusivamente Development. Asset /assets/index-DgLpND5i.js, SHA-256 418324b4a53bae6d8d3209c9e6a90a588411188c662f7f62c397d1c3d6b352fe; assets y sw.js coinciden con dist. Referencia de producción y clave de servicio ausentes del asset. El DOM personal confirmó script actual y registerSW.js. No se inspeccionaron internals del SW ni se borraron almacenamiento, caché o borradores.

## Verificación y límites

- Backend completo: 53.741 pruebas en 151 archivos, cero fallos.
- Frontend afectado curricular: 3.888 pruebas en nueve archivos. Creador, estrategias y tarea natural: 334 en cinco archivos, cero fallos. No se ejecutó toda la suite frontend; los conjuntos no se suman como casos únicos de todo el repositorio.
- Builds shared, backend, frontend y pnpm cloudflare:build finales aprobados. Cloudflare terminó en dry-run; no despliegue. Lint: cero errores y 16 advertencias previas del frontend. Nueve pruebas de inventario aprobadas.
- [HTTP/DB](../../curriculum/cobertura-secundaria/physical-2-verificacion-http.json): 12 muestras explícitas, cuatro formatos y 20/17.35 puntos; paridad local/servidor, puntos pendientes, texto manual, guardado/reapertura y estrategia sola exactos. Referente excluido: HTTP 400 esperado. Medianas locales: interpretar 5455 ms, recomendar 6617 ms y escrituras 4555 ms; no son una garantía de rendimiento.
- [Navegador personal](../../curriculum/cobertura-secundaria/physical-2-verificacion-navegador-evaluation-2026.113.json): Cursos/2.º A secundaria/EFI/b1. Título y descripción, estrategia visible CASE_STUDY automática, rúbrica completa leída, selección manual de escala y 17.35 puntos, texto manual, guardado y reapertura. Cambio exclusivo a PROJECT_BASED/MANUAL, guardado y reapertura final con instrumento exacto. La selección manual prueba persistencia, no recomendación pedagógica. Una muestra personal y doce HTTP no acreditan todas las combinaciones.

Actividad personal 901878f1-ad63-4cd9-bf92-4c65a27b6e06; instrumento 883246b0-fcb0-472b-9d03-c6b960240b0c; snapshot a3431d92-689b-48b3-8c1f-cd37f2d3fe86; huella READ ONLY 2f773e4d45ce6ad0ff9738a9e5731c93, exacta antes y después del cambio de estrategia. El baseline se creó una vez y no debe sobrescribirse. Se conserva la muestra anterior de EFI de 1.º. No correos ni cambios de contraseña. Persisten los límites documentados de Actividades global/Ver actividad; no se acredita restauración automática de todos los borradores.

Al confirmar escala y escribir puntos inmediatamente apareció una plantilla temporal de cinco filas vacías. Tras terminar la respuesta HTTP, quedó un indicador completo con cuatro niveles y 17,35 puntos. Se comprobó su finalización; no se acreditó un bloqueo persistente ni se añadió un arreglo de interfaz para esa hipótesis.

Revisión final propia, sin subagentes por instrucción del usuario; menos independiente que la de otra persona. Diff, exclusión de secretos y UTF-8 revisados antes del commit. Env locales, respaldos, sesiones y credenciales QA siguen ignorados. Commit del bloque: «Amplía Educación Física de segundo y verifica sus instrumentos»; consultar git log para el hash. No push.

Siguiente: Educación Física de 3.º–6.º, Formación Integral Humana y Religiosa, optativas/modalidades y cierre consolidado, incluidos pendientes personales de Sociales. El encargo integral sigue abierto. No ampliar el proveedor del grado siguiente antes de guardar este cierre y congelar 113 una sola vez contra Development.
