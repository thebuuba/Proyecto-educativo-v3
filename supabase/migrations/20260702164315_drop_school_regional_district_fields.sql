alter table public.schools
  drop column if exists regional_code,
  drop column if exists regional_name,
  drop column if exists district_code,
  drop column if exists district_name;
