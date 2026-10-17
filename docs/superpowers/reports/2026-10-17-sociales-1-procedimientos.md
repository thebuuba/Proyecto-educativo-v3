# Sociales 1.º: procedimientos y protección del catálogo

Segundo bloque de la intervención, después de `be93440ccafa2d7c7d593c98af1fa5772dcb2fa3`. Sigue siendo **avance parcial** de Sociales 1.º. Sin push, merge, despliegue ni cambios de producción.

## Cambios y revisión

El proveedor compartido incorpora prevención física y digital: 31 grupos, 41 consignas y 164 ejemplos completos. Se añaden contratos de preguntas/hipótesis provisionales, confiabilidad de fuentes y noticia histórica; la prevención digital considera casos ficticios y no pide datos propios. El cotejo separa titular, entrada y cuerpo cuando se solicitan; un pie de foto sobre una imagen proporcionada no exige producir fotografías.

La revisión sustantiva de los instrumentos detectó y corrigió estos casos mediante pruebas que fallaron antes de la corrección:

- «Compartir» se confundía con «comparar»; ya no inventa comparación en una actividad de riesgos digitales.
- Justificar la selección de una fuente generaba una segunda argumentación genérica; ahora conserva una sola evidencia de confiabilidad.
- Se pedían contenidos vecinos al explicar una escala, los movimientos terrestres, el concepto de geografía o derechos constitucionales. Se delimitan al aspecto solicitado.
- «Orientación geográfica» y «escalas cartográficas» agregaban indebidamente el área general; las denominaciones específicas conservan su ámbito.

Se leyeron los contenidos y progresiones de las 31 rúbricas temáticas y de diez familias en los cuatro formatos: 71 instrumentos. Se registran sus huellas en `sociales-1-revision-instrumentos.json`; si cambia un ejemplo, pierde esa aprobación hasta revisarlo de nuevo. Quedan 93 ejemplos sin revisión individual. Esto no sustituye navegador ni acredita todas las variantes de la malla.

La correspondencia semántica manual agrupa los 113 registros conceptuales/procedimentales aplicables y justifica ocho exclusiones como temas evaluables: cuatro recursos sugeridos, dos encabezados y dos disposiciones personales. La transcripción literal permanece intacta. Los registros compuestos pueden corresponder a varios temas; los indicadores permanecen separados y no se equiparan automáticamente. **Agrupar un procedimiento no demuestra que todos sus productos y acciones estén implementados.**

## Catálogos y causa del503

El catálogo95 se preparó con el backend compilado contra una salida anterior de `shared`: contenía 29 grupos y políticaV1. Al recompilar todo el workspace, el Worker esperaba31 grupos/políticaV2; el guard devolvió503 antes de crear actividades. Fue un error de orden de preparación, no una migración pendiente ni credenciales del usuario.

Se preservaron intactos los releases94 y95, se congeló el95 realmente instalado y se avanzó a **evaluation-2026.96**. El96 se instaló únicamente en Development: `CREATED`, seguido de `UNCHANGED`. Sus 31 grupos/políticaV2 también se comprobaron mediante consulta SQL de solo lectura. Antes de instalarlo se compararon fuente y compilado y se verificaron los históricos: 28 releases/125 snapshots anteriores intactos.

El nuevo driver `install-current-development.mjs` reutiliza `seedEvaluationCatalog`, requiere versión explícita y manifiesto del código fuente; rechaza una salida compilada diferente **antes de acceder a DB**. Se probaron tanto versión no revisada como manifiesto discrepante. No se sobreescribió ni eliminó ningún release para corregir el fallo.

## Pruebas

En el96 se completaron ocho recorridos autenticados HTTP/DB: las cuatro muestras comparables del94 y cuatro de los procedimientos nuevos. Dos muestras por formato, con20/17.35 puntos. Guardado, reapertura, texto manual y cambio exclusivo de estrategia conservaron exactamente instrumento, snapshot, criterios y puntuación. No son recorridos visuales y la fuente oficial de Sociales aún no está publicada en la base.

Comprobaciones finales: `pnpm --filter backend test` **45.621 pruebas/135 archivos**, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build` aprobados. Cloudflare terminó exit0 en20,1s; dry-run, sin despliegue. Regresión focal:59 backend/catálogo y329 frontend aprobadas; frontend completo previo46.153/170, sin afirmar una segunda suite completa sobre este bloque. Lints aprobados;16 warnings frontend existentes.

La tanda de ocho casos midió recomendación media4561ms (3731–6793), interpretación4186ms y guardado/actualización3471ms (2166–5574). Una repetición posterior de solo lectura con las mismas cuatro descripciones, formatos, puntos y contexto del94 dio media7779ms (6291–9841), frente a3751ms en la tanda original del94. Se observó más latencia y una tendencia descendente en esa repetición; no basta para atribuir causa. El Worker confirma tiempos similares al cliente; no se trata únicamente de parsear la respuesta. La preparación pura local se mantiene alrededor de0,06ms. Pendiente aislar autorización, conexiones/consultas PostgreSQL y emulación local; no se aumentaron timeouts, alteraron TLS/DNS ni añadieron anuncios.

Verificación final de históricos de solo lectura: **28 releases y125 snapshots previos intactos**, ahora29 releases y133 snapshots. Estos incluyen las cuatro actividades QA del94 y las ocho del96; ninguna actividad del intento fallido del95. Asset final servido idéntico al compilado y exclusivamente Development. El driver conserva checkpoints por versión y rechaza reutilizarlos si cambia la consigna, el formato o los puntos.

Se repitió la reapertura de los ocho casos sobre la compilación final, sin nuevas actividades ni cambios del instrumento. La paridad de las dos correcciones finales de ámbito se comprobó además en contratos de servidor/alternativa local.

## Fuentes complementarias localizadas

La búsqueda independiente encontró los cuatro diseños oficiales de la modalidad Artes y el índice de familias Técnico Profesional; URLs y páginas en `fuentes-complementarias.json`. Se distinguen documentos localizados de tablas revisadas e instrumentos implementados. Pendiente contrastar versiones, vigencia y presencia por grado; no se sustituyen menciones por Educación Artística común ni familias por asignaturas. Fuentes: [índice de Artes](https://www.ministeriodeeducacion.gob.do/sobre-nosotros/areas-institucionales/direccion-de-educacion-modalidad-en-artes/diseno-curricular?page=2) e [índice Técnico Profesional](https://ministeriodeeducacion.gob.do/sobre-nosotros/areas-institucionales/direccion-de-educacion-tecnico-profesional).

## Limitaciones y continuación

La fuente PDF244–248 se revisó visualmente y todos los registros se agruparon o excluyeron con justificación, pero su publicación en Development y referencias HTTP siguen pendientes. Falta revisar variantes como comprobación de hipótesis, silogismos, productos gráficos, diálogo socrático, investigación del contenido y no solo de sus fuentes, uso de GPS, cálculo de escalas y regularidad observada. No marcar el grado terminado por cero registros sin agrupación o por pruebas aprobadas.

Navegador disponible; la cuenta personal está confirmada y no bloqueada en Development. Se solicitó el nuevo enlace expresamente autorizado y la aplicación confirmó el envío; pendiente que el usuario lo abra. No se leyó/cambió contraseña ni se copió una cuenta. No se modificó producción.

Se observó un cierre del Worker local después de un errorEPERM del watcher de assets yECONNRESET durante recompilación. Se comprobó que no hubiera listener ni proceso reutilizado, se recompiló con el Worker detenido y se arrancó la salida final con `wrangler dev --local`, guard completo de Development y comparación del asset servido. No se borraron cachés, service workers, borradores ni almacenamiento del navegador.

Diff y secretos revisados; archivos privados/QA/respaldos excluidos de Git. Segundo commit local: identificar por el mensaje «Amplía procedimientos de Sociales y protege la instalación del catálogo». Continuar según [archivo maestro](2026-10-17-secundaria-continuacion.md). Pushes pendientes por orden del usuario; no cambiar integraciones ni inferir despliegues de producción a partir de checks/builds observados. Workers triggers continúa sin verificación por HTTP403.
