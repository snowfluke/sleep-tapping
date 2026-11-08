import React from 'react';
import { Play, Pause, Square, Flame, Clock, Sparkles } from 'lucide-react';
import { SessionSettings } from '../types';

interface SessionControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  timeRemaining: number;
  totalDuration: number;
  progress: number;
  currentBpm: number;
  settings: SessionSettings;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSelectDuration: (seconds: number) => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  isPlaying,
  isPaused,
  timeRemaining,
  totalDuration,
  progress,
  currentBpm,
  settings,
  onStart,
  onPause,
  onResume,
  onStop,
  onSelectDuration,
}) => {
  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const presetDurations = [
    { label: '15s Test', seconds: 15, desc: 'Deceleration preview' },
    { label: '3 min Challenge', seconds: 180, desc: 'Jim Donovan challenge' },
    { label: '5 min Rest', seconds: 300, desc: 'Standard wind-down' },
    { label: '10 min Deep', seconds: 600, desc: 'Full sleep transition' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Time & BPM Stats readout */}
      <div className="w-full max-w-sm flex items-center justify-between px-2 mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Time Remaining
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-100 tracking-tight">
            {formatTime(timeRemaining)}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            {isPlaying ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Decelerating → {settings.endBpm} BPM
              </span>
            ) : (
              <span>Target: {settings.startBpm} → {settings.endBpm} BPM</span>
            )}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-indigo-300">
              {currentBpm}
            </span>
            <span className="text-[11px] text-slate-400">BPM</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm h-1.5 bg-slate-800/80 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-300 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Quick Duration selector (only editable when stopped) */}
      {!isPlaying && (
        <div className="w-full max-w-sm grid grid-cols-4 gap-1 p-1 bg-slate-900/60 rounded-xl border border-slate-800/80 mb-3">
          {presetDurations.map((p) => {
            const isSelected = settings.durationSeconds === p.seconds;
            return (
              <button
                key={p.seconds}
                type="button"
                onClick={() => onSelectDuration(p.seconds)}
                className={`py-1.5 px-1 text-center rounded-lg transition-all text-[11px] sm:text-xs font-medium ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="truncate">{p.label}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Primary Action Buttons (Thumb Zone) */}
      <div className="flex items-center gap-3 w-full max-w-sm pb-2">
        {!isPlaying ? (
          <button
            type="button"
            onClick={onStart}
            className="flex-1 h-13 sm:h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all touch-manipulation cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Begin Brain Tapping</span>
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                type="button"
                onClick={onResume}
                className="flex-1 h-13 sm:h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all touch-manipulation cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Resume Cadence</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPause}
                className="flex-1 h-13 sm:h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-100 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 border border-slate-700 transition-all touch-manipulation cursor-pointer"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={onStop}
              title="Stop Session"
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 flex items-center justify-center active:scale-95 transition-all touch-manipulation cursor-pointer shrink-0"
            >
              <Square className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
