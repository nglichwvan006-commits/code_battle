export interface ClassInfo {
  id: string;
  name: string;
  language: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  stats: {
    strength: number;
    intelligence: number;
    agility: number;
    endurance: number;
  };
}

export const CHARACTER_CLASSES: ClassInfo[] = [
  {
    id: "warrior",
    name: "Warrior",
    language: "C++",
    description: "Masters of performance and low-level power. Warriors wield C++ to conquer the toughest algorithmic challenges.",
    icon: "⚔️",
    color: "from-red-500 to-orange-500",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    stats: { strength: 9, intelligence: 6, agility: 5, endurance: 8 },
  },
  {
    id: "mage",
    name: "Mage",
    language: "Python",
    description: "Wielders of elegant spells. Mages use Python's expressiveness to solve problems with powerful incantations.",
    icon: "🧙",
    color: "from-blue-500 to-purple-500",
    gradient: "linear-gradient(135deg, #3b82f6, #a855f7)",
    stats: { strength: 4, intelligence: 10, agility: 7, endurance: 5 },
  },
  {
    id: "assassin",
    name: "Assassin",
    language: "JavaScript",
    description: "Swift and versatile strikers. Assassins harness JavaScript's flexibility to overcome any challenge.",
    icon: "🗡️",
    color: "from-yellow-400 to-amber-500",
    gradient: "linear-gradient(135deg, #facc15, #f59e0b)",
    stats: { strength: 6, intelligence: 7, agility: 10, endurance: 4 },
  },
  {
    id: "engineer",
    name: "Engineer",
    language: "C#",
    description: "Architects of robust systems. Engineers leverage C#'s structured power to build elegant solutions.",
    icon: "🔧",
    color: "from-emerald-500 to-teal-500",
    gradient: "linear-gradient(135deg, #10b981, #14b8a6)",
    stats: { strength: 7, intelligence: 8, agility: 5, endurance: 8 },
  },
];
