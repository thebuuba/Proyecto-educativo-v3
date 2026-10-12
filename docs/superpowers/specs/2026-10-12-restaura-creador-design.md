Restablece el diseño acordado del creador de actividades de Aula Base mediante cambios selectivos. Conserva las mejoras técnicas del commit 6dee60a46fc1790adbfbca928f029bf469e3b769.

Usa la versión anterior ffabbed como referencia del flujo, pero NO reviertas el commit completo ni copies archivos antiguos sobre los nuevos.

1. Revisión inicial
- Lee las instrucciones del repositorio.
- Revisa rama, git status y cambios posteriores.
- Conserva el trabajo acumulado.
- Identifica las modificaciones necesarias en los nuevos componentes del creador.

2. Una sola pantalla vertical
Elimina la navegación que separa:
«Actividad → Instrumento → Revisar y guardar».

Presenta en una misma pantalla, en este orden:
1) Tarjeta de bloques de competencias.
2) Tarjeta de actividad: título, descripción y tipo de actividad.
3) Tarjeta de modalidad: individual o grupal.
4) Tarjeta de evaluación: técnica, tipo de instrumento y valor en puntos.
5) Tarjeta de recursos.
6) Instrumento completo y editable debajo.

- No ocultar el instrumento detrás de otro paso.
- Eliminar botones «Anterior» y «Continuar al instrumento».
- Al final, mostrar «Guardar», que abre el resumen.
- Adaptar la navegación hacia campos pendientes para que desplace y resalte el campo dentro de esta misma pantalla.
- Respetar tres bloques en primaria y cuatro en secundaria.
- Conservar por defecto el bloque seleccionado antes de entrar al creador.

3. Retirar campos adicionales
Quita del creador:
- Fecha.
- Momento de planificación.
- Rol del estudiante.
- Rol del docente.
- Evidencia esperada.
- Observaciones.

No sustituyas estos campos por otros ni amplíes el formulario.

Conserva:
- Fecha automática de creación.
- Datos históricos y campos de almacenamiento que otros módulos necesiten.
- Vínculo con Planificación y retorno al contexto de origen.

Comprueba que ocultar estos campos no borre sus valores al editar registros antiguos. No eliminar vínculos históricos ni el contexto legítimo de una actividad creada desde Planificación. No generar eventos de agenda automáticamente a partir de una fecha ficticia.

4. Simplificar mensajes
- Retira el texto visible «Procedencia: …».
- Mantén procedencia, referencias y trazabilidad internamente.
- Elimina avisos explicativos sobre catálogo, currículo, preparación local o detección automática.
- Cuando falle el servicio y se cargue una alternativa válida, utiliza una comunicación breve y puntual mediante el mecanismo habitual de la aplicación, sin un bloque técnico permanente.
- Si la preparación o el guardado no pueden completarse, muestra un error útil y permite reintentar sin perder el contenido.
- No ocultes errores reales ni presentes una alternativa como validación curricular.

5. Mantener el resumen
Conserva la ventana de resumen compacto:
- Título visible.
- Bloques, modalidad, técnica, instrumento y puntaje.
- Vista de descripción mediante botón.
- Vista ampliada del instrumento.
- Recursos visibles si son pocos y vista adicional si son muchos.
- «Volver a editar», conservando todo.
- «Confirmar y guardar».

El guardado definitivo ocurre al confirmar. Si falla, conservar resumen, formulario e identificador de creación para reintentar sin duplicados.

6. Mantener el progreso y el diseño
- Tarjeta de progreso a la derecha en escritorio, sticky.
- Progreso y mensajes de autoguardado basados en el estado real.
- Diseño adaptable a móvil, sin desbordamientos.
- Conservar colores, componentes y tokens del sistema visual.
- No rediseñar el editor de descripción.

7. Conservar las mejoras funcionales y técnicas
No eliminar:
- Creador independiente de GradingBook.
- Permisos por colegio, rol y asignación.
- Guardado atómico de actividad, instrumento y equipos.
- Reintentos sin duplicados.
- Borradores aislados por cuenta y contexto.
- Copia de instrumentos reutilizados.
- Versiones históricas e inmutables.
- Definición compartida de instrumentos.
- Validaciones, cálculo exacto y funcionamiento de «No aplica».
- Protección de cambios manuales y respuestas obsoletas.
- Entradas desde Actividades, Cursos y Planificación, y retorno al origen.
- Restricciones de edición estructural cuando existen calificaciones.

8. Conservar la preparación automática y el puntaje
- Técnica, tipo de actividad e instrumento sugeridos mediante título y descripción.
- Respetar selecciones manuales.
- Instrumento preparado sin puntaje cuando el docente todavía no lo ha indicado.
- Sin 20 ni 0 visibles como valor predeterminado.
- Puntaje actualizado al escribir un valor válido, sin hacer clic fuera.
- Recalcular puntuación sin regenerar criterios ni descriptores.
- Mantener ediciones y pesos relativos.
- Conservar cambio real entre los cuatro instrumentos, adición de criterios y regeneración explícita.

9. Alcance
Esta tarea restaura el flujo y simplifica el formulario.
- No ampliar contenidos curriculares.
- No implementar opciones personalizadas en los desplegables.
- No incorporar IA ni dependencias innecesarias.
- No restablecer la base de datos.
- No eliminar la migración de historial por estos cambios visuales.
- No desplegar producción.

10. Verificación
Comprueba:
- Las cinco tarjetas y el instrumento aparecen en una sola pantalla.
- No quedan pestañas, validaciones o instrucciones que dependan de los pasos eliminados.
- Los campos retirados no aparecen ni se vuelven requisitos ocultos.
- Editar una actividad antigua no borra datos históricos.
- Puntaje pendiente y actualización inmediata funcionan.
- Cambio de instrumento, adición de criterios y protección de ediciones funcionan.
- Resumen, cancelación, confirmación y reintento conservan datos.
- Progreso y navegación a pendientes funcionan.
- Entrada desde Planificación y retorno al origen se conservan.
- Flujo en escritorio y móvil.
- Regresiones de Lengua Española de 1.º y 2.º.

Ejecuta las pruebas pertinentes y las comprobaciones requeridas por el repositorio. Distingue pruebas automáticas, QA con datos ficticios y recorrido autenticado con persistencia real.

11. Informe obligatorio
Entrega:
- Qué elementos retiraste.
- Qué elementos restableciste.
- Qué mejoras conservaste.
- Archivos modificados.
- Pruebas y resultados.
- Evidencia visual del formulario y resumen en escritorio y móvil.
- Limitaciones pendientes.
- Rama, commit, push y estado del árbol de trabajo.

No declares que todo está verificado si no comprobaste el recorrido correspondiente.