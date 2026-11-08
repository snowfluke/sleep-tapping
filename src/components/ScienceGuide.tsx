import React from 'react';
import { BookOpen, Sparkles, HeartPulse, Brain, Waves, ArrowRight, Quote } from 'lucide-react';

interface ScienceGuideProps {
  onStartPractice: () => void;
}

export const ScienceGuide: React.FC<ScienceGuideProps> = ({ onStartPractice }) => {
  return (
    <div className="w-full max-w-lg mx-auto pb-24 px-4 pt-4 space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100">
          The Science of "Brain Tapping"
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Based on "How To Trick Your Brain Into Falling Asleep" by Jim Donovan (TEDxYoungstown)
        </p>
      </div>

      {/* Atmospheric Bedroom Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 aspect-[16/9] shadow-lg">
        <img
          src="/src/assets/images/sleep_rhythm_bedside_1791094586320.jpg"
          alt="Peaceful nocturnal bedroom ambiance"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/40 to-transparent flex flex-col justify-end p-4">
          <span className="text-[11px] font-semibold text-indigo-300 tracking-wider uppercase">
            Frequency-Following Response
          </span>
          <p className="text-xs text-slate-200 font-medium">
            Entraining your brain to deep delta rest through slow rhythm
          </p>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 relative">
        <Quote className="w-6 h-6 text-indigo-400/40 mb-2" />
        <p className="text-sm font-serif italic text-indigo-100 leading-relaxed">
          "The key to falling asleep is rhythm. Your brain loves to follow repeating, rhythmic patterns. We activate the frequency-following response, and then we slow the speed of your brain activity down by slowing down the rhythm."
        </p>
        <span className="block text-xs font-semibold text-indigo-300 mt-2">
          — Jim Donovan, M.Ed., Musician & Assistant Professor
        </span>
      </div>

      {/* Jim's Story */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-rose-400" />
          <span>The Wake-Up Call</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          In October 2010, Jim was rushed into an ambulance believing he was having a heart attack. After three days in the hospital, his doctor revealed he was healthy, but suffering from severe anxiety and chronic sleep deprivation (sleeping only 4 hours a night).
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          The doctor warned him: <em className="text-slate-200">"Four hours of sleep per night is sleep deprivation, and there is no quicker way to die early than to skimp on sleep."</em> Even after cutting back caffeine, Jim still couldn't stop his mind from racing at night.
        </p>
      </section>

      {/* The Discovery */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span>How It Was Discovered</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          As a professional drummer leading rhythm workshops since 1999, Jim noticed that groups drumming steady unison patterns always reported feeling deeply relaxed. One night, sitting at the edge of his bed, he began lightly tapping his hands on his thighs in a steady rhythm without any drums.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          After about four minutes, his eyelids grew heavy, he yawned, laid down, and woke up to morning sunshine—having slept seven-and-a-half continuous hours.
        </p>
      </section>

      {/* The Science */}
      <section className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Waves className="w-4 h-4 text-teal-400" />
          <span>The Frequency-Following Response (FFR)</span>
        </h3>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-slate-100">Step 1 — Pattern Detection:</strong> When exposed to a repeating bilateral beat (Right, Left, Right, Left), the brain naturally synchronizes its neural electrical activity with the stimulus.
          </li>
          <li>
            <strong className="text-slate-100">Step 2 — Entrainment:</strong> The auditory and tactile pulses at ~68 BPM match a calm resting physiological baseline, interrupting racing thoughts or looping songs.
          </li>
          <li>
            <strong className="text-slate-100">Step 3 — Deceleration:</strong> As the rhythm decrementally slows from 68 BPM down to 36 BPM, neural oscillations downshift from high-frequency Beta (anxiety) into calm Alpha and deep Theta sleep waves.
          </li>
        </ul>
      </section>

      {/* 3 Step Protocol */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">
          The 3-Step Bedtime Protocol
        </h3>
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-indigo-300">1. Tap like a ticking stopwatch:</span> Bring hands to your lap. Tap lightly: Right, Left, Right, Left.
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-indigo-300">2. Breathe slowly:</span> Inhale slowly for 4 counts, exhale slowly for 4 counts. Close your eyes.
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-indigo-300">3. Slow the rhythm down:</span> Allow the rhythm to decelerate. When you feel drowsy, simply lay back and let sleep take over.
          </div>
        </div>
      </section>

      {/* Start Button */}
      <button
        type="button"
        onClick={onStartPractice}
        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-600/20"
      >
        <span>Try the Exercise Now</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
