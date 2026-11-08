import React from 'react';
import { Wind } from 'lucide-react';
import { BreathState, BreathingMode } from '../types';

interface BreathingPacerProps {
  breathState: BreathState;
  breathingMode: BreathingMode;
  isPlaying: boolean;
  announcement: string;
}

export const BreathingPacer: React.FC<BreathingPacerProps> = ({
  breathState,
  breathingMode,
  isPlaying,
  announcement,
}) => {
  if (breathingMode === 'off') {
    return (
      <div className="w-full text-center py-2">
        <p className="text-sm text-slate-400 font-medium">{announcement}</p>
      </div>
    );
  }

  const { phase, count, totalCounts, instruction } = breathState;

  // Visual expansion scale based on phase and count
  const isExpanding = phase === 'inhale';
  const isHolding = phase === 'hold';
  const isExhaling = phase === 'exhale';

  // Smooth visual scale
  let circleScale = 1.0;
  if (isPlaying) {
    if (isExpanding) {
      circleScale = 1.0 + (count / totalCounts) * 0.35;
    } else if (isHolding) {
      circleScale = 1.35;
    } else if (isExhaling) {
      circleScale = 1.35 - (count / totalCounts) * 0.35;
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center my-1 sm:my-2">
      {/* Dynamic Voice Prompt banner */}
      <div className="text-center mb-1.5 min-h-[24px] flex items-center justify-center">
        <span className="text-xs sm:text-sm font-medium text-indigo-200/90 tracking-wide transition-opacity">
          {isPlaying ? instruction : announcement}
        </span>
      </div>

      {/* Breathing Ring */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
        {/* Soft background glow */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-teal-500/10 blur-xl transition-all duration-700 pointer-events-none"
          style={{
            transform: `scale(${circleScale * 1.15})`,
            opacity: isPlaying ? 0.7 : 0.3,
          }}
        />

        {/* Outer decorative ring */}
        <div
          className="absolute inset-2 rounded-full border border-indigo-500/20 transition-transform duration-500 ease-out"
          style={{ transform: `scale(${circleScale})` }}
        />

        {/* Core pulsing circle */}
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-500 ease-out border backdrop-blur-sm ${
            isExpanding
              ? 'bg-indigo-600/20 border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
              : isHolding
              ? 'bg-purple-600/20 border-purple-400/50'
              : 'bg-slate-900/80 border-slate-700/60'
          }`}
          style={{ transform: `scale(${circleScale})` }}
        >
          <Wind className={`w-4 h-4 mb-0.5 transition-colors ${
            isPlaying ? (isExpanding ? 'text-indigo-300' : 'text-slate-400') : 'text-slate-500'
          }`} />

          {isPlaying ? (
            <div className="flex flex-col items-center leading-tight">
              <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-100">
                {count}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">
                {phase}
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-slate-400">
              4-4 Breath
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
