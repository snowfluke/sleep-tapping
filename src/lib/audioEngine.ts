import { SoundPreset, AmbientPreset } from '../types';

class SleepAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioNode | null = null;
  private currentAmbientPreset: AmbientPreset = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Sound (tapping) bus
      this.soundGain = this.ctx.createGain();
      this.soundGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.soundGain.connect(this.masterGain);

      // Ambient bus
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public async resume(): Promise<void> {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public setSoundVolume(volume: number): void {
    if (this.soundGain && this.ctx) {
      this.soundGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public setAmbientVolume(volume: number): void {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Play a single rhythm tap on either the 'left' or 'right' side
   */
  public playTap(
    side: 'left' | 'right',
    preset: SoundPreset,
    stereoPanning: boolean,
    volumeScale: number = 1.0
  ): void {
    this.initContext();
    if (!this.ctx || !this.soundGain) return;

    const now = this.ctx.currentTime;
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    if (panner) {
      const targetPan = stereoPanning ? (side === 'left' ? -0.75 : 0.75) : 0;
      panner.pan.setValueAtTime(targetPan, now);
      panner.connect(this.soundGain);
    }

    const outputDestination: AudioNode = panner || this.soundGain;

    switch (preset) {
      case 'lap-drum':
        this.synthLapDrum(now, side, outputDestination, volumeScale);
        break;
      case 'stopwatch':
        this.synthStopwatch(now, side, outputDestination, volumeScale);
        break;
      case 'raindrop':
        this.synthRaindrop(now, side, outputDestination, volumeScale);
        break;
      case 'singing-bowl':
        this.synthSingingBowl(now, side, outputDestination, volumeScale);
        break;
      case 'heartbeat':
        this.synthHeartbeat(now, side, outputDestination, volumeScale);
        break;
      case 'soft-wood':
        this.synthSoftWood(now, side, outputDestination, volumeScale);
        break;
      default:
        this.synthLapDrum(now, side, outputDestination, volumeScale);
    }
  }

  /**
   * Warm lap patting sound - hands lightly drumming on thighs
   * Characterized by warm low sine thud with very subtle skin contact transient
   */
  private synthLapDrum(time: number, side: 'left' | 'right', dest: AudioNode, vol: number) {
    if (!this.ctx) return;

    // Body oscillator (thud)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Subtle pitch differentiation between left and right hand for tactile realism
    const startFreq = side === 'left' ? 125 : 132;
    const endFreq = side === 'left' ? 42 : 46;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.9 * vol, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.2);

    // Subtle acoustic skin tap noise
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(450, time);
    noiseFilter.Q.setValueAtTime(1.5, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18 * vol, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);

    noiseSource.start(time);
  }

  /**
   * Mechanical stopwatch tick - crisp, metallic, tranquil
   */
  private synthStopwatch(time: number, side: 'left' | 'right', dest: AudioNode, vol: number) {
    if (!this.ctx) return;

    // High mechanical tick (left = tick, right = tock)
    const baseFreq = side === 'left' ? 3600 : 3200;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, time + 0.025);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, time);
    filter.Q.setValueAtTime(6.0, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.6 * vol, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.04);

    // Subtle wooden body resonate
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(side === 'left' ? 620 : 580, time);
    bodyGain.gain.setValueAtTime(0.25 * vol, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(dest);

    bodyOsc.start(time);
    bodyOsc.stop(time + 0.035);
  }

  /**
   * Water droplet / gentle raindrop
   */
  private synthRaindrop(time: number, side: 'left' | 'right', dest: AudioNode, vol: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startF = side === 'left' ? 780 : 860;
    const peakF = side === 'left' ? 1220 : 1380;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startF, time);
    osc.frequency.exponentialRampToValueAtTime(peakF, time + 0.04);
    osc.frequency.exponentialRampToValueAtTime(peakF * 0.9, time + 0.08);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.55 * vol, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.12);
  }

  /**
   * Tibetan singing bowl harmonic strike
   */
  private synthSingingBowl(time: number, side: 'left' | 'right', dest: AudioNode, vol: number) {
    if (!this.ctx) return;

    const fundamental = side === 'left' ? 216 : 243;
    const partials = [1, 2.76, 5.4];
    const amplitudes = [0.65, 0.25, 0.1];

    partials.forEach((mult, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * mult, time);

      const amp = amplitudes[i] * vol * 0.6;
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(amp, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.65);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(time);
      osc.stop(time + 0.7);
    });
  }

  /**
   * Soft heartbeat lub-dub
   */
  private synthHeartbeat(time: number, side: 'left' | 'right', dest: AudioNode, vol: number) {
    if (!this.ctx) return;

    const playThump = (t: number, f: number, a: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.11);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(a * vol, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 0.15);
    };

    if (side === 'left') {
      playThump(time, 65, 0.8);
    } else {
      playThump(time, 52, 0.65);
    }
  }

  /**
   * Acoustic soft wood / marimba
   */
  private synthSoftWood(time: number, side: 'left' | 'right', dest: AudioNode, vol: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const freq = side === 'left' ? 392 : 440; // G4 / A4

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, time);
    filter.Q.setValueAtTime(4.0, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.6 * vol, time + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.13);
  }

  /**
   * Setup continuous ambient sleep background (Brown noise, Pink noise, Rain, Night crickets)
   */
  public setAmbient(preset: AmbientPreset, volume: number = 0.35): void {
    this.initContext();
    if (!this.ctx || !this.ambientGain) return;

    if (this.currentAmbientPreset === preset && this.ambientSource) {
      this.setAmbientVolume(volume);
      return;
    }

    // Stop existing ambient
    this.stopAmbient();
    this.currentAmbientPreset = preset;

    if (preset === 'none') return;

    this.setAmbientVolume(volume);

    if (preset === 'brown-noise' || preset === 'pink-noise') {
      this.startContinuousNoise(preset);
    } else if (preset === 'gentle-rain') {
      this.startGentleRain();
    } else if (preset === 'night-crickets') {
      this.startNightCrickets();
    }
  }

  public stopAmbient(): void {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop();
      } catch {
        // ignore if already stopped
      }
      this.ambientSource.disconnect();
      this.ambientSource = null;
    }
    this.currentAmbientPreset = 'none';
  }

  private startContinuousNoise(type: 'brown-noise' | 'pink-noise') {
    if (!this.ctx || !this.ambientGain) return;

    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 5; // 5-second seamless loop
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'brown-noise') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5; // Gain compensation
      }
    } else {
      // Pink noise (Paul Kellet's filter method)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(type === 'brown-noise' ? 450 : 800, this.ctx.currentTime);

    source.connect(lowpass);
    lowpass.connect(this.ambientGain);

    source.start();
    this.ambientSource = source;
  }

  private startGentleRain() {
    if (!this.ctx || !this.ambientGain) return;

    // Rain bed: pink noise with lowpass and random amplitude variation
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 4;
    const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    for (let i = 0; i < bufferSize; i++) {
      left[i] = (Math.random() * 2 - 1) * 0.2;
      right[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(this.ambientGain);

    source.start();
    this.ambientSource = source;
  }

  private startNightCrickets() {
    if (!this.ctx || !this.ambientGain) return;

    // Soft warm crickets ambiance using rhythmic gentle sinusoidal chirps
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      // 3 chirps every second
      const chirpEnvelope = Math.max(0, Math.sin(t * Math.PI * 6)) * (Math.sin(t * Math.PI * 48) > 0 ? 0.08 : 0);
      data[i] = chirpEnvelope * (Math.sin(t * 2 * Math.PI * 4500) + Math.sin(t * 2 * Math.PI * 4750) * 0.5);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4600, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(this.ambientGain);

    source.start();
    this.ambientSource = source;
  }
}

export const sleepAudio = new SleepAudioEngine();
