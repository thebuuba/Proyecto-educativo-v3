# Estrategia de enseñanza y aprendizaje en Actividades

Encargo c3aba48a, 15/10/2026. Base `7b6dd4b787dbcfefea5baf745d93162c9969fd5f`, rama `amplia-instrumentos-secundaria`, repositorio `thebuuba/Proyecto-educativo-v3`. Implementación sin subagentes, IA de aplicación ni dependencias nuevas. No amplía otra asignatura ni modifica la matriz curricular.

## Lo existente y el cambio

Planificación ya tenía `PlanningEntry.strategies`, texto libre mostrado en documento/exportación. No había catálogo de estrategias pedagógicas ni campo equivalente en Actividades. Las estrategias comunicativas de Inglés del motor evaluativo representan evidencias del estudiante; tampoco son este campo. Se conserva su función e identidad.

El nuevo catálogo compartido tiene versión `teaching-strategies-2026.1`. El catálogo de instrumentos sigue en `evaluation-2026.69`; no cambian sus releases, criterios ni snapshots. Se reutilizan `Input`, `Button`, tokens semánticos, tarjetas verticales, progreso y resumen existentes. El selector buscable aparece después de Tipo de actividad en la tarjeta Actividad. No agrega un requisito obligatorio ni mensajes de detección.

Se guardan `teachingStrategyId` y `teachingStrategyOrigin` en la actividad. El ID identifica una estrategia principal, sin afirmar que sea exclusiva. El origen distingue `AUTO`, `MANUAL` y `UNKNOWN`. Nuevos borradores comienzan en AUTO; históricos y borradores anteriores sin origen conservan UNKNOWN y ausencia, hasta intervención expresa. Elegir una opción fija MANUAL, cambiar la descripción no la reemplaza; Seleccionar automáticamente vuelve a evaluar la consigna. Duplicar conserva el ID/origen. Borradores mantienen el aislamiento por escuela, usuario y contexto vigente.

La estrategia no se incorpora al fingerprint de preparación, ni a las peticiones de criterios/instrumentos. Su modificación es metadato: no cambia técnica evaluativa, tipo de actividad, instrumento, puntos, notas, filas o textos. La edición sobre actividades calificadas mantiene la misma definición y notas. Si cambia la consigna, sigue vigente la protección anterior frente a regeneración; las comprobaciones distinguen esa acción explícita de cambiar únicamente estrategia.

## Catálogo y fuentes

Fuentes oficiales consultadas:

- [Bases de la Revisión y Actualización Curricular, 2016](https://www.ministeriodeeducacion.gob.do/docs/direccion-general-de-curriculo/PnHJ-bases-de-la-revision-y-actualizacion-curricularpdf.pdf), PDF53–56.
- [Diseño Curricular del Nivel Secundario, Modalidad Académica](https://www.ministeriodeeducacion.gob.do/docs/direccion-general-de-educacion-media/G9Ph-diseno-curricular-modalidad-academicapdf.pdf), PDF45–52.
- [Adecuación Curricular del Nivel Secundario, 2023](https://ministeriodeeducacion.gob.do/docs/direccion-general-de-curriculo/Ht7X-adecuacion-secundaria-2023pdf.pdf), PDF24–29, impresas23–28. Se cotejó la copia oficial local, SHA256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`, texto y render de PDF28. El acceso web a esta tercera URL falló; el cotejo de 2023 se hizo con el PDF local proporcionado.

Los documentos resultaron compatibles en este apartado; se mantiene 2023 como referencia actual del proyecto. Los nombres se normalizan con sus alias, sin mezclar problemas/proyectos bajo el ambiguo ABP. Cada entrada conserva definición operativa, rasgos, exclusiones, naturaleza, fuente y ubicación. Las definiciones y reglas son una adaptación funcional, no transcripciones ni reglas de detección atribuidas al MINERD.

| ID estable | Nombre | Adecuación2023, página PDF |
| --- | --- | --- |
| PRIOR_EXPERIENCES | Recuperación de experiencias previas | 28 |
| EXPOSITORY | Expositivas de conocimientos elaborados o acumulados | 28 |
| INQUIRY | Descubrimiento e indagación | 28 |
| ENVIRONMENT_IMMERSION | Inserción en el entorno | 28 |
| GROUP_SOCIALIZATION | Socialización centrada en actividades grupales | 28 |
| DIALOGIC_INQUIRY | Indagación dialógica o cuestionamiento | 24 |
| PROBLEM_BASED | Aprendizaje basado en problemas | 25 |
| PROJECT_BASED | Aprendizaje basado en proyectos | 26–27 |
| CASE_STUDY | Estudio de caso | 25–26 |
| DRAMATIZATION | Sociodrama o dramatización | 28 |
| DEBATE | Debate | 27–28 |
| ROUND_TABLE | Mesa redonda | 29 |
| SYMPOSIUM | Simposio | 29 |
| FORUM | Foro | 29 |
| WORKSHOP | Taller | 29 |
| SIMULATION | Simulación | 29 |

Las cinco últimas se enumeran en la fuente como técnicas didácticas; sus definiciones breves son operativas, no citas del documento. Se restringen a SECONDARY hasta verificar evidencia de otros niveles. Las once primeras también tienen soporte en las Bases generales. No se añadieron entradas complementarias: el modelo las identifica separadamente si un futuro encargo las justifica. No se declara una lista universal ni equivalencia entre técnica didáctica y evaluativa. No se restringen arbitrariamente a idiomas; todas las áreas pueden utilizar las opciones compatibles con su nivel.

## Detección y límites

Reglas conjuntas sobre la descripción y sus acciones; título solo apoya a un candidato ya sustentado y puede deshacer un empate. HTML se convierte a texto; se omiten listas de recursos y cláusulas negadas. Se priorizan procesos específicos de caso/proyecto y después diálogo, debate, entorno y otras estrategias. Ante empate sin apoyo suficiente o evidencia insuficiente, ID nulo y certeza NONE. Resultado interno incluye razones, certeza y versión; no aparece como explicación en el formulario.

Ejemplos comprobados:

- Caso real con datos y decisión justificada → CASE_STUDY, aunque el título diga Debate.
- Preguntas, búsqueda y contraste de explicaciones → INQUIRY.
- Diálogo guiado con preguntas abiertas → DIALOGIC_INQUIRY; alias diálogo socrático localiza la misma entrada.
- Necesidad comunitaria, planificación, investigación y producto → PROJECT_BASED.
- Problema cotidiano como punto de partida, hipótesis, investigación y soluciones → PROBLEM_BASED.
- Posturas contrapuestas defendidas y refutadas → DEBATE.
- Ejercicios en grupo, producto aislado, presentación de un estudiante, lectura sobre proyectos/debate, recurso de video o consigna negada → sin elección forzada.

Es un detector determinista de patrones explícitos, no comprensión universal del lenguaje. Una cláusula negada se descarta de forma conservadora completa; puede omitir evidencia positiva dentro de esa misma cláusula. No deduce la estrategia del docente a partir de una simple exposición estudiantil ni fuerza aprendizaje cooperativo por modalidad grupal. La selección manual permanece disponible dentro del ámbito. No se añadieron opciones personalizadas.

## Persistencia y migración

Migración nueva `20261015105401_activity_teaching_strategy.sql`, creada con Supabase CLI. Agrega dos columnas y restricciones de ID/origen en la tabla existente; no crea tablas, servicios, instaladores ni funciones. Prisma y tipos frontend alineados; cliente regenerado. Validación de DTO más validación de ámbito en servidor antes de crear y después de combinar datos/autorizar edición dentro de la transacción. Reintentos idempotentes consideran estos metadatos. Origen manual sin ID e identificadores inválidos se rechazan.

Aplicación exclusivamente local en127.0.0.1:54332. Se ejecutó el SQL exacto y se registró esa versión en `supabase_migrations.schema_migrations` en la misma transacción. La lista local tenía cinco migraciones antiguas sin registro; se conservaron y no se ejecutó una actualización masiva ni reset. Permanecen las tres políticas de evaluation_activities y privilegios SELECT/INSERT/UPDATE/DELETE de app_backend. Ninguna credencial se incorpora a Git.

Para una futura publicación fuera del entorno local deberá aplicarse esta nueva migración y regenerarse el cliente antes de ejecutar el backend nuevo; esto no se hizo en remoto ni producción. Un frontend nuevo requiere el backend que acepta estos campos. La compatibilidad de históricos queda en ausencia/UNKNOWN sin inferencia retroactiva.

Planificación conserva su texto libre, que puede abarcar una secuencia y múltiples estrategias. No se convierte silenciosamente en una principal de cada actividad. Entrada/retorno, planningId, source y nueva estrategia se verificaron; el texto del plan permanece idéntico.

## Evidencia y pruebas

Pruebas RED observadas antes de implementar catálogo, persistencia y selector. Regresión completa backend final: **36.839 pruebas /94 archivos**. Regresión completa frontend: **37.464 /120**; después, **8 pruebas /2 archivos** del selector y recorrido Planificación tras los últimos ajustes. Las pruebas abarcan cuatro formatos con comparación exacta de campos/propuesta, manual/auto, recuperación, duplicación, históricos, alias, títulos incompatibles, HTML, negaciones, recursos, ámbitos y actividad calificada sin modificación de notas. Detector transversal probado en siete asignaturas de1.º a6.º; eso no amplía la cobertura curricular de instrumentos.

HTTP real local: **12 contextos LEN/ING de1.º–6.º**, cada uno creado, editado y reabierto;12 reintentos idénticos,12 instrumentos iguales al cambiar estrategia,12 IDs inválidos400 y12 contextos inexistentes404. Los permisos y aislamiento ante usuarios/contextos ajenos se cubren además en la suite backend de persistencia/controladores. Son fixtures manuales explícitos de persistencia en cotejo, con20/17.35; no se presentan como instrumentos curriculares generados ni como navegador. [Resultados HTTP](evidencias/estrategias-http.json).

Chrome autenticado real, cuenta ficticia local:

- Lengua1.º: automático CASE_STUDY, búsqueda y teclado para MANUAL DEBATE; ampliar/modificar descripción conserva manual; AUTO recalcula a diálogo/caso según acciones. Borrador se recupera con DEBATE. Instrumento y puntuación intactos en cambios exclusivos de estrategia.
- Resumen con nombre compacto, guardado y reapertura. Edición solo de estrategia a DIALOGIC_INQUIRY/MANUAL y nueva reapertura: mismo instrumento `f132cf00-488e-452e-9caa-47b9f60a2d4e`, mismo snapshot `bb9d7a01-e4b5-4efd-8d58-eefadef92002`, versión1 y hash exacto de definición `4f87b482a087b77d7c1b22a3a5b64a592511f88723ca62b5cefc3f7bd02bb17d`. Actividad `4d24d6bb-fadb-482e-98d3-31827af4d997`.
- Duplicación por botón, resumen, creación y reapertura `d05d9b42-4d88-421c-96c8-8361969ab123`: mismo ID/origen de estrategia, criterios/textos/puntos idénticos; instrumento y snapshot propios de la copia.
- Inglés6.º desde Planificación: inicialmente sin estrategia pese al texto libre del plan; diálogo guiado detectado AUTO, rúbrica17.35, resumen/guardado/retorno a Planificación y reapertura posterior desde Actividades. Relación y texto libre cotejados por HTTP.
- Histórico `0d0640ae-f839-4074-a3e7-6b67f9d3b5d0` abierto sin estrategia, sin guardar alteraciones.
- Escritorio, móvil390×844 sin desbordamiento horizontal, búsqueda por alias, flechas/Enter/Escape y retorno de foco; override restaurado. [Captura móvil](evidencias/estrategias-movil.png), [detalle](evidencias/estrategias-detalle.png).

El cambio de descripción activó la protección existente del instrumento. La regeneración posterior fue explícita y confirmada, seguida de nueva edición manual; se distingue del cambio de estrategia que preservó todo. Se cotejaron los campos visibles con los valores del API y las filas reales, no callbacks simulados: [recorrido](evidencias/estrategias-flujo-navegador.json), [comparación persistida](evidencias/estrategias-navegador-persistencia.json), [edición exacta](evidencias/estrategias-edicion-exacta.json), [Planificación](evidencias/estrategias-planificacion-flujo.json).

Los138 registros anteriores de actividades, instrumentos y snapshots conservan sus hashes íntegros (excluidas únicamente las dos nuevas columnas al comparar actividades). Las138 actividades históricas quedan null/UNKNOWN. Los instrumentos históricos no se reescribieron. Las nuevas pruebas agregan12 fixtures HTTP y3 actividades de navegador; no se borraron para simular limpieza. Totales finales de esta escuela ficticia:153 actividades,153 instrumentos,141 snapshots y una planificación de prueba. [Base de hashes](evidencias/estrategias-historicos-base.json), [comparación final y permisos](evidencias/estrategias-historicos-final.json). Matriz, inventario y revisión curricular sin cambios.

Comprobaciones finales requeridas: `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`; aprobadas, esta última finaliza en `--dry-run: exiting now`, sin despliegue. Los avisos de tamaño de chunks y de herramientas disponibles no bloquean los builds. Se revisaron los contratos completos, conservación de historial, ramas de edición calificada y el diff; `git diff --check` y su variante staged antes de publicar.

## Archivos y cierre

- Shared: `teaching-strategies.ts` y exportaciones, catálogo/detector.
- Base: migración nueva, Prisma y `database.types.ts`.
- Backend: SaveActivityDto, GradingService y pruebas de actividades/calificaciones.
- Frontend: tipos, serializer HTTP, borrador/storage, TeachingStrategyField, ActivityDataSections, ActivityCreationView, ActivityInfoModal; pruebas del selector y Planificación.
- Tres scripts de comprobación local, evidencias, plan de implementación, este informe, avance/continuación y enlace en auditoría histórica.

Pendientes funcionales dentro del alcance: ninguno al cerrar la verificación. Límites: detector basado en patrones explícitos, técnicas adicionales verificadas solo en secundaria, una principal, sin opciones docentes personalizadas; publicación fuera de local pendiente de autorización futura. No se inició otro bloque curricular.

El hash de publicación, resultado del push y árbol final se confirman en la entrega; las pruebas de navegador se ejecutaron sobre la base7b6dd4b con estos cambios pendientes y catálogo evaluativo69, sin atribuirles retrospectivamente el commit final.
