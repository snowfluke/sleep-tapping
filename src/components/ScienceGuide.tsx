import React from 'react';
import { HeartPulse, Hand, Waves, ArrowRight, LucideIcon } from 'lucide-react';
import bedside from '../assets/images/bedside.jpg';

interface ScienceGuideProps {
  onStartPractice: () => void;
}

const STEPS = [
  { title: 'Tap like a ticking stopwatch', body: 'Rest your hands on your lap and tap lightly: right, left, right, left.' },
  { title: 'Breathe slowly', body: 'Breathe in for 4 counts and out for 4 counts, and close your eyes.' },
  { title: 'Slow the rhythm down', body: 'Let the taps get slower, and when you feel drowsy, lie back.' },
];

export const ScienceGuide: React.FC<ScienceGuideProps> = ({ onStartPractice }) => {
  return (
    <article className="flex flex-col gap-10 px-4 py-6">
      <header>
        <h2 className="font-display text-[28px] font-normal leading-tight text-ink-1">The idea behind sleep tapping</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
          Jim Donovan describes this method in his TEDxYoungstown talk "How to trick your brain into falling asleep",
          and this page sums up the talk in our own words.
        </p>
      </header>

      <img
        src={bedside}
        alt="A bedside table at night with a lit lamp, a wristwatch and a cup of tea"
        width={1376}
        height={768}
        className="aspect-[16/9] w-full max-w-full rounded-2xl object-cover"
      />

      <figure className="flex flex-col gap-3 border-l-2 border-ember/60 pl-4">
        <blockquote className="text-[17px] leading-relaxed text-ink-1">
          The key to falling asleep is rhythm. Your brain loves to follow repeating, rhythmic patterns, and when you slow
          the rhythm down, you slow your brain activity down with it.
        </blockquote>
        <figcaption className="text-[13px] text-ink-3">Jim Donovan, paraphrased from the talk</figcaption>
      </figure>

      <Story icon={HeartPulse} title="Why he looked for a method">
        In the talk, Donovan says that in 2010 he went to hospital thinking he was having a heart attack. His doctor
        found anxiety and long-term lack of sleep, about four hours a night, and cutting back on caffeine did not stop
        his mind from racing at bedtime.
      </Story>

      <Story icon={Hand} title="How he found it">
        Donovan is a drummer who leads rhythm workshops, and he noticed that groups felt calm after drumming a steady
        pattern together. One night he sat on the edge of his bed and tapped his thighs in a steady rhythm. He says that
        after about four minutes he felt drowsy, lay down and slept through the night.
      </Story>

      <section className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-[15px] font-medium text-ink-1">
          <Waves className="size-4 text-ink-3" strokeWidth={1.5} />
          His explanation
        </h3>
        <p className="text-[15px] leading-relaxed text-ink-2">
          Donovan calls it the frequency-following response: the brain tends to follow a steady outside rhythm. A
          right-left beat near a resting pulse gives racing thoughts something else to follow, and as the beat slows
          from 68 to 36 BPM, the idea is that you wind down with it. This app follows his method, and it has not been
          tested as a sleep treatment.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-[15px] font-medium text-ink-1">The three steps</h3>
        <ol className="flex flex-col">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4 border-t border-line py-4 first:border-t-0">
              <span className="font-mono text-sm tabular-nums text-ember">{i + 1}</span>
              <span className="min-w-0">
                <span className="block text-[15px] text-ink-1">{step.title}</span>
                <span className="block text-sm text-ink-2">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <button
        type="button"
        onClick={onStartPractice}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ember text-[15px] font-medium text-ember-ink transition-[background-color,transform] duration-150 ease-soft hover:bg-ember/90 active:scale-[0.98]"
      >
        Start a session
        <ArrowRight className="size-4" strokeWidth={1.5} />
      </button>

      <p className="text-[13px] leading-relaxed text-ink-3">
        This app is not medical advice and is not affiliated with Jim Donovan or TEDx. If you often have trouble sleeping,
        talk to a doctor.
      </p>
    </article>
  );
};

const Story: React.FC<{ icon: LucideIcon; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <section className="flex flex-col gap-3">
    <h3 className="flex items-center gap-2 text-[15px] font-medium text-ink-1">
      <Icon className="size-4 text-ink-3" strokeWidth={1.5} />
      {title}
    </h3>
    <p className="text-[15px] leading-relaxed text-ink-2">{children}</p>
  </section>
);
