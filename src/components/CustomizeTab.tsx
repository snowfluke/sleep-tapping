import React from 'react';
import { Volume2, Gauge, Headphones, Radio, Wind, Sun, Play, RotateCcw, LucideIcon } from 'lucide-react';
import {
  SessionSettings,
  SoundPreset,
  AmbientPreset,
  BreathingMode,
  DecelerationCurve,
  VibrationIntensity,
} from '../types';
import { sleepAudio } from '../lib/audioEngine';
import { hapticEngine } from '../lib/hapticEngine';
import { TempoCurve } from './TempoCurve';

interface CustomizeTabProps {
  settings: SessionSettings;
  onUpdateSettings: (updater: (prev: SessionSettings) => SessionSettings) => void;
  onResetDefaults: () => void;
  onTestDeceleration: () => void;
}

interface Option<T> {
  id: T;
  name: string;
  desc: string;
}

const SOUNDS: Option<SoundPreset>[] = [
  { id: 'lap-drum', name: 'Lap drum', desc: 'Hands patting your thighs' },
  { id: 'stopwatch', name: 'Stopwatch', desc: 'Tick of a pocket watch' },
  { id: 'raindrop', name: 'Raindrop', desc: 'Single water droplets' },
  { id: 'singing-bowl', name: 'Singing bowl', desc: 'Warm ringing metal tone' },
  { id: 'heartbeat', name: 'Heartbeat', desc: 'Slow lub-dub pulse' },
  { id: 'soft-wood', name: 'Marimba', desc: 'Soft wooden tap' },
];

const CURVES: Option<DecelerationCurve>[] = [
  { id: 'smooth', name: 'Continuous', desc: 'Every beat is a little slower' },
  { id: 'stepped', name: 'Three stages', desc: 'Holds, slows to halfway, then slows again' },
  { id: 'gentle-late', name: 'Late start', desc: 'Holds the start tempo, then slows' },
];

const AMBIENTS: Option<AmbientPreset>[] = [
  { id: 'none', name: 'None', desc: 'Only the taps' },
  { id: 'brown-noise', name: 'Brown noise', desc: 'Low rumble that masks other sounds' },
  { id: 'pink-noise', name: 'Pink noise', desc: 'Even, soft static' },
  { id: 'gentle-rain', name: 'Rain', desc: 'Soft rain on a window' },
  { id: 'night-crickets', name: 'Crickets', desc: 'A distant summer night' },
];

const BREATHING: Option<BreathingMode>[] = [
  { id: 'jim-4-4', name: '4-4 breath', desc: 'In for 4, out for 4' },
  { id: 'relax-4-7-8', name: '4-7-8 breath', desc: 'In for 4, hold for 7, out for 8' },
  { id: 'box-4-4-4-4', name: 'Box breath', desc: 'In, hold, out and hold for 4 each' },
  { id: 'off', name: 'Off', desc: 'Breathe freely and follow the taps' },
];

const VIBRATIONS: { id: VibrationIntensity; name: string }[] = [
  { id: 'off', name: 'Off' },
  { id: 'gentle', name: 'Gentle' },
  { id: 'firm', name: 'Firm' },
];

const secondaryButton =
  'flex h-9 shrink-0 items-center gap-2 rounded-lg border border-line bg-night-2 px-3 text-sm text-ink-2 transition-colors duration-150 hover:bg-night-3 hover:text-ink-1';

export const CustomizeTab: React.FC<CustomizeTabProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
  onTestDeceleration,
}) => {
  const set = <K extends keyof SessionSettings>(key: K, value: SessionSettings[K]) =>
    onUpdateSettings((prev) => ({ ...prev, [key]: value }));

  const previewSound = (preset: SoundPreset) => {
    sleepAudio.resume();
    sleepAudio.playTap('left', preset, settings.stereoPanning, settings.soundVolume);
    setTimeout(() => {
      sleepAudio.playTap('right', preset, settings.stereoPanning, settings.soundVolume);
    }, 400);
  };

  const selectAmbient = (id: AmbientPreset) => {
    set('ambientPreset', id);
    if (id === 'none') {
      sleepAudio.stopAmbient();
    } else {
      sleepAudio.resume();
      sleepAudio.setAmbient(id, settings.ambientVolume);
    }
  };

  return (
    <div className="flex flex-col gap-10 px-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-[28px] font-normal leading-tight text-ink-1">Settings</h2>
          <p className="mt-1 text-sm text-ink-2">Choose the tap sound, how the tempo slows and what plays underneath it.</p>
        </div>
        <button type="button" onClick={onResetDefaults} className={secondaryButton}>
          <RotateCcw className="size-4" strokeWidth={1.5} />
          Reset
        </button>
      </div>

      <Section icon={Volume2} title="Tap sound">
        <RangeField
          label="Volume"
          value={settings.soundVolume}
          min={0.1}
          max={1}
          step={0.05}
          display={`${Math.round(settings.soundVolume * 100)}%`}
          onChange={(v) => {
            set('soundVolume', v);
            sleepAudio.setSoundVolume(v);
          }}
        />
        <OptionList
          label="Tap sound"
          options={SOUNDS}
          value={settings.soundPreset}
          onSelect={(id) => set('soundPreset', id)}
          trailing={(o) => (
            <button
              type="button"
              onClick={() => previewSound(o.id)}
              aria-label={`Play ${o.name}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-3 transition-colors duration-150 hover:bg-night-3 hover:text-ink-1"
            >
              <Play className="size-4" strokeWidth={1.5} />
            </button>
          )}
        />
      </Section>

      <Section icon={Gauge} title="Tempo">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <RangeField
            label="Start tempo"
            value={settings.startBpm}
            min={52}
            max={86}
            step={2}
            display={`${settings.startBpm} BPM`}
            onChange={(v) => set('startBpm', v)}
          />
          <RangeField
            label="End tempo"
            value={settings.endBpm}
            min={24}
            max={48}
            step={2}
            display={`${settings.endBpm} BPM`}
            onChange={(v) => set('endBpm', v)}
          />
        </div>
        <TempoCurve settings={settings} />
        <OptionList label="How the tempo slows" options={CURVES} value={settings.decelerationCurve} onSelect={(id) => set('decelerationCurve', id)} />
        <button type="button" onClick={onTestDeceleration} className={`${secondaryButton} self-start`}>
          <Play className="size-4" strokeWidth={1.5} />
          Try it for 15 seconds
        </button>
      </Section>

      <Section icon={Headphones} title="Left and right">
        <SwitchRow
          label="Stereo panning"
          desc="Each tap moves between your left and right ear, so use headphones."
          checked={settings.stereoPanning}
          onChange={(v) => set('stereoPanning', v)}
        />
        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] text-ink-1">Vibration</p>
              <p className="text-[13px] text-ink-3">Rest the phone on your chest or hold it to feel each beat.</p>
            </div>
            {settings.vibrationIntensity !== 'off' && (
              <button type="button" onClick={() => hapticEngine.test(settings.vibrationIntensity)} className={secondaryButton}>
                Test
              </button>
            )}
          </div>
          <div role="radiogroup" aria-label="Vibration" className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-night-2 p-1">
            {VIBRATIONS.map((v) => {
              const isSelected = settings.vibrationIntensity === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    set('vibrationIntensity', v.id);
                    if (v.id !== 'off') hapticEngine.test(v.id);
                  }}
                  className={`h-9 rounded-lg text-sm transition-colors duration-150 ${
                    isSelected
                      ? 'bg-night-3 text-ink-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]'
                      : 'text-ink-3 hover:text-ink-1'
                  }`}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
          {!hapticEngine.isSupported() && (
            <p className="text-[13px] text-ink-3">This browser cannot vibrate, so only the sound plays.</p>
          )}
        </div>
      </Section>

      <Section icon={Radio} title="Background sound">
        {settings.ambientPreset !== 'none' && (
          <RangeField
            label="Volume"
            value={settings.ambientVolume}
            min={0.05}
            max={0.8}
            step={0.05}
            display={`${Math.round(settings.ambientVolume * 100)}%`}
            onChange={(v) => {
              set('ambientVolume', v);
              sleepAudio.setAmbientVolume(v);
            }}
          />
        )}
        <OptionList label="Background sound" options={AMBIENTS} value={settings.ambientPreset} onSelect={selectAmbient} />
      </Section>

      <Section icon={Wind} title="Breathing">
        <OptionList label="Breathing" options={BREATHING} value={settings.breathingMode} onSelect={(id) => set('breathingMode', id)} />
      </Section>

      <Section icon={Sun} title="Screen">
        <SwitchRow
          label="Keep screen on"
          desc="The phone does not lock during a session, so the breathing guide stays visible."
          checked={settings.keepScreenAwake}
          onChange={(v) => set('keepScreenAwake', v)}
        />
      </Section>
    </div>
  );
};

const Section: React.FC<{ icon: LucideIcon; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <section className="flex flex-col gap-4">
    <h3 className="flex items-center gap-2 text-[15px] font-medium text-ink-1">
      <Icon className="size-4 text-ink-3" strokeWidth={1.5} />
      {title}
    </h3>
    {children}
  </section>
);

function OptionList<T extends string>({
  label,
  options,
  value,
  onSelect,
  trailing,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onSelect: (id: T) => void;
  trailing?: (option: Option<T>) => React.ReactNode;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col">
      {options.map((o) => {
        const isSelected = value === o.id;
        return (
          <div key={o.id} className="flex items-center gap-2 border-t border-line first:border-t-0">
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(o.id)}
              className="group flex min-h-14 min-w-0 flex-1 items-center gap-3 py-2 text-left"
            >
              <span
                className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
                  isSelected ? 'border-ember' : 'border-ink-3 group-hover:border-ink-2'
                }`}
              >
                {isSelected && <span className="size-2 rounded-full bg-ember" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] text-ink-1">{o.name}</span>
                <span className="block text-[13px] text-ink-3">{o.desc}</span>
              </span>
            </button>
            {trailing?.(o)}
          </div>
        );
      })}
    </div>
  );
}

const RangeField: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, step, display, onChange }) => (
  <label className="flex flex-col gap-2">
    <span className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-ink-2">{label}</span>
      <span className="font-mono tabular-nums text-ink-1">{display}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-6 w-full cursor-pointer accent-ember"
    />
  </label>
);

const SwitchRow: React.FC<{ label: string; desc: string; checked: boolean; onChange: (value: boolean) => void }> = ({
  label,
  desc,
  checked,
  onChange,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-[15px] text-ink-1">{label}</p>
      <p className="text-[13px] text-ink-3">{desc}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 ${
        checked ? 'bg-ember' : 'bg-night-3'
      }`}
    >
      <span
        className={`size-5 rounded-full transition-transform duration-150 ease-soft ${
          checked ? 'translate-x-5 bg-ember-ink' : 'translate-x-0 bg-ink-2'
        }`}
      />
    </button>
  </div>
);
