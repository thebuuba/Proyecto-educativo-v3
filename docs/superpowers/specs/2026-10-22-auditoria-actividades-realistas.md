ENCARGO: AUDITORÍA Y CORRECCIÓN DE INSTRUMENTOS CON ACTIVIDADES DOCENTES REALISTAS

Complementa el encargo anterior. Conserva todo el avance, pero prioriza estabilidad y calidad del motor antes de seguir ampliando módulos.

No incorpores IA a AulaBase. Tú, Codex, puedes redactar actividades para probar el motor determinista existente.

OBJETIVO

Comprobar y corregir que AulaBase prepare instrumentos pertinentes para consignas breves, naturales y desarrolladas, en todos los contextos de secundaria actualmente implementados.

El instrumento debe:
- Cubrir los requisitos evaluables de la consigna.
- Evaluar el desempeño propio del tipo de actividad.
- Mantener precisión disciplinar.
- Agrupar requisitos relacionados sin ocultarlos.
- Evitar exigencias inventadas, duplicados y criterios genéricos de relleno.

No basta con generar muchos ejemplos o aprobar pruebas.

1. ESTADO Y CONEXIÓN

Lee las instrucciones del repositorio, el último informe y el archivo de continuación. Confirma rama, cambios, catálogo y entorno efectivos sin asumir que siguen iguales.

La última evidencia muestra bloqueos de conexión en Development. Investiga y corrige primero las causas demostradas que impiden generar, guardar y reabrir instrumentos.

Distingue DNS, conexión, pool, consultas, comparación del catálogo, servidor y renderizado. No atribuyas toda la demora a una sola medición ni la ocultes aumentando timeouts.

Realiza diagnósticos acotados, sin bucles de reintentos. Conserva las referencias históricas existentes; no vuelvas a capturarlas para hacer desaparecer diferencias.

Antes de reanudar escrituras, comprueba la conservación pendiente y reconcilia actividades ya creadas para no duplicarlas.

2. ALCANCE DE LA AUDITORÍA

Revisa todos los proveedores actualmente implementados:
- Asignaturas comunes.
- Optativas académicas.
- Módulos técnicos y especializados ya conectados.

No confundas ámbitos inventariados con implementados. No implementes nuevas especialidades durante esta auditoría.

Puedes continuar tareas independientes mientras exista un bloqueo externo, pero no declares verificado lo que no pudiste ejecutar.

3. BANCO DE ACTIVIDADES REALISTAS

Construye un banco trazable por asignatura, grado, tema y familia pertinente.

Por tema, prepara varias actividades que cambien realmente lo que el estudiante hará. Como referencia, utiliza 4–6 propuestas cuando existan familias distintas, justificando excepciones. No multipliques frases equivalentes para inflar cobertura.

Incluye:
- Consignas de una línea.
- Lenguaje habitual, incompleto o poco elaborado.
- Errores leves de escritura y puntuación.
- Consignas desarrolladas.
- Requisitos de contenido, proceso, producto y entrega.
- Alternativas, negaciones y cantidades.
- Actividades individuales, grupales y mixtas cuando correspondan.
- Títulos neutrales, descriptivos o incompatibles.
- Cambios de descripción conservando un título anterior.

El docente no debe necesitar escribir una planificación completa para obtener un instrumento útil.

Una consigna breve permite incorporar dimensiones pedagógicas propias del producto solicitado, pero no autoriza inventar condiciones particulares.

Ejemplo:
«Hacer un informe de lectura del texto trabajado».
Puede evaluarse comprensión y organización del informe; no se deben imponer tres páginas, bibliografía, exposición oral o un autor que el docente no indicó.

4. EVITAR PRUEBAS DISEÑADAS PARA EL MOTOR

Separa tres conjuntos:
A. Actividades reales del docente.
B. Actividades sintéticas de estilo docente breve.
C. Actividades de evaluación reservadas, redactadas sin consultar las expresiones que activan los proveedores.

Fija los requisitos esperados antes de ejecutar la aplicación. Conserva esos originales; no cambies las expectativas para acomodarlas a la salida obtenida.

No afirmes independencia externa: eres el mismo autor y no utilizarás subagentes. Documenta esa limitación.

Cuando no dispongas de una actividad real literal, marca el caso como reconstruido o sintético; no lo atribuyas al docente.

Usa actividades reales disponibles en el repositorio o facilitadas expresamente, sin extraer datos personales innecesarios.

5. MAPA DE REQUISITOS Y AGRUPACIÓN

Antes de evaluar cada salida, identifica:
- Requisitos explícitos.
- Dimensiones pedagógicas propias de la actividad.
- Condiciones opcionales.
- Alternativas.
- Exclusiones.
- Ambigüedades y contradicciones.

Relaciona cada requisito con el criterio, indicador o descriptor que lo evalúa.

Evita estos dos extremos:
- Un único criterio demasiado amplio que esconda varias evidencias distintas.
- Una fila por cada detalle menor que vuelva inmanejable el instrumento.

Agrupa requisitos por dimensión evaluativa coherente. No los agrupes solo porque aparecen en la misma oración.

EJEMPLO DE FORMATO

Consigna:
«Entregar un documento de Word con título, Arial 12, interlineado 1.5, sangría y el color indicado».

En rúbrica puede existir un criterio «Formato del documento» que detalle las condiciones expresamente pedidas. No crees automáticamente cinco criterios independientes.

Distingue:
- Apariencia y formato.
- Organización y secciones de contenido.
- Calidad del contenido.

Un título de portada puede pertenecer al formato; introducción, desarrollo y conclusión pueden requerir otra dimensión de organización.

En cotejo, permite verificar condiciones independientes sin inflar innecesariamente filas puntuables: utiliza agrupación o detalle compatible con la estructura existente. Si el modelo actual no admite subindicadores, documenta y resuelve el compromiso sin fingir que un único Sí/No distingue cada incumplimiento.

Los descriptores deben especificar cómo se valora el cumplimiento conjunto o parcial. No uses solamente «cumple parcialmente» o «presenta imprecisiones».

No inventes tolerancias, porcentajes o pesos. Cuando el docente no los indique, las decisiones evaluativas de AulaBase deben ser coherentes, editables y distinguibles de los requisitos originales.

6. CASOS PRIORITARIOS

A. EXPOSICIÓN SOBRE EL SISTEMA SOLAR
Caso sintético:
«Los estudiantes realizarán una exposición sobre el sistema solar. Presentarán todos los planetas y explicarán qué es cada uno. La exposición durará cinco minutos y utilizarán material de apoyo».

Comprobar:
- Cobertura de los planetas solicitados, sin exigir una fila por planeta.
- Explicación científica pertinente.
- Comunicación oral.
- Tiempo solicitado.
- Material de apoyo y su uso cuando corresponda.

No confundir «cinco minutos», «máximo cinco» y «aproximadamente cinco». No inventar una tolerancia no indicada.

B. TABLA PERIÓDICA, QUINTO
Recupera el texto literal si existe en el borrador autorizado. Si no, utiliza una reconstrucción claramente identificada:
«Los estudiantes realizarán una exposición sobre la tabla periódica, explicando sus grupos, períodos y por qué los elementos ocupan su posición».

Comprobar grupos, períodos, ubicación y desempeño oral. No reducirlo todo a un criterio sobre posición ni imponer un número fijo de filas.

C. OPERACIONES MATEMÁTICAS
«Los estudiantes resolverán ejercicios de multiplicación, resta y división».
Sin temperatura, unidades ni contextos inventados. Comparar con variantes que pidan explicación, justificación o crédito parcial.

D. FRANCÉS PRIMERO
«En parejas, los estudiantes se saludarán en francés y realizarán un diálogo breve para preguntar y responder su nombre, edad y lugar de residencia. Luego intercambiarán los roles».
Cubrir preguntas, respuestas, datos solicitados, interacción y ambos roles, sin exigir pronunciación nativa.

E. INFORME CON MUCHOS REQUISITOS
Probar límites de páginas, formato, secciones, evidencias y referencias expresas. Agrupar presentación sin ocultar contenido y sin hacer una fila por detalle tipográfico.

Incluye también contradicciones, alternativas y requisitos retirados al editar.

7. ESTRATEGIA AUTOMÁTICA

Investiga por qué se comunica «Sin estrategia» de forma recurrente:
- Ejecución de la recomendación.
- Reglas excesivamente restrictivas.
- Propagación al borrador y al selector.
- Estados AUTO/MANUAL/UNKNOWN.
- Recuperación y respuestas obsoletas.
- Compatibilidad entre catálogo y contexto.

Cuando exista fundamento, debe seleccionarse automáticamente y el docente debe poder cambiarla.

No conviertas una exposición estudiantil en estrategia expositiva del docente por compartir una palabra. Tampoco cualquier grupo en aprendizaje cooperativo ni cualquier problema en ABP.

Para consignas ambiguas, distingue una estrategia inferida de una propuesta pedagógica compatible. Si implementas una propuesta automática ante poca información, debe quedar registrada internamente como propuesta y no inventar acciones, recursos o criterios en el instrumento.

No rellenes con una estrategia arbitraria para eliminar valores vacíos.

Conserva la interfaz compacta y silenciosa, sin anuncios de detección.

8. AÑADIR Y COMPLETAR CRITERIOS

Reproduce:
- Instrumento con pocos criterios.
- Añadir candidato compatible.
- Agotamiento.
- Fila vacía o parcial.
- Criterio renombrado.
- Ediciones y pesos manuales.

Al agotarse candidatos, ofrece una acción efectiva para agregar una fila manual editable. Un aviso sin salida no es suficiente.

El límite de veinte criterios y la protección de instrumentos calificados siguen vigentes.

Completar debe actuar solo en campos vacíos y aportar contenido pertinente cuando exista fundamento. Si la intención de una fila es ambigua, informa y permite edición manual, sin fabricar texto genérico.

No redistribuyas puntuación ni sobrescribas cambios sin aplicar las protecciones existentes.

9. CALIDAD DE LOS CUATRO INSTRUMENTOS

Revisa rúbrica, cotejo, escala y ponderada con sus estructuras propias.

En rúbricas:
- Los niveles gradúan la misma evidencia.
- Identifican diferencias observables.
- Evitan repetir el nivel superior seguido de «con una imprecisión».
- Evitan descriptores inferiores intercambiables entre criterios distintos.

No dupliques valoración entre seleccionar, explicar o justificar. Sepáralos cuando realmente sean evidencias diferentes y redacta progresiones propias.

Recomienda por propósito; no impongas rúbrica universal ni variedad artificial.

Conserva puntos inicialmente vacíos, 20/17.35 exactos, selecciones manuales, cambios de formato y paridad servicio/alternativa.

10. COMPLEMENTAR LA BASE PEDAGÓGICA

Cuando falten criterios o descriptores:
- Determina si falla la conexión, la extracción o el contenido disponible.
- No atribuyas automáticamente la carencia al currículo.
- Añade adaptaciones pedagógicas y fuentes educativas o disciplinares fiables cuando sean necesarias.
- Documenta procedencia, alcance, grado y relación con el contenido.
- No presentes esas adaptaciones como citas oficiales.
- No importes texto masivamente ni agregues objetivos ajenos a la actividad.

11. PRUEBAS, MEDICIONES Y EVIDENCIA

Por caso registra:
- Consigna original y contexto.
- Requisitos esperados y agrupación.
- Sugerencias automáticas.
- Instrumento completo.
- Requisitos cubiertos, omitidos y añadidos indebidamente.
- Duplicados.
- Calidad de progresiones.
- Tiempo de preparación.
- Resultado antes/después de la corrección.

Usa un informe de discrepancias que permita encontrar causas compartidas y corregirlas para otras asignaturas, sin parches por títulos exactos.

Realiza:
- Pruebas focalizadas.
- HTTP/DB autenticado por contexto.
- Recorridos de navegador representativos por grado y asignatura.
- Guardado y reapertura.
- Añadir/completar.
- Cambio exclusivo de estrategia con instrumento idéntico.

Distingue evidencia automática, HTTP/DB y visual. No presentes ejemplos generados como recorridos reales ni pendientes como aprobados.

No ejecutes una matriz cartesiana enorme sin valor adicional: prioriza cobertura de temas y comportamientos, reproduce fallos y amplía por riesgos demostrados. No repitas suites completas sin motivo.

12. PRESERVACIÓN Y LÍMITES

Trabaja exclusivamente en Development. No cambies producción, Hyperdrive, secretos ni integraciones.

No despliegues, mezcles con main, hagas reset, force push o borres datos.
No añadas IA a la aplicación, dependencias, servicios de pago ni subagentes.
No realices nuevas migraciones remotas de esquema.

Conserva históricos, snapshots, releases, referencias de comparación y borradores personales.

Los pushes siguen suspendidos por las integraciones automáticas. Haz commits locales por bloques verificados y deja constancia de los pendientes de publicación. No interpretes este encargo como autorización para reanudar pushes.

13. CONTINUIDAD Y CIERRE

Trabaja autónomamente sin confirmaciones rutinarias entre temas o asignaturas. No ejecutes simultáneamente otra sesión que modifique los mismos archivos.

Mantén actualizado el archivo de continuación con estado efectivo, commits, catálogo, pruebas, bloqueos y siguiente acción.

Prioriza:
1. Estabilidad de Development.
2. Casos reales y fallos compartidos.
3. Auditoría de todas las asignaturas implementadas.
4. Revisión de la calidad corregida.

Entrega un informe con:
- Cobertura auditada y pendiente.
- Causas confirmadas.
- Cambios y archivos.
- Ejemplos completos antes/después.
- Matriz de requisitos y agrupaciones.
- Calidad pedagógica y fuentes complementarias.
- Rendimiento.
- Pruebas separadas por tipo.
- Preservación histórica.
- Rama, hashes, estado del árbol y commits sin publicar.
- Limitaciones reales.

No declares finalizada la auditoría solamente por cantidad de actividades o pruebas aprobadas.