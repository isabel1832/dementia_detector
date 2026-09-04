-- Memory & Puzzle app schema
-- Run this once in the Supabase dashboard: Project > SQL Editor > New query > paste > Run.
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE.

create extension if not exists pgcrypto;

-- One row per account holder (caregiver or professional; also used for players
-- who sign up with their own email/password instead of an access code).
-- id matches the corresponding auth.users id.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('player', 'caregiver', 'professional')),
  created_at timestamptz not null default now()
);

-- One row per player profile (the person playing the games), whether or not
-- they have their own login. user_id is set when the player signed up
-- themselves; it stays null for players created by a caregiver and reached
-- only via a 6-digit access code.
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  first_name text not null,
  last_name text,
  access_code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.caregiver_connections (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.profiles(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  relationship text,
  created_at timestamptz not null default now(),
  unique (caregiver_id, player_id)
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  game_type text not null check (game_type in ('MEMORY_MATCH', 'PICTURE_RECALL', 'SEQUENCE')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  duration_seconds integer not null,
  score integer not null,
  accuracy integer not null,
  attempts integer not null,
  hints_used integer not null default 0,
  errors integer not null default 0,
  status text not null check (status in ('COMPLETED', 'SKIPPED', 'EXITED_EARLY')),
  created_at timestamptz not null default now()
);

create index if not exists game_sessions_player_id_created_at_idx
  on public.game_sessions (player_id, created_at desc);

create table if not exists public.player_settings (
  player_id uuid primary key references public.players(id) on delete cascade,
  text_size text not null default 'standard',
  contrast text not null default 'standard',
  sound_effects boolean not null default true,
  music boolean not null default false,
  voice_instructions boolean not null default true,
  repeat_instructions boolean not null default true,
  voice_speed text not null default 'normal',
  reduced_motion boolean not null default false
);

-- All reads/writes go through this app's server-side API routes using the
-- Supabase service role key, which bypasses RLS by design. RLS is still
-- enabled on every table (with no permissive policies) so the anon/public
-- key can never read or write these tables directly if it were ever used
-- from the browser by mistake.
alter table public.profiles enable row level security;
alter table public.players enable row level security;
alter table public.caregiver_connections enable row level security;
alter table public.game_sessions enable row level security;
alter table public.player_settings enable row level security;

-- Auto-create a profile row whenever someone signs up through Supabase Auth.
-- Expects `name` and `role` to be passed as user metadata at signUp time.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce(new.raw_user_meta_data->>'role', 'player')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
