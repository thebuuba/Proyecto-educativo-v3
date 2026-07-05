# Dominio

Aula Base organiza la operación académica de un centro educativo. La arquitectura debe nombrar estos conceptos antes que frameworks, tablas o pantallas.

## Conceptos principales

- **Escuela:** tenant del sistema. Todo dato operativo pertenece a una escuela.
- **Año escolar:** ciclo académico activo de una escuela.
- **Curso:** oferta concreta de grado, sección, asignatura, docente y año escolar. En base de datos sigue mapeado como `SectionSubject`.
- **Matrícula:** vínculo de un estudiante con un grado, sección y año escolar.
- **Asistencia:** registro diario o por clase de la participación de estudiantes.
- **Evaluación:** registro, edición y consulta de calificaciones por período académico.
- **Planificación:** preparación docente de clases, competencias, actividades y recursos.
- **Reporte académico:** salida consolidada de calificaciones, asistencia o desempeño.
- **Administración escolar:** perfil institucional, años escolares y períodos académicos.

## Módulos

| Dominio | Backend | Frontend | Ruta API principal |
| --- | --- | --- | --- |
| Cursos | `modules/courses` | `modules/courses` | `/courses` |
| Evaluación | `modules/grading` | `modules/grading` | `/grading` |
| Administración escolar | `modules/school-administration` | `modules/school-administration` | `/school-administration` |
| Matrícula | `modules/students` | `modules/students` | `/students` |
| Asistencia | `modules/attendance` | `modules/attendance` | `/attendance` |
| Horario | `modules/schedule` | `modules/schedule` | `/schedule` |
| Planificación | `modules/planning` | `modules/planning` | `/planning` |
| Reportes | `modules/reports` | `modules/reports` | `/reports` |

## Regla de nombres

Los nombres públicos del código usan lenguaje de dominio. Los nombres técnicos de persistencia, como `sectionSubjectId`, quedan en DTOs, Prisma y migraciones hasta que una migración explícita los cambie.
