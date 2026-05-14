import { describe, it, expect } from 'vitest';
import { calculateRequiredExp, calculateLevelFromExp } from './exp';

describe('EXP calculations', () => {
  it('should calculate required EXP for level 1 correctly', () => {
    // 100 * 1^1.5 = 100
    expect(calculateRequiredExp(1)).toBe(100);
  });

  it('should calculate required EXP for level 2 correctly', () => {
    // 100 * 2^1.5 ≈ 282
    expect(calculateRequiredExp(2)).toBe(282);
  });

  it('should determine level correctly based on total EXP', () => {
    expect(calculateLevelFromExp(50)).toBe(1); // 50 < 100 (level 1 requirement)
    expect(calculateLevelFromExp(100)).toBe(2); // exactly enough for level 2
    expect(calculateLevelFromExp(382)).toBe(3); // 100 + 282
  });
});
