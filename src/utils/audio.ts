/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class BirthdaySynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTimeout: NodeJS.Timeout | null = null;
  private noteIndex: number = 0;
  private gainNode: GainNode | null = null;

  // Melody notes: [Frequency, Duration (beats)]
  // C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25
  private melody: [number, number][] = [
    [261.63, 0.75], // Hap-
    [261.63, 0.25], // py
    [293.66, 1.0],  // Birth-
    [261.63, 1.0],  // day
    [349.23, 1.0],  // to
    [329.63, 2.0],  // you,
    
    [261.63, 0.75], // Hap-
    [261.63, 0.25], // py
    [293.66, 1.0],  // Birth-
    [261.63, 1.0],  // day
    [392.00, 1.0],  // to
    [349.23, 2.0],  // you,

    [261.63, 0.75], // Hap-
    [261.63, 0.25], // py
    [523.25, 1.0],  // Birth-
    [440.00, 1.0],  // day
    [349.23, 1.0],  // dear
    [329.63, 1.0],  // Ma-
    [293.66, 2.0],  // dam Ji,

    [466.16, 0.75], // Hap-
    [466.16, 0.25], // py
    [440.00, 1.0],  // Birth-
    [349.23, 1.0],  // day
    [392.00, 1.0],  // to
    [349.23, 3.0],  // you!
  ];

  private tempo: number = 130; // BPM

  public start() {
    if (this.isPlaying) return;
    
    // Create audio context if it doesn't exist
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.noteIndex = 0;
    
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime); // Soft volume
    this.gainNode.connect(this.ctx.destination);

    this.playNextNote();
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (e) {}
      this.gainNode = null;
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playNextNote() {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;

    const [freq, beats] = this.melody[this.noteIndex];
    const beatDuration = 60 / this.tempo;
    const duration = beats * beatDuration;

    this.playTone(freq, duration);

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;

    // Schedule next note with a tiny overlap gap for a nice staccato/music box feel
    this.currentTimeout = setTimeout(() => {
      this.playNextNote();
    }, duration * 1000);
  }

  private playTone(freq: number, duration: number) {
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Soft celestial bell sound: Triangle wave + a touch of Sine
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Apply soft ADSR Envelope: Fast attack, slow decay to silent
    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.8, now + 0.04); // Quick attack
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.05); // Ring out naturally

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + duration);

    // Add a very subtle higher octave echo (chime harmonics)
    const echoOsc = this.ctx.createOscillator();
    const echoGain = this.ctx.createGain();
    
    echoOsc.type = 'sine';
    echoOsc.frequency.setValueAtTime(freq * 2, this.ctx.currentTime); // Octave higher
    
    echoGain.gain.setValueAtTime(0, now);
    echoGain.gain.linearRampToValueAtTime(0.12, now + 0.02); // Soft attack
    echoGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.7); // Fades quicker
    
    echoOsc.connect(echoGain);
    echoGain.connect(this.gainNode);
    
    echoOsc.start(now);
    echoOsc.stop(now + duration);
  }
}

export const musicPlayer = new BirthdaySynth();
