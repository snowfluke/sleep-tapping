import React from 'react';

interface BeatDotsProps {
  side: 'left' | 'right';
  /** Dim variant for the nightstand screen. */
  dim?: boolean;
}

/** Two dots that alternate with each tap, so the beat is visible at a glance. */
export const BeatDots: React.FC<BeatDotsProps> = ({ side, dim = false }) => {
  const on = dim ? 'bg-ember/50' : 'bg-ember';
  const off = dim ? 'bg-ember/10' : 'bg-ink-3/30';
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className={`size-1.5 rounded-full transition-colors duration-150 ${side === 'left' ? on : off}`} />
      <span className={`size-1.5 rounded-full transition-colors duration-150 ${side === 'right' ? on : off}`} />
    </span>
  );
};
