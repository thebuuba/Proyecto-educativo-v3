-- Add multi-tenant support via school-level isolation.
-- Each row in app_users belongs to exactly one school.
-- All business tables carry a denormalised school_id for simple RLS.

-- 1. Schools table
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Default school (used for existing single-tenant data)
insert into public.schools (name, slug)
values ('Aula Base', 'aula-base');

-- 3. Add school_id to app_users first (no DEFAULT yet — function doesn't exist)
alter table public.app_users add column school_id uuid;
update public.app_users set school_id = (select id from public.schools limit 1);
alter table public.app_users alter column school_id set not null;
alter table public.app_users add constraint fk_app_users_school
  foreign key (school_id) references public.schools(id) on update cascade on delete restrict;

-- 4. Helper function (app_users.school_id exists now)
create or replace function app_private.current_school_id()
returns uuid
language sql
security definer
set search_path = public, auth
stable
as $$
  select school_id
  from public.app_users
  where auth_user_id = auth.uid()
    and status = 'active'
  limit 1
$$;

grant execute on function app_private.current_school_id to authenticated;

-- 5. Set DEFAULT on app_users.school_id (needs function from step 4)
alter table public.app_users alter column school_id set default app_private.current_school_id();

-- =============================================================================
-- Add school_id to remaining tables (function exists so DEFAULT works)
-- =============================================================================

-- 6-22. Remaining tables: add column as nullable, fill, then NOT NULL + DEFAULT + FK
do $$
declare
  tbl text;
  tables text[] := array[
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
  ];
begin
  foreach tbl in array tables loop
    execute format('alter table public.%I add column school_id uuid', tbl);
    execute format('update public.%I set school_id = (select id from public.schools limit 1)', tbl);
    execute format('alter table public.%I alter column school_id set not null', tbl);
    execute format('alter table public.%I alter column school_id set default app_private.current_school_id()', tbl);
    execute format('alter table public.%I add constraint %I foreign key (school_id) references public.schools(id) on update cascade on delete restrict',
      tbl, 'fk_' || tbl || '_school');
  end loop;
end;
$$;

-- Drop old school_years partial index before recreating
drop index if exists school_years_only_one_current_idx;

-- Update unique constraints (these need individual DDL since constraint names differ)
alter table public.school_years drop constraint if exists school_years_name_key;
alter table public.school_years add constraint school_years_name_per_school_key unique (school_id, name);
create unique index school_years_only_one_current_per_school_idx
  on public.school_years (school_id, is_current)
  where is_current = true;

alter table public.grades drop constraint if exists grades_name_key;
alter table public.grades add constraint grades_name_per_school_key unique (school_id, name);

alter table public.subjects drop constraint if exists subjects_code_key;
alter table public.subjects add constraint subjects_code_per_school_key unique (school_id, code);

alter table public.teachers drop constraint if exists teachers_employee_code_key;
alter table public.teachers drop constraint if exists teachers_document_id_key;
alter table public.teachers drop constraint if exists teachers_email_key;
alter table public.teachers add constraint teachers_employee_code_per_school_key unique (school_id, employee_code);
alter table public.teachers add constraint teachers_document_id_per_school_key unique (school_id, document_id);
alter table public.teachers add constraint teachers_email_per_school_key unique (school_id, email);

alter table public.students drop constraint if exists students_student_code_key;
alter table public.students drop constraint if exists students_document_id_key;
alter table public.students add constraint students_student_code_per_school_key unique (school_id, student_code);
alter table public.students add constraint students_document_id_per_school_key unique (school_id, document_id);

alter table public.guardians drop constraint if exists guardians_document_id_key;
alter table public.guardians add constraint guardians_document_id_per_school_key unique (school_id, document_id);

-- =============================================================================
-- RLS: Enable on schools, drop & recreate existing policies
-- =============================================================================

alter table public.schools enable row level security;

create policy schools_admin_all on public.schools
for all to authenticated
using (id = app_private.current_school_id() and app_private.has_role('admin'))
with check (id = app_private.current_school_id() and app_private.has_role('admin'));

create policy schools_read_authenticated on public.schools
for select to authenticated
using (status = 'active');

do $$
begin
  drop policy if exists roles_admin_all on public.roles;
  drop policy if exists roles_read_authenticated on public.roles;
  drop policy if exists permissions_admin_all on public.permissions;
  drop policy if exists permissions_read_authenticated on public.permissions;
  drop policy if exists role_permissions_admin_all on public.role_permissions;
  drop policy if exists role_permissions_read_own_roles on public.role_permissions;
  drop policy if exists app_users_admin_all on public.app_users;
  drop policy if exists app_users_read_own_or_staff on public.app_users;
  drop policy if exists user_roles_admin_all on public.user_roles;
  drop policy if exists user_roles_read_own_or_admin on public.user_roles;
  drop policy if exists school_years_read_authenticated on public.school_years;
  drop policy if exists school_years_admin_coordinator_write on public.school_years;
  drop policy if exists academic_periods_read_authenticated on public.academic_periods;
  drop policy if exists academic_periods_admin_coordinator_write on public.academic_periods;
  drop policy if exists grades_read_authenticated on public.grades;
  drop policy if exists grades_admin_coordinator_write on public.grades;
  drop policy if exists sections_read_authenticated on public.sections;
  drop policy if exists sections_admin_coordinator_write on public.sections;
  drop policy if exists subjects_read_authenticated on public.subjects;
  drop policy if exists subjects_admin_coordinator_write on public.subjects;
  drop policy if exists teachers_admin_coordinator_write on public.teachers;
  drop policy if exists teachers_read_related on public.teachers;
  drop policy if exists students_admin_coordinator_write on public.students;
  drop policy if exists students_read_related on public.students;
  drop policy if exists guardians_admin_coordinator_write on public.guardians;
  drop policy if exists guardians_read_related on public.guardians;
  drop policy if exists student_guardians_admin_coordinator_write on public.student_guardians;
  drop policy if exists student_guardians_read_related on public.student_guardians;
  drop policy if exists section_subjects_admin_coordinator_write on public.section_subjects;
  drop policy if exists section_subjects_read_related on public.section_subjects;
  drop policy if exists enrollments_admin_coordinator_write on public.enrollments;
  drop policy if exists enrollments_read_related on public.enrollments;
  drop policy if exists attendance_daily_manage_related on public.attendance_daily;
  drop policy if exists attendance_daily_read_related on public.attendance_daily;
  drop policy if exists attendance_class_manage_related on public.attendance_class;
  drop policy if exists attendance_class_read_related on public.attendance_class;
  drop policy if exists grades_records_manage_related on public.grades_records;
  drop policy if exists grades_records_read_related on public.grades_records;
  drop policy if exists pedagogical_recoveries_manage_related on public.pedagogical_recoveries;
  drop policy if exists pedagogical_recoveries_read_related on public.pedagogical_recoveries;
  drop policy if exists reports_admin_coordinator_write on public.reports;
  drop policy if exists reports_read_related on public.reports;
end;
$$;

-- System tables (roles, permissions, role_permissions) — globally shared, no school_id
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

create policy role_permissions_read_own_roles on public.role_permissions
for select to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.role_id = role_permissions.role_id
      and ur.user_id = app_private.current_app_user_id()
      and ur.status = 'active'
  )
);

-- Tenant: app_users
create policy app_users_admin_all on public.app_users
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_role('admin')
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_role('admin')
);

create policy app_users_read_own_or_staff on public.app_users
for select to authenticated
using (
  auth_user_id = auth.uid()
  or (
    school_id = app_private.current_school_id()
    and app_private.has_any_role(array['admin', 'director', 'coordinator'])
  )
);

-- Tenant: user_roles
create policy user_roles_admin_all on public.user_roles
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_role('admin')
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_role('admin')
);

create policy user_roles_read_own_or_admin on public.user_roles
for select to authenticated
using (
  user_id = app_private.current_app_user_id()
  or (
    school_id = app_private.current_school_id()
    and app_private.has_role('admin')
  )
);

-- Tenant: school_years
create policy school_years_read_authenticated on public.school_years
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']))
);

create policy school_years_admin_coordinator_write on public.school_years
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

-- Tenant: academic_periods
create policy academic_periods_read_authenticated on public.academic_periods
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']))
);

create policy academic_periods_admin_coordinator_write on public.academic_periods
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

-- Tenant: grades
create policy grades_read_authenticated on public.grades
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']))
);

create policy grades_admin_coordinator_write on public.grades
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

-- Tenant: sections
create policy sections_read_authenticated on public.sections
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']))
);

create policy sections_admin_coordinator_write on public.sections
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

-- Tenant: subjects
create policy subjects_read_authenticated on public.subjects
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (status = 'active' or app_private.has_any_role(array['admin', 'director', 'coordinator']))
);

create policy subjects_admin_coordinator_write on public.subjects
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

-- Tenant: teachers
create policy teachers_admin_coordinator_write on public.teachers
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

create policy teachers_read_related on public.teachers
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (
    user_id = app_private.current_app_user_id()
    or app_private.has_any_role(array['admin', 'director', 'coordinator'])
  )
);

-- Tenant: students
create policy students_admin_coordinator_write on public.students
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

create policy students_read_related on public.students
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_access_student(id)
);

-- Tenant: guardians
create policy guardians_admin_coordinator_write on public.guardians
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

create policy guardians_read_related on public.guardians
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (
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
  )
);

-- Tenant: student_guardians
create policy student_guardians_admin_coordinator_write on public.student_guardians
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

create policy student_guardians_read_related on public.student_guardians
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (
    app_private.has_any_role(array['admin', 'director', 'coordinator'])
    or student_id = app_private.current_student_id()
    or guardian_id = app_private.current_guardian_id()
  )
);

-- Tenant: section_subjects
create policy section_subjects_admin_coordinator_write on public.section_subjects
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

create policy section_subjects_read_related on public.section_subjects
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_access_section_subject(id)
);

-- Tenant: enrollments
create policy enrollments_admin_coordinator_write on public.enrollments
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

create policy enrollments_read_related on public.enrollments
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_access_enrollment(id)
);

-- Tenant: attendance_daily
create policy attendance_daily_manage_related on public.attendance_daily
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

create policy attendance_daily_read_related on public.attendance_daily
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_access_enrollment(enrollment_id)
);

-- Tenant: attendance_class
create policy attendance_class_manage_related on public.attendance_class
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_manage_section_subject(section_subject_id)
)
with check (
  school_id = app_private.current_school_id()
  and app_private.can_manage_section_subject(section_subject_id)
);

create policy attendance_class_read_related on public.attendance_class
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_access_enrollment(enrollment_id)
  and app_private.can_access_section_subject(section_subject_id)
);

-- Tenant: grades_records
create policy grades_records_manage_related on public.grades_records
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_manage_section_subject(section_subject_id)
)
with check (
  school_id = app_private.current_school_id()
  and app_private.can_manage_section_subject(section_subject_id)
);

create policy grades_records_read_related on public.grades_records
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_access_enrollment(enrollment_id)
  and app_private.can_access_section_subject(section_subject_id)
);

-- Tenant: pedagogical_recoveries
create policy pedagogical_recoveries_manage_related on public.pedagogical_recoveries
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_manage_grade_record(grade_record_id)
)
with check (
  school_id = app_private.current_school_id()
  and app_private.can_manage_grade_record(grade_record_id)
);

create policy pedagogical_recoveries_read_related on public.pedagogical_recoveries
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.can_access_grade_record(grade_record_id)
);

-- Tenant: reports
create policy reports_admin_coordinator_write on public.reports
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'coordinator'])
);

create policy reports_read_related on public.reports
for select to authenticated
using (
  school_id = app_private.current_school_id()
  and (
    app_private.has_any_role(array['admin', 'director', 'coordinator'])
    or generated_by = app_private.current_app_user_id()
    or (student_id is not null and app_private.can_access_student(student_id))
  )
);

-- =============================================================================
-- Indexes on school_id for performance
-- =============================================================================

create index app_users_school_id_idx on public.app_users(school_id);
create index user_roles_school_id_idx on public.user_roles(school_id);
create index school_years_school_id_idx on public.school_years(school_id);
create index academic_periods_school_id_idx on public.academic_periods(school_id);
create index grades_school_id_idx on public.grades(school_id);
create index sections_school_id_idx on public.sections(school_id);
create index subjects_school_id_idx on public.subjects(school_id);
create index teachers_school_id_idx on public.teachers(school_id);
create index students_school_id_idx on public.students(school_id);
create index guardians_school_id_idx on public.guardians(school_id);
create index student_guardians_school_id_idx on public.student_guardians(school_id);
create index section_subjects_school_id_idx on public.section_subjects(school_id);
create index enrollments_school_id_idx on public.enrollments(school_id);
create index attendance_daily_school_id_idx on public.attendance_daily(school_id);
create index attendance_class_school_id_idx on public.attendance_class(school_id);
create index grades_records_school_id_idx on public.grades_records(school_id);
create index pedagogical_recoveries_school_id_idx on public.pedagogical_recoveries(school_id);
create index reports_school_id_idx on public.reports(school_id);
