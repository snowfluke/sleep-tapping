import React, { useState } from 'react';
import { Trophy, CheckCircle2, Circle, Star, Calendar, MessageSquare, Plus, RotateCcw } from 'lucide-react';
import { ChallengeEntry } from '../types';

interface ChallengeTrackerProps {
  challengeEntries: ChallengeEntry[];
  onCompleteNight: (day: number, rating: 1 | 2 | 3 | 4 | 5, notes: string) => void;
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
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [notes, setNotes] = useState('');

  const completedCount = challengeEntries.filter((e) => e.completed).length;
  const isAllComplete = completedCount === 5;

  const handleOpenLogModal = (day: number) => {
    setSelectedDay(day);
    const existing = challengeEntries.find((e) => e.day === day);
    if (existing && existing.completed) {
      setRating(existing.sleepQuality || 5);
      setNotes(existing.notes || '');
    } else {
      setRating(5);
      setNotes('');
    }
  };

  const handleSaveNight = () => {
    if (selectedDay !== null) {
      onCompleteNight(selectedDay, rating, notes);
      setSelectedDay(null);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 px-4 pt-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/40 rounded-3xl p-5 border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Jim Donovan's TEDx Challenge
            </span>
            <span className="text-xs font-mono font-medium text-indigo-200">
              {completedCount} / 5 Nights Completed
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-100">
            The 5-Night Brain Tapping Experiment
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            "For the next five nights, I invite you just to run the exercise for at least three minutes. Tap like a ticking stopwatch, breathe slowly, and at the end, slow the rhythm down."
          </p>

          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={onLaunchChallengeSession}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 active:scale-95"
            >
              Start 3-Minute Challenge Now
            </button>
            <button
              type="button"
              onClick={onResetChallenge}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Circles */}
      <div className="grid grid-cols-5 gap-2">
        {challengeEntries.map((entry) => {
          return (
            <button
              key={entry.day}
              type="button"
              onClick={() => handleOpenLogModal(entry.day)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                entry.completed
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-indigo-500/50'
              }`}
            >
              {entry.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
              <span className="text-xs font-semibold text-slate-200">Night {entry.day}</span>
              <span className="text-[10px] text-slate-400">
                {entry.completed ? 'Done' : 'Pending'}
              </span>
            </button>
          );
        })}
      </div>

      {/* List of nights with details */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-300">Nightly Sleep Journal</h3>
        <div className="space-y-2">
          {challengeEntries.map((entry) => {
            return (
              <div
                key={entry.day}
                className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/70 flex items-start justify-between gap-3 hover:border-slate-700/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">Night {entry.day}</span>
                    {entry.completed && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800/40 font-medium">
                        Completed
                      </span>
                    )}
                    {entry.dateCompleted && (
                      <span className="text-[11px] text-slate-500">
                        {entry.dateCompleted}
                      </span>
                    )}
                  </div>

                  {entry.notes ? (
                    <p className="text-xs text-slate-300 italic">"{entry.notes}"</p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      {entry.completed ? 'Completed without notes' : 'Run 3-minute session and record your rest'}
                    </p>
                  )}

                  {entry.sleepQuality && (
                    <div className="flex items-center gap-1 pt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= entry.sleepQuality! ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenLogModal(entry.day)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 active:scale-95 transition-all shrink-0"
                >
                  {entry.completed ? 'Edit Note' : 'Log Night'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Modal / Bottom Drawer */}
      {selectedDay !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">
                Log Night {selectedDay} Experience
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-slate-400 hover:text-slate-200 text-xs py-1 px-2"
              >
                Cancel
              </button>
            </div>

            {/* Sleep Rating */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">How easily did your mind quiet down?</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s as 1 | 2 | 3 | 4 | 5)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Bedtime Note */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Notes & observations:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Started yawning after 2 minutes. Eyelids felt heavy and slept 7 hours."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveNight}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all active:scale-[0.98]"
            >
              Save Night {selectedDay}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
