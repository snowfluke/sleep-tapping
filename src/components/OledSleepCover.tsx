import React from 'react';
import { BreathState } from '../types';
import { BeatDots } from './BeatDots';
import { formatClock } from '../lib/formatClock';

interface OledSleepCoverProps {
  onExit: () => void;
  timeRemaining: number;
  currentBpm: number;
  currentSide: 'left' | 'right';
  breathState: BreathState;
  isPlaying: boolean;
}

/** Pure black screen with dim ember text, so an OLED phone gives off almost no light on the nightstand. */
export const OledSleepCover: React.FC<OledSleepCoverProps> = ({
  onExit,
  timeRemaining,
  currentBpm,
  currentSide,
  breathState,
  isPlaying,
}) => {
  return (
    <button
      type="button"
      onClick={onExit}
      aria-label="Leave nightstand mode"
      className="fixed inset-0 z-50 flex cursor-pointer touch-manipulation select-none flex-col items-center justify-between bg-black p-8 focus-visible:outline-none"
    >
      <span className="text-xs text-ember/40">Nightstand mode, tap to wake</span>

      <span className="flex flex-col items-center gap-6">
        <span className="flex size-32 flex-col items-center justify-center gap-2 rounded-full border border-ember/20">
          <span className="font-mono text-3xl tabular-nums text-ember/60">{formatClock(timeRemaining)}</span>
          <span className="flex items-center gap-2 font-mono text-xs tabular-nums text-ember/40">
            {isPlaying && <BeatDots side={currentSide} dim />}
            {currentBpm} BPM
          </span>
        </span>
        {isPlaying && <span className="text-sm text-ember/40">{breathState.instruction}</span>}
      </span>

      <span className="text-xs text-ember/30">Sound and vibration keep running</span>
    </button>
  );
};
