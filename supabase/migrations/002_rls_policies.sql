-- =============================================
-- Row Level Security Policies
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bosses ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Public profiles readable" ON profiles FOR SELECT USING (TRUE);

-- Classes (public read)
CREATE POLICY "Classes are public" ON classes FOR SELECT USING (TRUE);

-- Zones (public read)
CREATE POLICY "Zones are public" ON zones FOR SELECT USING (TRUE);

-- Problems (public read)
CREATE POLICY "Problems are public" ON problems FOR SELECT USING (TRUE);

-- Achievements (public read)
CREATE POLICY "Achievements are public" ON achievements FOR SELECT USING (TRUE);

-- Inventory Items (public read)
CREATE POLICY "Items are public" ON inventory_items FOR SELECT USING (TRUE);

-- Pets (public read)
CREATE POLICY "Pets are public" ON pets FOR SELECT USING (TRUE);

-- Bosses (public read)
CREATE POLICY "Bosses are public" ON bosses FOR SELECT USING (TRUE);

-- Characters
CREATE POLICY "Users can view own character" ON characters FOR SELECT
  USING (profile_id = auth.uid());
CREATE POLICY "Users can insert own character" ON characters FOR INSERT
  WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can update own character" ON characters FOR UPDATE
  USING (profile_id = auth.uid());
CREATE POLICY "Public character view for leaderboard" ON characters FOR SELECT USING (TRUE);

-- Submissions
CREATE POLICY "Users can view own submissions" ON submissions FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));
CREATE POLICY "Users can insert own submissions" ON submissions FOR INSERT
  WITH CHECK (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));

-- User Achievements
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT
  WITH CHECK (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));

-- User Inventory
CREATE POLICY "Users can view own inventory" ON user_inventory FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));
CREATE POLICY "Users can manage own inventory" ON user_inventory FOR ALL
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));

-- User Pets
CREATE POLICY "Users can view own pets" ON user_pets FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));
CREATE POLICY "Users can manage own pets" ON user_pets FOR ALL
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));

-- Boss Progress
CREATE POLICY "Users can view own boss progress" ON boss_progress FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));
CREATE POLICY "Users can manage own boss progress" ON boss_progress FOR ALL
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));

-- Streaks
CREATE POLICY "Users can view own streaks" ON streaks FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));
CREATE POLICY "Users can manage own streaks" ON streaks FOR ALL
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));

-- Daily Quests
CREATE POLICY "Users can view own daily quests" ON daily_quests FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));
CREATE POLICY "Users can manage own daily quests" ON daily_quests FOR ALL
  USING (character_id IN (SELECT id FROM characters WHERE profile_id = auth.uid()));
