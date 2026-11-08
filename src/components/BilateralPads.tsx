import React from 'react';
import { Headphones, Hand } from 'lucide-react';

interface BilateralPadsProps {
  currentSide: 'left' | 'right';
  isPlaying: boolean;
  stereoPanning: boolean;
  onManualTap: (side: 'left' | 'right') => void;
}

const SIDES = [
  { side: 'left' as const, label: 'Left', ear: 'Left ear', hand: 'Left hand', mirror: true },
  { side: 'right' as const, label: 'Right', ear: 'Right ear', hand: 'Right hand', mirror: false },
];

export const BilateralPads: React.FC<BilateralPadsProps> = ({ currentSide, isPlaying, stereoPanning, onManualTap }) => {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="flex min-h-5 items-center gap-2 text-sm text-ink-3">
        {stereoPanning && <Headphones className="size-4 shrink-0" strokeWidth={1.5} />}
        <span className="min-w-0">
          {isPlaying
            ? 'Pat your lap in time: right, left, right, left'
            : stereoPanning
              ? 'Use headphones and tap a pad to hear each side'
              : 'Tap a pad to hear the sound'}
        </span>
      </p>

      <div className="grid grid-cols-2 gap-3">
        {SIDES.map(({ side, label, ear, hand, mirror }) => {
          const isActive = isPlaying && currentSide === side;
          return (
            <button
              key={side}
              type="button"
              onClick={() => onManualTap(side)}
              className={`flex min-h-24 min-w-0 touch-manipulation select-none flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition-[background-color,border-color,transform] duration-150 ease-soft active:scale-[0.98] ${
                isActive ? 'border-ember/40 bg-night-3' : 'border-line bg-night-2 hover:bg-night-3'
              }`}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-full transition-colors duration-150 ${
                  isActive ? 'bg-ember text-ember-ink' : 'bg-night-3 text-ink-2'
                }`}
              >
                <Hand className={`size-4 ${mirror ? '-scale-x-100' : ''}`} strokeWidth={1.5} />
              </span>
              <span className="text-[15px] font-medium text-ink-1">{label}</span>
              <span className="text-[13px] text-ink-3">{stereoPanning ? ear : hand}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
