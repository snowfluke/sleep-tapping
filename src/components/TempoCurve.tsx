import React, { useId } from 'react';
import { SessionSettings } from '../types';
import { tempoAt } from '../lib/tempoCurve';

interface TempoCurveProps {
  settings: Pick<SessionSettings, 'startBpm' | 'endBpm' | 'decelerationCurve'>;
  /** Session progress from 0 to 1. Omit to show the curve without a position marker. */
  progress?: number;
}

const SAMPLES = 64;
const WIDTH = 320;
const HEIGHT = 48;

/** The tempo falling from start to end BPM over the session, with the elapsed part in ember. */
export const TempoCurve: React.FC<TempoCurveProps> = ({ settings, progress }) => {
  const clipId = useId();
  const { startBpm, endBpm } = settings;
  const span = Math.max(1, startBpm - endBpm);
  const yFor = (bpm: number) => ((startBpm - bpm) / span) * HEIGHT;

  const points = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const p = i / SAMPLES;
    return `${(p * WIDTH).toFixed(1)},${yFor(tempoAt(p, settings)).toFixed(1)}`;
  }).join(' ');

  const hasMarker = progress !== undefined;
  const p = Math.max(0, Math.min(1, progress ?? 0));
  const markerTop = (yFor(tempoAt(p, settings)) / HEIGHT) * 100;

  return (
    <figure className="w-full" aria-label={`Tempo slows from ${startBpm} to ${endBpm} BPM`}>
      <p className="font-mono text-xs tabular-nums text-ink-3">{startBpm} BPM</p>
      <div className="relative my-2 h-12">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="-4" width={p * WIDTH} height={HEIGHT + 8} />
            </clipPath>
          </defs>
          <line x1="0" y1={HEIGHT} x2={WIDTH} y2={HEIGHT} className="stroke-line" vectorEffect="non-scaling-stroke" />
          <polyline points={points} fill="none" className="stroke-ink-3/60" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {hasMarker && (
            <polyline
              points={points}
              fill="none"
              clipPath={`url(#${clipId})`}
              className="stroke-ember"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        {hasMarker && (
          <span
            className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember"
            style={{ left: `${p * 100}%`, top: `${markerTop}%` }}
            aria-hidden="true"
          />
        )}
      </div>
      <p className="text-right font-mono text-xs tabular-nums text-ink-3">{endBpm} BPM</p>
    </figure>
  );
};
