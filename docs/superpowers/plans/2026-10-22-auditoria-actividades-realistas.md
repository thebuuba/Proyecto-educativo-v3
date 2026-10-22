# Auditoría de instrumentos con actividades docentes realistas

**Objetivo:** corregir causas compartidas de inestabilidad y falta de pertinencia en todos los proveedores ya implementados, conservando datos y expectativas originales.
**Ejecución:** directa y autónoma, sin subagentes, por instrucción expresa. Rama existente `ampliacion-de-instrumentos-2`; commits locales y ningún push.
**Especificación:** `../specs/2026-10-22-auditoria-actividades-realistas.md` (encargo literal).
**Arquitectura:** reutilizar motor determinista compartido, servicio autorizado y editores existentes. Separar evidencia local, HTTP/DB y visual. No añadir especialidades, dependencias, IA ni migraciones remotas.

## Bloques verificables

### 1. Estabilidad y conservación antes de escrituras

- [x] Confirmar Git y procesos: HEAD `f7d1be7a`, árbol limpio al inicio; sin listener 8787 ni ejecutor QA activo.
- [x] Confirmar proyecto mediante conector: `eolgunypmtgrsyrjzcld`, AulaBase Development, ACTIVE_HEALTHY.
- [x] Verificar configuración efectiva PG/Auth/Storage/frontend y build servido; reiniciar únicamente el servidor local ausente.
- [x] Diagnóstico acotado DNS/TCP/conexión/pool/consulta/validación del catálogo/HTTP. Corrección de transferencia completa verificada; latencia HTTP aún variable.
- [x] Comparar historia contra `history-before-evaluation-2026.150.json` y quince baselines personales existentes antes de escrituras, sin recapturarlos.
- [ ] Reconciliar IDs y estados de recorridos incompletos antes de crear actividades.
- [x] Reproducir coste de validación del catálogo, añadir regresiones fallidas, corregir transferencia y verificar PostgreSQL real, HTTP y gates. No equivale a resolver toda incidencia de conexión.

Archivos iniciales: `scripts/evaluation-instruments/development-history.mjs`, `packages/database/src/index.ts`, `apps/backend/src/modules/evaluation-instruments/evaluation-instruments.service.ts`; diagnóstico privado y sanitizado en `.wrangler/realistic-audit/`. No modificar configuración remota.

### 2. Banco y contratos anteriores a ejecución

- [ ] Inventario efectivo de proveedores, temas y familias implementados (excluir MF061 y artes solo inventariadas).
- [x] Banco inicial de 17 casos A/B/C congelado antes de ejecutar; reconstrucciones identificadas y mismo autor sin independencia externa. Falta ampliarlo para todos los temas.
- [x] Contratos del banco inicial con mapas/agrupaciones y huella UTF-8/LF. Adiciones posteriores separadas; no acomodar expectativas a salidas.
- [ ] Por tema, 4–6 tareas de familias distintas cuando corresponda; excepciones justificadas. No inflar variantes equivalentes ni ejecutar producto cartesiano.
- [ ] Prioridad: sistema solar/tiempos; tabla periódica quinto; operaciones sin contexto inventado; diálogo francés primero; informe con formato, secciones y requisitos retirados. Incluir entrevista literal de inglés sexto.

### 3. Correcciones pedagógicas y de flujo

- [ ] Capturar instrumentos completos y medir cobertura, omisiones, añadidos, duplicados, progresiones y latencia antes de tocar expectativas.
- [ ] Corregir agrupación de presentación frente a organización/contenido; señalar límites del Sí/No agrupado. No imponer tolerancias, pesos ni requisitos nuevos.
- [ ] Trazar estrategia: recomendación, AUTO/MANUAL/UNKNOWN, propagación, respuestas obsoletas y contexto; distinguir inferencia de propuesta. Sin equivalencias falsas exposición/expositiva, grupo/cooperativo, problema/ABP.
- [ ] Reproducir añadir/completar: pocos candidatos, agotamiento con fila manual útil, vacíos/parciales/renombrados, pesos y ediciones. Respetar límite 20 y calificados.
- [ ] Revisar cuatro formatos y progresiones propias, paridad servicio/alternativa, puntuación vacía y 20/17.35 exactos, selección manual, cambios de formato y estrategia sin alterar instrumento.
- [ ] Fuentes complementarias solo ante carencia demostrada; procedencia/grado/adaptación distintos de citas oficiales.

### 4. Verificación por riesgos y cierre

- [ ] Pruebas focalizadas RED/GREEN por corrección, sin cambiar contratos para acomodar resultados.
- [ ] HTTP/DB autenticado por contexto: preparación, guardado, reapertura y reconciliación de IDs.
- [ ] Navegador representativo por grado/asignatura, incluyendo cuenta personal cuando sea accesible. QA no la sustituye; conservar borradores/caché.
- [ ] Gates requeridos al finalizar código: backend test/build, frontend build y cloudflare:build (dry-run). Repetir solo las comprobaciones afectadas por cambios posteriores.
- [ ] Informe con antes/después completos, mapa de requisitos, matriz de discrepancias, rendimiento, preservación y pendientes reales.
- [ ] Continuación y commits locales por bloque verificado; auditoría de secretos y estado final. Sin push, main, despliegue, reset, borrado ni cambios de producción.

## Riesgos que deben tener evidencia propia

1. Conexión recuperada en Node pero fallo en Worker: medir ambas, sin atribuir una causa única.
2. Título antiguo incompatible y retirada/negación de requisitos: evitar criterios residuales.
3. Alternativas y cantidades exactas/máximas/aproximadas: no evaluar ambas ni inventar tolerancia.
4. Candidatos agotados y edición parcial/manual: salida editable sin sobrescritura ni redistribución.
5. Muchas pruebas aprobadas con instrumentos pobres: lectura de salida completa y correspondencia requisito/evidencia, no solo conteos.

## Registro de decisiones

- 22/10: el nuevo encargo vuelve a suspender pushes; la autorización anterior fue utilizada para publicar hasta `f7d1be7a` y no se extiende a este trabajo.
- 22/10: mantener la rama existente y los históricos; no crear una rama desde main que descarte el avance. La autorización de trabajo autónomo elimina confirmaciones rutinarias de los flujos de skills.
- 22/10: no declarar recuperación por ACTIVE_HEALTHY ni por ausencia de proceso; la conexión anterior todavía requiere diagnóstico y preservación.
- 22/10: corrección de validación contrastada con todo el catálogo 150 instalado; 97.174 pruebas backend y builds aprobados. MF060 reanuda su diario original solo después de preservar 82 releases/1185 snapshots y quince referencias personales; el recorrido continúa, sin reinicios ni builds simultáneos.
