-- Dominican Republic academic domain additions.
-- Keeps existing tables compatible while adding normalized catalogs and
-- institution-level settings needed for public/private/semiofficial schools.

-- =============================================================================
-- 1. Institutional configuration
-- =============================================================================

alter table public.schools
  add column if not exists sector text not null default 'private',
  add column if not exists regional_code text,
  add column if not exists regional_name text,
  add column if not exists district_code text,
  add column if not exists district_name text,
  add column if not exists center_code text,
  add column if not exists school_shift text not null default 'extended',
  add column if not exists primary_modality text not null default 'general',
  add column if not exists enabled_subsystems text[] not null default array['regular']::text[],
  add column if not exists official_exports_enabled boolean not null default true;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'schools_sector_check'
  ) then
    alter table public.schools
      add constraint schools_sector_check
      check (sector in ('public', 'private', 'semiofficial'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'schools_shift_check'
  ) then
    alter table public.schools
      add constraint schools_shift_check
      check (school_shift in ('morning', 'afternoon', 'night', 'extended', 'full_day'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'schools_primary_modality_check'
  ) then
    alter table public.schools
      add constraint schools_primary_modality_check
      check (primary_modality in ('general', 'academic', 'technical_professional', 'arts'));
  end if;
end;
$$;

alter table public.school_years
  add column if not exists period_scheme text not null default 'trimester',
  add column if not exists period_count smallint not null default 3,
  add column if not exists calendar_source text not null default 'school',
  add column if not exists instructional_days smallint,
  add column if not exists student_weeks smallint,
  add column if not exists teacher_weeks smallint;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'school_years_period_count_positive'
  ) then
    alter table public.school_years
      add constraint school_years_period_count_positive check (period_count > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'school_years_period_scheme_check'
  ) then
    alter table public.school_years
      add constraint school_years_period_scheme_check
      check (period_scheme in ('trimester', 'semester', 'quarter', 'custom'));
  end if;
end;
$$;

-- =============================================================================
-- 2. Reference catalogs
-- =============================================================================

create table if not exists public.dr_academic_levels (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  sequence smallint not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dr_academic_cycles (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.dr_academic_levels(id) on update cascade on delete restrict,
  code text not null unique,
  name text not null,
  sequence smallint not null,
  grade_sequence_from smallint,
  grade_sequence_to smallint,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dr_modalities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  applies_from_grade_sequence smallint,
  applies_to_grade_sequence smallint,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dr_subsystems (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dr_competencies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dr_evaluation_rules (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on update cascade on delete cascade,
  level_id uuid references public.dr_academic_levels(id) on update cascade on delete restrict,
  modality_id uuid references public.dr_modalities(id) on update cascade on delete restrict,
  name text not null,
  min_passing_percent numeric(5,2) not null default 65,
  max_score numeric(5,2) not null default 100,
  period_scheme text not null default 'trimester',
  recovery_enabled boolean not null default true,
  promotion_requires_all_subjects boolean not null default true,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dr_evaluation_rules_min_passing_percent check (min_passing_percent between 0 and 100),
  constraint dr_evaluation_rules_max_score_positive check (max_score > 0)
);

alter table public.dr_academic_levels enable row level security;
alter table public.dr_academic_cycles enable row level security;
alter table public.dr_modalities enable row level security;
alter table public.dr_subsystems enable row level security;
alter table public.dr_competencies enable row level security;
alter table public.dr_evaluation_rules enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'dr_academic_levels',
    'dr_academic_cycles',
    'dr_modalities',
    'dr_subsystems',
    'dr_competencies',
    'dr_evaluation_rules'
  ]
  loop
    if not exists (
      select 1 from pg_trigger where tgname = tbl || '_set_updated_at'
    ) then
      execute format(
        'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
        tbl || '_set_updated_at',
        tbl
      );
    end if;
  end loop;
end;
$$;

drop policy if exists dr_catalogs_read_levels on public.dr_academic_levels;
create policy dr_catalogs_read_levels on public.dr_academic_levels
for select to authenticated using (status = 'active');

drop policy if exists dr_catalogs_read_cycles on public.dr_academic_cycles;
create policy dr_catalogs_read_cycles on public.dr_academic_cycles
for select to authenticated using (status = 'active');

drop policy if exists dr_catalogs_read_modalities on public.dr_modalities;
create policy dr_catalogs_read_modalities on public.dr_modalities
for select to authenticated using (status = 'active');

drop policy if exists dr_catalogs_read_subsystems on public.dr_subsystems;
create policy dr_catalogs_read_subsystems on public.dr_subsystems
for select to authenticated using (status = 'active');

drop policy if exists dr_catalogs_read_competencies on public.dr_competencies;
create policy dr_catalogs_read_competencies on public.dr_competencies
for select to authenticated using (status = 'active');

drop policy if exists dr_evaluation_rules_read on public.dr_evaluation_rules;
create policy dr_evaluation_rules_read on public.dr_evaluation_rules
for select to authenticated
using (
  school_id is null
  or school_id = app_private.current_school_id()
);

drop policy if exists dr_evaluation_rules_admin_write on public.dr_evaluation_rules;
create policy dr_evaluation_rules_admin_write on public.dr_evaluation_rules
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'director', 'coordinator'])
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'director', 'coordinator'])
);

drop policy if exists schools_read_authenticated on public.schools;
drop policy if exists schools_read_current_school on public.schools;
create policy schools_read_current_school on public.schools
for select to authenticated
using (
  id = app_private.current_school_id()
  and status = 'active'
);

create unique index if not exists dr_evaluation_rules_global_unique_idx
  on public.dr_evaluation_rules (
    level_id,
    coalesce(modality_id, '00000000-0000-0000-0000-000000000000'::uuid),
    period_scheme
  )
  where school_id is null;

create unique index if not exists dr_evaluation_rules_school_unique_idx
  on public.dr_evaluation_rules (
    school_id,
    level_id,
    coalesce(modality_id, '00000000-0000-0000-0000-000000000000'::uuid),
    period_scheme
  )
  where school_id is not null;

insert into public.dr_academic_levels (code, name, sequence) values
  ('inicial', 'Nivel Inicial', 1),
  ('primario', 'Nivel Primario', 2),
  ('secundario', 'Nivel Secundario', 3)
on conflict (code) do update set name = excluded.name, sequence = excluded.sequence;

insert into public.dr_academic_cycles (level_id, code, name, sequence, grade_sequence_from, grade_sequence_to)
select l.id, v.code, v.name, v.sequence, v.grade_from, v.grade_to
	from (
	  values
	    ('inicial', 'inicial_primer_ciclo', 'Primer Ciclo de Inicial', 1, null::smallint, null::smallint),
	    ('inicial', 'inicial_segundo_ciclo', 'Segundo Ciclo de Inicial', 2, -2::smallint, 0::smallint),
	    ('primario', 'primario_primer_ciclo', 'Primer Ciclo de Primaria', 3, 1::smallint, 3::smallint),
	    ('primario', 'primario_segundo_ciclo', 'Segundo Ciclo de Primaria', 4, 4::smallint, 6::smallint),
	    ('secundario', 'secundario_primer_ciclo', 'Primer Ciclo de Secundaria', 5, 7::smallint, 9::smallint),
	    ('secundario', 'secundario_segundo_ciclo', 'Segundo Ciclo de Secundaria', 6, 10::smallint, 12::smallint)
) as v(level_code, code, name, sequence, grade_from, grade_to)
join public.dr_academic_levels l on l.code = v.level_code
on conflict (code) do update
set name = excluded.name,
    sequence = excluded.sequence,
    grade_sequence_from = excluded.grade_sequence_from,
    grade_sequence_to = excluded.grade_sequence_to;

insert into public.dr_modalities (code, name, applies_from_grade_sequence, applies_to_grade_sequence) values
  ('general', 'Modalidad General/Académica', 10, 12),
  ('academic', 'Modalidad Académica', 10, 12),
  ('technical_professional', 'Modalidad Técnico-Profesional', 10, 12),
  ('arts', 'Modalidad en Artes', 10, 12)
on conflict (code) do update
set name = excluded.name,
    applies_from_grade_sequence = excluded.applies_from_grade_sequence,
    applies_to_grade_sequence = excluded.applies_to_grade_sequence;

insert into public.dr_subsystems (code, name) values
  ('regular', 'Educación Regular'),
  ('adults', 'Educación de Personas Jóvenes y Adultas'),
  ('prepara', 'PREPARA'),
  ('special', 'Educación Especial')
on conflict (code) do update set name = excluded.name;

insert into public.dr_competencies (code, name, description) values
  ('ethical_citizenship', 'Ética y Ciudadana', 'Convivencia democrática, ciudadanía responsable y compromiso social.'),
  ('communicative', 'Comunicativa', 'Comprensión y producción oral, escrita y multimodal.'),
  ('logical_creative_critical', 'Pensamiento Lógico, Creativo y Crítico', 'Análisis, argumentación, creatividad y toma de decisiones.'),
  ('problem_solving', 'Resolución de Problemas', 'Identificación, modelado y solución de situaciones del contexto.'),
  ('scientific_technological', 'Científica y Tecnológica', 'Indagación científica y uso crítico de tecnología.'),
  ('environmental_health', 'Ambiental y de la Salud', 'Cuidado del ambiente, bienestar y vida saludable.'),
  ('personal_spiritual', 'Desarrollo Personal y Espiritual', 'Identidad, autoestima, valores y proyecto de vida.')
on conflict (code) do update set name = excluded.name, description = excluded.description;

insert into public.dr_evaluation_rules (
  school_id,
  level_id,
  modality_id,
  name,
  min_passing_percent,
  max_score,
  period_scheme,
  recovery_enabled,
  promotion_requires_all_subjects
)
select null, l.id, null, 'Regla base ' || l.name, 65, 100, 'trimester', true, true
from public.dr_academic_levels l
where not exists (
  select 1
  from public.dr_evaluation_rules r
  where r.school_id is null
    and r.level_id = l.id
    and r.modality_id is null
    and r.period_scheme = 'trimester'
);

-- =============================================================================
-- 3. Link existing operational data to catalogs
-- =============================================================================

alter table public.grades
  add column if not exists academic_level_id uuid references public.dr_academic_levels(id) on update cascade on delete restrict,
  add column if not exists academic_cycle_id uuid references public.dr_academic_cycles(id) on update cascade on delete restrict,
  add column if not exists default_modality_id uuid references public.dr_modalities(id) on update cascade on delete restrict;

update public.grades g
set academic_level_id = l.id
from public.dr_academic_levels l
where g.academic_level_id is null
  and lower(coalesce(g.level, '')) in (
    replace(l.code, 'primario', 'primario'),
    replace(l.code, 'secundario', 'secundario'),
    replace(l.code, 'inicial', 'inicial')
  );

update public.grades g
set academic_level_id = l.id
from public.dr_academic_levels l
where g.academic_level_id is null
  and (
    lower(g.name) like '%primaria%'
    or lower(g.name) like '%primario%'
  )
  and l.code = 'primario';

update public.grades g
set academic_level_id = l.id
from public.dr_academic_levels l
where g.academic_level_id is null
  and lower(g.name) like '%secundaria%'
  and l.code = 'secundario';

update public.grades g
set academic_cycle_id = c.id
from public.dr_academic_cycles c
where g.academic_cycle_id is null
  and g.sequence between c.grade_sequence_from and c.grade_sequence_to;

update public.grades g
set default_modality_id = m.id
from public.dr_modalities m
where g.default_modality_id is null
  and g.sequence between coalesce(m.applies_from_grade_sequence, g.sequence) and coalesce(m.applies_to_grade_sequence, g.sequence)
  and m.code = 'general';

alter table public.enrollments
  add column if not exists academic_level_id uuid references public.dr_academic_levels(id) on update cascade on delete restrict,
  add column if not exists academic_cycle_id uuid references public.dr_academic_cycles(id) on update cascade on delete restrict,
  add column if not exists modality_id uuid references public.dr_modalities(id) on update cascade on delete restrict,
  add column if not exists subsystem_id uuid references public.dr_subsystems(id) on update cascade on delete restrict,
  add column if not exists academic_status text not null default 'active',
  add column if not exists is_repeating boolean not null default false,
  add column if not exists promotion_status text,
  add column if not exists final_condition text,
  add column if not exists transfer_notes text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'enrollments_academic_status_check'
  ) then
    alter table public.enrollments
      add constraint enrollments_academic_status_check
      check (academic_status in ('active', 'promoted', 'repeating', 'withdrawn', 'transferred', 'graduated'));
  end if;
end;
$$;

update public.enrollments e
set academic_level_id = g.academic_level_id,
    academic_cycle_id = g.academic_cycle_id,
    modality_id = g.default_modality_id,
    subsystem_id = s.id
from public.grades g
cross join public.dr_subsystems s
where e.grade_id = g.id
  and s.code = 'regular'
  and (
    e.academic_level_id is null
    or e.academic_cycle_id is null
    or e.modality_id is null
    or e.subsystem_id is null
  );

alter table public.planning_entries
  add column if not exists fundamental_competence_id uuid references public.dr_competencies(id) on update cascade on delete set null,
  add column if not exists evidence text not null default '',
  add column if not exists evaluation_instruments text not null default '';

create index if not exists grades_academic_level_id_idx on public.grades(academic_level_id);
create index if not exists grades_academic_cycle_id_idx on public.grades(academic_cycle_id);
create index if not exists enrollments_academic_level_id_idx on public.enrollments(academic_level_id);
create index if not exists enrollments_modality_id_idx on public.enrollments(modality_id);
create index if not exists planning_entries_fundamental_competence_id_idx
  on public.planning_entries(fundamental_competence_id);

-- Recreate yearly view after the catalog additions so deployments that already
-- applied the prior migration get the corrected passing calculation too.
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
  gr.updated_at,
  gr.enrollment_id,
  gr.school_id
from public.grades_records gr
join public.enrollments e on e.id = gr.enrollment_id
join public.section_subjects ss on ss.id = gr.section_subject_id
left join public.pedagogical_recoveries pr
  on pr.grade_record_id = gr.id
  and pr.status = 'published'
where gr.status = 'published';

create or replace view public.student_yearly_averages
with (security_invoker = true)
as
select
  d.student_id,
  d.school_year_id,
  d.grade_id,
  d.section_id,
  d.subject_id,
  round(
    sum(d.effective_percent * d.weight) / nullif(sum(d.weight), 0),
    2
  ) as yearly_average_percent,
  count(distinct d.academic_period_id) as period_count,
  bool_and(d.effective_percent >= coalesce(school_rule.min_passing_percent, global_rule.min_passing_percent, 65)) as all_periods_passing,
  coalesce(max(school_rule.min_passing_percent), max(global_rule.min_passing_percent), 65)::numeric(5,2) as min_passing_percent
from public.student_grade_details d
join public.enrollments e on e.id = d.enrollment_id
left join public.dr_evaluation_rules school_rule
  on school_rule.school_id = e.school_id
  and school_rule.level_id is not distinct from e.academic_level_id
  and school_rule.modality_id is not distinct from e.modality_id
  and school_rule.period_scheme = 'trimester'
  and school_rule.status = 'active'
left join public.dr_evaluation_rules global_rule
  on global_rule.school_id is null
  and global_rule.level_id is not distinct from e.academic_level_id
  and global_rule.modality_id is null
  and global_rule.period_scheme = 'trimester'
  and global_rule.status = 'active'
group by
  d.student_id,
  d.school_year_id,
  d.grade_id,
  d.section_id,
  d.subject_id;
