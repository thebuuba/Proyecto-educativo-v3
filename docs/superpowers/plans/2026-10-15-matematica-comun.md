# Matemática común: plan de ejecución directa

**Especificación:** [diseño y límites del encargo](../specs/2026-10-15-matematica-comun-design.md). Ejecutar directamente, sin subagentes, conforme a la autorización explícita del usuario.
**Objetivo:** conectar y verificar los contenidos comunes reales de 1.º–6.º, conservando instrumentación, datos e historia.

- [x] Preparación: contrastar fuente/continuaciones, inventariar temas y procedimientos, registrar matriz y estado previo; conservar hashes de releases/snapshots.
- [x] Base compartida y 1.º: intérprete por acciones, proveedor con contenido específico, cuatro formatos/sugerencias/paridad; pruebas rojas antes del código; revisar ejemplos completos; instalar release y fuente solo en Development; QA editor/HTTP/DB y límites visuales; builds requeridos y commit/push.
- [x] 2.º: temas/procedimientos y regresiones propias, variantes negativas/alternativas, pertinencia completa; release congelado/idempotente; QA y cierre por grado antes de avanzar.
- [x] 3.º: mismo contrato, sin ampliar el texto de fórmulas ausentes de la fuente ni imponer un método único; QA/cierre.
- [x] 4.º: geometría, representaciones/razonamiento solo cuando corresponden; QA/cierre.
- [x] 5.º: cónicas/vectores/matrices/trigonometría en su grado correcto; conservar historia y comportamientos útiles; QA/cierre.
- [ ] 6.º: álgebra, sucesiones/finanzas/complejos/trigonometría/cálculo simple documentados en el currículo común; QA/cierre.
- [ ] Consolidado: cobertura real y exclusiones por tema, ejemplos completos, pruebas separadas, rendimiento/limitaciones y preservación histórica; Git sincronizado y árbol limpio. Detenerse.

Verificación al cerrar bloques relevantes: `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build`, `pnpm cloudflare:build`; frontend completo cuando afecte comportamiento compartido. Durante temas, pruebas focalizadas; no repetir suites sin cambios/fallos/concernas que lo justifiquen.
