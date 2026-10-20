# Fuentes de las modalidades especializadas de secundaria

> Ejecución individual con la habilidad executing-plans; el usuario prohíbe subagentes y confirmaciones rutinarias. Este bloque aplica el encargo integral existente, sin modificar sus límites.

**Objetivo:** identificar las menciones, asignaturas/módulos y grados reales de Artes y Técnico Profesional con fuente oficial y revisión visual de sus tablas, conservando la separación entre inventario e implementación.

**Arquitectura:** ampliar el registro de fuentes complementarias y añadir una matriz separada de modalidades especializadas. No mezclar sus denominaciones con los72ámbitos por grado de la adecuación académica2023 ni añadir proveedores sin revisar su malla. Reutilizar PDFjs/canvas existentes para extraer localizadores y renderizar páginas; los PDF/capturas se conservan privados e identificados porSHA256.

**Base:** commitCT6 `1b358c8f818c355d1f285da76a73d847c2b905c5`, catálogo141; rama ampliacion-de-instrumentos-2. Spec: `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`, apartados3,9–11; plan maestro de17octubre.

## Límites y decisiones

- Solo secundaria. Sin IA generativa, dependencias, compras, producción, nuevas cuentas/estudiantes, migraciones remotas, reset, borrados, main, merge, despliegues o cambios de integraciones/permisos. NO PUSH por instrucción vigente403; commits locales españoles por bloques verificados.
- CT6 ya cerrado:1524instrumentos leídos,36HTTP/36I y recorrido personal verificados. No repetir sus recorders, instalación, gates o HTTP. Runtime141 sigue servido en localhost8787, Development eolgunypmtgrsyrjzcld; no recompilarlo durante una prueba autenticada activa.
- CT4/MT6 siguen parciales; preservar IDs y bloqueos anteriores, sin reiniciar sus bucles. Los recorridos personales pendientes de otros ámbitos no heredan la verificaciónCT6.
- Decisión del implementador: este primer bloque identifica fuentes y presencia, sin pretender diseñar de antemano todos los módulos técnicos. La fuente define el siguiente bloque implementable; ante ausencia o ambigüedad de versión, documentar por programa y continuar con los independientes disponibles.
- Publicación2020 en un índice no demuestra vigencia. Separar edición impresa, fecha del archivo, fecha de publicación web y normativa realmente hallada.

## Focos de revisión

- Familia profesional, título técnico, mención artística y asignatura son niveles diferentes; no contarlos como equivalentes.
- Asignaturas comunes compartidas con otras modalidades no deben duplicarse como proveedores nuevos.
- Tablas de varios grados, continuaciones y horas requieren lectura visual; la extracción textual localiza, no certifica.
- Módulos especializados deben conservar sus resultados de aprendizaje y condiciones observables; no heredar cobertura de Educación Artística común o de optativas académicas.
- Herramientas y seguridad profesional no autorizan actividades peligrosas, compras obligatorias, cuentas, intervención sobre personas o equipamiento real en QA.

## Task1: fuentes y tablas de Artes

- [x] Descargar una vez los cuatroPDF oficiales ya localizados en fuentes-complementarias.json; verificar cabeceraPDF y conservarSHA256/URL/tamaño. Sin declarar tablas revisadas.
- [x] Extraer índices/localizadores, verificar número de páginas y localizar portadas, versión, distribución horaria, menciones y presencia por grado.
- [x] Renderizar y leer visualmente las cuatro portadas y las trece tablas de asignación/continuación pertinentes. Registrar páginas PDF e impresas; conservar ambigüedades. La relación con la adecuación académica2024 sigue bloqueada por acceso a su fuente oficial.
- [x] Crear `docs/curriculum/cobertura-secundaria/modalidades-especializadas-inventario.json` con ámbito, fuente, tabla, grado, estadoINVENTORIED_NOT_IMPLEMENTED o bloqueo específico. No inventar asignaturas ausentes.

## Task2: programas Técnico Profesional

- [x] Reutilizar los índices oficiales ya localizados; recuperar17familias y75documentos de programas. Separar programas de asignaturas/módulos.
- [ ] Comprobar fuente, nivel, edición y presencia por grado; revisar visualmente las tablas. Documentar bloqueos por programa con evidencia y tareas independientes siguientes.
- [ ] Completar la matriz especializada sin atribuir cobertura académica a módulos laborales.

## Task3: verificación e integración documental

- [x] Validar IDs únicos, vínculos a fuentes/hash/páginas y ausencia de estados de implementación sin proveedor/instrumentos/pruebas, mediante comprobador Node con aserciones.
- [x] Actualizar fuentes-complementarias.json, informe y continuación con evidencia observada. Incluir el hashCT6 exacto y pendientes integrales reales.
- [x] Revisar UTF8/diff/secretos; conservar mediante commit LOCAL español «Documenta las fuentes y asignaciones de modalidades especializadas». Los builds de aplicación141 ya aprobados no se repiten por cambios documentales puros.

## Task4: siguiente implementación según fuente

- [ ] Tras identificar el primer conjunto de asignatura/grado con fuente suficiente, escribir su plan concreto de contratosRED, proveedor compartido, lectura completa, cuatroformatos, gates y persistencia/navegador. Ejecutarlo autónomamente bajo los mismos límites.

Este plan no acredita calidad por inventario o pruebas aprobadas: cada implementación posterior requiere instrumentos completos y pertinencia revisada. No se cierra el encargo integral al completar solo este inventario.

### Punto de continuación

Task1 terminado como revisión de tablas2019, sin afirmar vigencia. Task2 parcial: tres identificaciones/tablas IFC revisadas;72documentos pendientes, Técnico Básico sin equivalencia de grado. MF_053_3 se leyó visualmente completo en PDF15–19 (solo su sección en19):3RA/16CE; transcripción literal y proveedor aún pendientes. Task4 continúa con plan concreto de ese módulo. No repetir descargas, renders, lecturaCT6 o congelación140.
