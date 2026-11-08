import React from 'react';
import { Moon, Volume2, Sparkles, Smartphone } from 'lucide-react';

interface HeaderProps {
  oledPitchBlack: boolean;
  onToggleOled: () => void;
  vibrationIntensity: string;
  currentBpm?: number;
  isPlaying?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  oledPitchBlack,
  onToggleOled,
  vibrationIntensity,
  currentBpm,
  isPlaying,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 bg-[#070a12]/80 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between">
      {/* Brand Zone: Clean typography */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Moon className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-slate-100 flex items-center gap-2">
            BrainTap
            {isPlaying && (
              <span className="inline-flex items-center gap-1 text-[11px] font-normal text-indigo-300/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono tabular-nums">{currentBpm} BPM</span>
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Primary actions */}
      <div className="flex items-center gap-2">
        {/* OLED Pitch-black / Nightstand mode toggle */}
        <button
          onClick={onToggleOled}
          title={oledPitchBlack ? 'Exit OLED Nightstand Mode' : 'Enter OLED Nightstand Mode'}
          className={`h-9 px-3 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all border ${
            oledPitchBlack
              ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
              : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nightstand Mode</span>
        </button>
      </div>
    </header>
  );
};
