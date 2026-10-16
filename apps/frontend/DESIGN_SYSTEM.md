# Sistema visual de AulaBase

Este documento define la identidad visual de la aplicación. Toda pantalla nueva o modificada debe seguir estas reglas.

La pantalla de **Inicio** es la referencia visual original y la fuente de verdad para las adaptaciones graduales de los módulos. Sus proporciones, tipografía, tarjetas y controles deben guiar los cambios; los rediseños ya aprobados se recuperan conservando la lógica funcional vigente.

## Paleta oficial

AulaBase usa los valores de la referencia de Inicio, definidos en `src/semantic-palette.css`:

- Azul `hsl(207 85% 55%)`: identidad, navegación, selección, información y acción principal.
- Verde `#10b981`: éxito, completado y asistencia.
- Coral `hsl(4 80% 60%)`: error, incidencia y acción destructiva.
- Amarillo `#fbbf24`: pendiente y actividades.
- No se permiten familias de identidad adicionales: usar exclusivamente azul, verde, coral, amarillo, gris, blanco y texto oscuro.
- Gris `hsl(214 32% 91%)`: estructura, controles secundarios, vacío e inactividad.
- Blanco `#FFFFFF`: tarjetas, menús, modales y superficies principales.
- Texto `hsl(220 30% 18%)`: títulos y contenido principal.

La fuente de la interfaz es **Poppins**. El fondo general es `hsl(213 45% 96%)`.

La tipografía usa pesos 400 para texto normal, 500 para navegación y controles secundarios, y 600 para títulos, cifras, botones principales y etiquetas. No se usan pesos superiores a 600. Los títulos principales llevan `tracking-tight`; las etiquetas cortas en mayúsculas usan 10 px, peso 600 y espaciado entre letras de `0.14em` a `0.18em`.

Los tonos suaves deben derivarse mediante tokens CSS o `color-mix`; no se deben introducir nuevas familias cromáticas.

## Semántica obligatoria

El color comunica significado, no decoración.

| Intención             | Tone      | Uso                                             |
| --------------------- | --------- | ----------------------------------------------- |
| Información / acción  | `info`    | navegación, selección, CTA, edición             |
| Correcto / completado | `success` | aprobado, presente, finalizado, sincronizado    |
| Atención / pendiente  | `warning` | próximo, pendiente, preparación, recordatorio   |
| Error / incidencia    | `danger`  | error, ausencia crítica, conflicto, eliminación |
| Secundario / vacío    | `neutral` | archivado, deshabilitado, sin datos, estructura |

## Componentes base

Preferir siempre los componentes de `src/components/ui/SemanticUI.tsx`:

- `PageHero`: cabecera principal de módulo.
- `SemanticIcon`: icono dentro de superficie semántica.
- `StatusBadge`: estado corto con color semántico.
- `MetricTile`: indicador numérico.
- `FilterBar`: barra de búsqueda/filtros.
- `SectionHeader`: encabezado secundario.
- `ProgressIndicator`: progreso.
- `FeedbackBanner`: éxito, aviso o error.

También usar `Button`, `Card`, `EmptyState`, `Input`, `Select`, `Textarea`, `Modal` y `ConfirmDialog` antes de crear variantes locales.

## Regla de superficies

- Fondo general: `var(--background)`.
- Tarjetas: blancas (`var(--card)`).
- Bordes: solo cuando ayudan a entender interacción o estructura.
- No pintar superficies grandes con colores de estado.
- Usar color en iconos, badges, barras, puntos, chips y superficies suaves pequeñas.
- Radio estándar de tarjetas principales: `1.5rem` / `rounded-3xl`.
- Controles: `rounded-xl`.
- Sombras: suaves; usar `dashboard-warm-shadow` o las sombras de componentes compartidos.

## Espaciado exterior de los paneles

Todos los paneles autenticados usan el espaciado de Cursos, definido en `AppLayout`: margen horizontal de 16 px en móvil, 24 px desde `sm` y 32 px desde `lg`; separación superior e inferior de 20 px, o 32 px desde `lg`.

La separación vertical pertenece exclusivamente a `.app-main` y al token `--app-page-block-gap` de `module-semantic-layout.css`. La raíz de un módulo no debe añadir `mt-*`, `pt-*`, `py-*` ni otro margen o relleno superior: su primer bloque visible comienza en el límite de contenido del layout. El relleno interno de las tarjetas y la separación entre bloques sí pertenecen al módulo.

Al cambiar de pantalla (`pathname`), `AppLayout` devuelve el desplazamiento al inicio antes de pintar la nueva vista. Cambiar filtros dentro de la misma pantalla conserva la posición; el desplazamiento anterior no debe alterar el margen inicial de otro módulo.

El contenido ocupa todo el ancho disponible. No añadir límites de ancho ni centrado automático al contenedor principal de un módulo: desplazan sus bordes respecto a los demás paneles. Los formularios, modales y bloques internos sí pueden limitar su ancho cuando lo necesiten.

## Encabezados

Los títulos principales son oscuros. Nunca usar el azul, coral o verde como color principal del título de una página.

La identidad del módulo se comunica mediante el icono semántico:

- Inicio: combinación completa de la paleta.
- Cursos: `info`.
- Horario: `info`; descanso y próxima clase usan `warning`.
- Asistencia: `success`.
- Evaluación: `info`; recuperación/pendientes usan `warning`.
- Actividades: `warning` como preparación y `info` como evaluación.
- Planificación: `warning`.
- Bitácora: tipos semánticos según contenido.
- Reportes: `info` con estados `success/warning/danger`.
- Administración: `info`; períodos `warning`.
- Perfil: `info`; seguridad `warning`.

## Estados académicos

### Asistencia

- Presente: `success`.
- Ausente: `danger`.
- Excusa: `warning`.
- Retirado: `neutral`.
- Sin registro: `neutral` suave.

### Evaluación

- C1: familia azul oficial.
- C2: familia verde oficial.
- C3: familia amarilla oficial.
- C4: familia coral oficial.
- Completada/aprobada: `success`.
- En evaluación: `info`.
- Pendiente/recuperación: `warning`.
- Conflicto/error: `danger`.

Los bloques C1-C4 son identidad académica dentro de Evaluación; los estados de una actividad o estudiante siguen usando la semántica de estado correspondiente.

### Actividades

- Pendiente: `warning`.
- En evaluación: `info`.
- Calificada: `success`.

### Planificación

- En preparación: `warning`.
- Lista/completada: `success`.
- Editando: `info`.
- Archivada: `neutral`.
- Incompleta/error: `danger`.

## Colores de identidad local

### Asignaturas

Una asignatura puede recibir una variante estable derivada de la paleta oficial para facilitar identificación visual. La misma materia debe conservar el mismo color en Horario y en contextos donde identificar materias rápidamente aporte valor.

El color de una asignatura es identidad, no estado. No reutilizarlo para indicar error, éxito o pendiente.

### Equipos

El color elegido para un equipo es metadato de identidad del equipo, no un nuevo color semántico de AulaBase.

Puede aparecer únicamente en detalles pequeños como:

- icono del equipo;
- avatar o iniciales;
- punto/acento identificador;
- indicador fino de identidad.

No debe controlar:

- estados `activo`, `archivado`, `completado` o `pendiente`;
- botones principales;
- alertas o errores;
- fondos grandes de tarjetas/páginas;
- navegación.

Esas funciones siempre usan los tokens semánticos oficiales.

## Prohibido

No introducir colores Tailwind directos fuera de la paleta de referencia en módulos de negocio. No usar acentos violeta, turquesa, naranja, rosa ni pizarra, tampoco mediante tokens de identidad:

```text
bg-violet-50
text-violet-700
bg-cyan-50
text-cyan-700
bg-emerald-50
text-emerald-700
bg-amber-50
text-red-600
```

Tampoco introducir hex/RGB nuevos para estados del sistema.

Usar en su lugar tokens y tonos semánticos:

```text
bg-primary/12
bg-success/16
bg-warning/25
bg-destructive/14
text-foreground
text-muted-foreground
```

O, preferiblemente, `SemanticUI`.

## Acciones

- Una sola acción principal azul por zona visual.
- Acciones secundarias: `outline`, `secondary` o `ghost`.
- Destructiva: coral mediante `destructive`.
- Éxito explícito: `success` cuando la acción confirme un resultado positivo.
- Atención explícita: `warning` solo cuando la acción requiera cuidado.
- Acciones poco frecuentes deben ir en un menú `Acciones` o `…`.

Por indicación de diseño, los botones de cancelación usan rojo oficial mediante `data-ui-action="cancel"`. Los botones con X usan `data-ui-action="close"`: son rojos fuera de un diálogo y, dentro de un modal, pasan de neutro a rojo al hacer hover o recibir foco de teclado. Estas reglas compartidas viven en `module-semantic-layout.css` y se aplican tanto a `Button` como a botones nativos.

Los botones de todos los modales tienen forma de píldora. Las acciones usan altura mínima de 36 px, texto de 13 px y relleno horizontal de 14 px; en dispositivos táctiles conservan un mínimo de 44 px. Las pestañas, opciones de selección y controles de icono mantienen sus dimensiones propias. `Button` expone `data-ui-size` para identificar los controles de icono.

## Formularios y modales

- Usar `Input`, `Select` y `Textarea`; no crear tamaños/focos locales salvo necesidad real.
- Los controles estándar comparten altura, radio y foco azul.
- `Modal` debe encargarse de cabecera, icono semántico y cierre.
- `ConfirmDialog` debe usarse para confirmaciones y acciones destructivas.
- Pulsar fuera cierra el diálogo superior mediante `useOutsideClick`; `Modal` y `Drawer` ya lo incorporan. Los modales personalizados deben usar el mismo hook sobre su contenedor con `role="dialog"`. El clic se consume para no activar controles del fondo. Las operaciones pendientes y las animaciones de salida conservan su bloqueo de cierre.
- No crear gradientes de marca en botones de formularios.
- El contexto del módulo puede usar un tono semántico; la acción principal sigue siendo azul salvo que el significado exija otra cosa.

## Tablas

- Fondo blanco.
- Cabecera discreta y texto secundario.
- Separadores suaves.
- Hover muy ligero.
- Evitar colorear filas completas salvo error crítico.
- Usar el color en el estado o celda relevante.

## Filtros

- Preferir `FilterBar`.
- Búsqueda y filtros deben vivir en una sola superficie.
- No crear una tarjeta independiente por filtro.
- Mostrar filtros frecuentes; mover acciones secundarias a desplegables cuando haya sobrecarga.

## Estados vacíos

Usar `EmptyState`. Debe explicar qué falta y, cuando tenga sentido, ofrecer una única acción clara.

## Compatibilidad heredada

No existe un puente global de colores heredados. Nunca crear uno nuevo.

- Cursos mantiene temporalmente `modules/courses/courses-semantic-compat.css`, limitado exclusivamente a `main[data-module='cursos']`, porque `CoursesPage` y `CourseTeamsPanel` todavía contienen algunos nombres históricos. Su alcance debe reducirse al descomponer esos archivos.
- Planificación ya está migrada directamente a tokens semánticos y no tiene una hoja de compatibilidad heredada.
- Auth usa `modules/auth/auth-design.css` para los estilos compartidos de acceso.
- Evaluación mantiene `modules/grading/grading-design.css` dentro de `grading-workspace` mientras `GradingBook` se descompone en componentes más pequeños.
- `module-semantic-layout.css` solo puede contener utilidades o reglas realmente transversales; no debe alojar una identidad de módulo.
- Todo componente nuevo debe usar directamente tokens o componentes semánticos.

Cuando se migre un subcomponente heredado, retirar su regla localizada de compatibilidad en el mismo cambio cuando sea seguro hacerlo. Una excepción temporal nunca debe filtrarse a otro módulo.

## Configuración

- `/configuracion` presenta las cinco pantallas completas de la referencia Polymet solicitada: Perfil, Seguridad, Notificaciones, Pagos y suscripciones y Privacidad. Centro educativo, Calendario, Usuarios y Módulos conservan sus accesos administrativos y permisos.
- Mantener el margen del layout, títulos oscuros, campos y botones de acción redondos. `settings-design.css` solo ajusta la forma de controles dentro de `settings-workspace`; no introduce una paleta de compatibilidad.
- `modules/settings-reference/` conserva las tarjetas y proporciones de Polymet sin datos de ejemplo. Perfil consume la identidad y preferencias persistidas; Pagos consulta el resumen real del titular; Seguridad consulta los factores de autenticación y el contacto real. Las funciones pendientes muestran su disponibilidad y no simulan guardados, envíos, exportaciones, cancelaciones ni borrados. No introducir saldos, dispositivos, porcentajes ni preferencias iniciales que no provengan de un servicio.
- `reference-settings.css` contiene la tipografía y las proporciones de esa referencia, limitadas a `settings-reference-workspace`. El fondo general y el layout de navegación pertenecen a AulaBase. No extender estos estilos a otros módulos.
- La gestión real de pagos permanece disponible mediante el bloque «Gestionar los pagos de mi cuenta de AulaBase». Los datos personales y las preferencias reales siguen disponibles en `/perfil`.
- Las preferencias personales también están disponibles en `/perfil`: menú lateral expandido y reducción de animaciones. Esta última se combina con la preferencia de movimiento del sistema operativo.
- Mantener los enlaces antiguos a años y períodos y ofrecer accesos directos a los ajustes existentes de cada módulo.

## Criterio final

Una pantalla de AulaBase debe sentirse tranquila y legible:

- mucho blanco;
- texto oscuro;
- azul para actuar;
- verde para progreso;
- amarillo para atención/preparación;
- coral para incidencias y pequeños acentos;
- gris para estructura.

Si el color no comunica una de esas funciones, probablemente no debe estar ahí.
