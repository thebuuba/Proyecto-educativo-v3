# Ofimática de cuarto: implementación local y verificación

Ofimática MF_002_3 de cuarto técnico tiene 81 adaptaciones, 95 consignas y 380 instrumentos completos revisados. La fuente está instalada en Development. El catálogo143 revisado está instalado idempotentemente enDevelopment, junto con contextos QA ypersonal separados. Las95pruebasHTTP/DB están enejecución; el recorrido personal sigue bloqueado por la herramienta de navegador.

La implementación inicial quedó en el commit local 4dd1572569a15def5cd12e0ba8fd0fd0df8535b1. El ajuste posterior de justificación se guarda en un segundo commit local después de sus verificaciones. Los pushes continúan retenidos por instrucción del usuario.

## Correcciones y revisión de pertinencia

La lectura detectó sustantivos interpretados como verbos, acciones perdidas al compartir objeto y evidencias repetidas para acciones diferentes. Se corrigieron, entre otros, la distinción entre insertar una tabla y ordenar sus datos, aplicar una fórmula y organizar registros, transcribir y registrar mediciones, comparar y combinar documentos, y producir tablas o gráficos dinámicos.

La preparación del caso personal detectó una variante adicional: comparar documentos y justificar una decisión todavía exigía combinarlos. Se reprodujo con una prueba fallida y se corrigió la relación usada por la justificación. Las 1.575 pruebas focalizadas posteriores pasaron. Los 376 instrumentos anteriores permanecieron exactamente iguales; se añadieron los cuatro formatos de la nueva consigna.

Se leyeron 109 textos completos con cinco niveles y 95 ensamblajes. Se revisaron un paquete de cuatro formatos de tablas, la escala de frecuencia y los cuatro formatos de la nueva justificación. La correspondencia exacta con las definiciones completas está registrada en [la revisión](../../curriculum/cobertura-secundaria/technical-mf002-4-revision.json) y en los [ejemplos completos](../../curriculum/cobertura-secundaria/technical-mf002-4-instrumentos.json). Las adaptaciones pedagógicas se distinguen de los literales oficiales.

Se conserva el motor compartido, los identificadores de MF053, el creador vertical, las selecciones manuales y los puntos pendientes. No se impone envío real de correo, publicación, ejecución de macros ni cuentas o credenciales reales.

## Fuente e instalación

IFC007 es la fuente principal; IFC006 corrobora la asignación y los RA/CE. Un módulo común no se duplica por figurar en ambos programas. No existe un programa de matrícula en el contexto actual y no se afirma validarlo.

El manifest conserva dos documentos y un ámbito de cuarto técnico: 192 elementos, 271 referencias de página y 18 registros documentales con 31 partes adicionales. Se mantienen los 210 literales y 302 partes revisados, incluidos los códigos duplicados impresos. Las 22 actitudes se excluyen de evaluación; los RA y orientaciones docentes se preservan como metadata sin falsear sus tipos. El año 2017 es normativo; la edición editorial permanece desconocida.

El instalador individual exige ambos PDF y sus hashes, variables Development y un rol sin bypass de RLS. Crea en una transacción y comprueba una versión existente sin repararla ni sobrescribirla. Fuente, manifest e instalador tienen 16 pruebas Node aprobadas. La fuente quedó CREATED y luego UNCHANGED, conservando 75 releases y 985 snapshots. Versión: a326c59a-9acb-5ee7-8cde-25837c465ac1; ámbito: c6e5481a-89fb-5e4f-8532-5c3a7e9a1503.

Al descubrir la variante de justificación se confirmó mediante lectura que143 aún no existía en la base. Se detuvo únicamente el proceso identificado de instalación del catálogo y se volvió a confirmar su ausencia. No se retiró ni modificó ninguna versión publicada. La fuente ya instalada y los datos anteriores permanecen intactos.

## Verificaciones y entorno

Antes del ajuste adicional pasaron 91.000 pruebas backend, 89.545 de actividades frontend, los builds shared/backend/frontend/Cloudflare y los lints. Cloudflare ejecutó solo dry-run. Después del ajuste pasaron **91.010 pruebas backend** (193archivos), **89.553 de actividades frontend** (118archivos), loscuatrobuildsylints. Cloudflare fue dry-run, sin despliegue. El primer fallo general anterior se limitó a tres expectativas del número de catálogo: se actualizaron a143 conservando los asserts históricos y se repitió la suite.

La comparación anterior al ajuste confirmó296definiciones MF053,15.176deInglés,2.888deMatemática y14.488de18optativas exactas a142, además del payload142 completo y sus campos anteriores. Las36diferencias frente a artefactos antiguos ya existían en142. La comparación compilada posterior al ajuste confirmó los380instrumentosMF002 y296MF053 exactos a los ejemplos revisados y elpayload142 completo intacto. Los13baselines personales se verificaron sin regenerarlos.

El Worker se inició con logs nuevos. PostgreSQL app_backend_local/sin bypass, Auth200, Storage200 y assets servidos se verificaron exclusivamente en Development eolgunypmtgrsyrjzcld. Los76assetsJS estaban precargados, con un máximo de1.908.851bytes, inferior a2MiB. La comprobación final se repitió sobre elbuildcorregido: entrada /assets/index-CIegXYrw.js ychunk técnico instrumentos-tecnicos-COWcEdwZ.js de254.673bytes, SHA256 9756d1c9a7e14470af65d8ec96f3c7d58fd9b1281e336ab88a9dac9cbe3d2ebc. Losassetsservidoscoinciden conelbuild ysoloDevelopment.

ComputerUse no pudo determinar con seguridad la URL deChrome y detuvo la automatización. No se completó la prueba personal ni se modificaron caché, serviceworker, almacenamiento o borradores. La sesión visual queda pendiente; las pruebas HTTP no la sustituyen.

## Prueba personal pendiente

Después de confirmar el catálogo y el contexto, entrar con la cuenta propia de Development al curso separado «4.º Técnico Profesional QA MF002 Development», asignatura Ofimática.

1. Abrir el creador vacío y comprobar los cuatro controles y los puntos pendientes.
2. Usar el título «QA Development · Comparación de documentos · MF002 · 20oct» y la descripción «Compara las dos versiones del documento de texto del caso concreto y justifica tu decisión con los datos dados.»
3. Comprobar la estrategia automática «Estudio de caso», el instrumento completo y los cuatro formatos mediante selección manual. Volver a rúbrica, introducir17.35 y comprobar8.68+8.67; probar20 y regresar a17.35.
4. Editar manualmente un criterio, guardar y reabrir. Cambiar únicamente la estrategia a una opción manual y verificar que textos, puntos, pesos e instrumento permanezcan exactamente iguales después de guardar y reabrir.
5. Conservar esa actividad como evidencia identificable. No borrar datos ni almacenamiento para repetir la prueba.

La consigna y la estrategia se comprobaron de forma local; no se presentan como recorrido visual realizado. La instalación revisada delcatálogo terminó CREATED/UNCHANGED y loscontextos QA/personal pasaron dosveces, sin alterar datosanteriores ni crear cuentas oestudiantes. Antes deHTTP se comprobaron75releases/985snapshots previos exactos y76releases actuales. Faltan completar95muestrasHTTP/DB, repetir conservación después deesas escrituras yelrecorrido personal. El borrador y los cuatro IDs QA deMF053 se conservan. Este bloque no cierra el encargo integral ni las demás modalidades especializadas.

## Antecedente verificado: contexto y congelación de142


La fuente de `MF_002_3` quedó transcrita y revisada en el commit local `20d49102c6e8b6283e6f59856b7f7add3fc9f9c9`. Este bloque prepara la resolución del contexto técnico y conserva el catálogo 142. **Ofimática todavía no tiene proveedor conectado ni instrumentos completos revisados.**

El contexto reconoce únicamente los módulos revisados, por código, grado, ciclo y modalidad. Ofimática requiere cuarto de secundaria, segundo ciclo y modalidad Técnico Profesional, sin salida optativa académica. El nombre operativo puede abreviarse sin alterar esa identidad. Un mapping manual no permite usar otro grado o modalidad ni elegir arbitrariamente entre ámbitos duplicados.

La selección de fuente requiere IFC007 como documento principal y la procedencia revisada IFC006/IFC007. Esos códigos describen documentos: el esquema actual no contiene un programa de matrícula y no se afirma haber validado ese dato del estudiante. Los módulos técnicos desconocidos y las fuentes académicas históricas no pueden capturar este contexto. El manifest ya instalado de MF053 mantiene su compatibilidad.

Antes de modificar el código se consultó Development en modo de solo lectura y se congeló `evaluation-2026.142`. El payload compilado coincidió con el instalado; se conservaron 75 releases y 985 snapshots, incluido todo el historial anterior. Se guardaron una copia del motor y 15.176 definiciones de Inglés, iguales a sus referencias anteriores. El catálogo actual sigue en 142: no se creó ni instaló un release 143.

Pruebas del contexto: 19 fallos esperados y 11 casos ya compatibles antes de la corrección; después, **831 pruebas focalizadas aprobadas**, incluyendo MF053, resolución curricular y catálogos históricos. Suite backend final: **90.128/90.128**, 191 archivos. Los builds de backend, frontend y `pnpm cloudflare:build` terminaron con código 0; Cloudflare ejecutó únicamente `dry-run`. Lint de los cinco archivos afectados: código 0. Fuente documental: 5/5. Precaché: 76 assets JavaScript incluidos; el mayor ocupa 1.908.851 bytes dentro del límite de 2.097.152.

La comparación posterior al build verificó el payload 142 completo y las 296 definiciones completas de MF053, iguales entre fuente, compilado y ejemplos revisados. SHA256 del payload conservado: `3122a05e0585e7efbaa1fd0e3ce3614cbdf400e8d9116ed47c8a8d84f9261e6f`. No se repitió la suite de actividades frontend: este bloque no modificó componentes ni proveedores compartidos y esa suite mantiene su resultado previo de 88.792 pruebas. Las comprobaciones requeridas de backend y los builds sí se ejecutaron sobre estos cambios.

Se prepararon 91 consignas esperadas, con 81 adaptaciones por desarrollar. Incluyen sistema operativo, periféricos, procesamiento de textos, tablas, correspondencia, hojas de cálculo, presentaciones, archivos, búsqueda y correo; además de alternativas, acciones independientes, negaciones y un título incompatible. Estos contratos no equivalen a instrumentos implementados ni a cobertura verificada.

Los siguientes pasos son implementar los cuatro formatos mediante el proveedor compartido, revisar completos los instrumentos y su pertinencia, y después realizar las pruebas HTTP/DB y de navegador personal. Las 22 actitudes y las nueve orientaciones docentes de la fuente se conservan separadas de los entregables. El informe de [fuentes](2026-10-20-tecnico-ofimatica-4-fuentes.md) contiene los límites de adaptación y la evidencia documental.

No hubo escrituras remotas, cambios de producción, despliegues, merge ni push. MF053 conserva sus tres recorridos HTTP completos, cuatro actividades QA persistidas y el borrador personal sin guardar. Su Worker quedó detenido por DNS; este avance no resuelve ni da por superado ese pendiente.
