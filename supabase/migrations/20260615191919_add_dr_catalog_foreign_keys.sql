do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dr_academic_cycles_level_id_fkey') then
    alter table public.dr_academic_cycles
      add constraint dr_academic_cycles_level_id_fkey
      foreign key (level_id) references public.dr_academic_levels(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'grades_academic_level_id_fkey') then
    alter table public.grades
      add constraint grades_academic_level_id_fkey
      foreign key (academic_level_id) references public.dr_academic_levels(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'grades_academic_cycle_id_fkey') then
    alter table public.grades
      add constraint grades_academic_cycle_id_fkey
      foreign key (academic_cycle_id) references public.dr_academic_cycles(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'grades_default_modality_id_fkey') then
    alter table public.grades
      add constraint grades_default_modality_id_fkey
      foreign key (default_modality_id) references public.dr_modalities(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'enrollments_academic_level_id_fkey') then
    alter table public.enrollments
      add constraint enrollments_academic_level_id_fkey
      foreign key (academic_level_id) references public.dr_academic_levels(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'enrollments_academic_cycle_id_fkey') then
    alter table public.enrollments
      add constraint enrollments_academic_cycle_id_fkey
      foreign key (academic_cycle_id) references public.dr_academic_cycles(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'enrollments_modality_id_fkey') then
    alter table public.enrollments
      add constraint enrollments_modality_id_fkey
      foreign key (modality_id) references public.dr_modalities(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'enrollments_subsystem_id_fkey') then
    alter table public.enrollments
      add constraint enrollments_subsystem_id_fkey
      foreign key (subsystem_id) references public.dr_subsystems(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dr_evaluation_rules_school_id_fkey') then
    alter table public.dr_evaluation_rules
      add constraint dr_evaluation_rules_school_id_fkey
      foreign key (school_id) references public.schools(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dr_evaluation_rules_level_id_fkey') then
    alter table public.dr_evaluation_rules
      add constraint dr_evaluation_rules_level_id_fkey
      foreign key (level_id) references public.dr_academic_levels(id);
  end if;
end $$;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dr_evaluation_rules_modality_id_fkey') then
    alter table public.dr_evaluation_rules
      add constraint dr_evaluation_rules_modality_id_fkey
      foreign key (modality_id) references public.dr_modalities(id);
  end if;
end $$;
