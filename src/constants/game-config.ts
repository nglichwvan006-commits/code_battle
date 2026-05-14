export const GAME_CONFIG = {
  EXP_REWARDS: {
    easy: 10,
    medium: 25,
    hard: 50,
    boss: 200,
  },
  GOLD_REWARDS: {
    easy: 5,
    medium: 15,
    hard: 30,
    boss: 100,
  },
  LEVEL_FORMULA_BASE: 100,
  LEVEL_FORMULA_EXPONENT: 1.5,
  BOSS_UNLOCK_THRESHOLD: 0.7,
  MAX_DAILY_QUESTS: 3,
  STREAK_MILESTONES: [3, 7, 14, 30, 60, 100, 365],
} as const;

export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  "cpp": 54,
  "python": 71,
  "javascript": 63,
  "csharp": 51,
};
