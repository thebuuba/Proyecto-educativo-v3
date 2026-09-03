alter table public.enrollments
  add column list_number integer;

with numbered as (
  select
    enrollment.id,
    row_number() over (
      partition by enrollment.school_id, enrollment.school_year_id, enrollment.grade_id, enrollment.section_id
      order by student.last_name, student.first_name, enrollment.created_at, enrollment.id
    ) as position
  from public.enrollments as enrollment
  join public.students as student on student.id = enrollment.student_id
)
update public.enrollments as enrollment
set list_number = numbered.position
from numbered
where enrollment.id = numbered.id;

alter table public.enrollments
  add constraint enrollments_list_number_positive
  check (list_number is null or list_number > 0);

create unique index enrollments_active_list_number_unique
  on public.enrollments (school_id, school_year_id, grade_id, section_id, list_number)
  where status = 'active' and list_number is not null;
