# Auditoría y primer bloque de Sociales 1.º

Estado: **parcial**, continuación autorizada. No se cierra Sociales1.º ni secundaria. Rama `ampliacion-de-instrumentos-2`; commits locales autorizados, pushes pendientes por instrucción del usuario. Sin merge ni despliegue en esta intervención.

## Fuente y cobertura

MINERD2023, SHA-256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`. Revisión visual: PDF48,49,55 y Sociales1.º PDF244–248, incluidas continuaciones e indicadores separados. Inventario:54 ámbitos comunes y18 optativos por grado; otros17 scopes son encabezados. Se conserva el cierre existente de Naturales sin repetirlo ni atribuirle cobertura universal.

El proveedor inicial de Sociales1.º conecta29 grupos temáticos y seis familias específicas, además de explicación: causalidad, cronología, ubicación cartográfica, comparación de perspectivas, producto alternativo y debate. Los35 fixtures producen140 ejemplos completos en cuatro formatos. La matriz conserva **21 registros pendientes de correspondencia o exclusión justificada**. Los candidatos léxicos no equivalen a un mapa semántico validado. Revisados completos los ejemplos de las seis familias específicas en cuatro formatos; quedan los demás ejemplos y procedimientos adicionales. La fuente oficial aún no está publicada en la base: HTTP prueba instrumentos derivados de la consigna, sin atribuir referencias oficiales inexistentes. Grados2–6 y áreas posteriores pendientes.

## Cambios

- Proveedor determinista compartido `secondary-social{,-grade-1}.ts`, conectado a interpretación, recomendación, sugerencias y alternativa local. Reutiliza formato, puntos y persistencia; sin UI nueva ni dependencias.
- Catálogo `evaluation-2026.94` instalado solo en Development; segunda preparación `UNCHANGED`. Catálogo93 congelado. Sin migraciones de esquema.
- Regresiones que fallaron antes de corregirse: etiquetas literales no reconocidas; GPS/escala exigidos tras negación; mapa como producto confundido con tema histórico; ubicación redundante con puntos cardinales; identificación simple recomendada siempre como rúbrica.
- Causas y consecuencias separadas; alternativas sin obligar ambos productos; perspectivas sin adhesión política; descripción prevalece sobre título incompatible; negación no elimina una acción positiva posterior.
- Drivers reproducibles de inventario, matriz/ejemplos y HTTP con checkpoint/identificador de creación y reconciliación antes de repetir una escritura.

## Verificación

Backend completo: **45.591 pruebas/135 archivos, exit0** sobre el último ajuste. Frontend completo: **46.153/170, exit0** antes de los ajustes finales de mapa/recomendación; repetición focal posterior: **281 frontend y29 backend/catálogo**, aprobadas. Regresión de fuentes existente:49 aprobadas. Lints backend/frontend aprobados; frontend conserva16 warnings previos.

`pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`: aprobados sobre los cambios finales de este bloque. Cloudflare terminó con exit0 en17,1s; dry-run, sin despliegue. El Worker local se detuvo por su PID/comando comprobados antes de regenerar Prisma y se reinicia con el guard de Development.

HTTP autenticado + DB, contexto QA ficticio Development de Sociales1.º:

| Formato | Puntos | Guardado/reapertura | Texto manual | Solo estrategia |
|---|---:|---|---|---|
| Rúbrica causal | 20 | Aprobado | Preservado | Instrumento exacto preservado |
| Cotejo cartográfico | 17.35 | Aprobado | Preservado | Instrumento exacto preservado |
| Escala de perspectivas | 20 | Aprobado | Preservado | Instrumento exacto preservado |
| Ponderada cronológica | 17.35 | Aprobado | Preservado | Instrumento exacto preservado |

Paridad servidor/local, puntos iniciales pendientes y totales exactos comprobados en contratos. Recomendación HTTP: media3751ms, rango3252–4093ms; interpretación media3963ms. Ocho guardados/actualizaciones: media2863ms, rango2169–3364ms. Preparación pura local: unos0,062ms (200 iteraciones), distinta de HTTP/renderizado. Sin comparación equivalente suficiente para afirmar ausencia de regresión.

El driver inicial recibió400 por enviar dos campos de recomendación a interpretación: corregido el request, sin relajar validación. Un intento falló antes de crear actividades por conectividad del pooler; DNS comprobado y un reintento. Un arranque coincidió con Prisma activo y falló al renovar DLL; se esperó su cierre y se arrancó un único Worker. No se cambiaron DNS, TLS, timeouts ni proyecto.

## Entorno, acceso e históricos

Guard PostgreSQL/Auth/Storage/variables públicas: Development `eolgunypmtgrsyrjzcld`. Asset HTTP idéntico al compilado, sin referencia de producción. Huellas de **26 releases y121 snapshots iniciales intactas**; ahora27 y125 respectivamente por nuevo catálogo/cuatro actividades QA. Sin copia de producción ni borrado de borradores/cuentas.

Navegador disponible, acceso personal bloqueado por `Invalid login credentials`. Consulta Auth de solo lectura: cuenta existente, confirmada, contraseña configurada, no bloqueada ni eliminada. Esto no demuestra que la contraseña introducida corresponda a Development. No se leyó/cambió contraseña ni se conectó producción. Con autorización expresa, se solicitó un nuevo enlace desde localhost y la aplicación confirmó el envío; pendiente que el usuario abra el correo. Recorrido visual personal **no ejecutado**; QA no lo sustituye.

## Git y automatización remota

No hacer push hasta comprobar que respeta el límite de no desplegar. Checks/builds anteriores Workers/Vercel observados no prueban actualización de producción. Lectura de triggers Workers: HTTP403; no se pudieron comprobar sus reglas/efectos mediante esa API. Sin cambios de integraciones, permisos, secretos ni despliegue. Previews y despliegues efectivos de esas ejecuciones no acreditados en este bloque.

El diff conserva las conexiones existentes y el catálogo histórico; secretos, cuentas QA, sesiones y respaldos permanecen excluidos de Git. El commit de este bloque se identifica mediante el historial de la rama (mensaje «Inicia Sociales de primero y audita secundaria pendiente»). Sin push. Seguir [continuación](2026-10-17-secundaria-continuacion.md) sin esperar navegador/push para tareas independientes.
