import React from 'react';
import { Headphones, Hand } from 'lucide-react';

interface BilateralPadsProps {
  currentSide: 'left' | 'right';
  isPlaying: boolean;
  stereoPanning: boolean;
  onManualTap: (side: 'left' | 'right') => void;
  soundName: string;
}

export const BilateralPads: React.FC<BilateralPadsProps> = ({
  currentSide,
  isPlaying,
  stereoPanning,
  onManualTap,
  soundName,
}) => {
  const isLeftActive = isPlaying && currentSide === 'left';
  const isRightActive = isPlaying && currentSide === 'right';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Stereo indicator caption */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
        {stereoPanning && (
          <span className="flex items-center gap-1 text-indigo-400/90">
            <Headphones className="w-3.5 h-3.5" />
            <span>Bilateral Stereo Panning Active</span>
          </span>
        )}
        {!isPlaying && (
          <span className="text-slate-500">Tap either pad to test or practice cadence</span>
        )}
      </div>

      {/* Bilateral Lap Pads */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {/* Left Pad (Left Lap / Knee) */}
        <button
          type="button"
          onClick={() => onManualTap('left')}
          className={`relative h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center p-2.5 transition-all duration-150 border active:scale-95 touch-manipulation select-none overflow-hidden ${
            isLeftActive
              ? 'bg-indigo-600/25 border-indigo-400/80 shadow-[0_0_24px_rgba(99,102,241,0.35)] scale-[1.02]'
              : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-400'
          }`}
        >
          {/* Active ripple flash */}
          {isLeftActive && (
            <span className="absolute inset-0 bg-indigo-500/15 animate-ping opacity-60 rounded-2xl pointer-events-none" />
          )}

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
              isLeftActive
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <Hand className="w-4 h-4 -scale-x-100" />
          </div>

          <span
            className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
              isLeftActive ? 'text-indigo-200' : 'text-slate-300'
            }`}
          >
            LEFT LAP
          </span>
          <span className="text-[10px] text-slate-400">
            {stereoPanning ? 'Left Ear' : 'Left Hand'}
          </span>
        </button>

        {/* Right Pad (Right Lap / Knee) */}
        <button
          type="button"
          onClick={() => onManualTap('right')}
          className={`relative h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center p-2.5 transition-all duration-150 border active:scale-95 touch-manipulation select-none overflow-hidden ${
            isRightActive
              ? 'bg-indigo-600/25 border-indigo-400/80 shadow-[0_0_24px_rgba(99,102,241,0.35)] scale-[1.02]'
              : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-400'
          }`}
        >
          {/* Active ripple flash */}
          {isRightActive && (
            <span className="absolute inset-0 bg-indigo-500/15 animate-ping opacity-60 rounded-2xl pointer-events-none" />
          )}

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
              isRightActive
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <Hand className="w-4 h-4" />
          </div>

          <span
            className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
              isRightActive ? 'text-indigo-200' : 'text-slate-300'
            }`}
          >
            RIGHT LAP
          </span>
          <span className="text-[10px] text-slate-400">
            {stereoPanning ? 'Right Ear' : 'Right Hand'}
          </span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-2 max-w-xs">
        {isPlaying ? (
          <span>
            Lightly pat hands in unison: <span className="text-slate-200 font-medium">Right, Left, Right, Left</span>
          </span>
        ) : (
          <span>Bring hands to your lap. Keep eyes closed or soft-focused.</span>
        )}
      </p>
    </div>
  );
};
