import React from 'react';
import { Wind } from 'lucide-react';
import { BreathState, BreathingMode } from '../types';

interface BreathingPacerProps {
  breathState: BreathState;
  breathingMode: BreathingMode;
  isPlaying: boolean;
  announcement: string;
}

const MODE_LABEL: Record<Exclude<BreathingMode, 'off'>, string> = {
  'jim-4-4': '4-4 breath',
  'relax-4-7-8': '4-7-8 breath',
  'box-4-4-4-4': 'Box breath',
};

const PHASE_LABEL: Record<BreathState['phase'], string> = {
  inhale: 'In',
  hold: 'Hold',
  exhale: 'Out',
  pause: 'Pause',
};

export const BreathingPacer: React.FC<BreathingPacerProps> = ({ breathState, breathingMode, isPlaying, announcement }) => {
  if (breathingMode === 'off') {
    return <p className="text-center text-sm text-ink-2">{announcement}</p>;
  }

  const { phase, count, totalCounts, instruction } = breathState;

  let scale = 1;
  if (isPlaying) {
    if (phase === 'inhale') scale = 1 + (count / totalCounts) * 0.35;
    else if (phase === 'hold') scale = 1.35;
    else if (phase === 'exhale') scale = 1.35 - (count / totalCounts) * 0.35;
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="min-h-5 text-center text-sm text-ink-2">{isPlaying ? instruction : announcement}</p>

      <div className="relative flex size-32 items-center justify-center">
        <div
          className="absolute inset-2 rounded-full border border-line transition-transform duration-500 ease-soft"
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className={`flex size-22 flex-col items-center justify-center rounded-full border bg-night-2 transition-[transform,border-color] duration-500 ease-soft ${
            isPlaying && phase === 'inhale' ? 'border-ember/50' : 'border-line'
          }`}
          style={{ transform: `scale(${scale})` }}
        >
          <Wind className="mb-1 size-4 text-ink-3" strokeWidth={1.5} />
          {isPlaying ? (
            <>
              <span className="font-mono text-xl font-medium tabular-nums leading-none text-ink-1">{count}</span>
              <span className="mt-1 text-xs text-ink-3">{PHASE_LABEL[phase]}</span>
            </>
          ) : (
            <span className="text-xs text-ink-2">{MODE_LABEL[breathingMode]}</span>
          )}
        </div>
      </div>
    </div>
  );
};
