# Lengua Española común de 1.º a 6.º: implementación y verificación

Ejecución directa con executing-plans, sin subagentes por preferencia vigente del usuario. Especificación: encargo adjunto a7fdea3e, 13/10/2026. Sustituye la pausa de ampliación del encargo anterior.

**Objetivo:** completar las familias pertinentes de cada tema común, cerrar pendientes explícitos y verificar contenido/edición/persistencia real por grado.

**Arquitectura:** conservar proveedores y adaptadores compartidos; añadir evidencias de subtemas/procedimientos con activación por requisitos de la consigna. Resolver los contratos transversales de puntuación y cambio de actividad durante el bloque de 1.º. React/TypeScript, pnpm y Supabase local existentes; sin dependencias ni IA.

**Restricciones:** orden 1.º→6.º; optativas separadas; no producción ni sobrescritura histórica; mantener UI vertical y selección explícita; catálogo inmutable por release. No marcar cobertura completa basándose en inventario o HTTP 200.

- [x] Auditar 1.º contra PDF 69–75, subtemas, procedimientos y pendientes de seis módulos. Pendientes detallados registrados en `lengua-1-contratos-y-editor.md`.
- [x] Reproducir y corregir reparto dependiente del orden de introducir puntos, conservando pesos manuales.
- [x] Implementar diálogo transaccional de cambio de actividad: conservar/adaptar/cancelar, fallo, Escape/cierre y descarte de respuesta obsoleta.
- [ ] Completar proveedores/familias/subtemas de 1.º y pruebas de contenido; HTTP y cuatro formatos en navegador real. Actualizar matriz, informe, commit/push.
- [ ] Auditar/completar/verificar 2.º con el mismo criterio; cerrar pendientes antes de avanzar; commit/push.
- [ ] Auditar/completar/verificar 3.º; commit/push.
- [ ] Auditar/completar/verificar 4.º; commit/push.
- [ ] Auditar/completar/verificar 5.º, integrando análisis de novela .19; commit/push.
- [ ] Auditar/completar/verificar 6.º; commit/push.
- [ ] Revisión final, pruebas/builds exigidos, ejemplos completos, evidencia de cobertura por tema/familia/formato y entorno ejecutado.

Revisión: títulos incompatibles, productos equivalentes, requisitos ausentes/alternativos, fallback sin esconder 4xx, selección manual en borradores recuperados, total antes/después, adaptación fallida sin mutaciones y preservación de 28 snapshots actuales. Pruebas rojas antes de modificar cada comportamiento; reutilizar las regresiones previas.

Punto de partida: de15fce28ca70500b3061d03dc6e7edc6206af4d, rama amplia-instrumentos-secundaria, catálogo local .19. Árbol limpio. Graphify disponible como grafo estático anterior al código actual; se contrasta con llamadas reales. No CLI instalado; no instalar dependencias para reconstruirlo.
