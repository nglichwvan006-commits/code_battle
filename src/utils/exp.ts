/**
 * Calculate required EXP for a given level
 * Formula: 100 * level^1.5
 */
export function calculateRequiredExp(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Determine level based on total EXP
 */
export function calculateLevelFromExp(totalExp: number): number {
  let level = 1;
  while (totalExp >= calculateRequiredExp(level)) {
    totalExp -= calculateRequiredExp(level);
    level++;
  }
  return level;
}

/**
 * Returns full level information for the UI
 */
export function calculateLevel(totalExp: number) {
  let level = 1;
  let remainingExp = totalExp;
  let reqExp = calculateRequiredExp(level);

  while (remainingExp >= reqExp) {
    remainingExp -= reqExp;
    level++;
    reqExp = calculateRequiredExp(level);
  }

  return {
    level,
    currentExp: remainingExp,
    requiredExp: reqExp,
    totalExp,
  };
}
