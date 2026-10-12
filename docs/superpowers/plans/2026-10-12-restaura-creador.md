# Restaurar el flujo del creador de actividades

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Restablecer las cinco tarjetas y el instrumento editable en una pantalla vertical, conservando el guardado y la lógica técnica de 6dee60a.

**Architecture:** Cambios selectivos en ActivityCreationView y ActivityDataSections. Mantener editorModel, servicios, almacenamiento y backend salvo que una prueba demuestre una corrección necesaria para preservar datos.

**Tech Stack:** React, TypeScript, Vitest, componentes y tokens existentes.

**Spec:** ../specs/2026-10-12-restaura-creador-design.md (petición íntegra del usuario).

## Restricciones

No revertir ni copiar archivos de ffabbed. No cambiar DB, migración, dependencias, catálogo, editor de descripción ni desplegar producción. Conservar preparación automática, historial, validación, permisos, borradores, idempotencia y contexto de Planificación.

## Revisión especial

Datos invisibles deben conservarse en edición; puntaje vacío no se transforma en cero; enlaces de origen sobreviven; resultados obsoletos no pisan ediciones; fallos mantienen resumen e identificador.

- [x] Retirar campos adicionales y mensajes de detección de ActivityDataSections. Añadir regresión de preservación histórica y de bloques/contexto.
- [x] Retirar pasos y procedencia visible en ActivityCreationView. Instrumento siempre visible, Guardar abre resumen, pendientes desplazan y enfocan. Alternativa válida usa aviso breve temporal.
- [x] Adaptar pruebas anteriores y añadir regresiones de pantalla única, resumen, reintento, preparación, puntaje y Lengua de 1.º/2.º.
- [x] Revisión independiente del diff y correcciones; pruebas frontend/backend y builds requeridos.
- [x] QA ficticio escritorio/móvil con capturas de formulario/resumen, recorrido autenticado de lectura si disponible, informe con alcance y límites.

Ruling: trabajar en una rama nueva en el checkout existente, para conservar el servidor local y las dependencias compartidas. No crear otro worktree ni publicar cambios sin petición específica.
