-- Disposable Postgres fixture only. Verify the additive migration and historical ownership.
do $$
begin
  assert (select count(*) from public.schedule_entries) = 4;
  assert not exists (select 1 from public.schedule_entries where needs_placement), 'Existing classes remain placed';
end $$;

begin;
update public.time_slots set status = 'inactive' where id = (
  select time_slot_id from public.schedule_entries where id = '11111111-1111-4111-8111-111111111111'
);
update public.schedule_entries set needs_placement = true where id = '11111111-1111-4111-8111-111111111111';
select set_config('test.school_id','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
select set_config('test.user_id','11111111-1111-4111-8111-111111111111',true);
set local role authenticated;
do $$
declare affected integer;
begin
  assert (select count(*) from public.schedule_entries where needs_placement) = 1, 'Owner can still see a pending class on an inactive block';
  assert (select count(*) from public.schedule_entries) = 1, 'Historical ownership still hides other teachers';
  update public.schedule_entries set needs_placement = true where id = '22222222-2222-4222-8222-222222222222';
  get diagnostics affected = row_count;
  assert affected = 0, 'Cannot change another teacher placement state';
end $$;
rollback;
