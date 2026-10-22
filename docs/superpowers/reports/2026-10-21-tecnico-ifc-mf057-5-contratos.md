# Administración de Base de Datos de quinto: contratos esperados

Se prepararon y leyeron **136 consignas esperadas, organizadas en 115 grupos temáticos**, de MF_057_3, quinto Técnico Profesional, programa IFC006_3. Referencian los 30 criterios de evaluación y los 59 procedimientos previamente transcritos. La fuente sigue siendo el documento oficial ya revisado, páginas PDF 29–37; no se volvió a transcribir ni a instalar.

Esta fase no implementa el proveedor: **cero instrumentos completos generados o revisados, cero pruebas HTTP/DB y cero recorridos de navegador MF057**. Las referencias cubiertas no demuestran todavía calidad de los instrumentos.

Las consignas distinguen definición, descripción, identificación, selección, análisis, configuración, ejecución y verificación. Separan los ocho métodos de acceso, privilegios individuales, tipos de respaldo, arreglos de discos, eventos de monitoreo, mantenimiento y recuperación. Incluyen acciones independientes, alternativas, conjunciones, negaciones, recurso opcional, crédito parcial y puntuación pendiente. Los nombres de comandos y tecnologías de la fuente se interpretan dentro de la ficha y el gestor indicados, sin exigir su ejecución por identificarlos.

La lectura completa se hizo en cuatro bloques: consignas 0–34, 35–69, 70–104 y 105–135, junto con sus referencias literales. Se encontró y corrigió una referencia excesiva: la documentación general citaba también la documentación del método de acceso, que no se solicitaba. Una regresión pasó de RED a GREEN tras conservar solo CE5.2.3 en ese caso. La consigna específica del método de acceso conserva su referencia propia.

Se conserva literalmente «Raid10 (0+1)» en la transcripción; la adaptación pide distinguir los diagramas RAID10 y RAID0+1 proporcionados. No enseña que sean equivalentes ni convierte las erratas en comandos. Las ocho actitudes y seis orientaciones siguen sin convertirse en entregables automáticos.

Las prácticas se limitan a datos ficticios, simulación o entorno de práctica explícito. Las menciones curriculares de producción, usuarios, roles, permisos, migración, respaldos, restauración, notificaciones y eliminación **no autorizan operaciones reales sobre AulaBase ni otros sistemas**. Este bloque no ejecutó escrituras remotas, creó cuentas o tocó configuraciones.

Comprobaciones focales: tres RED por fixture ausente → tres GREEN; una regresión de referencia RED → GREEN; una comprobación de evidencia ausente RED → GREEN. Resultado final de fuente y contratos: **9/9 aprobadas**. Conjunto Node técnico: **102/102 aprobadas**, cero fallos. Revisión propia, sin subagentes. Los cambios son Node, datos de prueba y documentación; no hay cambios de aplicación posteriores a los builds finales de MF059 ni motivo para recompilar el Worker mientras su único QA HTTP está activo.

Archivos: [consignas](../../../data/evaluation-instruments/technical-mf057-five-contracts.json), [pruebas](../../../scripts/evaluation-instruments/technical-mf057-contracts.test.mjs), [revisión con huellas por consigna](../../curriculum/cobertura-secundaria/technical-mf057-5-contratos-esperados.json), [matriz](../../curriculum/cobertura-secundaria/technical-ifc006-mf057-5-matriz.json) e inventario especializado. [Plan](../plans/2026-10-21-tecnico-ifc-mf057-5.md).

Pendiente: implementar el proveedor reutilizando el motor técnico, revisar los cuatro formatos completos, ejecutar las verificaciones de aplicación y conectar/probar exclusivamente Development. El runtime y catálogo actuales siguen siendo MF059/evaluation-2026.146. No iniciar el siguiente catálogo hasta cerrar o preservar su QA y congelar individualmente la versión anterior. NO PUSH vigente; sin despliegues, merge/main ni producción.
