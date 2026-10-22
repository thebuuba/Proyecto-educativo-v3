# AulaBase: informe consolidado de instrumentos de secundaria

Fecha de corte: 22 de octubre de 2026. Commit: `df18a77b489beca432af8e69af4333afd37fe660`.

Este informe corresponde al encargo integral «Completar los instrumentos pendientes de secundaria», con sus restricciones posteriores. El encargo está parcialmente completado. Implementación, revisión de instrumentos, pruebas HTTP/DB y navegador son evidencias distintas.

## Alcance

El inventario separa 54 ámbitos comunes (nueve asignaturas de 1.º a 6.º), 18 optativas académicas y modalidades especializadas. La fuente principal es la Adecuación Curricular del Nivel Secundario, MINERD 2023. Las fuentes complementarias conservan páginas, huellas y discrepancias. No se incluyen primaria ni materias extracurriculares.

## Asignaturas comunes

| Asignatura | Grados | Estado y límites |
|---|---|---|
| Lengua Española | 1.º–6.º | Implementación y evidencia previa conservadas; familias y cuatro formatos comprobados dentro de los contratos definidos. |
| Inglés | 1.º–6.º | Implementación previa y regresiones conservadas. Caso personal de entrevista de trabajo de sexto verificado: estrategia visible, instrumento, guardado, reapertura y estrategia-only exacto. |
| Francés | 1.º–6.º | Patrones conectados y persistencia en cuatro formatos. Navegador pendiente en la matriz; HTTP de cuarto a sexto se centra en persistencia, con menor alcance de interpretación que primero a tercero. |
| Matemática | 1.º–6.º | 111 grupos, 361 consignas, 1444 ejemplos completos; automatización y HTTP/DB verificados, navegador personal parcial. |
| Ciencias de la Naturaleza | 1.º–6.º | Patrones definidos revisados; guardado/reapertura y comprobación visual de cuatro formatos documentados por grado. No es cobertura universal de variantes. |
| Ciencias Sociales | 1.º–6.º | Proveedores, instrumentos y muestras HTTP/DB conectados. Navegador personal documentado en segundo, tercero y sexto; pendiente en primero, cuarto y quinto. Procedimientos y variantes todavía parciales. |
| Educación Artística común | 1.º–6.º | Instrumentos revisados, HTTP/DB y navegador representativo por grado; distintos formatos cubiertos a lo largo de los grados. Límites procedimentales y de variantes. |
| Educación Física | 1.º–6.º | Instrumentos, HTTP/DB y navegador representativo por grado. No acredita todas las combinaciones ni ejecución física real. |
| Formación Integral Humana y Religiosa | 1.º–6.º | Muestras HTTP/DB de cuatro formatos verificadas; navegador personal documentado en primero y pendiente en segundo a sexto. |

Las adaptaciones distinguen relaciones científicas y matemáticas, fuentes y causalidad, decisiones expresivas, desempeños observables y reflexión. Se excluyen criterios de personalidad, fe privada, apariencia e información íntima. Los literales curriculares permanecen separados de las adaptaciones de AulaBase.

## Optativas académicas

Las 18 tienen fuente revisada, proveedor y ejemplos completos. Dieciséis cuentan con muestras HTTP/DB representativas verificadas; dos siguen parciales. Las pruebas de navegador son representativas y en varios casos utilizan la cuenta personal en un contexto QA identificable.

| Salida | Asignatura | Grado | Verificación |
|---|---|---:|---|
| HLM | Apreciación y Producción Literarias | 4.º | HTTP/DB; navegador pendiente |
| HLM | Apreciación y Producción Literarias | 5.º | HTTP/DB; navegador pendiente |
| HLM | Textos Periodísticos y Publicitarios | 6.º | HTTP/DB; navegador pendiente |
| HLM | Manejo de la información en inglés | 4.º | HTTP/DB y navegador representativo |
| HLM | Apreciación de la Literatura Anglófona | 5.º | HTTP/DB y navegador representativo |
| HLM | Análisis Crítico y Evaluación de Textos en Inglés | 6.º | HTTP/DB y navegador representativo |
| HCS | Apreciación y Producción Literarias | 4.º | HTTP/DB y navegador representativo |
| HCS | Apreciación y Producción Literarias | 5.º | HTTP/DB y navegador representativo |
| HCS | Textos Científicos y Profesionales | 6.º | HTTP/DB y navegador representativo |
| HCS | Filosofía social y Pensamiento Dominicano | 4.º | HTTP/DB y navegador representativo |
| HCS | Geografía Humana y Demografía | 5.º | HTTP/DB y navegador representativo |
| HCS | Ciudadanía y Democracia Participativa | 6.º | HTTP/DB y navegador representativo |
| MT | Matemática Financiera y Tecnología | 4.º | HTTP/DB y navegador representativo |
| MT | Estadística Probabilidad y Tecnología | 5.º | HTTP/DB; navegador bloqueado por autenticación |
| MT | Trigonometría, Cálculo Diferencial y Tecnología | 6.º | 17/32 recorridos completos; 18 actividades guardadas; bloqueo DNS |
| CT | Biología y Computación | 4.º | 19/42 recorridos completos; bloqueo de conexión y autenticación |
| CT | Química y Computación | 5.º | HTTP/DB; navegador bloqueado por autenticación |
| CT | Física y Computación | 6.º | HTTP/DB y navegador personal |

Los identificadores y actividades parciales se conservan para continuar sin duplicarlos.

## Técnico Profesional

Hay nueve proveedores únicos conectados e instalados en Development. Ofimática se cuenta una vez aunque pertenezca a dos programas. El resumen anterior de tres proveedores se corrigió con pruebas que primero fallaron.

| Módulo | Grado | HTTP/DB |
|---|---:|---|
| MF053 Análisis y Diseño de Sistemas Informáticos | 4.º | 3/49 completos, 4 actividades guardadas; parcial DNS |
| MF002 Ofimática | 4.º | 36/95 completos; parcial DNS |
| MF056 Diseño y Desarrollo de Base de Datos | 4.º | 15/92 completos; pérdida de conexión |
| MF059 Portales Web y Recursos Multimedia | 4.º | 33/100 completos, actividad34 guardada; última reapertura HTTP pendiente |
| MF054 Desarrollo de Aplicaciones y Sistemas de Información | 5.º | 65 muestras verificadas; límites de combinaciones y navegador |
| MF057 Administración de Base de Datos | 5.º | 16/16 representativas; navegador personal pendiente |
| MF058 Análisis y Diseño de Reporte | 5.º | 16/16 representativas; navegador personal pendiente |
| MF055 Implementación y Mantenimiento de Aplicaciones y Sistemas Informáticos | 6.º | 16/16 representativas; navegador personal pendiente |
| MF060 Soluciones Web y Multimedia | 6.º | Instalado; 0/16 recorridos completos por conexión |

Los nueve proveedores reúnen 3208 definiciones completas de ejemplo. No equivalen a 3208 recorridos reales.

MF061 Formación en Centros de Trabajo de sexto tiene fuente revisada y 49 consignas/42 grupos esperados referidos a 24 criterios de evaluación. No tiene proveedor ni instrumentos generados. Copias y restauraciones son condicionales; no se acreditan prácticas laborales reales.

Pendientes técnicos: Formación y Orientación Laboral, Emprendimiento, los módulos restantes de IFC007 (instalación/configuración de equipos, incidencias, mantenimiento, centrales telefónicas, redes, seguridad/domótica, cableado y centros de trabajo), la equivalencia de grados de IFC008 y los demás programas aplicables. Se localizaron 75 documentos de 17 familias; solo tres programas tienen revisión de portada y plan de estudios registrada. Las discrepancias de códigos FOL y horas de Emprendimiento siguen abiertas.

## Artes especializadas

Se inventariaron 13 especialidades, 37 conjuntos de cursos y 301 pertenencias de asignaturas:

- Música: viento, cuerda frotada y dirección coral.
- Visuales: plásticas, cine/fotografía, multimedia y museo/patrimonio.
- Escénicas: danza contemporánea, danza folklórica y teatro.
- Aplicadas: cerámica/mosaico, joya/lapidaria y metal/madera.

Todavía no tienen proveedores especializados. Educación Artística común sí está conectada. Los documentos de 2019 son preliminares; su vigencia no se dio por establecida. La descarga oficial de la adecuación de 2024 quedó bloqueada por discrepancia del certificado TLS, sin desactivar su validación.

## Motor y creador

Se reutilizan proveedores deterministas y mecanismos compartidos, sin añadir IA, dependencias o motores separados por asignatura. Se trabaja con descripción prioritaria frente a título incompatible; propósitos distintos; alternativas, negaciones, recursos opcionales y acciones independientes.

Se mantienen los cuatro formatos, controles y formulario verticales, selección manual, puntuación inicialmente vacía, 20 y 17.35 exactos, preparación silenciosa, protección ante respuestas obsoletas y conservación de ediciones. Paridad, guardado/reapertura y cambio exclusivo de estrategia se acreditan únicamente en los recorridos efectivamente completados.

Los instrumentos completos se revisaron con sus progresiones y pertinencia; los conteos o sumas no sustituyen esa lectura. MF060 aporta 472 instrumentos revisados, pero su QA HTTP está pendiente.

## Entorno y bloqueo

Última configuración efectiva verificada: localhost:8787, exclusivamente AulaBase Development (`eolgunypmtgrsyrjzcld`), catálogo `evaluation-2026.150`; PostgreSQL con `app_backend_local` sin bypass RLS, Auth/Storage y variables públicas de Development. Assets y service worker servidos coinciden con el build. El listener local seguía activo al preparar el informe; eso no demuestra recuperación de PostgreSQL.

MF060 agotó 30 s del cliente al probar un referente excluido; el Worker registró después el 400 esperado a los 34.08 s. Un sondeo positivo independiente devolvió 500 a los 20.05 s con `Connection terminated due to connection timeout`. No creó actividades. La comprobación posterior de conservación también falló al conectar. No se aumentaron timeouts.

La instalación conservó 82 catálogos/1185 snapshots anteriores, pasando a 83/1185. Ese estado se confirmó antes del sondeo positivo. La comprobación posterior al fallo y la repetición posterior de 15 baselines personales siguen pendientes; antes de QA estaban exactos. El diagnóstico Node/Prisma midió 13.85 s en la comparación del catálogo, sin aislar toda la demora del Worker ni una causa única.

## Comprobaciones guardadas

- Backend completo: 97.163 pruebas aprobadas.
- Frontend del módulo de actividades: 94.624 aprobadas; no es la totalidad del frontend.
- Pruebas técnicas/documentales finales: 175 aprobadas.
- Builds shared/backend/frontend/Cloudflare y lints afectados: correctos.
- Cloudflare fue `--dry-run`, sin despliegue.
- Comparación exacta: 15.176 definiciones de Inglés, 2888 de Matemática, 14.488 optativas y 2736 técnicas anteriores a MF060.

Las pruebas documentales comprueban también que el bloqueo se registre honestamente; no convierten QA bloqueada en completada. Estas comprobaciones no se repitieron para redactar o comprimir el informe.

## Git y límites

Rama `ampliacion-de-instrumentos-2`, commit `df18a77b489beca432af8e69af4333afd37fe660`; árbol limpio antes de crear este paquete. 96 commits por delante de la referencia remota local guardada, sin nueva consulta del remoto. Pushes suspendidos por instrucción del usuario sobre despliegues automáticos.

Últimos commits: `32de5107`, proveedor MF060; `5c91ac4d`, conexión/bloqueo; `86856ad9`, contratos MF061; `df18a77b`, resumen técnico. Sin merge/main, despliegue, nuevas migraciones remotas de esquema, reset, copia de cuentas o modificaciones de producción. Auditorías finales sin secretos o credenciales QA en los archivos públicos revisados.

## Pendientes para cerrar el encargo

1. Acceso estable a Development y comprobaciones posteriores de conservación, sin recapturar baselines.
2. Terminar MT6, CT4, MF053, MF002, MF056, MF059 y MF060 con sus IDs conservados.
3. Completar navegador y variantes/procedimientos pendientes de los ámbitos comunes y optativos.
4. Implementar MF061 y restantes módulos técnicos.
5. Revisar e implementar especialidades de Artes y restantes programas aplicables.
6. Revisar integraciones antes de autorizar pushes y emitir el cierre definitivo.

## Documentación incluida

La carpeta `docs/curriculum/cobertura-secundaria` contiene matrices, ejemplos completos, verificaciones e imágenes versionadas. Se incluyen informes, planes y especificaciones pertinentes conservando sus rutas. El archivo de continuación es `docs/superpowers/reports/2026-10-17-secundaria-continuacion.md`; el informe MF060 es `docs/superpowers/reports/2026-10-22-tecnico-ifc-mf060-6.md`.

Los documentos históricos describen sus propias versiones y no sustituyen el estado consolidado de este corte. El ZIP no contiene código ejecutable del proyecto, credenciales, respaldos de bases de datos ni archivos privados de la sesión.
