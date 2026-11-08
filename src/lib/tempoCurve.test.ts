import { describe, expect, test } from 'bun:test';
import { tempoAt } from './tempoCurve';

const base = { startBpm: 68, endBpm: 36 };

describe('tempoAt', () => {
  test.each(['smooth', 'stepped', 'gentle-late'] as const)('%s starts at startBpm and ends at endBpm', (curve) => {
    const cfg = { ...base, decelerationCurve: curve };
    expect(tempoAt(0, cfg)).toBe(68);
    expect(tempoAt(1, cfg)).toBeCloseTo(36);
  });

  test.each(['smooth', 'stepped', 'gentle-late'] as const)('%s never speeds up', (curve) => {
    const cfg = { ...base, decelerationCurve: curve };
    for (let i = 1; i <= 100; i++) {
      expect(tempoAt(i / 100, cfg)).toBeLessThanOrEqual(tempoAt((i - 1) / 100, cfg));
    }
  });

  test('stepped holds the start tempo, then reaches halfway at 65%', () => {
    const cfg = { ...base, decelerationCurve: 'stepped' as const };
    expect(tempoAt(0.1, cfg)).toBe(68);
    expect(tempoAt(0.65, cfg)).toBeCloseTo(52);
  });

  test('clamps progress outside 0 to 1', () => {
    const cfg = { ...base, decelerationCurve: 'smooth' as const };
    expect(tempoAt(-1, cfg)).toBe(68);
    expect(tempoAt(2, cfg)).toBe(36);
  });
});
