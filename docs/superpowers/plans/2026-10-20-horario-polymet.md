# Rediseño de Horario según Polymet

**Objetivo:** reproducir el diseño y los flujos observados en `https://dev-untitled-pro-zd4r7cnk.polymet.app/horario/parcial`, con datos reales de AulaBase y horarios independientes por docente. El usuario aprobó las diferencias funcionales y ordenó implementar ese diseño.

**Diseño vinculante:** cabecera compacta con año escolar y selector Semana/Día; barra horizontal con próxima clase, clases, horas, libres y revisión; calendario de altura proporcional al tiempo con día actual y marcador horario; panel contextual a la derecha; constructor modal casi a pantalla completa con formulario lateral y calendario en vivo; exportación PDF/PNG semanal o diaria. Vistas inicial, parcial, completa, desconectada y solo lectura. Conservar Poppins y los tokens de AulaBase, con la composición de Polymet.

**Arquitectura:** componentes separados de calendario, contexto, constructor y exportación. Reutilizar las APIs y el generador de períodos existentes. Al retirar períodos con clases, conservar sus bloques históricos inactivos y marcar las entradas `needsPlacement`; así mantienen dueño, referencias y horario anterior sin hacer nullable la FK. Las clases pendientes se muestran en revisión y se excluyen de la agenda hasta reubicarlas.

**Tecnologías:** React, CSS con tokens semánticos, Canvas y PDF sencillo con JPEG incrustado; NestJS, Prisma, Supabase y Vitest. Sin dependencias nuevas.

## Ejecución

- [x] Backend: prueba que falle para retirar un período ocupado; migración nueva `needs_placement`, schema Prisma y tipos de DB alineados; guardado transaccional conserva clases pendientes; APIs de consulta/edición/reubicación y agenda excluyen pendientes; pruebas de aislamiento.
- [x] Calendario: pruebas de geometría proporcional y disponibilidad por día; cuadrícula semanal, agenda diaria, descansos, día actual y selección; estilos del prototipo con tokens.
- [x] Pantalla: cabecera, métricas, siguiente clase, panel de resumen/detalle/asignación/cambio/reubicación; búsqueda, aula opcional y repetición en otros días válidos. Estados vacío/carga/error/conexión/solo lectura.
- [x] Constructor: adaptar el asistente existente al modal dividido; vista previa en todos los pasos; días por jornada, patrones de duración/descansos, edición por día y resumen del efecto sobre las clases.
- [x] Exportación: modal con vista previa, PDF/PNG, semana/día, libres y aulas; archivos descargables reales.
- [x] Verificación: pruebas frontend/backend, cuatro comandos de AGENTS.md, migración en Postgres temporal, revisión independiente y comparación visual en navegador con la referencia. No dar por terminado por pasar pruebas: contrastar todas las vistas y flujos con el diseño.

## Registro de decisiones

- Se trabaja en la rama actual `modificacion-de-horario`, ya dedicada a esta funcionalidad y limpia tras `d0437433`.
- OpenCode `deepseek-worker` falla al iniciar con un error interno; usar una tarea auxiliar acotada de backend y revisar su resultado.
- La conservación de bloques inactivos proporciona el historial de una clase pendiente sin perder su propietario ni introducir una segunda tabla de asignaciones.

## Evidencia de verificación

- Backend: 134 archivos / 45.616 pruebas aprobadas; `pnpm --filter backend build` aprobado.
- Frontend: 11 archivos / 83 pruebas de horario aprobadas. Incluyen asignación con repetición y aula, errores que conservan el formulario, edición, reubicación, solo lectura, desconexión, revisión sin estructura y diálogo accesible en pantalla pequeña.
- `pnpm --filter frontend build` y `pnpm cloudflare:build` aprobados. El último comando vuelve a construir frontend/backend y termina el dry-run de Wrangler sin publicar.
- Migración aditiva `20261020144054_schedule_entries_needs_placement.sql` aplicada a la base que usa el servidor local: 29 asignaciones conservadas, ninguna marcada pendiente por la migración. Prisma, SQL y tipos de base de datos alineados.
- `node scripts/test-personal-schedule-migration.mjs` aprobado en PostgreSQL 17 temporal: valor inicial, propiedad de clases históricas y RLS entre docentes.
- Revisión independiente: corregidos payload PATCH, cambio coherente de curso y rechazo de períodos propios ocupados. Revisión final sin hallazgos pendientes en el flujo actual.
- Navegador local: 28 clases cargadas, calendario semanal y agenda diaria, detalle y guardado de la misma clase sin alterar su asignación, constructor dividido con vista previa de las clases conservadas y exportación con Canvas real. Captura local en `output/horario/horario-polymet.jpg` (no versionada).
- PNG descargado inspeccionado visualmente; la revisión corrigió la distinción entre horas pedagógicas y períodos libres. Constructor PDF validado además con PDF.js: página A4 y operadores de imagen decodificados. El PDF es rasterizado, con texto no seleccionable.
- El control de viewport del navegador no modificó sus dimensiones; el comportamiento móvil se verificó mediante la prueba del diálogo y los estilos responsive, sin afirmar una captura móvil real.
- Windows bloqueaba la DLL de Prisma cargada por el backend local. Se detuvo únicamente el proceso identificado de ese backend durante la generación y se reactivó su watcher; `/api/v1/health` volvió a responder 200.
