'use strict';
/* DistroHopper – Spiellogik (ohne DOM, damit sie auch in Node simuliert werden kann) */
(function () {
  const D = DH.data;
  const SAVE_KEY = 'distrohopper-save-v1';
  const HOP_DIV = 1e9;
  const COST_GROWTH = 1.15;

  const G = DH.game = {
    S: null,
    HOP_DIV, BEARD_K: 0.25, BEARD_EXP: 0.6, CF_MULT: 77, HA: 0.7, HB: 0.61, HL0: 8,
    // abgeleitete Werte
    bps: 0, bpsBase: 0, click: 1, prodMult: 1, perUnit: {}, bCostMult: 1, uCostMult: 1,
    totalBuildings: 0, upgradesOwned: 0, clickPct: 0, duckFreq: 1, duckPow: 1, duckLife: 1, buffDur: 1,
    bugMult: 1, bugFreq: 1, ircFreq: 1, ircMult: 1, quizMult: 1, offlineEff: 0.25, offlineCap: 24, hopMult: 1,
    achMult: 1, beardMult: 1, positiveBuffs: 0, keep: 0, nAch: 0, gentooMult: 1, flags: {},
    prodBuff: 1, clickBuff: 1,
  };

  /* ================================================================ Zustand */
  function newState() {
    const now = Date.now();
    const b = {};
    D.buildings.forEach((x) => { b[x.id] = 0; });
    return {
      v: 1,
      bytes: 0, runBytes: 0, allBytes: 0,
      b,
      u: {},
      choices: {},
      ach: {},
      distro: 'ubuntu',
      visited: { ubuntu: 1 },
      unlocked: {},
      hops: 0,
      beard: 0, beardBase: 0, karma: 0,
      dotfiles: {},
      buffs: [],
      secrets: {},
      runClicks: 0,
      runStart: now,
      lastRunB: {},
      won: false,
      seen: {},
      tut: {},
      daily: { last: '', streak: 0, best: 0 },
      stats: {
        clicks: 0, clickBytes: 0, ducks: 0, bugs: 0, irc: 0, quizRight: 0, quizWrong: 0, playTime: 0,
        btw: 0, updates: 0, tuxPokes: 0, bestHop: 0, fastHop: false, night: false, longAway: false,
        bulk100: false, buyAllUsed: false, maxBps: 0, startTime: now, upgradesBought: 0, buildingsBought: 0,
        hairsTotal: 0,
      },
      settings: {
        sound: true, vol: 0.55, keySound: 'rubber', notation: 'si', particles: true, shake: true, vibrate: true,
        keysAsClicks: true, scheme: 'distro', hat: 'auto', autoUpg: false, autoBld: false, qty: '1', news: true, crt: true, music: false, mvol: 0.4, bestDeal: true,
      },
      lastSave: now,
    };
  }
  G.newState = newState;

  function merge(def, src) {
    if (!src || typeof src !== 'object') return def;
    for (const k in def) {
      if (!(k in src)) continue;
      const dv = def[k], sv = src[k];
      if (dv && typeof dv === 'object' && !Array.isArray(dv)) def[k] = merge(dv, sv);
      else def[k] = sv;
    }
    // zusätzliche Schlüssel in Maps übernehmen (u, ach, visited …)
    for (const k in src) if (!(k in def)) def[k] = src[k];
    return def;
  }

  /* ================================================================ Laden/Speichern */
  G.load = () => {
    const raw = DH.util.store.get(SAVE_KEY);
    G.S = newState();
    if (raw) {
      try { G.S = merge(newState(), JSON.parse(raw)); } catch (e) { console.warn('Spielstand defekt', e); }
    }
    sanitize();
    G.recalc();
    return !!raw;
  };
  G.loadFrom = (obj) => { G.S = merge(newState(), obj); sanitize(); G.recalc(); };
  function sanitize() {
    const S = G.S;
    if (!D.dIndex[S.distro]) S.distro = 'ubuntu';
    for (const k of ['bytes', 'runBytes', 'allBytes', 'beard', 'karma', 'beardBase']) if (!isFinite(S[k]) || S[k] < 0) S[k] = 0;
    D.buildings.forEach((x) => { if (!isFinite(S.b[x.id])) S.b[x.id] = 0; });
    S.buffs = (S.buffs || []).filter((b) => b && b.end > Date.now());
  }
  G.save = () => {
    if (!G.S) return false;
    G.S.lastSave = Date.now();
    return DH.util.store.set(SAVE_KEY, JSON.stringify(G.S));
  };
  G.exportSave = () => 'DH1:' + DH.util.b64enc(JSON.stringify(G.S));
  G.importSave = (str) => {
    str = String(str || '').trim();
    if (str.startsWith('DH1:')) str = str.slice(4);
    const obj = JSON.parse(DH.util.b64dec(str));
    if (!obj || typeof obj !== 'object' || !('bytes' in obj)) throw new Error('Kein gültiger Spielstand');
    G.loadFrom(obj);
    G.save();
  };
  G.wipe = (keepSettings) => {
    const settings = G.S && G.S.settings;
    G.S = newState();
    if (keepSettings && settings) G.S.settings = settings;
    G.recalc();
    G.save();
  };

  /* ================================================================ Abgeleitete Werte */
  G.distro = () => D.dIndex[G.S.distro];
  // Besuchte reguläre Distros (geheime zählen nicht für Ziele)
  G.visitedCount = () => Object.keys(G.S.visited).filter((k) => D.dIndex[k] && !D.dIndex[k].secret).length;
  G.runSeconds = () => (Date.now() - G.S.runStart) / 1000;

  G.recalc = () => {
    const S = G.S;
    const dist = D.dIndex[S.distro];
    const dm = dist.mods || {};
    const f = G.flags = {};

    // Dotfiles
    let dfClick = 1, dfClickPct = 0, dfProd = 1, dfB = 1, dfU = 1, beardEff = 1, achEffAdd = 0, offline = 0.25, offlineCap = 24;
    let duckFreq = 1, buffDur = 1, duckLife = 1, ircFreq = 1, ircMult = 1, bugMult = 1, quizMult = 1, hopMult = 1, keep = 0;
    for (const id in S.dotfiles) {
      const d = D.dfIndex[id];
      if (!d || !d.eff) continue;
      const e = d.eff;
      if (e.click) dfClick *= e.click;
      if (e.clickPct) dfClickPct += e.clickPct;
      if (e.prod) dfProd *= e.prod;
      if (e.bCost) dfB *= e.bCost;
      if (e.uCost) dfU *= e.uCost;
      if (e.beardEff) beardEff += e.beardEff;
      if (e.achEff) achEffAdd += e.achEff;
      if (e.offline) offline += e.offline;
      if (e.offlineCap) offlineCap = Math.max(offlineCap, e.offlineCap);
      if (e.duckFreq) duckFreq *= e.duckFreq;
      if (e.buffDur) buffDur *= e.buffDur;
      if (e.duckLife) duckLife *= e.duckLife;
      if (e.ircFreq) ircFreq *= e.ircFreq;
      if (e.ircMult) ircMult *= e.ircMult;
      if (e.bugMult) bugMult *= e.bugMult;
      if (e.quizMult) quizMult *= e.quizMult;
      if (e.hopMult) hopMult *= e.hopMult;
      if (e.keep) keep += e.keep;
      if (e.buyAll) f.buyAll = true;
      if (e.autoUpg) f.autoUpg = true;
      if (e.autoBld) f.autoBld = true;
      if (e.prompt) f.prompt = true;
    }

    // Upgrades
    const tiers = {};
    let prodUp = 1, clickMult = 1, clickPct = 0, cats = 0, bugFreq = 1, swClick = 1, swProd = 1, swCost = 1, swB = 1, swU = 1, swAch = 1;
    const syns = [];
    let owned = 0;
    for (const id in S.u) {
      const u = D.uIndex[id];
      if (!u) continue;
      owned++;
      switch (u.type) {
        case 'tier': tiers[u.b] = (tiers[u.b] || 0) + 1; break;
        case 'syn': syns.push(u); break;
        case 'click': if (u.mult) clickMult *= u.mult; if (u.pct) clickPct += u.pct; break;
        case 'prod': prodUp *= 1 + u.add; break;
        case 'cat': cats += u.add; break;
        case 'duck': if (u.freq) duckFreq *= u.freq; if (u.dur) buffDur *= u.dur; if (u.pow) f.duckPowUp = (f.duckPowUp || 1) * u.pow; break;
        case 'bug': if (u.bugMult) bugMult *= u.bugMult; if (u.bugFreq) bugFreq *= u.bugFreq; break;
        case 'switch': {
          const e = u.eff;
          if (e.click) swClick *= e.click;
          if (e.prod) swProd *= e.prod;
          if (e.cost) swCost *= e.cost;
          if (e.bCost) swB *= e.bCost;
          if (e.uCost) swU *= e.uCost;
          if (e.buffDur) buffDur *= e.buffDur;
          if (e.duckFreq) duckFreq *= e.duckFreq;
          if (e.achEff) swAch *= e.achEff;
          if (e.ircMult) ircMult *= e.ircMult;
          break;
        }
        default: break;
      }
    }
    G.upgradesOwned = owned;

    // Gebäude
    const noSyn = dist.special === 'nosyn';
    let raw = 0, total = 0;
    for (const b of D.buildings) {
      let m = Math.pow(2, tiers[b.id] || 0);
      if (!noSyn) {
        for (const s of syns) {
          if (s.a === b.id) m *= 1 + 0.05 * S.b[s.b];
          if (s.b === b.id) m *= 1 + 0.001 * S.b[s.a];
        }
      }
      G.perUnit[b.id] = b.bps * m;
      raw += G.perUnit[b.id] * S.b[b.id];
      total += S.b[b.id];
    }
    G.totalBuildings = total;

    // Globale Multiplikatoren
    const nAch = Object.keys(S.ach).length;
    G.nAch = nAch;
    G.achMult = 1 + nAch * 0.01 * (1 + cats) * (1 + achEffAdd) * swAch;
    G.beardMult = 1 + G.BEARD_K * Math.pow(S.beard, G.BEARD_EXP) * beardEff;
    G.gentooMult = dist.special === 'gentoo' ? Math.min(6, 0.5 + 0.04 * (G.runSeconds() / 60)) : 1;
    G.prodMult = prodUp * (dm.prod || 1) * swProd * dfProd * G.achMult * G.beardMult * G.gentooMult * (S.won ? 2 : 1);
    G.bpsBase = raw * G.prodMult;

    // Buffs
    let pb = 1, cb = 1, pos = 0;
    const now = Date.now();
    for (const bf of S.buffs) {
      if (bf.end <= now) continue;
      if (bf.kind === 'click') cb *= bf.mult; else pb *= bf.mult;
      if (bf.mult > 1) pos++;
    }
    G.prodBuff = pb; G.clickBuff = cb; G.positiveBuffs = pos;
    G.bps = G.bpsBase * pb;

    G.clickPct = clickPct + dfClickPct;
    G.clickMultTotal = clickMult * (dm.click || 1) * swClick * dfClick;
    G.click = (G.clickMultTotal + G.bps * G.clickPct) * cb;

    G.bCostMult = (dm.bCost || 1) * dfB * swB * swCost;
    G.uCostMult = (dm.uCost || 1) * dfU * swU * swCost;
    G.duckFreq = (dm.duckFreq || 1) * duckFreq;
    G.duckPow = (dm.duckPow || 1) * (f.duckPowUp || 1);
    G.duckLife = duckLife;
    G.buffDur = (dm.buffDur || 1) * buffDur;
    G.bugMult = bugMult;
    G.bugFreq = (dm.bugFreq || 1) * bugFreq;
    G.ircFreq = (dm.ircFreq || 1) * ircFreq;
    G.ircMult = ircMult;
    G.quizMult = quizMult;
    G.offlineEff = offline * (dm.offline || 1);
    G.offlineCap = offlineCap;
    G.hopMult = (dm.hopMult || 1) * hopMult;
    G.keep = keep;
  };

  /* ================================================================ Einnahmen */
  function earn(n) {
    if (!(n > 0) || !isFinite(n)) return;
    const S = G.S;
    S.bytes += n; S.runBytes += n; S.allBytes += n;
  }
  G.earn = earn;

  G.doClick = () => {
    const v = G.click;
    earn(v);
    const st = G.S.stats;
    st.clicks++; st.clickBytes += v;
    G.S.runClicks++;
    return v;
  };

  /* ================================================================ Gebäude */
  G.bCost = (id, n = 1) => {
    const b = D.bIndex[id];
    const owned = G.S.b[id];
    const base = b.cost * G.bCostMult * Math.pow(COST_GROWTH, owned);
    return base * (Math.pow(COST_GROWTH, n) - 1) / (COST_GROWTH - 1);
  };
  G.maxBuy = (id) => {
    const b = D.bIndex[id];
    const base = b.cost * G.bCostMult * Math.pow(COST_GROWTH, G.S.b[id]);
    if (G.S.bytes < base) return 0;
    return Math.floor(Math.log(G.S.bytes * (COST_GROWTH - 1) / base + 1) / Math.log(COST_GROWTH));
  };
  G.qtyFor = (id, qty) => {
    if (qty === 'max') return Math.max(1, G.maxBuy(id));
    return +qty || 1;
  };
  G.revealed = (b) => G.S.b[b.id] > 0 || G.S.runBytes >= b.cost * G.bCostMult * 0.4 || G.S.bytes >= b.cost * G.bCostMult * 0.4;
  G.buyBuilding = (id, n) => {
    n = Math.max(1, Math.floor(n));
    const cost = G.bCost(id, n);
    if (G.S.bytes < cost) return 0;
    G.S.bytes -= cost;
    G.S.b[id] += n;
    G.S.stats.buildingsBought += n;
    if (n >= 100) G.S.stats.bulk100 = true;
    G.recalc();
    DH.bus.emit('building', id, n);
    return n;
  };

  /* ================================================================ Upgrades */
  G.uCost = (u) => u.cost * G.uCostMult;
  G.upgradeVisible = (u) => {
    const S = G.S;
    if (S.u[u.id]) return false;
    switch (u.type) {
      case 'tier': return S.b[u.b] >= u.need;
      case 'syn': return S.b[u.a] >= u.need && S.b[u.b] >= u.need;
      case 'switch': if (S.choices[u.group]) return false; break;
      case 'final': if (S.won) return false; break;
      default: break;
    }
    const un = u.unl;
    if (!un) return true;
    if (un.req && !S.u[un.req]) return false;
    if (un.clicks != null && S.stats.clicks < un.clicks) return false;
    if (un.bytes != null && S.runBytes < un.bytes) return false;
    if (un.ach != null && G.nAch < un.ach) return false;
    if (un.ducks != null && S.stats.ducks < un.ducks) return false;
    if (un.bugs != null && S.stats.bugs < un.bugs) return false;
    if (un.beard != null && S.beard < un.beard) return false;
    if (un.visited != null && G.visitedCount() < un.visited) return false;
    return true;
  };
  G.visibleUpgrades = () => D.upgrades.filter(G.upgradeVisible).sort((a, b) => G.uCost(a) - G.uCost(b));
  G.buyUpgrade = (id) => {
    const u = D.uIndex[id];
    if (!u || G.S.u[id] || !G.upgradeVisible(u)) return false;
    const cost = G.uCost(u);
    if (G.S.bytes < cost) return false;
    G.S.bytes -= cost;
    G.S.u[id] = 1;
    G.S.stats.upgradesBought++;
    G.S.stats['had_' + id] = 1;
    if (u.type === 'switch') G.S.choices[u.group] = u.id;
    if (u.type === 'final') G.S.won = true;
    G.recalc();
    DH.bus.emit('upgrade', u);
    if (u.type === 'final') DH.bus.emit('won');
    return true;
  };
  G.buyAllUpgrades = () => {
    let n = 0;
    for (const u of G.visibleUpgrades()) {
      if (u.type === 'switch' || u.type === 'final') continue;
      if (G.S.bytes >= G.uCost(u) && G.buyUpgrade(u.id)) n++;
    }
    return n;
  };

  /* ================================================================ Buffs */
  G.addBuff = (bf) => {
    const now = Date.now();
    const good = bf.mult >= 1;
    const dur = bf.dur * (good && !bf.fixed ? G.buffDur : 1);
    const ex = G.S.buffs.find((x) => x.id === bf.id && x.end > now);
    if (ex) {
      ex.end = Math.max(ex.end, now + dur * 1000);
      ex.dur = (ex.end - now) / 1000;
      ex.mult = Math.max(ex.mult, bf.mult);
    } else {
      G.S.buffs.push({ id: bf.id, name: bf.name, kind: bf.kind || 'prod', mult: bf.mult, end: now + dur * 1000, dur, icon: bf.icon || null });
    }
    G.recalc();
    DH.bus.emit('buff', bf);
  };
  G.hasBuff = (id) => G.S.buffs.some((b) => b.id === id && b.end > Date.now());
  G.clearBuffs = () => { G.S.buffs = []; G.recalc(); };

  /* ================================================================ Enten, Bugs, IRC, Quiz */
  G.duckEffect = (type) => {
    const S = G.S;
    const pow = G.duckPow;
    switch (type) {
      case 'lucky': {
        const v = (Math.max(Math.min(S.bytes * 0.15, G.bps * 900), G.bps * 60) + 13) * pow;
        earn(v);
        return { amount: v };
      }
      case 'frenzy':
        G.addBuff({ id: 'frenzy', name: 'Koffein-Rausch', kind: 'prod', mult: 7, dur: 77 * pow, icon: 'coffee' });
        return {};
      case 'clickfrenzy':
        G.addBuff({ id: 'clickfrenzy', name: 'Flow-Zustand', kind: 'click', mult: G.CF_MULT, dur: 13 * pow, icon: 'key' });
        return {};
      case 'special': {
        const cands = D.buildings.filter((b) => S.b[b.id] >= 10);
        if (!cands.length) return Object.assign(G.duckEffect('frenzy'), { fallback: 'frenzy' });
        const b = cands[Math.floor(Math.random() * cands.length)];
        const m = 1 + S.b[b.id] * 0.1;
        G.addBuff({ id: 'special', name: b.name + ' geht viral', kind: 'prod', mult: m, dur: 30 * pow, icon: b.id });
        return { building: b, mult: m };
      }
      default: return {};
    }
  };
  G.bugReward = () => Math.max(G.bpsBase * 15, (G.click / G.clickBuff) * 12, 5) * G.bugMult;
  G.lump = (sec) => Math.max(G.bpsBase * sec, (G.click / G.clickBuff) * Math.max(10, sec / 4), sec / 10 + 5);

  /* ================================================================ Hop (Prestige) */
  // Barthaare: im Log-Raum konkav -> früh großzügig, spät stark gedämpft
  G.hairsFor = (all) => {
    const x = Math.log10(Math.max(all, 1)) - G.HL0;
    if (x < 0) return 0;
    return Math.floor(Math.pow(10, G.HA * Math.pow(x, G.HB)) + 1e-9);
  };
  G.bytesForHairs = (h) => (h <= 1 ? Math.pow(10, G.HL0) : Math.pow(10, Math.pow(Math.log10(h) / G.HA, 1 / G.HB) + G.HL0));
  G.pendingHairs = () => Math.max(0, G.hairsFor(G.S.allBytes) - G.S.beardBase);
  G.hopGain = () => Math.floor(G.pendingHairs() * G.hopMult);
  G.canHop = () => G.pendingHairs() >= 1;
  // Freischaltung zählt den anstehenden Hop-Gewinn mit: „nach diesem Hop hast du genug Bart“
  G.distroUnlocked = (d) => (d.secret ? !!G.S.unlocked[d.id] || d.id === 'windows' : G.S.beard + G.hopGain() >= d.need);

  G.hop = (target) => {
    const S = G.S;
    const d = D.dIndex[target];
    if (!d || !G.distroUnlocked(d)) return false;
    const pend = G.pendingHairs();
    const gain = G.hopGain();
    const runSec = G.runSeconds();
    S.beardBase += pend;
    S.beard += gain;
    S.karma += gain;
    S.stats.hairsTotal += gain;
    S.stats.bestHop = Math.max(S.stats.bestHop, gain);
    if (gain > 0 && runSec < 600 && S.hops > 0) S.stats.fastHop = true;
    const prevB = Object.assign({}, S.b);
    const from = S.distro;
    S.lastRunB = prevB;
    S.hopLog = (S.hopLog || []).concat([{ n: S.hops + 1, from, to: target, gain, sec: Math.round(runSec), bytes: S.runBytes, t: Date.now() }]).slice(-12);
    // Reset
    S.bytes = 0; S.runBytes = 0; S.runClicks = 0; S.runStart = Date.now();
    D.buildings.forEach((b) => { S.b[b.id] = 0; });
    S.u = {}; S.choices = {}; S.buffs = S.buffs.filter((b) => b.id === 'daily' && b.end > Date.now());
    S.distro = target;
    S.visited[target] = (S.visited[target] || 0) + 1;
    S.hops++;
    G.recalc();
    // Startbonus
    const start = {};
    for (const id in S.dotfiles) {
      const e = (D.dfIndex[id] || {}).eff;
      if (e && e.start) for (const k in e.start) start[k] = (start[k] || 0) + e.start[k];
    }
    const keepFrac = G.keep + (d.special === 'nix' ? 0.15 : 0);
    if (keepFrac > 0) for (const k in prevB) start[k] = (start[k] || 0) + Math.floor(prevB[k] * keepFrac);
    for (const k in start) if (S.b[k] != null) S.b[k] += start[k];
    G.recalc();
    // Frische Installation: alles läuft flott
    G.addBuff({ id: 'fresh', name: 'Frisch installiert', kind: 'prod', mult: 2.5, dur: 180, fixed: true, icon: 'disc' });
    DH.bus.emit('hop', { from, to: target, gain });
    return gain;
  };

  G.buyDotfile = (id) => {
    const d = D.dfIndex[id];
    const S = G.S;
    if (!d || d.dir || S.dotfiles[id]) return false;
    if (!G.dotfileAvailable(d)) return false;
    if (S.karma < d.cost) return false;
    S.karma -= d.cost;
    S.dotfiles[id] = 1;
    G.recalc();
    DH.bus.emit('dotfile', d);
    return true;
  };
  G.dotfileAvailable = (d) => {
    let p = d.parent ? D.dfIndex[d.parent] : null;
    while (p) {
      if (!p.dir && !G.S.dotfiles[p.id]) return false;
      p = p.parent ? D.dfIndex[p.parent] : null;
    }
    return true;
  };

  /* ================================================================ Täglicher Bonus */
  // Einmal pro Kalendertag: Buff, der mit der Serie aufeinanderfolgender Tage wächst.
  G.dailyCheck = () => {
    const S = G.S;
    const d = new Date();
    const key = (x) => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
    const today = key(d);
    if (S.daily.last === today) return null;
    const y = new Date(d); y.setDate(d.getDate() - 1);
    S.daily.streak = S.daily.last === key(y) ? S.daily.streak + 1 : 1;
    S.daily.best = Math.max(S.daily.best || 0, S.daily.streak);
    const first = !S.daily.last;
    S.daily.last = today;
    const mult = 1.5 + 0.1 * Math.min(S.daily.streak - 1, 15);
    if (!first) G.addBuff({ id: 'daily', name: 'Tägliches Update', kind: 'prod', mult, dur: 900, fixed: true, icon: 'box' });
    return { streak: S.daily.streak, mult, first };
  };

  /* ================================================================ Erfolge */
  G.checkAchievements = () => {
    const S = G.S;
    const fresh = [];
    for (const a of D.achievements) {
      if (S.ach[a.id]) continue;
      let ok = false;
      try { ok = a.check(S, G); } catch (e) { ok = false; }
      if (ok) { S.ach[a.id] = Date.now(); fresh.push(a); }
    }
    if (fresh.length) {
      G.recalc();
      fresh.forEach((a) => DH.bus.emit('achievement', a));
    }
    return fresh;
  };
  G.secret = (id) => {
    if (G.S.secrets[id]) return false;
    G.S.secrets[id] = Date.now();
    G.checkAchievements();
    return true;
  };

  /* ================================================================ Auto-Kauf */
  G.autoBuy = () => {
    const S = G.S;
    let did = false;
    if (G.flags.autoUpg && S.settings.autoUpg) {
      if (G.buyAllUpgrades() > 0) did = true;
    }
    if (G.flags.autoBld && S.settings.autoBld) {
      for (let i = 0; i < 60; i++) {
        let best = null, bestP = Infinity;
        for (const b of D.buildings) {
          if (!G.revealed(b)) continue;
          const gain = G.perUnit[b.id] * G.prodMult;
          const p = G.bCost(b.id) / Math.max(gain, 1e-12);
          if (p < bestP) { bestP = p; best = b; }
        }
        let pick = null, pickP = Infinity;
        for (const b of D.buildings) {
          if (!G.revealed(b)) continue;
          const c = G.bCost(b.id);
          if (c > S.bytes) continue;
          const p = c / Math.max(G.perUnit[b.id] * G.prodMult, 1e-12);
          if (p <= bestP * 1.6 && p < pickP) { pickP = p; pick = b; }
        }
        if (!pick) break;
        G.buyBuilding(pick.id, 1);
        did = true;
      }
    }
    return did;
  };

  /* ================================================================ Tick */
  let feeTimer = 0, recalcTimer = 0;
  G.tick = (dt) => {
    const S = G.S;
    if (!(dt > 0)) return;
    S.stats.playTime += dt;
    // Buffs ablaufen lassen
    const now = Date.now();
    if (S.buffs.length) {
      const before = S.buffs.length;
      const ended = S.buffs.filter((b) => b.end <= now);
      if (ended.length) {
        S.buffs = S.buffs.filter((b) => b.end > now);
        G.recalc();
        ended.forEach((b) => DH.bus.emit('buffEnd', b));
      } else if (before) { /* nichts */ }
    }
    // Gentoo: zeitabhängig
    recalcTimer += dt;
    if (recalcTimer >= 2) { recalcTimer = 0; if (G.distro().special === 'gentoo') G.recalc(); }
    earn(G.bps * dt);
    if (G.bpsBase > S.stats.maxBps) S.stats.maxBps = G.bpsBase;
    // RHEL-Abo
    if (G.distro().special === 'subscription') {
      feeTimer += dt;
      if (feeTimer >= 60) {
        feeTimer = 0;
        const fee = Math.min(S.bytes * 0.01, G.bpsBase * 30);
        if (fee > 0) { S.bytes -= fee; DH.bus.emit('fee', fee); }
      }
    }
  };

  // Offline-Ertrag berechnen (ohne Buffs)
  G.offlineGain = (sec) => {
    const capped = Math.min(sec, G.offlineCap * 3600);
    const saved = G.S.buffs; G.S.buffs = []; G.recalc();
    const v = G.bpsBase * capped * G.offlineEff;
    G.S.buffs = saved; G.recalc();
    return { gain: v, capped, eff: G.offlineEff };
  };
})();
