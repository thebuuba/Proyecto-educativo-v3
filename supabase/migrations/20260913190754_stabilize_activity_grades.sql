-- Conserva la edicion mas reciente si historicamente se crearon duplicados.
with ranked_activity_grades as (
  select
    id,
    row_number() over (
      partition by enrollment_id, evaluation_activity_id
      order by updated_at desc, created_at desc, id desc
    ) as duplicate_position
  from public.grades_records
  where evaluation_activity_id is not null
)
delete from public.grades_records
where id in (
  select id
  from ranked_activity_grades
  where duplicate_position > 1
);

create unique index if not exists grades_records_enrollment_activity_key
  on public.grades_records (enrollment_id, evaluation_activity_id);
