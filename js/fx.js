'use strict';
/* DistroHopper – Effekte: Partikel, schwebende Zahlen, Konfetti, Matrix-Regen */
(function () {
  const FX = DH.fx = { enabled: true, shake: true };
  let cv, ctx, W = 0, H = 0, dpr = 1;
  const parts = [];
  const texts = [];
  let matrix = null;
  const MAX_PARTS = 420;

  FX.init = () => {
    cv = document.getElementById('fx');
    ctx = cv.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  };
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
  }

  const BIT_COLORS = ['#7ee787', '#a5d6ff', '#ffd166', '#f0f6fc'];

  // Bits (0/1), die aus dem Klickpunkt spritzen
  FX.bits = (x, y, n = 6, color) => {
    if (!FX.enabled) return;
    for (let i = 0; i < n && parts.length < MAX_PARTS; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 60 + Math.random() * 180;
      parts.push({
        type: 'bit', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, g: 420,
        life: 0, max: 0.6 + Math.random() * 0.5, ch: Math.random() < 0.5 ? '0' : '1',
        color: color || BIT_COLORS[(Math.random() * BIT_COLORS.length) | 0], size: 14 + Math.random() * 8, rot: 0, vr: 0,
      });
    }
  };
  FX.sparks = (x, y, n = 14, color = '#ffd23f') => {
    if (!FX.enabled) return;
    for (let i = 0; i < n && parts.length < MAX_PARTS; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 80 + Math.random() * 260;
      parts.push({ type: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 200, life: 0, max: 0.4 + Math.random() * 0.5, color, size: 2 + Math.random() * 3 });
    }
  };
  FX.confetti = (n = 160, fromX, fromY) => {
    if (!FX.enabled) return;
    const cols = ['#ff5f6d', '#ffd166', '#5ee08f', '#5ce1e6', '#a86fff', '#ff8fc7', '#ffffff'];
    for (let i = 0; i < n && parts.length < MAX_PARTS; i++) {
      const x = fromX != null ? fromX : Math.random() * W;
      const y = fromY != null ? fromY : -20 - Math.random() * H * 0.3;
      const a = fromX != null ? Math.random() * Math.PI * 2 : Math.PI / 2;
      const sp = fromX != null ? 150 + Math.random() * 350 : 40 + Math.random() * 120;
      parts.push({
        type: 'conf', x, y, vx: Math.cos(a) * sp + (Math.random() - 0.5) * 60, vy: Math.sin(a) * sp, g: 160, drag: 0.985,
        life: 0, max: 2.5 + Math.random() * 2, color: cols[(Math.random() * cols.length) | 0], w: 6 + Math.random() * 6, h: 3 + Math.random() * 4,
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 12,
      });
    }
  };
  // Schwebender Text (+123 B)
  FX.text = (x, y, str, color = '#ffd166', size = 22, opts = {}) => {
    if (texts.length > 60) texts.shift();
    texts.push({ x: x + (Math.random() - 0.5) * 24, y, str, color, size, life: 0, max: opts.max || 1.1, vy: opts.vy || -70, big: !!opts.big });
  };

  FX.shakeEl = (el, cls = 'shake') => {
    if (!FX.shake || !el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };

  // Matrix-Regen für n Sekunden
  FX.matrix = (sec = 8) => {
    const cols = Math.ceil(W / 16);
    matrix = { t: 0, max: sec, drops: Array.from({ length: cols }, () => Math.random() * -H / 16), speed: Array.from({ length: cols }, () => 8 + Math.random() * 14) };
  };

  FX.busy = () => parts.length > 0 || texts.length > 0 || !!matrix;

  const MX = 'アイウエオカキクケコサシスセソ01010110ﾊﾋﾌﾍﾎ$#@%&TUXBASHSUDO';

  FX.frame = (dt) => {
    if (!ctx) return;
    if (!parts.length && !texts.length && !matrix) {
      if (cv._dirty) { ctx.clearRect(0, 0, cv.width, cv.height); cv._dirty = false; }
      return;
    }
    cv._dirty = true;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (matrix) {
      matrix.t += dt;
      const fade = matrix.t > matrix.max - 1 ? Math.max(0, matrix.max - matrix.t) : Math.min(1, matrix.t * 2);
      ctx.fillStyle = `rgba(0,0,0,${0.55 * fade})`;
      ctx.fillRect(0, 0, W, H);
      ctx.font = '16px VT323, monospace';
      for (let i = 0; i < matrix.drops.length; i++) {
        const y = matrix.drops[i] * 16;
        for (let k = 0; k < 14; k++) {
          const yy = y - k * 16;
          if (yy < -16 || yy > H) continue;
          const ch = MX[(Math.random() * MX.length) | 0];
          ctx.fillStyle = k === 0 ? `rgba(220,255,220,${fade})` : `rgba(0,255,70,${fade * (1 - k / 14)})`;
          ctx.fillText(ch, i * 16, yy);
        }
        matrix.drops[i] += matrix.speed[i] * dt;
        if (matrix.drops[i] * 16 > H + 240) matrix.drops[i] = Math.random() * -10;
      }
      if (matrix.t >= matrix.max) matrix = null;
    }

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life += dt;
      if (p.life >= p.max) { parts.splice(i, 1); continue; }
      if (p.drag) { p.vx *= p.drag; p.vy *= p.drag; }
      p.vy += (p.g || 0) * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const a = 1 - p.life / p.max;
      if (p.type === 'bit') {
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px VT323, monospace`;
        ctx.fillText(p.ch, p.x, p.y);
      } else if (p.type === 'spark') {
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else if (p.type === 'conf') {
        p.rot += p.vr * dt;
        ctx.globalAlpha = Math.min(1, a * 2);
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 1.7)));
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;

    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i];
      t.life += dt;
      if (t.life >= t.max) { texts.splice(i, 1); continue; }
      t.y += t.vy * dt;
      const k = t.life / t.max;
      const a = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
      const pop = t.big ? 1 + Math.max(0, 0.35 - t.life) * 1.5 : 1 + Math.max(0, 0.12 - t.life) * 3;
      ctx.globalAlpha = a;
      ctx.font = `${Math.round(t.size * pop)}px VT323, monospace`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0,0,0,.65)';
      ctx.strokeText(t.str, t.x, t.y);
      ctx.fillStyle = t.color;
      ctx.fillText(t.str, t.x, t.y);
      ctx.textAlign = 'start';
    }
    ctx.globalAlpha = 1;
  };
})();
