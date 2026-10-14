# Corrección de Actividades e Instrumentos

El usuario autorizó corregir todos los fallos de la auditoría por pasos y con subagentes. Se conserva la aplicación React/Nest/Prisma, sus contratos históricos y la paleta semántica de AulaBase. Las correcciones deben preservar calificaciones y evidencias existentes.

## Requisitos verificables

1. Cada lectura, creación, actualización, eliminación y vínculo de actividad comprueba colegio, rol y asignación docente; los responsables administrativos conservan acceso al colegio.
2. Instrumentos reutilizados se copian y nunca modifican la evidencia de otra actividad.
3. Instrumento, actividad y equipos se guardan en una transacción; un fallo revierte todo.
4. Un reintento de la misma creación no genera duplicados; se utiliza un identificador de creación estable, con comprobación de propietario y contexto.
5. La definición final del editor, la versión guardada y el cálculo de evaluación coinciden en criterios, indicadores, niveles, etiquetas, descriptores y puntuaciones.
6. Puntuación de actividad y calificación admiten 0.01–10000 puntos de máximo y hasta dos decimales; notas admiten cero y no superan el máximo real de su actividad. Las notas normalizadas mantienen el comportamiento del libro.
7. Todas las distribuciones se realizan en centésimas, preservando exactamente el total, incluidos pesos 33.33/33.33/33.34 y totales pequeños.
8. El límite común es 20 criterios y 2–6 niveles editables; recomendaciones automáticas existentes de 4 o 5 niveles siguen funcionando. Criterios de cero puntos, cuando el reparto de centésimas lo requiera, deben tener tratamiento consistente y seguro.
9. Servidor valida también instrumentos manuales: tipos permitidos, objetos de cadenas, criterios completos, niveles coherentes, sumas, ponderaciones y modalidad/momento/origen.
10. Borradores permiten editar todos los campos. Actividades guardadas sin notas permiten editar información e instrumento creando nueva evidencia inmutable cuando corresponda. Actividades con notas permiten metadatos que no cambien la evaluación; la estructura requiere duplicar.
11. Error de carga, equipos o guardado muestra una recuperación explícita. El error de guardado conserva el editor y sus valores, incluso en edición.
12. Los borradores se aíslan por colegio, usuario, año escolar, asignatura y período, usando identificadores. Los borradores antiguos no se exponen automáticamente a otro usuario; deben conservarse sin destruirlos.
13. El estado de autoguardado refleja éxito o fallo real; panel y editor utilizan la misma definición de progreso y obligatoriedad.
14. No aplica funciona en escalas y listas de cotejo: selección explícita, exclusión del denominador y reajuste a la puntuación máxima, con evidencia persistida. Todos los criterios excluidos no producen una nota artificial.
15. Se indica si el instrumento proviene de catálogo/referentes curriculares, plantilla local o creación manual; un fallo con alternativa local se comunica sin bloquear el trabajo.
16. Regeneración protege cambios manuales mediante confirmación clara y evita aplicar respuestas de solicitudes obsoletas.
17. El creador pertenece a Actividades y se organiza en Actividad, Instrumento y Revisar/guardar. Evaluación consume su definición, sin cargar todo el libro para crear. Se conservan entradas desde Actividades, Cursos, Estudiantes y Planificación.
18. UI migrada consume tokens y componentes semánticos, superficies blancas, títulos oscuros y acciones accesibles. El color de bloque no comunica éxito o error ni define la acción principal.

## Restricciones y comprobación

Usar pnpm, paquetes existentes y AGENTS.md. No modificar migraciones antiguas. Si se necesita cambiar la base de datos: nueva migración por Supabase y alineación Prisma/tipos. No publicar, desplegar, hacer push ni leer secretos. Los subagentes no hacen commits ni crean más subagentes; el coordinador integra y revisa los cambios.

La revisión final debe mapear los 18 requisitos a pruebas, fuentes y comportamiento actual. Ejecutar las pruebas focalizadas relevantes y después `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`.
