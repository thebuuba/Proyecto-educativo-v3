# Auditoría del módulo Horario

## Modelo actual

- `TimeSlot` define nombre, inicio, fin y secuencia para todo el centro. No identifica día, jornada ni tipo de bloque.
- `ScheduleEntry` vincula una asignatura/sección con un `TimeSlot` y un día. Dashboard, asistencia y la vista de asignatura consumen estas entradas y sus horas reales.
- El frontend conserva días, turno, recreos y bloques no lectivos en `localStorage`; el servidor solo recibe los bloques lectivos.
- La cuadrícula supone una única lista de períodos compartida por todos los días.

## Limitaciones

- No se pueden persistir varias jornadas, recreos, almuerzos, pausas ni espacios libres.
- No se puede expresar una estructura distinta por día sin crear franjas globales ambiguas.
- La unicidad `(school_id, sequence)` impide secuencias independientes por jornada/día.
- Editar estructura puede dejar franjas antiguas y la eliminación actual borra asignaciones asociadas.
- Los presets contienen horas orientativas y la configuración depende de una duración uniforme.

## Elementos reutilizables

- `ScheduleEntry` sigue siendo una separación útil entre estructura temporal y clase asignada.
- Las horas `startTime`/`endTime` ya permiten duraciones variables.
- Dashboard, asistencia y `SubjectSchedulePage` pueden mantenerse si reciben solo entradas lectivas.
- Los formularios, servicios, caché y validación de conflictos existentes son aprovechables.

## Cambios necesarios

- Persistir jornadas y enriquecer `TimeSlot` con día opcional, jornada y tipo.
- Permitir secuencias por jornada/día y validar rangos, solapamientos y compatibilidad entre bloque y asignación.
- Sustituir el wizard monolítico por cuatro pasos: Días, Jornadas, Períodos y Clases.
- Añadir guardado atómico de estructura que preserve asignaciones de bloques no modificados.
- Renderizar jornadas y bloques no lectivos en la vista semanal, con navegación móvil por día.

## Riesgos de migración

- Los `TimeSlot` existentes se conservan como bloques lectivos heredados aplicables a cualquier día.
- No se debe cambiar el identificador de un bloque sin necesidad porque `ScheduleEntry` lo referencia.
- La eliminación de un bloque con clases debe rechazarse o requerir reasignación explícita.
- Los consumidores temporales deben continuar usando las horas del bloque y la zona local dominicana.

## Dependencias

- Dashboard calcula clase actual/próxima desde `ScheduleEntry` + `TimeSlot`.
- Asistencia usa los días de las entradas para habilitar sesiones.
- `SubjectSchedulePage` filtra por `sectionSubjectId` y calcula estado temporal.
- El resumen semanal y las vistas de horario dependen de las franjas y asignaciones.

## Segunda revisión

- El `404 Cannot POST /api/v1/schedule/structure` no provenía de una ruta incorrecta: el frontend y el controller coincidían, pero el proceso local `dist/main.js` era anterior a la incorporación del endpoint.
- La migración flexible tampoco estaba aplicada en la base enlazada. Su primer intento reveló un valor por defecto del enum con mayúsculas; se corrigió a `active` antes de aplicarla correctamente.
- La primera persistencia real expuso que insertar decenas de bloques secuencialmente agotaba el timeout de la transacción. El guardado ahora usa `createMany`, actualizaciones agrupadas y eliminación masiva segura.
- La UI configura una única estructura base por jornada y solo materializa los bloques por día al guardar. Las excepciones se muestran únicamente cuando el usuario decide personalizar un día.

