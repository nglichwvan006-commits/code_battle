-- =============================================
-- Seed Data
-- =============================================

-- Classes
INSERT INTO classes (id, name, language, description, icon, color, stats) VALUES
('warrior', 'Warrior', 'C++', 'Masters of performance and low-level power.', '⚔️', 'from-red-500 to-orange-500', '{"strength":9,"intelligence":6,"agility":5,"endurance":8}'),
('mage', 'Mage', 'Python', 'Wielders of elegant spells and arcane knowledge.', '🧙', 'from-blue-500 to-purple-500', '{"strength":4,"intelligence":10,"agility":7,"endurance":5}'),
('assassin', 'Assassin', 'JavaScript', 'Swift and versatile strikers.', '🗡️', 'from-yellow-400 to-amber-500', '{"strength":6,"intelligence":7,"agility":10,"endurance":4}'),
('engineer', 'Engineer', 'C#', 'Architects of robust systems.', '🔧', 'from-emerald-500 to-teal-500', '{"strength":7,"intelligence":8,"agility":5,"endurance":8}');

-- Zones
INSERT INTO zones (id, name, slug, description, order_index, required_level, icon, color, story_intro) VALUES
('beginner-village', 'Beginner Village', 'beginner-village', 'A peaceful village where every adventurer begins their journey.', 1, 1, '🏘️', '#10b981', 'Welcome, young coder! This peaceful village is where your adventure begins. Master the basics and prepare for the challenges ahead.'),
('loop-forest', 'Loop Forest', 'loop-forest', 'An enchanted forest where the trees grow in loops.', 2, 3, '🌲', '#22c55e', 'The Loop Forest is dense and mysterious. Its paths twist and repeat. Only those who understand iteration can navigate its depths.'),
('function-cave', 'Function Cave', 'function-cave', 'Deep underground caverns lit by magical functions.', 3, 5, '🕳️', '#8b5cf6', 'Deep beneath the mountains lies the Function Cave. Here, ancient functions are carved into the walls, each solving a piece of a larger puzzle.'),
('array-kingdom', 'Array Kingdom', 'array-kingdom', 'A mighty kingdom built on the power of arrays.', 4, 8, '🏰', '#3b82f6', 'The Array Kingdom stretches far and wide. Its citizens organize themselves in perfect order, and its power lies in indexed knowledge.'),
('string-desert', 'String Desert', 'string-desert', 'A vast desert where strings of sand tell stories.', 5, 12, '🏜️', '#f59e0b', 'The String Desert is vast and full of hidden patterns. Characters shift like sand, and only those who can parse the patterns will survive.');

-- Problems (Beginner Village — 10 problems)
INSERT INTO problems (zone_id, title, slug, difficulty, category, statement, input_format, output_format, constraints, sample_input, sample_output, exp_reward, gold_reward, order_index, starter_code) VALUES
('beginner-village', 'Hello World', 'hello-world', 'easy', 'basics',
 'Write a program that prints "Hello, World!" to the console.',
 'No input', 'A single line: Hello, World!', 'None',
 '', 'Hello, World!', 10, 5, 1,
 '{"python":"# Write your solution here\n","cpp":"#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n","javascript":"// Write your solution here\n","csharp":"using System;\n\nclass Program {\n    static void Main() {\n        // Write your solution here\n    }\n}\n"}'),

('beginner-village', 'Sum of Two Numbers', 'sum-two-numbers', 'easy', 'basics',
 'Given two integers A and B, calculate their sum.',
 'Two integers A and B on a single line, separated by space.',
 'A single integer — the sum of A and B.',
 '1 ≤ A, B ≤ 1000',
 '3 5', '8', 10, 5, 2,
 '{"python":"a, b = map(int, input().split())\n# Calculate and print the sum\n","cpp":"#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Calculate and print the sum\n    return 0;\n}\n","javascript":"const [a, b] = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim().split('' '').map(Number);\n// Calculate and print the sum\n","csharp":"using System;\n\nclass Program {\n    static void Main() {\n        var parts = Console.ReadLine().Split();\n        int a = int.Parse(parts[0]);\n        int b = int.Parse(parts[1]);\n        // Calculate and print the sum\n    }\n}\n"}'),

('beginner-village', 'Even or Odd', 'even-or-odd', 'easy', 'basics',
 'Given an integer N, determine if it is even or odd. Print "Even" or "Odd".',
 'A single integer N.',
 'Print "Even" if N is even, "Odd" if N is odd.',
 '-1000 ≤ N ≤ 1000',
 '4', 'Even', 10, 5, 3,
 '{"python":"n = int(input())\n# Determine even or odd\n","cpp":"#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Determine even or odd\n    return 0;\n}\n","javascript":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim());\n// Determine even or odd\n","csharp":"using System;\n\nclass Program {\n    static void Main() {\n        int n = int.Parse(Console.ReadLine());\n        // Determine even or odd\n    }\n}\n"}'),

('beginner-village', 'Maximum of Three', 'maximum-of-three', 'easy', 'basics',
 'Given three integers, find and print the maximum value.',
 'Three integers on a single line, separated by spaces.',
 'A single integer — the maximum of the three.',
 '-1000 ≤ each integer ≤ 1000',
 '3 7 2', '7', 10, 5, 4,
 '{"python":"a, b, c = map(int, input().split())\n# Find the maximum\n","cpp":"#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    // Find the maximum\n    return 0;\n}\n","javascript":"const [a, b, c] = require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim().split('' '').map(Number);\n// Find the maximum\n","csharp":"using System;\n\nclass Program {\n    static void Main() {\n        var parts = Console.ReadLine().Split();\n        int a = int.Parse(parts[0]), b = int.Parse(parts[1]), c = int.Parse(parts[2]);\n        // Find the maximum\n    }\n}\n"}'),

('beginner-village', 'Absolute Value', 'absolute-value', 'easy', 'basics',
 'Given an integer N, print its absolute value.',
 'A single integer N.',
 'The absolute value of N.',
 '-10000 ≤ N ≤ 10000',
 '-5', '5', 10, 5, 5,
 '{"python":"n = int(input())\nprint(abs(n))\n","cpp":"#include <iostream>\n#include <cmath>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    cout << abs(n) << endl;\n    return 0;\n}\n","javascript":"const n = parseInt(require(''fs'').readFileSync(''/dev/stdin'', ''utf8'').trim());\nconsole.log(Math.abs(n));\n","csharp":"using System;\n\nclass Program {\n    static void Main() {\n        int n = int.Parse(Console.ReadLine());\n        Console.WriteLine(Math.Abs(n));\n    }\n}\n"}');

-- Loop Forest Problems (5)
INSERT INTO problems (zone_id, title, slug, difficulty, category, statement, input_format, output_format, constraints, sample_input, sample_output, exp_reward, gold_reward, order_index) VALUES
('loop-forest', 'Print Numbers', 'print-numbers', 'easy', 'loops',
 'Given N, print all numbers from 1 to N, each on a new line.',
 'A single integer N.', 'Numbers from 1 to N, each on a new line.',
 '1 ≤ N ≤ 100', '5', '1\n2\n3\n4\n5', 10, 5, 1),

('loop-forest', 'Sum 1 to N', 'sum-one-to-n', 'easy', 'loops',
 'Given N, calculate the sum of all integers from 1 to N.',
 'A single integer N.', 'The sum of 1 to N.',
 '1 ≤ N ≤ 10000', '10', '55', 10, 5, 2),

('loop-forest', 'Factorial', 'factorial', 'easy', 'loops',
 'Given N, calculate N! (N factorial).',
 'A single integer N.', 'N factorial.',
 '0 ≤ N ≤ 20', '5', '120', 10, 5, 3),

('loop-forest', 'Fibonacci Number', 'fibonacci-number', 'medium', 'loops',
 'Given N, find the N-th Fibonacci number. F(0)=0, F(1)=1.',
 'A single integer N.', 'The N-th Fibonacci number.',
 '0 ≤ N ≤ 30', '7', '13', 25, 15, 4),

('loop-forest', 'Count Digits', 'count-digits', 'easy', 'loops',
 'Given a positive integer N, count the number of digits.',
 'A single positive integer N.', 'The number of digits in N.',
 '1 ≤ N ≤ 10^9', '12345', '5', 10, 5, 5);

-- Achievements
INSERT INTO achievements (name, description, icon, category, condition_type, condition_value, exp_reward, gold_reward) VALUES
('First Blood', 'Solve your first problem', '🩸', 'general', 'problems_solved', 1, 20, 10),
('Getting Started', 'Solve 5 problems', '🌱', 'general', 'problems_solved', 5, 50, 25),
('Problem Solver', 'Solve 10 problems', '💪', 'general', 'problems_solved', 10, 100, 50),
('Coding Machine', 'Solve 25 problems', '🤖', 'general', 'problems_solved', 25, 200, 100),
('Legend', 'Solve 50 problems', '👑', 'general', 'problems_solved', 50, 500, 250),
('Hot Streak', 'Maintain a 3-day streak', '🔥', 'streak', 'streak_days', 3, 30, 15),
('On Fire', 'Maintain a 7-day streak', '🔥', 'streak', 'streak_days', 7, 100, 50),
('Unstoppable', 'Maintain a 30-day streak', '💥', 'streak', 'streak_days', 30, 500, 250),
('Village Graduate', 'Complete Beginner Village', '🎓', 'zone', 'zone_complete', 1, 100, 50),
('Forest Explorer', 'Complete Loop Forest', '🌲', 'zone', 'zone_complete', 2, 150, 75),
('Bug Hunter', 'Get 5 Wrong Answers then Accepted', '🐛', 'special', 'bug_hunter', 5, 50, 25),
('Speed Runner', 'Solve a problem in under 1 minute', '⚡', 'special', 'speed_solve', 1, 30, 15),
('Polyglot', 'Solve problems in 3 different languages', '🌍', 'special', 'languages_used', 3, 100, 50),
('Gold Hoarder', 'Accumulate 1000 gold', '💰', 'wealth', 'gold_total', 1000, 50, 0),
('Boss Slayer', 'Defeat your first boss', '🐉', 'boss', 'bosses_defeated', 1, 200, 100);

-- Pets
INSERT INTO pets (name, description, icon, rarity, bonus_type, bonus_value) VALUES
('Baby Dragon', 'A tiny dragon that breathes code. Grants bonus EXP.', '🐉', 'rare', 'exp_bonus', 10),
('Cyber Fox', 'A digital fox companion. Increases gold earned.', '🦊', 'uncommon', 'gold_bonus', 15),
('Shadow Cat', 'A mysterious feline. Reduces problem difficulty perception.', '🐱', 'rare', 'hint_bonus', 5),
('Code Owl', 'A wise owl. Provides syntax hints.', '🦉', 'common', 'exp_bonus', 5),
('Phoenix Chick', 'Born from compiled code. Grants streak protection.', '🐣', 'epic', 'streak_protect', 1),
('Pixel Bunny', 'A cute bunny made of pixels. Bonus daily quest reward.', '🐰', 'common', 'quest_bonus', 10),
('Thunder Wolf', 'A wolf crackling with electricity. Speed bonus.', '🐺', 'rare', 'speed_bonus', 15),
('Crystal Turtle', 'An ancient turtle. Provides defensive coding bonuses.', '🐢', 'uncommon', 'defense_bonus', 10),
('Star Fish', 'A starfish from digital seas. Lucky drops.', '⭐', 'common', 'luck_bonus', 5),
('Void Serpent', 'A serpent from the void. Maximum power.', '🐍', 'legendary', 'exp_bonus', 25);

-- Inventory Items
INSERT INTO inventory_items (name, description, icon, rarity, type, stats) VALUES
('Wooden Sword', 'A basic sword for beginners.', '🗡️', 'common', 'weapon', '{"attack":5}'),
('Iron Shield', 'Decent protection.', '🛡️', 'common', 'armor', '{"defense":5}'),
('Magic Staff', 'A staff glowing with power.', '🪄', 'uncommon', 'weapon', '{"attack":10,"intelligence":3}'),
('Leather Boots', 'Fast and light.', '👢', 'common', 'armor', '{"agility":3}'),
('Ruby Amulet', 'Increases EXP gain.', '💎', 'rare', 'accessory', '{"exp_bonus":10}'),
('Golden Ring', 'Increases gold gain.', '💍', 'uncommon', 'accessory', '{"gold_bonus":15}'),
('Dragon Scale Armor', 'Forged from dragon scales.', '🔥', 'epic', 'armor', '{"defense":20,"endurance":5}'),
('Excalibur', 'The legendary sword.', '⚔️', 'legendary', 'weapon', '{"attack":50,"strength":10}'),
('Health Potion', 'Restores vitality.', '🧪', 'common', 'consumable', '{"heal":50}'),
('EXP Scroll', 'Doubles EXP for next problem.', '📜', 'rare', 'consumable', '{"exp_multiplier":2}');

-- Bosses
INSERT INTO bosses (zone_id, name, description, boss_type, exp_reward, gold_reward, required_completion, icon) VALUES
('beginner-village', 'Syntax Slime', 'A massive, gooey creature composed of mismatched brackets and missing semicolons.', 'mini', 150, 50, 0.5, '🦠'),
('beginner-village', 'The Compiler Golem', 'An ancient guardian made of strict rules and impenetrable stone.', 'final', 300, 150, 0.8, '🗿'),
('loop-forest', 'Infinite Loop Hydra', 'A beast whose heads regrow endlessly if not terminated properly.', 'mini', 250, 100, 0.5, '🐉'),
('loop-forest', 'O(N^2) Behemoth', 'A slow but impossibly resilient giant that crushes inefficient travelers.', 'final', 500, 250, 0.8, '👹');
