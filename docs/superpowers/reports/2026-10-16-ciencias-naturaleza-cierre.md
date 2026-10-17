# Ciencias de la Naturaleza común: consolidación y pendientes

Se conectaron los seis grados en código, exclusivamente para Ciencias de la Naturaleza común. No se amplió Ciencias Sociales, otra asignatura ni optativas. El estado de verificación se distingue de la cobertura implementada; los bloqueos no se convierten en aprobación.

| Grado | Componente oficial | Páginas PDF / impresas | Grupos | Consignas / instrumentos | Estado |
| --- | --- | --- | ---: | ---: | --- |
| 1.º | Ciencias de la Tierra y el Universo | 293–295 / 292–294 | 29 | 68 / 272 | Patrones definidos verificados, incluidos cuatro formatos visuales |
| 2.º | Ciencias de la Vida | 296–299 / 295–298 | 30 | 68 / 272 | Patrones definidos verificados, incluidos cuatro formatos visuales |
| 3.º | Ciencias Físicas | 300–304 / 299–303 | 50 | 103 / 412 | Patrones definidos verificados, incluidos cuatro formatos visuales |
| 4.º | Biología | 312–315 / 311–314 | 48 | 104 / 416 | Cuatro formatos personales reabiertos y contrastados con DB; build final aprobado |
| 5.º | Química | 316–318 / 315–317 | 51 | 102 / 408 | Cuatro formatos personales reabiertos y contrastados con DB; build final aprobado |
| 6.º | Física | 319–322 / 318–321 | 63 | 126 / 504 | HTTP/DB cuatro formatos y regresiones aprobados; recorrido personal en curso |

959 registros literales y 271 grupos implementados. Los 2.284 instrumentos de ejemplo son adaptaciones de AulaBase, no instrumentos oficiales del MINERD. La [matriz](../../curriculum/cobertura-secundaria/ciencias-naturaleza-matriz.json) conserva texto fuente, páginas, enlaces, indicadores y exclusiones; los archivos `ciencias-naturaleza-N-revision.json` documentan pertinencia y correcciones. El número de ejemplos o pruebas no acredita cobertura universal de redacciones.

Se conservan arquitectura compartida, generación determinista, cuatro selectores compactos/modales, formulario vertical, preparación silenciosa, selección manual prioritaria, puntaje inicialmente vacío, 20/17,35 exactos, pesos/ediciones, añadir/completar, veinte criterios, respuestas obsoletas y snapshot histórico. Las correcciones científicas se detallan por grado. La descripción prevalece sobre un título anterior.

Las pruebas reales de cuarto/quinto detectaron expiraciones en las transacciones y consultas innecesarias del creador. Se añadió el contexto ligero del centro manteniendo autorización y se redujeron lecturas repetidas al guardar/actualizar metadatos sin ampliar timeouts ni quitar atomicidad. La mejora de guardado fue comprobada con QA en quinto; no se atribuye una mejora global de latencia ni un recorrido personal completo aún no ejecutado.

Destino exclusivo: AulaBase Development `eolgunypmtgrsyrjzcld`, PostgreSQL `app_backend_local` sin bypass RLS, Auth, Storage y variables públicas comprobados mediante guard y runtime. Producción, Hyperdrive/secretos remotos, cuentas y datos de producción intactos. Sin migraciones de esquema, reset, copia de usuarios, despliegue ni merge con main.

Rendimiento: generación pura de quinto p50 0,1546 / p95 0,2595 ms; sexto p50 0,2639 / p95 0,4843 ms, 200 muestras cada uno. HTTP incluye Worker, red y dependencias remotas: hubo decenas de segundos, expiraciones y un corte de conexión posteriormente recuperado. No se presentan esos tiempos como medición aislada de SQL o renderizado.

Pendientes y bloqueos: sesión personal en login tras error de perfil, requiere intervención de acceso; no se cambian credenciales ni se envían correos durante la ausencia. Guiones manuales de cuarto a sexto disponibles. Las registraciones privadas del service worker no fueron auditadas; sí se comprobaron SHA de assets/sw servidos. El CLI Cloudflare genera el dry-run y anuncia salida, pero permanece activo; las interrupciones se registran como no aprobadas. No se fuerza una salida 0 ni se modifican dependencias para ocultarlo.

Actualización final de las comprobaciones automáticas: backend **45.248/108**, frontend **45.637/131**, sus builds y **`pnpm cloudflare:build` aprobados**. Este último terminó naturalmente en 86.042 ms sobre catálogo92, sin despliegue; el CLI ya no es un bloqueo vigente. Catálogo92 y fuente6 instalados CREATED→UNCHANGED; guardado/reapertura/estrategia exacta de los cuatro formatos, cinco controles científicos y regresiones FRA/ING/MAT/Ciencias1–5 aprobados. Baseline6 de24releases/106snapshots e inicial18/73 intactos, un release y cuatro snapshots nuevos.

La sesión personal se recuperó automáticamente al recargar, sin intervención de credenciales. El cotejo local de cuarto se reabrió exacto después de cambiar solo estrategia; la escala se creó con snapshot92. Se retoman los recorridos restantes desde curso/asignatura; no se presentan aún como terminados. La lista global de Actividades volvió a superar su timeout: limitación real de latencia separada del creador y los guardados comprobados. Las incidencias anteriores de conexión/CLI se conservan como antecedentes, no como bloqueos actuales.

Cuarto cerró después los cuatro formatos visuales con la cuenta personal y comprobación DB. El cotejo original se revisó y reabrió con snapshot92, preservando sus cinco campos manuales; no se duplicó. Escala y ponderada reabiertas exactas; rúbrica90 anterior conservada. Evidencia publicada en `10adefb3`. Sexto automático publicado en `d93c24a59b47a7a3d9b2cf08c83ce3d8df93265c`; ambos pushes normales confirmados. Los recorridos personales5/6 continúan por separado.

Historial publicado: primero `38bc31d29f3085579e786851823bc3aea70bb57a`; segundo `bad192bae40e435158137d19e3b83b73166ca4f1`; tercero `29a78352452b8aeb0f2aa4e909677389891cef6b`; cuarto `abe812eb03911e1fae6017ccb37610cb00759d12`; quinto `5010f9a60aed0821674bff27c2dde1e5604ab27f`. Push normal confirmado para esos bloques. Sexto y el estado final se actualizarán tras sus verificaciones. Rama `amplia-instrumentos-secundaria`; consultar Git para el hash del commit que contiene este informe.

Informes por grado: [1.º](2026-10-16-ciencias-naturaleza-1.md), [2.º](2026-10-16-ciencias-naturaleza-2.md), [3.º](2026-10-16-ciencias-naturaleza-3.md), [4.º](2026-10-16-ciencias-naturaleza-4.md), [5.º](2026-10-16-ciencias-naturaleza-5.md), [6.º](2026-10-16-ciencias-naturaleza-6.md). [Continuación concreta](2026-10-16-ciencias-naturaleza-continuacion.md).
