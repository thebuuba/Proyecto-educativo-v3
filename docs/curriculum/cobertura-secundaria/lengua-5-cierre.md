> Actualización del flujo de criterios (.46): el cierre previo conservó una regresión de añadir/completar no detectada en sus ejemplos. Se corrigieron agotamiento, recuperación, intención/identidades, respuestas obsoletas y procedencia; se verificaron los proveedores de las40 familias de Lengua y los cuatro formatos. [Informe y límites](criterios-adicionales-informe.md), [matriz](criterios-matriz-proveedores.md). Las evidencias anteriores permanecen intactas; no se amplía el ámbito curricular.

# Lengua Española común: familias verificadas de 5.º

Actualización al cierre de sexto, catálogo `.33`: se corrigió la redacción analítica de las dimensiones del entremés cuando la tarea es representarlo. Conflicto y crítica se observan ahora en la escena; el análisis conserva sus criterios. Ocho regresiones compartidas de quinto/sexto y cuatro propuestas HTTP de entremés verifican los cuatro formatos. Una ponderada adicional, actividad `ce5a35c6-4ade-449a-95b3-879cff3baed5` a 17.35, se guardó y reabrió con textos manuales intactos: [persistencia](evidencias/lengua-5-cierre-persistencia.json), [navegador](evidencias/lengua-5-cierre-flujo-navegador.json). El estado vigente está en el [informe conjunto](lengua-comun-1-6-informe-final.md); las referencias a sexto pendiente que siguen son históricas.

Se verificaron los siete temas y sus familias definidas, con 145 consignas en los cuatro instrumentos. Sexto continúa pendiente. El alcance es el cotejo y las familias comprobadas, no la interpretación de cualquier descripción imaginable.

## Causa y cambios

La reproducción inicial produjo 28 fallos: los siete temas no tenían un proveedor completo de quinto. El análisis de novela policíaca era una adaptación parcial útil, pero no cubría las restantes acciones y contenidos oficiales. Se conectaron perfiles y requisitos explícitos al compositor compartido y a la alternativa local; las filas e identidades ya verificadas de novela policíaca se conservaron, sin duplicar su criterio de personajes. Los candidatos adicionales siguen disponibles.

El cotejo visual de PDF105–112 encontró ocho conceptos de novela y cinco bloques de procedimientos ausentes de la extracción original. Se añadieron al inventario auditado con región, página y procedencia, validando referencias y rechazando páginas ajenas, tipos inválidos y duplicados. La extracción y la base curricular original permanecen intactas: los identificadores `reviewed-*` no son filas instaladas en la base. Esta omisión documental se distinguió de la falta de conexión evaluativa.

También se reprodujeron errores compartidos de selección: el sustantivo «contraste» dentro de los conectores activaba comparación, y una investigación complementaria desplazaba la lectura principal. Ahora se reconoce la acción y su posición. La descripción prevalece sobre títulos incompatibles; reseñar una novela sigue siendo reseña, y presentar un análisis por escrito no fuerza oralidad.

La prueba en editor condujo a dos ajustes finales: la representación del entremés utiliza el tipo existente Representación y la técnica Dramatización; la recitación satírica evalúa el sentido de la crítica y no duplica la entonación en dos filas. El formato se recomienda por finalidad y conserva la elección manual. No se introdujo IA, rediseño ni dependencia nueva.

## Cobertura definida

| Tema | Familias comprobadas |
|---|---|
| Carta de autopresentación | Comprensión/análisis, planificación/escritura, comparación, informe |
| Reseña | Comprensión/análisis, planificación/escritura, comparación, debate, informe |
| Ensayo argumentativo | Comprensión/análisis, planificación/escritura, comparación, debate, informe |
| Discurso de recibimiento y despedida | Comprensión/análisis, planificación/escritura, producción oral, comparación, debate, informe |
| Novela | Comprensión/análisis de pasajes, comparación, debate; análisis escrito e informe policíaco heredados |
| Poesía satírica | Comprensión/análisis, escritura, recitación, comparación, debate, informe |
| Entremés teatral | Comprensión/análisis, escritura, representación, comparación, debate, informe, investigación de autor/contexto |

69 registros conceptuales equivalen a 68 conceptos lógicos; 28 registros de procedimientos, a 26 modalidades y dos continuaciones. Las notas de reseña y ensayo vinculan oralidad preparatoria con escritura. La novela prioriza comprensión y limita las inferencias al texto disponible. Se preserva literalmente «ponente» en el documento oficial y se distingue de la adaptación de roles. Las optativas no se mezclan con la asignatura común.

Gramática, referencias, citas, argumentos, figuras y procedimientos se activan cuando se solicitan. Soporte físico o digital conserva la alternativa; verso y prosa respetan la elección. Envío, publicación, fuentes externas y representación no se imponen por la sola presencia del género. La aplicación registra evidencia del envío solo si la consigna lo solicita; el motor no envía mensajes.

## Pruebas y entorno

- 145 consignas: siete básicas, 69 registros conceptuales y 69 procedimientos/familias/requisitos. Los cuatro formatos conservan progresiones contextualizadas, cotejo observable, escala de grado/frecuencia y ponderación con evidencia parcial.
- Backend final: **3.729 pruebas**, 54 archivos. Frontend completo: **7.907 pruebas**, 97 archivos; después de los últimos ajustes, **1.767 pruebas** de contrato/editor en dos archivos. Las 1.740 combinaciones del contrato de quinto comparan servicio y alternativa, títulos incompatibles y puntuación pendiente/15/20/17.35 antes y después.
- HTTP normal con contexto académico real: **304 recomendaciones** en .30, 76 consignas y cuatro formatos. En .31: **21 solicitudes** adicionales comprueban interpretación/recomendación de los cuatro formatos, cuatro elecciones manuales y las ocho propuestas finales de representación/recitación. Los subtemas completos se comprobaron en contratos automatizados; no se presentan como 69 recorridos manuales.
- Navegador autenticado con cuenta ficticia: rúbrica de reseña (20) y cotejo de carta (17.35) en .30; escala de recitación (15) y ponderada de entremés (17.35) en .31. Se verificaron selector automático, puntaje pendiente, edición manual, resumen, guardado y reapertura desde el listado. Todos los campos capturados coinciden con los campos y snapshots persistidos.
- **64 snapshots preservados**: 28 de referencia y 36 instrumentos completos capturados. Ningún reset ni sobrescritura histórica. Backend/frontend build y Cloudflare dry-run aprobados; no es un despliegue.

El diálogo transaccional conserva sus regresiones globales: conservar mantiene textos/identidades/puntos y bloquea sustitución automática; adaptar aplica solo una respuesta válida y vigente; cancelar/Escape/cierre no mutan; fallo conserva y permite reintentar. Los callbacks del editor se distinguen de los cuatro guardados reales de este grado.

Rama `amplia-instrumentos-secundaria`, repositorio `thebuuba/Proyecto-educativo-v3`. Base ejecutada durante este bloque: `c3d777e0b178f3e3b20738ef4122194026daa822` con cambios del bloque; catálogo final instalado/cargado `evaluation-2026.31`. Frontend Vite local5173, backend3000 y Supabase local54321. .29 y .30 se archivaron; no se desplegó producción.

## Evidencia y archivos

- [Cotejo de fuente y contratos](lengua-5-cotejo-fuente.json) · [omisiones recuperadas del PDF](lengua-5-omisiones-extraccion.json).
- [Servicio .30](evidencias/lengua-5-final-servicio.json) · [instrumentos completos .30](evidencias/lengua-5-final-instrumentos.json) · [instrumentos finales y selección .31](evidencias/lengua-5-seleccion-servicio.json).
- [Recorridos de navegador](evidencias/lengua-5-final-flujo-navegador.json) · [persistencia real](evidencias/lengua-5-final-persistencia.json) · [históricos](evidencias/lengua-historicos-evaluation-2026.31.json).
- [Escala reabierta](evidencias/lengua-5-final-escala.png) · [ponderada reabierta](evidencias/lengua-5-final-lista-ponderada.png).

Cambios principales: perfiles `secondary-topics/language/grade-5.ts`, características y compositor `secondary-language-grade-five-*`; selección y adaptación compartidas; conexión de servicio/alternativa; catálogos29/30/current; generador y pruebas del inventario; contratos/backend/editor/frontend y scripts de fuente/HTTP. Matriz, inventario, revisión, avance y continuación actualizados. El JSON de persistencia contiene los instrumentos completos con las ediciones manuales, no únicamente el número de filas o su suma.
