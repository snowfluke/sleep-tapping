export type SoundPreset = 
  | 'lap-drum'      // Jim Donovan's lap drum patting
  | 'stopwatch'     // Ticking pocket watch ("speed of a ticking stopwatch")
  | 'raindrop'      // Gentle rhythmic water droplets
  | 'singing-bowl'  // Warm Tibetan singing bowl tone
  | 'heartbeat'     // Organic soothing heartbeat
  | 'soft-wood';    // Warm acoustic marimba/woodblock

export type AmbientPreset =
  | 'none'
  | 'brown-noise'   // Deep warm rumble for sleep
  | 'pink-noise'    // Balanced soothing white noise
  | 'gentle-rain'   // Soft bedroom night rain
  | 'night-crickets'; // Distant tranquil summer night

export type BreathingMode =
  | 'jim-4-4'       // Jim Donovan's 4-count in, 4-count out
  | 'relax-4-7-8'   // In 4, Hold 7, Exhale 8
  | 'box-4-4-4-4'   // Box breathing
  | 'off';

export type DecelerationCurve = 'smooth' | 'stepped' | 'gentle-late';

export type VibrationIntensity = 'off' | 'gentle' | 'firm';

export interface SessionSettings {
  durationSeconds: number;      // e.g. 180 (3 min), 300 (5 min), 600 (10 min), 30 (demo)
  startBpm: number;             // Default 68 BPM (speed of ticking stopwatch/relaxed pulse)
  endBpm: number;               // Default 36 BPM (slow delta/theta entrainment)
  decelerationCurve: DecelerationCurve;
  soundPreset: SoundPreset;
  soundVolume: number;          // 0 to 1
  ambientPreset: AmbientPreset;
  ambientVolume: number;        // 0 to 1
  stereoPanning: boolean;       // Alternate Left/Right ear in headphones
  vibrationIntensity: VibrationIntensity;
  breathingMode: BreathingMode;
  oledPitchBlack: boolean;
  keepScreenAwake: boolean;
}

export type ActiveTab = 'session' | 'customize' | 'challenge' | 'science';

export interface ChallengeEntry {
  day: number;                  // 1 to 5
  completed: boolean;
  dateCompleted?: string;
  durationMinutes: number;
  notes?: string;
  sleepQuality?: 1 | 2 | 3 | 4 | 5; // 1 to 5 stars
}

export interface BreathState {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  count: number;
  totalCounts: number;
  instruction: string;
}
