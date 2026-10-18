# Educación Física de 3.º: bloque representativo verificado

Se conectó Educación Física común de 3.º de secundaria y se verificó en AulaBase Development, proyecto eolgunypmtgrsyrjzcld, catálogo evaluation-2026.114. Rama ampliacion-de-instrumentos-2. Commit local español; push pendiente por instrucción del usuario hasta revisar las integraciones de despliegue. Sin producción, Hyperdrive, cambios de secretos o permisos, despliegues, merge, migraciones de esquema, cuentas nuevas, resets, borrados ni subagentes.

## Fuente y alcance

[Notas de fuente](2026-10-18-educacion-fisica-3-fuente-notas.md), [matriz](../../curriculum/cobertura-secundaria/physical-3-matriz.json) e [instrumentos completos](../../curriculum/cobertura-secundaria/physical-3-instrumentos.json). MINERD2023, PDF365–367/impresas364–366, SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Se leyeron visualmente las tres páginas completas:20 conceptos,30 procedimientos,10 actitudes,21 indicadores y14 competencias.37 filas C/P útiles mapeadas;13 encabezados y una disposición interna excluidos. Se conservaron continuaciones, filas compuestas y roles observables, sin calificar perseverancia privada.

52 temas,72 contratos específicos y52 explicaciones breves:124 consignas representativas y496 instrumentos de cuatro formatos, todos leídos completos, con496 huellas coincidentes. Se revisaron criterios, progresiones, puntos y crédito parcial ponderado. Acreditan variantes representativas, no todas las combinaciones posibles ni una clase física ejecutada. Las adaptaciones de AulaBase permanecen separadas del literal oficial.

## Cambios y causas corregidas

Se reutilizaron secondary-physical.ts y el formateador existente con metadata secondary-physical-grade-3.ts. Se añadieron contratos backend/frontend, catálogo114 y congelado113, correspondencias, artefactos y soporte explícito de grado3 en los runners existentes. No hay otro motor, dependencias nuevas ni cambios de interfaz.

Las pruebas rojas reprodujeron la ausencia del grado, verbos no reconocidos, capacidades omitidas, reglas de contexto convertidas en criterios extra, recursos no pedidos, alternativas convertidas en requisitos acumulados y evidencia de práctica aplicada a planes/productos. Se corrigieron por separado. La primera ampliación de verbos confundió el sustantivo recepción con una acción:16 regresiones previas se corrigieron usando verbos completos. Los nuevos focales finales aprobaron2051 pruebas en tres archivos.

Las consignas conservan la variante elegida de voleibol, fútbol, aperturas de ajedrez y raqueta; dirección, distancia, recursos de orientación y modalidades explícitas. El esquema de apertura es un producto con análisis de producciones; jugar/reproducir sigue siendo práctica. Las progresiones motoras gradúan acciones y continuidad; las conceptuales gradúan relaciones y evidencias. No se imponen dosis, dietas, diagnósticos, datos privados, excursiones o maniobras peligrosas. No se califican apariencia, capacidad natural, discapacidad, fe, identidad, emociones o personalidad.

## Development e historia

Fuente MINERD_SECUNDARIA_2023_EFI_COMUN_G3_V1, versión b8719e1e-6c63-5b3e-a78b-89d2f51e8a98, CREATED/UNCHANGED:95 elementos y14 exclusiones. Catálogo114: CREATED/UNCHANGED, con fuente, manifiesto, compilado y payload instalado coincidentes. Frozen113 se creó una vez y se cotejó READ ONLY. Los campos anteriores y todos los instrumentos completos de EFI1(540),EFI2(532),Sociales1–6 y Artística1–6, incluidos niveles, permanecen exactos.

Historia: 46 catálogos/351 snapshots anteriores intactos; 47/364 finales,12 muestras QA HTTP y una personal. Cambiar solo estrategia no creó snapshot. Se reutilizó el contexto QA ficticio de tercero, sin notas o copia de datos/cuentas de producción.

PostgreSQL app_backend_local sin BYPASSRLS, Auth y Storage200 y variables públicas exclusivamente Development. Asset /assets/index-OeU1W1Ug.js, SHA-256 bae89eb1753053061c90915c9e8d956c9df8ff3f8f2c1576b0ba3a13d28f216f: assets y sw.js coinciden con dist. El DOM personal confirmó script actual/registerSW.js. No se inspeccionaron internals del SW ni se borraron caché, almacenamiento o borradores. La incidencia DNS anterior no se declara solucionada definitivamente.

## Pruebas y límites

- Backend completo: 54369 pruebas/152 archivos, cero fallos.
- Frontend afectado: 4799 pruebas/15 archivos, cero fallos; incluye currículo, servicios, creador, estrategias y tarea natural. No toda la suite frontend.
- Builds shared/backend/frontend y pnpm cloudflare:build finales aprobados. Cloudflare fue dry-run, sin despliegue. Lint0 errores/16 advertencias previas y9 pruebas de inventario aprobadas. No se cambió código de aplicación después.
- [HTTP/DB](../../curriculum/cobertura-secundaria/physical-3-verificacion-http.json):12 muestras, cuatro formatos,20/17.35 puntos, puntuación pendiente, paridad local/servidor, manuales, guardado/reapertura y estrategia sola exactos; referente excluido400 esperado. Medianas locales interpretar6347ms,recomendar5940ms,escrituras4224ms; no garantía de rendimiento.
- [Navegador personal](../../curriculum/cobertura-secundaria/physical-3-verificacion-navegador-evaluation-2026.114.json):3.ºA secundaria/EFI/b1, título y descripción, estrategia visible/puntos vacíos, CASE_STUDY automático, rúbrica completa leída, lista de cotejo manual completa con17.35 y texto manual. Guardado, reapertura, solo estrategia PROJECT_BASED/MANUAL, segundo guardado y reapertura final. Esta elección manual comprueba persistencia, no recomendación pedagógica. Una plantilla vacía transitoria se completó correctamente; no se atribuye un fallo persistente ni un arreglo nuevo.

Actividad personal 2502dff3-9c94-4283-b576-7f1b3cb41369, instrumento 7aaa53ef-e45e-4a57-9114-1e0dca49a07d, snapshot 02a3adf4-0fbb-4ddb-a91b-88d64a74238c, huella READ ONLY 259a35da955f28b6ee75ee8794050e74 idéntica antes/después de cambiar estrategia. Baseline creado una vez: no sobrescribirlo. Sin correos, contraseñas, equipos nuevos o notas. Persisten los límites documentados de Actividades global/Ver actividad; no se acredita restauración automática de todos los borradores.

Revisión propia del diff, UTF-8 y exclusión de secretos/respaldos/credenciales QA antes del commit. Menor independencia que una revisión por otra persona; sin subagentes por instrucción del usuario. Mensaje de commit «Amplía Educación Física de tercero y verifica sus instrumentos»; consultar git log para su hash. Sin push, preview o despliegue acreditados. Los403 anteriores impiden verificar los triggers; un build no prueba actualización de producción.

Pendientes reales del encargo: EFI4–6, Formación Integral Humana y Religiosa, optativas/modalidades según fuentes oficiales y cierre consolidado, incluidas comprobaciones personales de Sociales1/2/4/5. FuenteEFI4 PDF374–376 ya leída visualmente y anotada; solo preparación. Tras guardar este bloque, congelar114 una sola vez por lectura contra Development y continuar. El encargo integral permanece abierto.
