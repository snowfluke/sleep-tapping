import React from 'react';
import {
  Volume2,
  Sliders,
  Smartphone,
  Headphones,
  Wind,
  Radio,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
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

interface CustomizeTabProps {
  settings: SessionSettings;
  onUpdateSettings: (updater: (prev: SessionSettings) => SessionSettings) => void;
  onResetDefaults: () => void;
  onTestDeceleration?: () => void;
}

export const CustomizeTab: React.FC<CustomizeTabProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
  onTestDeceleration,
}) => {
  const soundPresets: { id: SoundPreset; name: string; desc: string }[] = [
    { id: 'lap-drum', name: 'Warm Lap Drum', desc: "Jim's hands patting thighs lightly" },
    { id: 'stopwatch', name: 'Vintage Stopwatch', desc: 'Mechanical tick of a pocket watch' },
    { id: 'raindrop', name: 'Calm Raindrop', desc: 'Resonant liquid droplets' },
    { id: 'singing-bowl', name: 'Singing Bowl', desc: 'Warm Tibetan meditative tones' },
    { id: 'heartbeat', name: 'Resting Heartbeat', desc: 'Soothing biological lub-dub cadence' },
    { id: 'soft-wood', name: 'Warm Marimba', desc: 'Gentle acoustic wooden clave tap' },
  ];

  const ambientPresets: { id: AmbientPreset; name: string; desc: string }[] = [
    { id: 'none', name: 'None (Pure Rhythm)', desc: 'Only bilateral tapping sounds' },
    { id: 'brown-noise', name: 'Deep Brown Noise', desc: 'Warm low rumble, blocks disruptive noises' },
    { id: 'pink-noise', name: 'Balanced Pink Noise', desc: 'Gentle waterfall-like static' },
    { id: 'gentle-rain', name: 'Bedroom Night Rain', desc: 'Soft rain against window' },
    { id: 'night-crickets', name: 'Summer Night Crickets', desc: 'Peaceful distant meadow' },
  ];

  const previewSound = (preset: SoundPreset) => {
    sleepAudio.resume();
    sleepAudio.playTap('left', preset, settings.stereoPanning, settings.soundVolume);
    setTimeout(() => {
      sleepAudio.playTap('right', preset, settings.stereoPanning, settings.soundVolume);
    }, 400);
  };

  const testVibration = (intensity: VibrationIntensity) => {
    hapticEngine.test(intensity);
  };

  const isVibrationSupported = hapticEngine.isSupported();

  return (
    <div className="w-full max-w-lg mx-auto pb-24 px-4 pt-4 space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Sound & Rhythmic Settings</h2>
          <p className="text-xs text-slate-400">Tune the frequency-following response to your body</p>
        </div>
        <button
          type="button"
          onClick={onResetDefaults}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. Tapping Sound Timbre */}
      <section className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>Rhythm Sound</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {Math.round(settings.soundVolume * 100)}%
          </span>
        </div>

        {/* Volume Slider */}
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={settings.soundVolume}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdateSettings((prev) => ({ ...prev, soundVolume: val }));
            sleepAudio.setSoundVolume(val);
          }}
          className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />

        {/* Sound Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {soundPresets.map((sp) => {
            const isSelected = settings.soundPreset === sp.id;
            return (
              <div
                key={sp.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/60 shadow-sm'
                    : 'bg-slate-950/40 hover:bg-slate-800/40 border-slate-800/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, soundPreset: sp.id }))}
                  className="flex-1 text-left"
                >
                  <div className={`text-xs font-semibold ${isSelected ? 'text-indigo-200' : 'text-slate-200'}`}>
                    {sp.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{sp.desc}</div>
                </button>
                <button
                  type="button"
                  onClick={() => previewSound(sp.id)}
                  title="Preview Sound"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Deceleration Rhythm Curve & Tempos */}
      <section className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/70 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Deceleration Cadence (BPM)</span>
        </div>

        {/* Start & End Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Starting Tempo:</span>
              <span className="font-mono font-semibold text-indigo-300">{settings.startBpm} BPM</span>
            </div>
            <input
              type="range"
              min="52"
              max="86"
              step="2"
              value={settings.startBpm}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateSettings((prev) => ({ ...prev, startBpm: val }));
              }}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Stopwatch speed / resting heart rate</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Ending Tempo:</span>
              <span className="font-mono font-semibold text-teal-300">{settings.endBpm} BPM</span>
            </div>
            <input
              type="range"
              min="24"
              max="48"
              step="2"
              value={settings.endBpm}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateSettings((prev) => ({ ...prev, endBpm: val }));
              }}
              className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Deep brainwave Theta/Delta frequency</p>
          </div>
        </div>

        {/* Deceleration Style selector */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-400">Deceleration Curve Style</label>
            {onTestDeceleration && (
              <button
                type="button"
                onClick={onTestDeceleration}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 px-2.5 py-1 bg-indigo-950/60 rounded-lg border border-indigo-800/60 active:scale-95 transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Test Deceleration (15s Quick Demo)</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'smooth' as DecelerationCurve, title: 'Continuous (Default)', desc: 'Every beat gets slower' },
              { id: 'stepped' as DecelerationCurve, title: 'TEDx Staged', desc: '3 progressive stages' },
              { id: 'gentle-late' as DecelerationCurve, title: 'Late Lullaby', desc: 'Brief steady, then drop' },
            ].map((curve) => {
              const isSelected = settings.decelerationCurve === curve.id;
              return (
                <button
                  key={curve.id}
                  type="button"
                  onClick={() => onUpdateSettings((prev) => ({ ...prev, decelerationCurve: curve.id }))}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold">{curve.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{curve.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Bilateral Panning & Haptics */}
      <section className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/70 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Headphones className="w-4 h-4 text-indigo-400" />
          <span>Bilateral Stimulation (Stereo & Haptics)</span>
        </div>

        {/* Stereo Audio Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <div className="space-y-0.5 pr-2">
            <div className="text-xs font-semibold text-slate-200">Bilateral Stereo Panning</div>
            <div className="text-[11px] text-slate-400">
              Alternates left & right ear for frequency entrainment (best with headphones)
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.stereoPanning}
            onClick={() => onUpdateSettings((prev) => ({ ...prev, stereoPanning: !prev.stereoPanning }))}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              settings.stereoPanning ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.stereoPanning ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Vibration / Haptic Feedback */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Haptic Vibration</div>
                <div className="text-[11px] text-slate-400">
                  Feel the pulse by placing phone on chest or holding gently
                </div>
              </div>
            </div>
            {settings.vibrationIntensity !== 'off' && (
              <button
                type="button"
                onClick={() => testVibration(settings.vibrationIntensity)}
                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 px-2 py-1 bg-indigo-950/40 rounded-lg border border-indigo-800/40"
              >
                Test Haptic
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {(['off', 'gentle', 'firm'] as VibrationIntensity[]).map((mode) => {
              const isSelected = settings.vibrationIntensity === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    onUpdateSettings((prev) => ({ ...prev, vibrationIntensity: mode }));
                    if (mode !== 'off') testVibration(mode);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize text-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {!isVibrationSupported && (
            <p className="text-[10px] text-amber-400/80">
              Note: Device or browser does not expose Web Vibration API. Audio is fully active.
            </p>
          )}
        </div>
      </section>

      {/* 4. Sleep Ambient Sound Backdrop */}
      <section className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Radio className="w-4 h-4 text-indigo-400" />
            <span>Ambient Sleep Backdrop</span>
          </div>
          {settings.ambientPreset !== 'none' && (
            <span className="text-xs text-slate-400 font-mono">
              {Math.round(settings.ambientVolume * 100)}%
            </span>
          )}
        </div>

        {/* Ambient Volume Slider if not none */}
        {settings.ambientPreset !== 'none' && (
          <input
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={settings.ambientVolume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onUpdateSettings((prev) => ({ ...prev, ambientVolume: val }));
              sleepAudio.setAmbientVolume(val);
            }}
            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        )}

        <div className="space-y-1.5">
          {ambientPresets.map((ap) => {
            const isSelected = settings.ambientPreset === ap.id;
            return (
              <button
                key={ap.id}
                type="button"
                onClick={() => {
                  onUpdateSettings((prev) => ({ ...prev, ambientPreset: ap.id }));
                  if (ap.id !== 'none') {
                    sleepAudio.resume();
                    sleepAudio.setAmbient(ap.id, settings.ambientVolume);
                  } else {
                    sleepAudio.stopAmbient();
                  }
                }}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{ap.name}</div>
                  <div className="text-[11px] text-slate-400">{ap.desc}</div>
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Breathing Guide Technique */}
      <section className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/70 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Wind className="w-4 h-4 text-indigo-400" />
          <span>Breathing Technique</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'jim-4-4' as BreathingMode, name: "Jim's 4-4 Breath", desc: '4 counts in, 4 counts out' },
            { id: 'relax-4-7-8' as BreathingMode, name: '4-7-8 Relaxation', desc: 'Inhale 4, hold 7, exhale 8' },
            { id: 'box-4-4-4-4' as BreathingMode, name: 'Box Breathing', desc: 'Equal 4s four-square breath' },
            { id: 'off' as BreathingMode, name: 'Off / Free Breath', desc: 'Focus strictly on rhythm' },
          ].map((bm) => {
            const isSelected = settings.breathingMode === bm.id;
            return (
              <button
                key={bm.id}
                type="button"
                onClick={() => onUpdateSettings((prev) => ({ ...prev, breathingMode: bm.id }))}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">{bm.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{bm.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. Display Screen Awake Setting */}
      <section className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/70 flex items-center justify-between">
        <div className="space-y-0.5 pr-2">
          <div className="text-xs font-semibold text-slate-200">Prevent Screen Sleep (Wake Lock)</div>
          <div className="text-[11px] text-slate-400">
            Keep visual breath guide on screen during the session
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.keepScreenAwake}
          onClick={() => onUpdateSettings((prev) => ({ ...prev, keepScreenAwake: !prev.keepScreenAwake }))}
          className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
            settings.keepScreenAwake ? 'bg-indigo-600' : 'bg-slate-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.keepScreenAwake ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </section>
    </div>
  );
};
