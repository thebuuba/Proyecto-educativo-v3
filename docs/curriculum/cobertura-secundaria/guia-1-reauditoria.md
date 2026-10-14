# Guía turística de Lengua Española 1.º: reauditoría del núcleo

Fuente: revisión visual de PDF 70–71 / impresas 69–70. PDF 70 empieza con una continuación de procedimientos de noticia; PDF 71 continúa guía antes del informe de lectura. Se conservan los ocho procedimientos revisados; no se reasignan relaciones entre columnas por proximidad.

## Fallos reproducidos y correcciones

- 34 regresiones iniciales: niveles genéricos, indicadores nominales, Parcial sin significado específico, fotografías impuestas aunque se solicita mapa o fotografías, preguntas añadidas a una presentación que no las solicita.
- El detector interpretaba redactar un informe sobre una guía como crear una guía. La regla compartida reconoce el informe; en guía se implementa evidencia específica del análisis y organización del informe. En cuento/caligrama/afiche, cuya familia de informe aún no está contextualizada, se evita imponer la creación del texto y se mantiene cobertura pendiente.
- Una noticia mencionada en un informe sobre guía desplazaba el módulo de guía. Resolución de género unificada entre detector, servicio y alternativa local.
- Doce regresiones adicionales de alternativa: «guías turísticas» en plural perdía el proveedor contextual. La resolución compartida reconoce singular/plural.
- Prueba HTTP normal fallida: «analizarán ... explicarán» se interpretaba como presentación. Nueva regresión y prioridad del análisis cuando no se pide exposición/presentación oral.
- Segunda reproducción HTTP precisó un falso positivo: el adjetivo «presentes» activaba presentar. Regla de acciones distingue el adjetivo de las formas verbales; se preserva la presentación oral explícita.

Proveedor compartido en `secondary-guide-grade-one.ts` y `secondary-topics/language/guide-grade-1-core.ts`; wrapper del backend sustituye la duplicación. Cinco familias: creación, análisis, comparación, presentación e informe. Recurso visual adicional únicamente cuando la consigna lo solicita; respeta las alternativas. Formatos y pesos utilizan la adaptación compartida del bloque .11.

## Entorno y evidencia

Catálogo `evaluation-2026.12`, `.11` archivado. Instalación/reinstalación local idempotente y huellas de todos los releases anteriores conservadas. Frontend 5173, backend 3000, Auth/DB/Storage Supabase local 54321/54332. Buckets locales confirmados: imágenes de descripción y recursos de asignatura; no se ha probado subida de archivos en este bloque.

- Backend: 1.044 pruebas / 40 archivos aprobados, incluidas 45 regresiones de guía; frontend: 611 / 82 archivos aprobados, incluidas 17 pruebas de alternativa, plurales, puntaje pendiente y edición manual.
- Builds backend/frontend y Cloudflare dry-run aprobados. Sin despliegue, reset ni modificación de base remota.
- 80 propuestas mediante el proxy y login real: cinco familias × cuatro formatos × dos totales × títulos original/neutral. Cotejo/escala con evidencias observables; ponderada con significado específico de Parcial.
- Cuatro formatos comparten contenido y distribución exacta entre servicio y alternativa, comprobado por pruebas de equivalencia.
- Navegador normal: elección manual de ponderada antes de completar la descripción, seis criterios (incluido recurso visual), 17,35 puntos, resumen, confirmación, guardado y reapertura. La elección del docente se conserva. API confirma snapshot .12 y evidencia parcial en cada fila.
- Células/Ohm: 32 propuestas del servicio normal .12; actividades históricas .10 y noticia .11 recuperadas con sus snapshots intactos.

[80 instrumentos íntegros](evidencias/guia-1-servicio-normal.json), [cuatro instrumentos completos de creación](guia-1-instrumentos-completos.md), [actividades persistidas](evidencias/guardados-navegador-normal.json), captura `evidencias/guia-1-navegador-normal.png`.

Durante el QA, el health identificó base `82488d15fb9da7a33809609f0635c06e937771ea` con cambios de este bloque. Reiniciar `pnpm dev:local` después del commit para identificar la versión publicada. Repositorio `thebuuba/Proyecto-educativo-v3`, rama `amplia-instrumentos-secundaria`.

## Pendientes

No se declara completa Lengua 1.º. Guía: completar análisis muy focalizado, requisitos gramaticales, varios medios visuales simultáneamente solicitados y navegador de los otros tres formatos. Noticia mantiene los pendientes de su informe. Siguiente tema: informe de lectura 1.º (PDF 71–72), seguido de afiche, cuento policíaco y caligrama, Lengua 2.º–6.º y el resto del encargo.

La descripción original de trigonometría 6.º se conserva en `data/evaluation-instruments/trigonometry-user-control.json`, todavía pendiente de implementación. La matriz distingue inventario, extracción, motor, formatos, servicio e interfaz y conserva todos los módulos restantes como pendientes.
