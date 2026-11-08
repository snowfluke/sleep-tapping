import React from 'react';
import { Moon, EyeOff } from 'lucide-react';
import { BreathState } from '../types';

interface OledSleepCoverProps {
  onExit: () => void;
  timeRemaining: number;
  currentBpm: number;
  currentSide: 'left' | 'right';
  breathState: BreathState;
  isPlaying: boolean;
}

export const OledSleepCover: React.FC<OledSleepCoverProps> = ({
  onExit,
  timeRemaining,
  currentBpm,
  currentSide,
  breathState,
  isPlaying,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      onClick={onExit}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-8 select-none cursor-pointer touch-manipulation"
      title="Tap anywhere to wake screen"
    >
      {/* Top minimal indicator */}
      <div className="flex items-center gap-2 text-amber-500/40 text-xs font-mono">
        <Moon className="w-3.5 h-3.5" />
        <span>OLED SLEEP MODE · TAP ANYWHERE TO WAKE</span>
      </div>

      {/* Center ultra-dim sleep focal */}
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Faint subtle pulsing breath ring */}
        <div
          className={`w-32 h-32 rounded-full border flex flex-col items-center justify-center transition-all duration-700 ${
            currentSide === 'left'
              ? 'border-amber-500/30 bg-amber-950/10'
              : 'border-amber-600/30 bg-amber-950/10'
          }`}
        >
          <span className="text-3xl font-mono tabular-nums text-amber-500/60 font-light">
            {formatTime(timeRemaining)}
          </span>
          <span className="text-[11px] font-mono text-amber-600/40 mt-1">
            {currentBpm} BPM · {currentSide.toUpperCase()}
          </span>
        </div>

        {isPlaying && (
          <p className="text-xs font-serif italic text-amber-500/40 tracking-wider">
            {breathState.instruction}
          </p>
        )}
      </div>

      {/* Bottom hint */}
      <div className="text-[11px] text-amber-900/50">
        Zero blue light · Audio & haptics active
      </div>
    </div>
  );
};
