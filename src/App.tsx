import { useState, useEffect } from 'react';
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

const SETTINGS_KEY = 'sleep-tapping:settings';
const CHALLENGE_KEY = 'sleep-tapping:challenge';

export default function App() {
  // Load settings from localStorage
  const [settings, setSettings] = useState<SessionSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
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
      const saved = localStorage.getItem(CHALLENGE_KEY);
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
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Save challenge entries when changed
  useEffect(() => {
    try {
      localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challengeEntries));
    } catch {
      // ignore
    }
  }, [challengeEntries]);

  // Handle session completion
  const handleSessionComplete = () => {
    setShowCompletionToast(true);
    // A 3-minute or longer session counts as a challenge night. The rating and notes stay empty for the user.
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
    if (window.confirm('Reset your 5-night challenge progress?')) {
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
    <div className="flex min-h-screen flex-col bg-night-1 text-ink-1">
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

      <Header
        onToggleOled={handleToggleOled}
        currentBpm={currentBpm}
        currentSide={currentSide}
        isPlaying={isPlaying}
      />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col tall:pb-24">
        {showCompletionToast && (
          <div
            role="status"
            className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-night-2 p-4"
          >
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-ink-1">Session complete</p>
              <p className="text-sm text-ink-2">Lie back and let sleep come</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCompletionToast(false)}
              className="h-9 rounded-lg px-3 text-sm text-ink-2 transition-colors duration-150 hover:bg-night-3 hover:text-ink-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === 'session' && (
          <div className="flex flex-col gap-6 px-4 py-4">
            <BilateralPads
              currentSide={currentSide}
              isPlaying={isPlaying}
              stereoPanning={settings.stereoPanning}
              onManualTap={triggerManualTap}
            />
            <BreathingPacer
              breathState={breathState}
              breathingMode={settings.breathingMode}
              isPlaying={isPlaying}
              announcement={announcement}
            />
            <SessionControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              timeRemaining={timeRemaining}
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

        {activeTab === 'customize' && (
          <CustomizeTab
            settings={settings}
            onUpdateSettings={setSettings}
            onResetDefaults={handleResetDefaults}
            onTestDeceleration={handleTestDeceleration}
          />
        )}

        {activeTab === 'challenge' && (
          <ChallengeTracker
            challengeEntries={challengeEntries}
            onCompleteNight={handleCompleteNight}
            onResetChallenge={handleResetChallenge}
            onLaunchChallengeSession={handleLaunchChallengeSession}
          />
        )}

        {activeTab === 'science' && <ScienceGuide onStartPractice={() => setActiveTab('session')} />}
      </main>

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
