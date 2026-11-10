/**
 * ============================================================================
 * HOW TO CHANGE THE WEDDING SONG IN THIS APPLICATION:
 * ============================================================================
 * 
 * File: /src/utils/weddingAudioSynthesizer.ts
 * 
 * OPTION 1 (Custom MP3 or Audio Stream URL — Easiest):
 *   Change `CUSTOM_WEDDING_AUDIO_URL` below to any MP3 file or audio link.
 *   Example: 
 *     export const CUSTOM_WEDDING_AUDIO_URL: string | null = "https://cdn.example.com/our-song.mp3";
 *   When set, the player will play this audio file with full volume and visualizer support!
 * 
 * OPTION 2 (Synthesized Piano Music):
 *   Leave `CUSTOM_WEDDING_AUDIO_URL = null` to use the built-in piano synthesizer.
 *   You can modify `TURKISH_MARCH_SCORE` (notes, tempo, chords) below to play any song.
 * ============================================================================
 */
export const CUSTOM_WEDDING_AUDIO_URL: string = '/assets/aistudio/Number_One_cdd277d1.mp3';
export const WEDDING_AUDIO_TRACK_TITLE: string = 'Number One';

export interface MelodyNote {
  note: string;
  freq: number;
  duration: number;
  delay: number;
}

export interface HarmonyChord {
  name: string;
  time: number;
  duration: number;
  freqs: number[];
}

export interface WeddingSongScore {
  type: 'web_audio_score' | 'audio_stream';
  title: string;
  composer: string;
  tempo?: number;
  key?: string;
  vibeDescription?: string;
  poeticVerse?: string;
  audioDataUrl?: string;
  melodyNotes?: MelodyNote[];
  harmonyChords?: HarmonyChord[];
}

/**
 * Authentic Mozart: Turkish March (Rondo alla Turca) Score
 * Wolfgang Amadeus Mozart - Piano Sonata No. 11 in A Major, K. 331 (3rd Movement)
 */
export const TURKISH_MARCH_SCORE: WeddingSongScore = {
  type: 'web_audio_score',
  title: 'Turkish March (Rondo alla Turca)',
  composer: 'Wolfgang Amadeus Mozart',
  tempo: 124,
  key: 'A Minor / A Major',
  vibeDescription: 'Mozart’s iconic Allegretto piano masterpiece, full of joyful celebration, buoyant energy, and classical brilliance.',
  poeticVerse: '“Therefore what God has joined together, let no one separate.” — Mark 10:9',
  melodyNotes: [
    // Theme A (A minor Allegretto motif)
    // Pick-up
    { note: 'B4', freq: 493.88, duration: 0.11, delay: 0.00 },
    { note: 'A4', freq: 440.00, duration: 0.11, delay: 0.12 },
    { note: 'G#4', freq: 415.30, duration: 0.11, delay: 0.24 },
    { note: 'A4', freq: 440.00, duration: 0.11, delay: 0.36 },
    // Measure 1
    { note: 'C5', freq: 523.25, duration: 0.28, delay: 0.48 },
    { note: 'D5', freq: 587.33, duration: 0.11, delay: 0.96 },
    { note: 'C5', freq: 523.25, duration: 0.11, delay: 1.08 },
    { note: 'B4', freq: 493.88, duration: 0.11, delay: 1.20 },
    { note: 'C5', freq: 523.25, duration: 0.11, delay: 1.32 },
    // Measure 2
    { note: 'E5', freq: 659.25, duration: 0.28, delay: 1.44 },
    { note: 'F5', freq: 698.46, duration: 0.11, delay: 1.92 },
    { note: 'E5', freq: 659.25, duration: 0.11, delay: 2.04 },
    { note: 'D#5', freq: 622.25, duration: 0.11, delay: 2.16 },
    { note: 'E5', freq: 659.25, duration: 0.11, delay: 2.28 },
    // Measure 3 (Ascending run)
    { note: 'B5', freq: 987.77, duration: 0.22, delay: 2.40 },
    { note: 'A5', freq: 880.00, duration: 0.11, delay: 2.64 },
    { note: 'G#5', freq: 830.61, duration: 0.11, delay: 2.76 },
    { note: 'A5', freq: 880.00, duration: 0.11, delay: 2.88 },
    { note: 'B5', freq: 987.77, duration: 0.22, delay: 3.00 },
    { note: 'A5', freq: 880.00, duration: 0.11, delay: 3.24 },
    { note: 'G#5', freq: 830.61, duration: 0.11, delay: 3.36 },
    { note: 'A5', freq: 880.00, duration: 0.11, delay: 3.48 },
    // Measure 4
    { note: 'C6', freq: 1046.50, duration: 0.42, delay: 3.60 },

    // Measure 5 - Second phrase
    { note: 'B4', freq: 493.88, duration: 0.11, delay: 4.32 },
    { note: 'A4', freq: 440.00, duration: 0.11, delay: 4.44 },
    { note: 'G#4', freq: 415.30, duration: 0.11, delay: 4.56 },
    { note: 'A4', freq: 440.00, duration: 0.11, delay: 4.68 },
    { note: 'C5', freq: 523.25, duration: 0.28, delay: 4.80 },
    { note: 'D5', freq: 587.33, duration: 0.11, delay: 5.28 },
    { note: 'C5', freq: 523.25, duration: 0.11, delay: 5.40 },
    { note: 'B4', freq: 493.88, duration: 0.11, delay: 5.52 },
    { note: 'C5', freq: 523.25, duration: 0.11, delay: 5.64 },
    { note: 'E5', freq: 659.25, duration: 0.28, delay: 5.76 },
    { note: 'F5', freq: 698.46, duration: 0.11, delay: 6.24 },
    { note: 'E5', freq: 659.25, duration: 0.11, delay: 6.36 },
    { note: 'D#5', freq: 622.25, duration: 0.11, delay: 6.48 },
    { note: 'E5', freq: 659.25, duration: 0.11, delay: 6.60 },
    // Cadence into A
    { note: 'B5', freq: 987.77, duration: 0.20, delay: 6.72 },
    { note: 'A5', freq: 880.00, duration: 0.20, delay: 6.96 },
    { note: 'G#5', freq: 830.61, duration: 0.11, delay: 7.20 },
    { note: 'A5', freq: 880.00, duration: 0.11, delay: 7.32 },
    { note: 'B4', freq: 493.88, duration: 0.20, delay: 7.44 },
    { note: 'C5', freq: 523.25, duration: 0.20, delay: 7.68 },
    { note: 'B4', freq: 493.88, duration: 0.20, delay: 7.92 },
    { note: 'A4', freq: 440.00, duration: 0.50, delay: 8.16 },

    // Theme B (Triumphant Turkish March A Major Fanfare)
    { note: 'C#5', freq: 554.37, duration: 0.12, delay: 9.00 },
    { note: 'D5', freq: 587.33, duration: 0.12, delay: 9.12 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 9.24 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 9.48 },
    { note: 'F#5', freq: 739.99, duration: 0.12, delay: 9.72 },
    { note: 'E5', freq: 659.25, duration: 0.12, delay: 9.84 },
    { note: 'D5', freq: 587.33, duration: 0.12, delay: 9.96 },
    { note: 'C#5', freq: 554.37, duration: 0.12, delay: 10.08 },
    { note: 'B4', freq: 493.88, duration: 0.22, delay: 10.20 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 10.44 },
    { note: 'C#5', freq: 554.37, duration: 0.12, delay: 10.80 },
    { note: 'D5', freq: 587.33, duration: 0.12, delay: 10.92 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 11.04 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 11.28 },
    { note: 'D5', freq: 587.33, duration: 0.12, delay: 11.52 },
    { note: 'C#5', freq: 554.37, duration: 0.12, delay: 11.64 },
    { note: 'B4', freq: 493.88, duration: 0.12, delay: 11.76 },
    { note: 'A4', freq: 440.00, duration: 0.48, delay: 11.88 },

    // Fanfare Phrase 2
    { note: 'C#5', freq: 554.37, duration: 0.12, delay: 12.60 },
    { note: 'D5', freq: 587.33, duration: 0.12, delay: 12.72 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 12.84 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 13.08 },
    { note: 'F#5', freq: 739.99, duration: 0.12, delay: 13.32 },
    { note: 'E5', freq: 659.25, duration: 0.12, delay: 13.44 },
    { note: 'D5', freq: 587.33, duration: 0.12, delay: 13.56 },
    { note: 'C#5', freq: 554.37, duration: 0.12, delay: 13.68 },
    { note: 'B4', freq: 493.88, duration: 0.22, delay: 13.80 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 14.04 },
    { note: 'C#5', freq: 554.37, duration: 0.12, delay: 14.40 },
    { note: 'D5', freq: 587.33, duration: 0.12, delay: 14.52 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 14.64 },
    { note: 'E5', freq: 659.25, duration: 0.22, delay: 14.88 },
    { note: 'D5', freq: 587.33, duration: 0.12, delay: 15.12 },
    { note: 'C#5', freq: 554.37, duration: 0.12, delay: 15.24 },
    { note: 'B4', freq: 493.88, duration: 0.12, delay: 15.36 },
    { note: 'A4', freq: 440.00, duration: 0.60, delay: 15.48 }
  ],
  harmonyChords: [
    // Staccato march chords in left hand
    { name: 'A Minor', time: 0.48, duration: 0.22, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'A Minor', time: 0.72, duration: 0.22, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'A Minor', time: 1.44, duration: 0.22, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'A Minor', time: 1.68, duration: 0.22, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'E Major', time: 2.40, duration: 0.22, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'E Major', time: 2.64, duration: 0.22, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'E Major', time: 3.00, duration: 0.22, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'E Major', time: 3.24, duration: 0.22, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'A Minor', time: 3.60, duration: 0.36, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'A Minor', time: 4.80, duration: 0.22, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'A Minor', time: 5.04, duration: 0.22, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'A Minor', time: 5.76, duration: 0.22, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'A Minor', time: 6.00, duration: 0.22, freqs: [110.00, 164.81, 220.00, 261.63] },
    { name: 'E Major', time: 6.72, duration: 0.22, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'E Major', time: 7.44, duration: 0.22, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'A Minor', time: 8.16, duration: 0.44, freqs: [110.00, 164.81, 220.00, 261.63] },

    // Turkish Major Fanfare Chords (A Major)
    { name: 'A Major', time: 9.24, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'A Major', time: 9.48, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'A Major', time: 9.72, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'E Major', time: 10.20, duration: 0.20, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'E Major', time: 10.44, duration: 0.20, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'A Major', time: 11.04, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'A Major', time: 11.28, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'E Major', time: 11.76, duration: 0.18, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'A Major', time: 11.88, duration: 0.48, freqs: [110.00, 220.00, 277.18, 329.63] },

    { name: 'A Major', time: 12.84, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'A Major', time: 13.08, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'A Major', time: 13.32, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'E Major', time: 13.80, duration: 0.20, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'E Major', time: 14.04, duration: 0.20, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'A Major', time: 14.64, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'A Major', time: 14.88, duration: 0.20, freqs: [110.00, 220.00, 277.18, 329.63] },
    { name: 'E Major', time: 15.36, duration: 0.18, freqs: [82.41, 164.81, 207.65, 246.94] },
    { name: 'A Major', time: 15.48, duration: 0.60, freqs: [110.00, 220.00, 277.18, 329.63] }
  ]
};

export class WeddingAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentScore: WeddingSongScore = TURKISH_MARCH_SCORE;
  private startTime = 0;
  private pauseOffset = 0;
  private loopDuration = 16.5; // seconds for Turkish March loop
  private timerId: any = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private onStateChange?: (isPlaying: boolean, progress: number) => void;
  private volume = 0.65;
  private htmlAudio: HTMLAudioElement | null = null;

  constructor(onStateChange?: (isPlaying: boolean, progress: number) => void) {
    this.onStateChange = onStateChange;
    this.loadScore(TURKISH_MARCH_SCORE);
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public loadScore(score: WeddingSongScore) {
    this.currentScore = score;
    if (score.melodyNotes && score.melodyNotes.length > 0) {
      const lastNote = score.melodyNotes[score.melodyNotes.length - 1];
      this.loopDuration = Math.max(12, lastNote.delay + lastNote.duration + 1.2);
    }
  }

  public async play(): Promise<void> {
    // Check if custom audio URL is provided
    const audioUrl = CUSTOM_WEDDING_AUDIO_URL || this.currentScore.audioDataUrl;
    if (audioUrl) {
      if (!this.htmlAudio) {
        this.htmlAudio = new Audio(audioUrl);
        this.htmlAudio.loop = true;
        this.htmlAudio.preload = 'auto';

        this.htmlAudio.addEventListener('play', () => {
          this.isPlaying = true;
          this.onStateChange?.(true, 0);
        });

        this.htmlAudio.addEventListener('pause', () => {
          this.isPlaying = false;
          this.onStateChange?.(false, 0);
        });

        this.htmlAudio.addEventListener('timeupdate', () => {
          if (this.htmlAudio && this.htmlAudio.duration) {
            const progress = this.htmlAudio.currentTime / this.htmlAudio.duration;
            this.onStateChange?.(true, progress);
          }
        });
      }
      this.htmlAudio.volume = this.volume;
      try {
        await this.htmlAudio.play();
        this.isPlaying = true;
        this.onStateChange?.(true, 0.5);
      } catch (err) {
        this.isPlaying = false;
        this.onStateChange?.(false, 0);
        throw err;
      }
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    if (this.isPlaying) return;
    this.isPlaying = true;

    this.startTime = this.ctx.currentTime - this.pauseOffset;
    this.scheduleScoreLoop(this.startTime);
    this.startProgressTracker();
  }

  private scheduleScoreLoop(baseTime: number) {
    if (!this.ctx || !this.currentScore || !this.isPlaying) return;

    const notes = this.currentScore.melodyNotes || [];
    const chords = this.currentScore.harmonyChords || [];

    // Schedule Chords (Crisp staccato march accompaniment)
    chords.forEach((chord) => {
      chord.freqs.forEach((freq, idx) => {
        this.playMarchChordNote(freq, baseTime + chord.time, chord.duration, 0.08 + idx * 0.015);
      });
    });

    // Schedule Melody (Crisp Classical Grand Piano)
    notes.forEach((note) => {
      this.playPianoNote(note.freq, baseTime + note.delay, note.duration);
    });

    // Schedule next loop seamlessly
    const nextLoopTime = baseTime + this.loopDuration;
    const timeUntilNext = (nextLoopTime - this.ctx.currentTime) * 1000;

    if (timeUntilNext > 0 && this.isPlaying) {
      setTimeout(() => {
        if (this.isPlaying && this.ctx) {
          this.scheduleScoreLoop(nextLoopTime);
        }
      }, Math.max(50, timeUntilNext - 400));
    }
  }

  /**
   * Classical Grand Piano Voice (Warm attack, wooden bell resonance, fast allegretto decay)
   */
  private playPianoNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    if (startTime < this.ctx.currentTime - 0.5) return;

    const actStartTime = Math.max(startTime, this.ctx.currentTime);

    // Fundamental oscillator (Triangle for rich piano warmth)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, actStartTime);

    // Harmonic sparkle oscillator (Sine at 2x freq for hammer strike brilliance)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, actStartTime);

    // Lowpass filter simulating the grand piano soundboard
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, actStartTime);
    filter.frequency.exponentialRampToValueAtTime(450, actStartTime + duration);

    // Note Envelope: Instant piano hammer strike, buoyant decay
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, actStartTime);
    noteGain.gain.linearRampToValueAtTime(0.32, actStartTime + 0.008);
    noteGain.gain.exponentialRampToValueAtTime(0.001, actStartTime + duration + 0.25);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(actStartTime);
    osc2.start(actStartTime);
    osc1.stop(actStartTime + duration + 0.3);
    osc2.stop(actStartTime + duration + 0.3);
  }

  /**
   * March Bass / Chord Note (Staccato, punchy classical accompaniment)
   */
  private playMarchChordNote(freq: number, startTime: number, duration: number, vol = 0.08) {
    if (!this.ctx || !this.masterGain) return;
    if (startTime < this.ctx.currentTime - 0.5) return;

    const actStartTime = Math.max(startTime, this.ctx.currentTime);

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, actStartTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, actStartTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, actStartTime);
    gain.gain.linearRampToValueAtTime(vol, actStartTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0005, actStartTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(actStartTime);
    osc.stop(actStartTime + duration + 0.05);
  }

  private startProgressTracker() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (!this.isPlaying) return;
      if (this.ctx) {
        const elapsed = (this.ctx.currentTime - this.startTime) % this.loopDuration;
        const progress = elapsed / this.loopDuration;
        this.onStateChange?.(true, progress);
      }
    }, 150);
  }

  public pause() {
    this.isPlaying = false;
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    if (this.ctx) {
      this.pauseOffset = (this.ctx.currentTime - this.startTime) % this.loopDuration;
      this.ctx.suspend();
    }
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.onStateChange?.(false, 0);
  }

  public toggle() {
    if (this.isCurrentlyPlaying()) {
      this.pause();
    } else {
      this.play().catch(() => {});
    }
  }

  public isCurrentlyPlaying() {
    if (this.htmlAudio) {
      return !this.htmlAudio.paused;
    }
    return this.isPlaying;
  }

  public destroy() {
    this.pause();
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
