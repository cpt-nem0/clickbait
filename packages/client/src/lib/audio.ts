let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.15,
  detune = 0
) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

function playNoise(duration: number, volume = 0.08) {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 3000;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  source.start();
}

export const sfx = {
  // Satisfying click hit — rising arp
  hit() {
    playTone(880, 0.08, "square", 0.12);
    setTimeout(() => playTone(1100, 0.08, "square", 0.1), 30);
    setTimeout(() => playTone(1320, 0.12, "square", 0.08), 60);
  },

  // Combo hit — sparkly higher pitch
  combo(multiplier: number) {
    const base = 880 + Math.min(multiplier, 10) * 80;
    playTone(base, 0.06, "square", 0.1);
    setTimeout(() => playTone(base * 1.25, 0.06, "square", 0.1), 40);
    setTimeout(() => playTone(base * 1.5, 0.1, "triangle", 0.12), 80);
    setTimeout(() => playTone(base * 2, 0.15, "triangle", 0.08), 120);
  },

  // Miss — low thud
  miss() {
    playTone(150, 0.15, "sawtooth", 0.1);
    playNoise(0.06, 0.05);
  },

  // Target spawn — subtle blip
  spawn() {
    playTone(660, 0.04, "square", 0.06);
    setTimeout(() => playTone(880, 0.04, "square", 0.04), 20);
  },

  // Timer warning tick (< 5 seconds)
  tick() {
    playTone(1000, 0.03, "square", 0.08);
  },

  // Timer critical (< 3 seconds) — urgent double beep
  tickUrgent() {
    playTone(1200, 0.04, "square", 0.1);
    setTimeout(() => playTone(1200, 0.04, "square", 0.1), 60);
  },

  // Game start — ascending fanfare
  gameStart() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.12, "square", 0.1), i * 80);
    });
  },

  // Game over — descending + crash
  gameOver() {
    const notes = [784, 659, 523, 392];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, "sawtooth", 0.1), i * 120);
    });
    setTimeout(() => playNoise(0.3, 0.06), 480);
    setTimeout(() => playTone(262, 0.5, "triangle", 0.12), 520);
  },

  // UI click — tiny blip for buttons
  uiClick() {
    playTone(1200, 0.03, "square", 0.06);
  },

  // Sticker popup — quirky ascending wobble
  sticker() {
    playTone(440, 0.05, "square", 0.08, 50);
    setTimeout(() => playTone(660, 0.05, "square", 0.08, -50), 40);
    setTimeout(() => playTone(990, 0.08, "triangle", 0.1, 25), 80);
  },

  // Evasion dodge — swoosh
  dodge() {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(400, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, c.currentTime + 0.08);
    gain.gain.setValueAtTime(0.06, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.1);
  },
};

// Background music — looping chiptune beat
let musicGain: GainNode | null = null;
let musicPlaying = false;
let musicNodes: { stop: () => void }[] = [];

function scheduleBar(c: AudioContext, startTime: number, bpm: number) {
  const beat = 60 / bpm;
  const nodes: OscillatorNode[] = [];

  // Kick pattern: 1, 3
  [0, 2].forEach((b) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, startTime + b * beat);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + b * beat + 0.1);
    g.gain.setValueAtTime(0.15, startTime + b * beat);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + b * beat + 0.12);
    osc.connect(g);
    g.connect(musicGain!);
    osc.start(startTime + b * beat);
    osc.stop(startTime + b * beat + 0.12);
    nodes.push(osc);
  });

  // Hi-hat pattern: every eighth note
  for (let i = 0; i < 8; i++) {
    const t = startTime + i * beat * 0.5;
    const bufferSize = Math.floor(c.sampleRate * 0.04);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) data[j] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    const g = c.createGain();
    const accent = i % 2 === 0 ? 0.06 : 0.03;
    g.gain.setValueAtTime(accent, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 8000;
    src.connect(hp);
    hp.connect(g);
    g.connect(musicGain!);
    src.start(t);
  }

  // Bass line — simple arp
  const bassNotes = [110, 110, 146.83, 130.81];
  bassNotes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    const t = startTime + i * beat;
    g.gain.setValueAtTime(0.06, t);
    g.gain.setValueAtTime(0.06, t + beat * 0.4);
    g.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.5);
    osc.connect(g);
    g.connect(musicGain!);
    osc.start(t);
    osc.stop(t + beat * 0.5);
    nodes.push(osc);
  });

  return nodes;
}

let musicInterval: ReturnType<typeof setInterval> | null = null;

export function startMusic() {
  if (musicPlaying) return;
  const c = getCtx();
  musicGain = c.createGain();
  musicGain.gain.value = 0.5;
  musicGain.connect(c.destination);
  musicPlaying = true;

  const bpm = 140;
  const barDuration = (60 / bpm) * 4;
  let nextBarTime = c.currentTime + 0.05;

  function tick() {
    if (!musicPlaying) return;
    while (nextBarTime < c.currentTime + 0.3) {
      scheduleBar(c, nextBarTime, bpm);
      nextBarTime += barDuration;
    }
  }

  tick();
  musicInterval = setInterval(tick, 100);
}

export function stopMusic() {
  musicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  if (musicGain) {
    musicGain.gain.cancelScheduledValues(0);
    musicGain.gain.setValueAtTime(0, getCtx().currentTime);
    musicGain.disconnect();
    musicGain = null;
  }
}

export function setMusicVolume(v: number) {
  if (musicGain) musicGain.gain.value = Math.max(0, Math.min(1, v));
}
