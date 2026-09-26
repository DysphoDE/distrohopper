'use strict';
/* DistroHopper – Sound, komplett synthetisiert (WebAudio, keine Dateien) */
(function () {
  const A = DH.audio = { ctx: null, master: null, noise: null, enabled: true, vol: 0.55, lastKey: 0, keyKind: 'rubber' };

  A.init = () => {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume().catch(() => {}); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      A.ctx = new AC();
      A.master = A.ctx.createGain();
      A.master.gain.value = A.enabled ? A.vol : 0;
      const comp = A.ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      A.master.connect(comp); comp.connect(A.ctx.destination);
      // Rauschpuffer
      const len = A.ctx.sampleRate * 1.0;
      const buf = A.ctx.createBuffer(1, len, A.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      A.noise = buf;
    } catch (e) { A.ctx = null; }
    if (A.ctx && A.music && A.music.on) A.musicSet(true);
  };
  A.setEnabled = (on) => { A.enabled = on; if (A.master) A.master.gain.setTargetAtTime(on ? A.vol : 0, A.ctx.currentTime, 0.02); };
  A.setVolume = (v) => { A.vol = v; if (A.master && A.enabled) A.master.gain.setTargetAtTime(v, A.ctx.currentTime, 0.02); };

  const ok = () => A.ctx && A.enabled && A.ctx.state === 'running';

  function noiseBurst(t, dur, type, freq, q, gain, attack = 0.001) {
    const src = A.ctx.createBufferSource();
    src.buffer = A.noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = A.ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = A.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(A.master);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.02);
  }
  function tone(t, freq, dur, type = 'square', gain = 0.12, slideTo = null, attack = 0.004) {
    const o = A.ctx.createOscillator();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    const g = A.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(A.master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  /* ---------- Tastatur ---------- */
  let twCount = 0;
  A.key = (kind) => {
    if (!ok()) return;
    kind = kind || A.keyKind;
    if (kind === 'silent') return;
    const now = A.ctx.currentTime;
    if (now - A.lastKey < 0.028) return; // nicht übersteuern
    A.lastKey = now;
    const j = 0.9 + Math.random() * 0.2;
    switch (kind) {
      case 'blue': // Klick + Klack
        noiseBurst(now, 0.018, 'highpass', 3800 * j, 1, 0.5);
        tone(now, 2600 * j, 0.012, 'square', 0.05);
        noiseBurst(now + 0.03, 0.03, 'bandpass', 2200 * j, 2, 0.35);
        break;
      case 'brown':
        noiseBurst(now, 0.03, 'bandpass', 1900 * j, 1.5, 0.45);
        tone(now, 220 * j, 0.03, 'triangle', 0.08);
        break;
      case 'red':
        noiseBurst(now, 0.035, 'lowpass', 1400 * j, 1, 0.5);
        tone(now, 150 * j, 0.04, 'sine', 0.12);
        break;
      case 'topre':
        noiseBurst(now, 0.05, 'lowpass', 900 * j, 2, 0.45);
        tone(now, 110 * j, 0.06, 'sine', 0.2, 80);
        break;
      case 'modelm': // Knickfeder: "Pling-Klack"
        tone(now, 3200 * j, 0.05, 'sine', 0.04, 2900);
        noiseBurst(now + 0.004, 0.04, 'bandpass', 2600 * j, 3, 0.55);
        noiseBurst(now + 0.035, 0.05, 'lowpass', 1200, 1, 0.4);
        break;
      case 'typewriter':
        noiseBurst(now, 0.05, 'bandpass', 3000 * j, 1.2, 0.6);
        noiseBurst(now + 0.02, 0.06, 'lowpass', 700, 1, 0.5);
        if (++twCount % 32 === 0) { tone(now + 0.05, 2093, 0.6, 'sine', 0.12); tone(now + 0.05, 4186, 0.4, 'sine', 0.05); }
        break;
      default: // Gummidom
        noiseBurst(now, 0.045, 'lowpass', 750 * j, 0.8, 0.35);
        tone(now, 180 * j, 0.03, 'sine', 0.05);
    }
  };

  /* ---------- UI-Sounds ---------- */
  A.buy = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    tone(t, 660, 0.07, 'square', 0.06);
    tone(t + 0.06, 990, 0.1, 'square', 0.06);
  };
  A.upgrade = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => tone(t + i * 0.045, f, 0.12, 'square', 0.05));
  };
  A.error = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    tone(t, 140, 0.12, 'sawtooth', 0.06);
    tone(t + 0.1, 110, 0.14, 'sawtooth', 0.05);
  };
  A.achievement = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    const seq = [523, 659, 784, 1047, 784, 1047, 1319];
    seq.forEach((f, i) => tone(t + i * 0.07, f, i === seq.length - 1 ? 0.4 : 0.12, 'square', 0.055));
    seq.forEach((f, i) => tone(t + i * 0.07, f / 2, 0.1, 'triangle', 0.05));
  };
  A.quack = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const s = t + i * 0.16;
      const o = A.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(620, s);
      o.frequency.exponentialRampToValueAtTime(380, s + 0.12);
      const f = A.ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.setValueAtTime(1200, s); f.frequency.exponentialRampToValueAtTime(700, s + 0.12); f.Q.value = 5;
      const g = A.ctx.createGain();
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.35, s + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.14);
      o.connect(f); f.connect(g); g.connect(A.master);
      o.start(s); o.stop(s + 0.16);
    }
  };
  A.squash = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    noiseBurst(t, 0.09, 'lowpass', 900, 1, 0.6);
    tone(t, 300, 0.08, 'square', 0.06, 60);
  };
  A.ping = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    tone(t, 880, 0.15, 'sine', 0.12);
    tone(t + 0.12, 1320, 0.22, 'sine', 0.1);
  };
  A.coin = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    tone(t, 988, 0.06, 'square', 0.05);
    tone(t + 0.06, 1319, 0.2, 'square', 0.05);
  };
  A.quizOk = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    [659, 784, 988, 1319].forEach((f, i) => tone(t + i * 0.06, f, 0.14, 'triangle', 0.12));
  };
  A.quizBad = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    tone(t, 330, 0.18, 'square', 0.06, 247);
    tone(t + 0.18, 247, 0.3, 'square', 0.06, 185);
  };
  A.whoosh = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    const src = A.ctx.createBufferSource(); src.buffer = A.noise;
    const f = A.ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.5;
    f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3000, t + 0.35);
    const g = A.ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    src.connect(f); f.connect(g); g.connect(A.master); src.start(t); src.stop(t + 0.45);
  };
  // Modem-Einwahl (kurz) – beim ISO-Download
  A.modem = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    tone(t, 350, 0.25, 'sine', 0.06); tone(t, 440, 0.25, 'sine', 0.06);
    [1270, 1070, 1270, 2100, 1650, 2250].forEach((f, i) => tone(t + 0.3 + i * 0.09, f, 0.09, 'square', 0.035));
    for (let i = 0; i < 6; i++) noiseBurst(t + 0.9 + i * 0.12, 0.1, 'bandpass', 1800 + Math.random() * 1200, 2, 0.12);
    tone(t + 1.1, 2400, 0.35, 'sawtooth', 0.02, 1800);
  };
  // Boot-Jingle
  A.boot = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    const ch = [[392, 494, 587], [440, 554, 659], [523, 659, 784]];
    ch.forEach((c, i) => c.forEach((f) => tone(t + i * 0.18, f, 0.5, 'triangle', 0.06, null, 0.02)));
    tone(t + 0.54, 1047, 0.8, 'sine', 0.08, null, 0.02);
  };
  A.beep = () => { if (ok()) tone(A.ctx.currentTime, 1000, 0.12, 'square', 0.05); };
  A.fanfare = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    const mel = [523, 523, 523, 659, 784, 659, 784, 1047];
    const dur = [0.12, 0.12, 0.12, 0.3, 0.15, 0.15, 0.15, 0.8];
    let s = t;
    mel.forEach((f, i) => { tone(s, f, dur[i], 'square', 0.07); tone(s, f / 2, dur[i], 'triangle', 0.07); s += dur[i] * 0.9; });
  };
  A.train = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    for (let i = 0; i < 16; i++) noiseBurst(t + i * 0.22, 0.12, 'lowpass', 500, 1, 0.3);
    tone(t, 740, 0.5, 'sawtooth', 0.04); tone(t, 880, 0.5, 'sawtooth', 0.04);
    tone(t + 2.2, 740, 0.6, 'sawtooth', 0.04); tone(t + 2.2, 880, 0.6, 'sawtooth', 0.04);
  };
  /* ---------- Prozedurale Chiptune-Musik (pro Distro eigene Variation) ---------- */
  const SCALES = { minor: [0, 2, 3, 5, 7, 8, 10], major: [0, 2, 4, 5, 7, 9, 11], dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10], mixo: [0, 2, 4, 5, 7, 9, 10] };
  const SONGS = {
    ubuntu: { bpm: 108, root: 57, scale: 'minor', prog: [0, 5, 2, 6] },
    mint: { bpm: 100, root: 60, scale: 'major', prog: [0, 4, 5, 3] },
    fedora: { bpm: 116, root: 62, scale: 'dorian', prog: [0, 3, 0, 4] },
    debian: { bpm: 90, root: 55, scale: 'minor', prog: [0, 3, 4, 0], calm: true },
    arch: { bpm: 134, root: 52, scale: 'minor', prog: [0, 5, 6, 4], drive: true },
    manjaro: { bpm: 104, root: 59, scale: 'dorian', prog: [0, 6, 3, 4] },
    opensuse: { bpm: 112, root: 60, scale: 'mixo', prog: [0, 6, 3, 0] },
    popos: { bpm: 122, root: 61, scale: 'major', prog: [0, 5, 3, 4], drive: true },
    kali: { bpm: 128, root: 50, scale: 'phrygian', prog: [0, 1, 0, 6], drive: true },
    gentoo: { bpm: 110, root: 54, scale: 'dorian', prog: [0, 2, 3, 4] },
    alpine: { bpm: 96, root: 64, scale: 'major', prog: [0, 3, 4, 3], calm: true },
    nixos: { bpm: 118, root: 58, scale: 'mixo', prog: [0, 4, 6, 3] },
    slackware: { bpm: 88, root: 52, scale: 'minor', prog: [0, 3, 0, 4], calm: true },
    void: { bpm: 100, root: 49, scale: 'phrygian', prog: [0, 1, 5, 6] },
    cachyos: { bpm: 140, root: 57, scale: 'minor', prog: [0, 5, 3, 6], drive: true },
    rhel: { bpm: 106, root: 55, scale: 'major', prog: [0, 3, 4, 4] },
    freebsd: { bpm: 114, root: 53, scale: 'dorian', prog: [0, 6, 5, 6] },
    lfs: { bpm: 98, root: 56, scale: 'minor', prog: [0, 2, 5, 4] },
    hannah: { bpm: 126, root: 64, scale: 'major', prog: [0, 5, 3, 4], drive: true },
    windows: { bpm: 84, root: 58, scale: 'major', prog: [0, 4, 3, 4], calm: true },
  };
  const M = A.music = { on: false, vol: 0.4, gain: null, timer: null, step: 0, bar: 0, next: 0, song: SONGS.ubuntu, pending: null, seed: 1 };
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function rnd(n) { M.seed = (M.seed * 16807) % 2147483647; return (M.seed % 1000) / 1000 * n; }
  function mTone(t, freq, dur, type, gain, slide) {
    const o = A.ctx.createOscillator();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    const g = A.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(M.gain);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function mNoise(t, dur, freq, gain) {
    const src = A.ctx.createBufferSource(); src.buffer = A.noise;
    const f = A.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = freq;
    const g = A.ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(M.gain);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.02);
  }
  function chord(song, deg) {
    const sc = SCALES[song.scale];
    const note = (d) => song.root + sc[((d % 7) + 7) % 7] + 12 * Math.floor(d / 7);
    return [note(deg), note(deg + 2), note(deg + 4), note(deg + 7)];
  }
  function scheduleStep(t) {
    const s = M.song, st = M.step % 16;
    if (st === 0) {
      if (M.pending) { M.song = M.pending; M.pending = null; }
      M.bar++;
      M.seed = 1000 + (M.bar % 8) * 97 + s.root;
    }
    const c = chord(M.song, M.song.prog[Math.floor(M.step / 16) % M.song.prog.length]);
    const spb = 60 / M.song.bpm / 4;
    // Schlagzeug
    if (st % 8 === 0 || (M.song.drive && st % 4 === 0)) mTone(t, 150, 0.16, 'sine', 0.5, 45);
    if (st === 4 || st === 12) mNoise(t, M.song.calm ? 0.08 : 0.13, 1800, M.song.calm ? 0.12 : 0.22);
    if (st % 2 === 1 && !M.song.calm) mNoise(t, 0.03, 7000, 0.06);
    // Bass
    if ([0, 3, 6, 8, 11, 14].includes(st) && (!M.song.calm || st % 8 === 0)) mTone(t, mtof(c[0] - 12 + (st === 11 ? 12 : 0)), spb * (st % 8 === 0 ? 2.5 : 1.5), 'triangle', 0.28);
    // Arpeggio
    const arp = [0, 1, 2, 3, 2, 1, 0, 2][st % 8];
    if (!M.song.calm || st % 2 === 0) mTone(t, mtof(c[arp] + 12), spb * 0.9, 'square', 0.045);
    // Melodie (leicht zufällig, aber pro Takt reproduzierbar)
    if ((st === 0 || st === 6 || st === 10 || (st === 14 && rnd(1) > 0.5)) && M.bar % 4 !== 3) {
      const sc = SCALES[M.song.scale];
      const deg = Math.floor(rnd(7));
      mTone(t, mtof(M.song.root + 12 + sc[deg]), spb * (st === 0 ? 3 : 2), 'square', 0.06);
    }
    M.step++;
  }
  function tick() {
    if (!A.ctx || !M.on) return;
    while (M.next < A.ctx.currentTime + 0.25) {
      if (M.next < A.ctx.currentTime - 0.1) M.next = A.ctx.currentTime + 0.05;
      scheduleStep(M.next);
      M.next += 60 / M.song.bpm / 4;
    }
  }
  A.musicSet = (on) => {
    M.on = on;
    if (!A.ctx) return;
    if (!M.gain) { M.gain = A.ctx.createGain(); M.gain.gain.value = M.vol; M.gain.connect(A.master); }
    if (on && !M.timer) { M.next = A.ctx.currentTime + 0.1; M.step = 0; M.timer = setInterval(tick, 50); }
    if (!on && M.timer) { clearInterval(M.timer); M.timer = null; }
  };
  A.musicVolume = (v) => { M.vol = v; if (M.gain) M.gain.gain.setTargetAtTime(v, A.ctx.currentTime, 0.05); };
  A.musicSong = (id) => { const s = SONGS[id] || SONGS.ubuntu; if (M.on) M.pending = s; else M.song = s; };

  A.windowsUpdate = () => {
    if (!ok()) return;
    const t = A.ctx.currentTime;
    [523, 784, 659, 1047].forEach((f, i) => tone(t + i * 0.15, f, 0.5, 'sine', 0.06, null, 0.03));
  };
})();
