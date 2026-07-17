alter table public.section_subjects
  add column if not exists appearance_color text,
  add column if not exists appearance_icon text;

alter table public.section_subjects
  add constraint section_subjects_appearance_color_format
  check (appearance_color is null or appearance_color ~ '^#[0-9A-Fa-f]{6}$');
