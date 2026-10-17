# Francés común — 3.º de secundaria

Actualización posterior: se verificaron cuatro formatos nuevos vinculados a la fuente francesa instalada en Development. Los snapshots iniciales descritos en este informe permanecen intactos y conservan sus referencias históricas nulas. [Cierre de fuente](frances-fuente-development.md), [evidencia y preservación](frances-fuente-verificacion.json).

## Alcance

Proveedor `frances-comunicacion-3`, catálogo `evaluation-2026.72`. MINERD 2023, PDF 189–192 / impresas 188–191, ámbito común `06576745-46a4-56a3-9dc8-cff915975251`. [Inventario visual](frances-inventario.md) y [texto oficial separado de la cobertura](frances-matriz.json). Criterios adaptados por AulaBase.

Funciones: ubicación de personas/lugares/objetos; indicaciones de recorrido cuando se solicitan; condiciones atmosféricas; actividades en curso; planes futuros. Las acciones actuales y futuras tienen progresiones distintas, sin exigir un relato pasado ni una rutina habitual. Las condiciones del tiempo no imponen temperatura, estaciones, recursos gráficos o cifras si la consigna no los solicita.

Gramática explícita: presente, imperativo, preposiciones, interrogativos y formas de interrogación, negación, exclamación, artículos contractos, adverbios de modo, verbos impersonales, être en train de, futur proche y existencia/ausencia. Los pronombres personales/tónicos no se incorporan como familia gramatical de este grado por aparecer en grados anteriores.

Léxico explícito: ciudades/países/continentes, puntos cardinales, lugares/comercios, transportes, unidades métricas, números, cortesía, accidentes geográficos, fenómenos/temperatura, estaciones, actividades cotidianas/de ocio/de aula, fechas/celebraciones y referencias temporales. Formularios, mensajes, avisos y versos conservan las adaptaciones francesas compartidas; revisión del borrador solo cuando se pide. Croquis/indicaciones pueden ser fuentes de comprensión del recorrido; no se exige producir un croquis por usarlo como fuente.

## Reconocimiento y límites

Se mantienen las reglas acotadas de [1.º](frances-1.md). Patrones propios: ubicación/où se trouve, indicaciones del camino/indications du chemin/itinéraire, tiempo atmosférico/clima/météo/conditions atmosphériques, actividades en curso/activités en cours, planes futuros/projets futurs/projets pour. «Indiquez» reconoce una acción sin presuponer oralidad. Las consignas describen/leen/escuchan/escriben/intercambian; no basta un nombre propio o un ejemplo citado.

La descripción domina sobre un título incompatible. Oral y escrito obligatorios conservan ambas evidencias; o/ou autoriza una alternativa. Negaciones reconocidas excluyen acciones, no añaden productos. Una petición directa de escribir/identificar vocabulario o términos no se convierte en un informe completo sobre el tema de esas palabras; la regresión reproduce y corrige ese exceso en fenómenos atmosféricos. No se afirma comprensión universal de expresiones implícitas. Selecciones manuales de tipo/instrumento y estrategia prevalecen; no se fuerza estrategia ante una consigna sin evidencia.

## Verificación y ejemplos

Las pruebas focalizadas de 1.º–3.º pasan: **354 backend y 303 frontend**. Backend completo: **37.194 / 96 archivos**. Contratos por grado cubren 12 casos, cuatro formatos, 20/17.35, título incompatible, recepción/producción/interacción, texto mixto, alternativas y negaciones. Regresiones de editor: puntuación pendiente, completar solo vacíos, manuales, adición única, agotamiento y límite veinte. Backend, frontend y Cloudflare pasaron sobre el ajuste final; [evidencia](frances-3-verificacion.json).

HTTP/DB: 12 interpretaciones y 24 recomendaciones, más cuatro formatos guardados/editados/reabiertos. Actividades QA: `d122dfa2-966d-4d68-b729-b150aedcbaff`, `9fdb3519-d968-4765-9e41-c385a80e868b`, `c2aca952-edde-41c9-955f-98c6c1ca4208`, `96c8197a-7727-4d32-a3b9-09b7a3f1e823`. Texto y pesos manuales, identidades y snapshot conservados exactamente al cambiar solo estrategia. Tras el build final: cuatro recomendaciones y reapertura de las cuatro actividades con hash idéntico, sin duplicar guardados. Catálogo instalado `CREATED`/`UNCHANGED`; cuatro releases previos preservados. PostgreSQL/Auth/Storage/frontend continúan en Development y los assets HTTP coinciden con el build.

[Cuatro instrumentos completos](frances-3-ejemplos.md) para un intercambio sobre planes de vacaciones: diferencian el contenido futuro, la relación de turnos y la comprensibilidad oral. Rúbrica con progresión, cotejo verificable, escala por grado de cumplimiento y ponderada con cumplimiento parcial; no añaden itinerario, presupuesto ni reservas a esa consigna.

QA HTTP/DB y navegador se registran por separado. Navegador aislado para QA no disponible; Chrome mantiene la sesión personal y un asset anterior a Francés. Pendiente visual: en una sesión separada de localhost:8787, cuenta QA Development, seleccionar `3.º secundaria QA Francés Development / QA Francés / Francés`; seguir los ejemplos con cada formato, comprobar estrategia automática/manual, puntaje vacío→20→17.35, texto/peso manual, guardar/reabrir y cambiar únicamente la estrategia. Guardar cualquier edición personal pendiente antes de recargar. No limpiar almacenamiento.

## Archivos y conservación

Límite de procedencia: Development no contiene versiones en `curriculum_versions` (consulta de solo lectura). El proveedor usa las adaptaciones del PDF local y el contexto académico, con catálogo evaluativo versionado; las referencias curriculares DB del snapshot quedan nulas. Una vinculación curricular DB no está acreditada ni se inventa. No se rellenan retrospectivamente los snapshots guardados.

`secondary-french-grade-3.ts`, selección compartida en `secondary-french.ts`, reconocimiento de «Indiquez» en `secondary-french-task.ts`, contratos de 3.º y suites comunes. `.71` se congela en `catalog-v71.ts`; el nuevo release se instala idempotentemente solo en Development. No se modifica esquema, producción, cuentas anteriores ni snapshots históricos. Scripts QA impiden duplicar escrituras tras una interrupción.
