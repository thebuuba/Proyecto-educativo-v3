-- Run through scripts/test-personal-schedule-migration.mjs, never on a real project.
do $$
begin
  assert (select count(*) from public.schedule_entries) = 4, 'No class may be lost or duplicated';
  assert (select count(*) from public.time_slots where owner_user_id is null) = 4, 'Original structures must remain intact';
  assert (select count(*) from public.time_slots where owner_user_id is not null) = 7, 'Every identified owner gets independent blocks';
  assert (select count(*) from public.schedule_journeys where owner_user_id is not null) = 5;
  assert (select count(*) from public.time_slots s
    join public.schedule_journeys morning on morning.owner_user_id = s.owner_user_id and morning.sequence = 1
    join public.schedule_journeys afternoon on afternoon.owner_user_id = s.owner_user_id and afternoon.sequence = 2
    where s.block_source = 'INTER_JOURNEY_GAP'
      and s.source_key = morning.id::text || ':' || afternoon.id::text
      and ((s.day_of_week = 1 and s.block_type = 'LUNCH') or (s.day_of_week = 2 and s.block_type = 'PAUSE'))
  ) = 4, 'Gap keys and daily overrides must follow the copied journey IDs';
  assert not exists (
    select 1 from public.schedule_entries e join public.time_slots s on s.id = e.time_slot_id
    where e.id in ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222')
      and s.owner_user_id is distinct from e.id
  ), 'Subject teacher must retain the original class ID on their own block';
  assert (select s.owner_user_id from public.schedule_entries e join public.time_slots s on s.id = e.time_slot_id
    where e.id = '66666666-6666-4666-8666-666666666666') = '33333333-3333-4333-8333-333333333333', 'Sole staff account retains its classes';
  assert (select s.owner_user_id from public.schedule_entries e join public.time_slots s on s.id = e.time_slot_id
    where e.id = '55555555-5555-4555-8555-555555555555') is null, 'Ambiguous ownership must never be guessed';
end $$;

select set_config('test.school_id','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',false);
select set_config('test.user_id','11111111-1111-4111-8111-111111111111',false);
-- Capture foreign IDs as the privileged setup role; hidden rows must stay hidden.
select set_config('test.foreign_journey',(select id::text from public.schedule_journeys where owner_user_id = '22222222-2222-4222-8222-222222222222' and sequence = 1),false);
select set_config('test.foreign_slot',(select id::text from public.time_slots where owner_user_id = '22222222-2222-4222-8222-222222222222' and block_type = 'CLASS'),false);
set role authenticated;
do $$
declare affected int;
begin
  assert (select count(*) from public.time_slots) = 3, 'Teacher sees only their blocks';
  assert (select count(*) from public.schedule_journeys) = 2, 'Teacher sees only their journeys';
  assert (select count(*) from public.schedule_entries) = 1, 'Teacher sees only their classes';
  update public.time_slots set name = 'Forbidden' where id = current_setting('test.foreign_slot')::uuid;
  get diagnostics affected = row_count;
  assert affected = 0, 'Cannot modify another teacher block';
  delete from public.schedule_entries where id = '22222222-2222-4222-8222-222222222222';
  get diagnostics affected = row_count;
  assert affected = 0, 'Cannot delete another teacher class';
  begin
    insert into public.time_slots (school_id,owner_user_id,journey_id)
    values (app_private.current_school_id(),app_private.current_app_user_id(),current_setting('test.foreign_journey')::uuid);
    raise exception 'Foreign journey was accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.schedule_entries (school_id,section_subject_id,time_slot_id)
    values (app_private.current_school_id(),'11111111-1111-4111-8111-111111111111',current_setting('test.foreign_slot')::uuid);
    raise exception 'Foreign block was accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.time_slots set owner_user_id = '22222222-2222-4222-8222-222222222222';
    raise exception 'Owner reassignment was accepted';
  exception when insufficient_privilege then null;
  end;
  update public.time_slots set name = 'Mi clase';
  get diagnostics affected = row_count;
  assert affected = 3, 'Teacher can modify own blocks';
end $$;
reset role;
