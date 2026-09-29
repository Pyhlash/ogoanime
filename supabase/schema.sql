create table if not exists public.library (
 user_id uuid not null references auth.users(id) on delete cascade,
 anime_id bigint not null,
 status text check (status in ('watching','watched','planned')),
 favorite boolean not null default false,
 following boolean not null default false,
 episode integer not null default 0 check (episode >= 0),
 position double precision not null default 0 check (position >= 0),
 anime jsonb not null,
 updated_at timestamptz not null default now(),
 primary key(user_id,anime_id)
);
alter table public.library enable row level security;
create policy "Read own library" on public.library for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own library" on public.library for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own library" on public.library for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own library" on public.library for delete to authenticated using ((select auth.uid()) = user_id);
grant select,insert,update,delete on public.library to authenticated;

create table if not exists public.watch_history (
 user_id uuid not null references auth.users(id) on delete cascade,
 anime_id bigint not null,
 episode integer not null check (episode > 0),
 position double precision not null default 0 check (position >= 0),
 anime jsonb not null,
 watched_at timestamptz not null default now(),
 primary key(user_id, anime_id, episode)
);
alter table public.watch_history enable row level security;
create policy "Read own watch history" on public.watch_history for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own watch history" on public.watch_history for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own watch history" on public.watch_history for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own watch history" on public.watch_history for delete to authenticated using ((select auth.uid()) = user_id);
grant select,insert,update,delete on public.watch_history to authenticated;
