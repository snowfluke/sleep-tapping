import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { SessionSettings } from '../types';
import { TempoCurve } from './TempoCurve';
import { formatClock } from '../lib/formatClock';

interface SessionControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  timeRemaining: number;
  progress: number;
  currentBpm: number;
  settings: SessionSettings;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSelectDuration: (seconds: number) => void;
}

const DURATIONS = [
  { label: '15 sec', seconds: 15 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
];

const primaryButton =
  'flex h-12 min-w-0 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl text-[15px] font-medium transition-[background-color,transform] duration-150 ease-soft active:scale-[0.98]';

export const SessionControls: React.FC<SessionControlsProps> = ({
  isPlaying,
  isPaused,
  timeRemaining,
  progress,
  currentBpm,
  settings,
  onStart,
  onPause,
  onResume,
  onStop,
  onSelectDuration,
}) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-ink-3">Time left</span>
          <span className="font-mono text-[28px] font-medium tabular-nums leading-none text-ink-1">
            {formatClock(timeRemaining)}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-ink-3">{isPlaying ? `Slowing to ${settings.endBpm}` : 'Tempo'}</span>
          <span className="font-mono text-[28px] font-medium tabular-nums leading-none text-ember">
            {currentBpm}
            <span className="ml-1 text-sm font-normal text-ink-3">BPM</span>
          </span>
        </div>
      </div>

      <TempoCurve settings={settings} progress={progress} />

      {!isPlaying && (
        <div role="radiogroup" aria-label="Session length" className="grid grid-cols-4 gap-1 rounded-xl border border-line bg-night-2 p-1">
          {DURATIONS.map((d) => {
            const isSelected = settings.durationSeconds === d.seconds;
            return (
              <button
                key={d.seconds}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectDuration(d.seconds)}
                className={`h-9 min-w-0 truncate rounded-lg px-1 text-sm transition-colors duration-150 ${
                  isSelected
                    ? 'bg-night-3 text-ink-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]'
                    : 'text-ink-3 hover:text-ink-1'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3">
        {!isPlaying ? (
          <button type="button" onClick={onStart} className={`${primaryButton} bg-ember text-ember-ink hover:bg-ember/90`}>
            <Play className="size-4 fill-current" strokeWidth={1.5} />
            Start tapping
          </button>
        ) : (
          <>
            {isPaused ? (
              <button type="button" onClick={onResume} className={`${primaryButton} bg-ember text-ember-ink hover:bg-ember/90`}>
                <Play className="size-4 fill-current" strokeWidth={1.5} />
                Resume
              </button>
            ) : (
              <button
                type="button"
                onClick={onPause}
                className={`${primaryButton} border border-line bg-night-3 text-ink-1 hover:bg-night-2`}
              >
                <Pause className="size-4" strokeWidth={1.5} />
                Pause
              </button>
            )}
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop session"
              className="flex size-12 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-line bg-night-2 text-ink-2 transition-[color,background-color,transform] duration-150 ease-soft hover:text-alert active:scale-[0.98]"
            >
              <Square className="size-4" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
