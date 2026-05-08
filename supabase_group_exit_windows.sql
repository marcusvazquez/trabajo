create extension if not exists pgcrypto;

create table if not exists public.group_exit_windows (
  id uuid primary key default gen_random_uuid(),
  group_code text not null,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists idx_group_exit_windows_group_day
  on public.group_exit_windows (group_code, day_of_week);

alter table public.group_exit_windows enable row level security;

drop policy if exists "group_exit_windows_read" on public.group_exit_windows;
create policy "group_exit_windows_read"
on public.group_exit_windows
for select
to anon, authenticated
using (true);

drop policy if exists "group_exit_windows_write" on public.group_exit_windows;
create policy "group_exit_windows_write"
on public.group_exit_windows
for all
to anon, authenticated
using (true)
with check (true);

insert into public.group_exit_windows (id, group_code, day_of_week, start_time, end_time, enabled)
values
  ('11111111-1111-1111-1111-1111111111aa', '4DPGM', 5, '13:30', '19:40', true),
  ('22222222-2222-2222-2222-2222222222bb', '4CPGM', 5, '13:30', '19:40', true)
on conflict (id) do nothing;
