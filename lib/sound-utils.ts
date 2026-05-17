let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Synthesizes a physical analog relay click sound.
 * Combining a decaying solenoid rumble, high-frequency contact snap, and static contact spark.
 */
export function playRelayClick(isOn: boolean) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // 1. High-frequency electrical spark contact (crackle)
  const bufferSize = ctx.sampleRate * 0.04; // 40ms burst
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // Generate white noise with random crackle gaps
    data[i] = Math.random() > 0.2 ? (Math.random() * 2 - 1) : 0;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(isOn ? 7000 : 5000, now);
  noiseFilter.Q.setValueAtTime(4, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.06, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

  noiseNode.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  // 2. Heavy solenoid structural displacement
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  // Turning "On" is a slightly higher tension clonk, "Off" is a deeper spring recoil
  const baseFreq = isOn ? 160 : 115;
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

  oscGain.gain.setValueAtTime(0.12, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  // 3. Ultra-sharp metallic snap click
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'sine';
  clickOsc.frequency.setValueAtTime(isOn ? 1900 : 1300, now);
  
  clickGain.gain.setValueAtTime(0.07, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);

  // Fire triggers
  noiseNode.start(now);
  noiseNode.stop(now + 0.05);

  osc.start(now);
  osc.stop(now + 0.09);

  clickOsc.start(now);
  clickOsc.stop(now + 0.02);
}

/**
 * Synthesizes a dusty, high-voltage electrostatic CRT monitor snap/crackle.
 * Perfect for initial menu boot-ups, closing views, or general vintage glitching.
 */
export function playStaticFlicker() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const duration = 0.22; // 220ms vintage static burst
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Intermittent high-voltage pops
  for (let i = 0; i < bufferSize; i++) {
    const threshold = 0.88; // Dense but gapped static
    data[i] = Math.random() > threshold ? (Math.random() * 2 - 1) * 0.4 : 0;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(3500, now);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.04, now);
  gainNode.gain.linearRampToValueAtTime(0.001, now + duration);

  noiseNode.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noiseNode.start(now);
  noiseNode.stop(now + duration);
}
