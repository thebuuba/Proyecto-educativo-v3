# Estrategia principal de enseñanza y aprendizaje

> Ejecución directa con executing-plans, sin subagentes por instrucción expresa.

**Objetivo:** integrar catálogo, selección automática/manual y persistencia transversal sin alterar instrumentos.

**Arquitectura:** catálogo y detector determinista en `@aula/shared`; dos columnas opcionales en EvaluationActivity (ID y origen AUTO/MANUAL/UNKNOWN), dentro de la transacción y permisos existentes. Selector buscable construido con Input/Button y tokens existentes dentro de Actividad. Planificación conserva su texto libre histórico: no es un catálogo ni un equivalente uno a uno de la estrategia principal de cada actividad.

**Base:** rama amplia-instrumentos-secundaria, 7b6dd4b, árbol limpio. Encargo adjunto c3aba48a-3108-42de-81ac-91dc006b7fc0, 15/10/2026.

**Restricciones:** pnpm; sin dependencias, IA, subagentes, cambios históricos, main, reset ni despliegue. Migración nueva y local. Campo opcional. Sin regeneración por estrategia. Respetar elección manual y origen desconocido. No ampliar cobertura curricular.

## Auditoría y decisiones

- Grafo existente consultado de solo lectura: SaveActivityDto, SaveActivityInput y PlanningEntry relacionados; grafo antiguo contrastado con código actual.
- Planificación: `PlanningEntry.strategies` String libre, formulario Textarea, exportación y documento ya lo muestran. No existe catálogo reutilizable. Actividades persiste desde GradingService y usa editorModel para borrador/duplicación.
- Fuentes verificadas: Bases2016 PDF53–56; Diseño Secundario PDF45–52; Adecuación2023 PDF24–29 (impresas23–28), SHA80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. No se reemplaza la adecuación. Técnicas didácticas se identifican como tales dentro del catálogo pedagógico, distintas de técnicas evaluativas.
- Mantener selección y origen desconocidos en históricos/borradores anteriores; automático solo en nuevos o acción explícita. Detector independiente del fingerprint de instrumentos y sin llamadas nuevas al servicio evaluativo.
- Catálogo inicial: once estrategias solicitadas más mesa redonda, simposio, foro, taller y simulación (Adecuación PDF29). Estas cinco técnicas limitadas a secundaria por evidencia verificada; las generales respaldadas también por Bases. No se inventan entradas complementarias.

## Verificación del diseño

Revisar negaciones/recursos, títulos que contradicen la consigna, preservación manual al recibir respuestas asíncronas, históricos nulos y cambios de estrategia sobre instrumentos editados/calificados. Pruebas de ámbito y permisos; comparar snapshots anteriores a nivel de hash, sin sobrescribirlos.

## Trabajo

- [x] Catálogo/detector y pruebas RED→GREEN: evidencias conjuntas, alias, ambigüedad y ámbitos.
- [x] Migración nueva, Prisma/tipos/DTO/transacción, idempotencia/validación y pruebas.
- [x] Selector accesible, origen y retorno automático, borrador/edición/duplicación/resumen/detalle/Planificación; pruebas de instrumento intacto.
- [x] Comprobaciones requeridas; migración local, HTTP y Chrome autenticado (escritorio/móvil/teclado, guardado/reapertura), comparación de históricos.
- [x] Revisión final e informe/avance/continuación; comprobaciones verdes y publicación en la rama autorizada. Hash, resultado de push y árbol final se confirman en la entrega. Detenerse.

Ruling: se trabaja en la rama solicitada y su checkout actual, sin crear otro worktree ni subagentes. La preferencia explícita del encargo prevalece sobre los flujos genéricos de skills.

Ruling: la base local tenía cinco migraciones antiguas sin registrar. Se aplica exclusivamente el SQL nuevo y se registra su versión en la misma transacción, sin ejecutar las otras ni resetear. Las138 filas previas y sus instrumentos/snapshots permanecen idénticos.

Revisión directa: se añadieron negativos de estrategia como objeto de lectura, recurso y negación interna tras observar tres falsos positivos RED; corregidos y verdes. Revisión de contratos/datos y React: sin efectos de red nuevos, catálogo pequeño, selección con búsqueda/teclado, estilos semánticos, callback separado del fingerprint evaluativo. La prueba de reintento antigua se alineó con los defaults reales de las nuevas columnas; sin debilitar la comprobación de idempotencia. Un fallo de tipado de la fixture de Planificación se corrigió con el literal de origen, no ampliando indebidamente el contrato.
