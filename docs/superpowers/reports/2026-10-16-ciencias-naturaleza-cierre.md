# Ciencias de la Naturaleza común: cierre de primero a sexto

Se conectaron y verificaron los seis grados comunes mediante generación determinista. La matriz separa inventario, conexión al motor, revisión de instrumentos completos, contratos, HTTP/DB y clics reales. No se amplió otra asignatura ni optativas. Se detiene el encargo después de sexto.

| Grado | Componente oficial | Páginas PDF / impresas | Grupos | Consignas / instrumentos | Estado |
| --- | --- | --- | ---: | ---: | --- |
| 1.º | Ciencias de la Tierra y el Universo | 293–295 / 292–294 | 29 | 68 / 272 | Verificado en los patrones definidos; cuatro formatos HTTP/DB y navegador |
| 2.º | Ciencias de la Vida | 296–299 / 295–298 | 30 | 68 / 272 | Verificado en los patrones definidos; cuatro formatos HTTP/DB y navegador |
| 3.º | Ciencias Físicas | 300–304 / 299–303 | 50 | 103 / 412 | Verificado en los patrones definidos; cuatro formatos HTTP/DB y navegador |
| 4.º | Biología | 312–315 / 311–314 | 48 | 104 / 416 | Verificado en los patrones definidos; cuatro formatos HTTP/DB y navegador |
| 5.º | Química | 316–318 / 315–317 | 51 | 102 / 408 | Verificado en los patrones definidos; cuatro formatos HTTP/DB y navegador |
| 6.º | Física | 319–322 / 318–321 | 63 | 126 / 504 | Verificado en los patrones definidos; cuatro formatos HTTP/DB y navegador |

Son **959 registros literales, 271 grupos y 571 consignas con 2.284 instrumentos completos de ejemplo revisados**. Las exclusiones de encabezados/procesos están justificadas; no quedan conceptos/procedimientos pendientes de mapear o excluir. La [matriz](../../curriculum/cobertura-secundaria/ciencias-naturaleza-matriz.json) conserva fuente, páginas, indicadores y familias. Cada grado tiene sus archivos de instrumentos y revisión científica: son adaptaciones de AulaBase, no rúbricas oficiales del MINERD. Las consignas definidas no representan toda redacción imaginable.

## Cambios y causas

- Proveedor compartido y proveedores por grado en packages/shared/src/secondary-science-*.ts. La descripción prevalece, se delimitan acciones/alternativas/negaciones y se evita imponer procedimientos o productos relacionados que no se solicitan. Cada formato adapta realmente su evidencia y progresión.
- Integración en recommendation-engine.ts, evaluation-instruments.service.ts, instrumentPreparation.ts y activityDefaultSuggestions.ts, con contratos comunes y paridad del servicio y la alternativa local. Catálogos 85–91 congelados; evaluation-2026.92 instalado realmente e idempotente, con las seis fuentes comunes aisladas por grado.
- ActivityCreator.tsx conserva el instrumento manual de un borrador compatible tras reconocer explícitamente su revisión. La condición anterior impedía conservarlo después de añadir un criterio solicitado por una descripción ampliada. Se mantienen restricciones de modalidad, formato y referencias.
- activities.controller.ts, activities.service.ts y activitiesService.ts cargan el contexto ligero del creador sin descargar instrumentos/snapshots de todo el centro. Permisos y endpoint general conservan su contrato.
- activities.service.ts elimina relecturas y validaciones redundantes dentro de la transacción: los fallos reales de escala y estrategia eran expiraciones. La respuesta usa las escrituras efectivamente realizadas; no se aumentó el timeout ni se quitó atomicidad o validación bajo bloqueo. Se añadieron siete regresiones de persistencia.
- Scripts science-*.mjs reproducen fuentes, revisión, contratos, instalación limitada, HTTP/DB e historia. Matriz, informes por grado y pruebas detallan las correcciones científicas y límites.

## Entorno y datos conservados

Destino exclusivo de localhost:8787: **AulaBase Development eolgunypmtgrsyrjzcld**. PostgreSQL app_backend_local sin bypass RLS, Auth, Storage y variables públicas del frontend se verificaron otra vez al cerrar. La entrada /assets/index-BLaW9Yd6.js y assets/sw coinciden por SHA con dist; el navegador personal cargó esa entrada. Un único servidor local activo. Producción, sus secretos, Hyperdrive y datos no se modificaron. No hubo migración de esquema, reset, copia de usuarios, despliegue ni merge.

La consulta final de solo lectura confirma las huellas de los **18 releases y 73 snapshots iniciales**, y de los **24 releases y 106 snapshots del inicio de sexto**. Respecto al inicio hay siete releases y 48 snapshots adicionales de versiones/QA de los distintos grados; no son reescrituras del histórico. Total final: 25 releases/121 snapshots. No se borraron cuentas, actividades, borradores ni instrumentos previos.

## Pruebas separadas por capa

- Automáticas sobre el código final de sexto: backend 45.248 pruebas/108 archivos; frontend 45.637/131. Backend build 0/5.933 ms, frontend build 0/16.443 ms; **pnpm cloudflare:build 0/86.042 ms**, terminado naturalmente. Incluye seis grados, cuatro formatos, 20/17,35, puntos inicialmente vacíos, pesos manuales, añadir/completar, agotamiento, veinte criterios y respuestas obsoletas. Los intentos de CLI interrumpidos anteriores siguen registrados como incidencias, no aprobaciones. Este cierre posterior modifica solo documentación/evidencia, por lo que no se repitieron suites completas sin cambios de código.
- HTTP/DB: cuatro formatos por grado guardados y reabiertos con identidad/snapshot correctos; cambio exclusivo de estrategia con definición exacta. Recheck final de sexto con catálogo 92 y regresiones FRA/ING/MAT/Ciencias1–5 aprobado. Las fuentes y releases se instalaron CREATED→UNCHANGED. Los JSON por grado conservan tiempos, controles y huellas.
- Navegador: cuatro formatos por grado mediante generación, edición, guardado y reapertura desde el entorno habitual. En cuarto se conservó la rúbrica 90 y se revisó el cotejo original a remoto 92 con sus cinco campos exactos, sin duplicarlo. Quinto y sexto se probaron con la cuenta personal, distintos del contexto QA HTTP; snapshots 92 y fuente/scope correctos confirmados por DB de solo lectura. Rúbricas de cuarto/quinto y ponderada final de sexto reabiertas en editor; otros formatos también se contrastaron en la pestaña Instrumento, que presenta claves/valores. El método exacto consta por caso: no se atribuye una tabla editable a esa vista de configuración.
- Se comprobó preparación silenciosa, controles visibles, selección manual prioritaria y estrategia sin modificar instrumento. Pregunta/hipótesis/experimento de quinto recomendó indagación. En sexto, la formulación con práctica sin búsqueda/experimentación explícita quedó sin estrategia automática; no se inventa una recomendación. La elección manual sí se conserva. Completar solo rellena el campo vacío de una fila compatible y ofrece recuperación manual si el texto editado ya no corresponde al candidato.
- Revisión del diff, JSON y caracteres UTF-8; secretos, respaldos y credenciales QA excluidos de Git. Captura real del editor final en [ponderada reabierta de sexto](assets/ciencias-naturaleza-6/ponderada-reabierta.jpg).

## Rendimiento y límites reales

Generación pura, 200 muestras: quinto p50 0,1546/p95 0,2595 ms; sexto p50 0,2639/p95 0,4843 ms. Excluye Auth/DB/HTTP/render. HTTP de recomendación de sexto: 4.957–8.118 ms en la muestra QA; en quinto hubo hasta 47.688 ms y guardados fallidos por expiración antes de corregir las relecturas. En las pruebas personales posteriores se observaron recomendaciones de varios segundos. No se aisló SQL frente a red/render ni se acredita mejora global de latencia.

La lista global de Actividades mostró timeout; se completaron los recorridos desde Cursos → asignatura. Tres caídas posteriores del runtime por DNS ENOTFOUND del pool Supabase se recuperaron al volver a resolver el mismo host y reiniciar un único servidor verificado; Reintentar no recuperó una página con módulo rechazado y fue necesaria recarga normal. No se cambiaron DNS del sistema, proyecto, secretos ni datos. Son incidencias de disponibilidad todavía abiertas, aunque no impidieron terminar los casos definidos.

No se inspeccionaron registros privados del service worker/caché del navegador; sí assets/sw servidos y DOM efectivos, sin borrar almacenamiento. No se asegura interpretación universal ni ausencia de toda incidencia de red o timeout. No quedan verificaciones funcionales pendientes en la muestra definida de Ciencias; las limitaciones anteriores no se presentan como resueltas.

## Publicación y continuidad

Rama amplia-instrumentos-secundaria. Bloques publicados mediante push normal: primero 38bc31d2, segundo bad192ba, tercero 29a78352, cuarto abe812eb, quinto 5010f9a6, sexto d93c24a5; cierre visual de cuarto 10adefb3 y quinto 407ce8a0. El commit que contiene este cierre registra la evidencia final de sexto; consultar Git para su hash y sincronización final, confirmados también en la entrega. Sin merge ni despliegue.

Informes: [1.º](2026-10-16-ciencias-naturaleza-1.md), [2.º](2026-10-16-ciencias-naturaleza-2.md), [3.º](2026-10-16-ciencias-naturaleza-3.md), [4.º](2026-10-16-ciencias-naturaleza-4.md), [5.º](2026-10-16-ciencias-naturaleza-5.md), [6.º](2026-10-16-ciencias-naturaleza-6.md). [Estado de continuación](2026-10-16-ciencias-naturaleza-continuacion.md). Ciencias Sociales queda para otro encargo.
