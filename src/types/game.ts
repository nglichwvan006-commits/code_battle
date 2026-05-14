import type { Tables } from "./database";

export type Character = Tables<"characters"> & {
  class?: Tables<"classes">;
};

export type Problem = Tables<"problems"> & {
  zone?: Tables<"zones">;
};

export type Submission = Tables<"submissions">;

export type Achievement = Tables<"achievements">;

export type InventoryItem = Tables<"inventory_items">;

export type Pet = Tables<"pets">;

export type Zone = Tables<"zones">;

export type Boss = Tables<"bosses">;

export interface LevelInfo {
  level: number;
  currentExp: number;
  requiredExp: number;
  totalExp: number;
  progress: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  type: "solve_problems" | "earn_exp" | "defeat_boss";
  targetValue: number;
  currentValue: number;
  completed: boolean;
  reward: {
    exp: number;
    gold: number;
  };
}

export interface GameStats {
  problemsSolved: number;
  totalSubmissions: number;
  bossesDefeated: number;
  achievementsUnlocked: number;
  currentStreak: number;
  longestStreak: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
}

export interface SubmissionResult {
  status: Submission["status"];
  testCases: TestCase[];
  passedCount: number;
  totalCount: number;
  runtimeMs: number | null;
  memoryKb: number | null;
  error: string | null;
  expEarned: number;
  goldEarned: number;
}
