alter table public.schools
  add column if not exists regional_code text,
  add column if not exists regional_name text,
  add column if not exists district_code text,
  add column if not exists district_name text;

update public.schools
set district_code = nullif(split_part(district, ' - ', 1), ''),
    district_name = nullif(substring(district from position(' - ' in district) + 3), ''),
    regional_code = left(nullif(split_part(district, ' - ', 1), ''), 2)
where district is not null and district like '% - %';

update public.schools
set regional_name = case regional_code
  when '01' then 'BARAHONA' when '02' then 'SAN JUAN DE LA MAGUANA'
  when '03' then 'AZUA' when '04' then 'SAN CRISTOBAL'
  when '05' then 'SAN PEDRO DE MACORIS' when '06' then 'LA VEGA'
  when '07' then 'SAN FRANCISCO DE MACORIS' when '08' then 'SANTIAGO'
  when '09' then 'MAO' when '10' then 'SANTO DOMINGO'
  when '11' then 'PUERTO PLATA' when '12' then 'HIGUEY'
  when '13' then 'MONTE CRISTI' when '14' then 'NAGUA'
  when '15' then 'SANTO DOMINGO' when '16' then 'COTUI'
  when '17' then 'MONTE PLATA' when '18' then 'BAHORUCO'
  else regional_name end
where regional_code is not null;

-- Retira de las búsquedas los duplicados incompletos, conservando sus filas
-- para no romper posibles relaciones históricas.
update public.schools duplicate
set status = 'archived'
where duplicate.status = 'active'
  and nullif(trim(duplicate.district), '') is null
  and exists (
    select 1 from public.schools canonical
    where canonical.id <> duplicate.id and canonical.status = 'active'
      and lower(trim(canonical.name)) = lower(trim(duplicate.name))
      and nullif(trim(canonical.district), '') is not null
  );

create index if not exists schools_regional_code_idx on public.schools (regional_code);
create index if not exists schools_district_code_idx on public.schools (district_code);
