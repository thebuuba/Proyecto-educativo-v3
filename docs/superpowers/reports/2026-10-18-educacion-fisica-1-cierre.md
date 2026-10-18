# Educación Física de 1.º: bloque representativo verificado

El catálogo 'evaluation-2026.112' está conectado, instalado y verificado exclusivamente en AulaBase Development ('eolgunypmtgrsyrjzcld'). Rama 'ampliacion-de-instrumentos-2'; commit local español, sin push hasta revisar las integraciones. No se modificó producción, su Hyperdrive, secretos, cuentas o integraciones; no hubo despliegue, merge, reset, migración de esquema, borrados ni subagentes.

## Fuente y cobertura comprobada

[Nota de fuente](2026-10-18-educacion-fisica-1-fuente-notas.md), [matriz](../../curriculum/cobertura-secundaria/physical-1-matriz.json) e [instrumentos completos](../../curriculum/cobertura-secundaria/physical-1-instrumentos.json). Se leyeron visualmente las páginas PDF 359–361, impresas 358–360, del documento MINERD 2023. Su SHA-256 figura en la matriz.

Son 113 registros: 26 conceptos, 42 procedimientos, 10 actitudes, 21 indicadores y 14 competencias. Se mapearon 49 filas útiles C/P y se justificaron 24 exclusiones: 19 encabezados, tres disposiciones de disfrute y dos de perseverancia interna. Los deportes llamados optativos dentro de EFI pertenecen a esta asignatura; no son salidas académicas adicionales.

Se conectaron 50 temas y 85 contratos específicos, más 50 explicaciones breves. Los 540 instrumentos completos de cuatro formatos se leyeron y registraron con huellas coincidentes, incluyendo progresiones, puntuación y parcial ponderado. Esto acredita ejemplos representativos; no todas las variantes de filas compuestas ni una clase física ejecutada. Los criterios son adaptaciones de AulaBase, separados del literal oficial. No se añaden dosis, dietas, diagnósticos o instrucciones de maniobras peligrosas, ni se puntúan capacidad natural, discapacidad, cuerpo o intimidad.

## Cambios y causas corregidas

Se reutilizó el formateador de cuatro instrumentos y el tipo motriz existente. El nuevo proveedor distingue análisis, planificación, ejecución adaptada, registro, comparación y observación. Las regresiones reprodujeron antes de corregir las confusiones entre esos propósitos, capacidades concretas, explicaciones breves, negaciones y alternativas elegidas. Las frecuencias separan calentamiento general/específico, propuestas/acuerdos y materiales/espacio; «Nunca» se distingue de falta de registro.

La revisión final detectó 16 fallos: «Crea un plan…» se clasificaba como práctica motriz y podía exigir ejecución prematura. Se ajustó una condición y se agregaron dos contratos; sus ocho instrumentos se leyeron y los 532 anteriores conservaron sus huellas. También se corrigió el espaciado de «baloncesto 3x3».

En la prueba personal se sospechó bloqueo al confirmar ponderada y escribir puntos inmediatamente. La respuesta válida terminó llegando: las filas vacías fueron transitorias y no se acreditó un fallo persistente. No se añadió un arreglo para esa hipótesis. Se ampliaron las pruebas a escala, cotejo y ponderada, puntuación inicial vacía/20 y respuesta/error tardíos, incluyendo esta consigna EFI: 44 casos aprobados. Se mantienen preparación silenciosa, selecciones manuales y puntuación inicialmente vacía.

Archivos principales:

- Compartido: 'secondary-physical.ts', 'secondary-physical-grade-1.ts' e 'index.ts'.
- Backend: catálogo actual, congelado 111, interpretación, recomendación y contratos de EFI.
- Frontend: preparación, sugerencias, contratos y 'ActivityPreparationRace.spec.tsx'.
- Datos, scripts y documentación: contratos EFI, generador de artefactos, runner HTTP, instalador histórico, inventario maestro y evidencias 'physical-1'.

## Development y conservación de datos

Fuente 'MINERD_SECUNDARIA_2023_EFI_COMUN_G1_V1', versión 'd4619f25-802b-50d7-baae-6dcb21ba0728': CREATED/UNCHANGED, 113 elementos y 24 exclusiones. Catálogo 112: CREATED/UNCHANGED; fuente, manifiesto, compilado y payload instalado coinciden. El congelado 111 se creó una sola vez y se cotejó con la base. Solo cambian 'physicalCommonModules' y versión; se conservaron exactos los instrumentos completos de Sociales y Artística de 1.º–6.º.

Las 44 publicaciones y los 325 snapshots anteriores permanecen idénticos. Resultado: 45 publicaciones y 338 snapshots, con 12 muestras QA y una personal. Cambiar solo la estrategia no creó otro snapshot. Se reutilizó el centro y curso ficticios QA, sin nuevas cuentas ni copia de producción. La muestra personal está identificada como QA, sin notas; la actividad anterior de Artística de 6.º también conserva su huella.

El guard confirmó PostgreSQL con 'app_backend_local' sin BYPASSRLS, Auth y Storage HTTP 200 y frontend exclusivo de Development. Asset '/assets/index-ItJ7hWjJ.js', SHA '6e58c649e4569c28a801971fefa27b3da5e83e44f0221c186b44641011903e90': igual a dist; también coincide 'sw.js'. El asset no contiene referencia de producción ni clave de servicio. El DOM confirmó script actual y 'registerSW.js'. No se inspeccionaron internals del SW ni se borraron almacenamiento, caché o borradores.

## Verificaciones y límites

- Backend completo: **53.048 pruebas / 150 archivos**, cero fallos.
- Frontend curricular afectado: **3.247 / 8 archivos**; creador, estrategia y tarea natural: **334 / 5 archivos**, cero fallos. No es toda la suite frontend ni una suma de casos únicos del repositorio.
- Builds de shared, backend, frontend y 'pnpm cloudflare:build' finales aprobados. Este último terminó en '--dry-run: exiting now.', sin despliegue. Lint sin errores; 16 advertencias previas de frontend. Nueve pruebas del inventario aprobadas.
- Incidencias resueltas: importación sin uso en el primer build; opción de reporte no admitida en la primera invocación de tests; EPERM al reemplazar una DLL de Prisma mientras el instalador la tenía cargada. Se esperó a que terminara y se repitió el build correctamente. Los Workers propios se detuvieron comprobando PID/comando antes de escribir dist.
- [HTTP/DB](../../curriculum/cobertura-secundaria/physical-1-verificacion-http.json): 12 muestras, cuatro formatos, 20/17,35 puntos, alternativa local igual al servidor, texto manual, guardado, reapertura y estrategia sola exacta; referente excluido rechazado con 400. Medianas locales: interpretar 5476 ms, recomendar 5947 ms y escribir 4095 ms. No son garantías de rendimiento.
- [Cuenta personal en navegador](../../curriculum/cobertura-secundaria/physical-1-verificacion-navegador-evaluation-2026.112.json): Cursos → 1.º A de secundaria → EFI → bloque 1; título y descripción, estrategia AUTO CASE_STUDY visible, rúbrica completa, ponderada manual con 17,35 puntos y texto manual, guardado y reapertura. Después, solo estrategia a PROJECT_BASED MANUAL, guardado y reapertura final. Esa selección manual prueba persistencia, no recomendación pedagógica.

Actividad '61873ab8-285a-4dc0-afe0-ba1ebe5d814c'; instrumento '8608575c-a78f-44ed-a5dc-8a85c772d31b'; snapshot '0901db42-77cd-4801-a282-2afb83f93a15'. Huella READ ONLY antes/después: '210d7e00086fde14844d779fab32e303'. El baseline se creó una sola vez. Persisten límites previos de Actividades global/Ver actividad; no se acredita restauración automática de todos los borradores ni ejecución física real.

Revisión propia sin subagentes, con menor independencia que una revisión por otra persona. La auditoría final de archivos públicos no encontró credenciales; env locales, respaldos, sesiones y QA permanecen excluidos de Git. Commit identificable por «Amplía Educación Física de primero y verifica sus instrumentos»; consultar git log para el hash.

El encargo integral sigue abierto. Continúan EFI de 2.º–6.º, FHR y optativas/modalidades según fuentes reales, además de pendientes consolidados. La fuente EFI de 2.º ya está leída; es preparación, sin proveedor ni catálogo nuevo. Congelar 112 una sola vez después del commit antes de ampliar el siguiente. Push pendiente; no cambiar integraciones.
