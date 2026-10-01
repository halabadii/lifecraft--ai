-- LifeCraft AI cloud persistence
-- Run this once in your Supabase SQL editor.

create table if not exists public.life_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.life_states enable row level security;

drop policy if exists "Users can read their own LifeCraft state" on public.life_states;
create policy "Users can read their own LifeCraft state"
on public.life_states for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own LifeCraft state" on public.life_states;
create policy "Users can insert their own LifeCraft state"
on public.life_states for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own LifeCraft state" on public.life_states;
create policy "Users can update their own LifeCraft state"
on public.life_states for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
