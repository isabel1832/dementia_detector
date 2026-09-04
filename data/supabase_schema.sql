-- ==============================================================================
-- Dementia Detector: Supabase Database Schema
-- Run this SQL in your Supabase Project -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Profiles (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('player', 'caregiver', 'professional')) DEFAULT 'player',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Players (Supports both email users and 6-digit access code players)
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  access_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Caregiver Connections (Links caregivers/clinicians to players)
CREATE TABLE IF NOT EXISTS public.caregiver_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'Family',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(caregiver_id, player_id)
);

-- 4. Game Sessions / Assessment Results
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL CHECK (game_type IN ('MEMORY_MATCH', 'PICTURE_RECALL', 'SEQUENCE')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_seconds INTEGER NOT NULL,
  score INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  hints_used INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Player Accessibility & UI Settings
CREATE TABLE IF NOT EXISTS public.player_settings (
  player_id UUID PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
  text_size TEXT DEFAULT 'standard',
  contrast TEXT DEFAULT 'standard',
  sound_effects BOOLEAN DEFAULT TRUE,
  music BOOLEAN DEFAULT FALSE,
  voice_instructions BOOLEAN DEFAULT TRUE,
  repeat_instructions BOOLEAN DEFAULT TRUE,
  voice_speed TEXT DEFAULT 'normal',
  reduced_motion BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_player_id ON public.game_sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON public.game_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_players_access_code ON public.players(access_code);
CREATE INDEX IF NOT EXISTS idx_caregiver_connections_caregiver ON public.caregiver_connections(caregiver_id);

-- Disable Row Level Security (RLS) initially for simplified direct API access,
-- or enable standard public read/write policies:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon/authenticated roles for these application tables
DROP POLICY IF EXISTS "Allow all for profiles" ON public.profiles;
CREATE POLICY "Allow all for profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for players" ON public.players;
CREATE POLICY "Allow all for players" ON public.players FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for caregiver_connections" ON public.caregiver_connections;
CREATE POLICY "Allow all for caregiver_connections" ON public.caregiver_connections FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for game_sessions" ON public.game_sessions;
CREATE POLICY "Allow all for game_sessions" ON public.game_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for player_settings" ON public.player_settings;
CREATE POLICY "Allow all for player_settings" ON public.player_settings FOR ALL USING (true) WITH CHECK (true);
