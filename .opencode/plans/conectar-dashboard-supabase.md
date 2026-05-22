# Plan: Conectar Dashboard a Supabase

## Contexto del Proyecto

Aula Base V3 es un sistema de gestión estudiantil construido con:
- **Frontend:** React 19 + TypeScript 6 + Vite 8 + Tailwind v4
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **DB Hosted:** Proyecto `Aula Base` (ref: `mzmenzzvbzsqaegsqmlb`)
- **Auth:** Supabase Auth con flujo de login/logout, roles y permisos vía `app_users`, `user_roles`, `role_permissions`
- **Admin creado:** `admin@aula.com` / `Admin123!`

### Capas ya implementadas
- **14 componentes UI** tokenizados con barrel file (`src/components/ui/index.ts`)
- **Sistema de diseño** con variables CSS en `:root` y `.dark`
- **Auth completa:** LoginPage, RequireAuth, AuthProvider, authService
- **Módulo Students:** CRUD completo con búsqueda, filtros, detalle, desactivación
- **Dashboard:** Layout y componentes visuales renderizando **datos mock estáticos**
- **Utilidades compartidas:** `firstOrNull` en `utils/helpers.ts`, `useDebouncedSearch` en `hooks/`

### Patrón de servicios a seguir

El proyecto ya tiene un patrón de servicio consolidado en `studentsService.ts`:

1. `supabase.from('tabla').select('col1, col2, ...')` con filtros encadenados
2. Helper `assertNoSupabaseError(postgrestError, fallbackMessage)` para errores
3. Helper `getSupabaseErrorMessage(error)` para errores específicos (23505 = duplicado, 42501 = permiso)
4. Tipos locales `Row` para mapear snake_case DB → camelCase frontend
5. `firstOrNull<T>(value)` para relaciones 1:1 de PostgREST

## Estado Actual del Dashboard

`DashboardPage.tsx` importa 6 arrays mock desde `dashboardData.ts`:

| Componente | Mock actual | Debería venir de |
|---|---|---|
| `StatCard` × 4 | `dashboardStats` | Consultas de conteo/promedio |
| `BarChart` (asistencia semanal) | `attendanceData` | `attendance_daily` |
| `LineChart` (rendimiento) | `performanceData` | `grades_records` |
| `RecentStudentsTable` | `recentStudents` | `students` + `enrollments` + `grades_records` |
| `AcademicAlerts` | `academicAlerts` | Consultas de umbrales |
| `QuickActions` | `quickActions` | **Estático** (links fijos) — no necesita DB |

## Pasos a Implementar

### 1. Crear `src/modules/dashboard/services/dashboardService.ts`

Servicio con funciones que consultan Supabase y devuelven los tipos definidos en `dashboard.ts`.

```typescript
import { supabase } from '@/services/supabase'
import { firstOrNull } from '@/utils/helpers'
import type { AcademicAlert, ChartDatum, DashboardStat, RecentStudent } from '../types/dashboard'
```

#### 1a. `getDashboardStats(): Promise<DashboardStat[]>`

Consultar 4 métricas en paralelo con `Promise.all`:

**Estudiantes activos:**
```sql
select count(*) from students where status = 'active';
```

**Asistencia promedio (últimos 30 días):**
```sql
select
  round(
    (count(*) filter (where status = 'present') * 100.0 / nullif(count(*), 0))::numeric, 1
  ) as avg_attendance
from attendance_daily
where attendance_date >= current_date - interval '30 days';
```

**Promedio académico general:**
```sql
select
  round(avg(score / nullif(max_score, 0) * 100)::numeric, 1) as avg_score
from grades_records
where status = 'published';
```

**Alertas abiertas (conteo de estudiantes con bajo rendimiento o asistencia):**
```sql
-- Estudiantes con promedio < 70 en el período actual
select count(distinct enrollment_id)
from grades_records
where status = 'published'
group by enrollment_id
having avg(score / nullif(max_score, 0) * 100) < 70;
```
O alternativamente contar registros de `pedagogical_recoveries` pendientes.

**Mapear a `DashboardStat[]`:**
```typescript
const icons = [UsersRound, CalendarCheck, GraduationCap, AlertTriangle] as const
const tones: DashboardTone[] = ['cyan', 'emerald', 'indigo', 'amber']

return [
  { label: 'Estudiantes activos', value: formatCount(activeStudents), change: '...', trend: 'registrados', icon: icons[0], tone: tones[0] },
  { label: 'Asistencia promedio', value: `${avgAttendance}%`, change: '...', trend: 'últimos 30 días', icon: icons[1], tone: tones[1] },
  { label: 'Promedio académico', value: `${avgScore}`, change: '...', trend: 'año escolar actual', icon: icons[2], tone: tones[2] },
  { label: 'Alertas abiertas', value: String(alertCount), change: '...', trend: 'requieren atención', icon: icons[3], tone: tones[3] },
]
```

**Nota:** El `change` (ej: `+8.2%`) requiere comparación con período anterior. Para MVP se puede omitir o mostrar `—` (el StatCard ya maneja condicionalmente colores positivo/negativo según `startsWith('-')`).

#### 1b. `getAttendanceData(): Promise<ChartDatum[]>`

Agrupar asistencia por día de la semana del último mes:

```sql
select
  to_char(attendance_date, 'Dy') as label,
  round(
    (count(*) filter (where status = 'present') * 100.0 / nullif(count(*), 0))::numeric, 1
  ) as value
from attendance_daily
where attendance_date >= current_date - interval '4 weeks'
group by to_char(attendance_date, 'Dy'), extract(dow from attendance_date)
order by extract(dow from attendance_date);
```

Mapear a `{ label: 'Lun', value: 94 }`.

#### 1c. `getPerformanceData(): Promise<ChartDatum[]>`

Agrupar calificaciones por período académico (mes) del año actual:

```sql
select
  ap.name as label,
  round(avg(gr.score / nullif(gr.max_score, 0) * 100)::numeric, 1) as value
from grades_records gr
join academic_periods ap on ap.id = gr.academic_period_id
where gr.status = 'published'
  and gr.school_year_id = (select id from school_years where is_current = true limit 1)
group by ap.name, ap.sequence
order by ap.sequence;
```

#### 1d. `getRecentStudents(): Promise<RecentStudent[]>`

Últimos 10 estudiantes con matrícula activa y su promedio:

```sql
select
  s.id,
  s.first_name || ' ' || s.last_name as name,
  g.name as grade,
  s.status,
  round(avg(gr.score / nullif(gr.max_score, 0) * 100)::numeric, 1) as average,
  '—' as attendance  -- o calcular de attendance_daily
from students s
join enrollments e on e.student_id = s.id and e.status = 'active'
join grades g on g.id = e.grade_id
left join grades_records gr on gr.enrollment_id = e.id and gr.status = 'published'
group by s.id, g.name
order by s.updated_at desc
limit 10;
```

**Mapear a `RecentStudent[]`:**
```typescript
const statusMap: Record<string, 'Activo' | 'Nuevo' | 'Seguimiento'> = {
  active: 'Activo',
  inactive: 'Inactivo',
  // 'Nuevo' y 'Seguimiento' son lógicos de negocio — podrían derivarse de
  // fecha de creación < 30 días o alerts activos
}

return rows.map(row => ({
  id: row.id,
  name: row.name,
  grade: row.grade,
  status: statusMap[row.status] ?? 'Activo',
  average: `${row.average}%`,
  attendance: row.attendance,
}))
```

#### 1e. `getAcademicAlerts(): Promise<AcademicAlert[]>>

Consultar umbrales:

```typescript
// Alumnos con promedio < 70
const { data: lowPerf } = await supabase.from('student_final_grades')
  .select('...') // usar la vista
  // o consultar grades_records directamente

// Alumnos con asistencia < 75% en el mes
const { data: lowAtt } = await supabase.rpc('get_low_attendance_students')
  // o una consulta raw

// Recuperaciones pendientes
const { data: pendingRec } = await supabase.from('pedagogical_recoveries')
  .select('...', { count: 'exact', head: true })
```

Mapear a:
```typescript
[
  { title: 'Rendimiento bajo', description: `${n} estudiantes requieren revisión.`, severity: n > 10 ? 'Alta' : 'Media' },
  { title: 'Asistencia irregular', description: `${m} registros por debajo del umbral.`, severity: m > 15 ? 'Alta' : 'Media' },
  { title: 'Recuperación pendiente', description: `${p} notas por publicar.`, severity: p > 5 ? 'Alta' : 'Media' },
]
```

#### 1f. `getQuickActions(): QuickAction[]` (estático, no cambia)

Mantener los 5 links existentes en el propio servicio o como constante — no necesita consulta DB.

### 2. Crear `src/modules/dashboard/hooks/useDashboard.ts`

Hook que orquesta las 5 consultas, maneja loading y error state.

```typescript
type DashboardData = {
  stats: DashboardStat[]
  attendanceData: ChartDatum[]
  performanceData: ChartDatum[]
  recentStudents: RecentStudent[]
  alerts: AcademicAlert[]
  quickActions: QuickAction[]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar todo en paralelo con Promise.all
    async function load() {
      setLoading(true)
      try {
        const [stats, attendance, performance, students, alerts] = await Promise.all([
          getDashboardStats(),
          getAttendanceData(),
          getPerformanceData(),
          getRecentStudents(),
          getAcademicAlerts(),
        ])
        setData({
          stats, attendanceData: attendance, performanceData: performance,
          recentStudents: students, alerts, quickActions: getQuickActions(),
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar dashboard')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  return { data, loading, error }
}
```

### 3. Modificar `DashboardPage.tsx`

Reemplazar imports de mock data por el hook:

```typescript
// ANTES:
import { academicAlerts, attendanceData, dashboardStats, ... } from '@/modules/dashboard/data/dashboardData'

// DESPUÉS:
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'
import { LoadingState, ErrorState } from '@/components/ui'

export function DashboardPage() {
  const { data, loading, error } = useDashboard()

  if (loading) return <LoadingState message="Cargando dashboard..." />
  if (error) return <ErrorState message={error} />
  if (!data) return <ErrorState message="No se pudieron cargar los datos del dashboard." />

  // Usar data.stats, data.attendanceData, etc.
}
```

Los valores `"92.6%"` y `"87.4"` hardcodeados en `ChartPanel` deben ser reemplazados por:
```typescript
<ChartPanel title="Asistencia semanal" description="..." value={`${avgAttendance}%`}>
```

Donde `avgAttendance` se calcula como el promedio de `data.attendanceData` o viene de `getDashboardStats()`.

### 4. Consideraciones de RLS

Todas las consultas usan `supabase` (anon key). Las RLS policies ya definidas en la migración filtran según el rol del usuario autenticado:

| Tabla | Política RLS |
|---|---|
| `students` | Admin/coordinator/director: todas; Teacher: solo estudiantes en sus secciones |
| `enrollments` | Ídem |
| `grades_records` | Solo publicados para teachers/students; todos para admin |
| `attendance_daily` | Teacher: su sección; Admin: todas |

**No agregar filtros de tenant en el frontend** — confiar en RLS. Si el usuario no ve ciertos datos, RLS los excluirá automáticamente.

### 5. Archivos a modificar/crear

| Archivo | Acción |
|---|---|
| `src/modules/dashboard/services/dashboardService.ts` | **Crear** — 6 funciones de consulta |
| `src/modules/dashboard/hooks/useDashboard.ts` | **Crear** — hook orquestador |
| `src/modules/dashboard/pages/DashboardPage.tsx` | **Modificar** — usar hook, mostrar loading/error |
| `src/modules/dashboard/data/dashboardData.ts` | **Eliminar o mantener** como fallback si no hay DB |
| `src/modules/dashboard/components/ChartPanel.tsx` | **No tocar** — ya recibe value por props |
| `src/types/database.types.ts` | **No tocar** — ya generado |

### 6. Prueba

```bash
npm run lint && npm run build
```

### 7. Notas

- Las funciones de `getSupabaseErrorMessage` y `assertNoSupabaseError` están en `studentsService.ts`. Si se usan en dashboardService, conviene extraerlas a `src/utils/helpers.ts` junto a `firstOrNull`.
- El cambio (`+8.2%`, `-6`) es complejo de calcular (requiere período anterior). Para MVP: mostrar `'—'` o calcular solo para métricas donde sea trivial (ej: diff de alumnos activos vs. mes pasado).
- `quickActions` no necesita servicio — es un array estático. Dejarlo en `DashboardPage.tsx` o en una constante en el hook.
- `RecentStudent.status` mapea `active` → `'Activo'`. Los valores `'Nuevo'` y `'Seguimiento'` requieren lógica adicional (creación reciente o alertas activas) — pueden dejarse como `'Activo'` para MVP.
