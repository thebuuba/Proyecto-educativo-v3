# Sociales 1.º: fuente publicada y exclusiones evaluativas

Bloque posterior a `6fc27c8b3d1d60721307e1c4b199e8b46cddc286`. Sigue pendiente completar Sociales 1.º y el resto del encargo. Rama `ampliacion-de-instrumentos-2`; sin push, merge, despliegue ni cambios de producción.

## Fuente y cambios

Publicada únicamente en Development `eolgunypmtgrsyrjzcld` la fuente `MINERD_SECUNDARIA_2023_SOC_COMUN_G1_V1`, versión `fa677897-464e-50bc-bd9b-0b2a262db701`, ámbito `8e6396f0-b49e-52fb-a8d9-fcd90a60518e`. PDF MINERD2023, páginas244–248 previamente revisadas, SHA-256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`.

181 registros literales,181 spans y7 relaciones originales. La segunda instalación devolvió `UNCHANGED`. No se modifica ninguna fuente publicada anterior ni se aplican migraciones de esquema. El catálogo permanece `evaluation-2026.96`.

`reviewed-common-source.mjs` valida grado/asignatura, hash, revisión visual, texto literal y páginas de cada registro; publica un único ámbito en transacción mediante los estados existentes. Reutiliza el modelo/proceso de las fuentes anteriores, con IDs deterministas, guard de Development, idempotencia y comprobación de históricos. Un grado incorrecto se rechazó antes de acceder a DB.

Se conservan íntegros los ocho registros excluidos como temas evaluables. El servicio ahora omite sus IDs al construir candidatos y al validar selecciones de referentes. La prueba reprodujo primero que se ofrecía una disposición personal mal clasificada como procedimiento; después confirmó su exclusión y rechazo explícito. La API real también devolvió400 al forzar un referente excluido. No se borra texto oficial ni se cambia la clasificación de fuentes anteriores.

## Pruebas y límites de atribución

Los cuatro formatos seleccionaron referencias literales del ámbito correcto en interpretación/recomendación y completaron guardado/reapertura, edición manual y cambio exclusivo de estrategia. Comprobación DB adicional: los cuatro snapshots conservan la versión y ámbito de la fuente; el instrumento permanece exacto al cambiar solo estrategia.

**La atribución por criterio sigue separada:** los criterios contextuales de AulaBase no se declaran literales del MINERD. `alignRecommendationWithFields` elimina referencias seleccionadas que no estén enlazadas a un criterio final, aunque mantiene versión/ámbito. En estos cuatro snapshots quedaron cero referencias literales por criterio y cero elementos seleccionados retenidos. No presentar esta prueba como conservación de esas selecciones individuales ni como derivación literal de todos los criterios. No se cambió ese mecanismo compartido durante este bloque.

Históricos finales verificados por lectura:28 releases/125 snapshots anteriores al96 intactos; ahora29 releases/137 snapshots. Se agregaron cuatro actividades QA con fuente a las doce previas. La publicación preservó los29 releases/133 snapshots existentes antes de esas pruebas. Sin copia ni borrado de cuentas/datos.

Comprobaciones: backend completo45.622 pruebas/135 archivos; prueba del servicio50; builds backend/frontend y `pnpm cloudflare:build` aprobados (dry-run, exit0 en12,8s). Lint backend y sintaxis de scripts aprobados. Frontend compartido no cambió; se mantienen las regresiones329 y el full previo46.153/170, sin afirmar otro full ejecutado aquí. Assets servidos idénticos al compilado, exclusivamente Development.

## Latencia observada

Con la fuente publicada, las cuatro muestras HTTP dieron interpretación media13948ms (9170–17699), recomendación12568ms (11026–15300) y ocho guardados/actualizaciones10753ms (6005–13992). La latencia continúa elevada; no se aumentaron timeouts ni añadieron banners.

Sondeo separado de solo lectura desde Node al mismo PostgreSQL: conexión1760ms, primer roundtrip293ms, lectura de catálogo397ms,181 elementos con spans757ms/73.100bytes y roundtrip posterior43ms. Ese recorrido no incluye Auth ni Worker y no equivale a una petición completa. El código del Worker crea/desconecta un cliente Prisma por petición; queda pendiente aislar el coste de conexiones y lecturas repetidas de la fuente, sin compartir sockets entre peticiones ni debilitar autorizaciones.

## Continuación

Navegador disponible, autenticación personal aún pendiente de abrir el enlace autorizado. Ninguna prueba visual personal se presenta como realizada. Hay31 grupos/41 consignas/164 ejemplos;71 revisados con huellas y93 pendientes individualmente. Faltan variantes procedimentales señaladas en la continuación, además de los grados y áreas posteriores.

Revisar diff/secretos y guardar este bloque mediante commit local. Pushes pendientes por orden expresa; no tocar integraciones. [Archivo maestro](2026-10-17-secundaria-continuacion.md).
