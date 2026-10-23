# Lengua Española de 1.º: conocimiento nuevo expresado oralmente

La versión169 distingue el razonamiento oral del escrito y completa el último componente curricular pendiente de Lengua de1.º: construir y explicar una relación nueva sustentada en textos. Dos actividades naturales fueron fijadas por el diseñador antes de generar; el coordinador y el revisor independiente leyeron sus ocho instrumentos completos y dos selecciones. La aceptación corresponde a169-v2.

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

La verificación operativa final169 está pendiente de instalación individual y cuatro pruebas HTTP en Development. La versión168 ya está verificada:99 releases/1261 snapshots y15 referencias personales originales exactas. La comprobación visual personal sigue bloqueada por Debugger unattached; HTTP QA no sustituye el recorrido de tu sesión. No se cambiaron contraseñas, enviaron correos ni borró almacenamiento.

Los otros81 contextos continúan pendientes de auditoría integral. Auditor y diseñador preparan Inglés común de1.º desde201 registros oficiales. Solo commits locales en ampliacion-de-instrumentos-2; sin push, merge, despliegue ni cambios de producción.
