# Química y Computación de 5.º: plan de implementación

> Ejecución individual con el plan integral vigente. Continuidad autónoma, commits locales y sin subagentes.

**Objetivo:** conectar las aplicaciones químicas de alimentos, farmacéuticas, computacionales y textiles presentes en CT5, con instrumentos completos y pertinentes en los cuatro formatos.

**Arquitectura:** añadir metadata y facetas de CT5 al proveedor científico optativo existente. Reutilizar el analizador, los criterios comunes, selecciones y formateadores; las correcciones demostradas deben quedar acotadas y preservar CT4 y los ámbitos anteriores. Congelar 139 antes de registrar 140.

**Spec:** `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`.

## Límites y estado de partida

- Rama `ampliacion-de-instrumentos-2`, base `25a174eea877b285a6a357abdc70a072a7c58bbb`. Pushes suspendidos por instrucción vigente sobre las integraciones 403. Sin producción, main, merge, despliegue, reset, borrados, migraciones, nuevas cuentas o dependencias.
- Development exclusivamente `eolgunypmtgrsyrjzcld`. Guardar datos QA identificables solo en contextos existentes, conservando historial, cuentas, borradores y las 12 baselines personales. No copiar producción.
- CT4 sigue HTTP parcial: 19/42 verificadas, 19 actividades existentes y 20 IDs preparados; dos timeouts y un 500 tardío del servidor por conexión terminada. Historial final 72 releases/907 snapshots. No repetir el bucle ni declarar cerrado ese ámbito. MT6 mantiene su pendiente independiente.
- Mantener creador vertical, preparación silenciosa, manuales, puntuación inicialmente pendiente, sumas exactas 20/17.35 y cambio exclusivo de estrategia sin alterar el instrumento.
- Modelos, fichas y resultados proporcionados: sin dosis, tratamientos, síntesis peligrosa, cultivos patógenos, consumo, visitas, fabricación, ventas, compras o datos sanitarios personales. Las referencias FDA/NCCIH no son normativa dominicana ni autorización clínica.

## Fuente y revisión existente

Asignación oficial **Química y Computación**, quinto de secundaria, ciclo 2, modalidad Académica y salida Ciencias y Tecnología. Scope `f39c0cd4-85d9-5aeb-a1d2-74763bf455a9`, PDF 506–510, páginas impresas 505–509; asignación en PDF 498.

La fuente ya fue inspeccionada visualmente y clasificada: 188 registros, 117 anclas adaptables —57 conceptuales, 55 procedimentales y cinco actitudes condicionadas—, 37 indicadores observables y 20 exclusiones —10 rótulos, un fragmento y nueve disposiciones privadas—. No repetir renders, clasificador o autores. El fragmento 40 continúa 39; los rótulos mezclados en 44/108 conservan procedencia. El contenido computacional 122 precede al encabezado textil 123.

## Focos de revisión

1. Una simulación o ensayo in vitro no demuestra eficacia clínica. Etiquetas y prospectos se leen según la ficha dada, sin indicar dosis.
2. La mención curricular de homeopatía, fitoterapia o naturopatía no acredita eficacia ni equivalencia. Evaluar afirmaciones y evidencia proporcionada.
3. Identificar equipos no exige ejecutar un proceso; calcular concentración no exige preparar sustancias; analizar resultados dados no exige otro experimento o investigación.
4. Privacidad no equivale a medición de datos. Las contribuciones del equipo no implican observar personalidad o regularidad.
5. Los objetos de renglones compuestos requieren facetas: conservación, patógenos, PK/PD, propiedades moleculares, fibras, colorantes, acabados y equipos. No imponer todos por un término genérico.

### Task 1: congelar 139 y fijar correspondencias

**Interfaces:** catálogo 139 fuente/compilado/DB exactos; 16 optativas previas, comunes y 12 baselines sin sobrescritura. Metadata privada: 71 agrupaciones/117 anclas; 37 casos críticos y 152 contratos borrador, todavía sin cobertura implementada.

- [x] Congelar 139 una sola vez, con consulta de solo lectura y bundle anterior para regresiones. Expected: únicamente registro científico y versión difieren de 138; no escrituras remotas.
- [x] Revisar contratos preliminares por propósito, fuente y desempeño. Expected: ninguna referencia positiva a rótulos, fragmento o disposiciones privadas; PROJECT para acciones de diseño/simulación/programación y EXERCISE_SET para resolución de problemas cuando corresponda.

### Task 2: contratos RED

**Files:** `data/evaluation-instruments/optative-ct-five-contracts.json`, tests backend/frontend y correspondencias del ámbito.

- [x] Pruebas positivas de componentes, objetos y acciones; negativas de contexto, alternativas, negaciones, recursos, acciones dadas, privacidad y contribuciones. Expected: RED por registro ausente antes de implementar, no por errores de importación.
- [x] Contratar cuatro formatos, paridad, puntos pendientes, manuales, totales 20/17.35 y contexto real sin ciclo explícito. Expected: no usar una prueba QA como sesión personal.

### Task 3: proveedor GREEN y catálogo 140

**Interfaces:** `resolveOptativeScienceTask`, metadata de CT5, selector/facetas de grado y adaptador de evidencia. Mismas entradas de backend/frontend; sin copiar motores.

- [x] Conectar CT5 y corregir solo fallos reproducidos con RED. Expected: no duplicar criterios por alias amplios o productos ya dados; objetos y acciones independientes conservados.
- [x] Congelar/rutear 139 y avanzar 140. Expected: módulos anteriores exactos, guard de modalidad/salida/grado/ciclo vigente.

### Task 4: fuente, herramientas y lectura completa

- [x] Habilitar exclusivamente CT5 en fuente/QA/HTTP/inventario con tests de negativos. Expected: 188 registros/20 exclusiones, texto literal intacto.
- [x] Generar y leer instrumentos completos por criterio, progresión, objeto y paquetes de formatos. Convertir defectos importantes en RED→GREEN antes de registrar huellas. Expected: cero lecturas pendientes; conteos o pruebas por sí solos no acreditan pertinencia.

### Task 5: gates y conservación

- [x] Comprobar procesos y detener solo el Worker propio antes de builds. Ejecutar backend test/build, frontend actividades/build, `pnpm cloudflare:build` dry-run, lints, Node y precaché. Expected: cero errores, JS ≤2 MiB y todos precargados; sin despliegue.
- [x] Comparar fuente/compilado, 16 optativas anteriores, comunes, catálogo congelado y 12 baselines en solo lectura. Expected: no regenerar antecedentes ni rebaseline. Documentar bloqueos reales de DB sin inventar éxito.

### Task 6: Development y persistencia

- [x] Reconfirmar PG/Auth/Storage/frontend y assets iguales al build. Instalación individual idempotente de catálogo/fuente y contexto QA existente solo con conectividad verificable. Expected: historia anterior exacta, cero cuentas/estudiantes nuevos.
- [x] Muestras de cuatro componentes/37 indicadores, cuatro formatos, manuales, puntos pendientes, fuente/exclusiones, guardado/reapertura y estrategia aislada exacta. Expected: medir incidencias, preservar IDs y no repetir bucles ante el bloqueo externo.

### Task 7: navegador y revisión

- [ ] Recorrido con cuenta personal solo si existe sesión. Si pide contraseña, registrar límite y pasos manuales sin correo o cambios de credenciales. Expected: no atribuir QA a cuenta personal ni crear baseline sin recorrido real.
- [x] Revisión propia separada por prohibición de subagentes; importantes RED→GREEN, menores documentados. Expected: reconocer menor independencia.

### Task 8: informe y commit local

- [x] Actualizar informe, matriz, maestro y continuación; revisar diff, UTF-8 y exclusión de secretos, respaldos y credenciales QA. Expected: solo archivos públicos explícitos.
- [x] Commit local en español del bloque verificado, conservando limitaciones. NO PUSH. Continuar CT6 y tareas independientes autorizadas.

Resultado: Tasks1–6 completadas; revisión propia completada. Recorrido personal Task7 bloqueado y documentado. Cierre documental y commit local Task8 conservan ese pendiente; no declarar finalización end-to-end personal ni del encargo integral. Push retenido.
