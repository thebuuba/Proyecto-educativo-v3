drop policy if exists app_backend_full_access on public.teacher_journal_entries;
create policy app_backend_full_access on public.teacher_journal_entries
  for all to app_backend using (true) with check (true);

drop policy if exists app_backend_full_access on public.teacher_journal_students;
create policy app_backend_full_access on public.teacher_journal_students
  for all to app_backend using (true) with check (true);
