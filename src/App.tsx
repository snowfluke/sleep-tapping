import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BilateralPads } from './components/BilateralPads';
import { BreathingPacer } from './components/BreathingPacer';
import { SessionControls } from './components/SessionControls';
import { CustomizeTab } from './components/CustomizeTab';
import { ChallengeTracker } from './components/ChallengeTracker';
import { ScienceGuide } from './components/ScienceGuide';
import { BottomTabBar } from './components/BottomTabBar';
import { OledSleepCover } from './components/OledSleepCover';
import { useSleepEntrainment } from './hooks/useSleepEntrainment';
import { SessionSettings, ActiveTab, ChallengeEntry } from './types';

const DEFAULT_SETTINGS: SessionSettings = {
  durationSeconds: 180, // 3-minute TEDx challenge default
  startBpm: 68,         // Ticking stopwatch / relaxed baseline
  endBpm: 36,           // Deep delta/theta entrainment
  decelerationCurve: 'smooth', // Continuous linear deceleration by default
  soundPreset: 'lap-drum',
  soundVolume: 0.85,
  ambientPreset: 'none',
  ambientVolume: 0.35,
  stereoPanning: true,
  vibrationIntensity: 'gentle',
  breathingMode: 'jim-4-4',
  oledPitchBlack: false,
  keepScreenAwake: true,
};

const DEFAULT_CHALLENGE: ChallengeEntry[] = [
  { day: 1, completed: false, durationMinutes: 3 },
  { day: 2, completed: false, durationMinutes: 3 },
  { day: 3, completed: false, durationMinutes: 3 },
  { day: 4, completed: false, durationMinutes: 3 },
  { day: 5, completed: false, durationMinutes: 3 },
];

export default function App() {
  // Load settings from localStorage
  const [settings, setSettings] = useState<SessionSettings>(() => {
    try {
      const saved = localStorage.getItem('braintap_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure decelerationCurve defaults to smooth if previously defaulted to stepped
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          decelerationCurve: parsed.decelerationCurve || 'smooth',
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Load 5-night challenge data
  const [challengeEntries, setChallengeEntries] = useState<ChallengeEntry[]>(() => {
    try {
      const saved = localStorage.getItem('braintap_challenge');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CHALLENGE;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('session');
  const [showCompletionToast, setShowCompletionToast] = useState(false);

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem('braintap_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Save challenge entries when changed
  useEffect(() => {
    try {
      localStorage.setItem('braintap_challenge', JSON.stringify(challengeEntries));
    } catch {
      // ignore
    }
  }, [challengeEntries]);

  // Handle session completion
  const handleSessionComplete = () => {
    setShowCompletionToast(true);
    // Automatically suggest recording night if on 3-min+ session
    if (settings.durationSeconds >= 180) {
      setTimeout(() => {
        // Find first incomplete day
        const firstIncomplete = challengeEntries.find((e) => !e.completed);
        if (firstIncomplete) {
          const nowStr = new Date().toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });
          setChallengeEntries((prev) =>
            prev.map((e) =>
              e.day === firstIncomplete.day
                ? {
                    ...e,
                    completed: true,
                    dateCompleted: nowStr,
                    notes: 'Completed 3+ min brain tapping session.',
                    sleepQuality: 5,
                  }
                : e
            )
          );
        }
      }, 1000);
    }
  };

  const {
    isPlaying,
    isPaused,
    timeRemaining,
    totalDuration,
    progress,
    currentBpm,
    currentSide,
    breathState,
    announcement,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    triggerManualTap,
  } = useSleepEntrainment(settings, handleSessionComplete);

  const handleSelectDuration = (seconds: number) => {
    setSettings((prev) => ({ ...prev, durationSeconds: seconds }));
  };

  const handleToggleOled = () => {
    setSettings((prev) => ({ ...prev, oledPitchBlack: !prev.oledPitchBlack }));
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const handleCompleteNight = (day: number, rating: 1 | 2 | 3 | 4 | 5, notes: string) => {
    const dateStr = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    setChallengeEntries((prev) =>
      prev.map((e) =>
        e.day === day
          ? {
              ...e,
              completed: true,
              dateCompleted: dateStr,
              sleepQuality: rating,
              notes,
            }
          : e
      )
    );
  };

  const handleResetChallenge = () => {
    if (window.confirm('Reset your 5-Night Challenge progress?')) {
      setChallengeEntries(DEFAULT_CHALLENGE);
    }
  };

  const handleLaunchChallengeSession = () => {
    setSettings((prev) => ({ ...prev, durationSeconds: 180 }));
    setActiveTab('session');
    setTimeout(() => {
      startSession();
    }, 150);
  };

  const handleTestDeceleration = () => {
    setSettings((prev) => ({ ...prev, durationSeconds: 15 }));
    setActiveTab('session');
    setTimeout(() => {
      startSession();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/20">
      {/* OLED Pitch-black Fullscreen Overlay */}
      {settings.oledPitchBlack && (
        <OledSleepCover
          onExit={handleToggleOled}
          timeRemaining={timeRemaining}
          currentBpm={currentBpm}
          currentSide={currentSide}
          breathState={breathState}
          isPlaying={isPlaying}
        />
      )}

      {/* Top Navigation */}
      <Header
        oledPitchBlack={settings.oledPitchBlack}
        onToggleOled={handleToggleOled}
        vibrationIntensity={settings.vibrationIntensity}
        currentBpm={currentBpm}
        isPlaying={isPlaying}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-start pb-24 overflow-y-auto">
        {/* Completion Banner */}
        {showCompletionToast && (
          <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-in fade-in duration-300">
            <div>
              <p className="font-semibold text-emerald-100">Session complete. Sweet dreams!</p>
              <p className="text-[11px] text-emerald-300/80">
                Your brain is entrained to deep rest. Lay back and relax.
              </p>
            </div>
            <button
              onClick={() => setShowCompletionToast(false)}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/60 text-emerald-200 text-xs hover:bg-emerald-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Active Entrainment Session */}
        {activeTab === 'session' && (
          <div className="flex-1 flex flex-col justify-start sm:justify-between px-4 py-2 space-y-3">
            {/* Bilateral Hands/Lap Pads */}
            <BilateralPads
              currentSide={currentSide}
              isPlaying={isPlaying}
              stereoPanning={settings.stereoPanning}
              onManualTap={triggerManualTap}
              soundName={settings.soundPreset}
            />

            {/* Breathing Pacer ring */}
            <BreathingPacer
              breathState={breathState}
              breathingMode={settings.breathingMode}
              isPlaying={isPlaying}
              announcement={announcement}
            />

            {/* Session Controls (Play/Pause, Countdown, BPM, Duration) */}
            <SessionControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              timeRemaining={timeRemaining}
              totalDuration={totalDuration}
              progress={progress}
              currentBpm={currentBpm}
              settings={settings}
              onStart={startSession}
              onPause={pauseSession}
              onResume={resumeSession}
              onStop={stopSession}
              onSelectDuration={handleSelectDuration}
            />
          </div>
        )}

        {/* Tab 2: Customization (Sound, Tempo, Vibration, Ambient) */}
        {activeTab === 'customize' && (
          <CustomizeTab
            settings={settings}
            onUpdateSettings={setSettings}
            onResetDefaults={handleResetDefaults}
            onTestDeceleration={handleTestDeceleration}
          />
        )}

        {/* Tab 3: 5-Night Challenge Tracker */}
        {activeTab === 'challenge' && (
          <ChallengeTracker
            challengeEntries={challengeEntries}
            onCompleteNight={handleCompleteNight}
            onResetChallenge={handleResetChallenge}
            onLaunchChallengeSession={handleLaunchChallengeSession}
          />
        )}

        {/* Tab 4: Science & TEDx Story */}
        {activeTab === 'science' && (
          <ScienceGuide onStartPractice={() => setActiveTab('session')} />
        )}
      </main>

      {/* Ergonomic Mobile Bottom Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setShowCompletionToast(false);
        }}
        isPlaying={isPlaying}
      />
    </div>
  );
}
