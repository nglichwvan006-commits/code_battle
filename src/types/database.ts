export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      characters: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          class_id: string;
          level: number;
          exp: number;
          gold: number;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          class_id: string;
          level?: number;
          exp?: number;
          gold?: number;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          class_id?: string;
          level?: number;
          exp?: number;
          gold?: number;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          language: string;
          description: string;
          icon: string;
          color: string;
          stats: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          language: string;
          description: string;
          icon: string;
          color: string;
          stats?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          language?: string;
          description?: string;
          icon?: string;
          color?: string;
          stats?: Json;
          created_at?: string;
        };
      };
      zones: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          order_index: number;
          required_level: number;
          icon: string;
          color: string;
          story_intro: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          order_index: number;
          required_level?: number;
          icon: string;
          color: string;
          story_intro?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          order_index?: number;
          required_level?: number;
          icon?: string;
          color?: string;
          story_intro?: string | null;
          created_at?: string;
        };
      };
      problems: {
        Row: {
          id: string;
          zone_id: string;
          title: string;
          slug: string;
          difficulty: "easy" | "medium" | "hard";
          category: string;
          statement: string;
          input_format: string;
          output_format: string;
          constraints: string;
          sample_input: string;
          sample_output: string;
          hidden_tests: Json;
          starter_code: Json;
          exp_reward: number;
          gold_reward: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          zone_id: string;
          title: string;
          slug: string;
          difficulty: "easy" | "medium" | "hard";
          category: string;
          statement: string;
          input_format: string;
          output_format: string;
          constraints: string;
          sample_input: string;
          sample_output: string;
          hidden_tests?: Json;
          starter_code?: Json;
          exp_reward?: number;
          gold_reward?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          zone_id?: string;
          title?: string;
          slug?: string;
          difficulty?: "easy" | "medium" | "hard";
          category?: string;
          statement?: string;
          input_format?: string;
          output_format?: string;
          constraints?: string;
          sample_input?: string;
          sample_output?: string;
          hidden_tests?: Json;
          starter_code?: Json;
          exp_reward?: number;
          gold_reward?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          character_id: string;
          problem_id: string;
          code: string;
          language: string;
          status: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compilation_error";
          runtime_ms: number | null;
          memory_kb: number | null;
          output: string | null;
          error: string | null;
          test_results: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          character_id: string;
          problem_id: string;
          code: string;
          language: string;
          status?: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compilation_error";
          runtime_ms?: number | null;
          memory_kb?: number | null;
          output?: string | null;
          error?: string | null;
          test_results?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          character_id?: string;
          problem_id?: string;
          code?: string;
          language?: string;
          status?: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compilation_error";
          runtime_ms?: number | null;
          memory_kb?: number | null;
          output?: string | null;
          error?: string | null;
          test_results?: Json | null;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          category: string;
          condition_type: string;
          condition_value: number;
          exp_reward: number;
          gold_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          category: string;
          condition_type: string;
          condition_value: number;
          exp_reward?: number;
          gold_reward?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          category?: string;
          condition_type?: string;
          condition_value?: number;
          exp_reward?: number;
          gold_reward?: number;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          character_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          character_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          character_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          type: "weapon" | "armor" | "accessory" | "consumable";
          stats: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          type: "weapon" | "armor" | "accessory" | "consumable";
          stats?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
          type?: "weapon" | "armor" | "accessory" | "consumable";
          stats?: Json;
          created_at?: string;
        };
      };
      user_inventory: {
        Row: {
          id: string;
          character_id: string;
          item_id: string;
          equipped: boolean;
          quantity: number;
          acquired_at: string;
        };
        Insert: {
          id?: string;
          character_id: string;
          item_id: string;
          equipped?: boolean;
          quantity?: number;
          acquired_at?: string;
        };
        Update: {
          id?: string;
          character_id?: string;
          item_id?: string;
          equipped?: boolean;
          quantity?: number;
          acquired_at?: string;
        };
      };
      pets: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          bonus_type: string;
          bonus_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
          bonus_type: string;
          bonus_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
          bonus_type?: string;
          bonus_value?: number;
          created_at?: string;
        };
      };
      user_pets: {
        Row: {
          id: string;
          character_id: string;
          pet_id: string;
          is_active: boolean;
          acquired_at: string;
        };
        Insert: {
          id?: string;
          character_id: string;
          pet_id: string;
          is_active?: boolean;
          acquired_at?: string;
        };
        Update: {
          id?: string;
          character_id?: string;
          pet_id?: string;
          is_active?: boolean;
          acquired_at?: string;
        };
      };
      bosses: {
        Row: {
          id: string;
          zone_id: string;
          name: string;
          description: string;
          problem_id: string;
          boss_type: "mini" | "final";
          exp_reward: number;
          gold_reward: number;
          item_reward_id: string | null;
          required_completion: number;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          zone_id: string;
          name: string;
          description: string;
          problem_id: string;
          boss_type: "mini" | "final";
          exp_reward?: number;
          gold_reward?: number;
          item_reward_id?: string | null;
          required_completion?: number;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          zone_id?: string;
          name?: string;
          description?: string;
          problem_id?: string;
          boss_type?: "mini" | "final";
          exp_reward?: number;
          gold_reward?: number;
          item_reward_id?: string | null;
          required_completion?: number;
          icon?: string;
          created_at?: string;
        };
      };
      boss_progress: {
        Row: {
          id: string;
          character_id: string;
          boss_id: string;
          defeated: boolean;
          defeated_at: string | null;
        };
        Insert: {
          id?: string;
          character_id: string;
          boss_id: string;
          defeated?: boolean;
          defeated_at?: string | null;
        };
        Update: {
          id?: string;
          character_id?: string;
          boss_id?: string;
          defeated?: boolean;
          defeated_at?: string | null;
        };
      };
      streaks: {
        Row: {
          id: string;
          character_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          character_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          character_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_quests: {
        Row: {
          id: string;
          character_id: string;
          date: string;
          quests: Json;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          character_id: string;
          date: string;
          quests: Json;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          character_id?: string;
          date?: string;
          quests?: Json;
          completed?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      difficulty: "easy" | "medium" | "hard";
      rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
      item_type: "weapon" | "armor" | "accessory" | "consumable";
      boss_type: "mini" | "final";
      submission_status: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "runtime_error" | "compilation_error";
      user_role: "user" | "admin";
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
