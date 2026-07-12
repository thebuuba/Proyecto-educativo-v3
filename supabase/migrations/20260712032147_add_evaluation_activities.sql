alter table public.grades_records
  add column if not exists evaluation_activity_id uuid;

create table if not exists public.evaluation_instruments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  name text not null,
  type text not null,
  description text not null default '',
  criteria jsonb not null default '[]'::jsonb,
  max_score numeric(8, 2) not null default 100,
  generated_by_ai boolean not null default false,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evaluation_activities (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  school_year_id uuid not null references public.school_years(id),
  section_subject_id uuid not null references public.section_subjects(id),
  academic_period_id uuid not null references public.academic_periods(id),
  planning_entry_id uuid references public.planning_entries(id),
  instrument_id uuid references public.evaluation_instruments(id),
  competency_block_id text not null,
  planning_moment text,
  name text not null,
  description text not null default '',
  activity_type text not null default 'individual',
  max_score numeric(8, 2) not null default 100,
  activity_date date,
  evaluation_technique text not null default '',
  student_role text not null default '',
  teacher_role text not null default '',
  evidence_instructions text not null default '',
  observations text not null default '',
  source text not null default 'grading',
  status public.record_status not null default 'active',
  created_by uuid references public.app_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evaluation_activity_evidences (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.evaluation_activities(id),
  school_id uuid not null references public.schools(id),
  file_name text not null,
  file_url text not null,
  file_type text not null default '',
  file_size integer,
  notes text not null default '',
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evaluation_activity_groups (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.evaluation_activities(id),
  school_id uuid not null references public.schools(id),
  name text not null,
  score numeric(8, 2),
  notes text not null default '',
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evaluation_activity_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.evaluation_activity_groups(id),
  school_id uuid not null references public.schools(id),
  enrollment_id uuid not null references public.enrollments(id),
  individual_score numeric(8, 2),
  notes text not null default '',
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, enrollment_id)
);

alter table public.grades_records
  add constraint grades_records_evaluation_activity_id_fkey
  foreign key (evaluation_activity_id) references public.evaluation_activities(id);

create index if not exists evaluation_instruments_school_type_idx
  on public.evaluation_instruments(school_id, type);

create index if not exists evaluation_activities_school_subject_period_idx
  on public.evaluation_activities(school_id, section_subject_id, academic_period_id);

create index if not exists evaluation_activities_planning_entry_idx
  on public.evaluation_activities(planning_entry_id);

create index if not exists evaluation_activities_competency_block_idx
  on public.evaluation_activities(competency_block_id);

create index if not exists evaluation_activity_evidences_activity_idx
  on public.evaluation_activity_evidences(activity_id);

create index if not exists evaluation_activity_groups_activity_idx
  on public.evaluation_activity_groups(activity_id);

create index if not exists evaluation_activity_group_members_enrollment_idx
  on public.evaluation_activity_group_members(enrollment_id);

create index if not exists grades_records_evaluation_activity_idx
  on public.grades_records(evaluation_activity_id);
