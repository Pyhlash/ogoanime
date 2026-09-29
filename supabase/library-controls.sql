alter table public.library
  add column if not exists skipped_episodes integer[] not null default '{}';
alter table public.library
  add column if not exists dismissed boolean not null default false;
alter table public.library
  add column if not exists following boolean not null default false;
