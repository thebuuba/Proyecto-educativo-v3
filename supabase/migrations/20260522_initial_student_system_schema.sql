-- Initial schema for Aula Base V3.
-- This migration is designed for Supabase/PostgreSQL and keeps application
-- profile data in public.app_users while authentication remains in auth.users.

create extension if not exists pgcrypto;

create schema if not exists app_private;

create type public.record_status as enum (
  'active',
  'inactive',
  'archived'
);

create type public.enrollment_status as enum (
  'active',
  'transferred',
  'withdrawn',
  'completed'
);

create type public.attendance_status as enum (
  'present',
  'absent',
  'late',
  'excused'
);

create type public.grade_record_status as enum (
  'draft',
  'published',
  'voided'
);

create type public.report_status as enum (
  'pending',
  'generated',
  'failed',
  'archived'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  description text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on update cascade on delete cascade,
  permission_id uuid not null references public.permissions(id) on update cascade on delete cascade,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on update cascade on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  last_login_at timestamptz,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Users can have multiple roles. This supports schools where one person may be
-- both guardian and staff, or where temporary elevated access is needed.
create table public.user_roles (
  user_id uuid not null references public.app_users(id) on update cascade on delete cascade,
  role_id uuid not null references public.roles(id) on update cascade on delete restrict,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table public.school_years (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  start_date date not null,
  end_date date not null,
  is_current boolean not null default false,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint school_years_valid_dates check (start_date < end_date)
);

create unique index school_years_only_one_current_idx
  on public.school_years (is_current)
  where is_current = true;

create table public.academic_periods (
  id uuid primary key default gen_random_uuid(),
  school_year_id uuid not null references public.school_years(id) on update cascade on delete restrict,
  name text not null,
  sequence smallint not null,
  start_date date not null,
  end_date date not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_periods_valid_dates check (start_date < end_date),
  constraint academic_periods_sequence_positive check (sequence > 0),
  constraint academic_periods_unique_id_year unique (id, school_year_id),
  constraint academic_periods_unique_sequence unique (school_year_id, sequence),
  constraint academic_periods_unique_name unique (school_year_id, name)
);

create table public.grades (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  level text,
  sequence smallint,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  grade_id uuid not null references public.grades(id) on update cascade on delete restrict,
  name text not null,
  capacity integer,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sections_capacity_positive check (capacity is null or capacity > 0),
  constraint sections_unique_name unique (grade_id, name),
  constraint sections_unique_id_grade unique (id, grade_id)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  credits numeric(5,2),
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subjects_credits_positive check (credits is null or credits > 0)
);

create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.app_users(id) on update cascade on delete set null,
  employee_code text not null unique,
  first_name text not null,
  last_name text not null,
  document_id text unique,
  birth_date date,
  gender text,
  phone text,
  email text unique,
  hire_date date,
  address text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.app_users(id) on update cascade on delete set null,
  student_code text not null unique,
  first_name text not null,
  last_name text not null,
  document_id text unique,
  birth_date date not null,
  gender text,
  address text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guardians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.app_users(id) on update cascade on delete set null,
  full_name text not null,
  document_id text unique,
  phone text,
  email text,
  address text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_guardians (
  student_id uuid not null references public.students(id) on update cascade on delete cascade,
  guardian_id uuid not null references public.guardians(id) on update cascade on delete cascade,
  relationship text not null,
  is_primary boolean not null default false,
  can_pick_up boolean not null default false,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (student_id, guardian_id)
);

create unique index student_guardians_one_primary_idx
  on public.student_guardians (student_id)
  where is_primary = true and status = 'active';

create table public.section_subjects (
  id uuid primary key default gen_random_uuid(),
  school_year_id uuid not null references public.school_years(id) on update cascade on delete restrict,
  grade_id uuid not null references public.grades(id) on update cascade on delete restrict,
  section_id uuid not null,
  subject_id uuid not null references public.subjects(id) on update cascade on delete restrict,
  teacher_id uuid references public.teachers(id) on update cascade on delete set null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint section_subjects_section_grade_fk
    foreign key (section_id, grade_id)
    references public.sections(id, grade_id)
    on update cascade
    on delete restrict,
  constraint section_subjects_unique unique (school_year_id, section_id, subject_id),
  constraint section_subjects_unique_id_year_section unique (id, school_year_id, section_id)
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on update cascade on delete restrict,
  school_year_id uuid not null references public.school_years(id) on update cascade on delete restrict,
  grade_id uuid not null references public.grades(id) on update cascade on delete restrict,
  section_id uuid not null,
  enrollment_date date not null default current_date,
  status public.enrollment_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enrollments_section_grade_fk
    foreign key (section_id, grade_id)
    references public.sections(id, grade_id)
    on update cascade
    on delete restrict,
  constraint enrollments_unique_student_year unique (student_id, school_year_id),
  constraint enrollments_unique_id_year_section unique (id, school_year_id, section_id)
);

-- Daily attendance tracks the school-day status independently from class-level
-- attendance. This avoids nullable columns inside unique constraints.
create table public.attendance_daily (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null,
  school_year_id uuid not null,
  section_id uuid not null,
  academic_period_id uuid not null,
  attendance_date date not null,
  status public.attendance_status not null,
  notes text,
  recorded_by uuid references public.app_users(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint attendance_daily_enrollment_fk
    foreign key (enrollment_id, school_year_id, section_id)
    references public.enrollments(id, school_year_id, section_id)
    on update cascade
    on delete cascade,
  constraint attendance_daily_period_fk
    foreign key (academic_period_id, school_year_id)
    references public.academic_periods(id, school_year_id)
    on update cascade
    on delete restrict,
  constraint attendance_daily_unique unique (enrollment_id, attendance_date)
);

create table public.attendance_class (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null,
  school_year_id uuid not null,
  section_id uuid not null,
  section_subject_id uuid not null,
  academic_period_id uuid not null,
  attendance_date date not null,
  status public.attendance_status not null,
  notes text,
  recorded_by uuid references public.app_users(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint attendance_class_enrollment_fk
    foreign key (enrollment_id, school_year_id, section_id)
    references public.enrollments(id, school_year_id, section_id)
    on update cascade
    on delete cascade,
  constraint attendance_class_section_subject_fk
    foreign key (section_subject_id, school_year_id, section_id)
    references public.section_subjects(id, school_year_id, section_id)
    on update cascade
    on delete restrict,
  constraint attendance_class_period_fk
    foreign key (academic_period_id, school_year_id)
    references public.academic_periods(id, school_year_id)
    on update cascade
    on delete restrict,
  constraint attendance_class_unique unique (enrollment_id, section_subject_id, attendance_date)
);

create table public.grades_records (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null,
  school_year_id uuid not null,
  section_id uuid not null,
  section_subject_id uuid not null,
  academic_period_id uuid not null,
  assessment_name text not null,
  score numeric(8,2) not null,
  max_score numeric(8,2) not null default 100,
  weight numeric(8,4) not null default 1,
  status public.grade_record_status not null default 'draft',
  recorded_by uuid references public.app_users(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grades_records_enrollment_fk
    foreign key (enrollment_id, school_year_id, section_id)
    references public.enrollments(id, school_year_id, section_id)
    on update cascade
    on delete cascade,
  constraint grades_records_section_subject_fk
    foreign key (section_subject_id, school_year_id, section_id)
    references public.section_subjects(id, school_year_id, section_id)
    on update cascade
    on delete restrict,
  constraint grades_records_period_fk
    foreign key (academic_period_id, school_year_id)
    references public.academic_periods(id, school_year_id)
    on update cascade
    on delete restrict,
  constraint grades_records_score_valid check (score >= 0 and score <= max_score),
  constraint grades_records_max_score_positive check (max_score > 0),
  constraint grades_records_weight_positive check (weight > 0)
);

create table public.pedagogical_recoveries (
  id uuid primary key default gen_random_uuid(),
  grade_record_id uuid not null unique references public.grades_records(id) on update cascade on delete cascade,
  recovery_score numeric(8,2) not null,
  recovery_date date not null default current_date,
  reason text,
  status public.grade_record_status not null default 'published',
  recorded_by uuid references public.app_users(id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pedagogical_recoveries_score_non_negative check (recovery_score >= 0)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  school_year_id uuid references public.school_years(id) on update cascade on delete restrict,
  academic_period_id uuid,
  student_id uuid references public.students(id) on update cascade on delete set null,
  generated_by uuid references public.app_users(id) on update cascade on delete set null,
  report_type text not null,
  title text not null,
  parameters jsonb not null default '{}'::jsonb,
  file_url text,
  status public.report_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reports_period_requires_year check (
    academic_period_id is null or school_year_id is not null
  ),
  constraint reports_period_year_fk
    foreign key (academic_period_id, school_year_id)
    references public.academic_periods(id, school_year_id)
    on update cascade
    on delete restrict
);

create or replace function public.validate_academic_period_dates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  year_start date;
  year_end date;
begin
  select start_date, end_date
  into year_start, year_end
  from public.school_years
  where id = new.school_year_id;

  if new.start_date < year_start or new.end_date > year_end then
    raise exception 'Academic period dates must be inside the school year date range';
  end if;

  return new;
end;
$$;

create trigger academic_periods_validate_dates
before insert or update on public.academic_periods
for each row execute function public.validate_academic_period_dates();

insert into public.roles (key, name, description)
values
  ('admin', 'Administrador', 'Acceso operativo total al sistema.'),
  ('director', 'Director', 'Lectura amplia y supervisión institucional.'),
  ('coordinator', 'Coordinador académico', 'Gestión académica y seguimiento escolar.'),
  ('teacher', 'Docente', 'Gestión de asignaciones, asistencia y calificaciones propias.'),
  ('student', 'Estudiante', 'Acceso a su información académica.'),
  ('guardian', 'Tutor', 'Acceso a estudiantes vinculados.'),
  ('viewer', 'Consulta', 'Acceso limitado de lectura.')
on conflict (key) do nothing;

insert into public.permissions (key, name, description)
values
  ('system.full_access', 'Acceso total', 'Permite administrar todo el sistema.'),
  ('academics.read_all', 'Leer información académica', 'Permite consultar información académica amplia.'),
  ('academics.manage', 'Gestionar información académica', 'Permite crear y editar estructura académica.'),
  ('students.read_related', 'Leer estudiantes relacionados', 'Permite leer estudiantes vinculados al usuario.'),
  ('attendance.manage_assigned', 'Gestionar asistencia asignada', 'Permite registrar asistencia en secciones o clases asignadas.'),
  ('grades.manage_assigned', 'Gestionar calificaciones asignadas', 'Permite registrar calificaciones en asignaciones propias.'),
  ('reports.generate', 'Generar reportes', 'Permite generar reportes académicos.')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
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
on conflict (role_id, permission_id) do nothing;

create or replace function public.validate_recovery_score()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  original_max_score numeric(8,2);
begin
  select max_score
  into original_max_score
  from public.grades_records
  where id = new.grade_record_id;

  if original_max_score is null then
    raise exception 'Grade record % does not exist', new.grade_record_id;
  end if;

  if new.recovery_score > original_max_score then
    raise exception 'Recovery score % cannot exceed original max_score %',
      new.recovery_score,
      original_max_score;
  end if;

  return new;
end;
$$;

create trigger pedagogical_recoveries_validate_score
before insert or update on public.pedagogical_recoveries
for each row execute function public.validate_recovery_score();

create or replace function public.validate_attendance_date_in_period()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  period_start date;
  period_end date;
begin
  select start_date, end_date
  into period_start, period_end
  from public.academic_periods
  where id = new.academic_period_id
    and school_year_id = new.school_year_id;

  if period_start is null then
    raise exception 'Academic period % does not belong to school year %',
      new.academic_period_id,
      new.school_year_id;
  end if;

  if new.attendance_date < period_start or new.attendance_date > period_end then
    raise exception 'Attendance date must be inside the academic period date range';
  end if;

  return new;
end;
$$;

create trigger attendance_daily_validate_period_date
before insert or update on public.attendance_daily
for each row execute function public.validate_attendance_date_in_period();

create trigger attendance_class_validate_period_date
before insert or update on public.attendance_class
for each row execute function public.validate_attendance_date_in_period();

create or replace view public.student_grade_details
with (security_invoker = true)
as
select
  gr.id as grade_record_id,
  e.student_id,
  gr.school_year_id,
  e.grade_id,
  gr.section_id,
  gr.section_subject_id,
  ss.subject_id,
  gr.academic_period_id,
  gr.assessment_name,
  gr.score as original_score,
  pr.recovery_score,
  coalesce(pr.recovery_score, gr.score) as effective_score,
  gr.max_score,
  round((gr.score / gr.max_score) * 100, 2) as original_percent,
  round((coalesce(pr.recovery_score, gr.score) / gr.max_score) * 100, 2) as effective_percent,
  gr.weight,
  gr.status as grade_status,
  pr.status as recovery_status,
  gr.created_at,
  gr.updated_at
from public.grades_records gr
join public.enrollments e on e.id = gr.enrollment_id
join public.section_subjects ss on ss.id = gr.section_subject_id
left join public.pedagogical_recoveries pr
  on pr.grade_record_id = gr.id
  and pr.status = 'published'
where gr.status = 'published';

create or replace view public.student_final_grades
with (security_invoker = true)
as
select
  student_id,
  school_year_id,
  grade_id,
  section_id,
  subject_id,
  academic_period_id,
  round(
    sum(effective_percent * weight) / nullif(sum(weight), 0),
    2
  ) as final_average_percent
from public.student_grade_details
group by
  student_id,
  school_year_id,
  grade_id,
  section_id,
  subject_id,
  academic_period_id;

create index app_users_auth_user_id_idx on public.app_users(auth_user_id);
create index user_roles_role_id_idx on public.user_roles(role_id);
create index role_permissions_permission_id_idx on public.role_permissions(permission_id);
create index students_user_id_idx on public.students(user_id);
create index teachers_user_id_idx on public.teachers(user_id);
create index guardians_user_id_idx on public.guardians(user_id);
create index student_guardians_guardian_id_idx on public.student_guardians(guardian_id);
create index sections_grade_id_idx on public.sections(grade_id);
create index academic_periods_school_year_id_idx on public.academic_periods(school_year_id);
create index section_subjects_school_year_section_idx on public.section_subjects(school_year_id, section_id);
create index section_subjects_subject_id_idx on public.section_subjects(subject_id);
create index section_subjects_teacher_id_idx on public.section_subjects(teacher_id);
create index enrollments_student_id_idx on public.enrollments(student_id);
create index enrollments_school_year_id_idx on public.enrollments(school_year_id);
create index enrollments_grade_section_idx on public.enrollments(grade_id, section_id);
create index attendance_daily_enrollment_date_idx on public.attendance_daily(enrollment_id, attendance_date);
create index attendance_class_enrollment_date_idx on public.attendance_class(enrollment_id, attendance_date);
create index attendance_class_section_subject_id_idx on public.attendance_class(section_subject_id);
create index grades_records_enrollment_id_idx on public.grades_records(enrollment_id);
create index grades_records_section_subject_id_idx on public.grades_records(section_subject_id);
create index grades_records_academic_period_id_idx on public.grades_records(academic_period_id);
create index pedagogical_recoveries_grade_record_id_idx on public.pedagogical_recoveries(grade_record_id);
create index reports_school_year_id_idx on public.reports(school_year_id);
create index reports_student_id_idx on public.reports(student_id);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'roles',
    'permissions',
    'role_permissions',
    'app_users',
    'user_roles',
    'school_years',
    'academic_periods',
    'grades',
    'sections',
    'subjects',
    'teachers',
    'students',
    'guardians',
    'student_guardians',
    'section_subjects',
    'enrollments',
    'attendance_daily',
    'attendance_class',
    'grades_records',
    'pedagogical_recoveries',
    'reports'
  ]
  loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      table_name || '_set_updated_at',
      table_name
    );
  end loop;
end;
$$;

create or replace function app_private.current_app_user_id()
returns uuid
language sql
security definer
set search_path = public, auth
stable
as $$
  select id
  from public.app_users
  where auth_user_id = auth.uid()
    and status = 'active'
  limit 1
$$;

create or replace function app_private.has_role(role_key text)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1
    from public.app_users au
    join public.user_roles ur on ur.user_id = au.id
    join public.roles r on r.id = ur.role_id
    where au.auth_user_id = auth.uid()
      and au.status = 'active'
      and ur.status = 'active'
      and r.status = 'active'
      and r.key = role_key
  )
$$;

create or replace function app_private.has_any_role(role_keys text[])
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1
    from unnest(role_keys) as role_key
    where app_private.has_role(role_key)
  )
$$;

create or replace function app_private.current_student_id()
returns uuid
language sql
security definer
set search_path = public, auth
stable
as $$
  select s.id
  from public.students s
  where s.user_id = app_private.current_app_user_id()
    and s.status = 'active'
  limit 1
$$;

create or replace function app_private.current_teacher_id()
returns uuid
language sql
security definer
set search_path = public, auth
stable
as $$
  select t.id
  from public.teachers t
  where t.user_id = app_private.current_app_user_id()
    and t.status = 'active'
  limit 1
$$;

create or replace function app_private.current_guardian_id()
returns uuid
language sql
security definer
set search_path = public, auth
stable
as $$
  select g.id
  from public.guardians g
  where g.user_id = app_private.current_app_user_id()
    and g.status = 'active'
  limit 1
$$;

create or replace function app_private.can_access_student(target_student_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select
    app_private.has_any_role(array['admin', 'director', 'coordinator'])
    or target_student_id = app_private.current_student_id()
    or exists (
      select 1
      from public.student_guardians sg
      where sg.student_id = target_student_id
        and sg.guardian_id = app_private.current_guardian_id()
        and sg.status = 'active'
    )
    or exists (
      select 1
      from public.enrollments e
      join public.section_subjects ss
        on ss.school_year_id = e.school_year_id
       and ss.section_id = e.section_id
      where e.student_id = target_student_id
        and ss.teacher_id = app_private.current_teacher_id()
        and e.status = 'active'
        and ss.status = 'active'
    )
$$;

create or replace function app_private.can_access_enrollment(target_enrollment_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1
    from public.enrollments e
    where e.id = target_enrollment_id
      and app_private.can_access_student(e.student_id)
  )
$$;

create or replace function app_private.can_access_section_subject(target_section_subject_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select
    app_private.has_any_role(array['admin', 'director', 'coordinator'])
    or exists (
      select 1
      from public.section_subjects ss
      where ss.id = target_section_subject_id
        and ss.teacher_id = app_private.current_teacher_id()
        and ss.status = 'active'
    )
    or exists (
      select 1
      from public.section_subjects ss
      join public.enrollments e
        on e.school_year_id = ss.school_year_id
       and e.section_id = ss.section_id
      where ss.id = target_section_subject_id
        and e.student_id = app_private.current_student_id()
        and e.status = 'active'
        and ss.status = 'active'
    )
    or exists (
      select 1
      from public.section_subjects ss
      join public.enrollments e
        on e.school_year_id = ss.school_year_id
       and e.section_id = ss.section_id
      join public.student_guardians sg
        on sg.student_id = e.student_id
      where ss.id = target_section_subject_id
        and sg.guardian_id = app_private.current_guardian_id()
        and e.status = 'active'
        and ss.status = 'active'
        and sg.status = 'active'
    )
$$;

create or replace function app_private.can_manage_section_subject(target_section_subject_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select
    app_private.has_any_role(array['admin', 'coordinator'])
    or exists (
      select 1
      from public.section_subjects ss
      where ss.id = target_section_subject_id
        and ss.teacher_id = app_private.current_teacher_id()
        and ss.status = 'active'
    )
$$;

create or replace function app_private.can_access_grade_record(target_grade_record_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1
    from public.grades_records gr
    where gr.id = target_grade_record_id
      and app_private.can_access_enrollment(gr.enrollment_id)
      and app_private.can_access_section_subject(gr.section_subject_id)
  )
$$;

create or replace function app_private.can_manage_grade_record(target_grade_record_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1
    from public.grades_records gr
    where gr.id = target_grade_record_id
      and app_private.can_manage_section_subject(gr.section_subject_id)
  )
$$;

create or replace function app_private.can_manage_section(target_school_year_id uuid, target_section_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select
    app_private.has_any_role(array['admin', 'coordinator'])
    or exists (
      select 1
      from public.section_subjects ss
      where ss.school_year_id = target_school_year_id
        and ss.section_id = target_section_id
        and ss.teacher_id = app_private.current_teacher_id()
        and ss.status = 'active'
    )
$$;

revoke all on schema app_private from public;
revoke execute on all functions in schema app_private from public;
grant usage on schema app_private to authenticated;
grant execute on all functions in schema app_private to authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'roles',
    'permissions',
    'role_permissions',
    'app_users',
    'user_roles',
    'school_years',
    'academic_periods',
    'grades',
    'sections',
    'subjects',
    'teachers',
    'students',
    'guardians',
    'student_guardians',
    'section_subjects',
    'enrollments',
    'attendance_daily',
    'attendance_class',
    'grades_records',
    'pedagogical_recoveries',
    'reports'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

-- Base RLS policies. These are intentionally conservative and should be
-- reviewed with the school's final authorization matrix before production.

create policy roles_admin_all on public.roles
for all to authenticated
using (app_private.has_role('admin'))
with check (app_private.has_role('admin'));

create policy roles_read_authenticated on public.roles
for select to authenticated
using (status = 'active');

create policy permissions_admin_all on public.permissions
for all to authenticated
using (app_private.has_role('admin'))
with check (app_private.has_role('admin'));

create policy permissions_read_authenticated on public.permissions
for select to authenticated
using (status = 'active');

create policy role_permissions_admin_all on public.role_permissions
for all to authenticated
using (app_private.has_role('admin'))
with check (app_private.has_role('admin'));

create policy app_users_admin_all on public.app_users
for all to authenticated
using (app_private.has_role('admin'))
with check (app_private.has_role('admin'));

create policy app_users_read_own_or_staff on public.app_users
for select to authenticated
using (
  auth_user_id = auth.uid()
  or app_private.has_any_role(array['admin', 'director', 'coordinator'])
);

create policy user_roles_admin_all on public.user_roles
for all to authenticated
using (app_private.has_role('admin'))
with check (app_private.has_role('admin'));

create policy user_roles_read_own_or_admin on public.user_roles
for select to authenticated
using (
  user_id = app_private.current_app_user_id()
  or app_private.has_role('admin')
);

create policy school_years_read_authenticated on public.school_years
for select to authenticated
using (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']));

create policy school_years_admin_coordinator_write on public.school_years
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy academic_periods_read_authenticated on public.academic_periods
for select to authenticated
using (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']));

create policy academic_periods_admin_coordinator_write on public.academic_periods
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy grades_read_authenticated on public.grades
for select to authenticated
using (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']));

create policy grades_admin_coordinator_write on public.grades
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy sections_read_authenticated on public.sections
for select to authenticated
using (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']));

create policy sections_admin_coordinator_write on public.sections
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy subjects_read_authenticated on public.subjects
for select to authenticated
using (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']));

create policy subjects_admin_coordinator_write on public.subjects
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy teachers_admin_coordinator_write on public.teachers
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy teachers_read_related on public.teachers
for select to authenticated
using (
  user_id = app_private.current_app_user_id()
  or app_private.has_any_role(array['admin', 'director', 'coordinator'])
);

create policy students_admin_coordinator_write on public.students
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy students_read_related on public.students
for select to authenticated
using (app_private.can_access_student(id));

create policy guardians_admin_coordinator_write on public.guardians
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy guardians_read_related on public.guardians
for select to authenticated
using (
  user_id = app_private.current_app_user_id()
  or id = app_private.current_guardian_id()
  or app_private.has_any_role(array['admin', 'director', 'coordinator'])
  or exists (
    select 1
    from public.student_guardians sg
    where sg.guardian_id = guardians.id
      and sg.student_id = app_private.current_student_id()
      and sg.status = 'active'
  )
);

create policy student_guardians_admin_coordinator_write on public.student_guardians
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy student_guardians_read_related on public.student_guardians
for select to authenticated
using (
  app_private.has_any_role(array['admin', 'director', 'coordinator'])
  or student_id = app_private.current_student_id()
  or guardian_id = app_private.current_guardian_id()
);

create policy section_subjects_admin_coordinator_write on public.section_subjects
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy section_subjects_read_related on public.section_subjects
for select to authenticated
using (app_private.can_access_section_subject(id));

create policy enrollments_admin_coordinator_write on public.enrollments
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy enrollments_read_related on public.enrollments
for select to authenticated
using (app_private.can_access_enrollment(id));

create policy attendance_daily_manage_related on public.attendance_daily
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy attendance_daily_read_related on public.attendance_daily
for select to authenticated
using (app_private.can_access_enrollment(enrollment_id));

create policy attendance_class_manage_related on public.attendance_class
for all to authenticated
using (app_private.can_manage_section_subject(section_subject_id))
with check (app_private.can_manage_section_subject(section_subject_id));

create policy attendance_class_read_related on public.attendance_class
for select to authenticated
using (
  app_private.can_access_enrollment(enrollment_id)
  and app_private.can_access_section_subject(section_subject_id)
);

create policy grades_records_manage_related on public.grades_records
for all to authenticated
using (app_private.can_manage_section_subject(section_subject_id))
with check (app_private.can_manage_section_subject(section_subject_id));

create policy grades_records_read_related on public.grades_records
for select to authenticated
using (
  app_private.can_access_enrollment(enrollment_id)
  and app_private.can_access_section_subject(section_subject_id)
);

create policy pedagogical_recoveries_manage_related on public.pedagogical_recoveries
for all to authenticated
using (app_private.can_manage_grade_record(grade_record_id))
with check (app_private.can_manage_grade_record(grade_record_id));

create policy pedagogical_recoveries_read_related on public.pedagogical_recoveries
for select to authenticated
using (app_private.can_access_grade_record(grade_record_id));

create policy reports_admin_coordinator_write on public.reports
for all to authenticated
using (app_private.has_any_role(array['admin', 'coordinator']))
with check (app_private.has_any_role(array['admin', 'coordinator']));

create policy reports_read_related on public.reports
for select to authenticated
using (
  app_private.has_any_role(array['admin', 'director', 'coordinator'])
  or generated_by = app_private.current_app_user_id()
  or (student_id is not null and app_private.can_access_student(student_id))
);
