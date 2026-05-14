import { create } from "zustand";
import type { Character, DailyQuest, GameStats } from "@/types/game";

interface GameState {
  character: Character | null;
  setCharacter: (character: Character | null) => void;
  dailyQuests: DailyQuest[];
  setDailyQuests: (quests: DailyQuest[]) => void;
  stats: GameStats | null;
  setStats: (stats: GameStats) => void;
}

export const useGameStore = create<GameState>((set) => ({
  character: null,
  setCharacter: (character) => set({ character }),
  dailyQuests: [],
  setDailyQuests: (dailyQuests) => set({ dailyQuests }),
  stats: null,
  setStats: (stats) => set({ stats }),
}));
