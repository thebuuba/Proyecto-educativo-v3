# Integración de todas las ramas en main

Solicitud del 17/10/2026: fusionar todas las ramas y resolver sus choques, conservando los cambios. Inicialmente se mantuvo el límite anterior de no desplegar. Tras detectar automatizaciones externas, el usuario autorizó expresamente «el despliegue automático al fusionar». La publicación sigue el PR protegido y la automatización existente, sin despliegues manuales ni cambios de secretos o Hyperdrive. Su enlace, CI y hash final se confirman en la entrega.

## Ramas y conservación

Se revisaron 75 referencias locales/remotas después de fetch, sin borrar ramas. 72 ya estaban incorporadas en main dfdee498. Solo faltaban instrumentos de secundaria 56565075 (49 commits propios respecto a main) y suscripciones/pagos 4945b9e0 (44). El commit local de reestructurando-horario y las demás ramas antiguas ya eran antecesores de main; no se duplicaron.

Suscripciones/pagos se integró sin conflictos. Instrumentos produjo ocho conflictos, resueltos conservando ambas líneas: README, catalog-current.ts, evaluation-instruments.service.ts y su spec, ActivityEditorWorkspace.spec.tsx, ActivityCreationView.tsx, instrumentPreparation.ts y packages/shared/src/index.ts. Todos los hashes iniciales están incluidos en los padres de la fusión; se comprueba nuevamente su ascendencia después del commit y de publicar main. [Inventario y evidencia](2026-10-17-integracion-main-verificacion.json).

## Choques funcionales corregidos

- Las dos líneas reutilizaron releases 46/47 con contenidos distintos. Se congelaron los payloads exactos de main 46/47 y curricular 92 en archivos nuevos; no se reescribieron los congelados existentes. evaluationCatalogForVersion permite identificar explícitamente el linaje main de 46/47. El nuevo evaluation-2026.93 conserva módulos comunes de seis grados y recupera los criterios genéricos/triggers de main, sin IDs duplicados. Siete pruebas del catálogo, incluidas cuatro huellas completas de origen, aprobadas.
- La clasificación por código de asignatura de main hacía aplicar el adaptador de escala a progresiones inglesas antes no alcanzadas. La revisión posterior detectó que conservar esa progresión en los metadatos, pero mostrar una escala de grado/frecuencia, producía textos distintos al reconstruir niveles. La solución final persiste la progresión seleccionada que se muestra en pantalla, con las excepciones autorales ya existentes. Los contratos de gramática/léxico siguen verificando su evidencia curricular en la rúbrica, y la escala comprueba la correspondencia entre metadatos y celdas.
- La técnica sugerida podía volver a disparar la interpretación y alternar el formato antes de preparar. El contexto solo vuelve a interpretar por una técnica manual; la huella completa sigue invalidando respuestas obsoletas cuando cambia evidencia, recursos, modalidad u otros requisitos. No se añadieron banners.
- Los borradores antiguos almacenaban seis campos en la huella. Ahora pueden actualizarla tras revisión explícita conservando sus filas/puntos, con rechazo de cambio de modalidad, formato o referencias. Ocho regresiones nuevas prueban conservación y restricciones; no se borra almacenamiento.
- El servicio y la alternativa local no componían igual el campo Evidencia. Se incorporan una sola vez esas instrucciones explícitas a la descripción efectiva en interpretación/recomendación. Doce contratos de paridad en Ciencias, Matemática y Francés y una regresión del servicio pasaron tras reproducir el fallo.
- Se adaptó una prueba antigua al selector modal vigente y se corrigieron dos prefer-const y un import sin uso señalados por lint. Sin dependencias nuevas ni rediseño de pantallas.

## Verificación del árbol combinado

| Comprobación | Resultado |
| --- | --- |
| pnpm --filter backend test | 45542 pruebas / 131 archivos, aprobado |
| pnpm --filter frontend test | 45856 pruebas / 166 archivos, aprobado |
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

## Revisión de Configuración y Suscripción

Tras una nueva consulta de todas las ramas no aparecieron commits pendientes de esas áreas. La configuración de dd52f018 y los cambios comerciales hasta 4945b9e0 están incluidos; entre ellos, 5da02cd4 integra Suscripción en Ajustes, 72ae31bc presenta el mes con tarjeta y 979b43f9 actualiza la mensualidad a US$7.99. No se duplicaron esos commits.

Se reprodujo en la sesión personal de Development el mensaje `Cannot GET /api/v1/billing`: la interfaz estaba actualizada, pero el proceso iniciado antes de la integración conservaba el backend anterior. Se detuvo únicamente su árbol de procesos identificado y se recompiló/reinició mediante la guarda de Development. Después se comprobó visualmente Configuración → Suscripción y pagos con la cuenta personal: cobertura, mes gratuito con tarjeta, US$7.99, transferencias, historial y soporte. La contratación permanece desactivada por la configuración existente de Development; no se habilitó ni se inició ningún pago.

El HTML y nueve assets servidos coinciden por SHA-256 con los archivos finales de dist; el navegador cargó index-DJrdVzo5.js. La ruta comercial devuelve 401 sin sesión, en lugar de 404, y carga con la sesión personal. No se borraron borradores, datos ni credenciales del navegador. El entorno automatizado de lectura de DOM no expone el registro de service workers; la comprobación de caché se limita al bundle realmente cargado, assets servidos y al código existente de limpieza local al arrancar.

La revisión automática del PR abrió cinco conversaciones que bloqueaban main. Se comprobaron y corrigieron sus causas:

- La sustitución de comprobantes limpia el objeto anterior solo tras confirmar la transacción; si falla update, auditoría o commit, limpia el nuevo. Las rutas ajenas al titular se rechazan para limpieza. Son pruebas con Storage simulado; no se eliminaron comprobantes reales ni se ejecutó limpieza histórica.
- La apertura de comprobantes reserva una pestaña durante el clic, desconecta opener, valida el enlace y navega después de recibirlo. Cierra la pestaña ante errores y avisa si el navegador bloquea ventanas.
- Las diez claves compuestas de propietario/plan de la migración existente se reflejan en Prisma y en Relationships del frontend, conservando las referencias simples que también existen en SQL. Prisma validate y generate aprobados, sin modificar migraciones ni bases.
- El titular no administrador puede abrir Suscripción o Cuenta sin consultar el centro ni períodos académicos bloqueados por falta de cobertura. Se conserva la carga administrativa para administradores.
- La progresión guardada de la escala coincide con sus descriptores visibles al reconstruir niveles.

Se vieron fallar las regresiones antes de corregirlas. Pasaron 13 pruebas focalizadas de frontend, 8 de comprobantes de backend y 11 de correspondencia de relaciones, antes de repetir las suites completas y los builds.

## Publicación y autorización de automatizaciones

La integración está publicada en la [PR #58](https://github.com/thebuuba/Proyecto-educativo-v3/pull/58). main exige el check ci y PR, sin un mínimo de revisiones aprobatorias. El CI del PR se ejecuta normalmente; el job Deploy Cloudflare de GitHub Actions omite ese evento. Un commit final con [skip ci] evita otro CI de push y su despliegue encadenado, pero no controla las aplicaciones externas conectadas a Git. No se usa --admin, force push ni se cambia la protección o el workflow. [Alcance de la omisión de GitHub Actions](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs).

Durante el PR aparecieron además Workers Builds y Vercel, independientes de GitHub Actions. El check Workers Builds terminó con éxito y Vercel publicó un deployment identificado por GitHub como Preview, no Production. No se abrió ni se utilizó esa preview para probar datos. Las previews de Vercel de este proyecto reenvían a la API de producción según docs/05-despliegue.md.

La credencial local pudo listar el Worker pero recibió 403 al consultar sus disparadores de builds; el navegador pide iniciar sesión. No se cambiaron permisos ni ajustes para superar esa limitación. Cloudflare documenta que un push a la rama de producción activa build y deploy; [skip ci] no demuestra que esa integración se detenga. [Control de ramas de Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/). Vercel también dispone de configuración independiente para activar despliegues por rama. [Configuración Git de Vercel](https://vercel.com/docs/project-configuration/git-configuration).

El usuario autorizó expresamente el despliegue automático al fusionar. Por ello se utiliza una fusión normal, sin [skip ci], tras completar el check requerido del PR. Se supervisan los despliegues disparados por la fusión; no se inicia ninguno manualmente ni se alteran secretos, Hyperdrive o protecciones. El workflow existente puede aplicar migraciones de producción: esta es una consecuencia de la automatización autorizada, no de la preparación del catálogo de Development. La consulta de deployments anterior a la fusión confirmó que el Worker activo seguía en el deployment del 14/10, sin cambios de tráfico por los checks de esta rama.

Las suites no acreditan todos los recorridos posibles de navegador o del proveedor de pagos. El estado final del PR, hash, sincronización, árbol y automatizaciones se confirma en la entrega; no se afirma una fusión o despliegue todavía pendiente.

## Fusión confirmada y cierre documental

La PR #58 se fusionó el 17/10/2026 a las 15:01:51 de Santo Domingo, con commit a050cc6c20b020987c1704fe5947309a438812d7. El CI requerido 39060130382 aprobó las pruebas, compilaciones, linters, migraciones efímeras y bundle; las cinco conversaciones quedaron resueltas sin bypass. Se actualizó main local con fast-forward, sin reset. Una nueva comprobación incluyó las 77 referencias actuales, sin commits de ramas pendientes; árbol limpio y sincronización 0/0.

Se detectó un error en el cuerpo del mensaje de esa fusión: al explicar que no se usaría la instrucción de omisión de CI, se incluyó literalmente dicha instrucción. GitHub la interpretó y no inició su CI de push, aunque las integraciones externas de Cloudflare y Vercel sí se activaron. No se modifica ni reescribe ese commit. Este cierre documental se publica mediante otro PR protegido y un mensaje de fusión breve, sin la instrucción, para permitir el flujo automático autorizado. No requiere cambios funcionales ni migraciones nuevas. La entrega confirma el hash final y el resultado real de cada automatización; no se sustituye por un despliegue manual.
