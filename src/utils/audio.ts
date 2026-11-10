// Peaceful & Beautiful Web Audio API Synthesizer (Zero External 404 Dependencies)
// Features: Soft airy nature breeze, gentle organic bird chirps, delicate wind chimes,
// dreamy ambient electronic pad, and refined soft sound effects.

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7; // Master volume: 0.0 to 1.0

  // Master & Ambient Nodes
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  // Ambient sound source nodes
  private padOscs: OscillatorNode[] = [];
  private padGain: GainNode | null = null;
  private breezeNode: AudioBufferSourceNode | null = null;
  private breezeFilter: BiquadFilterNode | null = null;
  private breezeGain: GainNode | null = null;

  // Ambient timers
  private birdTimer: number | null = null;
  private chimeTimer: number | null = null;
  private lastFootstepTime: number = 0;
  private isAmbientRunning: boolean = false;

  constructor() {
    // Restore user preferences from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const savedMuted = localStorage.getItem('ayush_portfolio_muted');
        if (savedMuted !== null) {
          this.isMuted = savedMuted === 'true';
        }
        const savedVol = localStorage.getItem('ayush_portfolio_volume');
        if (savedVol !== null) {
          const parsed = parseFloat(savedVol);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.volume = parsed;
          }
        }
      } catch {
        // localStorage guard
      }
    }
  }

  private initContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx !== null;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('ayush_portfolio_muted', String(muted));
    } catch {}

    if (!muted && !this.isAmbientRunning) {
      this.startAmbient();
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : this.volume, now + 0.15);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('ayush_portfolio_volume', String(this.volume));
    } catch {}

    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
      try {
        localStorage.setItem('ayush_portfolio_muted', 'false');
      } catch {}
      if (!this.isAmbientRunning) {
        this.startAmbient();
      }
    }

    if (this.ctx && this.masterGain && !this.isMuted) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.08);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // ─────────────────────────────────────────────────────────────
  // PEACEFUL BACKGROUND AMBIENCE (Airy breeze + Dreamy pad + Birds + Chimes)
  // ─────────────────────────────────────────────────────────────
  public startAmbient() {
    if (this.isAmbientRunning) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    this.isAmbientRunning = true;

    try {
      const now = this.ctx.currentTime;

      // Master Ambient Bus
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(1.0, now + 2.5); // Smooth 2.5s fade-in
      this.ambientGain.connect(this.masterGain);

      // 1. Gentle Airy Environmental Breeze (Soft filtered low-noise wave)
      const breezeBufferSize = this.ctx.sampleRate * 4;
      const breezeBuffer = this.ctx.createBuffer(1, breezeBufferSize, this.ctx.sampleRate);
      const data = breezeBuffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < breezeBufferSize; i++) {
        // Brown noise integration for warm, soft outdoor breeze
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + 0.02 * white) / 1.02;
        data[i] = lastVal * 1.8;
      }

      this.breezeNode = this.ctx.createBufferSource();
      this.breezeNode.buffer = breezeBuffer;
      this.breezeNode.loop = true;

      this.breezeFilter = this.ctx.createBiquadFilter();
      this.breezeFilter.type = 'lowpass';
      this.breezeFilter.frequency.setValueAtTime(260, now);

      this.breezeGain = this.ctx.createGain();
      this.breezeGain.gain.setValueAtTime(0.018, now); // Very gentle and soothing

      this.breezeNode.connect(this.breezeFilter);
      this.breezeFilter.connect(this.breezeGain);
      this.breezeGain.connect(this.ambientGain);
      this.breezeNode.start();

      // 2. Dreamy Ambient Electronic Texture (Soft warm Fmaj9 / Cmaj7 chord)
      // Notes: F3 (174.61Hz), A3 (220.00Hz), C4 (261.63Hz), E4 (329.63Hz)
      const padFrequencies = [174.61, 220.00, 261.63, 329.63];
      this.padGain = this.ctx.createGain();
      this.padGain.gain.setValueAtTime(0.016, now); // Low, non-intrusive volume

      const padFilter = this.ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(420, now);

      this.padOscs = padFrequencies.map((freq) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(padFilter);
        osc.start();
        return osc;
      });

      padFilter.connect(this.padGain);
      this.padGain.connect(this.ambientGain);

      // 3. Schedule gentle organic bird chirping & delicate wind chimes
      this.scheduleNextBirdChirp();
      this.scheduleNextWindChime();
    } catch {
      // Audio safety guard
    }
  }

  public stopAmbient() {
    this.isAmbientRunning = false;
    if (this.birdTimer) {
      window.clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.chimeTimer) {
      window.clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    if (this.ctx && this.ambientGain) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.linearRampToValueAtTime(0, now + 0.8);
      setTimeout(() => {
        this.padOscs.forEach((osc) => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
        this.padOscs = [];
        try { this.breezeNode?.stop(); this.breezeNode?.disconnect(); } catch {}
        this.breezeNode = null;
        this.ambientGain?.disconnect();
        this.ambientGain = null;
      }, 850);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // GENTLE NATURAL BIRD CHIRP SYNTHESIZER (Randomized & Organic)
  // ─────────────────────────────────────────────────────────────
  private scheduleNextBirdChirp() {
    if (!this.isAmbientRunning) return;
    // Occasional, pleasant intervals: 7 to 16 seconds
    const delayMs = 7000 + Math.random() * 9000;
    this.birdTimer = window.setTimeout(() => {
      this.playGentleBirdChirp();
      this.scheduleNextBirdChirp();
    }, delayMs);
  }

  private playGentleBirdChirp() {
    if (this.isMuted || !this.ctx || !this.ambientGain) return;

    try {
      const now = this.ctx.currentTime;
      const numChirps = 2 + Math.floor(Math.random() * 2); // 2 or 3 chirps
      const baseFreq = 2200 + Math.random() * 600;

      for (let i = 0; i < numChirps; i++) {
        const chirpStart = now + i * (0.09 + Math.random() * 0.05);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // Organic rising and falling bird vocalization
        const peakFreq = baseFreq + 400 + Math.random() * 300;
        osc.frequency.setValueAtTime(baseFreq, chirpStart);
        osc.frequency.linearRampToValueAtTime(peakFreq, chirpStart + 0.035);
        osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, chirpStart + 0.075);

        // Soft volume envelope
        gain.gain.setValueAtTime(0, chirpStart);
        gain.gain.linearRampToValueAtTime(0.018, chirpStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0005, chirpStart + 0.08);

        osc.connect(gain);
        gain.connect(this.ambientGain);

        osc.start(chirpStart);
        osc.stop(chirpStart + 0.085);
      }
    } catch {
      // Audio safety guard
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DELICATE WIND CHIMES (Pentatonic crystalline bells)
  // ─────────────────────────────────────────────────────────────
  private scheduleNextWindChime() {
    if (!this.isAmbientRunning) return;
    // Every 14 to 26 seconds
    const delayMs = 14000 + Math.random() * 12000;
    this.chimeTimer = window.setTimeout(() => {
      this.playDelicateWindChime();
      this.scheduleNextWindChime();
    }, delayMs);
  }

  private playDelicateWindChime() {
    if (this.isMuted || !this.ctx || !this.ambientGain) return;

    try {
      const now = this.ctx.currentTime;
      // High pentatonic scale: E5 (659.25Hz), G5 (783.99Hz), A5 (880Hz), B5 (987.77Hz), D6 (1174.66Hz)
      const pentatonic = [659.25, 783.99, 880.0, 987.77, 1174.66];
      const count = 1 + Math.floor(Math.random() * 2);

      for (let c = 0; c < count; c++) {
        const chimeStart = now + c * (0.16 + Math.random() * 0.12);
        const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chimeStart);

        gain.gain.setValueAtTime(0, chimeStart);
        gain.gain.linearRampToValueAtTime(0.015, chimeStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0005, chimeStart + 1.2); // Gentle resonance decay

        osc.connect(gain);
        gain.connect(this.ambientGain);

        osc.start(chimeStart);
        osc.stop(chimeStart + 1.25);
      }
    } catch {
      // Audio safety guard
    }
  }

  // ─────────────────────────────────────────────────────────────
  // REFINED SOUND EFFECTS (Gentle, satisfying, non-intrusive)
  // ─────────────────────────────────────────────────────────────

  // Subtle soft footstep: low-frequency gentle thud (no harsh click)
  public playFootstep() {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastFootstepTime < 340) return;
    this.lastFootstepTime = now;

    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      const audioNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const pitch = 55 + Math.random() * 12;
      osc.frequency.setValueAtTime(pitch, audioNow);
      osc.frequency.exponentialRampToValueAtTime(28, audioNow + 0.07);

      gain.gain.setValueAtTime(0.035, audioNow);
      gain.gain.exponentialRampToValueAtTime(0.0005, audioNow + 0.075);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(audioNow);
      osc.stop(audioNow + 0.08);
    } catch {
      // Audio safety guard
    }
  }

  // Gate Opening: smooth mechanical sliding air sweep (soft whoosh)
  public playDoorOpen() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // Soft air displacement whoosh
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.linearRampToValueAtTime(750, now + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);

      // Gentle welcoming harmonic tone (C5 to G5)
      [523.25, 783.99].forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const tone = this.ctx.createOscillator();
        const tGain = this.ctx.createGain();
        tone.type = 'sine';
        tone.frequency.setValueAtTime(freq, now + 0.12 + idx * 0.12);

        tGain.gain.setValueAtTime(0, now + 0.12 + idx * 0.12);
        tGain.gain.linearRampToValueAtTime(0.03, now + 0.14 + idx * 0.12);
        tGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.55 + idx * 0.12);

        tone.connect(tGain);
        tGain.connect(this.masterGain);
        tone.start(now + 0.12 + idx * 0.12);
        tone.stop(now + 0.58 + idx * 0.12);
      });
    } catch {
      // Audio safety guard
    }
  }

  // Gate Closing: gentle decelerating latch
  public playDoorClose() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio safety guard
    }
  }

  // Interaction Chime: gentle two-tone notification bell
  public playInteract() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Soft crystal chime (E5 -> B5)
      [659.25, 987.77].forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.04, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.48);
      });
    } catch {
      // Audio safety guard
    }
  }

  // Project Showcase Activation: elegant soft digital activation sound
  public playProjectOpen() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Warm ascending harmonic triad: F4, A4, C5, G5
      [349.23, 440.0, 523.25, 783.99].forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.035, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + i * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.55);
      });
    } catch {
      // Audio safety guard
    }
  }

  // Telephone Pickup: vintage mechanical receiver lift
  public playPhonePickup() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio safety guard
    }
  }

  // Button Click: subtle, satisfying UI tap
  public playClick() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio safety guard
    }
  }
}

export const audioManager = new AudioManager();
