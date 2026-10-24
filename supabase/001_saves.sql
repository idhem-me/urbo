-- À appliquer quand le projet Supabase sera créé. Pas encore utilisé par le prototype.
create table public.city_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  constraint state_object check (jsonb_typeof(state) = 'object')
);
alter table public.city_saves enable row level security;
create policy "Read own city" on public.city_saves for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own city" on public.city_saves for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own city" on public.city_saves for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- V2 : fonction serveur de sauvegarde avec contrôle de revision et updated_at serveur.
-- Ne pas utiliser l'état client comme autorité pour un classement ou une économie multijoueur.
