# Educación Física de 6.º: bloque verificado en Development

`evaluation-2026.117` está instalado y servido exclusivamente en AulaBase Development (`eolgunypmtgrsyrjzcld`). Se conectaron 75 temas, 83 contratos específicos y 75 consignas breves: 158 consignas y 632 instrumentos completos leídos en cuatro formatos, con 632 huellas coincidentes. Son patrones y muestras representativos; no acreditan todas las variantes de cada fila compuesta ni una clase física real.

La fuente MINERD2023 se leyó visualmente completa en PDF380–382/impresas379–381. Contiene 127 registros: 28 conceptos, 54 procedimientos, 9 actitudes, 22 indicadores y 14 competencias. Se mapearon las 69 filas C/P útiles y se justificaron 14 exclusiones: 13 encabezados y una perseverancia privada. Ver [notas de fuente](2026-10-18-educacion-fisica-6-fuente-notas.md), [correspondencias](../../curriculum/cobertura-secundaria/physical-6-correspondencias.json), [matriz](../../curriculum/cobertura-secundaria/physical-6-matriz.json), [instrumentos completos](../../curriculum/cobertura-secundaria/physical-6-instrumentos.json) y [registro de lectura](../../curriculum/cobertura-secundaria/physical-6-revision-instrumentos.json).

## Cambios y causas

Se amplió el proveedor compartido con `secondary-physical-grade-6.ts`, contratos backend/frontend y soporte explícito en los runners. Se reutilizan motor, alternativa local, sugerencias y formateadores. El catálogo116 quedó congelado una sola vez y mantiene resolución histórica; no se reutilizó su versión con otro payload.

Las primeras pruebas reprodujeron la ausencia del proveedor: 656 fallos. Conectado el grado, pasaron290 y fallaron441. Los fallos señalaron variantes omitidas, temas adicionales seleccionados por referencias contextuales y mapas clasificados como práctica motriz. El parser eliminaba «sin posesión» como negación; ahora la conserva en6.º. Se precisaron modalidades, funciones, trayectorias y alternativas sin imponer todas las opciones. La revisión completa añadió regresiones para fútbol11 en planes de posesión, explicación de reglas de futsal y redacción del mapa breve. Se corrigió también la redacción de la alternativa de servicio de tenis.

El primer build detectó dos helpers que perdían el identificador requerido de su evidencia; se corrigieron sus tipos genéricos. Cuatro fallos de la suite inicial eran expectativas móviles del catálogo actual aún en116; se actualizaron a117 conservando los asserts históricos. Se repitieron checks afectados y obligatorios sobre el código final.

No se generan dosis, distancias, rutinas, maniobras peligrosas, dietas, diagnósticos o datos privados. El mapa/croquis es producto documental cuando se solicita producirlo; O-CAD permanece como referente sin instalar otra aplicación. No se puntúan apariencia, autoestima, capacidad natural, discapacidad, intimidad, fe, personalidad o perseverancia interna. Creador vertical, preparación silenciosa, puntos pendientes y selecciones manuales se conservan.

## Development e historia

Fuente `MINERD_SECUNDARIA_2023_EFI_COMUN_G6_V1`, versión `82cada50-b75f-581d-87ea-41d803b6b978`: CREATED/UNCHANGED,127 elementos y14 exclusiones. Catálogo117: CREATED/UNCHANGED. Fuente, manifiesto, compilado e instalado coinciden. Contexto QA ficticio de6.º reutilizado, sin cuentas nuevas ni copia de producción.

La comparación READ ONLY conservó todos los campos históricos y definiciones completas con niveles: EFI1–5 (540/532/496/460/528), Sociales1–6 (292/480/484/756/736/828) y Artística1–6 (288/344/348/368/400/392). Los49 catálogos y390 snapshots anteriores permanecen intactos. Final:50 catálogos/403 snapshots;12 muestras HTTP y una personal nuevos. Cambiar solo la estrategia no creó snapshots.

PostgreSQL usa `app_backend_local`, sin BYPASSRLS; Auth y Storage respondieron200 y las variables públicas apuntan solo a Development. Asset `/assets/index-CyOv_T-O.js`, SHA256 `0bca88a6ec6a761f840c664e392b846666d758f120e2aee64a1f8677fe6dbdc9`, idéntico a dist; sw.js también coincide. El DOM confirmó entry/registerSW.js tras recargar. No se inspeccionaron internals del SW ni se borró caché, almacenamiento o borradores. No se declara resuelta definitivamente la incidencia DNS anterior.

## Pruebas y límites

- Backend completo:56.321 pruebas/155 archivos,0 fallos.
- Frontend afectado:6.591 pruebas/19 archivos,0 fallos;6.257 en14 archivos curriculares/servicios y334 en5 archivos adicionales de creador/contratos. No toda la suite frontend.
- Builds shared/backend/frontend y `pnpm cloudflare:build` aprobados; este último dry-run, sin despliegue. Lints con0 errores y16 advertencias frontend previas. Inventario:9 pruebas. Sin cambios posteriores de código de aplicación.
- [HTTP/DB](../../curriculum/cobertura-secundaria/physical-6-verificacion-http.json):12 muestras explícitas, cuatro formatos20/17.35, paridad local, puntos pendientes, manuales, fuente, guardado/reapertura y estrategia sola exactos. Referente excluido400 esperado. Medianas locales:interpretación 6261ms, recomendación 7233ms y escrituras 4218ms. Consignas distintas de grados previos: no acredita una mejora causal ni garantiza tiempo de clase.
- [Navegador personal](../../curriculum/cobertura-secundaria/physical-6-verificacion-navegador-evaluation-2026.117.json):6.ºA/EFI/b1, estrategia visible desde vacío, título/descripción, CASE_STUDY automático y puntos inicialmente vacíos. Escala manual elegida durante preparación pendiente y conservada; indicador y cuatro descriptores completos,17.35 explícitos y texto manual. Primer guardado/reapertura, cambio exclusivo a PROJECT_BASED/MANUAL, segundo guardado y reapertura final. No se afirma inspección visual de otros formatos en este grado.

Actividad `463579ea-a1f5-427c-b034-e495646ec561`, instrumento `daf17c3c-634b-48c9-a40b-f0114ae7dcbb`, snapshot `98572d71-34df-403b-a672-65e2be7b2c95`. Huella READ ONLY `03704f55e45c08cf294433f68f869e2f`, idéntica antes y después del cambio exclusivo de estrategia. Incluye definición completa, snapshot, técnica, puntos e identificadores. Baseline creado una sola vez: no sobrescribir. La estrategia manual prueba persistencia, no recomendación pedagógica.

La escala reabierta analiza decisiones defensivas del portero por evidencias dadas; distingue una relación suficientemente sustentada, una relación aún sin sustento y ausencia de evidencia. No exige ejecución, jugador de campo o comparación física. La edición «QA manual conservado» permaneció en el indicador.

Las cargas transitorias terminaron sin repetir guardados ni modificar código. Persisten límites anteriores de Actividades global/Ver actividad y etiquetas HTML visibles en la descripción de la tabla; no impidieron Editar y no se modificaron en este bloque. No se acredita restauración automática de todos los borradores. Sin correos, contraseñas, notas, equipos o cuentas nuevos.

## Git y continuación

Revisión propia del código conectado y diff por prohibición de subagentes; menos independencia que una revisión por otra persona. Auditoría de UTF8, secretos, respaldos y credenciales QA antes del commit. Rama `ampliacion-de-instrumentos-2`, base `2cd2c1781cd032921a24f0f5d716a40c0f70e949`. Commit español local «Amplía Educación Física de sexto y verifica sus instrumentos»; consultar gitlog para hash. No push hasta revisar integraciones, conforme a la instrucción vigente. Un build no acredita preview o despliegue efectivo; el403 previo impidió verificar todos los triggers. Sin producción, main, despliegue, resets o borrados.

Siguiente: FHR1–6, optativas/modalidades y cierre consolidado, incluidas pruebas personales pendientes de Sociales1/2/4/5. Fuentes FHR1–2 ya leídas y planFHR1 preparado durante la espera, sin implementación antes del cierreEFI6. Antes de118, congelar117 instalado exactamente una vez. El encargo integral sigue abierto.
