# Fase C.1 — auditoría de calidad y regresión

## Comportamiento real antes de los cambios

- `recommendation-engine.ts` detecta el tipo pedagógico mediante disparadores del catálogo (con tolerancia acotada a erratas), o respeta la elección explícita del docente. La familia y evidencia del tipo participan en el filtro de plantillas y en la regla que recomienda rúbrica, lista de cotejo, escala o lista ponderada.
- `curriculum-context.ts` resuelve un único ámbito por nivel, ciclo, grado, asignatura, modalidad y salida optativa. `rankCurriculum` solo puntúa elementos de ese `scopeId` y `versionId`; exige coincidencia temática. Con baja confianza no selecciona referencias; una selección manual solo admite IDs del mismo ámbito.
- Los criterios se eligen del catálogo versionado `evaluation-2026.1` por área, banda, familia, evidencia, condiciones y peso. Las plantillas son texto evaluativo redactado, no currículo literal. No se modifica el catálogo semilla aplicado.
- En Ciencias, `learningDimensions` extrae como máximo dos aspectos de la descripción, pero solo reconoce unas construcciones estrechas («explicar cómo se…», «identificar sus…», «identificar si ocurre…» y «explicar con sus propias palabras…»). Para una exposición científica con esos aspectos prioriza dos criterios de contenido, precisión, organización y evidencia oral/recursos. Otras áreas usan principalmente plantillas con el tema del título; varios subtemas descritos por el docente no llegan a los criterios.
- `teacherTopic` toma el tramo posterior a «sobre/de/del/con» en el título. El contenido construido desde título o descripción se marca `CONTEXTUALIZED`; `CURRICULUM_DERIVED` solo aparece si la descripción coincide literalmente con un criterio recuperado. Las referencias asociadas proceden de la selección verificada; `ACTIVITY_TEMPLATE` no lleva fuentes.
- Los descriptores de rúbrica/escala parten de patrones comunes de cinco niveles, reducidos a cuatro cuando procede. Los contextualizados repiten la acción y cambian el adverbio/ayuda por nivel; la diferenciación observable resulta limitada y algunas formulaciones son poco naturales. Las listas no presentan descriptores.
- `distributeScore` usa centésimas, conserva pesos y suma exacta; prefiere enteros o medios cuando el mínimo ponderado permite asignar al menos uno por criterio. Existe una prioridad especial de pesos 5/4/4/4/3 para determinados casos científicos de cinco criterios. Los demás usan los pesos de plantilla.
- El frontend convierte la recomendación a los cuatro constructores existentes. `alignRecommendationWithFields` reconstruye el snapshot desde las celdas editadas; una edición de título o descripción borra su atribución curricular. El backend compara las celdas con el payload y guarda ese mismo payload en `evaluationInstrumentSnapshot`, sin regenerarlo. La edición de criterios/descriptores/puntos y la configuración avanzada permanecen disponibles.
- «Continuar al instrumento» ya valida nombre, valor y modalidad, muestra un mensaje y trata de enfocar el campo. Sin embargo, el contenedor de modalidad carece de `data-activity-required`, de modo que el mensaje aparece pero el botón no recibe foco. El bloque de competencias se valida más tarde al guardar; el contexto sin asignatura muestra error y acceso al constructor manual, sin recomendar.

## Problemas encontrados y mejoras realizadas

1. **Tipo pedagógico inducido por la descripción.** Un «Informe científico …» podía quedar clasificado como experimento al mencionar la palabra «experimento» en su descripción. Ahora los disparadores del título tienen prioridad; solo si el título no aporta tipo se usa la descripción. La detección especial de observación con registro permanece.
2. **Subtemas docentes desaprovechados.** Una frase con «qué son …, cómo se forman …, sus partes …» no coincidía necesariamente con los patrones estrechos previos. Se añadieron pistas gramaticales conservadoras para formación, partes, tipos y riesgos; se usan como máximo dos aspectos de contenido para no crear criterios repetidos. Son palabras del docente, no inferencias de una fuente oficial. Fuera de Ciencias, algunos criterios de Arte y Sociales incorporan el tema del título a la intención/composición o al contexto/causas cuando el texto lo permite. Ciencias escritas y proyectos incorporan el tema a la organización de evidencias.
3. **Descriptor contextual genérico.** Los niveles contextualizados ya no se diferencian solo cambiando adverbios. El nivel alto exige amplitud y relaciones o constancia; el logrado cubre aspectos principales; los inferiores indican omisiones, imprecisiones, apoyo o falta de evidencia. Cada celda es una frase corta; no se convierte en un párrafo.
4. **Atribución de fuentes.** Un criterio construido directamente con palabras del docente no adjunta una referencia curricular solo por tener un elemento temáticamente cercano en el ranking. La referencia literal y el ámbito siguen validados en backend; no se atribuye oficialidad al tema de la actividad.
5. **Campos faltantes.** Nombre, valor, modalidad y ponderación inválida de competencias impiden la llamada de recomendación, muestran mensaje y enfocan el control. Se añadió el objetivo de foco que faltaba en Modalidad y Bloques. Valor fuera de 0,01–10 000 o con más de dos decimales se rechaza antes de enviar. Si falta la asignatura, el flujo conserva su error visible y alternativa manual, pues no hay selector de asignatura dentro de este formulario.

## Contenido, evidencia y puntuación

La exposición de volcanes de 20 puntos produce dos criterios de aprendizaje —formación (5) y partes (4)—, precisión científica (4), organización/comunicación (4) y recursos de apoyo (3). El peso de contenido/precisión es 13/20 = 65 %; el resto evalúa la evidencia oral. Esta proporción es una comprobación para el caso rico, no una regla universal aplicada a Arte, Matemática o listas. El texto generado se marca `CONTEXTUALIZED`, confianza curricular `LOW` y cero referencias en este caso: no se halló coincidencia curricular literal segura en su ámbito.

No se cambió el algoritmo de distribución: ya usa centésimas, pesos positivos y mayor resto determinista, prefiriendo enteros o medios cuando es viable. La batería exige enteros/medios en sus casos de puntuación entera y suma exacta, sin imponer pesos iguales. Para totales pequeños o con centésimas se conservan las centésimas necesarias.

## Batería de regresión

`node scripts/evaluation-instruments/quality-regression.mjs` evalúa 23 casos de Primaria y Secundaria en Ciencias, Matemática, Lengua, Artística, Sociales y Educación Física. Incluye todos los escenarios mínimos pedidos, observación de primer ciclo y escala motriz para cubrir los cuatro instrumentos. Usa el motor compilado, los JSONL curriculares locales y el adaptador real del frontend; no necesita PostgreSQL ni escribe datos. `--details` imprime cada criterio, descripción, fuente, puntos y descriptor destacado.

La tabla de salida informa caso, asignatura, tipo, instrumento, criterios, puntos, confianza, elementos curriculares seleccionados, criterios contextualizados, títulos genéricos y PASS/FAIL. No pretende una puntuación pedagógica absoluta. Valida ámbito/versión, referencias literales, ausencia de atribuciones falsas, criterios no vacíos ni duplicados, descripciones observables, descriptores distintos y breves, puntos y suma exacta, tipo e instrumento esperados y equivalencia de textos/puntos tras el adaptador del snapshot. Con contexto rico evita mayoría de títulos genéricos; para volcanes comprueba explícitamente contenido más evidencia y un peso de aprendizaje razonable.

Resultado final: **23/23 PASS**. Resumen de la muestra:

| Grupo | Casos | Instrumentos observados | Resultado |
| --- | ---: | --- | --- |
| Primaria 5.º Ciencias, Matemática, Lengua y Artística | 7 | Cotejo, rúbrica, ponderada | 7/7 |
| Secundaria 1.º Ciencias de la Tierra | 3 | Rúbrica | 3/3 |
| Secundaria otras Ciencias, Lengua, Matemática y Sociales | 11 | Rúbrica, ponderada | 11/11 |
| Contrastes: observación de Primaria 2.º y práctica motriz | 2 | Cotejo, escala | 2/2 |

La confianza curricular varía según coincidencia literal: no se convirtió un `LOW` en `HIGH` por repetir vocabulario de la actividad. La mejora de redacción contextual no modifica el catálogo curricular ni los JSONL.

## Verificación técnica

| Comprobación | Resultado |
| --- | --- |
| Backend | 190/190 tests; `pnpm --filter backend build` PASS |
| Frontend | 292/292 tests; `pnpm --filter frontend build` PASS |
| Typecheck | backend, frontend, `@aula/database` y `@aula/shared` PASS |
| Currículo | 53/53 tests; artefactos Primaria 45/45 y Secundaria 72/72 ámbitos OK |
| Evaluación | 23/23 casos de calidad PASS |
| Snapshot en PostgreSQL local | Cuatro instrumentos, referencias literales, puntos y limpieza de escuela sintética PASS en `127.0.0.1:54332` |
| Cloudflare | `pnpm cloudflare:build` PASS con `wrangler deploy --dry-run`; **no se desplegó** |

El dry-run informó el aviso ya existente de chunks grandes; no es un fallo de compilación.

## Limitaciones y revisión humana

- Las pistas de subtemas son deliberadamente limitadas. Reconocen formulaciones frecuentes, no interpretan semánticamente todas las descripciones; un docente debe revisar y editar la propuesta. En volcanes se usan formación y partes, no se crean automáticamente criterios separados para cada tipo de erupción y riesgo.
- Algunas áreas sin referencia literal siguen teniendo criterios de plantilla. Un `LOW` es información útil, no un bloqueo ni una certificación del currículo.
- La validación automática comprueba propiedades observables, no la pertinencia pedagógica absoluta. La revisión humana de mañana debe valorar terminología, balance y grado de exigencia en actividades reales.
- La batería de 23 casos no cubre los 117 ámbitos completos ni todos los errores de redacción posibles. El test local de snapshot prueba guardado y limpieza sin tocar datos reales.

### Pendientes de decisión UX del usuario

No se cambió tamaño de tabla, densidad, orden visual, posición de controles, scroll ni apariencia de botones. Conviene revisar estos puntos en la sesión visual prevista.

### Fuera de alcance y sin cambios

No se tocaron `main`, producción, migraciones, versiones curriculares, PDFs, catálogo semilla, secuencias didácticas, IA generativa ni diseño global. No se abrió PR ni se desplegó. Los cuatro constructores existentes y su edición avanzada permanecen intactos.
