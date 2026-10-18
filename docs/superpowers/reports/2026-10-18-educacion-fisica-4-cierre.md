# Educación Física de 4.º: bloque representativo verificado

Se conectó y verificó Educación Física común de 4.º de secundaria en AulaBase Development, proyecto eolgunypmtgrsyrjzcld, catálogo evaluation-2026.115. Rama ampliacion-de-instrumentos-2. Commit local español; push pendiente hasta revisar las integraciones, por instrucción del usuario. Sin producción, Hyperdrive, secretos, permisos o integraciones modificados; sin despliegue, main, reset, borrados, esquema, cuentas nuevas o subagentes.

## Fuente e instrumentos

[Notas de fuente](2026-10-18-educacion-fisica-4-fuente-notas.md), [matriz](../../curriculum/cobertura-secundaria/physical-4-matriz.json), [instrumentos completos](../../curriculum/cobertura-secundaria/physical-4-instrumentos.json). MINERD2023, PDF374–376/impresas373–375, SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Tres páginas leídas visualmente completas:115 registros,33C/39P/8A/21I/14competencias.55 registros C/P mapeados, incluidas continuaciones sin criterio independiente;20 exclusiones justificadas. No confundir55 registros con55 desempeños independientes.

49 temas y66 contratos específicos más49 explicaciones breves:115 consignas,460 instrumentos completos de cuatro formatos, todos leídos con460 huellas coincidentes. Se comprobaron progresiones, pesos, totales y crédito parcial ponderado. Son ejemplos representativos, no todas las combinaciones ni una clase física real. La fuente literal y sus anomalías permanecen separadas de las adaptaciones de AulaBase: ventajas de ajedrez bajo GimnasiaGeneral, continuaciones de aparatos/defensa y fragmento huérfano «gimnásticos» conservados sin inventar texto oficial o criterios duplicados.

## Cambios y correcciones demostradas

Se reutilizaron secondary-physical.ts y los formateadores existentes con metadata secondary-physical-grade-4.ts. Se añadieron contratos backend/frontend, catálogo115 y congelado114; correspondencias, artefactos y soporte explícito de grado4 en los runners. No hay otro motor, dependencias nuevas o cambios de interfaz.

Los contratos rojos reprodujeron ausencia del proveedor, reconocimiento incompleto de consignas, capacidades omitidas, selección de reglas como criterio adicional por mencionarlas como contexto, recursos no pedidos y pérdida de variantes. La revisión completa añadió juegos/aparatos y corrigió separación de calentamiento general/específico, flexibilidad activa, altura en equilibrio, pase en silla de ruedas, orientación sin instrumentos y táctica ofensiva frente a defensiva. Se conserva una alternativa elegida de pases/tiros/lanzamientos y de ventajas de ajedrez. Las referencias temporales no imponen nuevas pausas o dosis. Se corrigieron contracciones y redacción sin atribuirles un rojo que no existió. El verbo Valora se reconoce completo; su caso inicial ya pasaba por la justificación posterior, por lo que no se acredita un fallo propio.

Primera suite sin proveedor:0/472; conexión331/187. Intermedios16 regresiones de capacidades/ausencia; juegos/aparatos24 rojos; calentamiento/flexibilidad16; altura8; táctica/pase24; reglas no proporcionadas8; posturas/defensas alternativas16. Todos incluidos en las comprobaciones finales aprobadas. El filtro inicial omitió el archivo de grado1; se corrigió y las rondas posteriores incluyeron los cuatro grados. No se presenta ese intermedio como comprobación de todos ellos.

Se usan condiciones, apoyos y supervisión proporcionados. No se generan dosis, acrobacias, maniobras nuevas, diagnósticos, dietas o datos privados. No se puntúan apariencia, capacidad natural, discapacidad, fe, intimidad, emociones, disfrute, confianza o personalidad. El creador conserva preparación silenciosa, controles visibles, puntos pendientes y selecciones manuales.

## Development y preservación

Fuente MINERD_SECUNDARIA_2023_EFI_COMUN_G4_V1, versión bef074f3-f1cc-512a-b284-434f3097af5e, CREATED/UNCHANGED:115 elementos y20 exclusiones. Catálogo115: CREATED/UNCHANGED; fuente, manifiesto, compilado e instalado coinciden. Frozen114 se creó una vez y se cotejó READ ONLY. Todos los campos previos y los instrumentos completos EFI1(540),EFI2(532),EFI3(496),Sociales1–6 y Artística1–6, incluidos niveles, permanecen exactos.

Historia anterior: 47 catálogos/364 snapshots intactos. Final: 48/377,12 muestras QA HTTP y una personal; ningún snapshot adicional al cambiar solo estrategia. Contexto QA ficticio4 reutilizado sin nuevas cuentas o copia de producción; sin notas.

Guard efectivo: PostgreSQL app_backend_local sin BYPASSRLS,Auth200,Storage200 y frontend exclusivamente Development. Asset /assets/index-DY5soF84.js, SHA-256 6cb9c8fa04de8c597146d0447a74ca4982cabe282129dbbdbdcf12012918f024, igual a dist; sw.js igual a dist y referencia de producción/clave de servicio ausentes del asset. El DOM personal confirmó el script yregisterSW.js. No se inspeccionaron internals del SW ni se borraron caché, almacenamiento o borradores. La intermitencia DNS anterior no se declara solucionada definitivamente.

## Pruebas y limitaciones

- Backend completo:54.946 pruebas/153 archivos,0 fallos.
- Frontend afectado:5.328 pruebas/16 archivos,0 fallos:4.954 curriculares en10 archivos y374 de servicios/creador en6 archivos, sin solapamiento. No toda la suite frontend.
- Builds shared/backend/frontend y pnpm cloudflare:build aprobados. Cloudflare fue dry-run, sin despliegue. Lint0 errores/16 advertencias previas;9 pruebas de inventario. Sin cambios de aplicación después de estas comprobaciones.
- [HTTP/DB](../../curriculum/cobertura-secundaria/physical-4-verificacion-http.json):12 muestras, cuatro formatos,20/17.35 puntos, puntuación pendiente, paridad local/servidor, texto manual, guardado/reapertura y estrategia sola exactos. Referente excluido400 esperado. Medianas locales:interpretar6275ms,recomendar6634ms,escrituras4073ms; no garantía de rendimiento.
- [Alternativas vía API](../../curriculum/cobertura-secundaria/physical-4-verificacion-alternativas-http.json):16 recomendaciones autenticadas de las dos alternativas corregidas, cuatro formatos y20/17.35 puntos, con paridad local/servidor. No crean actividades o snapshots. Los452 instrumentos anteriores permanecen exactos y los ocho nuevos se leyeron completos. El recorrido personal se reabrió con los assets finales y su huella permaneció igual.
- [Navegador personal](../../curriculum/cobertura-secundaria/physical-4-verificacion-navegador-evaluation-2026.115.json):4.ºA secundaria/EFI/b1, título/descripción, estrategia visible, puntos inicialmente vacíos, CASE_STUDY automático, rúbrica completa con17.35 y texto manual. Guardado/reapertura y cambio exclusivo a PROJECT_BASED/MANUAL, segundo guardado y reapertura con instrumento exacto. La selección manual comprueba persistencia, no recomendación pedagógica. Una muestra visual no acredita todas las variantes.

Actividad personal ee6db485-2068-4479-90e7-22e58c1cf58e, instrumento e40e12f0-4a65-4bba-8b6f-5501c23b1e43, snapshot 934bf032-1e1b-4b2c-876f-5824e21dc621; huella READ ONLY bf20677ee103b392ca6a117d39e7ca3b exacta antes/después de cambiar estrategia. Baseline creado una sola vez, nunca sobrescribir. Sin correos, contraseñas o equipos nuevos. Persisten los límites previos de Actividades global/Ver actividad; no se acredita restauración automática de todos los borradores.

Revisión propia del diff, UTF-8 y exclusión de secretos/respaldos/credenciales QA antes del commit; menor independencia que una revisión por otra persona, sin subagentes por instrucción del usuario. Mensaje de commit: «Amplía Educación Física de cuarto y verifica sus instrumentos»; consultar git log para hash. Sin push, preview o despliegue acreditados. Un build no demuestra actualización de producción; el403 previo impidió verificar todos los triggers.

Pendientes reales:EFI5–6,FHR1–6,optativas/modalidades según fuentes oficiales y cierre consolidado, incluidas comprobaciones personales de Sociales1/2/4/5. FuenteEFI5 PDF377–379 ya leída y anotada, solo preparación. Tras el commit4, congelar115 una sola vez por lectura contra Development antes de ampliar116 y continuar sin preguntas rutinarias. El encargo integral sigue abierto.
