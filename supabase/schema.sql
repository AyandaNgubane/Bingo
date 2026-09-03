-- Run this once in your Supabase project's SQL editor (Project -> SQL Editor -> New query).

create extension if not exists pgcrypto;

create table if not exists rooms (
  id text primary key,
  mode text not null,
  content jsonb,
  grid_size int not null default 5,
  free_space boolean not null default true,
  win_pattern text not null default 'line',
  calling_mode text not null default 'auto',
  num_players int not null,
  status text not null default 'lobby',
  called_items jsonb not null default '[]',
  call_order jsonb not null default '[]',
  winner_id text,
  winner_name text,
  created_at timestamptz not null default now()
);

-- Safe to re-run: adds the column if you set this project up before manual
-- calling mode was added, does nothing if it's already there.
alter table rooms add column if not exists calling_mode text not null default 'auto';

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references rooms(id) on delete cascade,
  name text not null,
  board jsonb not null default '[]',
  joined_at timestamptz not null default now()
);

alter table rooms enable row level security;
alter table players enable row level security;

-- This is a casual party game with no accounts, so access is scoped only by
-- knowledge of the room code rather than per-user auth. Don't put sensitive
-- data in room content.
drop policy if exists "public read rooms" on rooms;
create policy "public read rooms" on rooms for select using (true);
drop policy if exists "public insert rooms" on rooms;
create policy "public insert rooms" on rooms for insert with check (true);
drop policy if exists "public update rooms" on rooms;
create policy "public update rooms" on rooms for update using (true);

drop policy if exists "public read players" on players;
create policy "public read players" on players for select using (true);
drop policy if exists "public insert players" on players;
create policy "public insert players" on players for insert with check (true);
drop policy if exists "public update players" on players;
create policy "public update players" on players for update using (true);

-- Enable realtime broadcasts for both tables
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table players;
