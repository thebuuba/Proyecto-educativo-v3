# Corrección de Actividades e Instrumentos

Seguimiento15/10/2026: campo opcional Estrategia de enseñanza y aprendizaje, catálogo16 entradas y selección automática/manual/desconocida, persistencia completa y conservación exacta de instrumentos. Migración nueva local, tres CRUD Chrome,12 contextos HTTP y138 históricos preservados; sin ampliar cobertura curricular. [Informe y fuentes](../../curriculum/cobertura-secundaria/estrategias-informe.md). Las secciones posteriores conservan su alcance histórico.

Seguimiento de consignas naturales,15/10/2026: formas futuras y modalidades coordinadas, condiciones de entrega/contradicciones, informes breves y Agregar/Completar con feedback persistente. Catálogo local.69; tres CRUD y135 históricos conservados; matriz con límites reales y sin ampliar asignaturas. [Informe final y evidencias](../../curriculum/cobertura-secundaria/consignas-informe.md), [instrumentos completos](../../curriculum/cobertura-secundaria/consignas-ejemplos-completos.md). Prevalece este seguimiento; lo siguiente conserva su fecha y alcance históricos.

Seguimiento de calidad de Inglés1.º–6.º,15/10/2026: cotejos con datos independientes, revisión observable sin cambios forzados y conciliación135=105+28+2. Catálogo local.66; sin alterar históricos ni ampliar otra asignatura. [Informe y verificaciones](../../curriculum/cobertura-secundaria/ingles-calidad-informe.md).

Continuidad al15/10/2026: el encargo posterior de Inglés común2.º–6.º terminó en las familias y patrones definidos, con catálogo local.63 y cuatro recorridos autenticados por grado. [Informe consolidado y límites](../../curriculum/cobertura-secundaria/ingles-2-6-informe-consolidado.md), [cierre de sexto](../../curriculum/cobertura-secundaria/ingles-6-informe-final.md). Rama actual `amplia-instrumentos-secundaria`; ejecución posterior sin subagentes. El informe del12/10 que sigue conserva su contexto histórico.

Fecha: 12 de octubre de 2026. Cambios locales en la rama `instrumentos`, revisados por subagentes independientes. Los 18 requisitos del diseño quedaron cubiertos y sin hallazgos abiertos en la revisión final. Se aplicaron Superpowers, Ponytail, Graphify y UI/UX Pro Max.

## Resultado

El creador pertenece ahora a Actividades y organiza el trabajo en Actividad, Instrumento y Revisar/guardar. Conserva campos y el identificador de creación cuando falla un guardado. Los borradores están separados por cuenta y contexto académico, y sus mensajes de almacenamiento reflejan el resultado real.

El servidor comprueba los permisos, guarda actividad/instrumento/equipos de forma atómica y copia los instrumentos reutilizados. Las versiones anteriores se conservan. La definición compartida controla los puntos, niveles, criterios y No aplica tanto en el editor como en la evaluación y el servidor.

Las actividades pendientes permiten modificar su instrumento; las calificadas permiten modificar metadatos y duplicar para cambiar la estructura. El adaptador HTTP envía únicamente campos de escritura, distingue creación de actualización y transmite el vaciado explícito de los campos opcionales. Planificación tiene una entrada real al creador, con vínculo y retorno conservados incluso después de recuperar un borrador y crear otra actividad.

## Cobertura de los 18 requisitos

| # | Requisito resuelto | Evidencia principal |
|---|---|---|
| 1 | Colegio, rol y asignación docente | Controladores propagan el actor; pruebas de permisos, revocación y contexto en `activities.persistence.spec.ts`. |
| 2 | Reutilización sin alterar evidencia ajena | Copia de instrumentos; prueba de reutilización incluso con actividad anterior inactiva. |
| 3 | Guardado atómico | Instrumento, actividad, snapshot, equipos y miembros comparten transacción; pruebas de rollback. |
| 4 | Reintentos sin duplicados | UUID estable, comprobación de propietario/contexto/contenido y recuperación del conflicto de creación. |
| 5 | Una definición para editar, guardar y evaluar | `packages/shared/src/instrument-definition.ts`, reconciliación por identidad y validación de snapshot contra campos finales. |
| 6 | Rango y precisión correctos | Máximo de 0.01–10000; notas desde cero, dos decimales y límite real de la actividad. |
| 7 | Distribución exacta | Reparto en centésimas, pesos fraccionarios, máximos efectivos y suma exacta del desglose. |
| 8 | Límites comunes | Hasta 20 criterios y 2–6 niveles; recomendaciones automáticas de 4/5 niveles y filas de cero puntos verificadas. |
| 9 | Validación manual y preparada | Tipos, campos, proporciones, descriptores, referencias, enums y JSON malformado; contrato DTO real con whitelist estricta. |
| 10 | Edición y evidencia histórica | Revisiones enlazadas e inmutables, estructura protegida con notas, fecha/momento editables y vaciado explícito. |
| 11 | Recuperación sin perder el formulario | Errores separados de carga/mutación; reintentos de contexto/equipos y resumen retenido tras fallo de guardado. |
| 12 | Borradores aislados | Clave con IDs de colegio, usuario, año, asignatura y período; entradas antiguas conservadas sin exposición automática. |
| 13 | Progreso y autoguardado veraces | Siete requisitos comunes; escritura denegada/corrupta y eliminación del aviso después del éxito verificadas. |
| 14 | No aplica funcional | Selección -1, redistribución del máximo, evidencia guardada y bloqueo cuando todos los criterios están excluidos. |
| 15 | Procedencia visible | Manual, catálogo/currículo y alternativa local; aviso explícito del fallback. |
| 16 | Protección de cambios manuales | Confirmación antes de regenerar o crear desde cero; preparación desde el borrador vigente y rechazo de respuestas obsoletas. |
| 17 | Creador independiente y entradas conectadas | Actividades, Cursos, Estudiantes y Planificación; flujo integrado de recuperación y dos creaciones consecutivas. |
| 18 | Sistema visual semántico | Componentes/tokens oficiales, superficies blancas, títulos oscuros y controles accesibles; QA visual en 390×844 y 1280×900. |

## Verificación final

| Comando | Resultado |
|---|---|
| `pnpm --filter backend test` | Exit 0: 32 archivos, **384 pruebas**. |
| `pnpm --filter backend build` | Exit 0. |
| `pnpm --filter frontend test` | Exit 0: 75 archivos, **465 pruebas**. |
| `pnpm --filter frontend build` | Exit 0: TypeScript, Vite y PWA. |
| `pnpm cloudflare:build` | Exit 0: cuatro tareas correctas y empaquetado Wrangler con `--dry-run`. |

El contrato de escritura frontend se comprobó contra el DTO fuente real mediante class-validator, incluyendo campos de lectura filtrados, vínculo de planificación, vaciados y exclusión de creationId en actualizaciones. Las pruebas reprodujeron los fallos antes de corregirlos. La prueba de preparación rápida no espera el temporizador ni completa criterios manualmente para evitar la carrera.

El QA de navegador usó los componentes y estilos reales con datos ficticios: tres pasos, fallo/reintento, valores conservados, detalle del instrumento y tamaños estrecho/ancho. Los archivos y servidor temporales de esa prueba se retiraron. El creador y su workspace no importan el chunk de GradingBook; continúa el aviso conocido de tamaño del catálogo compartido.

## Base de datos y límites

La nueva migración es `supabase/migrations/20261012210038_instrument_snapshot_lineage.sql`. Añade el enlace a la versión anterior, índice y validación de la cadena. Prisma y los tipos de base de datos están alineados. No se modificaron migraciones antiguas ni se añadieron dependencias.

Se ejecutaron el DDL anterior y el nuevo en PostgreSQL aislado: cadena válida, rechazo de otra escuela/saltos de versión, historial sin permiso de actualización para app_backend y rollback correcto. La base temporal se eliminó.

Durante el cierre inicial, la migración quedó pendiente. Después, la aplicación local mostró un error 500 en `GET /api/v1/activities/center`: el código consultaba la nueva columna que todavía no existía en la base remota. Se comprobó que localhost utiliza «Proyecto-educativo-a-virginia», distinto de «AulaBase Development». Con autorización explícita del usuario, se aplicó únicamente `20261012210038_instrument_snapshot_lineage.sql` mediante Supabase CLI. La comprobación posterior no encontró migraciones pendientes y la sesión autenticada del navegador cargó las siete actividades existentes sin el error. No se crearon actividades ni se cambiaron calificaciones durante esta comprobación.

Las pruebas de servicios sustituyen la frontera Prisma; no se afirma una escritura autenticada contra producción ni una prueba de contención con dos conexiones PostgreSQL. Los avisos jsdom de scrollTo no fueron fallos de las suites.

El grafo de código se actualizó localmente, sin extracción semántica externa ni indexación del directorio de trabajo temporal. El SQL se revisó y probó directamente.
