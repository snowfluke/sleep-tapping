import React, { useState } from 'react';
import { CheckCircle2, Circle, Star, RotateCcw, Play } from 'lucide-react';
import { ChallengeEntry } from '../types';

type Rating = 1 | 2 | 3 | 4 | 5;
const RATINGS: Rating[] = [1, 2, 3, 4, 5];

interface ChallengeTrackerProps {
  challengeEntries: ChallengeEntry[];
  onCompleteNight: (day: number, rating: Rating, notes: string) => void;
  onResetChallenge: () => void;
  onLaunchChallengeSession: () => void;
}

export const ChallengeTracker: React.FC<ChallengeTrackerProps> = ({
  challengeEntries,
  onCompleteNight,
  onResetChallenge,
  onLaunchChallengeSession,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [rating, setRating] = useState<Rating>(3);
  const [notes, setNotes] = useState('');

  const completedCount = challengeEntries.filter((e) => e.completed).length;

  const openLog = (day: number) => {
    const existing = challengeEntries.find((e) => e.day === day);
    setSelectedDay(day);
    setRating(existing?.sleepQuality ?? 3);
    setNotes(existing?.notes ?? '');
  };

  const saveLog = () => {
    if (selectedDay === null) return;
    onCompleteNight(selectedDay, rating, notes);
    setSelectedDay(null);
  };

  return (
    <div className="flex flex-col gap-10 px-4 py-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[13px] text-ink-3">Jim Donovan's TEDx challenge</p>
          <h2 className="mt-1 font-display text-[28px] font-normal leading-tight text-ink-1">Five nights of tapping</h2>
        </div>
        <p className="text-[15px] leading-relaxed text-ink-2">
          Run the exercise for at least three minutes on each of the next five nights: tap like a ticking stopwatch,
          breathe slowly, then let the rhythm slow down.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onLaunchChallengeSession}
            className="flex h-11 items-center gap-2 rounded-xl bg-ember px-4 text-[15px] font-medium text-ember-ink transition-[background-color,transform] duration-150 ease-soft hover:bg-ember/90 active:scale-[0.98]"
          >
            <Play className="size-4 fill-current" strokeWidth={1.5} />
            Start a 3-minute session
          </button>
          <button
            type="button"
            onClick={onResetChallenge}
            className="flex h-11 items-center gap-2 rounded-xl px-3 text-sm text-ink-3 transition-colors duration-150 hover:text-ink-1"
          >
            <RotateCcw className="size-4" strokeWidth={1.5} />
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs tabular-nums text-ink-3">{completedCount} of 5 nights done</p>
        <div className="grid grid-cols-5 gap-2">
          {challengeEntries.map((entry) => (
            <button
              key={entry.day}
              type="button"
              onClick={() => openLog(entry.day)}
              aria-label={`Night ${entry.day}, ${entry.completed ? 'done' : 'not done'}`}
              className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-line bg-night-2 transition-colors duration-150 hover:bg-night-3"
            >
              {entry.completed ? (
                <CheckCircle2 className="size-5 text-calm" strokeWidth={1.5} />
              ) : (
                <Circle className="size-5 text-ink-3" strokeWidth={1.5} />
              )}
              <span className="font-mono text-xs tabular-nums text-ink-2">{entry.day}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <h3 className="text-[15px] font-medium text-ink-1">Sleep journal</h3>
        <ul className="flex flex-col">
          {challengeEntries.map((entry) => (
            <li key={entry.day} className="flex items-start justify-between gap-4 border-t border-line py-4 first:border-t-0">
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[15px] font-medium text-ink-1">Night {entry.day}</span>
                  {entry.completed && <span className="text-[13px] text-calm">Done</span>}
                  {entry.dateCompleted && (
                    <span className="font-mono text-xs tabular-nums text-ink-3">{entry.dateCompleted}</span>
                  )}
                </div>
                <p className="text-sm text-ink-2 [overflow-wrap:anywhere]">
                  {entry.notes || (entry.completed ? 'No notes yet' : 'Not logged yet')}
                </p>
                {entry.sleepQuality && (
                  <div className="flex items-center gap-1" aria-label={`Rated ${entry.sleepQuality} of 5`}>
                    {RATINGS.map((s) => (
                      <Star
                        key={s}
                        className={`size-3.5 ${s <= entry.sleepQuality! ? 'fill-ember text-ember' : 'text-ink-3/50'}`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => openLog(entry.day)}
                className="flex h-9 shrink-0 items-center rounded-lg border border-line bg-night-2 px-3 text-sm text-ink-2 transition-colors duration-150 hover:bg-night-3 hover:text-ink-1"
              >
                {entry.sleepQuality ? 'Edit' : 'Log night'}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {selectedDay !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
          onClick={() => setSelectedDay(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="log-night-title"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-md flex-col gap-6 rounded-t-2xl border border-line bg-night-2 p-6 sm:rounded-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 id="log-night-title" className="text-[17px] font-medium text-ink-1">
                Night {selectedDay}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="h-9 rounded-lg px-3 text-sm text-ink-3 transition-colors duration-150 hover:text-ink-1"
              >
                Cancel
              </button>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm text-ink-2">How quickly your mind settled</legend>
              <div className="flex items-center gap-2">
                {RATINGS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    aria-label={`${s} of 5`}
                    aria-pressed={s === rating}
                    className="flex size-11 items-center justify-center rounded-lg bg-night-3 transition-colors duration-150 hover:bg-night-1"
                  >
                    <Star className={`size-5 ${s <= rating ? 'fill-ember text-ember' : 'text-ink-3'}`} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-ink-2">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-lg border border-line bg-night-1 p-3 text-base text-ink-1 focus:border-ember/60 focus:outline-none"
              />
            </label>

            <button
              type="button"
              onClick={saveLog}
              className="h-12 w-full rounded-xl bg-ember text-[15px] font-medium text-ember-ink transition-[background-color,transform] duration-150 ease-soft hover:bg-ember/90 active:scale-[0.98]"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
