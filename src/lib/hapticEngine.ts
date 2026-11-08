import { VibrationIntensity } from '../types';

class HapticEngine {
  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  }

  public triggerTap(side: 'left' | 'right', intensity: VibrationIntensity): void {
    if (intensity === 'off' || !this.isSupported()) return;

    try {
      if (intensity === 'gentle') {
        // Crisp gentle tactile tick (16ms)
        navigator.vibrate(16);
      } else if (intensity === 'firm') {
        // Slightly firmer pulse (32ms)
        navigator.vibrate(32);
      }
    } catch {
      // Ignore vibration error if blocked by user permissions
    }
  }

  public test(intensity: VibrationIntensity): boolean {
    if (intensity === 'off') return false;
    if (!this.isSupported()) return false;

    try {
      const duration = intensity === 'gentle' ? 22 : 40;
      return navigator.vibrate([duration, 40, duration]);
    } catch {
      return false;
    }
  }
}

export const hapticEngine = new HapticEngine();
