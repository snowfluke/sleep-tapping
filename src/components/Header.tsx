import React from 'react';
import { Moon } from 'lucide-react';
import { BeatDots } from './BeatDots';

interface HeaderProps {
  onToggleOled: () => void;
  currentBpm: number;
  currentSide: 'left' | 'right';
  isPlaying: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleOled, currentBpm, currentSide, isPlaying }) => {
  return (
    <header className="z-30 w-full border-b border-line bg-night-1 tall:sticky tall:top-0">
      <div className="mx-auto flex min-h-14 max-w-lg flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="truncate text-base font-medium text-ink-1">Sleep Tapping</h1>
          {isPlaying && (
            <span className="flex items-center gap-2 font-mono text-xs tabular-nums text-ink-3">
              <BeatDots side={currentSide} />
              {currentBpm} BPM
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleOled}
          aria-label="Nightstand mode"
          className="flex h-9 min-w-9 items-center justify-center gap-2 rounded-lg border border-line bg-night-2 px-3 text-sm text-ink-2 transition-colors duration-150 hover:bg-night-3 hover:text-ink-1"
        >
          <Moon className="size-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Nightstand</span>
        </button>
      </div>
    </header>
  );
};
