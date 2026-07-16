export const getAudioContext = (): AudioContext | null => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
};

export const playTapSound = () => {
  const ctx = getAudioContext(); if (!ctx) return;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(420 + Math.random() * 80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.start(); osc.stop(ctx.currentTime + 0.06);
};

export const playOpenLensSound = () => {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime;
  [330, 440].forEach((freq, idx) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.04);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.04 + 0.12);
    gain.gain.setValueAtTime(0.15, now + idx * 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.12);
    osc.start(now + idx * 0.04); osc.stop(now + idx * 0.04 + 0.12);
  });
};

export const playSnapLensSound = () => {
  const ctx = getAudioContext(); if (!ctx) return;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.start(); osc.stop(ctx.currentTime + 0.1);
};

export const playSnapStampSound = () => {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator(); const gain1 = ctx.createGain();
  osc1.connect(gain1); gain1.connect(ctx.destination);
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(520, now);
  osc1.frequency.exponentialRampToValueAtTime(180, now + 0.07);
  gain1.gain.setValueAtTime(0.25, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
  osc2.connect(gain2); gain2.connect(ctx.destination);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(950, now);
  osc2.frequency.exponentialRampToValueAtTime(300, now + 0.04);
  gain2.gain.setValueAtTime(0.12, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  osc1.start(now); osc1.stop(now + 0.07);
  osc2.start(now); osc2.stop(now + 0.04);
};

export const playResultBamSound = () => {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((freq) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq - 50, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.18);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.start(now); osc.stop(now + 0.18);
  });
};

export const playSaveBookSound = () => {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator(); const gain1 = ctx.createGain();
  osc1.connect(gain1); gain1.connect(ctx.destination);
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(180, now);
  osc1.frequency.exponentialRampToValueAtTime(800, now + 0.12);
  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.linearRampToValueAtTime(0.18, now + 0.04);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
  osc2.connect(gain2); gain2.connect(ctx.destination);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1100, now + 0.08);
  gain2.gain.setValueAtTime(0.001, now);
  gain2.gain.setValueAtTime(0.12, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  osc1.start(now); osc1.stop(now + 0.12);
  osc2.start(now + 0.08); osc2.stop(now + 0.22);
};