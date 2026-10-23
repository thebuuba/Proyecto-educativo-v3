# Lengua Española de 1.º: conocimiento nuevo expresado oralmente

La versión 169 distingue el razonamiento oral del escrito y completa el último componente curricular pendiente de Lengua de 1.º: construir y explicar una relación nueva sustentada en textos. Dos actividades naturales fueron fijadas por el diseñador antes de generar; el coordinador y el revisor independiente leyeron sus ocho instrumentos completos y dos selecciones. La aceptación corresponde a169-v2.

## Causas y cambios

ORAL01 recibía criterios pertinentes de inferencia, pero omitía la explicación oral. ORAL02 llegaba a criterios genéricos y a una actividad de resolución de problemas, pese a pedir una conclusión oral a partir de dos explicaciones. La detección ahora conserva esa modalidad y propone exposición como actividad y técnica. No impone una estrategia: ambos casos devuelven null/NONE.

La primera corrección dejó dos reservas en ORAL02: permitía conclusión o cuestión abierta como alternativas excluyentes y no graduaba el tratamiento de diferencias entre fuentes. Ahora admite una conclusión integrada o provisional que explicite lo comprendido y lo aún abierto. La diferencia puede estar bien identificada, necesitar precisión, estar omitida o estar distorsionada; los niveles distinguen esos casos. ORAL01 no recibe requisitos adicionales de ORAL02. Se permiten notas y la evaluación individual exige evidencia atribuible cuando el producto es grupal.

Archivos principales: packages/shared/src/secondary-language-grade-one-community.ts, curricular-oral-knowledge.spec.ts, catalog-current.ts y su prueba, copia histórica catalog-v168.ts y tres aserciones de versión de contratos de Ciencias Sociales. Estas últimas no alteran contenido de esa asignatura. No se modifica UI, esquema remoto, cuentas ni datos históricos.

## Verificación local

- Ocho fallos iniciales reproducidos; tras la primera corrección, cuatro fallos adicionales reproducen las reservas del revisor. Suite focal final:179 pruebas aprobadas.
- Backend completo:98.126 pruebas en241 archivos. Frontend focal:123 pruebas en siete archivos.
- Builds de backend y frontend, pnpm cloudflare:build y lints de backend, frontend y shared: ocho gates con salida0, ejecutados secuencialmente. Cloudflare termina en dry-run; no despliega.
- Los752 instrumentos anteriores mantienen exactamente su contenido. Los ocho nuevos tienen paridad entre recomendación y preparación, puntuación inicial vacía, máximo20 criterios, totales20/17,35 y conservación de edición manual.
- Mayor archivo JavaScript: src-Ry4qWSCU.js, 2084195 bytes, dentro del límite de precaché vigente. No se aumentó dicho límite.

Capturas antes y después conservadas; manifiesto auditoria-curricular-len1-169-lectura8.json enlaza actividades, criterios, fuente y revisión. Las pruebas no sustituyen esa lectura pedagógica.

## Cobertura y pendientes

El auditor concilió161 filas oficiales de las páginas69–75, incluidas continuaciones, y metodología de la68:55 conceptos, seis encabezados,31 procedimientos,34 actitudes, siete competencias específicas, siete fundamentales y21 indicadores. Tras aceptar el componente oral, no encontró otro vacío curricular de Lengua1. La matriz registra cobertura curricular local de sus seis temas, con componentes distribuidos entre actividades; no certifica logros de estudiantes ni estados internos.

La versión 169 se instaló únicamente en AulaBase Development (eolgunypmtgrsyrjzcld), desde d1106d3681e025d83dfd192c10fe67893c7651e2; la segunda instalación fue UNCHANGED. PostgreSQL, Auth, Storage y frontend se verificaron en Development. Assets y service worker coincidían con la compilación. Se conservaron los 99 releases y 1261 snapshots anteriores; la lectura posterior por el conector confirmó 100 releases y 1265 snapshots, además de las 15 referencias personales originales exactas, sin recapturar baselines.

Las cuatro muestras QA quedaron guardadas y tres completaron reapertura, conservación de edición manual y cambio de estrategia sin alterar el instrumento. La cuarta, LEN1-NCO-ORAL02/lista-ponderada, sigue pendiente de reapertura HTTP: la consulta de actividades agotó el plazo incluso filtrada por período (120 segundos). Los intentos posteriores reutilizaron el mismo ID y no crearon duplicados. La lectura histórica por PostgreSQL también agotó plazos; el conector de solo lectura sí permitió contrastar las huellas originales. Esto no establece todavía la causa de la lentitud. Se detuvo el Worker 70376 tras el último intento; no se modificaron los plazos de la aplicación.

La comprobación visual personal sigue bloqueada por Debugger unattached; HTTP QA no sustituye el recorrido de tu sesión. No se cambiaron contraseñas, enviaron correos ni borró almacenamiento. La evidencia está en auditoria-curricular-len1-169-operativa-parcial.json.

Los otros 81 contextos continúan pendientes de auditoría integral. Auditor y diseñador preparan Inglés común de1.º desde 201 registros oficiales. Solo commits locales en ampliacion-de-instrumentos-2; sin push, merge, despliegue ni cambios de producción.
