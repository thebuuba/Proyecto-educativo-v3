# Ofimática de cuarto: contexto e implementación pendiente

La fuente de `MF_002_3` quedó transcrita y revisada en el commit local `20d49102c6e8b6283e6f59856b7f7add3fc9f9c9`. Este bloque prepara la resolución del contexto técnico y conserva el catálogo 142. **Ofimática todavía no tiene proveedor conectado ni instrumentos completos revisados.**

El contexto reconoce únicamente los módulos revisados, por código, grado, ciclo y modalidad. Ofimática requiere cuarto de secundaria, segundo ciclo y modalidad Técnico Profesional, sin salida optativa académica. El nombre operativo puede abreviarse sin alterar esa identidad. Un mapping manual no permite usar otro grado o modalidad ni elegir arbitrariamente entre ámbitos duplicados.

La selección de fuente requiere IFC007 como documento principal y la procedencia revisada IFC006/IFC007. Esos códigos describen documentos: el esquema actual no contiene un programa de matrícula y no se afirma haber validado ese dato del estudiante. Los módulos técnicos desconocidos y las fuentes académicas históricas no pueden capturar este contexto. El manifest ya instalado de MF053 mantiene su compatibilidad.

Antes de modificar el código se consultó Development en modo de solo lectura y se congeló `evaluation-2026.142`. El payload compilado coincidió con el instalado; se conservaron 75 releases y 985 snapshots, incluido todo el historial anterior. Se guardaron una copia del motor y 15.176 definiciones de Inglés, iguales a sus referencias anteriores. El catálogo actual sigue en 142: no se creó ni instaló un release 143.

Pruebas del contexto: 19 fallos esperados y 11 casos ya compatibles antes de la corrección; después, **831 pruebas focalizadas aprobadas**, incluyendo MF053, resolución curricular y catálogos históricos. Suite backend final: **90.128/90.128**, 191 archivos. Los builds de backend, frontend y `pnpm cloudflare:build` terminaron con código 0; Cloudflare ejecutó únicamente `dry-run`. Lint de los cinco archivos afectados: código 0. Fuente documental: 5/5. Precaché: 76 assets JavaScript incluidos; el mayor ocupa 1.908.851 bytes dentro del límite de 2.097.152.

La comparación posterior al build verificó el payload 142 completo y las 296 definiciones completas de MF053, iguales entre fuente, compilado y ejemplos revisados. SHA256 del payload conservado: `3122a05e0585e7efbaa1fd0e3ce3614cbdf400e8d9116ed47c8a8d84f9261e6f`. No se repitió la suite de actividades frontend: este bloque no modificó componentes ni proveedores compartidos y esa suite mantiene su resultado previo de 88.792 pruebas. Las comprobaciones requeridas de backend y los builds sí se ejecutaron sobre estos cambios.

Se prepararon 91 consignas esperadas, con 81 adaptaciones por desarrollar. Incluyen sistema operativo, periféricos, procesamiento de textos, tablas, correspondencia, hojas de cálculo, presentaciones, archivos, búsqueda y correo; además de alternativas, acciones independientes, negaciones y un título incompatible. Estos contratos no equivalen a instrumentos implementados ni a cobertura verificada.

Los siguientes pasos son implementar los cuatro formatos mediante el proveedor compartido, revisar completos los instrumentos y su pertinencia, y después realizar las pruebas HTTP/DB y de navegador personal. Las 22 actitudes y las nueve orientaciones docentes de la fuente se conservan separadas de los entregables. El informe de [fuentes](2026-10-20-tecnico-ofimatica-4-fuentes.md) contiene los límites de adaptación y la evidencia documental.

No hubo escrituras remotas, cambios de producción, despliegues, merge ni push. MF053 conserva sus tres recorridos HTTP completos, cuatro actividades QA persistidas y el borrador personal sin guardar. Su Worker quedó detenido por DNS; este avance no resuelve ni da por superado ese pendiente.
