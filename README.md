# Code Adventure RPG

A gamified coding learning platform where you solve programming problems to progress through a fantasy world, defeat bosses, and collect loot.

## Features

- **RPG Progression:** Create characters, choose classes (Warrior, Mage, Assassin, Engineer), and level up.
- **Interactive Map:** Unlock zones, complete problems, and face epic bosses.
- **Code Execution:** Real-time problem solving with Monaco Editor and Judge0 integration.
- **Loot & Equipment:** Collect and equip items of varying rarities with stat boosts.
- **Pets:** Unlock companions that provide passive bonuses (EXP, Gold, etc.).
- **Achievements & Streaks:** Maintain daily streaks and unlock achievements for rewards.
- **Leaderboard:** Compete globally on EXP, Level, Problems Solved, and Streaks.

## Tech Stack

- **Frontend:** Next.js 16 (App Router, Turbopack), React 19
- **Styling & UI:** Tailwind CSS v4, Shadcn UI, Framer Motion
- **State Management:** Zustand, TanStack Query
- **Database & Auth:** Supabase (PostgreSQL, RLS)
- **Code Execution:** Judge0 CE
- **Testing:** Vitest, React Testing Library

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env.local` file with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_JUDGE0_URL=your_judge0_url
   JUDGE0_API_KEY=your_judge0_api_key (optional)
   ```
4. **Setup Supabase Database:**
   Run the SQL scripts in `supabase/migrations/` sequentially in your Supabase SQL Editor:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_seed_data.sql`
5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## Folder Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable UI components (Shadcn, Framer Motion animations).
- `src/features/`: Domain-specific components (Problems, Character, etc.).
- `src/lib/`: Utility libraries (Supabase client).
- `src/stores/`: Zustand global state.
- `supabase/migrations/`: Database schema, RLS, and seed data.

## Deployment

Deploy on Vercel by connecting your GitHub repository. Ensure that all environment variables are properly set in the Vercel project settings.

## License

MIT License
