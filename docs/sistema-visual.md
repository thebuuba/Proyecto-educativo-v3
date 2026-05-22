# Sistema visual

Este documento define la identidad visual oficial de Aula Base. Si hay
diferencias con referencias visuales previas, estos tokens y reglas son la
fuente de verdad para el proyecto.

## Paleta oficial

- Primary / Tinta: `#1A1F3A`
- Accent / Apricot: `#FF8B6B`
- Background / Bone: `#FAF6F0`
- Foreground / Graphite: `#2A2D3A`
- Success: `#5A8B6F`
- Warning: `#C58A35`
- Destructive: `#C95F5F`
- Border: `#E7DDD1`
- Muted: `#F3EDE5`

## Tokens

Los tokens están definidos en `src/index.css` y expuestos a Tailwind con
`@theme`.

### Light

```txt
background: #FAF6F0
foreground: #2A2D3A
card: #FFFDF9
card-foreground: #2A2D3A
popover: #FFFDF9
popover-foreground: #2A2D3A
primary: #1A1F3A
primary-foreground: #FFFAF4
secondary: #EFE7DD
secondary-foreground: #2F3241
muted: #F3EDE5
muted-foreground: #74717A
accent: #FF8B6B
accent-foreground: #2D1720
destructive: #C95F5F
destructive-foreground: #FFF7F4
success: #5A8B6F
success-foreground: #F8FFF9
warning: #C58A35
warning-foreground: #2D2114
border: #E7DDD1
input: #E0D6CB
ring: #FF8B6B
sidebar: #1A1F3A
sidebar-foreground: #F8EFE7
sidebar-primary: #FF8B6B
sidebar-primary-foreground: #2D1720
sidebar-accent: #2A304F
sidebar-accent-foreground: #FFF7EF
sidebar-border: #343A5C
sidebar-ring: #FFB39D
```

### Dark

```txt
background: #111426
foreground: #F5EFE8
card: #181C31
primary: #FAF6F0
primary-foreground: #1A1F3A
accent: #FF9B7F
success: #7AAE8C
warning: #DCA24F
destructive: #E17A75
border: #30354F
sidebar: #0F1326
```

## Tipografía

- Familia: Inter
- Tamaño base: `16px`
- Peso base: `400`
- Letter spacing: `0`
- Los encabezados usan pesos `600` para mantener jerarquía limpia sin verse
  pesada.

## Botones

Usar `Button` desde `src/components/ui/Button.tsx`.

- `primary`: apricot, para acciones principales y llamadas a la acción.
- `secondary`: tinta, para acciones institucionales fuertes.
- `outline`: acciones secundarias sobre cards o toolbars.
- `ghost`: iconos o acciones de baja prominencia.
- `destructive`: acciones irreversibles o de riesgo.

Ejemplo:

```tsx
<Button>Nuevo estudiante</Button>
<Button variant="outline">Actualizar</Button>
```

## Cards

Usar `Card`, `CardHeader`, `CardTitle`, `CardDescription` y `CardContent`.
Las cards deben tener radio `lg`, borde suave y fondo `card`. No anidar cards
decorativas dentro de otras cards.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Estudiantes recientes</CardTitle>
    <CardDescription>Movimientos académicos actualizados</CardDescription>
  </CardHeader>
</Card>
```

## Tablas

Usar los componentes de `src/components/ui/Table.tsx`. Las tablas usan encabezado
`muted`, separadores `border` y hover suave. Mantener densidad administrativa:
filas escaneables, texto de soporte en `muted-foreground` y badges para estados.

## Formularios

Usar `Input` y `Select`. Los campos deben usar `card` como fondo, `input` como
borde y `ring` apricot en foco. Los errores se muestran con `ErrorState` o con
el tono `destructive`.

## Sidebar y Header

El sidebar usa `sidebar` como fondo tinta y `sidebar-primary` para el estado
activo. El header usa `card/90` con blur y borde `border` para mantener jerarquía
sin crear una franja blanca clínica.

## Estados

- Success: operaciones completadas, métricas positivas y estados activos.
- Warning: alertas académicas, seguimiento o estados pendientes.
- Error/destructive: fallos de consulta, eliminación o acciones irreversibles.
- Muted: superficies de apoyo, encabezados de tabla y contenido secundario.

Usar `Badge`, `EmptyState`, `LoadingState` y `ErrorState` para mantener
consistencia.

## Modales y drawers

Usar `Modal` para formularios o confirmaciones centradas. Usar `Drawer` para
detalle lateral. Las confirmaciones destructivas deben usar `ConfirmDialog` con
`destructive`.

## Lineamientos para futuros módulos

- Construir páginas con `PageShell` y acciones en `PageHeader`.
- Usar tokens semánticos (`bg-card`, `text-foreground`, `border-border`) en vez
  de colores crudos.
- Reservar `accent` para acciones principales y momentos destacados.
- Evitar fondos blancos puros en superficies grandes.
- Mantener contraste legible, pero sin endurecer la interfaz con negros puros.
- No duplicar estilos de botones, tablas, estados o formularios dentro del
  módulo; usar los componentes de `src/components/ui`.
