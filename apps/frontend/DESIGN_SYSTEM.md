# Sistema visual de AulaBase

Este documento define la identidad visual de la aplicación. Toda pantalla nueva o modificada debe seguir estas reglas.

## Paleta oficial

AulaBase usa únicamente estas familias de color dentro de la interfaz del producto:

- Azul `#3CB7E2`: identidad, navegación, selección, información y acción principal.
- Verde `#66D64F`: éxito, completado, aprobado, presente y progreso positivo.
- Coral `#F6886F`: error, incidencia, acción destructiva y acento humano puntual.
- Amarillo `#F9C46B`: pendiente, próximo, preparación, recordatorio y atención.
- Gris `#E3E3E3`: estructura, controles secundarios, vacío e inactividad.
- Blanco `#FFFFFF`: tarjetas, menús, modales y superficies principales.
- Texto `#2F3542`: títulos y contenido principal.

Los tonos suaves deben derivarse mediante tokens CSS o `color-mix`; no se deben introducir nuevas familias cromáticas.

## Semántica obligatoria

El color comunica significado, no decoración.

| Intención | Tone | Uso |
| --- | --- | --- |
| Información / acción | `info` | navegación, selección, CTA, edición |
| Correcto / completado | `success` | aprobado, presente, finalizado, sincronizado |
| Atención / pendiente | `warning` | próximo, pendiente, preparación, recordatorio |
| Error / incidencia | `danger` | error, ausencia crítica, conflicto, eliminación |
| Secundario / vacío | `neutral` | archivado, deshabilitado, sin datos, estructura |

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

También usar `Button`, `Card`, `EmptyState`, `Input`, `Select` y `Modal` antes de crear variantes locales.

## Regla de superficies

- Fondo general: `var(--background)`.
- Tarjetas: blancas (`var(--card)`).
- Bordes: solo cuando ayudan a entender interacción o estructura.
- No pintar superficies grandes con colores de estado.
- Usar color en iconos, badges, barras, puntos, chips y superficies suaves pequeñas.
- Radio estándar de tarjetas principales: `1.5rem` / `rounded-3xl`.
- Controles: `rounded-xl`.
- Sombras: suaves; usar `dashboard-warm-shadow` o las sombras de componentes compartidos.

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

- Completada/aprobada: `success`.
- En evaluación: `info`.
- Pendiente/recuperación: `warning`.
- Conflicto/error: `danger`.

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

## Colores de asignaturas en Horario

Una asignatura puede recibir una variante derivada de las cuatro familias oficiales para facilitar identificación visual. La misma asignatura debe conservar siempre el mismo color durante toda la semana.

El color de una asignatura es identidad, no estado. No reutilizarlo para indicar error, éxito o pendiente.

## Prohibido

No introducir colores Tailwind directos de identidad en módulos de negocio:

```tsx
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

```tsx
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

`semantic-legacy-bridge.css` traduce temporalmente colores antiguos a la paleta oficial. No usar ese puente como excusa para escribir código nuevo con clases de colores heredadas.

`module-semantic-layout.css` normaliza módulos grandes que todavía no han sido refactorizados completamente.

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
