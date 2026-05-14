-- =============================================
-- Code Adventure RPG — Initial Schema
-- =============================================

-- Drop existing tables to avoid conflicts during reset
DROP TABLE IF EXISTS daily_quests CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS boss_progress CASCADE;
DROP TABLE IF EXISTS bosses CASCADE;
DROP TABLE IF EXISTS user_pets CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS user_inventory CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS problems CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS difficulty CASCADE;
DROP TYPE IF EXISTS rarity CASCADE;
DROP TYPE IF EXISTS item_type CASCADE;
DROP TYPE IF EXISTS boss_type CASCADE;
DROP TYPE IF EXISTS submission_status CASCADE;

-- Enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE item_type AS ENUM ('weapon', 'armor', 'accessory', 'consumable');
CREATE TYPE boss_type AS ENUM ('mini', 'final');
CREATE TYPE submission_status AS ENUM (
  'pending', 'running', 'accepted', 'wrong_answer',
  'time_limit', 'runtime_error', 'compilation_error'
);

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class_id TEXT NOT NULL REFERENCES classes(id),
  level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 100,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- Zones
CREATE TABLE zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL,
  required_level INTEGER DEFAULT 1,
  icon TEXT NOT NULL DEFAULT '🗺️',
  color TEXT NOT NULL DEFAULT '#8b5cf6',
  story_intro TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Problems
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id TEXT NOT NULL REFERENCES zones(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  difficulty difficulty NOT NULL DEFAULT 'easy',
  category TEXT NOT NULL DEFAULT 'general',
  statement TEXT NOT NULL,
  input_format TEXT NOT NULL DEFAULT '',
  output_format TEXT NOT NULL DEFAULT '',
  constraints TEXT NOT NULL DEFAULT '',
  sample_input TEXT NOT NULL DEFAULT '',
  sample_output TEXT NOT NULL DEFAULT '',
  hidden_tests JSONB DEFAULT '[]',
  starter_code JSONB DEFAULT '{}',
  exp_reward INTEGER DEFAULT 10,
  gold_reward INTEGER DEFAULT 5,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id),
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status submission_status DEFAULT 'pending',
  runtime_ms REAL,
  memory_kb INTEGER,
  output TEXT,
  error TEXT,
  test_results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  category TEXT NOT NULL DEFAULT 'general',
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL DEFAULT 1,
  exp_reward INTEGER DEFAULT 0,
  gold_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, achievement_id)
);

-- Inventory
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📦',
  rarity rarity DEFAULT 'common',
  type item_type DEFAULT 'accessory',
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  equipped BOOLEAN DEFAULT FALSE,
  quantity INTEGER DEFAULT 1,
  acquired_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pets
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🐾',
  rarity rarity DEFAULT 'common',
  bonus_type TEXT NOT NULL DEFAULT 'exp',
  bonus_value INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id),
  is_active BOOLEAN DEFAULT FALSE,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, pet_id)
);

-- Bosses
CREATE TABLE bosses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id TEXT NOT NULL REFERENCES zones(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  problem_id UUID REFERENCES problems(id),
  boss_type boss_type DEFAULT 'mini',
  exp_reward INTEGER DEFAULT 200,
  gold_reward INTEGER DEFAULT 100,
  item_reward_id UUID REFERENCES inventory_items(id),
  required_completion REAL DEFAULT 0.7,
  icon TEXT NOT NULL DEFAULT '👹',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE boss_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  boss_id UUID NOT NULL REFERENCES bosses(id),
  defeated BOOLEAN DEFAULT FALSE,
  defeated_at TIMESTAMPTZ,
  UNIQUE(character_id, boss_id)
);

-- Streaks
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily quests
CREATE TABLE daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  quests JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, date)
);

-- Indexes
CREATE INDEX idx_characters_profile ON characters(profile_id);
CREATE INDEX idx_problems_zone ON problems(zone_id);
CREATE INDEX idx_problems_slug ON problems(slug);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_submissions_character ON submissions(character_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_user_achievements_character ON user_achievements(character_id);
CREATE INDEX idx_user_inventory_character ON user_inventory(character_id);
CREATE INDEX idx_user_pets_character ON user_pets(character_id);
CREATE INDEX idx_boss_progress_character ON boss_progress(character_id);
CREATE INDEX idx_daily_quests_character_date ON daily_quests(character_id, date);

-- Function: Award EXP and Gold
CREATE OR REPLACE FUNCTION award_exp_gold(
  p_character_id UUID,
  p_exp INTEGER,
  p_gold INTEGER
) RETURNS VOID AS $$
DECLARE
  v_current_exp INTEGER;
  v_current_level INTEGER;
  v_new_exp INTEGER;
  v_new_level INTEGER;
  v_required_exp INTEGER;
BEGIN
  SELECT exp, level INTO v_current_exp, v_current_level
  FROM characters WHERE id = p_character_id;

  v_new_exp := v_current_exp + p_exp;
  v_new_level := v_current_level;

  LOOP
    v_required_exp := FLOOR(100 * POWER(v_new_level, 1.5));
    IF v_new_exp >= v_required_exp THEN
      v_new_exp := v_new_exp - v_required_exp;
      v_new_level := v_new_level + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  UPDATE characters
  SET exp = v_new_exp, level = v_new_level, gold = gold + p_gold, updated_at = NOW()
  WHERE id = p_character_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_characters_updated_at ON characters;
CREATE TRIGGER tr_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_problems_updated_at ON problems;
CREATE TRIGGER tr_problems_updated_at BEFORE UPDATE ON problems FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tr_streaks_updated_at ON streaks;
CREATE TRIGGER tr_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
