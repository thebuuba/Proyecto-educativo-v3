# Ofimática de cuarto: contraste de fuentes

Transcripción documental revisada mientras MF053 mantiene su verificación remota parcial por DNS. Ofimática todavía no tiene proveedor, instrumentos revisados ni instalación en Development. Esta lectura no acredita su cobertura.

Se revisaron visualmente dos fuentes oficiales del módulo `MF_002_3`, nivel de cualificación 3, con duración de135horas:

| Programa | Asignación | Páginas del módulo | SHA256 del PDF |
| --- | --- | --- | --- |
| [IFC006_3, Desarrollo y Administración de Aplicaciones Informáticas](https://ministeriodeeducacion.gob.do/docs/direccion-de-educacion-tecnico-profesional/lR2c-ifc006-3-bt-desarrollo-y-administracion-de-aplicaciones-informaticaspdf.pdf) | 4.º, tabla14;3horas semanales | 49–55 | `70e6f9b44322610fadb7da3dc733e49d32d1abada73267da36f7e115e39817e9` |
| [IFC007_3, Soporte de Redes y Sistemas Informáticos](https://ministeriodeeducacion.gob.do/docs/direccion-de-educacion-tecnico-profesional/VX8P-ifc007-3-bt-soporte-redes-sistemas-informaticospdf.pdf) | 4.º, tabla18;3horas semanales | 54–66 | `f8c00ee2924602c6a00eaa3311e2907bd983058a47feafca92c2c7ec13501581` |

Las20páginas del módulo se leyeron completas, con sus continuaciones. En IFC007 se excluye el módulo anterior que aparece al inicio de54. En ambas fuentes el límite final es el encabezado de Emprendimiento. El nivel3 de cualificación no se interpreta como tercero de secundaria.

Ambas presentan9resultados de aprendizaje y67ocurrencias de criterios de evaluación, con65códigos únicos. `CE3.4` y `CE3.5` se imprimen dos veces para contenidos diferentes: deberán conservarse mediante identificadores de ocurrencia, sin corregir silenciosamente la fuente.

El contraste de los67criterios encontró54textos iguales tras normalizar espacios,9diferencias de espaciado interno de la extracción PDF y4continuaciones de la columna de resultados de aprendizaje mezcladas en la extracción de criterios. Estas últimas corresponden a RA2/página50 yRA6/página53 deIFC006, yRA7/página59 yRA8/página60 deIFC007. Al separar esas continuaciones, los67textos de criterios coinciden sin considerar espacios. Se preserva la extracción original; esta comparación no afirma igualdad de bytes ni sustituye una transcripción literal trazable.

La diferencia documental relevante está en IFC007: contiene una tabla adicional de conceptos, procedimientos y actitudes en61–66 y nueve orientaciones metodológicas en66. IFC006 no incluye esa tabla dentro de Ofimática. No se omitirá contenido de IFC007 ni se extenderá la equivalencia a los demás programas por compartir el código del módulo.

Los ámbitos observados comprenden sistema operativo y periféricos; documentos, formato, tablas, correspondencia y revisión; hojas de cálculo, funciones, gráficos, filtros y tablas dinámicas; presentaciones multimedia; búsqueda, archivos, correo y transferencia. La adaptación deberá evaluar únicamente los elementos pedidos. Preparar diapositivas no exige exposición oral; simular correspondencia no exige enviarla; una propuesta de protección no exige cambiar credenciales. Se usarán documentos y datos ficticios, sin imponer software comercial, impresión, publicaciones, macros o acceso a cuentas reales.

El mínimo impreso de200p.p.m. y el máximo de una falta por minuto enCE2.1 se conservarán como condiciones de la fuente, sin introducirlos automáticamente en cualquier actividad de procesamiento de textos. Las actitudes sobre interés, valores, sensibilidad o capacidad personal no serán criterios de personalidad. Las orientaciones al docente tampoco se convertirán automáticamente en productos del estudiante.

La [matriz literal](../../curriculum/cobertura-secundaria/technical-mf002-4-matriz.json) contiene 210 registros y 302 partes: 9 RA, 67 CE, 5 bandas conceptuales, 98 unidades procedimentales, 22 actitudes y 9 orientaciones docentes. RA/CE conservan procedencia en ambos documentos; la tabla adicional y las orientaciones pertenecen a IFC007. Las bandas conservan sus subencabezados: el número de unidades transcritas no representa temas o criterios obligatorios. La [revisión de fuente](../../curriculum/cobertura-secundaria/technical-mf002-4-revision-fuente.json) registra huellas de textos y partes.

La revisión corrigió espacios artificiales de la extracción —por ejemplo, «lo s» y «entre ga»— mediante la separación real entre fragmentos posicionados. No cambió letras, cifras ni signos del documento. La página 63 se volvió a inspeccionar para separar «Inserción o creación de tablas en un documento» de «Edición dentro de una tabla.»; se conservó la ausencia de punto del primer párrafo. Las erratas impresas, como «copywrigth» o «Configuración los dispositivos», permanecen literales.

Verificación: cuatro pruebas fallaron inicialmente por ausencia de matriz; pasaron tras transcribir. Una quinta reprodujo los espacios artificiales y comprobó su corrección sin alterar erratas o continuaciones. Resultado final: **5 pruebas aprobadas**. Un intento del auxiliar local falló por la codificación de texto enviado por PowerShell antes de escribir la matriz; se ejecutó después desde un archivo UTF-8 y se conservaron los originales. No fue un fallo de la aplicación.

Las suites y los cuatro builds finales del catálogo 142 siguen aprobados, sin cambios de aplicación en este bloque documental; no se repitieron sin motivo. El commit de MF053 es `08477b7c`. Su Worker permanece detenido tras dos fallos DNS; se conservan cuatro actividades QA, tres recorridos completos y el borrador personal sin guardar.

Pendiente: resolver el ámbito compartido sin fuentes ambiguas; congelar y comprobar el catálogo 142; escribir contratos de contexto y pertinencia; implementar los cuatro formatos reutilizando el motor; leer los instrumentos completos; verificar backend, frontend, HTTP/DB y navegador personal. Este trabajo independiente continúa mientras se mantienen los pendientes de MF053. No hubo escrituras remotas de Ofimática, cambios de producción, despliegues ni push.
