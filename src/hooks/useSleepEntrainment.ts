import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionSettings, BreathState } from '../types';
import { sleepAudio } from '../lib/audioEngine';
import { hapticEngine } from '../lib/hapticEngine';
import { tempoAt } from '../lib/tempoCurve';

export interface EntrainmentStatus {
  isPlaying: boolean;
  isPaused: boolean;
  timeRemaining: number;
  totalDuration: number;
  progress: number;
  currentBpm: number;
  currentSide: 'left' | 'right';
  tapCount: number;
  breathState: BreathState;
  announcement: string;
}

export function useSleepEntrainment(settings: SessionSettings, onSessionComplete?: () => void) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(settings.durationSeconds);
  const [currentBpm, setCurrentBpm] = useState(settings.startBpm);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');
  const [tapCount, setTapCount] = useState(0);
  const [announcement, setAnnouncement] = useState('Ready to begin');

  // Breathing state
  const [breathState, setBreathState] = useState<BreathState>({
    phase: 'inhale',
    count: 1,
    totalCounts: 4,
    instruction: 'Settle in and breathe gently',
  });

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const onSessionCompleteRef = useRef(onSessionComplete);
  onSessionCompleteRef.current = onSessionComplete;

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const nextBeatTimeRef = useRef<number>(0);
  const currentSideRef = useRef<'left' | 'right'>('left');
  const tapCountRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const timerFrameRef = useRef<number | null>(null);

  // Calculate breath guidance given breath mode and beat count
  const calculateBreath = useCallback((count: number, cfg: SessionSettings, bpm: number, isEnding: boolean): BreathState => {
    if (cfg.breathingMode === 'off') {
      return { phase: 'inhale', count: 1, totalCounts: 4, instruction: 'Breathe naturally' };
    }

    if (isEnding) {
      return { phase: 'exhale', count: 4, totalCounts: 4, instruction: 'Relax and let go' };
    }

    if (cfg.breathingMode === 'jim-4-4') {
      // Jim Donovan's 4 counts in, 4 counts out
      const cycle = 8;
      const step = (count % cycle); // 0..7
      if (step < 4) {
        const currentCount = step + 1;
        return {
          phase: 'inhale',
          count: currentCount,
          totalCounts: 4,
          instruction: currentCount === 1 ? 'Breathe in slowly' : `Inhale · ${currentCount}`,
        };
      } else {
        const currentCount = step - 4 + 1;
        return {
          phase: 'exhale',
          count: currentCount,
          totalCounts: 4,
          instruction: currentCount === 1 ? 'Breathe out slowly' : `Exhale · ${currentCount}`,
        };
      }
    } else if (cfg.breathingMode === 'relax-4-7-8') {
      // 4 in, 7 hold, 8 out
      const cycle = 19;
      const step = count % cycle;
      if (step < 4) {
        return { phase: 'inhale', count: step + 1, totalCounts: 4, instruction: `Breathe in · ${step + 1}` };
      } else if (step < 11) {
        return { phase: 'hold', count: step - 4 + 1, totalCounts: 7, instruction: `Gently hold · ${step - 4 + 1}` };
      } else {
        return { phase: 'exhale', count: step - 11 + 1, totalCounts: 8, instruction: `Slowly release · ${step - 11 + 1}` };
      }
    } else if (cfg.breathingMode === 'box-4-4-4-4') {
      const cycle = 16;
      const step = count % cycle;
      if (step < 4) {
        return { phase: 'inhale', count: step + 1, totalCounts: 4, instruction: `Inhale · ${step + 1}` };
      } else if (step < 8) {
        return { phase: 'hold', count: step - 4 + 1, totalCounts: 4, instruction: `Hold · ${step - 4 + 1}` };
      } else if (step < 12) {
        return { phase: 'exhale', count: step - 8 + 1, totalCounts: 4, instruction: `Exhale · ${step - 8 + 1}` };
      } else {
        return { phase: 'pause', count: step - 12 + 1, totalCounts: 4, instruction: `Pause · ${step - 12 + 1}` };
      }
    }

    return { phase: 'inhale', count: 1, totalCounts: 4, instruction: 'Breathe gently' };
  }, []);

  // Request Wake Lock to prevent phone screen from timing out during sleep meditation
  const acquireWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      // Wake lock not supported or blocked
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release();
      } catch {
        // ignore
      }
      wakeLockRef.current = null;
    }
  };

  // Main high-resolution scheduler loop
  const runScheduler = useCallback(() => {
    if (!isPlayingRef.current || isPausedRef.current) return;

    const now = performance.now();
    const cfg = settingsRef.current;
    const elapsedSeconds = (now - sessionStartTimeRef.current) / 1000;
    const remaining = Math.max(0, cfg.durationSeconds - elapsedSeconds);
    const progress = Math.min(1, elapsedSeconds / cfg.durationSeconds);

    setTimeRemaining(remaining);

    // Calculate current decelerated tempo
    const computedBpm = tempoAt(progress, cfg);
    setCurrentBpm(Math.round(computedBpm));

    // Check if session has ended
    if (remaining <= 0) {
      stopSession();
      setAnnouncement('Session complete');
      if (onSessionCompleteRef.current) {
        onSessionCompleteRef.current();
      }
      return;
    }

    // Dynamic announcements matching Jim Donovan's prompts
    if (progress > 0.93) {
      setAnnouncement('Slow it down again');
    } else if (progress > 0.78) {
      setAnnouncement('Now slow the tapping down');
    } else if (progress > 0.12) {
      setAnnouncement(`Slowing toward ${cfg.endBpm} BPM`);
    } else {
      setAnnouncement('Tap right, left, right, left');
    }

    // Schedule next beat if time has arrived
    if (now >= nextBeatTimeRef.current) {
      const side = currentSideRef.current === 'left' ? 'right' : 'left';
      currentSideRef.current = side;
      setCurrentSide(side);

      tapCountRef.current += 1;
      setTapCount(tapCountRef.current);

      // Play synthesized audio tap
      sleepAudio.playTap(side, cfg.soundPreset, cfg.stereoPanning, cfg.soundVolume);

      // Trigger mobile haptic pulse
      hapticEngine.triggerTap(side, cfg.vibrationIntensity);

      // Update breathing guidance
      const isFinishing = progress > 0.95;
      const bState = calculateBreath(tapCountRef.current, cfg, computedBpm, isFinishing);
      setBreathState(bState);

      // Schedule next interval (seconds per beat = 60 / currentBpm)
      const beatIntervalMs = (60 / computedBpm) * 1000;
      nextBeatTimeRef.current = now + beatIntervalMs;
    }

    timerFrameRef.current = requestAnimationFrame(runScheduler);
  }, [calculateBreath]);

  // Start session
  const startSession = async () => {
    await sleepAudio.resume();
    const cfg = settingsRef.current;

    // Start ambient track if chosen
    if (cfg.ambientPreset !== 'none') {
      sleepAudio.setAmbient(cfg.ambientPreset, cfg.ambientVolume);
    } else {
      sleepAudio.stopAmbient();
    }

    if (cfg.keepScreenAwake) {
      acquireWakeLock();
    }

    const now = performance.now();
    sessionStartTimeRef.current = now;
    nextBeatTimeRef.current = now; // trigger first beat immediately
    currentSideRef.current = 'left';
    tapCountRef.current = 0;
    isPlayingRef.current = true;
    isPausedRef.current = false;

    setIsPlaying(true);
    setIsPaused(false);
    setTimeRemaining(cfg.durationSeconds);
    setCurrentBpm(cfg.startBpm);
    setCurrentSide('left');
    setTapCount(0);
    setAnnouncement('Tap gently on your lap');

    timerFrameRef.current = requestAnimationFrame(runScheduler);
  };

  // Pause session
  const pauseSession = () => {
    isPausedRef.current = true;
    setIsPaused(true);
    if (timerFrameRef.current) {
      cancelAnimationFrame(timerFrameRef.current);
      timerFrameRef.current = null;
    }
  };

  // Resume paused session
  const resumeSession = () => {
    if (!isPlayingRef.current) {
      startSession();
      return;
    }
    const cfg = settingsRef.current;
    // Adjust start time to account for elapsed time
    const elapsedSoFar = cfg.durationSeconds - timeRemaining;
    sessionStartTimeRef.current = performance.now() - elapsedSoFar * 1000;
    nextBeatTimeRef.current = performance.now();

    isPausedRef.current = false;
    setIsPaused(false);
    timerFrameRef.current = requestAnimationFrame(runScheduler);
  };

  // Stop session
  const stopSession = () => {
    isPlayingRef.current = false;
    isPausedRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);

    if (timerFrameRef.current) {
      cancelAnimationFrame(timerFrameRef.current);
      timerFrameRef.current = null;
    }

    sleepAudio.stopAmbient();
    releaseWakeLock();
    setTimeRemaining(settingsRef.current.durationSeconds);
    setCurrentBpm(settingsRef.current.startBpm);
  };

  // Single manual tap (for interactive tap-along practice)
  const triggerManualTap = (side: 'left' | 'right') => {
    const cfg = settingsRef.current;
    sleepAudio.resume();
    sleepAudio.playTap(side, cfg.soundPreset, cfg.stereoPanning, cfg.soundVolume);
    hapticEngine.triggerTap(side, cfg.vibrationIntensity);
    setCurrentSide(side);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerFrameRef.current) {
        cancelAnimationFrame(timerFrameRef.current);
      }
      sleepAudio.stopAmbient();
      releaseWakeLock();
    };
  }, []);

  // Sync remaining time and start BPM when settings change while stopped
  useEffect(() => {
    if (!isPlayingRef.current) {
      setTimeRemaining(settings.durationSeconds);
      setCurrentBpm(settings.startBpm);
    }
  }, [settings.durationSeconds, settings.startBpm]);

  // Update ambient volume/preset if settings change mid-session
  useEffect(() => {
    if (isPlaying && !isPaused) {
      sleepAudio.setSoundVolume(settings.soundVolume);
      if (settings.ambientPreset !== 'none') {
        sleepAudio.setAmbient(settings.ambientPreset, settings.ambientVolume);
      } else {
        sleepAudio.stopAmbient();
      }
    }
  }, [settings.ambientPreset, settings.ambientVolume, settings.soundVolume, isPlaying, isPaused]);

  const progress = settings.durationSeconds > 0
    ? Math.min(1, Math.max(0, 1 - timeRemaining / settings.durationSeconds))
    : 0;

  return {
    isPlaying,
    isPaused,
    timeRemaining,
    totalDuration: settings.durationSeconds,
    progress,
    currentBpm,
    currentSide,
    tapCount,
    breathState,
    announcement,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    triggerManualTap,
  };
}
