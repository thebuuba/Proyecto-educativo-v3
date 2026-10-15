begin;
insert into public.schools (id,name,slug) values ('10000000-0000-4000-8000-000000000001','Synthetic school','billing-test');
insert into auth.users (id) values ('20000000-0000-4000-8000-000000000001'),('20000000-0000-4000-8000-000000000002');
insert into public.app_users (id,auth_user_id,full_name,email,school_id) values
 ('30000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Synthetic Teacher One','billing-one@example.invalid','10000000-0000-4000-8000-000000000001'),
 ('30000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','Synthetic Teacher Two','billing-two@example.invalid','10000000-0000-4000-8000-000000000001');
insert into public.user_roles (user_id,role_id,school_id)
 select u.id,r.id,u.school_id from public.app_users u cross join public.roles r
 where r.key='teacher' and u.email like 'billing-%@example.invalid';
insert into public.billing_plans (id,code,name) values ('40000000-0000-4000-8000-000000000001','docente-completo','Docente Completo');
insert into public.billing_accounts (id,user_id) values
 ('50000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001'),
 ('50000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002');
do $$ begin
 if not (app_private.billing_effective_access('30000000-0000-4000-8000-000000000001')->>'allowed')::boolean then raise exception 'Flags off must preserve access'; end if;
end $$;
update public.billing_runtime_settings set enforce_access = true;
insert into public.billing_courtesies (id,account_id,plan_id,starts_at,reason,granted_by) values
 ('60000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',now()-interval '1 day','Synthetic administrative courtesy','30000000-0000-4000-8000-000000000002');
do $$ begin
 if app_private.billing_effective_access('30000000-0000-4000-8000-000000000001')->>'reason' <> 'courtesy' then raise exception 'Courtesy not honored'; end if;
 if (app_private.billing_effective_access('30000000-0000-4000-8000-000000000002')->>'allowed')::boolean then raise exception 'School peer gained another owner coverage'; end if;
end $$;
update public.app_users set status='inactive' where id='30000000-0000-4000-8000-000000000001';
do $$ begin
 if (app_private.billing_effective_access('30000000-0000-4000-8000-000000000001')->>'allowed')::boolean then raise exception 'Suspension must override courtesy'; end if;
end $$;
update public.app_users set status='active' where id='30000000-0000-4000-8000-000000000001';
update public.billing_courtesies set status='revoked',revoked_at=now(),revocation_reason='Synthetic revocation' where id='60000000-0000-4000-8000-000000000001';
insert into public.billing_trials (account_id,plan_id,starts_at,ends_at) values
 ('50000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',now()-interval '1 day',now());
do $$ begin
 if (app_private.billing_effective_access('30000000-0000-4000-8000-000000000001')->>'allowed')::boolean then raise exception 'Trial end must be exclusive and revocation effective'; end if;
 begin
  insert into public.billing_trials (account_id,plan_id,ends_at) values ('50000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',now()+interval '14 days');
  raise exception 'Duplicate trial accepted';
 exception when unique_violation then null; end;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000002',true);
do $$ begin
 begin
  perform 1 from public.billing_courtesies;
  raise exception 'Client read commercial table directly';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.billing_admins (user_id) values ('30000000-0000-4000-8000-000000000002');
  raise exception 'Client elevated commercial permissions';
 exception when insufficient_privilege then null; end;
 if app_private.billing_current_user_allowed() then raise exception 'auth.uid mapping used wrong AppUser'; end if;
end $$;
reset role;
rollback;
