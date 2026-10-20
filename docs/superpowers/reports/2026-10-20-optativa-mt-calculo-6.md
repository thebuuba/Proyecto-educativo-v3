# Trigonometría, Cálculo Diferencial y Tecnología de 6.º

Código conectado, 272 instrumentos completos revisados y catálogo **138 instalado en Development**. La verificación HTTP está **parcial y bloqueada por fallos DNS del runtime local**: 17 de 32 muestras verificadas, 18 actividades conservadas. El recorrido personal está bloqueado por autenticación. No se declara completado todo el bloque ni el encargo integral.

Rama ampliacion-de-instrumentos-2, base 6fb2ea0c59a6b36a6df5e05bbc97d807582e48e5. Commit local al cerrar este checkpoint; consultar Git para el hash. Sin push, merge, producción ni despliegue.

## Fuente y cobertura efectiva

OPT-MT-6, salida Matemática y Tecnología, modalidad Académica, sexto/ciclo 2. Scope 09e061a8-e3e7-55d8-a7ce-c24364f19401, PDF 496–497, impresas 495–496. Se reutilizó la lectura visual y clasificación existentes. La asignación/importación dice literalmente «Tigonometría, Cálculo Diferencial y Tecnología» y la malla «Trigonometría…». I46 conserva «cardiode»; la adaptación matemática usa cardioide. No se reconstruye la fuente ni se inventa un temario completo por el nombre.

57 registros: 14 competencias, 22 C/P/A y 21 indicadores. Se adaptan 17 anclas: seis conceptos, nueve procedimientos y A31/A34 condicionados a consigna colaborativa. Cinco disposiciones privadas se conservan y excluyen de evaluación. Las 16 agrupaciones cubren coordenadas y gráficas polares, conversión de ecuaciones/puntos, curvas polares, superficies cuádricas, funciones y derivadas vectoriales; los indicadores aportan superficie reglada, esferoide y cardioide.

Ecuaciones, dominios, parámetros, intervalos, unidades y convenciones son los proporcionados. Una curva plana no se convierte en superficie3D ni toda cuádrica se considera reglada. No se exige integrar, graficar o evaluar la función original cuando solo se pide derivar. Casos comunitarios, ambientales o de salud usan modelos ficticios o datos dados, sin intervenciones reales.

## Implementación y revisión

Se reutilizan el parser matemático, registro optativo, cinco entradas existentes, alternativa local y cuatro formateadores. Metadata en secondary-optative-mt-6.ts, selección y evidencias en secondary-optative-calculus-evidence.ts, registro compartido en secondary-optative-math.ts. Catálogo137 congelado, actual138; fixtures y contratos de backend/frontend, herramientas de fuente/QA/HTTP/inventario con allowlist explícita de sexto. Sin nuevas dependencias, migraciones ni cambios del formulario.

52 contratos y 16 consignas breves generan 272 instrumentos completos. Lectura registrada por huella: 79 textos distintos reconstruidos exactamente mediante 22 familias de cinco progresiones; 68 consignas y todos sus criterios, relaciones de metadata y 21 paquetes de formatos/puntuación. Se revisó pertinencia y contenido completo; las muestras no acreditan todas las variantes de cada fila curricular.

Fallos reproducidos antes de corregir:

- Derivada vectorial plural no reconocida.
- Comparación polar/rectangular que perdía el segundo sistema.
- Construcción de ecuación de superficie que añadía gráfica y conversión.
- Consigna breve de conversión de un punto que perdía el objeto.
- «Analiza gráfica…» interpretado como orden de dibujar. Regresión RED EXERCISE_SET frente a ANALYSIS, corregida solo en sexto; los imperativos de graficar siguen contratados.

Quedan artículos poco naturales o cláusulas repetidas sin requisitos adicionales. La etiqueta «gráfica de la ecuación polar» también agrupa problemas/modelos de la ecuación, sin exigir dibujo si no se pide. Son menores diferidos. Revisión propia, de menor independencia por prohibición expresa de subagentes.

## Comprobaciones ejecutadas

Contratos focalizados: backend 426/0, frontend 421/0; manuales, contexto sin ciclo explícito, negativos de grado/modalidad, paridad, puntos pendientes y sumas exactas20/17.35. Suites globales finales: **backend 84.259 pruebas/180 archivos/0 fallos; frontend actividades 83.132/113/0**. No se ejecutó toda la suite del frontend. Fuente/inventario/historia43/0 y precaché1/0; lints sin errores, nueve advertencias previas en actividades.

Shared, backend, frontend y pnpm cloudflare:build terminaron con código0; Cloudflare fue **dry-run**, sin despliegue. El primer build frontend falló: archivo principal2.097.504 bytes, 352 sobre el límite. La prueba específica también falló antes de separar metadata pura MT4/5/6 en un chunk siguiendo el patrón existente. Builds afectados repetidos y prueba GREEN: 74JS precargados, máximo2.044.953, límite2.097.152, margen52.199. No se elevó el límite ni retiraron assets de la precaché.

Los272 instrumentos coinciden entre fuente y backend compilado. Contra137 congelado permanecen exactas15.176 definiciones de Inglés común,2.888 de Matemática común y10.492 instrumentos completos de14optativas anteriores; también Sociales, Artística, Física y Formación Humana comunes. Las36diferencias con artefactos históricos ya existían en137; no se regeneraron. Las12baselines personales anteriores se comprobaron en lectura antes y después deQA, sin sobrescribirlas.

## Development, HTTP y bloqueo real

Antes de escribir se comprobó PostgreSQL app_backend_local sin BYPASSRLS, Auth200, Storage200 y variables públicas exclusivamente Development eolgunypmtgrsyrjzcld. Assets servidos iguales al build por hash. Entry /assets/index-ChFXkJmQ.js; principal src-hsQNegb5.js, SHA256 6d4e4c1320705ee3715997d051c7bda502fdbdc0d1262b64ec9a709fde2fcd28. La pestaña de acceso cargó ese entry. No se limpiaron manualmente SW, cachés, almacenamiento o borradores; el chequeo HTTP no inspecciona registros internos del navegador.

Catálogo138: CREATED/UNCHANGED, conservando70releases/870snapshots anteriores. Fuente individual MINERD_SECUNDARIA_2023_OPT_MT_6_V1, versión 7bae08c5-3493-5e56-a174-7749563068d4,57registros/cinco exclusiones, también idempotente. Contexto QA6 preparado dos veces, curso existente intacto y sin crear cuentas ni estudiantes.

Se planificaron32consignas que representan21indicadores. **17 están verificadas por HTTP/DB**, con los cuatro formatos,20/17.35, fuente, paridad, texto manual, puntos pendientes, guardado/reapertura y estrategia sola conservando exactamente instrumento y snapshot. Estas17muestras representan20indicadores. Una18.ªactividad está creada y pendiente de verificar reapertura;14muestras aún no se crearon. No se atribuye verificación a esas15muestras pendientes.

Hubo139solicitudes registradas en dos intentos, **dosHTTP500** en GET de reapertura y dos400 esperados del mismo referente excluido, uno por intento. En ambos500 el log registró ENOTFOUND aws-0-us-east-1.pooler.supabase.com y el proceso local terminó con código1. Se conservaron logs, errores, timings e IDs. Tras el primer fallo, DNS y PostgreSQL volvieron a responder y se reanudó con el mismo build y progreso, sin duplicar actividades. Al repetirse se dejó bloqueada la ejecuciónHTTP; no se aumentaron timeouts ni se cambió configuración, credenciales, DNS del equipo o código para ocultarlo. La causa inmediata está documentada; la causa de infraestructura más profunda no está establecida. El runtime local está detenido en este checkpoint.

Medianas de solicitudes exitosas de ambos intentos: interpretación8313ms, recomendación6614ms, escritura5459ms. Incluyen relecturas durante recuperación; no prueban una mejora o regresión causal del proveedor.

Lectura posterior de integridad: **71releases/888snapshots**,70/870previos exactos,18actividades y18snapshotsQA nuevos, **cero duplicados**. No se creó actividad ni baseline personalMT5/6. La18.ªactividad pendiente y sus datos permanecen conservados en el progreso privado; no reiniciar la prueba desde cero.

## Navegador y continuación

La pestaña personal conservada muestra «Inicia sesión». Continuar con la cuenta recordada abre un campo de contraseña vacío; no existe acceso automático. No se envió el formulario, cambió contraseña ni solicitó otro correo. Capturas privadas conservadas. **No se probó el creador autenticado MT6 con la cuenta personal**; QA porAPI no sustituye esa prueba.

Pendientes reales: recuperar estabilidad de conexión del runtime local; reanudar el mismo progresoHTTP para verificar la18.ªactividad y completar las14restantes; comprobar de nuevo historia/baselines; recuperar la sesión personal y hacer el recorrido visual con un contexto QA propio separado. Consigna manual: «Calcula la derivada de la función vectorial dada por componentes y con el dominio indicado». Verificar estrategia visible/AUTO/MANUAL, cuatro formatos, puntos vacíos, criterio manual,17.35→20→17.35, guardar/reabrir y cambiar solo estrategia conservando exactamente el instrumento. No repetir una baseline existente ni usar actividades académicas previas como QA.

Continúan tareas independientes de CT4, CT5 y CT6, modalidades especializadas y pendientes personales anteriores. La clasificación de CT4 y sus borradores privados no son cobertura implementada. El inventario refleja MT6comoHTTPparcial. Los pushes siguen retenidos por instrucción expresa hasta revisar integraciones403; no se cambiaron permisos, triggers ni integraciones. Un build o preview no acredita un despliegue efectivo.
