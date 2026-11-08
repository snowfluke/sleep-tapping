import { SessionSettings } from '../types';

type TempoSettings = Pick<SessionSettings, 'startBpm' | 'endBpm' | 'decelerationCurve'>;

/** Tempo in BPM at a point in the session, where progress runs from 0 to 1. */
export function tempoAt(progress: number, { startBpm, endBpm, decelerationCurve }: TempoSettings): number {
  const p = Math.max(0, Math.min(1, progress));
  const range = startBpm - endBpm;

  switch (decelerationCurve) {
    case 'stepped': {
      // Donovan's three stages: settle at the start tempo, slow to halfway, then slow again.
      const midBpm = startBpm - range * 0.5;
      if (p < 0.15) return startBpm;
      if (p < 0.65) return startBpm - (startBpm - midBpm) * ((p - 0.15) / 0.5);
      return midBpm - (midBpm - endBpm) * ((p - 0.65) / 0.35);
    }
    case 'gentle-late':
      if (p < 0.25) return startBpm;
      return startBpm - range * Math.pow((p - 0.25) / 0.75, 1.2);
    case 'smooth':
      return startBpm - range * p;
  }
}
