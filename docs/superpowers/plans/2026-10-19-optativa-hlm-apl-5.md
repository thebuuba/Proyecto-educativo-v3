# Literatura de 5.º, Humanidades y Lenguas Modernas

Continuación del [encargo integral](../specs/2026-10-17-secundaria-pendiente-encargo.md), después de `46153a345c83826eca5072744ddb4b0901c409e4`. Ejecución individual con TDD; sin subagentes ni preguntas rutinarias.

Objetivo: conectar epopeya y novela policíaca de `OPT-HLM-LEN-5` al proveedor optativo y a los cuatro formatos existentes. Reutilizar composición, procedimientos y rasgos lingüísticos; no duplicar el motor ni activar el módulo común de análisis de novela en un contexto optativo.

Fuente MINERD 2023, PDF432–436 / impresas431–435, ya leída visualmente. Scope `a4ba08bf-efdf-5ede-9710-5d1d7ea0c559`: 102 registros, 27C/27P/13A/21I/14competencias. Epopeya y novela policíaca son géneros diferentes de las optativas de HCS. No repetir renders ni inferir cobertura por inventario.

Límites: Development `eolgunypmtgrsyrjzcld` exclusivamente. Conservar cuentas, datos, borradores, históricos, puntos pendientes y selecciones manuales. Commits locales españoles; push retenido por decisión del usuario. Sin producción, main, merges, despliegues, permisos, integraciones, resets, borrados, nuevas migraciones remotas, dependencias o IA.

- [x] Confirmar Git y procesos: árbol limpio, 32 commits locales pendientes según referencias disponibles; solo Worker local activo. Consultar grafo y revisar compositor/proveedor existentes.
- [x] Clasificar individualmente conceptos, procedimientos, actitudes y fragmentos. Publicar correspondencias con anclas y distinguir adaptaciones, encabezados y exclusiones.
- [x] Escribir contratos backend/frontend y observar RED por ausencia del módulo de quinto. Incluir acciones, contextos negativos, título incompatible, negaciones, alternativas, individual/grupo y cuatro formatos con 20/17.35/puntos pendientes.
- [x] Añadir metadata propia al proveedor optativo; corregir únicamente carencias demostradas con regresión y conservar los módulos existentes.
- [x] Generar y leer los instrumentos completos por género/acción; revisar niveles, filas, unidades, pertinencia y exigencias inventadas. Registrar huellas después de leer.
- [x] Congelar124 una sola vez, contra payload instalado por lectura; preparar125 conservando los campos anteriores y comprobar sus definiciones. La comprobación de releases y snapshots tras la instalación queda en la etapa siguiente.
- [x] Ejecutar pruebas y builds AGENTS, lints afectados e inventario/precaché. Detener Worker propio verificado antes de dist; no generar Prisma con instaladores o pruebas HTTP activos.
- [x] Confirmar compilados y destinos efectivos PostgreSQL/Auth/Storage/frontend. Instalar individual e idempotentemente catálogo125 y fuente5 con trazabilidad; reutilizar QA ficticio, sin crear cuentas ni copiar datos.
- [x] HTTP/DB autenticado: cuatro formatos, pendientes/20/17.35, contexto/fuente/exclusiones, alternativa local, edición manual, guardar/reabrir, estrategia sola idéntica y tiempos.
- [x] Comprobar disponibilidad del navegador personal y registrar el bloqueo por contraseña y los pasos manuales. QA no sustituye la cuenta personal; no enviar más enlaces ni borrar almacenamiento. El recorrido visual del creador personal sigue pendiente.
- [x] Informe, inventario, continuación, revisión propia separada, auditoría de secretos/UTF8/diff y commit local. Continuar el siguiente ámbito independiente autorizado.

Decisiones: verso **o** prosa mantiene la alternativa, sin exigir ambas formas. Hazaña pública, fantasía, valores del protagonista, narrador omnisciente y recursos solo cuando se piden. En novela, pistas e hipótesis pertenecen al caso ficticio y no convierten toda comprensión breve en producción de una investigación completa. Plan, análisis, narración, borrador y revisión conservan evidencias distintas. Publicación, ilustración, trabajo colectivo y todas las fases curriculares no son requisitos universales. No evaluar disfrute, justicia privada, fe, creatividad como rasgo ni experiencias personales.

El proveedor común `secondary-novel-analysis.ts` restringe correctamente su adaptación a LEN común de quinto y análisis de texto dado. No se reutiliza como módulo optativo completo: su alcance no incluye epopeya ni producción y su guard debe conservarse. Sí se reutilizan los compositores y formateadores compartidos.

Cierre125:272instrumentos leídos,12muestrasHTTP/DB,57/489anterioresidénticosy58/501finales. Navegadorpersonalbloqueadoporcontraseña,documentado. Alias«novela policial»singular detectadotrasinstalación:corregirconREDen126,sinreescribir125. Pushretenido.
