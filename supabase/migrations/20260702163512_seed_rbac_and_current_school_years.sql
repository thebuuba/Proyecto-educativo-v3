begin;

insert into public.roles (key, name, description)
values
  ('admin', 'Administrador', 'Acceso operativo total al sistema.'),
  ('director', 'Director', 'Lectura amplia y supervisión institucional.'),
  ('coordinator', 'Coordinador académico', 'Gestión académica y seguimiento escolar.'),
  ('teacher', 'Docente', 'Gestión de asignaciones, asistencia y calificaciones propias.'),
  ('student', 'Estudiante', 'Acceso a su información académica.'),
  ('guardian', 'Tutor', 'Acceso a estudiantes vinculados.'),
  ('viewer', 'Consulta', 'Acceso limitado de lectura.')
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  status = 'active',
  updated_at = now();

insert into public.permissions (key, name, description)
values
  ('system.full_access', 'Acceso total', 'Permite administrar todo el sistema.'),
  ('academics.read_all', 'Leer información académica', 'Permite consultar información académica amplia.'),
  ('academics.manage', 'Gestionar información académica', 'Permite crear y editar estructura académica.'),
  ('students.read_related', 'Leer estudiantes relacionados', 'Permite leer estudiantes vinculados al usuario.'),
  ('attendance.manage_assigned', 'Gestionar asistencia asignada', 'Permite registrar asistencia en secciones o clases asignadas.'),
  ('grades.manage_assigned', 'Gestionar calificaciones asignadas', 'Permite registrar calificaciones en asignaciones propias.'),
  ('reports.generate', 'Generar reportes', 'Permite generar reportes académicos.')
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  status = 'active',
  updated_at = now();

insert into public.role_permissions (role_id, permission_id, status)
select r.id, p.id, 'active'
from public.roles r
join public.permissions p on
  (r.key = 'admin' and p.key in (
    'system.full_access',
    'academics.read_all',
    'academics.manage',
    'students.read_related',
    'attendance.manage_assigned',
    'grades.manage_assigned',
    'reports.generate'
  ))
  or (r.key in ('director', 'coordinator') and p.key in (
    'academics.read_all',
    'academics.manage',
    'students.read_related',
    'reports.generate'
  ))
  or (r.key = 'teacher' and p.key in (
    'students.read_related',
    'attendance.manage_assigned',
    'grades.manage_assigned'
  ))
  or (r.key in ('student', 'guardian') and p.key = 'students.read_related')
on conflict (role_id, permission_id) do update set
  status = 'active',
  updated_at = now();

with missing_schools as (
  select s.id as school_id
  from public.schools s
  where s.status = 'active'
    and not exists (
      select 1
      from public.school_years sy
      where sy.school_id = s.id
        and sy.is_current = true
        and sy.status = 'active'
    )
),
inserted_years as (
  insert into public.school_years (
    school_id,
    name,
    start_date,
    end_date,
    is_current,
    period_scheme,
    period_count,
    calendar_source,
    status
  )
  select
    school_id,
    '2026-2027',
    date '2026-08-01',
    date '2027-06-30',
    true,
    'trimester',
    3,
    'school',
    'active'
  from missing_schools
  on conflict (school_id, name) do update set
    start_date = excluded.start_date,
    end_date = excluded.end_date,
    is_current = true,
    period_scheme = excluded.period_scheme,
    period_count = excluded.period_count,
    calendar_source = excluded.calendar_source,
    status = 'active',
    updated_at = now()
  returning id, school_id
),
period_templates as (
  select *
  from (values
    ('Periodo 1', 1, date '2026-08-01', date '2026-12-15'),
    ('Periodo 2', 2, date '2027-01-08', date '2027-03-31'),
    ('Periodo 3', 3, date '2027-04-01', date '2027-06-30')
  ) as p(name, sequence, start_date, end_date)
)
insert into public.academic_periods (
  school_year_id,
  school_id,
  name,
  sequence,
  start_date,
  end_date,
  status
)
select
  y.id,
  y.school_id,
  p.name,
  p.sequence,
  p.start_date,
  p.end_date,
  'active'
from inserted_years y
cross join period_templates p
on conflict (school_year_id, sequence) do update set
  name = excluded.name,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  status = 'active',
  updated_at = now();

commit;
