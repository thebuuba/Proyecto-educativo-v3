-- AulaBase opera como espacio personal. Completa las asignaciones antiguas solo
-- cuando la escuela tiene exactamente un docente activo vinculado a una cuenta.
update public.section_subjects as section_subject
set teacher_id = (
  select teacher.id
  from public.teachers as teacher
  where teacher.school_id = section_subject.school_id
    and teacher.user_id is not null
    and teacher.status = 'active'
  order by teacher.created_at asc, teacher.id asc
  limit 1
)
where section_subject.teacher_id is null
  and 1 = (
    select count(*)
    from public.teachers as teacher
    where teacher.school_id = section_subject.school_id
      and teacher.user_id is not null
      and teacher.status = 'active'
  );
