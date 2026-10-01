-- Los períodos anteriores eran compartidos por todos los días. Crear un bloque
-- por día conserva cada asignación y permite editar la estructura semanal.
do $$
declare
  legacy_school record;
  legacy_slot record;
  calendar_day integer;
  legacy_journey_id uuid;
  replacement_id uuid;
begin
  lock table public.time_slots, public.schedule_entries, public.schedule_journeys
    in share row exclusive mode;

  for legacy_school in
    select slots.school_id,
           min(slots.start_time) as start_time,
           max(slots.end_time) as end_time,
           coalesce((select max(j.sequence) from public.schedule_journeys j
                     where j.school_id = slots.school_id), 0) + 1 as sequence
    from public.time_slots slots
    where slots.day_of_week is null and slots.journey_id is null
    group by slots.school_id
  loop
    insert into public.schedule_journeys
      (school_id, name, kind, start_time, end_time, sequence)
    values
      (legacy_school.school_id, 'Horario anterior', 'CUSTOM',
       legacy_school.start_time, legacy_school.end_time, legacy_school.sequence)
    returning id into legacy_journey_id;

    for legacy_slot in
      select * from public.time_slots
      where school_id = legacy_school.school_id
        and day_of_week is null and journey_id is null
    loop
      for calendar_day in
        select d.day_of_week from generate_series(1, 5) as d(day_of_week)
        union
        select e.day_of_week from public.schedule_entries e
        where e.time_slot_id = legacy_slot.id
      loop
        insert into public.time_slots
          (school_id, name, start_time, end_time, sequence, day_of_week,
           block_type, block_source, source_key, journey_id, status,
           created_at, updated_at)
        values
          (legacy_slot.school_id, legacy_slot.name, legacy_slot.start_time,
           legacy_slot.end_time, legacy_slot.sequence, calendar_day,
           legacy_slot.block_type, legacy_slot.block_source, legacy_slot.source_key,
           legacy_journey_id, legacy_slot.status,
           legacy_slot.created_at, legacy_slot.updated_at)
        returning id into replacement_id;

        update public.schedule_entries
        set time_slot_id = replacement_id
        where time_slot_id = legacy_slot.id and day_of_week = calendar_day;
      end loop;

      delete from public.time_slots where id = legacy_slot.id;
    end loop;
  end loop;
end $$;
