# Matrícula integrada en Cursos

La aplicación todavía publicaba `/estudiantes` como un módulo global, aunque Cursos ya dispone de su propio `CourseStudentsPanel`. Ese acceso antiguo se mostraba tanto en la barra lateral como en las opciones de accesos rápidos de Inicio.

## Cambios

- Retirado Estudiantes de la navegación global y de los accesos rápidos configurables.
- La dirección antigua `/estudiantes` redirige a `/cursos`; ya no carga la página de matrícula anterior. Los marcadores antiguos llevan al listado de cursos.
- Los enlaces de Inicio sobre estudiantes llevan a Cursos.
- Matricular estudiante e Importar listado, desde una asignatura sin matrícula, abren el panel del curso usando el identificador de la sección. Antes enviaban el identificador de la asignatura a la matrícula antigua.
- Cursos consume la acción solicitada, abre el formulario individual o la importación y limpia los parámetros temporales. Volver al curso conserva el contexto y actualiza los datos.
- Se conservan los servicios, estudiantes, matrículas y vistas de estudiantes dentro de Cursos y asignaturas. No hay cambios de base de datos.

## Verificación

- 19 pruebas de frontend aprobadas: rutas, Inicio, estudiantes de asignatura, navegación al panel de matrícula y operaciones existentes del panel.
- 256 pruebas de backend aprobadas.
- Compilación de backend y frontend y simulación de despliegue Cloudflare aprobadas.
- `git diff --check` sin errores.

Las pruebas usan datos controlados; no se realizó un recorrido autenticado con los datos reales del docente. No se desplegó producción.
