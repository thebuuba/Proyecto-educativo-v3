# Integración de todas las ramas en main

Solicitud del 17/10/2026: fusionar todas las ramas y resolver sus choques, conservando los cambios. Se mantiene la restricción de no modificar producción ni desplegar. El resultado se publica a través de PR protegido; su enlace, CI y hash final se confirman en la entrega.

## Ramas y conservación

Se revisaron 75 referencias locales/remotas después de fetch, sin borrar ramas. 72 ya estaban incorporadas en main dfdee498. Solo faltaban instrumentos de secundaria 56565075 (49 commits propios respecto a main) y suscripciones/pagos 4945b9e0 (44). El commit local de reestructurando-horario y las demás ramas antiguas ya eran antecesores de main; no se duplicaron.

Suscripciones/pagos se integró sin conflictos. Instrumentos produjo ocho conflictos, resueltos conservando ambas líneas: README, catalog-current.ts, evaluation-instruments.service.ts y su spec, ActivityEditorWorkspace.spec.tsx, ActivityCreationView.tsx, instrumentPreparation.ts y packages/shared/src/index.ts. Todos los hashes iniciales están incluidos en los padres de la fusión; se comprueba nuevamente su ascendencia después del commit y de publicar main. [Inventario y evidencia](2026-10-17-integracion-main-verificacion.json).

## Choques funcionales corregidos

- Las dos líneas reutilizaron releases 46/47 con contenidos distintos. Se congelaron los payloads exactos de main 46/47 y curricular 92 en archivos nuevos; no se reescribieron los congelados existentes. evaluationCatalogForVersion permite identificar explícitamente el linaje main de 46/47. El nuevo evaluation-2026.93 conserva módulos comunes de seis grados y recupera los criterios genéricos/triggers de main, sin IDs duplicados. Siete pruebas del catálogo, incluidas cuatro huellas completas de origen, aprobadas.
- La clasificación por código de asignatura de main hacía aplicar el adaptador de escala a progresiones inglesas antes no alcanzadas. Se conserva la progresión original del criterio; las celdas mantienen su presentación de grado/frecuencia. Los casos rojos de gramática/léxico pasaron después del cambio.
- La técnica sugerida podía volver a disparar la interpretación y alternar el formato antes de preparar. El contexto solo vuelve a interpretar por una técnica manual; la huella completa sigue invalidando respuestas obsoletas cuando cambia evidencia, recursos, modalidad u otros requisitos. No se añadieron banners.
- Los borradores antiguos almacenaban seis campos en la huella. Ahora pueden actualizarla tras revisión explícita conservando sus filas/puntos, con rechazo de cambio de modalidad, formato o referencias. Ocho regresiones nuevas prueban conservación y restricciones; no se borra almacenamiento.
- El servicio y la alternativa local no componían igual el campo Evidencia. Se incorporan una sola vez esas instrucciones explícitas a la descripción efectiva en interpretación/recomendación. Doce contratos de paridad en Ciencias, Matemática y Francés y una regresión del servicio pasaron tras reproducir el fallo.
- Se adaptó una prueba antigua al selector modal vigente y se corrigieron dos prefer-const y un import sin uso señalados por lint. Sin dependencias nuevas ni rediseño de pantallas.

## Verificación del árbol combinado

| Comprobación | Resultado |
| --- | --- |
| pnpm --filter backend test | 45526 pruebas / 129 archivos, aprobado |
| pnpm --filter frontend test | 45852 pruebas / 164 archivos, aprobado |
| Backend build | Salida 0 |
| Frontend build | Salida 0 |
| pnpm cloudflare:build | Salida 0; dry-run, sin despliegue |
| Linters backend/frontend | Sin errores; frontend conserva 16 advertencias anteriores de hooks |
| Guardas Development/Staging y diagnóstico Paddle | 21 pruebas de scripts aprobadas |
| Creador y borradores | 48 pruebas focalizadas aprobadas; paridad de evidencia: 12; servicio: 49 |

Las corridas rojas, el build que detectó un tipo incompleto de un fixture y una corrida frontend interrumpida al incorporar la corrección de evidencia no se presentan como aprobados. Las comprobaciones exigidas se repitieron sobre el código final. El CI remoto debe validar además las migraciones en PostgreSQL efímero de GitHub, sin utilizar bases de usuarios; su resultado se confirma en el PR antes de fusionar.

## Entorno, catálogo y migraciones

PostgreSQL/Auth/Storage/variables públicas de desarrollo permanecen en AulaBase Development eolgunypmtgrsyrjzcld. Las compilaciones finales reciben ese entorno mediante su guarda. La consulta de solo lectura confirmó app_backend_local sin bypass RLS, catálogo 92 idéntico al payload congelado y tablas de facturación existentes. Se instaló exclusivamente el catálogo 93 en Development mediante el mecanismo existente y destino explícito: CREATED y luego UNCHANGED. Las huellas de los 25 releases anteriores y los 121 snapshots permanecen idénticas. Estado final: 26 releases y 121 snapshots.

La preparación del catálogo agrega únicamente su release nuevo; no ejecuta el seed general ni modifica snapshots/cuentas. Los resultados concretos de la consulta final constan en el JSON. Se incorporan a Git, intactos desde sus ramas, la migración de estrategia 20261015105401 y las cinco migraciones de facturación 20261015141817, 20261015142608, 20261015143145, 20261015145704 y 20261015175941. No se ejecutaron migraciones remotas durante esta integración.

Se verificó el diff y la exclusión de secretos, respaldos y credenciales QA. Los ejemplos tienen credenciales vacías o placeholders. La coincidencia de patrón de Paddle en paddle-sandbox.spec.ts lleva el marcador TESTONLY y es un fixture; no una clave real. Logs, archivos privados y diagnósticos permanecen ignorados en .wrangler.

## Publicación sin desplegar

main exige el check ci y PR, sin un mínimo de revisiones aprobatorias. Se crea el PR con CI normal; Deploy Cloudflare no despliega ese evento de PR. Solo después del CI aprobado se fusiona con commit [skip ci], conservando el historial de las ramas y evitando otro CI de push que encadenaría migraciones y despliegue de producción. No se usa --admin, force push ni se cambia la protección o el workflow. [Regla oficial de GitHub para omitir ese push](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs).

La automatización original continúa configurada para futuros pushes ordinarios a main. Este encargo actualiza el código; no publica el Worker de producción. Las suites no acreditan todos los recorridos posibles de navegador o del proveedor de pagos. El estado final del PR, hash, sincronización y árbol se confirma en la entrega.
