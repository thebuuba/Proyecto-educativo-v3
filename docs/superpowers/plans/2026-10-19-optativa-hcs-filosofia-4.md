# Filosofía Social de 4.º HCS: plan de implementación

> Ejecutar individualmente con `executing-plans`, TDD y revisión propia. El usuario prohíbe subagentes y pide continuar sin preguntas rutinarias.

**Objetivo:** conectar `OPT-HCS-SOC-4`, Filosofía social y Pensamiento Dominicano, con evidencia filosófica pertinente y verificar instrumentos completos y el recorrido real en Development.

**Arquitectura:** reutilizar la resolución por acciones y la composición social existentes. Extraer el núcleo de `resolveCommonSocialTask` conservando su guard común; añadir un resolver optativo estricto con metadata y namespace propios. Adaptar explícitamente las familias que hoy imponen historia/espacio o pierden tesis y razones. No pasar un contexto SOC ficticio en la aplicación ni clonar el motor de Lengua. Los cuatro formatos, selecciones, escala, editor y persistencia permanecen compartidos.

**Tecnologías:** TypeScript/Vitest/pnpm y herramientas locales existentes. Sin dependencias, IA ni cambios de esquema.

**Especificación:** `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`. Base `ed25fbca5a7d68d72b2f1c59fceb4064f2c06ec5`, HCS6 cerrado, árbol limpio, 40 commits locales delante según referencias disponibles. Rama `ampliacion-de-instrumentos-2`.

## Límites y fuente

Solo AulaBase Development `eolgunypmtgrsyrjzcld`. Sin producción, main, merge, despliegues, integraciones/permisos, cuentas nuevas, copias, borrados, resets, dependencias, migraciones remotas ni push. Conservar datos, fuentes literales, borradores y snapshots. No tocar dist/Prisma mientras haya Worker, HTTP o instalador propio activo; comprobar árbol antes de detenerlo.

Mantener formulario vertical, cuatro controles visibles, puntos pendientes, selección manual y preparación interna sin banners. Cuatro formatos, 20/17.35, edición manual, guardado/reapertura y estrategia aislada con instrumento exacto. No acreditar cobertura universal por inventario o suite verde.

Fuente MINERD2023 PDF482–484/impresas481–483, scope `817c41b1-f690-5afe-bbf5-b438791bf45c`: 113 registros, 59 anclas adaptables (31C/25P/3A), 18 disposiciones privadas y un fragmento privado. Lectura visual y clasificación YA hechas una vez: no repetir renders, recorders ni clasificadores. A49 autoría, A87 comprensión de globalización y A88 análisis textual son observables; A57 actitud crítica privada no se puntúa. Duplicados C15+24/C16+25/P36+43 mantienen sus anclas. A91 continúa A90. Los 21 indicadores93–113 añaden autores, escuelas y métodos que requieren casos explícitos. No inventar un canon dominicano por el título.

## Archivos e interfaces

- Nuevo `packages/shared/src/secondary-optative-social.ts`: resolver estricto y composición optativa sobre núcleo social, metadata serializable y selecciones compartidas. Nuevo `secondary-optative-hcs-soc-4.ts`: temas, relaciones, fuentes y evidencias filosóficas.
- `secondary-social.ts`: extracción mínima de resolución por temas/acciones y punto de adaptación explícita de evidencia; el guard y resultados comunes deben permanecer exactos. Evitar sustituciones globales de términos.
- `packages/shared/src/index.ts`, motor backend, sugerencias y alternativa local: conectar el mismo proveedor y namespace. Añadir `optativeSocialModules` al catálogo133; congelar132 antes, sin modificar releases viejos.
- Nuevos contratos backend/frontend, fixture `data/evaluation-instruments/optative-hcs-soc-four-contracts.json` y correspondencias/matriz/instrumentos/revisión/HTTP/navegador/regresiones bajo `docs/curriculum/cobertura-secundaria/optative-hcs-soc-4-*`.
- Herramientas de fuente/QA/HTTP/inventario aceptarán solamente el ámbito revisado explícitamente. No habilitar grados5/6 por anticipación.

## Tareas

1. [x] Congelar132 una sola vez contra el payload instalado; capturar motor compilado y baselines previos antes de nuevos metadatos. Verificar que solo difieren optativeLanguageModules/version frente131.
2. [x] Releer las anclas clasificadas para construir correspondencias, sin volver a clasificarlas. Escribir contratos RED por contenido/procedimiento/indicador: reconocimiento acotado, explicación, comparación, investigación y atribución, ensayo con tesis/razones, resumen/informe OR, mayéutica/duda/epojé, ética/cosmovisiones/ciencia y problemas sociales ficticios. Negaciones, autores seleccionados, título incompatible y acciones independientes. Guards de grado/ciclo/modalidad/salida/código; manual/pending/20/17.35/paridad.
3. [x] Extraer núcleo social y conectar metadata/resolver propios. Observar GREEN; conservar comparación de todos los instrumentos previos. No introducir frases históricas o geográficas en un análisis filosófico que no las solicita, ni exigir adhesión, fe o personalidad.
4. [x] Generar y leer instrumentos completos: criterios, cinco progresiones, cuatro formatos y puntuaciones. Corregir cada fallo demostrado con RED/GREEN; registrar huellas finales una vez. No convertir las 59 anclas en 59 tareas independientes ni todos los autores/métodos en exigencias simultáneas.
5. [x] Revisar diff y lineage; detener árbol Worker verificado antes de gates. Backend test/build, frontend actividades/build, cloudflare build dry-run, lints y controles fuente/inventario/historia/precaché ≤2MiB. Mantener límite y comprobar todos los assets.
6. [x] Arrancar build final y verificar PG/Auth/Storage/frontend exclusivamente Development. Instalar solo catálogo133 y fuente individual revisada, idempotencia e historia exacta. QA en curso ficticio existente y HTTP/DB representativo por familias y cuatro formatos.
7. [x] Prueba personal con sesión existente y curso QA claramente separado; formulario vacío, estrategia automática/manual, cuatro formatos, puntos, manualidad, guardado/reapertura y estrategia aislada exacta. No correos, credenciales o limpiezas; no sobrescribir baselines previas.
8. [ ] Cerrar informe/matriz/inventario/continuación, revisión propia, auditoría UTF-8/secretos/respaldos/QA y diff. Commit español local, NO PUSH. Continuar Demografía5→Ciudadanía6→MT/CT y modalidades restantes sin preguntar por decisiones rutinarias.

## Decisiones previas y evidencias

El probe privado `probe-optative-social-reuse.mjs` demostró que el núcleo común ya reconoce muchas familias, pero no basta habilitar el guard: diálogo añade relaciones históricas, investigación exige espacio/período y ensayo con tesis/argumentos pierde evidencias específicas. `prepare-philosophy-reuse-findings.md` conserva las observaciones. El probe no es una optativa conectada ni cobertura.

Preparaciones de fuentes HCS5/6Sociales y MT4/5/6/QuímicaCT5 ya hechas una vez. No repetirlas. BiologíaCT4 y FísicaCT6 siguen pendientes de clasificación. El runtime sigue132 hasta cerrar los cambios133; no confundir código fuente en edición con versión servida.

Verificación133cerrada:480instrumentos completos/480huellas/0pendientes,28HTTP/DB ypersonalQA4completo,65/710históricos exactos/final66/739. Backend80374/175;frontendactividades79695/108antesdelajustemétodos y803afectadasdespués;serviciointerpretación99regresiones/78RED→GREEN.4buildsfinales0(CFdry-run),lints0/16previas,72JSprecargados/max2044043/cap2MiB. Auditoría final ycommit local pendientes inmediatos;NOPUSH. ContinuarDemografía5.
