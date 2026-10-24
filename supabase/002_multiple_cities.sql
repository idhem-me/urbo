-- À exécuter dans SQL Editor de votre projet Supabase.
-- Cette migration ajoute plusieurs villes sans supprimer city_saves.
create table if not exists public.cities (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 state jsonb not null check (jsonb_typeof(state) = 'object'),
 revision bigint not null default 1 check (revision > 0),
 imported_from uuid,
 legacy_source boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists cities_user_id_idx on public.cities(user_id);
create unique index if not exists cities_imported_once_idx on public.cities(user_id,imported_from) where imported_from is not null;
create unique index if not exists cities_legacy_once_idx on public.cities(user_id) where legacy_source;
alter table public.cities enable row level security;
drop policy if exists "Cities: own rows" on public.cities;
create policy "Cities: own rows" on public.cities for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.cities from public, anon, authenticated;
grant select, delete on public.cities to authenticated;
grant insert(id,user_id,state,revision,imported_from) on public.cities to authenticated;
grant update(state,revision) on public.cities to authenticated;
create or replace function public.guard_city_revision() returns trigger language plpgsql set search_path = '' as $$
begin
 if new.id <> old.id or new.user_id <> old.user_id then raise exception 'City ownership is immutable'; end if;
 if new.revision <> old.revision + 1 then raise exception 'City revision conflict' using errcode = '40001'; end if;
 new.created_at := old.created_at;
 new.updated_at := clock_timestamp();
 return new;
end;
$$;
drop trigger if exists city_revision_guard on public.cities;
create trigger city_revision_guard before update on public.cities for each row execute function public.guard_city_revision();
do $$
begin
 if to_regclass('public.city_saves') is not null then
  insert into public.cities(user_id,state,legacy_source)
  select user_id,state,true from public.city_saves on conflict do nothing;
 end if;
end;
$$;
