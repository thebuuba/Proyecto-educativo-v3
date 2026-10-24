# Piloto acotado de composición compartida

Estado inicial comprobado: rama `ampliacion-de-instrumentos-2`, commit `bc4a4153`, árbol limpio; una instancia local en 8787. Sin subagentes, push, merge, despliegues ni ampliación curricular.

## Límites fijados antes de implementar

- A: producir una noticia escrita, Lengua Española de 1.º. No análisis, comparación de noticias ni corrección de un texto recibido.

La delimitación excluye además los contratos transversales y los procedimientos/recursos lingüísticos especializados ya reconocidos por los proveedores (por ejemplo, revisión de borrador, plan de destinatario o publicación). Una acción negada no activa el piloto. Esta frontera se verificó al detectar regresiones en la primera suite amplia; no se cambia la consigna ni la expectativa anterior para resolverlas.
- B: explicar oralmente los planetas del sistema solar, Ciencias de la Naturaleza de 1.º. No otros contenidos científicos ni exposición como alternativa todavía no elegida.
- C: Matemática de 1.º: estadística descriptiva con representaciones solicitadas, o comparación de racionales con justificación mediante recta numérica O texto con cálculos. No generalizar a otras tareas matemáticas.
- Se reconoce la acción en la descripción y el contexto académico; un título por sí solo no activa el piloto. Se respeta el tipo pedagógico explícito compatible y el instrumento manual.

Seis casos conocidos: LEN01/LEN02 y MAT03/MAT04 del banco congelado de evaluación; B-NAT1-solar-exacta/B-NAT1-solar-maxima del banco realista anterior. Esta selección resuelve que NAT01/NAT02 del banco de 24 no solicitan exposición oral. Se conservan literalmente consignas y expectativas originales de ambos bancos. Los seis casos nuevos son sintéticos, no actividades docentes observadas. Sus expectativas se fijan en `composition-pilot/bank.json` antes de ejecutar.

## Implementación y comprobación

1. Capturar las primeras salidas antiguas de los doce casos, sin sobrescribir evidencia.
2. Extraer un contrato pequeño con fragmentos de origen, alternativas, negaciones y dimensiones inherentes; reconciliar candidatos con enlaces explícitos antes de formatear.
3. Compartir el compositor puro y la construcción de los cuatro formatos entre backend y alternativa local. Mantener autorización, recuperación curricular y referencias en sus capas. Conservar una llamada interna a la ruta anterior para comparación.
4. Evaluar doce selecciones automáticas y los cuatro formatos completos de LEN02, solar-exacta y MAT04. Contrastar además expectativas externas al extractor y regresiones fuera del piloto. Sin revisión independiente.
5. Comprobar editor, cálculos 20/17.35, históricos y entorno Development. Ejecutar focalizadas, después los cuatro controles obligatorios secuencialmente sobre código estable. Una instancia; sin elevar timeouts, borrar almacenamiento ni reintentos masivos.
6. Recorrer navegador por familia si la sesión/conexión lo permiten. Separar tiempo puro del motor de red/contexto/guardado. Publicar informe y continuidad, commits locales, detenerse al terminar.

Un resultado con omisiones esenciales, invenciones o bloqueo de conservación se declara parcial o desfavorable; no se ensancha el alcance para aprobarlo.
