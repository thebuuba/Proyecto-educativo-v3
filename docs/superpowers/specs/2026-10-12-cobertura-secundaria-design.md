Trabaja de forma autónoma en la cobertura completa de instrumentos evaluativos de Aula Base para todas las asignaturas, grados y optativas documentados en el currículo oficial de secundaria que adjunto.

Este es un encargo general, pero debes ejecutarlo progresivamente por módulos, conservar avances y verificar cada parte. No intentes resolverlo mediante una única plantilla genérica ni declares cobertura completa sin evidencia.

OBJETIVO

Aula Base debe preparar instrumentos pertinentes al nivel, grado, asignatura, tema, acción y producto que pide el docente, sin IA en tiempo de ejecución.

Cubrir los seis grados de secundaria y todas las asignaturas presentes en el documento, incluidas las optativas donde realmente correspondan.

1. REVISIÓN INICIAL Y CONSERVACIÓN

- Lee las instrucciones del repositorio.
- Revisa rama, git status, historial, cambios locales, catálogo y documentación.
- Identifica la restauración reciente del creador, aunque esté en una rama distinta o pendiente de commit.
- Conserva todos los cambios existentes. No sobrescribas trabajo ni cambies de rama descartando modificaciones.
- Trabaja en una rama dedicada a esta ampliación, basada en la versión más reciente que contenga el flujo restaurado.
- No mezcles con main ni despliegues producción.
- No añadas dependencias si puedes resolverlo con lo existente.

Audita la cobertura actual:
- Lengua Española de 1.º tiene seis módulos reportados: noticia, guía turística, informe de lectura, afiche, cuento policíaco y detectivesco, y caligrama.
- En 2.º se implementó al menos La noticia según informes anteriores.
- No asumas que 1.º o 2.º están completos: contrasta código, catálogo, currículo y pruebas.
- Conserva los módulos válidos y completa las carencias.

2. INVENTARIO CURRICULAR COMPLETO

Revisa el PDF adjunto y construye una matriz de:
- Ciclo.
- Grado.
- Área/asignatura.
- Carácter común, optativo o correspondiente a una modalidad.
- Tema o unidad.
- Subtemas.
- Procedimientos pertinentes.
- Competencias e indicadores vinculados cuando la fuente permita asociarlos.
- Página PDF y página impresa.
- Estado de extracción, implementación y verificación.

Incluye todas las áreas documentadas, no solamente Lengua Española:
Ciencias de la Naturaleza, Ciencias Sociales, Matemática, lenguas extranjeras, Educación Artística, Educación Física, Formación Integral Humana y Religiosa y las demás que identifiques en la fuente.

Los nombres anteriores son orientativos: utiliza las denominaciones oficiales y las asignaturas reales del documento.

No clasifiques Educación Artística, Educación Física o Formación Humana como optativas por suposición.

Revisa expresamente:
- Qué optativas existen.
- En qué grados se imparten.
- Si dependen del ciclo, modalidad o salida.
- Cómo se relacionan con las asignaturas comunes.
- Si la aplicación ya representa esos contextos.

La sospecha de que las optativas se concentran de 4.º a 6.º no constituye una regla: verifícala.

No habilites una asignatura o tema en un grado al que no pertenece. No dupliques como optativa una asignatura común.

3. LECTURA Y TRAZABILIDAD

- Revisa visualmente las tablas para confirmar límites entre temas y columnas.
- No mezcles procedimientos o actitudes de unidades contiguas.
- Conserva el contenido extraído y su referencia.
- Separa las citas o contenidos oficiales de las adaptaciones evaluativas de Aula Base.
- No declares validación curricular si no se ha realizado.
- No conviertas todos los contenidos de una unidad en requisitos obligatorios de cada actividad.
- No inventes temas, competencias, indicadores, fuentes ni datos.

Si el documento remite a otros materiales necesarios:
- Busca primero fuentes oficiales del MINERD.
- Registra el documento y su enlace.
- Utiliza fuentes complementarias verificables solo cuando sean necesarias, distinguiéndolas del currículo oficial.
- Si no puedes obtener una fuente, registra el vacío y continúa con módulos independientes.
- No marques como completa una cobertura cuya fuente falta.

4. ARQUITECTURA REUTILIZABLE SIN IA

Amplía el motor existente combinando:
A. Contenido específico del tema, grado y asignatura.
B. Dimensiones evaluativas del tipo de actividad.
C. Estructura del instrumento.

Evita:
- Un archivo de reglas gigantesco con condiciones repetidas.
- Copiar módulos enteros por grado.
- Crear todas las combinaciones como plantillas independientes.
- Detectar únicamente por palabras sueltas.
- Sustituir contenido específico por frases genéricas con el nombre del tema insertado.

Organiza datos y reglas de forma mantenible, compatible con el versionado y almacenamiento existentes.

Distingue:
- Tipo de actividad o producto.
- Tema curricular.
- Técnica para recoger evidencias.
- Instrumento para registrarlas y valorarlas.

5. CATÁLOGO DE ACTIVIDADES

Audita y amplía las familias necesarias para los contenidos del currículo:
producción escrita, informe, análisis, comparación, exposición, debate, entrevista simulada, dramatización, resolución de problemas, experimento, práctica de laboratorio, proyecto, investigación, modelización, creación artística, interpretación musical, desempeño físico y otras que justifique el inventario.

Esta lista es inicial, no exhaustiva.

Puedes añadir opciones oficiales al catálogo de Aula Base cuando exista una necesidad comprobada y no haya una opción equivalente.

No implementes la función de permitir al docente crear técnicas o tipos personalizados desde los desplegables: está aplazada.

6. INTERPRETACIÓN DE LA CONSIGNA

Prioriza:
1) Selección explícita del docente.
2) Acción principal de la descripción.
3) Título como apoyo.

Usa el contexto real de nivel, grado, asignatura y modalidad curricular.

Reconoce:
- Producto principal.
- Acciones preparatorias.
- Tema y elementos solicitados.
- Requisitos concretos.
- Desempeño individual dentro de una actividad grupal.

Ejemplos:
- «Investigar para presentar una exposición» → exposición como producto principal.
- «Informe sobre un cuento» → informe, contextualizado al cuento.
- «Analizar un afiche» → análisis, sin exigir crear uno.
- «Preparar preguntas y representar entrevistador/entrevistado» → entrevista simulada, no ejercicios genéricos.

No deduzcas obligaciones por la mera presencia de un recurso ni inventes cantidades, duración o requisitos.

Si hay ambigüedad, utiliza una recomendación prudente y editable. Conserva las elecciones manuales.

7. TÉCNICA E INSTRUMENTO SUGERIDOS

Selecciona valores reales del catálogo para:
- Tipo de actividad.
- Técnica.
- Instrumento.

Deben verse seleccionados y conservarse en borrador, resumen, guardado y reapertura.

Distingue una entrevista realizada por estudiantes de la técnica de entrevista utilizada por la docente para evaluar.

Investiga el predominio de rúbrica:
- Identifica si procede de reglas pertinentes o de un fallback.
- Recomienda según la evidencia y el propósito.
- Cotejo para cumplimiento verificable.
- Escala para grados de desempeño.
- Rúbrica para calidad en varias dimensiones.
- Lista ponderada cuando la distribución por indicadores sea adecuada.

No alternes formatos arbitrariamente para aparentar variedad.

La detección debe ser interna, sin anuncios de búsqueda o preparación.

8. CONTENIDO DE LOS INSTRUMENTOS

Cada instrumento debe combinar:
- Comprensión o aplicación del contenido.
- Calidad del producto o desempeño.
- Requisitos expresos de la consigna.

Los criterios pertinentes deben mencionar el tema y sus elementos concretos.

Adapta a cada área:
- Matemática: razonamiento, procedimiento, representación, resultado e interpretación.
- Ciencias: explicación, evidencia, procedimientos, datos y conclusiones.
- Sociales: fuentes, contextualización, relaciones, argumentos e interpretación.
- Lenguas: comprensión, producción, organización, adecuación y recursos lingüísticos pertinentes.
- Artística: proceso, decisiones expresivas y ejecución acorde a la actividad.
- Física: ejecución, aplicación de reglas y desempeños observables apropiados.
- Formación Humana: análisis, reflexión, argumentación y acciones observables.

No califiques creencias privadas, personalidad o valor moral del estudiante.
No utilices estereotipos ni exijas capacidades ajenas al objetivo de la actividad.

Los descriptores deben mostrar diferencias observables entre niveles, no repetir el mismo texto cambiando «mucho», «poco» o «bien».

9. CUATRO FORMATOS

Conserva y amplía:
- Rúbrica: criterios y descriptores por nivel.
- Lista de cotejo: indicadores verificables.
- Escala estimativa: indicadores y grados definidos.
- Lista ponderada: indicadores, pesos y puntos.

Cambiar el selector debe preparar el nuevo formato completo y pertinente.
Protege las ediciones manuales antes de reemplazarlas.

Respeta los límites compartidos existentes de criterios y niveles. Si detectas que impiden cubrir una necesidad real, documenta el caso antes de cambiar el contrato.

10. CONSERVAR EL FLUJO RESTAURADO

No rediseñar el creador:
- Una pantalla vertical con bloques, actividad, modalidad, evaluación y recursos.
- Instrumento completo debajo.
- Progreso a la derecha en escritorio y adaptación a móvil.
- Guardar abre resumen.
- Confirmar y guardar persiste.
- Retorno al contexto de origen.

No reintroducir:
- Pantallas separadas de actividad e instrumento.
- Fecha o momento como campos del creador.
- Roles, evidencia esperada y observaciones como campos adicionales.
- Textos de procedencia ni avisos técnicos permanentes.
- Cambios del editor de descripción.

Conserva:
- Puntaje inicialmente pendiente.
- Recálculo al escribir un valor válido.
- Ediciones y pesos relativos.
- Total exacto, incluidos decimales.
- Adición de criterios pertinentes sin duplicados.
- Regeneración explícita funcional.
- Alternativa contextual editable ante fallos.
- Permisos, atomicidad, idempotencia, borradores aislados e historial.
- Reglas de edición cuando existen calificaciones.
- Integración legítima con Planificación.

11. ORDEN DE EJECUCIÓN

Después de crear el inventario:
A. Confirmar y completar Lengua Española de 1.º y 2.º.
B. Lengua Española de 3.º, 4.º, 5.º y 6.º.
C. Ciencias de la Naturaleza de 1.º a 6.º, respetando sus contenidos y denominaciones por grado.
D. Continuar con las demás asignaturas del inventario.
E. Cubrir optativas en los grados y modalidades verificados.

Ejecuta por asignatura, grado y tema.
No necesitas aprobación rutinaria entre módulos dentro de este alcance.

Si un módulo queda bloqueado:
- Registra la causa.
- Conserva su estado pendiente.
- Continúa con trabajo independiente.
- No inventes una solución para marcarlo completo.

12. PRUEBAS POR MÓDULO

Para cada tema:
- Probar varias acciones pertinentes con títulos explícitos y títulos neutrales.
- Incluir al menos una descripción breve.
- Verificar que la acción principal no se confunda con preparación o recursos.
- Comprobar los cuatro formatos.
- Comprobar puntaje pendiente y totales exactos.
- Proteger selección manual.
- Incluir casos negativos para evitar activar otros temas o grados.
- Comprobar pertinencia del contenido, no solamente que el instrumento contenga filas.

Realiza revisiones pedagógicas de ejemplos representativos, además de pruebas automáticas.
Comprueba periódicamente integración y regresiones.

No marques «verificado en aplicación» un caso comprobado solamente por una prueba de unidad.

13. BASE DE DATOS Y CATÁLOGO

- Versiona el catálogo sin sobrescribir versiones anteriores.
- Comprueba instalación idempotente.
- No crees una versión por cada pequeña edición si puedes consolidar un módulo coherente antes de publicarla.
- No modifiques migraciones antiguas.
- Aplica migraciones necesarias únicamente en un entorno local confirmado mediante el procedimiento del proyecto.
- Sin resets destructivos ni cambios en producción.
- Conserva instrumentos y actividades históricas.

14. AVANCE DURABLE Y RECUPERACIÓN

Mantén en el repositorio:
- Inventario completo.
- Matriz de cobertura.
- Fuentes y páginas.
- Decisiones de arquitectura.
- Informes por asignatura/grado.
- Pendientes y bloqueos.
- Instrucción concreta para retomar.

Después de cada bloque coherente y verificado:
- Crea un commit con los cambios propios de ese bloque.
- Actualiza el registro de avance con el hash.
- Haz push a la rama dedicada.
- No incluyas secretos ni archivos temporales.

Si la sesión se interrumpe, la siguiente debe poder continuar leyendo estos registros.
No dependas únicamente de la memoria del chat.

15. CONDICIÓN DE FINALIZACIÓN

No declarar completa secundaria hasta que:
- Todas las asignaturas y optativas documentadas estén inventariadas.
- Cada grado y modalidad tengan su cobertura correspondiente.
- Los temas tengan contenido contextual implementado.
- Los cuatro instrumentos funcionen.
- No existan omisiones sin registrar.
- Las comprobaciones requeridas pasen.

Puede haber un estado «implementado, pendiente de verificación manual», pero no lo presentes como verificación integral.

16. INFORMES OBLIGATORIOS

Al terminar cada asignatura/grado, informa:
- Temas cubiertos y pendientes.
- Fuentes y páginas.
- Actividades reconocidas.
- Ejemplos concretos de criterios y descriptores.
- Archivos modificados.
- Pruebas y resultados.
- Verificación manual y sus límites.
- Versión del catálogo.
- Commit y push.
- Próximo bloque.

Al final entrega:
- Matriz completa de cobertura por asignatura, grado y modalidad.
- Relación de optativas y su ubicación curricular.
- Cobertura implementada frente a cobertura verificada.
- Vacíos, fuentes pendientes y limitaciones.
- Resumen de cambios de arquitectura.
- Estado de Git y base local.
- Procedimiento para probar la aplicación.

Comienza revisando el estado real e inventariando el currículo. Después continúa con la implementación progresiva sin detenerte tras entregar solamente un plan.