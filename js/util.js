'use strict';
/* DistroHopper – Hilfsfunktionen: Zahlenformat, DOM, Zufall */
var DH = (typeof window !== 'undefined' ? (window.DH = window.DH || {}) : (globalThis.DH = globalThis.DH || {}));

(function () {
  const U = DH.util = {};

  U.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.rand = (a, b) => a + Math.random() * (b - a);
  U.randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  U.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  U.chance = (p) => Math.random() < p;
  U.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  U.weighted = (items, key = 'w') => {
    let total = 0;
    for (const it of items) total += it[key];
    let r = Math.random() * total;
    for (const it of items) { r -= it[key]; if (r <= 0) return it; }
    return items[items.length - 1];
  };
  U.now = () => Date.now();

  /* ---------- DOM ---------- */
  U.$ = (sel, root) => (root || document).querySelector(sel);
  U.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  U.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  U.h = (tag, attrs, ...kids) => {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === 'string' || typeof kid === 'number' ? document.createTextNode(String(kid)) : kid);
    }
    return el;
  };
  U.setText = (el, txt) => { if (el && el.textContent !== txt) el.textContent = txt; };
  U.setHTML = (el, html) => { if (el && el._html !== html) { el.innerHTML = html; el._html = html; } };
  U.toggleClass = (el, cls, on) => { if (el && el.classList.contains(cls) !== !!on) el.classList.toggle(cls, !!on); };

  /* ---------- Zahlen ---------- */
  U.settings = { notation: 'si' }; // si | bin | short | sci

  // deutsche Dezimaldarstellung
  U.dec = (v, d) => {
    let s = v.toFixed(d);
    if (d > 0) s = s.replace('.', ',');
    return s;
  };
  U.trimDec = (v, d) => {
    let s = v.toFixed(d);
    if (d > 0) s = s.replace(/\.?0+$/, '');
    return s.replace('.', ',');
  };
  U.group = (n) => {
    const s = Math.floor(Math.abs(n)).toString();
    return (n < 0 ? '−' : '') + s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const SI = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB'];
  const BIN = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB', 'RiB', 'QiB'];
  const SHORT = ['', 'Tsd.', 'Mio.', 'Mrd.', 'Bio.', 'Brd.', 'Trio.', 'Trd.', 'Quad.', 'Quadrd.', 'Quint.', 'Quintd.', 'Sext.', 'Sextd.', 'Sept.', 'Septd.', 'Okt.', 'Oktd.', 'Non.', 'Nond.', 'Dez.', 'Dezd.'];

  function sig(v, digits, steady) {
    // v in [1, 1000) -> String mit ~digits signifikanten Stellen, höchstens 2 Nachkommastellen
    // ("1,234 MB" sähe aus wie eintausendzweihundertvierunddreißig). Ohne steady fallen
    // angehängte Nullen weg, steady hält die Breite für den großen Zähler fest.
    const d = Math.min(2, v >= 100 ? Math.max(0, digits - 3) : v >= 10 ? Math.max(0, digits - 2) : Math.max(0, digits - 1));
    return steady ? U.dec(v, d) : U.trimDec(v, d);
  }

  function sci(n, digits) {
    const e = Math.floor(Math.log10(n));
    const m = n / Math.pow(10, e);
    return U.dec(m, Math.min(2, digits - 1)) + 'e' + e;
  }

  // Bytes formatieren. precise: 4 signifikante Stellen (für den großen Zähler)
  U.bytes = (n, precise) => {
    if (!isFinite(n)) return '∞ B';
    if (n < 0) return '−' + U.bytes(-n, precise);
    const digits = precise ? 4 : 3;
    const mode = U.settings.notation;
    if (n < 1000 || (mode === 'bin' && n < 1024)) {
      if (n === 0) return '0 B';
      if (n < 10 && n % 1 !== 0) return U.trimDec(n, n < 1 ? 2 : 1) + ' B';
      return Math.floor(n) + ' B';
    }
    if (mode === 'sci') return sci(n, digits) + ' B';
    if (mode === 'short') {
      const e = Math.floor(Math.log10(n) / 3);
      if (e < SHORT.length) return sig(n / Math.pow(1000, e), digits, precise) + ' ' + SHORT[e] + ' B';
      return sci(n, digits) + ' B';
    }
    if (mode === 'bin') {
      const e = Math.floor(Math.log(n) / Math.log(1024));
      if (e < BIN.length) {
        let v = n / Math.pow(1024, e);
        if (v >= 1000) return sig(v, digits + 1, precise).replace(/,\d+$/, '') + ' ' + BIN[e];
        return sig(v, digits, precise) + ' ' + BIN[e];
      }
      return sci(n, digits) + ' B';
    }
    const e = Math.floor(Math.log10(n) / 3 + 1e-9);
    if (e < SI.length) {
      let v = n / Math.pow(1000, e);
      if (v >= 999.95 && e + 1 < SI.length) return sig(v / 1000, digits, precise) + ' ' + SI[e + 1];
      return sig(v, digits, precise) + ' ' + SI[e];
    }
    return sci(n, digits) + ' B';
  };
  U.rate = (n) => U.bytes(n) + '/s';

  // allgemeine Zahl (Anzahl, Barthaare …)
  U.num = (n, dec = 0) => {
    if (!isFinite(n)) return '∞';
    if (Math.abs(n) < 1e6) return dec && n % 1 !== 0 ? U.trimDec(n, dec) : U.group(Math.floor(n));
    if (U.settings.notation === 'sci') return sci(n, 3);
    const e = Math.floor(Math.log10(Math.abs(n)) / 3);
    if (e < SHORT.length) return sig(n / Math.pow(1000, e), 3) + ' ' + SHORT[e];
    return sci(n, 3);
  };
  U.pct = (v, d = 0) => U.trimDec(v * 100, d) + ' %';
  U.mult = (v) => '×' + (v >= 100 ? U.num(v) : U.trimDec(v, v < 10 ? 2 : 1));

  U.dur = (sec) => {
    sec = Math.max(0, Math.floor(sec));
    if (sec < 60) return sec + ' s';
    const m = Math.floor(sec / 60), s = sec % 60;
    if (m < 60) return m + ' min' + (s ? ' ' + s + ' s' : '');
    const h = Math.floor(m / 60), mm = m % 60;
    if (h < 24) return h + ' h' + (mm ? ' ' + mm + ' min' : '');
    const d = Math.floor(h / 24), hh = h % 24;
    if (d < 365) return d + ' T' + (hh ? ' ' + hh + ' h' : '');
    const y = Math.floor(d / 365);
    return y + ' J ' + (d % 365) + ' T';
  };
  U.clockDur = (sec) => {
    sec = Math.max(0, Math.ceil(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  };

  /* ---------- Speicher ---------- */
  U.store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* egal */ } },
  };

  // UTF-8-sicheres Base64
  U.b64enc = (str) => {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  };
  U.b64dec = (b64) => {
    const bin = atob(b64.trim());
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  };

  /* ---------- Event-Bus ---------- */
  const handlers = {};
  DH.bus = {
    on(ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); },
    emit(ev, ...args) { const hs = handlers[ev]; if (hs) for (const fn of hs) { try { fn(...args); } catch (e) { console.error(ev, e); } } },
  };

  U.isTouch = () => (typeof window !== 'undefined') && window.matchMedia && window.matchMedia('(hover: none)').matches;
  U.reducedMotion = () => (typeof window !== 'undefined') && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
})();
