# Integración de todas las ramas en main

Fecha: 14 de octubre de 2026.

## Alcance y conservación

El inventario inicial contiene 84 referencias locales y remotas, que representan 55 puntas distintas. Tras actualizar el remoto, se comprobó que todas sus puntas forman parte de la historia de la integración. No se eliminaron ramas, stashes ni otros worktrees.

La integración parte de `main` en `05320d24b484673d08118916b8c56d2dc204cac1` y de la rama funcional más reciente, `fix/configuracion-sin-hardcoding`, en `dd52f0184bc215f5cc46e867cb76810dd4cb5a78`. Se creó una copia completa de Git en `.git/seguridad-antes-fusion-2026-10-14.bundle`, cuya integridad fue verificada.

Antes del último commit, la historia integrada incluye 263 commits posteriores al punto inicial de `main`. Las demás ramas se incorporan a través de los ancestros de las puntas siguientes:

| Rama pendiente | Resolución |
| --- | --- |
| `fix/configuracion-sin-hardcoding` | Base funcional: configuración, calendario, sesiones, alertas e instrumentos recientes. |
| `trabajo/continuacion-20261008` | Configuración del centro, preferencias, navegación, accesibilidad, modales, matrícula y Vercel, combinados con el editor modular vigente. |
| `backup-main-cffd632` | Historia del respaldo y de `backup-rediseno-panel-inicio`; su contenido funcional ya estaba incorporado o sustituido por avances posteriores. |
| `origin/fix/instrumento-automatico` | Corrección equivalente ya aplicada; se preservó el motor y editor actuales. |
| `origin/fix/retirar-estudiantes-global` | Matrícula dentro de Cursos, contexto de sección y pruebas adaptadas a `view` y `action`. |
| `origin/instrumentos-evaluacion` | Numeración de estudiantes, validación de asistencia, perfiles por nivel, contexto de instrumentos, plantillas genéricas, IA opcional y operaciones del catálogo. |
| `trabajo/2026-09-24` | Aportes de planificación, búsqueda e identidad de asignaturas; rediseños ya reconciliados permanecen en su versión vigente. |
| `rediseno-de-inicio-y-sidebar` | Historia del rediseño ya incorporado por commits equivalentes y ajustes posteriores. |
| `origin/optimizacion-y-diseno` | Historia del contador y la actividad reciente; se conserva el ajuste de títulos largos. |

## Conflictos resueltos

- Se combinó la configuración nueva con el editor separado en componentes, conservando borradores, operaciones de guardado, instrumentos editables y contenido curricular elaborado.
- El cierre exterior de modales distingue un gesto exterior de un clic que acaba de abrir un diálogo; conserva el foco, el bloqueo durante guardado y el cierre del diálogo superior.
- Los enlaces de matrícula usan el identificador de sección. Se conservan la carga individual, la importación, el orden por número de lista y los parámetros actuales de navegación.
- Los perfiles académicos se propagan a Cursos, grupos de actividades, calificaciones y reportes. Cada libro de calificaciones mantiene su propio perfil mediante el contexto existente; cambiar a primaria actualiza sus tres bloques sin modificar otros libros.
- Los colores asignados aparecen como identidad de asignatura dentro de la paleta permitida, con avisos y estados semánticos conservados.
- Las recomendaciones reciben técnica, evidencia, recursos, prioridades, organización y momento. Cambiar ese contexto invalida respuestas atrasadas; ajustar el puntaje sigue redistribuyendo sin regenerar el contenido.
- La copia enviada al API respeta sus límites, manteniendo los datos completos del borrador. Las plantillas de debate y mapa conceptual se restringen a sus actividades correspondientes.
- El refinamiento con IA modifica únicamente redacción genérica y mantiene identidades, puntuaciones, fuentes, currículo y progresiones. Ante una respuesta inválida conserva la propuesta determinista.
- El catálogo activo es `evaluation-2026.47`. Se conserva el contenido anterior de la versión 46 y las versiones originales 1 y 2 se reconstruyen desde sus fuentes históricas, para no derivarlas de un catálogo posterior.
- Los instaladores exigen un proyecto explícito y validan conjuntamente la URL de Supabase y la conexión de base de datos. Los workflows de staging y producción transmiten el destino configurado antes de instalar el catálogo.

No se agregaron dependencias ni se modificaron migraciones anteriores. La migración de linaje de snapshots ya incluida en las ramas permanece alineada con Prisma y los tipos del frontend.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm --filter backend test` | 72 archivos y 6.481 pruebas aprobadas. |
| `pnpm --filter frontend test` | 131 archivos y 11.470 pruebas aprobadas. |
| `pnpm --filter backend build` | Aprobada. |
| `pnpm --filter frontend build` | Aprobada. |
| `pnpm cloudflare:build` | Aprobada en la copia aislada: cuatro paquetes compilados y dry-run del Worker completado. |
| Lint de backend y frontend | Sin errores; frontend conserva avisos de dependencias de hooks. |
| Prisma y formato | Esquema válido y `git diff --check` sin errores. |
| Cobertura de ramas | Todas las puntas locales y remotas incorporadas, comprobadas después de `git fetch`. |

Los registros completos se conservan localmente bajo `.git/integracion-*`. La matriz curricular conserva sus 768 consignas y todas sus comprobaciones; se limitó la ejecución a dos procesos y se asignó un tiempo propio a esas pruebas de lote.

La compilación de Cloudflare en el checkout original encontró un bloqueo de Windows al reemplazar la DLL de Prisma usada por otro proceso. La comprobación pasó sobre una copia del código con dependencias aisladas, sin detener ese proceso y sin operar una base de datos. Se compararon los 39 archivos de código y configuración del último commit con esa copia, sin diferencias de contenido. La compilación limpia también permitió corregir la anotación del tipo público del cliente Prisma compartido.

Las pruebas usan datos controlados y respuestas de IA simuladas. La preparación de migraciones y del catálogo para un despliegue corresponde a los workflows existentes; esta tarea no ejecuta SQL directamente contra producción.
