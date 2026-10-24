# Requisitos transversales de presentación, estructura y entrega

Estado: mejora compartida implementada y verificada, con los límites de rutas genéricas indicados abajo. No es cierre de asignaturas ni ampliación curricular. Trabajo del coordinador solo; sin agentes ni revisión independiente.

Encargo íntegro: `../specs/2026-10-24-requisitos-transversales-literal.txt`. Plan: `../plans/2026-10-24-requisitos-transversales.md`. Base `ce665430`, rama `ampliacion-de-instrumentos-2`, árbol inicialmente limpio y 46 commits locales adelantados. Sin push, merge, despliegue, nuevas dependencias, migraciones ni cambios de credenciales.

## Diagnóstico y decisión

El extractor anterior conserva clave/etiqueta, mezcla ámbitos, restringe los nombres de fuente, omite propiedades y lanza excepciones para algunos límites contradictorios. Los proveedores y el piloto consumen esa información con diferencias; la ruta genérica local no pasaba por la misma reconciliación. El grafo disponible no contiene los módulos recientes del piloto: se contrastaron archivos y llamadas actuales, sin reconstruir el grafo.

Antes de corregir se fijaron once consignas y expectativas en `data/evaluation-instruments/presentation-requirements/cases.json`. `before.json` conserva instrumentos completos anteriores de servidor y alternativa local, incluidos cuatro formatos del huerto; el caso contradictorio producía una excepción. La prueba inicial del huerto falló porque la estructura solo decía «cuerpo que desarrolla los datos», sin los tres párrafos. También faltaban la declaración fiel y atribuida y la negrita del titular.

## Cambios compartidos

- `task-presentation-requirements.ts`: contrato interno con propiedad, valores, unidad, ámbito, operador, relación y origen literal. Registra conflictos y ambigüedades; no los convierte en errores del formulario ni los resuelve con valores predeterminados. Se enmascaran citas y ejemplos antes de extraer instrucciones.
- `task-requirement-criteria.ts`: reconcilia las condiciones con los criterios temáticos. Mantiene cantidades en estructura/evidencias cuando corresponde, conserva los componentes de cotejo de los proveedores y evita repetir la puntuación. Una condición indivisible se integra con evidencia pertinente, en lugar de inventar una progresión propia.
- `task-delivery-requirements.ts`, conversores de criterios y tipos compartidos: conectan la capa, conservan identificadores de requisitos y los proyectan en las propuestas editables.
- `recommendation-engine.ts`, servicio HTTP y `instrumentPreparation.ts`: conexión servidor, propuestas de proveedores, piloto y alternativa genérica local. Las propuestas con condiciones explícitas no pasan al refinamiento IA.

No se inspeccionan archivos entregados. Se interpreta la consigna para que el docente disponga de condiciones verificables; no se afirma que las fuentes estén instaladas ni que las referencias cumplan automáticamente una norma.

## Cobertura y límites del lenguaje

Se comprueban formatos explícitos, nombre de archivo, entrega digital/impresa; fuente y tamaño dinámicos; negrita/cursiva/subrayado/color; interlineado, alineación, sangría y separación; márgenes generales y por lado; papel/orientación/numeración; extensión y exclusión de portada; secciones; cantidades y ubicación de imágenes/tablas/gráficos, pies, citas, atribución, bibliografía y estilo indicado.

Se conservan alternativas, opciones, negaciones y condiciones. No se puntúan como obligatorios los recursos opcionales; los requisitos contradictorios o sin valor identificable quedan en la traza interna. La gramática es acotada: no promete comprender cualquier formulación, unidades, tipografías o nombres de sección. La distinción de texto narrativo y órdenes también se comprueba con ejemplos negativos.

Los normalizadores antiguos de consignas enteramente francesas siguen siendo una ruta particular: traducen un vocabulario acotado de entrega antes de generar criterios. Los límites franceses comunes de páginas se reconocen también con su origen original. No se declara trazabilidad literal completa de cualquier traducción de esos normalizadores.

La comparación inicial detectó diferencias temáticas previas en rutas genéricas no reconocidas por un proveedor. El contrato de presentación coincide; algunas filas genéricas completas no son idénticas. Los casos son `page-delivery`, `bounds`, `custom-font-format`, `optional-negative`, `brief` y `dynamic-variants`. Los seis ya diferían en `before.json`; no se sustituyen globalmente sus criterios temáticos para forzar igualdad. No se declara paridad integral de esas rutas.

## Valores y formulaciones verificados

| Ejemplo | Interpretación conservada |
|---|---|
| Arial13; letra Arial tamaño14; fuente Calibri de11puntos | Nombre y valor dinámico; sin enumerar tamaños permitidos |
| Aptos13,5puntos; título18 y cuerpo12 | Tamaño general y dos ámbitos específicos; sin conflicto entre secciones |
| Liberation Serif10.5; Garamond11,75; subtítulos15.25 | Fuentes/valores adicionales sin modificar reglas entre casos |
| Interlineado1.5/1,5, sencillo/doble; sangría1,25cm; separación6pt | Valor y unidad originales; las etiquetas de compatibilidad antiguas pueden normalizar la notación decimal |
| Word o PDF; Grupo_2_Datos.docx; digital/impresa | Alternativa en una condición; nombre y extensión; modalidad de entrega |
| Entre2y4páginas sin contar portada; máximo800palabras | Operador, límites, unidad y exclusión |
| Mínimo una página y máximo tres; mínimo una y máximo tres páginas | Unidad compartida sin perder el límite elidido ni trasladar cantidades de otra unidad |
| Tres párrafos en cuerpo; mínimo dos en introducción | Cantidad en su sección, no en toda la entrega |
| Márgenes2,5cm y lado izquierdo3cm; A4/carta; horizontal/vertical | Condición general y excepción por lado; papel y orientación |
| Numeración abajo a la derecha desde página2 | Posición e inicio separados |
| Dos imágenes con sus respectivos pies en desarrollo | Cantidad, ubicación y pie correspondiente a cada imagen; sin habilidad artística |
| Referencias en estilo APA7 | Estilo solicitado, sin validación normativa automática |

El banco conserva11consignas; la evidencia final incluye17propuestas servidor/local y8instrumentos completos leídos. Todos los contratos de condiciones coinciden. En11pares también coincide el contenido completo proyectado, incluidos los cuatro formatos del huerto y los cuatro de Ciencias. Los otros6mantienen las diferencias genéricas preexistentes descritas arriba. `parity.json` conserva ambas conclusiones por caso/formato; no se aprueba cobertura por una palabra aislada.

## Huerto: antes y después

| Evidencia | Antes | Después |
|---|---|---|
| Datos, cantidades y destino | Información genérica | Cantidades proporcionadas, ausencia de invención y para qué se usaron los productos, en información esencial |
| Estructura | Cuerpo que desarrolla datos | Titular, entrada que resume y tres párrafos exclusivamente en cuerpo |
| Declaración | Sin condición completa de incorporación | Fidelidad, comillas y atribución a la estudiante, integradas con información |
| Lengua | Criterios temáticos existentes | Conectores/tono, ortografía y puntuación conservados; sin duplicar fidelidad de la cita |
| Presentación | Omisiones de ámbito y negrita | Word, Arial12, interlineado1.5 y negrita solamente en titular |

Siete criterios; la presentación pesa0.87/20en la propuesta estándar. Se conservan criterios de contenido y no se exigen borradores, fotografías, entrevistas ni fuentes nuevas. El cotejo agrupa indicadores verificables; rúbrica/escala mantienen progresión de desempeño; la ponderada conserva el parcial global50% preexistente, sin convertirlo en porcentaje de requisitos contados. Los instrumentos completos y la lectura pedagógica están en `data/evaluation-instruments/presentation-requirements/instrumentos-representativos.md` y `revision-pedagogica.md`.

## Rutas conectadas y excepciones

| Ruta | Comprobación |
|---|---|
| Servidor autorizado: interpretar/recomendar | Contexto y catálogo conservados; `recommend` anota el contrato y `withDeliveryCriteria` reconcilia antes de puntuar |
| Proveedores locales | `editableAuthoredRecommendation` consume la misma reconciliación |
| Compositor compartido del piloto | Conservado; reutiliza la capa y evita añadir dos veces las filas generadas |
| Alternativa genérica local | Conectada conservando sus progresiones específicas, sin reemplazarlas por descriptores genéricos nuevos |
| Cotejos con componentes propios | Se conservan subindicadores e identidades; una cantidad se vincula una sola vez |
| Normalizador francés antiguo | Vocabulario acotado de entrega; no se promete trazabilidad literal integral de traducciones arbitrarias |
| Rutas genéricas sin proveedor reconocido | Condiciones iguales; pendientes las6diferencias temáticas completas documentadas |

## Pruebas automáticas

- Backend completo final:98362pruebas,249archivos, cero fallos. Se repitió tras la guarda final de conflictos.
- Frontend completo:95216pruebas,226archivos, cero fallos. Después de la última guarda y el ajuste de pies se repitieron las318pruebas focalizadas del editor, también aprobadas.
- Regresión específica:30pruebas, con fallos previos observados para huerto y para la portada contradictoria. Los contratos previos del piloto permanecen comprobados.
- `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`: aprobados sobre el código final. Cloudflare se ejecuta con `--dry-run`; no hubo despliegue.
- Lint backend/frontend y ocho archivos compartidos modificados: aprobados. El lint compartido completo mantiene8errores en5archivos sin cambios respecto de `ce665430` (Inglés4/5/6, Francés3 y núcleo antiguo de noticia1). No se corrigieron archivos ajenos al encargo para ocultar ese pendiente.

Las primeras ejecuciones detectaron y permitieron corregir fuentes académicas confundidas con tipografía, estilo directo confundido con bibliografía, pérdida de componentes de cotejo, límites con unidad elidida y ubicación convertida en sección adicional. Se verificó contra el commit base que la selección de la primera fila en la prueba de inferencias y el texto esperado antiguo de noticia ya estaban desactualizados; se comprobaron sus evidencias específicas sin cambiar las consignas.

## Prueba HTTP en Development

Cuenta QA existente, separada del navegador personal. Cinco contextos ya existentes: LEN1/rúbrica, ING2/cotejo, MAT2/ponderada, NAT-TU1/escala y SOC2/rúbrica. Interpretación y recomendación devolvieron200; los contratos serializados coinciden con la alternativa local, con1735unidades y puntos inicialmente pendientes. La comparación normaliza únicamente la ausencia JSON de propiedades opcionales `undefined`.

Se creó una sola actividad QA identificable, con texto y puntos editados, y se reabrió por HTTP con todos sus campos exactamente iguales. Evidencia pública: `http.json`; IDs, cuenta y diario de escritura permanecen privados e ignorados por Git.

## Prueba visual con la cuenta personal

Al inicio no había sesión autenticada disponible. Más tarde una pestaña nueva recuperó la sesión existente de Alexauris; se confirmó el correo en el perfil y LEN1por consulta de solo lectura. No se cambió contraseña ni se solicitaron correos. Esto no demuestra que el acceso por contraseña se haya resuelto.

Se abrió un formulario vacío, sin restaurar ni reemplazar un borrador anterior. Se pegó la descripción del huerto desde el banco fijo. Se comprobó:

1. Estrategia visible; actividad «Redacción de noticia», técnica «Análisis de producciones» y rúbrica de7criterios preparados silenciosamente. Puntaje inicial vacío.
2. Asignación explícita de17.35; selección manual de ponderada y preparación completa de7filas.
3. Edición del título del primer criterio y pesos30/25/10/10/10/10/5. Puntos guardados en centésimas:520/434/174/174/173/173/87, suma1735.
4. Cambio de estrategia a «Estudio de caso»: los22campos visibles y la tabla del instrumento quedaron exactamente iguales.
5. «Generar nuevo instrumento» mostró confirmación; «Conservar cambios» dejó todos los valores intactos.
6. Una sola confirmación de guardado; «Actividad creada». Reapertura por la ruta contextual del editor del registro guardado:22campos y tabla idénticos, título manual, pesos, estrategia manual y17.35conservados. No se volvió a guardar al reabrir.

Muestra personal: `FICTICIA PERSONAL REQUISITOS 2026-10-24 · El huerto escolar da su primera cosecha.` Es un registro nuevo, distinto del QA. Los borradores previos permanecieron listados; no se vació almacenamiento ni service worker. Evidencia pública sin identificadores personales: `browser.json`; captura y diario completos en `.wrangler/realistic-audit/`, excluidos de Git.

## Datos y entorno final

Development exclusivamente: `eolgunypmtgrsyrjzcld`, PostgreSQL `app_backend_local`, sin bypassRLS; Auth/Storage200y frontend del mismo proyecto. Catálogo `evaluation-2026.173`, sin instalar ni migrar otro release.104releases históricos conservan sus huellas. Los1282snapshots iniciales permanecen idénticos; final1284por las dos muestras nuevas. Las15actividades personales de control conservan instrumento, snapshot, referencias, puntaje, estrategia y texto manual, sin duplicados.

Se verificaron los bytes servidos contra el build, incluidos entry `index-BtlTzshk.js`, editor `ActivityEditorWorkspace-B47Phu-g.js`, piloto `instrumentos-composicion-piloto-AgQb31IK.js` y service worker. Chrome cargó ese entry. Una sola instancia en8787. `runtime.json`, `verification.json` y `preservation.json` conservan evidencia saneada.

## Pendientes reales y Git

- Revisión de seguridad del diff: 41 archivos comprobados, UTF-8 válido y cero coincidencias con los nueve valores privados verificados. Secretos, credenciales QA, respaldos, capturas y diarios privados quedan excluidos de Git; no cambian dependencias, migraciones ni configuración de producción. `git diff --check` sin errores.
- Armonizar el contenido temático de las6rutas genéricas, en un trabajo acotado posterior; aquí se conservan sus criterios y se documentan las diferencias.
- Ampliar la trazabilidad de normalizadores franceses solo si se encarga; la gramática actual es acotada.
- Los8errores heredados de lint compartido siguen pendientes. Los archivos modificados no introducen errores de lint.
- Persisten el antecedente de DNS intermitente del pooler y cabeceras de caché contradictorias anteriores. No se cambió infraestructura ni se afirma inspección completa de CacheStorage. El recorrido final funcionó; no se afirma corregido el acceso por contraseña.

Rama `ampliacion-de-instrumentos-2`, base `ce665430`. Cambios y evidencia se cierran mediante commit local en español; hash y estado final se entregan tras confirmar Git. Sin push, merge, despliegue, resets, nuevas cuentas, credenciales QA en Git ni cambios de producción. No se retoma la ampliación curricular.
